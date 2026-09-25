import Database from 'better-sqlite3'
const db = new Database('table.db')

db.exec("PRAGMA foreign_keys = ON")
db.exec(`
    CREATE TABLE IF NOT EXISTS TB_USER(
        user_id TEXT PRIMARY KEY,
        coin INTEGER
    );

`)
export default db