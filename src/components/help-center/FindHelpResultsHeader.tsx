interface FindHelpResultsHeaderProps {
  headline: string;
  liveLabel: string;
}

export function FindHelpResultsHeader({
  headline,
  liveLabel,
}: FindHelpResultsHeaderProps) {
  return (
    <div className="flex w-full flex-wrap items-baseline justify-between gap-12">
      <h2 className="text-md font-weight-bold text-text-black md:text-lg">
        {headline}
      </h2>
      <div className="inline-flex items-center gap-8 text-2xs font-weight-regular text-solid-black-400">
        <span
          aria-hidden="true"
          className="inline-block size-8 rounded-full bg-findhelp-success"
        />
        <span>{liveLabel}</span>
      </div>
    </div>
  );
}
