import { Bot, Context, CommandContext } from "grammy";
import { context } from "src/run.js";
import { CoinNumber, UserInfor } from "src/types/session.type.js";
import fs from "fs";
import fsPromise from "fs/promises";
import { MenuIndex } from "src/00.ui/00.index.ui.js";
import { Mutex } from "async-mutex";
import dataFeature from "src/06.data/03.db/data.feature.js";
import MessageQueueCoin from "src/07.bullMQ/01.bullMQ.stars.js";

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
            const username = c.from.username

            /** ghi đè vào file */
            await this.registerWriteCoin({
                userId, 
                username,
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
        dataFeature.registerAddUserToTable(String(data.userId), data.username)
        await MessageQueueCoin.registerQueueAddCoin({userId: String(data.userId), coin: data.coins})
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
    async registerUserGetDailyReward(bot:Bot<context>) {
        bot.callbackQuery("btn_daily_claim", async(c, next)=>{
            try {
                await c.api.deleteMessage(c.chatId ?? "", c.session.botLastMessageId)
            } catch {
                console.log("No message to delete")
            }
            const userId = c.from.id
            const username = c.from.username
            await c.answerCallbackQuery()
            const addCoinDaily = await dataFeature.registerAddDailyReward(String(c.from.id))
            if(addCoinDaily) {
                await this.registerWriteCoin({
                    userId, 
                    username,
                    coins: 1, 
                })
                const newCoins = await this.registerReadUserCoin(userId)
                const botMsg = await c.reply(
                    `🎉 Congratulation!\nYou have got 1 🪙\nYour coins now: ${newCoins} 🪙`
                , {reply_markup: MenuIndex.main.homeButton()})
                c.session.botLastMessageId = botMsg.message_id
            } else {
                const botMsg = await c.reply(
                    `You have received daily reward, please comeback tomorrow to gain more`
                , {reply_markup: MenuIndex.main.homeButton()})
                c.session.botLastMessageId = botMsg.message_id
            }
        })
    }
}