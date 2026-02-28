declare module "sql.js" {
  export interface Database {
    run(sql: string, params?: unknown[]): void;
    prepare(sql: string, params?: unknown[]): {
      step(): boolean;
      getAsObject(): Record<string, unknown>;
      free(): void;
    };
  }

  export default function initSqlJs(config?: {
    locateFile?: (file: string) => string;
  }): Promise<{ Database: new () => Database }>;
}
