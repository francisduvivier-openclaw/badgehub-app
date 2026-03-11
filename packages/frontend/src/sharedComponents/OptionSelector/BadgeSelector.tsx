import React from "react";
import { BadgeSlug } from "@shared/domain/readModels/Badge.ts";
import { OptionSelectorWithTitle } from "@sharedComponents/OptionSelector/OptionSelectorWithTitle.tsx";
import { BADGE_SLUGS } from "@config.ts";

export const BadgeSelector: React.FC<{
  badge: BadgeSlug | undefined;
  onBadgeChange: (selectedBadge: BadgeSlug | undefined) => void;
  noValueSetName: string;
}> = ({ badge, onBadgeChange, noValueSetName }) => {
  const badges = BADGE_SLUGS;
  const valueMap = Object.fromEntries(badges.map((slug) => [slug, slug]));
  return (
    <OptionSelectorWithTitle
      noValueSetName={noValueSetName}
      title="Badge"
      valueMap={valueMap}
      value={badge}
      onValueSelection={onBadgeChange}
    />
  );
};
