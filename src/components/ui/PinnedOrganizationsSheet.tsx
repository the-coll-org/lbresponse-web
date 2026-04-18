import { Badge } from './Badge';
import { BottomSheet } from './BottomSheet';
import { Button } from './Button';
import { SvgIcon } from './SvgIcon';
import favoriteSvg from '../../assets/help-center/favorite.svg?raw';

export interface PinnedOrganizationOption {
  id: string;
  title: string;
  category: string;
}

export interface PinnedOrganizationsSheetProps {
  open: boolean;
  title: string;
  description: string;
  closeAriaLabel: string;
  cancelLabel: string;
  replaceLabel: string;
  replaceAriaLabel: (organizationTitle: string) => string;
  pinnedOrganizations: PinnedOrganizationOption[];
  onOpenChange: (open: boolean) => void;
  onCancel: () => void;
  onReplace: (organizationId: string) => void;
}

function FavoriteIcon() {
  return <SvgIcon svg={favoriteSvg} className="size-[18px]" />;
}

export function PinnedOrganizationsSheet({
  open,
  title,
  description,
  closeAriaLabel,
  cancelLabel,
  replaceLabel,
  replaceAriaLabel,
  pinnedOrganizations,
  onOpenChange,
  onCancel,
  onReplace,
}: PinnedOrganizationsSheetProps) {
  return (
    <BottomSheet
      open={open}
      title={title}
      description={description}
      closeAriaLabel={closeAriaLabel}
      onOpenChange={onOpenChange}
      contentClassName="pb-12"
      footer={
        <div className="flex w-full flex-col items-center gap-12 pt-12">
          <div className="w-full border-t border-solid-black-300" />

          <div className="w-full px-16 pb-20">
            <Button
              variant="tonal"
              className="h-48 w-full justify-center"
              onClick={onCancel}
            >
              {cancelLabel}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex w-full flex-col gap-12">
        {pinnedOrganizations.map((organization) => (
          <article
            key={organization.id}
            className="flex w-full flex-col rounded-lg border border-textfield-default-stroke bg-surface-primary p-12"
          >
            <div className="flex w-full items-start justify-between gap-12">
              <div className="flex min-w-0 flex-1 items-center gap-12">
                <div className="flex h-40 w-9.5 shrink-0 items-center justify-center rounded-md border border-textfield-default-stroke bg-surface-primary text-text-black">
                  <FavoriteIcon />
                </div>

                <div className="flex min-w-0 flex-col text-start">
                  <div className="flex w-full flex-wrap items-center gap-8">
                    <p className="truncate text-sm font-weight-bold text-text-black">
                      {organization.title}
                    </p>
                    <Badge
                      variant="outline"
                      className="bg-surface-primary text-text-black"
                    >
                      {organization.category}
                    </Badge>
                  </div>
                </div>
              </div>

              <Button
                variant="destructive"
                className="h-40 shrink-0 self-start"
                onClick={() => onReplace(organization.id)}
                aria-label={replaceAriaLabel(organization.title)}
              >
                {replaceLabel}
              </Button>
            </div>
          </article>
        ))}
      </div>
    </BottomSheet>
  );
}
