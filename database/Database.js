import * as SQLite from 'expo-sqlite';

// criar ou abrir db
let dbInstance = null;

export async function getDbConnection() {
    if (!dbInstance) {
        dbInstance = await SQLite.openDatabaseAsync('dbRegistroTrabalhos.db');
    }
    return dbInstance;
}

// criar tabelas
export async function createTables() {
    let cx = null;
    try {
        
        cx = await getDbConnection();
        
        const queryAluno = `CREATE TABLE IF NOT EXISTS tbAluno
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ra TEXT NOT NULL UNIQUE,
            nome TEXT NOT NULL          
        )`;
        await cx.execAsync(queryAluno);

        const queryTrabalho = `CREATE TABLE IF NOT EXISTS tbTrabalho
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT NOT NULL,
            descricao TEXT,
            data_entrega DATE,       
            situacao TEXT CHECK(situacao IN ('Pendente', 'Concluído', 'Cancelado'))  
        )`;
        await cx.execAsync(queryTrabalho);

        const queryAtividade = `CREATE TABLE IF NOT EXISTS tbAtividade
        (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            idTrabalho INTEGER,
            nome TEXT NOT NULL,
            descricao TEXT,
            horas_previstas REAL,
            horas_concluidas REAL,
            situacao TEXT CHECK(situacao IN ('Pendente', 'Concluído', 'Cancelado')),
            FOREIGN KEY (idTrabalho) REFERENCES tbTrabalho(id) ON DELETE CASCADE    
        )`;
        await cx.execAsync(queryAtividade);

        const queryAtividadeAluno = `CREATE TABLE IF NOT EXISTS tbAtividadeAluno
        (
            idAtividade INTEGER,
            idAluno INTEGER,
            FOREIGN KEY (idAtividade) REFERENCES tbAtividade(id) ON DELETE CASCADE,
            FOREIGN KEY (idAluno) REFERENCES tbAluno(id) ON DELETE CASCADE,
            PRIMARY KEY (idAtividade, idAluno)   
        )`;
        await cx.execAsync(queryAtividadeAluno);

        
        const queryTrabalhoAluno = `CREATE TABLE IF NOT EXISTS tbTrabalhoAluno
        (
            idTrabalho INTEGER,
            idAluno INTEGER,
            FOREIGN KEY (idTrabalho) REFERENCES tbTrabalho(id) ON DELETE CASCADE,
            FOREIGN KEY (idAluno) REFERENCES tbAluno(id) ON DELETE CASCADE,
            PRIMARY KEY (idTrabalho, idAluno)  
        )`;
        await cx.execAsync(queryTrabalhoAluno);

        console.log("Tabelas criadas com sucesso!");
    } catch (erro) {
        console.log("Erro ao criar tabelas: ", erro);
    } 
}