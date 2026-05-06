import { helpCenterIcons } from './helpCenter.icons';
import type { HelpCenterHotline } from './helpCenter.types';

interface EmergencyHotlinesSectionProps {
  title: string;
  hotlines: Array<HelpCenterHotline & { label: string }>;
}

function EmergencyShortcut({
  label,
  number,
  icon,
}: {
  label: string;
  number: string;
  icon: keyof typeof helpCenterIcons;
}) {
  const Icon = helpCenterIcons[icon];

  return (
    <a
      href={`tel:${number}`}
      aria-label={`${label}: ${number}`}
      className="flex flex-1 flex-col items-center gap-4 text-center no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
    >
      <div className="flex size-48 items-center justify-center rounded-md border border-textfield-default-stroke bg-surface-primary text-button-icon-icon">
        <Icon />
      </div>
      <p className="text-2xs font-weight-medium text-text-black">{label}</p>
      <p className="text-2xs font-weight-medium text-text-black">{number}</p>
    </a>
  );
}

export function EmergencyHotlinesSection({
  title,
  hotlines,
}: EmergencyHotlinesSectionProps) {
  return (
    <section className="flex flex-col gap-8">
      <h2 className="w-full text-start text-lg font-weight-medium text-text-black">
        {title}
      </h2>

      <div className="flex items-start justify-between gap-8">
        {hotlines.map((item) => (
          <EmergencyShortcut
            key={item.id}
            label={item.label}
            number={item.number}
            icon={item.icon}
          />
        ))}
      </div>
    </section>
  );
}
