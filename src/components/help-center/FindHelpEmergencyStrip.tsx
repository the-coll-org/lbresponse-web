interface FindHelpEmergencyStripProps {
  label: string;
  hint: string;
  callLabel: string;
  callNumber: string;
}

function AlertIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-16 shrink-0"
      aria-hidden="true"
    >
      <path d="M12 4.5 21 19.5H3z" />
      <path d="M12 10v4" />
      <circle cx="12" cy="17" r=".6" fill="currentColor" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="size-14 shrink-0"
      aria-hidden="true"
    >
      <path d="M5 4h3l2 5-2 1a11 11 0 0 0 6 6l1-2 5 2v3a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

export function FindHelpEmergencyStrip({
  label,
  hint,
  callLabel,
  callNumber,
}: FindHelpEmergencyStripProps) {
  return (
    <div
      role="region"
      aria-label={label}
      className="flex w-full items-center gap-12 bg-findhelp-danger px-16 py-8 text-2xs font-weight-medium text-solid-white-400 md:px-32"
    >
      <AlertIcon />
      <div className="flex min-w-0 flex-1 items-baseline gap-8">
        <span className="font-weight-bold">{label}</span>
        <span className="hidden opacity-90 md:inline">{hint}</span>
      </div>
      <a
        href={`tel:${callNumber}`}
        className="inline-flex shrink-0 items-center gap-4 whitespace-nowrap rounded-md bg-surface-primary px-12 py-4 text-2xs font-weight-bold text-findhelp-danger focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
      >
        <PhoneIcon />
        <span>{callLabel}</span>
      </a>
    </div>
  );
}
