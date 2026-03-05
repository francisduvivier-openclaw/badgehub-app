declare module "sql.js" {
  export interface Database {
    run(sql: string, params?: unknown[]): void;
    prepare(sql: string, params?: unknown[]): {
      bind(params: unknown[]): void;
      step(): boolean;
      getAsObject(): Record<string, unknown>;
      free(): void;
    };
    export(): Uint8Array;
  }

  export default function initSqlJs(config?: {
    locateFile?: (file: string) => string;
  }): Promise<{ Database: new (data?: Uint8Array) => Database }>;
}
