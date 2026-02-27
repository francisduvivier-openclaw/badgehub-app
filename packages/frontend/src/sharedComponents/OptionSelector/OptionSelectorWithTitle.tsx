import React from "react";
import { SortOption } from "@sharedComponents/AppsGrid/Filters.tsx";

const NO_FILTER_OPTION_VALUE = "All";
export const OptionSelectorWithTitle: React.FC<
  {
    title: string;
    noValueSetName: string;
  } & (
    | {
        valueMap: Record<string, string>;
        value: string | undefined;
        onValueSelection: (newValue: string) => void;
      }
    | {
        valueMap: Record<"mostInstalled", string>;
        value: SortOption;
        onValueSelection: (value: SortOption) => void;
      }
  )
> = ({ title, noValueSetName, valueMap, value, onValueSelection }) => {
  const selectionId = `${title.toLowerCase()}-dropdown`;
  return (
    <div className={valueMap ? "" : "todoElement"}>
      <label
        htmlFor={selectionId}
        className="block text-sm font-medium bh-text-muted mb-1"
      >
        {title}
      </label>
      <select
        id={selectionId}
        name={selectionId}
        data-testid={selectionId}
        className="w-full bh-input border bh-border-soft rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 p-2"
        value={value === undefined ? NO_FILTER_OPTION_VALUE : String(value)}
        onChange={(e) =>
          onValueSelection(
            e.target.value === NO_FILTER_OPTION_VALUE
              ? undefined
              : // eslint-disable-next-line @typescript-eslint/no-explicit-any
                (e.target.value as any)
          )
        }
      >
        <option value={NO_FILTER_OPTION_VALUE}>{noValueSetName}</option>
        {(Object.keys(valueMap ?? {}) as Array<keyof typeof valueMap>).map(
          (option) => (
            <option key={option} value={option}>
              {valueMap?.[option]}
            </option>
          )
        )}
      </select>
    </div>
  );
};
