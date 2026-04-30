import { Button } from './Button';
import { BottomSheet } from './BottomSheet';
import { TextField } from './TextField';
import { SvgIcon } from './SvgIcon';
import flagLbSvg from '../../assets/help-center/flag-lb.svg?raw';
import chevronDownSvg from '../../assets/help-center/chevron-down.svg?raw';
import type {
  HelpCenterContactMode,
  HelpCenterOrganizationRequestErrors,
  HelpCenterOrganizationRequestField,
  HelpCenterOrganizationRequestFormValues,
  HelpCenterOrganizationType,
} from '../help-center/helpCenter.types';

interface RequestOption<T extends string> {
  value: T;
  label: string;
}

interface RequestOrganizationSheetCopy {
  title: string;
  closeAriaLabel: string;
  cancelLabel: string;
  submitLabel: string;
  submittingLabel: string;
  fields: {
    name: string;
    namePlaceholder: string;
    contact: string;
    contactPlaceholder: string;
    organizationType: string;
  };
}

interface RequestOrganizationSheetProps {
  open: boolean;
  copy: RequestOrganizationSheetCopy;
  submitError?: string;
  isSubmitting: boolean;
  values: HelpCenterOrganizationRequestFormValues;
  errors: HelpCenterOrganizationRequestErrors;
  organizationTypeOptions: RequestOption<HelpCenterOrganizationType>[];
  onOpenChange: (open: boolean) => void;
  onFieldChange: (
    field: HelpCenterOrganizationRequestField,
    value: string
  ) => void;
  onSelectOrganizationType: (value: HelpCenterOrganizationType) => void;
  onCancel: () => void;
  onSubmit: () => void;
}

function FieldLabel({ htmlFor, label }: { htmlFor: string; label: string }) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-button font-weight-medium text-text-black"
    >
      {label}
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-2xs font-weight-regular text-alert-error-text">
      {message}
    </p>
  );
}

function TypeTagGroup<T extends string>({
  legend,
  options,
  value,
  onChange,
}: {
  legend: string;
  options: RequestOption<T>[];
  value: T | '';
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex w-full flex-col gap-8">
      <span className="text-button font-weight-medium text-text-black">
        {legend}
      </span>

      <div role="group" aria-label={legend} className="flex flex-wrap gap-8">
        {options.map((option) => {
          const isSelected = option.value === value;

          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onChange(option.value)}
              className={[
                'inline-flex h-32 w-auto items-center rounded-md border px-8',
                'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-solid-primary-500',
                isSelected
                  ? 'border-solid-primary-400 bg-solid-primary-300 text-solid-black-600'
                  : 'border-textfield-default-stroke bg-surface-primary text-text-black',
              ].join(' ')}
            >
              <span
                className="truncate text-2xs font-weight-regular"
                dir="auto"
              >
                {option.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// Envelope icon — paths extracted from email.svg asset, re-keyed to currentColor
function EmailIcon() {
  return (
    <svg
      width="16"
      height="13"
      viewBox="18.3333 15.6666 13.3333 10.6667"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M30.3333 15.6666H19.6666C18.9303 15.6666 18.3333 16.2636 18.3333 17V25C18.3333 25.7363 18.9303 26.3333 19.6666 26.3333H30.3333C31.0697 26.3333 31.6666 25.7363 31.6666 25V17C31.6666 16.2636 31.0697 15.6666 30.3333 15.6666Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.3333 18.3333L25 21.6666L31.6666 18.3333"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Phone prefix: Lebanese flag + country code + chevron, used as the leftIcon in phone mode
function PhonePrefix() {
  return (
    <div
      className="flex items-center gap-4 border-e border-solid-black-300 pe-8"
      dir="ltr"
    >
      <SvgIcon svg={flagLbSvg} className="h-[11px] w-[16px]" />
      <span className="whitespace-nowrap text-2xs font-weight-medium leading-none text-solid-black-600">
        +961
      </span>
      <SvgIcon svg={chevronDownSvg} className="size-12 text-solid-black-400" />
    </div>
  );
}

function getContactInputModeProps(contactMode: HelpCenterContactMode) {
  if (contactMode === 'email') {
    return {
      type: 'email' as const,
      inputMode: 'email' as const,
      dir: 'ltr' as const,
    };
  }

  if (contactMode === 'phone') {
    return {
      type: 'tel' as const,
      inputMode: 'tel' as const,
      dir: 'ltr' as const,
    };
  }

  return {
    type: 'text' as const,
    inputMode: 'text' as const,
    dir: 'ltr' as const,
  };
}

export function RequestOrganizationSheet({
  open,
  copy,
  submitError,
  isSubmitting,
  values,
  errors,
  organizationTypeOptions,
  onOpenChange,
  onFieldChange,
  onSelectOrganizationType,
  onCancel,
  onSubmit,
}: RequestOrganizationSheetProps) {
  const contactInputModeProps = getContactInputModeProps(values.contactMode);
  const contactLeftIcon =
    values.contactMode === 'email' ? (
      <EmailIcon />
    ) : values.contactMode === 'phone' ? (
      <PhonePrefix />
    ) : null;
  const isSubmitDisabled =
    isSubmitting ||
    !values.organizationName.trim() ||
    !values.contactValue.trim();

  return (
    <BottomSheet
      open={open}
      title={copy.title}
      closeAriaLabel={copy.closeAriaLabel}
      onOpenChange={onOpenChange}
      contentClassName="pb-12"
      footer={
        <div className="flex w-full flex-col gap-12 px-16 pt-12 pb-20">
          <div className="w-full border-t border-solid-black-300" />

          <div className="flex w-full items-center gap-12">
            <Button
              variant="tonal"
              className="h-48 flex-1 justify-center"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {copy.cancelLabel}
            </Button>

            <Button
              className="h-48 flex-1 justify-center"
              onClick={onSubmit}
              disabled={isSubmitDisabled}
            >
              {isSubmitting ? copy.submittingLabel : copy.submitLabel}
            </Button>
          </div>
        </div>
      }
    >
      <div
        className="flex w-full flex-col gap-16 pb-8"
        data-testid="request-organization-sheet"
      >
        <div className="flex flex-col gap-8">
          <FieldLabel htmlFor="organization-name" label={copy.fields.name} />
          <TextField
            id="organization-name"
            size="lg"
            value={values.organizationName}
            onChange={(event) =>
              onFieldChange('organizationName', event.target.value)
            }
            placeholder={copy.fields.namePlaceholder}
            isError={Boolean(errors.organizationName)}
          />
          <FieldError message={errors.organizationName} />
        </div>

        <div className="flex flex-col gap-8">
          <FieldLabel
            htmlFor="organization-contact"
            label={copy.fields.contact}
          />
          <TextField
            id="organization-contact"
            size="lg"
            value={values.contactValue}
            onChange={(event) =>
              onFieldChange('contactValue', event.target.value)
            }
            placeholder={copy.fields.contactPlaceholder}
            isError={Boolean(errors.contactValue)}
            leftIcon={contactLeftIcon}
            maxLength={values.contactMode === 'phone' ? 8 : undefined}
            {...contactInputModeProps}
          />
          <FieldError message={errors.contactValue} />
        </div>

        <div className="flex flex-col gap-8">
          <TypeTagGroup
            legend={copy.fields.organizationType}
            options={organizationTypeOptions}
            value={values.organizationType}
            onChange={onSelectOrganizationType}
          />
          <FieldError message={errors.organizationType} />
        </div>

        {submitError ? (
          <p className="text-2xs font-weight-regular text-alert-error-text">
            {submitError}
          </p>
        ) : null}
      </div>
    </BottomSheet>
  );
}
