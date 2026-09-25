import db from "./create.db.js";

export class DataFeature {
    registerAddUserToTable(user_id: string, username: string | undefined){
        /** Thêm mới user */
        db.prepare(`
        INSERT OR IGNORE INTO TB_USER(user_id, username, coin)
        VALUES(?, ?, ?)
        `).run(user_id, username, 0)
        /** add username nếu có thay đổi */
        db.prepare(`UPDATE TB_USER SET username = ?`).run(username)

    }
    registerAddCoinToUser(user_id: string, addedCoin: number){
        const readOldData = db.prepare(`
        SELECT coin FROM TB_USER where user_id = ?    
        `)
        const pairsedOldData:any = readOldData.get(user_id)
        const oldCoin = pairsedOldData.coin
        db.prepare(`
            UPDATE TB_USER SET coin = ? where user_id = ?
        `).run(oldCoin+ addedCoin, user_id)
    }
    registerGetCurrentCoin(user_id:string) {
        const smt = db.prepare(`SELECT coin FROM TB_USER WHERE user_id = ?`)
        const userInfor:any = smt.get(user_id)
        return userInfor.coin
    }
}

export default new DataFeature()