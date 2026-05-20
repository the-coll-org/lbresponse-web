import type { HotlineApiItem } from './helpCenter.types';

interface HotlinesListSectionProps {
  title: string;
  hotlines: HotlineApiItem[];
  activeLanguage: string;
}

export function HotlinesListSection({
  title,
  hotlines,
  activeLanguage,
}: HotlinesListSectionProps) {
  if (hotlines.length === 0) return null;

  const isArabic = activeLanguage.startsWith('ar');

  return (
    <section className="flex flex-col gap-8">
      <h2 className="w-full text-start text-lg font-weight-medium text-text-black">
        {title}
      </h2>

      <ul className="flex flex-col divide-y divide-textfield-default-stroke">
        {hotlines.map((item) => {
          const name = isArabic && item.name_ar ? item.name_ar : item.name_en;
          const contactNumber = item.hotline ?? item.phone;

          return (
            <li
              key={item.id}
              className="flex items-center justify-between gap-8 py-12"
            >
              <div className="flex min-w-0 flex-col gap-2">
                <span className="truncate text-sm font-weight-medium text-text-black">
                  {name}
                </span>
                <span className="text-2xs text-text-secondary">
                  {item.category}
                  {item.city ? ` · ${item.city}` : ''}
                </span>
              </div>

              <a
                href={`tel:${contactNumber}`}
                aria-label={`${name}: ${contactNumber}`}
                className="shrink-0 rounded-md border border-textfield-default-stroke px-12 py-6 text-xs font-weight-medium text-solid-primary-500 no-underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500"
              >
                {contactNumber}
              </a>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
