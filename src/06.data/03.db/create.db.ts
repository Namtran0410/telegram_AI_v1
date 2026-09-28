import Database from 'better-sqlite3'
const db = new Database('table.db')

db.exec("PRAGMA foreign_keys = ON")
db.exec(`
    CREATE TABLE IF NOT EXISTS TB_USERS(
        user_id TEXT PRIMARY KEY,
        username TEXT,
        coin INTEGER
    );
    CREATE TABLE IF NOT EXISTS TB_USER_MANAGEMENT(
        user_id TEXT,
        number_picture_generated INTEGER,
        number_video_generated INTEGER,
        number_tiktok_generated INTEGER,
        FOREIGN KEY (user_id) REFERENCES TB_USERS(user_id) ON DELETE CASCADE
    );
    CREATE TABLE IF NOT EXISTS TB_GENERATIONS(
        generation_id TEXT PRIMARY KEY,
        user_id TEXT,
        type TEXT,
        request_received_time TEXT,
        status TEXT NOT NULL DEFAULT 'PROCESSING' CHECK (status IN ('PROCESSING', 'SUCCESS', 'FAIL')),
        FOREIGN KEY (user_id) REFERENCES TB_USERS(user_id) ON DELETE CASCADE
    )
`)
export default db