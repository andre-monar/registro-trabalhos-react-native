import { getDbConnection } from './Database';

class AtividadeDAO {
    async insert(atividade) {
        try {
            const db = await getDbConnection();
            return await db.runAsync(
                'INSERT INTO tbAtividade (idTrabalho, nome, descricao, horas_previstas, horas_concluidas, situacao) VALUES (?, ?, ?, ?, ?, ?)',
                atividade.idTrabalho, atividade.nome, atividade.descricao, atividade.horas_previstas, atividade.horas_concluidas, atividade.situacao
            );
        } catch (erro) {
            console.log('Erro insert:', erro);
            throw erro;
        }
    }

    async getAll() {
        try {
            const db = await getDbConnection();
            const result = await db.getAllAsync('SELECT * FROM tbAtividade ORDER BY id');
            return result || [];
        } catch (erro) {
            console.log('Erro getAll:', erro);
            return [];
        }
    }

    async getById(id) {
        try {
            const db = await getDbConnection();
            return await db.getFirstAsync('SELECT * FROM tbAtividade WHERE id = ?', id);
        } catch (erro) {
            console.log('Erro getById:', erro);
            throw erro;
        }
    }

    async update(id, atividade) {
        try {
            const db = await getDbConnection();
            return await db.runAsync(
                'UPDATE tbAtividade SET idTrabalho = ?, nome = ?, descricao = ?, horas_previstas = ?, horas_concluidas = ?, situacao = ? WHERE id = ?',
                atividade.idTrabalho, atividade.nome, atividade.descricao, atividade.horas_previstas, atividade.horas_concluidas, atividade.situacao, id
            );
        } catch (erro) {
            console.log('Erro update:', erro);
            throw erro;
        }
    }

    async delete(id) {
        try {
            const db = await getDbConnection();
            return await db.runAsync('DELETE FROM tbAtividade WHERE id = ?', id);
        } catch (erro) {
            console.log('Erro delete:', erro);
            throw erro;
        }
    }
}

export default new AtividadeDAO();