type Level = 'debug' | 'info' | 'warn' | 'error';

const LEVELS: Record<Level, number> = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

const envLevelRaw =
  (import.meta.env.VITE_LOG_LEVEL as string | undefined) ??
  (import.meta.env.PROD ? 'warn' : 'debug');
const envLevel = envLevelRaw.toLowerCase() as Level;
const minLevel = LEVELS[envLevel] ?? LEVELS.info;

const release =
  (import.meta.env.VITE_RELEASE as string | undefined) ??
  (import.meta.env.PROD ? 'production' : 'dev');

function emit(level: Level, message: string, fields?: Record<string, unknown>) {
  if (LEVELS[level] < minLevel) return;
  const payload = {
    level,
    msg: message,
    ts: new Date().toISOString(),
    release,
    ...fields,
  };
  if (import.meta.env.PROD) {
    // Single-line JSON in prod so a downstream collector can parse it.

    console[level === 'debug' ? 'log' : level](JSON.stringify(payload));
  } else {
    console[level === 'debug' ? 'log' : level](
      `[${level}] ${message}`,
      fields ?? ''
    );
  }
}

export const logger = {
  debug: (message: string, fields?: Record<string, unknown>) =>
    emit('debug', message, fields),
  info: (message: string, fields?: Record<string, unknown>) =>
    emit('info', message, fields),
  warn: (message: string, fields?: Record<string, unknown>) =>
    emit('warn', message, fields),
  error: (message: string, fields?: Record<string, unknown>) =>
    emit('error', message, fields),
};

let lastReportedAt = 0;
const REPORT_THROTTLE_MS = 2000;

interface ClientErrorReport {
  message: string;
  stack?: string;
  url?: string;
  line?: number;
  column?: number;
  type?: string;
}

export async function reportClientError(report: ClientErrorReport) {
  const now = Date.now();
  if (now - lastReportedAt < REPORT_THROTTLE_MS) return;
  lastReportedAt = now;

  try {
    await fetch('/api/client-errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...report,
        userAgent:
          typeof navigator !== 'undefined' ? navigator.userAgent : undefined,
        release,
      }),
      keepalive: true,
    });
  } catch (err) {
    logger.warn('Failed to report client error', { err: String(err) });
  }
}

export function installGlobalErrorHandlers() {
  if (typeof window === 'undefined') return;

  window.addEventListener('error', (event) => {
    const error = event.error instanceof Error ? event.error : null;
    const message = event.message || error?.message || 'Unknown error';
    const stack = error?.stack;
    logger.error(message, {
      type: 'window.error',
      stack,
      url: event.filename,
      line: event.lineno,
      column: event.colno,
    });
    void reportClientError({
      type: 'window.error',
      message,
      stack,
      url: event.filename,
      line: event.lineno,
      column: event.colno,
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message =
      reason instanceof Error
        ? reason.message
        : typeof reason === 'string'
          ? reason
          : 'Unhandled promise rejection';
    const stack = reason instanceof Error ? reason.stack : undefined;
    logger.error(message, { type: 'unhandledrejection', stack });
    void reportClientError({
      type: 'unhandledrejection',
      message,
      stack,
    });
  });
}
