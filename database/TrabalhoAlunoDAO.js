import { getDbConnection } from './Database';

class TrabalhoAlunoDAO {
    async insert(idTrabalho, idAluno) {
        try {
            const db = await getDbConnection();
            return await db.runAsync(
                'INSERT INTO tbTrabalhoAluno (idTrabalho, idAluno) VALUES (?, ?)',
                idTrabalho, idAluno
            );
        } catch (erro) {
            console.log('Erro insert:', erro);
            throw erro;
        }
    }

    async getByTrabalho(idTrabalho) {
        try {
            const db = await getDbConnection();
            const result = await db.getAllAsync(
                `SELECT tbAluno.* FROM tbAluno
                 INNER JOIN tbTrabalhoAluno ON tbAluno.id = tbTrabalhoAluno.idAluno
                 WHERE tbTrabalhoAluno.idTrabalho = ?`,
                idTrabalho
            );
            return result || [];
        } catch (erro) {
            console.log('Erro getByTrabalho:', erro);
            return [];
        }
    }

    async getByAluno(idAluno) {
        try {
            const db = await getDbConnection();
            const result = await db.getAllAsync(
                `SELECT tbTrabalho.* FROM tbTrabalho
                 INNER JOIN tbTrabalhoAluno ON tbTrabalho.id = tbTrabalhoAluno.idTrabalho
                 WHERE tbTrabalhoAluno.idAluno = ?`,
                idAluno
            );
            return result || [];
        } catch (erro) {
            console.log('Erro getByAluno:', erro);
            return [];
        }
    }

    async delete(idTrabalho, idAluno) {
        try {
            const db = await getDbConnection();
            return await db.runAsync(
                'DELETE FROM tbTrabalhoAluno WHERE idTrabalho = ? AND idAluno = ?',
                idTrabalho, idAluno
            );
        } catch (erro) {
            console.log('Erro delete:', erro);
            throw erro;
        }
    }

    async deleteByTrabalho(idTrabalho) {
        try {
            const db = await getDbConnection();
            return await db.runAsync(
                'DELETE FROM tbTrabalhoAluno WHERE idTrabalho = ?',
                idTrabalho
            );
        } catch (erro) {
            console.log('Erro deleteByTrabalho:', erro);
            throw erro;
        }
    }

    async getByTrabalho(idTrabalho) {
        try {
            const db = await getDbConnection();
            const result = await db.getAllAsync(
                `SELECT tbAluno.* FROM tbAluno
                INNER JOIN tbTrabalhoAluno ON tbAluno.id = tbTrabalhoAluno.idAluno
                WHERE tbTrabalhoAluno.idTrabalho = ?`,
                idTrabalho
            );
            return result || [];
        } catch (erro) {
            console.log('Erro getByTrabalho:', erro);
            return [];
        }
    }
}

export default new TrabalhoAlunoDAO();