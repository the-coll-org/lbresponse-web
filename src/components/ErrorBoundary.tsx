import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logger, reportClientError } from '../lib/logger';

interface ErrorBoundaryProps {
  fallback?: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    logger.error(error.message, {
      type: 'react.error-boundary',
      stack: error.stack,
      componentStack: info.componentStack,
    });
    void reportClientError({
      type: 'react.error-boundary',
      message: error.message,
      stack: error.stack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    if (this.props.fallback) return this.props.fallback;

    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-primary p-24 text-center">
        <div className="flex max-w-md flex-col items-center gap-12">
          <h1 className="text-lg font-weight-bold text-text-black">
            Something went wrong
          </h1>
          <p className="text-sm font-weight-regular text-solid-black-400">
            An unexpected error occurred. Please reload the page.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="inline-flex h-44 items-center justify-center rounded-md bg-button-filled-bg px-16 text-button font-weight-medium text-button-filled-text"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
