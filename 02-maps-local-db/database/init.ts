import migrations from "@/drizzle/migrations";
import { drizzle, ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import * as SQLite from 'expo-sqlite';
import * as schema from "./schema";

export type Database = ExpoSQLiteDatabase<typeof schema>;

export const initializeDatabase = async () => {
    try {
        const sqlite = SQLite.openDatabaseSync("markers.db", { enableChangeListener: true });
        await sqlite.execAsync(`PRAGMA journal_mode = WAL; PRAGMA foreign_keys = on`);
        const database = drizzle(sqlite, { schema });
        return setupMigrations(database);
    } catch (error) {
        console.error("Couldn't initialize database:", error);
        throw error;
    }
}

function setupMigrations(database: Database): Database {
    const { success, error } = useMigrations(database, migrations);
    if (success) return database;
    if (error) throw error;
    throw new MigrationSetupError();
}

class MigrationSetupError extends Error {
    constructor(message: string = "Couldn't setup migrations using Drizzle ORM: no reason provided :(") {
        super(message);
        this.name = 'MigrationSetupError';
    }
}