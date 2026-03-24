import { getDatabase } from './connection';

export async function createTables() {
    const db = await getDatabase();

    await db.execAsync(`
        DROP TABLE IF EXISTS tbTrabalhoAluno
    `);
    await db.execAsync(`
        DROP TABLE IF EXISTS tbAtividade
    `);
    await db.execAsync(`
        DROP TABLE IF EXISTS tbTrabalho
    `);
    await db.execAsync(`
        DROP TABLE IF EXISTS tbAluno
    `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS tbAluno (
            id   INTEGER PRIMARY KEY AUTOINCREMENT,
            ra   TEXT NOT NULL UNIQUE,
            nome TEXT NOT NULL
        )
    `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS tbTrabalho (
            id              INTEGER PRIMARY KEY AUTOINCREMENT,
            nome            TEXT NOT NULL,
            descricao       TEXT,
            data_entrega    TEXT,
            horas_estimadas REAL DEFAULT 0,
            situacao        TEXT DEFAULT 'Pendente'
                            CHECK(situacao IN ('Pendente','Concluído','Cancelado'))
        )
    `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS tbAtividade (
            id               INTEGER PRIMARY KEY AUTOINCREMENT,
            idTrabalho       INTEGER NOT NULL,
            idAluno          INTEGER,
            nome             TEXT NOT NULL,
            descricao        TEXT,
            horas_previstas  REAL DEFAULT 0,
            horas_concluidas REAL DEFAULT 0,
            situacao         TEXT DEFAULT 'Pendente'
                             CHECK(situacao IN ('Pendente','Concluída','Cancelada')),
            FOREIGN KEY (idTrabalho) REFERENCES tbTrabalho(id) ON DELETE CASCADE,
            FOREIGN KEY (idAluno)    REFERENCES tbAluno(id) ON DELETE SET NULL
        )
    `);

    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS tbTrabalhoAluno (
            idTrabalho INTEGER,
            idAluno    INTEGER,
            FOREIGN KEY (idTrabalho) REFERENCES tbTrabalho(id) ON DELETE CASCADE,
            FOREIGN KEY (idAluno)    REFERENCES tbAluno(id) ON DELETE CASCADE,
            PRIMARY KEY (idTrabalho, idAluno)
        )
    `);
}
