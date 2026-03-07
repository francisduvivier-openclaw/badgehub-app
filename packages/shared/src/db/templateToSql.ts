export type SafeSql = { readonly _tag: "SafeSql"; readonly sql: string };

export function safe(sql: string): SafeSql {
  return { _tag: "SafeSql", sql };
}

export function templateToSql(
  strings: TemplateStringsArray,
  values: unknown[]
): { sql: string; params: unknown[] } {
  let sql = "";
  const params: unknown[] = [];
  for (let i = 0; i < strings.length; i++) {
    sql += strings[i];
    if (i < values.length) {
      const v = values[i];
      if (
        v !== null &&
        typeof v === "object" &&
        "_tag" in v &&
        (v as SafeSql)._tag === "SafeSql"
      ) {
        sql += (v as SafeSql).sql;
      } else {
        sql += "?";
        params.push(v);
      }
    }
  }
  return { sql, params };
}
