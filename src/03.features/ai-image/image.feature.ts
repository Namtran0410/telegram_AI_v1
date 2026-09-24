import { Bot, Context, CommandContext } from "grammy";
import { context } from "src/run.js";
import { MenuFeature } from "../menu/menu.feature.js";
import { MenuIndex } from "src/00.ui/00.index.ui.js";
export class ImageFeature {
    readonly menuFeature = new MenuFeature()
    registerBehavior(bot: Bot<context>){
        let botMessage:any
        bot.on("message:text", async(c, next)=>{
            switch(c.session.botState){
                case "IMAGE_WAIT_FOR_TEXT":
                    /**Delete message image_wait_for_text */
                    await c.api.deleteMessage(c.chatId, c.session.botLastMessageId)

                    /** Dealing with response data */
                    botMessage = await c.reply("Receive your request, please wait for a momment 🔄") 
                    await c.reply("✅ Your Image are ready now", {reply_markup: MenuIndex.main.homeButton()})

                    /** Back to idle */
                    await this.menuFeature.goTo(c, 'IDLE')
                    break;
                case "IMAGE_GENERATE":
                    /** Dealing with response data */
                    botMessage= await c.reply("Receive your request, please wait for a momment 🔄") 
                    await c.reply("✅ Your Image are ready now", {reply_markup: MenuIndex.main.homeButton()})

                    /** Back to idle */
                    await this.menuFeature.goTo(c, 'IDLE')
                    break;
            }
            await next()
        })
        bot.on("message:photo", async(c, next)=>{
            switch(c.session.botState){
                case "IMAGE_EDIT":
                    /** Delete message that bot ask user to send picture */
                    await c.api.deleteMessage(c.chatId, c.session.botLastMessageId)
                    
                    /** user wait for text description*/
                    botMessage = await c.reply("Receive your picture, what do you want to do with this picture?")
                    await this.menuFeature.goTo(c, 'IMAGE_WAIT_FOR_TEXT')
                    c.session.botLastMessageId = botMessage.message_id
                    break;
            }
            await next()
        })
    }
}