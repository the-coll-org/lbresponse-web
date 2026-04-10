import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Alert } from './ui/Alert';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { TextArea } from './ui/TextArea';
import { TextField } from './ui/TextField';

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
  return (
    <section className="flex flex-col gap-32 p-32">
      <h2 className="text-xl font-weight-semibold text-text-black">
        Button Component Showcase
      </h2>

      {/* ── Filled ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">
          Filled buttons
        </p>
        <div className="flex flex-wrap items-center gap-12">
          {/* md — with icons */}
          <Button
            variant="filled"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            Button
          </Button>
          {/* md — disabled */}
          <Button
            variant="filled"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            disabled
          >
            Button
          </Button>
          {/* arabic — md */}
          <Button
            variant="filled"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            dir="rtl"
          >
            ماضق
          </Button>
          {/* arabic — disabled */}
          <Button
            variant="filled"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            dir="rtl"
            disabled
          >
            ماضق
          </Button>
        </div>

        {/* sm row */}
        <div className="flex flex-wrap items-center gap-12">
          <Button
            variant="filled"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            Button
          </Button>
          <Button
            variant="filled"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            disabled
          >
            Button
          </Button>
          <Button
            variant="filled"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            dir="rtl"
          >
            ماضق
          </Button>
          <Button
            variant="filled"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            dir="rtl"
            disabled
          >
            ماضق
          </Button>
        </div>
      </div>

      {/* ── Tonal ──────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">
          Tonal buttons
        </p>
        <div className="flex flex-wrap items-center gap-12">
          <Button
            variant="tonal"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            Button
          </Button>
          <Button
            variant="tonal"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            disabled
          >
            Button
          </Button>
          <Button
            variant="tonal"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            dir="rtl"
          >
            ماضق
          </Button>
          <Button
            variant="tonal"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            dir="rtl"
            disabled
          >
            ماضق
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-12">
          <Button
            variant="tonal"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            Button
          </Button>
          <Button
            variant="tonal"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            disabled
          >
            Button
          </Button>
          <Button
            variant="tonal"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            dir="rtl"
          >
            ماضق
          </Button>
          <Button
            variant="tonal"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            dir="rtl"
            disabled
          >
            ماضق
          </Button>
        </div>
      </div>

      {/* ── Text ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">
          Text buttons
        </p>
        <div className="flex flex-wrap items-center gap-12">
          <Button
            variant="text"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            Button
          </Button>
          <Button
            variant="text"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            disabled
          >
            Button
          </Button>
          <Button
            variant="text"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            dir="rtl"
          >
            ماضق
          </Button>
          <Button
            variant="text"
            size="md"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            dir="rtl"
            disabled
          >
            ماضق
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-12">
          <Button
            variant="text"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            Button
          </Button>
          <Button
            variant="text"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            disabled
          >
            Button
          </Button>
          <Button
            variant="text"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            dir="rtl"
          >
            ماضق
          </Button>
          <Button
            variant="text"
            size="sm"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
            dir="rtl"
            disabled
          >
            ماضق
          </Button>
        </div>
      </div>

      {/* ── Icon ───────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">
          Icon buttons
        </p>
        <div className="flex flex-wrap items-center gap-12">
          <Button variant="icon" size="md" aria-label="Favorite">
            <StarIcon />
          </Button>
          <Button variant="icon" size="md" aria-label="Favorite" disabled>
            <StarIcon />
          </Button>
          <Button variant="icon" size="sm" aria-label="Favorite">
            <StarIcon />
          </Button>
          <Button variant="icon" size="sm" aria-label="Favorite" disabled>
            <StarIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}

// ─── TextArea showcase ───────────────────────────────────────────────────────

function TextAreaShowcase() {
  return (
    <section className="flex flex-col gap-32 p-32">
      <h2 className="text-xl font-weight-semibold text-text-black">
        Text Area Component Showcase
      </h2>

      <div className="flex flex-col gap-16">
        {/* Placeholder state */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            Placeholder
          </p>
          <div className="flex gap-16">
            <TextArea
              placeholder="Type your message here."
              style={{ width: '320px', height: '76px' }}
            />
            <TextArea
              placeholder="اكتب رسالتك هنا"
              dir="rtl"
              style={{ width: '320px', height: '76px' }}
            />
          </div>
        </div>

        {/* Value state */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">Value</p>
          <div className="flex gap-16">
            <TextArea
              defaultValue="Value"
              placeholder="placeholder"
              style={{ width: '320px', height: '76px' }}
            />
            <TextArea
              defaultValue="القيمة"
              placeholder="placeholder"
              dir="rtl"
              style={{ width: '320px', height: '76px' }}
            />
          </div>
        </div>

        {/* Error state */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">Error</p>
          <div className="flex gap-16">
            <TextArea
              defaultValue="Value"
              placeholder="placeholder"
              isError
              style={{ width: '320px', height: '76px' }}
            />
            <TextArea
              defaultValue="القيمة"
              placeholder="placeholder"
              isError
              dir="rtl"
              style={{ width: '320px', height: '76px' }}
            />
          </div>
        </div>

        {/* Disabled state */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">Disabled</p>
          <div className="flex gap-16">
            <TextArea
              placeholder="Disabled"
              disabled
              style={{ width: '320px', height: '76px' }}
            />
            <TextArea
              placeholder="معطل"
              disabled
              dir="rtl"
              style={{ width: '320px', height: '76px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Alert showcase ──────────────────────────────────────────────────────────

function AlertShowcase() {
  return (
    <section className="flex flex-col gap-32 p-32">
      <h2 className="text-xl font-weight-semibold text-text-black">
        Alert Component Showcase
      </h2>

      {/* Neutral — EN & AR */}
      <div className="flex flex-col gap-16">
        <p className="text-sm font-weight-medium text-text-black">Neutral</p>
        <div className="flex flex-col gap-12">
          <Alert heading="Heads up" style={{ width: '400px' }}>
            This response may take longer than expected.
          </Alert>
          <Alert heading="تنبيه" dir="rtl" style={{ width: '400px' }}>
            قد يستغرق هذا الرد وقتاً أطول من المتوقع.
          </Alert>
        </div>
      </div>

      {/* Error — EN & AR */}
      <div className="flex flex-col gap-16">
        <p className="text-sm font-weight-medium text-text-black">Error</p>
        <div className="flex flex-col gap-12">
          <Alert
            variant="error"
            heading="Request failed"
            style={{ width: '400px' }}
          >
            Please check your connection and try again.
          </Alert>
          <Alert
            variant="error"
            heading="فشل الطلب"
            dir="rtl"
            style={{ width: '400px' }}
          >
            يرجى التحقق من الاتصال والمحاولة مرة أخرى.
          </Alert>
        </div>
      </div>

      {/* With action button — matches Figma "Show Button=true" */}
      <div className="flex flex-col gap-16">
        <p className="text-sm font-weight-medium text-text-black">
          With action
        </p>
        <div className="flex flex-col gap-12">
          <Alert
            heading="Heads up"
            action={
              <Button variant="tonal" size="sm">
                Retry
              </Button>
            }
            style={{ width: '400px' }}
          >
            This response may take longer than expected.
          </Alert>
          <Alert
            variant="error"
            heading="Request failed"
            action={
              <Button variant="tonal" size="sm">
                Retry
              </Button>
            }
            style={{ width: '400px' }}
          >
            Please check your connection and try again.
          </Alert>
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
  return (
    <section className="flex flex-col gap-32 p-32">
      <h2 className="text-xl font-weight-semibold text-text-black">
        Text Field Component Showcase
      </h2>

      {/* ── Regular size (md) ─────────────────────────────────────────────── */}
      <div className="flex flex-col gap-16">
        <p className="text-sm font-weight-medium text-text-black">
          Regular size (md)
        </p>

        {/* Placeholder */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            Placeholder
          </p>
          <div className="flex gap-16">
            <TextField placeholder="Value" style={{ width: '320px' }} />
            <TextField
              placeholder="القيمة"
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>

        {/* Value */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">Value</p>
          <div className="flex gap-16">
            <TextField
              defaultValue="Value"
              placeholder="Placeholder"
              style={{ width: '320px' }}
            />
            <TextField
              defaultValue="القيمة"
              placeholder="Placeholder"
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>

        {/* Error */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">Error</p>
          <div className="flex gap-16">
            <TextField
              defaultValue="Value"
              placeholder="Placeholder"
              isError
              style={{ width: '320px' }}
            />
            <TextField
              defaultValue="القيمة"
              placeholder="Placeholder"
              isError
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>

        {/* Disabled */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">Disabled</p>
          <div className="flex gap-16">
            <TextField
              placeholder="Value"
              disabled
              style={{ width: '320px' }}
            />
            <TextField
              placeholder="القيمة"
              disabled
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>

        {/* With icons */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            With left icon
          </p>
          <div className="flex gap-16">
            <TextField
              placeholder="Search"
              leftIcon={<SearchIcon />}
              style={{ width: '320px' }}
            />
            <TextField
              placeholder="بحث"
              leftIcon={<SearchIcon />}
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            With right icon
          </p>
          <div className="flex gap-16">
            <TextField
              placeholder="Search"
              rightIcon={<SearchIcon />}
              style={{ width: '320px' }}
            />
            <TextField
              placeholder="بحث"
              rightIcon={<SearchIcon />}
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            With both icons
          </p>
          <div className="flex gap-16">
            <TextField
              placeholder="Search"
              leftIcon={<SearchIcon />}
              rightIcon={<SearchIcon />}
              style={{ width: '320px' }}
            />
            <TextField
              placeholder="بحث"
              leftIcon={<SearchIcon />}
              rightIcon={<SearchIcon />}
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            Error with icon
          </p>
          <div className="flex gap-16">
            <TextField
              defaultValue="Value"
              leftIcon={<SearchIcon />}
              isError
              style={{ width: '320px' }}
            />
            <TextField
              defaultValue="القيمة"
              leftIcon={<SearchIcon />}
              isError
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>
      </div>

      {/* ── Large size (lg) ───────────────────────────────────────────────── */}
      <div className="flex flex-col gap-16">
        <p className="text-sm font-weight-medium text-text-black">
          Large size (lg)
        </p>

        {/* Placeholder */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            Placeholder
          </p>
          <div className="flex gap-16">
            <TextField
              size="lg"
              placeholder="Value"
              style={{ width: '320px' }}
            />
            <TextField
              size="lg"
              placeholder="القيمة"
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>

        {/* Value */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">Value</p>
          <div className="flex gap-16">
            <TextField
              size="lg"
              defaultValue="Value"
              placeholder="Placeholder"
              style={{ width: '320px' }}
            />
            <TextField
              size="lg"
              defaultValue="القيمة"
              placeholder="Placeholder"
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>

        {/* Error */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">Error</p>
          <div className="flex gap-16">
            <TextField
              size="lg"
              defaultValue="Value"
              isError
              style={{ width: '320px' }}
            />
            <TextField
              size="lg"
              defaultValue="القيمة"
              isError
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>

        {/* Disabled */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">Disabled</p>
          <div className="flex gap-16">
            <TextField
              size="lg"
              placeholder="Value"
              disabled
              style={{ width: '320px' }}
            />
            <TextField
              size="lg"
              placeholder="القيمة"
              disabled
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>

        {/* With icons */}
        <div className="flex flex-col gap-4">
          <p className="text-xs font-weight-medium text-text-black">
            With both icons
          </p>
          <div className="flex gap-16">
            <TextField
              size="lg"
              placeholder="Search"
              leftIcon={<SearchIcon />}
              rightIcon={<SearchIcon />}
              style={{ width: '320px' }}
            />
            <TextField
              size="lg"
              placeholder="بحث"
              leftIcon={<SearchIcon />}
              rightIcon={<SearchIcon />}
              dir="rtl"
              style={{ width: '320px' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Badge showcase section ──────────────────────────────────────────────────

function BadgeShowcase() {
  return (
    <section className="flex flex-col gap-32 p-32">
      <h2 className="text-xl font-weight-semibold text-text-black">
        Badge Component Showcase
      </h2>

      {/* ── Variants ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">Variants</p>
        <div className="flex flex-wrap items-center gap-12">
          <Badge variant="primary">Primary</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
        </div>
      </div>

      {/* ── With icons ───────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">With icons</p>
        <div className="flex flex-wrap items-center gap-12">
          <Badge
            variant="primary"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            Primary
          </Badge>
          <Badge
            variant="secondary"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            Secondary
          </Badge>
          <Badge
            variant="outline"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            Outline
          </Badge>
          <Badge
            variant="destructive"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            Destructive
          </Badge>
        </div>
      </div>

      {/* ── RTL (Arabic) ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-12">
        <p className="text-sm font-weight-medium text-text-black">
          RTL (Arabic)
        </p>
        <div className="flex flex-wrap items-center gap-12" dir="rtl">
          <Badge
            variant="primary"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            أساسي
          </Badge>
          <Badge
            variant="secondary"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            ثانوي
          </Badge>
          <Badge
            variant="outline"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            مخطط
          </Badge>
          <Badge
            variant="destructive"
            leftIcon={<StarIcon />}
            rightIcon={<StarIcon />}
          >
            تحذيري
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
