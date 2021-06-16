const mariadb = require('mariadb');
const pool = mariadb.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'proyect_inter',
    connectionLimit: 5
});

const User = {
    createUser: async(user_data) => {
        let conn;
        try {
            conn = await pool.getConnection();
            const sql_query = 'INSERT INTO users (email,password,token) value (?,?,?)'
            const res = await conn.query(sql_query, user_data);
            console.log(res);
        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end();
        }
    },
    getAllUsers: async() => {
        let conn;
        try {
            conn = await pool.getConnection();
            const sql_query = 'SELECT * FROM users'
            const res = await conn.query(sql_query);
            console.log(res);
        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end();
        }
    },
    getUser: async(id) => {
        let conn;
        try {
            conn = await pool.getConnection();
            const sql_query = 'SELECT * FROM users WHERE id = ?'
            const res = await conn.query(sql_query, [id]);
            console.log(res);
        } catch (err) {
            throw err;
        } finally {
            if (conn) return conn.end();
        }
    }

    // User.getUser(2)
    // User.getAllUsers()
    // User.createUser(["juanma@mail.com", "123456", "fdg32afdsg321354g6a54dfg"])
}

module.exports = User