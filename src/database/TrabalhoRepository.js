import { getDatabase } from './connection';

export async function getTrabalhos() {
    const db = await getDatabase();
    return await db.getAllAsync('SELECT * FROM tbTrabalho ORDER BY data_entrega');
}

export async function getTrabalhoById(id) {
    const db = await getDatabase();
    return await db.getFirstAsync('SELECT * FROM tbTrabalho WHERE id = ?', id);
}

export async function insertTrabalho(nome, descricao, dataEntrega, horasEstimadas, situacao) {
    const db = await getDatabase();
    const result = await db.runAsync(
        'INSERT INTO tbTrabalho (nome, descricao, data_entrega, horas_estimadas, situacao) VALUES (?, ?, ?, ?, ?)',
        nome, descricao, dataEntrega, horasEstimadas, situacao || 'Pendente'
    );
    return result.lastInsertRowId;
}

export async function updateTrabalho(id, nome, descricao, dataEntrega, horasEstimadas, situacao) {
    const db = await getDatabase();
    await db.runAsync(
        'UPDATE tbTrabalho SET nome = ?, descricao = ?, data_entrega = ?, horas_estimadas = ?, situacao = ? WHERE id = ?',
        nome, descricao, dataEntrega, horasEstimadas, situacao, id
    );
}

export async function deleteTrabalho(id) {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM tbTrabalho WHERE id = ?', id);
}

export async function getAlunosDoTrabalho(idTrabalho) {
    const db = await getDatabase();
    return await db.getAllAsync(
        `SELECT a.* FROM tbAluno a
         INNER JOIN tbTrabalhoAluno ta ON ta.idAluno = a.id
         WHERE ta.idTrabalho = ?
         ORDER BY a.nome`,
        idTrabalho
    );
}

export async function addAlunoAoTrabalho(idTrabalho, idAluno) {
    const db = await getDatabase();
    await db.runAsync(
        'INSERT OR IGNORE INTO tbTrabalhoAluno (idTrabalho, idAluno) VALUES (?, ?)',
        idTrabalho, idAluno
    );
}

export async function removeAlunoDoTrabalho(idTrabalho, idAluno) {
    const db = await getDatabase();
    await db.runAsync(
        'DELETE FROM tbTrabalhoAluno WHERE idTrabalho = ? AND idAluno = ?',
        idTrabalho, idAluno
    );
}
