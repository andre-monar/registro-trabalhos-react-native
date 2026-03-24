import { getDbConnection } from './Database';

class TrabalhoDAO {
    async insert(trabalho) {
        try {
            const db = await getDbConnection();
            return await db.runAsync(
                'INSERT INTO tbTrabalho (nome, descricao, data_entrega, situacao) VALUES (?, ?, ?, ?)',
                trabalho.nome, trabalho.descricao, trabalho.data_entrega, trabalho.situacao
            );
        } catch (erro) {
            console.log('Erro insert:', erro);
            throw erro;
        }
    }

    async getAll() {
        try {
            const db = await getDbConnection();
            const result = await db.getAllAsync(
                `SELECT tbTrabalho.*,
                    COALESCE(SUM(tbAtividade.horas_previstas), 0) AS total_previstas,
                    COALESCE(SUM(tbAtividade.horas_concluidas), 0) AS total_concluidas
                FROM tbTrabalho
                LEFT JOIN tbAtividade ON tbAtividade.idTrabalho = tbTrabalho.id
                GROUP BY tbTrabalho.id
                ORDER BY tbTrabalho.id`
            );
            return result || [];
        } catch (erro) {
            console.log('Erro getAll:', erro);
            return [];
        }
    }

    async getById(id) {
        try {
            const db = await getDbConnection();
            return await db.getFirstAsync('SELECT * FROM tbTrabalho WHERE id = ?', id);
        } catch (erro) {
            console.log('Erro getById:', erro);
            throw erro;
        }
    }

    async update(id, trabalho) {
        try {
            const db = await getDbConnection();
            return await db.runAsync(
                'UPDATE tbTrabalho SET nome = ?, descricao = ?, data_entrega = ?, situacao = ? WHERE id = ?',
                trabalho.nome, trabalho.descricao, trabalho.data_entrega, trabalho.situacao, id
            );
        } catch (erro) {
            console.log('Erro update:', erro);
            throw erro;
        }
    }

    async delete(id) {
        try {
            const db = await getDbConnection();
            return await db.runAsync('DELETE FROM tbTrabalho WHERE id = ?', id);
        } catch (erro) {
            console.log('Erro delete:', erro);
            throw erro;
        }
    }

    
}

export default new TrabalhoDAO();