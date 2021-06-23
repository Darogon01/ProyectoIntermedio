const mariadb = require('mariadb')
const pool = mariadb.createPool({
    host: process.env.SQL_DATABASE_URL,
    user: process.env.SQL_DATABASE_USER,
    password: process.env.SQL_DATABASE_PASS,
    database: process.env.SQL_DATABASE_NAME,
    port: process.env.SQL_DATABASE_PORT,
    connectionLimit: 5
})

const User = {
    createUser: async(user_data) => {
        let conn
        let res
        try {
            conn = await pool.getConnection()
            const sql_query = 'INSERT INTO users (email,password) value (?,?)'
            res = await conn.query(sql_query, user_data)
        } catch (err) {
            res = { error: "El usuario ya existe" }
        } finally {
            if (conn) conn.end()
        }
        return res
    },
    getAllUsers: async() => {
        let conn
        try {
            conn = await pool.getConnection()
            const sql_query = 'SELECT * FROM users'
            const res = await conn.query(sql_query)
        } catch (err) {
            throw err
        } finally {
            if (conn) return conn.end()
        }
    },
    updateUserToken: async(token, email) => {
        let conn
        try {
            conn = await pool.getConnection()
            const sql_query = 'UPDATE `users` SET `token`= ? WHERE `email` = ?'
            const res = await conn.query(sql_query, [token, email])
        } catch (err) {
            throw err
        } finally {
            if (conn) return conn.end()
        }
    },
    getUserToken: async(email) => {
        let conn
        try {
            conn = await pool.getConnection()
            const sql_query = 'SELECT `token` FROM `users` WHERE `email`= ?'
            const res = await conn.query(sql_query, [email])
        } catch (err) {
            throw err
        } finally {
            if (conn) return conn.end()
        }
    },
    getUser: async(email) => {
        let conn
        let res
        try {
            conn = await pool.getConnection()
            const sql_query = 'SELECT * FROM users WHERE email = ?'
            res = await conn.query(sql_query, [email])
        } catch (err) {
            res = err.message
        } finally {
            if (conn) conn.end()
        }
        return res
    },
    getUserFavorites: async(email) => {
        let res
        try {
            conn = await pool.getConnection()
            const sql_query = 'SELECT api_id_film FROM `favorite_films` WHERE id_user = (SELECT id_user FROM users WHERE email=?)'
            res = await conn.query(sql_query, [email])
        } catch (err) {
            throw err
        } finally {
            if (conn) conn.end()
        }
        return res
    },
    searchFavorite: async(email, api_id_film) => {
        let res
        try {
            conn = await pool.getConnection()
            const sql_query = 'SELECT id_film FROM `favorite_films` WHERE id_user = (SELECT id_user FROM users WHERE email=?) AND api_id_film = ?'
            res = await conn.query(sql_query, [email, api_id_film])
        } catch (err) {
            throw err
        } finally {
            if (conn) conn.end()
        }
        return res
    },
    addFavorite: async(email, api_id_film) => {
        try {
            conn = await pool.getConnection()
            const sql_query = 'INSERT INTO `favorite_films`(`id_user`, `api_id_film`) VALUES ((SELECT id_user FROM users WHERE email=?),?)'
            const res = await conn.query(sql_query, [email, api_id_film])
            console.log(res)
            console.log(`Creado favorito ${api_id_film} para el usuario ${email}`)
        } catch (err) {
            throw err
        } finally {
            if (conn) return conn.end()
        }
    },
    removeFavorite: async(email, api_id_film) => {
        try {
            conn = await pool.getConnection()
            const sql_query = 'DELETE FROM `favorite_films` WHERE id_film = (SELECT f.id_film FROM favorite_films as f INNER JOIN users as u ON f.id_user = u.id_user WHERE u.email=? AND f.api_id_film = ?)'
            const res = await conn.query(sql_query, [email, api_id_film])
            console.log(res)
            console.log(`borrada pelicula con id ${api_id_film} del user ${email}`)
        } catch (err) {
            throw err
        } finally {
            if (conn) return conn.end()
        }
    }
}

module.exports = User