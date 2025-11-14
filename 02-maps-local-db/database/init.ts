import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import * as SQLite from 'expo-sqlite';
import * as schema from "./schema";

export type Database = ExpoSQLiteDatabase<typeof schema>;

export const initializeDatabase = async () => {
    try {
        const sqlite = SQLite.openDatabaseSync("markers.db", { enableChangeListener: true });
        await sqlite.execAsync(`PRAGMA journal_mode = WAL; PRAGMA foreign_keys = on`);
        return drizzle(sqlite, { schema });
    } catch (error) {
        console.error("Couldn't initialize database:", error);
        throw error;
    }
}