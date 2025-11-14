import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from "./schema";

export type Database = ExpoSQLiteDatabase<typeof schema>;

export async function initializeDatabase() {
    const sqlite = SQLite.openDatabaseSync("markers.db", { enableChangeListener: true });
    await sqlite.execAsync(`PRAGMA journal_mode = WAL; PRAGMA foreign_keys = on`);
    const database = drizzle(sqlite, { schema });
    return { database };
}