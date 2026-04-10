import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from './ui/Alert';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { TextField } from './ui/TextField';
import { useToast } from '../hooks/useToast';

interface DashboardData {
  visuals: number;
  rows: number;
  pages: string[];
}

// Minimal inline star icon — no icon library dependency
function StarIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

// ─── Button showcase section ──────────────────────────────────────────────────

function ButtonShowcase() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col gap-32 p-32">
      <h2 className="text-xl font-weight-semibold text-text-black">
        {t('showcase.button.title')}
      </h2>

      {/* ── Filled ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">
          {t('showcase.button.filled')}
        </p>
        <div className="flex flex-wrap items-center gap-12">
          <Button
            variant="filled"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            {t('showcase.button.label')}
          </Button>
          <Button
            variant="filled"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            disabled
          >
            {t('showcase.button.label')}
          </Button>
          <Button
            variant="filled"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            {t('showcase.button.label')}
          </Button>
          <Button
            variant="filled"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            disabled
          >
            {t('showcase.button.label')}
          </Button>
        </div>
      </div>

      {/* ── Tonal ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">
          {t('showcase.button.tonal')}
        </p>
        <div className="flex flex-wrap items-center gap-12">
          <Button
            variant="tonal"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            {t('showcase.button.label')}
          </Button>
          <Button
            variant="tonal"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            disabled
          >
            {t('showcase.button.label')}
          </Button>
          <Button
            variant="tonal"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            {t('showcase.button.label')}
          </Button>
          <Button
            variant="tonal"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            disabled
          >
            {t('showcase.button.label')}
          </Button>
        </div>
      </div>

      {/* ── Text ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">
          {t('showcase.button.text')}
        </p>
        <div className="flex flex-wrap items-center gap-12">
          <Button
            variant="text"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            {t('showcase.button.label')}
          </Button>
          <Button
            variant="text"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            disabled
          >
            {t('showcase.button.label')}
          </Button>
          <Button
            variant="text"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            {t('showcase.button.label')}
          </Button>
          <Button
            variant="text"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            disabled
          >
            {t('showcase.button.label')}
          </Button>
        </div>
      </div>

      {/* ── Icon ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">
          {t('showcase.button.icon')}
        </p>
        <div className="flex flex-wrap items-center gap-12">
          <Button
            variant="icon"
            size="md"
            aria-label={t('showcase.button.ariaFavorite')}
          >
            <StarIcon />
          </Button>
          <Button
            variant="icon"
            size="md"
            aria-label={t('showcase.button.ariaFavorite')}
            disabled
          >
            <StarIcon />
          </Button>
          <Button
            variant="icon"
            size="sm"
            aria-label={t('showcase.button.ariaFavorite')}
          >
            <StarIcon />
          </Button>
          <Button
            variant="icon"
            size="sm"
            aria-label={t('showcase.button.ariaFavorite')}
            disabled
          >
            <StarIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── TextArea showcase ───────────────────────────────────────────────────────

function TextAreaShowcase() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col gap-32 p-32">
      <h2 className="text-xl font-weight-semibold text-text-black">
        {t('showcase.textarea.title')}
      </h2>

      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textarea.placeholder')}
          </p>
          <TextArea
            placeholder={t('showcase.textarea.placeholderText')}
            style={{ width: '320px', height: '76px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textarea.value')}
          </p>
          <TextArea
            defaultValue={t('showcase.textarea.valueText')}
            placeholder={t('showcase.textarea.placeholderText')}
            style={{ width: '320px', height: '76px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textarea.error')}
          </p>
          <TextArea
            defaultValue={t('showcase.textarea.valueText')}
            placeholder={t('showcase.textarea.placeholderText')}
            isError
            style={{ width: '320px', height: '76px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textarea.disabled')}
          </p>
          <TextArea
            placeholder={t('showcase.textarea.disabledText')}
            disabled
            style={{ width: '320px', height: '76px' }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Alert showcase ──────────────────────────────────────────────────────────

function AlertShowcase() {
  const { t } = useTranslation();
  const { addToast } = useToast();
  return (
    <section className="flex flex-col gap-32 p-32">
      <h2 className="text-xl font-weight-semibold text-text-black">
        {t('showcase.alert.title')}
      </h2>

      <div className="flex flex-col gap-16">
        <p className="text-sm font-weight-medium text-text-black">
          {t('showcase.alert.neutral')}
        </p>
        <Alert heading={t('showcase.alert.headsUp')} style={{ width: '400px' }}>
          {t('showcase.alert.neutralBody')}
        </Alert>
      </div>

      <div className="flex flex-col gap-16">
        <p className="text-sm font-weight-medium text-text-black">
          {t('showcase.alert.error')}
        </p>
        <Alert
          variant="error"
          heading={t('showcase.alert.requestFailed')}
          style={{ width: '400px' }}
        >
          {t('showcase.alert.errorBody')}
        </Alert>
      </div>

      <div className="flex flex-col gap-16">
        <p className="text-sm font-weight-medium text-text-black">
          {t('showcase.alert.withAction')}
        </p>
        <div className="flex flex-col gap-12">
          <Alert
            heading={t('showcase.alert.headsUp')}
            action={
              <Button variant="tonal" size="sm">
                {t('showcase.alert.retry')}
              </Button>
            }
            style={{ width: '400px' }}
          >
            {t('showcase.alert.neutralBody')}
          </Alert>
          <Alert
            variant="error"
            heading={t('showcase.alert.requestFailed')}
            action={
              <Button variant="tonal" size="sm">
                {t('showcase.alert.retry')}
              </Button>
            }
            style={{ width: '400px' }}
          >
            {t('showcase.alert.errorBody')}
          </Alert>
        </div>
      </div>

      <div className="flex flex-col gap-16">
        <p className="text-sm font-weight-medium text-text-black">
          {t('showcase.alert.toastSection')}
        </p>
        <div className="flex flex-wrap gap-12">
          <Button
            variant="tonal"
            onClick={() =>
              addToast({
                heading: t('showcase.alert.headsUp'),
                body: t('showcase.alert.neutralBody'),
              })
            }
          >
            {t('showcase.alert.showNeutral')}
          </Button>
          <Button
            variant="tonal"
            onClick={() =>
              addToast({
                variant: 'error',
                heading: t('showcase.alert.requestFailed'),
                body: t('showcase.alert.errorBody'),
              })
            }
          >
            {t('showcase.alert.showError')}
          </Button>
          <Button
            variant="tonal"
            onClick={() =>
              addToast({
                heading: t('showcase.alert.headsUp'),
                body: t('showcase.alert.neutralBody'),
                duration: 8000,
              })
            }
          >
            {t('showcase.alert.showWithAction')}
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── Shared icon for TextField examples ─────────────────────────────────────

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

// ─── TextField showcase ───────────────────────────────────────────────────────

function TextFieldShowcase() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col gap-32 p-32">
      <h2 className="text-xl font-weight-semibold text-text-black">
        {t('showcase.textfield.title')}
      </h2>

      {/* ── Regular size (md) ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-16">
        <p className="text-sm font-weight-medium text-text-black">
          {t('showcase.textfield.regularSize')}
        </p>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.placeholder')}
          </p>
          <TextField
            placeholder={t('showcase.textfield.valuePlaceholder')}
            style={{ width: '320px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.value')}
          </p>
          <TextField
            defaultValue={t('showcase.textfield.valuePlaceholder')}
            placeholder={t('showcase.textfield.placeholderText')}
            style={{ width: '320px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.error')}
          </p>
          <TextField
            defaultValue={t('showcase.textfield.valuePlaceholder')}
            placeholder={t('showcase.textfield.placeholderText')}
            isError
            style={{ width: '320px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.disabled')}
          </p>
          <TextField
            placeholder={t('showcase.textfield.valuePlaceholder')}
            disabled
            style={{ width: '320px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.withLeftIcon')}
          </p>
          <TextField
            placeholder={t('showcase.textfield.search')}
            leftIcon={<SearchIcon />}
            style={{ width: '320px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.withRightIcon')}
          </p>
          <TextField
            placeholder={t('showcase.textfield.search')}
            rightIcon={<SearchIcon />}
            style={{ width: '320px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.withBothIcons')}
          </p>
          <TextField
            placeholder={t('showcase.textfield.search')}
            leftIcon={<SearchIcon />}
            rightIcon={<SearchIcon />}
            style={{ width: '320px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.errorWithIcon')}
          </p>
          <TextField
            defaultValue={t('showcase.textfield.valuePlaceholder')}
            leftIcon={<SearchIcon />}
            isError
            style={{ width: '320px' }}
          />
        </div>
      </div>

      {/* ── Large size (lg) ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-16">
        <p className="text-sm font-weight-medium text-text-black">
          {t('showcase.textfield.largeSize')}
        </p>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.placeholder')}
          </p>
          <TextField
            size="lg"
            placeholder={t('showcase.textfield.valuePlaceholder')}
            style={{ width: '320px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.value')}
          </p>
          <TextField
            size="lg"
            defaultValue={t('showcase.textfield.valuePlaceholder')}
            placeholder={t('showcase.textfield.placeholderText')}
            style={{ width: '320px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.error')}
          </p>
          <TextField
            size="lg"
            defaultValue={t('showcase.textfield.valuePlaceholder')}
            isError
            style={{ width: '320px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.disabled')}
          </p>
          <TextField
            size="lg"
            placeholder={t('showcase.textfield.valuePlaceholder')}
            disabled
            style={{ width: '320px' }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            {t('showcase.textfield.withBothIcons')}
          </p>
          <TextField
            size="lg"
            placeholder={t('showcase.textfield.search')}
            leftIcon={<SearchIcon />}
            rightIcon={<SearchIcon />}
            style={{ width: '320px' }}
          />
        </div>
      </div>
    </section>
  );
}

// ─── Badge showcase section ──────────────────────────────────────────────────

function BadgeShowcase() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col gap-32 p-32">
      <h2 className="text-xl font-weight-semibold text-text-black">
        {t('showcase.badge.title')}
      </h2>

      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">
          {t('showcase.badge.variants')}
        </p>
        <div className="flex flex-wrap items-center gap-12">
          <Badge variant="primary">{t('showcase.badge.primary')}</Badge>
          <Badge variant="secondary">{t('showcase.badge.secondary')}</Badge>
          <Badge variant="outline">{t('showcase.badge.outline')}</Badge>
          <Badge variant="destructive">{t('showcase.badge.destructive')}</Badge>
        </div>
      </div>

      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">
          {t('showcase.badge.withIcons')}
        </p>
        <div className="flex flex-wrap items-center gap-12">
          <Badge
            variant="primary"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            {t('showcase.badge.primary')}
          </Badge>
          <Badge
            variant="secondary"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            {t('showcase.badge.secondary')}
          </Badge>
          <Badge
            variant="outline"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            {t('showcase.badge.outline')}
          </Badge>
          <Badge
            variant="destructive"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            {t('showcase.badge.destructive')}
          </Badge>
        </div>
      </div>
    </section>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

function Dashboard() {
  const { t } = useTranslation();
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json() as Promise<DashboardData>;
      })
      .then((json) => setData(json))
      .catch(() => setError(true));
  }, []);

  return (
    <div>
      <ButtonShowcase />
      <AlertShowcase />
      <TextAreaShowcase />
      <TextFieldShowcase />
      <BadgeShowcase />

      {error && <div className="table-error">{t('common.fetchError')}</div>}

      {data && (
        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="dashboard-card-value">{data.visuals}</div>
            <div className="dashboard-card-label">{t('dashboard.visuals')}</div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-value">{data.rows}</div>
            <div className="dashboard-card-label">
              {t('dashboard.totalRows')}
            </div>
          </div>
          <div className="dashboard-card">
            <div className="dashboard-card-value">{data.pages.length}</div>
            <div className="dashboard-card-label">{t('dashboard.pages')}</div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
