import { getDatabase } from './connection';

export async function getAlunos() {
    const db = await getDatabase();
    return await db.getAllAsync('SELECT * FROM tbAluno ORDER BY nome');
}

export async function getAlunoById(id) {
    const db = await getDatabase();
    return await db.getFirstAsync('SELECT * FROM tbAluno WHERE id = ?', id);
}

export async function insertAluno(ra, nome) {
    const db = await getDatabase();
    const result = await db.runAsync(
        'INSERT INTO tbAluno (ra, nome) VALUES (?, ?)',
        ra, nome
    );
    return result.lastInsertRowId;
}

export async function updateAluno(id, ra, nome) {
    const db = await getDatabase();
    await db.runAsync(
        'UPDATE tbAluno SET ra = ?, nome = ? WHERE id = ?',
        ra, nome, id
    );
}

export async function deleteAluno(id) {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM tbAluno WHERE id = ?', id);
}
