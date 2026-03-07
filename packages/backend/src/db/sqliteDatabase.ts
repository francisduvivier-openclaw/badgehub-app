import { SQLITE_DB_PATH } from "@config";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { NodeSqliteAdapter } from "@db/NodeSqliteAdapter";
import { BADGEHUB_SCHEMA_SQL } from "@shared/db/sqliteSchema";

let sqliteDb: DatabaseSync | undefined;

function ensureParentDir(filePath: string) {
  const parent = path.dirname(filePath);
  mkdirSync(parent, { recursive: true });
}

export function getSqliteDb(): DatabaseSync {
  if (!sqliteDb) {
    ensureParentDir(SQLITE_DB_PATH);
    sqliteDb = new DatabaseSync(SQLITE_DB_PATH);
    sqliteDb.exec("PRAGMA journal_mode = WAL;\n" + BADGEHUB_SCHEMA_SQL);
  }
  return sqliteDb;
}

export function getNodeSqliteAdapter(): NodeSqliteAdapter {
  return new NodeSqliteAdapter(getSqliteDb());
}
