interface FindHelpHeroProps {
  title: string;
  subtitle: string;
}

export function FindHelpHero({ title, subtitle }: FindHelpHeroProps) {
  return (
    <section className="flex w-full flex-col gap-8 text-start">
      <h1 className="text-2xl font-weight-bold text-text-black md:text-3xl">
        {title}
      </h1>
      <p className="max-w-[640px] text-xs font-weight-regular text-solid-black-500 md:text-sm">
        {subtitle}
      </p>
    </section>
  );
}
