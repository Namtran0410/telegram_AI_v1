import db from "./create.db.js";
import { generationInformation } from "src/types/session.type.js";
export class DataFeature {
    registerAddUserToTable(user_id: string, username: string | undefined){
        /** Thêm mới user */
        db.prepare(`
        INSERT OR IGNORE INTO TB_USERS(user_id, username, coin)
        VALUES(?, ?, ?)
        `).run(user_id, username, 0)
        /** add username nếu có thay đổi */
        db.prepare(`UPDATE TB_USERS SET username = ? WHERE user_id = ?`).run(username, user_id)

    }
    registerAddCoinToUser(user_id: string, addedCoin: number){
        const readOldData = db.prepare(`
        SELECT coin FROM TB_USERS where user_id = ?    
        `)
        const pairsedOldData:any = readOldData.get(user_id)
        const oldCoin = pairsedOldData.coin
        db.prepare(`
            UPDATE TB_USERS SET coin = ? where user_id = ?
        `).run(oldCoin+ addedCoin, user_id)
    }
    registerGetCurrentCoin(user_id:string) {
        const smt = db.prepare(`SELECT coin FROM TB_USERS WHERE user_id = ?`)
        const userInfor:any = smt.get(user_id)
        return userInfor.coin
    }
    async registerAddMediaInformation(param: generationInformation) {
        db.prepare(`
            INSERT OR IGNORE INTO TB_GENERATIONS(
                generation_id, user_id, type, request_received_time, status
            )
            VALUES(?,?,?,?,?)    
        `).run(param.generation_id, param.user_id, param.type, param.request_received_time, param.status)
    }
}

export default new DataFeature()