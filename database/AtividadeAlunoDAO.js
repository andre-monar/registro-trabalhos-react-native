import { getDbConnection } from './Database';

class AtividadeAlunoDAO {
    async insert(idAtividade, idAluno) {
        try {
            const db = await getDbConnection();
            return await db.runAsync(
                'INSERT INTO tbAtividadeAluno (idAtividade, idAluno) VALUES (?, ?)',
                idAtividade, idAluno
            );
        } catch (erro) {
            console.log('Erro insert:', erro);
            throw erro;
        }
    }

    async getByAtividade(idAtividade) {
        try {
            const db = await getDbConnection();
            const result = await db.getAllAsync(
                `SELECT tbAluno.* FROM tbAluno
                INNER JOIN tbAtividadeAluno ON tbAluno.id = tbAtividadeAluno.idAluno
                WHERE tbAtividadeAluno.idAtividade = ?`,
                idAtividade
            );
            return result || [];
        } catch (erro) {
            console.log('Erro getByAtividade:', erro);
            return [];
        }
    }
    async getByAluno(idAluno) {
        try {
            const db = await getDbConnection();
            const result = await db.getAllAsync(
                `SELECT tbAtividade.* FROM tbAtividade
                 INNER JOIN tbAtividadeAluno ON tbAtividade.id = tbAtividadeAluno.idAtividade
                 WHERE tbAtividadeAluno.idAluno = ?`,
                idAluno
            );
            return result || [];
        } catch (erro) {
            console.log('Erro getByAluno:', erro);
            return [];
        }
    }

    async delete(idAtividade, idAluno) {
        try {
            const db = await getDbConnection();
            return await db.runAsync(
                'DELETE FROM tbAtividadeAluno WHERE idAtividade = ? AND idAluno = ?',
                idAtividade, idAluno
            );
        } catch (erro) {
            console.log('Erro delete:', erro);
            throw erro;
        }
    }

    async deleteByAtividade(idAtividade) {
        try {
            const db = await getDbConnection();
            return await db.runAsync(
                'DELETE FROM tbAtividadeAluno WHERE idAtividade = ?',
                idAtividade
            );
        } catch (erro) {
            console.log('Erro deleteByAtividade:', erro);
            throw erro;
        }
    }
}

export default new AtividadeAlunoDAO();