import { getDatabase } from './connection';

export async function getAtividadesByTrabalho(idTrabalho) {
    const db = await getDatabase();
    return await db.getAllAsync(
        `SELECT at.*, a.nome AS nomeAluno
         FROM tbAtividade at
         LEFT JOIN tbAluno a ON a.id = at.idAluno
         WHERE at.idTrabalho = ?
         ORDER BY at.nome`,
        idTrabalho
    );
}

export async function getAtividadeById(id) {
    const db = await getDatabase();
    return await db.getFirstAsync('SELECT * FROM tbAtividade WHERE id = ?', id);
}

export async function insertAtividade(idTrabalho, idAluno, nome, descricao, horasPrevistas, situacao) {
    const db = await getDatabase();
    const result = await db.runAsync(
        'INSERT INTO tbAtividade (idTrabalho, idAluno, nome, descricao, horas_previstas, situacao) VALUES (?, ?, ?, ?, ?, ?)',
        idTrabalho, idAluno, nome, descricao, horasPrevistas, situacao || 'Pendente'
    );
    return result.lastInsertRowId;
}

export async function updateAtividade(id, idAluno, nome, descricao, horasPrevistas, situacao) {
    const db = await getDatabase();
    await db.runAsync(
        'UPDATE tbAtividade SET idAluno = ?, nome = ?, descricao = ?, horas_previstas = ?, situacao = ? WHERE id = ?',
        idAluno, nome, descricao, horasPrevistas, situacao, id
    );
}

export async function updateAndamentoAtividade(id, horasConcluidas, situacao) {
    const db = await getDatabase();
    await db.runAsync(
        'UPDATE tbAtividade SET horas_concluidas = ?, situacao = ? WHERE id = ?',
        horasConcluidas, situacao, id
    );
}

export async function deleteAtividade(id) {
    const db = await getDatabase();
    await db.runAsync('DELETE FROM tbAtividade WHERE id = ?', id);
}
