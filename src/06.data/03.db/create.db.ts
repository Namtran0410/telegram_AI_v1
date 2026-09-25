import Database from 'better-sqlite3'
const db = new Database('table.db')

db.exec("PRAGMA foreign_keys = ON")
db.exec(`
    CREATE TABLE IF NOT EXISTS TB_USER(
        user_id TEXT PRIMARY KEY,
        username TEXT,
        coin INTEGER
    );
    CREATE TABLE IF NOT EXISTS TB_PICTURE(
        picture_id TEXT PRIMARY KEY,
        user_id TEXT,
        received_time TEXT,
        isExecution BOOLEAN,
        FOREIGN KEY (user_id) REFERENCES TB_USER(user_id) ON DELETE CASCADE 
    );
    CREATE TABLE IF NOT EXISTS TB_VIDEO(
        video_id TEXT PRIMARY KEY,
        user_id TEXT,
        received_time TEXT,
        isExecution BOOLEAN,
        FOREIGN KEY (user_id) REFERENCES TB_USER(user_id) ON DELETE CASCADE
    )
`)
export default db