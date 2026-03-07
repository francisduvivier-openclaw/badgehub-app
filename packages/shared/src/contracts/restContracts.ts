import { privateRestContracts } from "@shared/contracts/privateRestContracts";
import { publicRestContracts } from "@shared/contracts/publicRestContracts";

export const tsRestApiContracts = {
  ...privateRestContracts,
  ...publicRestContracts,
} as const;
