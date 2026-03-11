import { __tsCheckSame } from "@shared/zodUtils/zodTypeComparison";
import { z } from "zod/v3";

// TODO change to iso date strings, requires zod/v4 upgrade
export interface DatedData {
  created_at: Date; // Creation date
  updated_at: Date; // Last update date
}

export const datedDataSchema = z.object({
  created_at: z.date(),
  updated_at: z.date(),
});

__tsCheckSame<DatedData, DatedData, z.infer<typeof datedDataSchema>>(true);
