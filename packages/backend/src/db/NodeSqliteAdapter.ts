import { DatabaseSync } from "node:sqlite";
import { templateToSql } from "@shared/db/templateToSql";
import type { SqliteDb } from "@shared/db/SqliteDb";

export class NodeSqliteAdapter implements SqliteDb {
  constructor(private readonly db: DatabaseSync) {}

  run(strings: TemplateStringsArray, ...values: unknown[]): void {
    const { sql, params } = templateToSql(strings, values);
    this.db.prepare(sql).run(...params);
  }

  get<T extends Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): T | undefined {
    const { sql, params } = templateToSql(strings, values);
    return this.db.prepare(sql).get(...params) as T | undefined;
  }

  all<T extends Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): T[] {
    const { sql, params } = templateToSql(strings, values);
    return this.db.prepare(sql).all(...params) as T[];
  }

  exec(sql: string): void {
    this.db.exec(sql);
  }

  runRaw(sql: string, params: unknown[]): void {
    this.db.prepare(sql).run(...params);
  }
}
