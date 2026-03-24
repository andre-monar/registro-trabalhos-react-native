import { getDbConnection } from './Database';

class AlunoDAO {
    async insert(aluno) {
        let db = null;
        try {
            db = await getDbConnection();
            return await db.runAsync(
                'INSERT INTO tbAluno (ra, nome) VALUES (?, ?)',
                aluno.ra, aluno.nome
            );
        } catch (erro) {
            console.log('Erro insert:', erro);
            throw erro;
        }
    }

    async getAll() {
        let db = null;
        try {
            db = await getDbConnection();
            const result = await db.getAllAsync('SELECT * FROM tbAluno ORDER BY id');
            return result || [];
        } catch (erro) {
            console.log('Erro getAll:', erro);
            return [];
        }
    }

    async getById(id) {
        let db = null;
        try {
            db = await getDbConnection();
            return await db.getFirstAsync('SELECT * FROM tbAluno WHERE id = ?', id);
        } catch (erro) {
            console.log('Erro getById:', erro);
            throw erro;
        }
    }

    async update(id, aluno) {
        let db = null;
        try {
            db = await getDbConnection();
            return await db.runAsync(
                'UPDATE tbAluno SET ra = ?, nome = ? WHERE id = ?',
                aluno.ra, aluno.nome, id
            );
        } catch (erro) {
            console.log('Erro update:', erro);
            throw erro;
        }
    }

    async delete(id) {
        let db = null;
        try {
            db = await getDbConnection();
            return await db.runAsync('DELETE FROM tbAluno WHERE id = ?', id);
        } catch (erro) {
            console.log('Erro delete:', erro);
            throw erro;
        }
    }
}

export default new AlunoDAO();