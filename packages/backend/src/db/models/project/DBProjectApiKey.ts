import { DBFileData } from "@db/models/project/DBFileData";
import { ProjectSlugRelation } from "@db/models/project/DBProject";
import { TimestampTZ } from "@db/models/DBTypes";

export interface DBProjectApiKey extends ProjectSlugRelation {
  key_hash: DBFileData["sha256"];
  created_at: TimestampTZ; // Creation date
  last_used_at: TimestampTZ;
}
