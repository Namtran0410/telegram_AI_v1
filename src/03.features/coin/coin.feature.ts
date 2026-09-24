import { Bot, Context, CommandContext } from "grammy";
import { context } from "src/run.js";
import { CoinNumber, UserInfor } from "src/types/session.type.js";
import fs from "fs";
import fsPromise from "fs/promises";
import { MenuIndex } from "src/00.ui/00.index.ui.js";
import { Mutex } from "async-mutex";

export class CoinFeature {
    readonly coinPath = "src/06.data/00.coins.json"
    public mutex = new Mutex();
    async registerBehavior(bot: Bot<context>){
        for(let coin of CoinNumber) {
            const btn = `btn_star_select_${coin}`;
            bot.callbackQuery(btn, async(c, next)=>{
                await c.answerCallbackQuery()
                await c.reply(`You want to pay for: ${coin} 🪙`, {
                    reply_markup: MenuIndex.coins.starPurchaseAction()
                })
                await c.deleteMessage()
                c.session.requestPurchaseCoin = Number(coin)
                await next()
            })
        }
        bot.callbackQuery("btn_confirm_purchase",async(c, next)=> {
            await c.answerCallbackQuery()
            /** Read coin cũ của user */
            const userId = c.from.id
            /** Đọc coin cũ */
            const userInfor = await this.registerReadUserCoin(userId)
            /** ghi đè vào file */
            await this.registerWriteCoin({userId, coins: Number(userInfor.coins) + Number(c.session.requestPurchaseCoin)})
            await c.deleteMessage()
            
            /**Chúc mừng khi mua thành công */
            const newcoinReaded = await this.registerReadUserCoin(userId)
            await c.reply(
                `🎉 Congratulation!\nYou bought ${c.session.requestPurchaseCoin} 🪙\nYour coins now: ${newcoinReaded.coins} 🪙`
            , {reply_markup: MenuIndex.main.homeButton()})
            /** coin resset */
            c.session.requestPurchaseCoin = 0
        })
    }

    async registerWriteCoin(data: UserInfor) {
        await this.mutex.runExclusive(async () => {
            // Tạo file nếu chưa tồn tại
            if (!fs.existsSync(this.coinPath)) {
                await fsPromise.writeFile(
                    this.coinPath,
                    JSON.stringify([], null, 4),
                    "utf-8"
                );
            }
            // Đọc dữ liệu
            const rawData = await fsPromise.readFile(
                this.coinPath,
                "utf-8"
            );
            let users: UserInfor[];
            try {
                users = JSON.parse(rawData);
            } catch {
                users = [];
            }
            // Upsert
            const index = users.findIndex(
                item => item.userId === data.userId
            );
            if (index === -1) {
                users.push(data);
            } else {
                users[index] = data;
            }
            // Ghi lại file
            await fsPromise.writeFile(
                this.coinPath,
                JSON.stringify(users, null, 4),
                "utf-8"
            );
        });
    }
    async registerReadUserCoin(
        userId: string | number
    ): Promise<UserInfor> {
        return this.mutex.runExclusive(async () => {
            const data = await fsPromise.readFile(
                this.coinPath,
                "utf-8"
            );
            try {
                const users: UserInfor[] = JSON.parse(data);
                const userInfor = users.find(
                    item => item.userId == userId
                );
                return userInfor ?? {
                    userId,
                    coins: 0
                };
            } catch {
                return {
                    userId,
                    coins: 0
                };
            }
        });
    }
    async registerGetUserBalance(bot: Bot<context>){
        bot.callbackQuery("btn_user_balance_main_information", async(c, next)=>{
            await c.answerCallbackQuery()
            const userInfor = await this.registerReadUserCoin(c.from.id)
            await c.reply(`You now have ${userInfor.coins}🪙`, {
                reply_markup: MenuIndex.main.homeButton()
            })
            await c.deleteMessage()
            
        })
    }
}