
import { Kysely, SqliteDialect } from "kysely";
import SQLite from 'better-sqlite3';
import { type DB } from "@/generated/db.d";

const dialect = new SqliteDialect({
  database: new SQLite("store.db"),
});

export const db = new Kysely<DB>({
  dialect,
});

