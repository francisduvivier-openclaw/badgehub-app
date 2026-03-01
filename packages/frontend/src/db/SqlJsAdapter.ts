import type { Database } from "sql.js";
import { templateToSql } from "@shared/db/templateToSql";
import type { SqliteDb } from "@shared/db/SqliteDb";

export class SqlJsAdapter implements SqliteDb {
  constructor(private readonly db: Database) {}

  run(strings: TemplateStringsArray, ...values: unknown[]): void {
    const { sql, params } = templateToSql(strings, values);
    this.db.run(sql, params);
  }

  get<T extends Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): T | undefined {
    const { sql, params } = templateToSql(strings, values);
    const stmt = this.db.prepare(sql, params);
    try {
      if (!stmt.step()) return undefined;
      return stmt.getAsObject() as T;
    } finally {
      stmt.free();
    }
  }

  all<T extends Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): T[] {
    const { sql, params } = templateToSql(strings, values);
    const stmt = this.db.prepare(sql, params);
    const rows: T[] = [];
    try {
      while (stmt.step()) rows.push(stmt.getAsObject() as T);
    } finally {
      stmt.free();
    }
    return rows;
  }

  exec(sql: string): void {
    this.db.run(sql);
  }

  runRaw(sql: string, params: unknown[]): void {
    this.db.run(sql, params);
  }
}
