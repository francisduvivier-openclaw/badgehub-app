export interface SqliteDb {
  run(strings: TemplateStringsArray, ...values: unknown[]): void;
  get<T extends Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): T | undefined;
  all<T extends Record<string, unknown>>(
    strings: TemplateStringsArray,
    ...values: unknown[]
  ): T[];
  exec(sql: string): void;
  /** Escape hatch for dynamically-built SQL (e.g. UPDATE SET with variable columns). */
  runRaw(sql: string, params: unknown[]): void;
}
