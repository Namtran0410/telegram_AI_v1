import { Bot, Context, CommandContext } from "grammy";
import { context } from "src/run.js";
import { CoinNumber, UserInfor } from "src/types/session.type.js";
import fs from "fs";
import fsPromise from "fs/promises";
import { MenuIndex } from "src/00.ui/00.index.ui.js";
import { Mutex } from "async-mutex";
import dataFeature from "src/06.data/03.db/data.feature.js";

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
            /** ghi đè vào file */
            await this.registerWriteCoin({
                userId, 
                coins: Number(c.session.requestPurchaseCoin), 
                })
            await c.deleteMessage()
            
            /**Chúc mừng khi mua thành công */
            const newCoins = await this.registerReadUserCoin(userId)
            await c.reply(
                `🎉 Congratulation!\nYou bought ${c.session.requestPurchaseCoin} 🪙\nYour coins now: ${newCoins} 🪙`
            , {reply_markup: MenuIndex.main.homeButton()})
            /** coin resset */
            c.session.requestPurchaseCoin = 0
        })
    }
    
    async registerWriteCoin(data: UserInfor){
        dataFeature.registerAddUserToTable(String(data.userId))
        dataFeature.registerAddCoinToUser(String(data.userId), data.coins)
    }

    async registerReadUserCoin(userId: string | number) {
        const coin = dataFeature.registerGetCurrentCoin(String(userId))
        return coin
    }

    async registerGetUserBalance(bot: Bot<context>){
        bot.callbackQuery("btn_user_balance_main_information", async(c, next)=>{
            await c.answerCallbackQuery()
            const coins = await this.registerReadUserCoin(c.from.id)
            await c.reply(`You now have ${coins}🪙`, {
                reply_markup: MenuIndex.main.homeButton()
            })
            await c.deleteMessage()
            
        })
    }
}