import * as SQLite from 'expo-sqlite';

let db = null;

export async function getDatabase() {
    if (!db) {
        db = await SQLite.openDatabaseAsync('dbRegistroTrabalhos.db');
        await db.execAsync('PRAGMA journal_mode = WAL');
        await db.execAsync('PRAGMA foreign_keys = ON');
    }
    return db;
}
