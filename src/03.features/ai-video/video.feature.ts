import { Bot, Context, CommandContext } from "grammy";
import { context } from "src/run.js";
import { MenuFeature } from "../menu/menu.feature.js";
import { MenuIndex } from "src/00.ui/00.index.ui.js";
import { CommonUtilsIndex as plugging } from "src/05.infra/common/00.index.common.js";
import dataFeature from "src/06.data/03.db/data.feature.js";
export class VideoFeature {
    readonly menuFeature = new MenuFeature()

    registerBehavior(bot: Bot<context>){
        bot.on("message:text", async(c, next)=>{
            let botMessage 
            switch(c.session.botState) {
                case("VIDEO_UPLOADED_AND_WAIT_FOR_TIME_INPUT"):
                    try {
                        await c.api.deleteMessage(
                            c.chatId,
                            c.session.botLastMessageId
                        )
                        c.session.botLastMessageId = 0
                        botMessage = await c.reply("Receive your request, please wait for a momment 🔄") 
                    } catch {
                        console.log("User delete message before")
                        botMessage = await c.reply("Receive your request, please wait for a momment 🔄") 
                    }


                    // send video back to user
                    await c.reply("✅ Your videos are ready now", {reply_markup: MenuIndex.main.videoAndHome()})
                    await c.api.deleteMessage(c.chatId, botMessage.message_id)
                    /** */
                    await this.menuFeature.goTo(c, 'IDLE')
                    break;
                case("VIDEO_UPLOADED_AND_WAIT_FOR_LENGTH_INPUT"):
                    try {
                        await c.api.deleteMessage(
                            c.chatId,
                            c.session.botLastMessageId
                        )
                        c.session.botLastMessageId = 0
                        botMessage = await c.reply("Receive your request, please wait for a momment 🔄") 
                    } catch {
                        console.log("User delete message before")
                        botMessage = await c.reply("Receive your request, please wait for a momment 🔄") 
                    }

                    /**send video back to user */ 
                    await c.reply("✅ Your videos are ready now", {reply_markup: MenuIndex.main.videoAndHome()})
                    await c.api.deleteMessage(c.chatId, botMessage.message_id)

                    /** */
                    await this.menuFeature.goTo(c, 'IDLE')
                    break;
                case("VIDEO_GENERATE"):
                try{
                    await c.api.deleteMessage(
                        c.chatId,
                        c.session.botLastMessageId
                    )
                    c.session.botLastMessageId = 0
                    botMessage = await c.reply("Receive your request, please wait for a momment 🔄")
                } catch {
                    console.log("User delete message before!")
                    botMessage = await c.reply("Receive your request, please wait for a momment 🔄")
                }
                    // send video back to user
                    await c.reply("✅ Your videos are ready now", {reply_markup: MenuIndex.main.videoAndHome()})
                    await c.api.deleteMessage(c.chatId, botMessage.message_id)
                    /** */
                    await this.menuFeature.goTo(c, 'IDLE')
                    break;
                case("VIDEO_SPECIAL_WAIT_FOR_TEXT_GENERATE"):
                    try {
                        await c.api.deleteMessage(
                            c.chatId,
                            c.session.botLastMessageId
                        )
                        c.session.botLastMessageId = 0
                        botMessage = await c.reply("Receive your request, please wait for a momment 🔄")
                    } catch {
                        console.log("User delete message before")
                        botMessage = await c.reply("Receive your request, please wait for a momment 🔄")
                    }
                // send video back to user
                await c.reply("✅ Your videos are ready now", {reply_markup: MenuIndex.main.videoAndHome()})
                await c.api.deleteMessage(c.chatId, botMessage.message_id)
                /** */
                await this.menuFeature.goTo(c, 'IDLE')
                break;
            }
            await next()
        })
        bot.on("message:video", async(c, next)=>{
            switch(c.session.botState){
                case("VIDEO_WAIT_FOR_USER_UPLOAD_VIDEO_TIME"):
                    try {
                        await c.api.deleteMessage(
                            c.chatId,
                            c.session.botLastMessageId
                        )
                        await c.reply("✅ Received your video!");
                    } catch {
                        console.log("User delete message before")
                        await c.reply("✅ Received your video!");
                    }
                    await this.menuFeature.goTo(c, "VIDEO_UPLOADED_AND_WAIT_FOR_TIME_INPUT")
                    break;
                case("VIDEO_WAIT_FOR_USER_UPLOAD_VIDEO_SIZE"):
                    try {
                        await c.api.deleteMessage(
                            c.chatId,
                            c.session.botLastMessageId
                        )
                        await c.reply("✅ Received your video!");
                    } catch {
                        console.log("User delete message before")
                        await c.reply("✅ Received your video!");
                    }
                    await this.menuFeature.goTo(c, "VIDEO_UPLOADED_AND_WAIT_FOR_LENGTH_INPUT")
                    break;
            }
            await next()
        })
        bot.on("message:photo", async(c, next)=> {
            switch(c.session.botState){
                case("VIDEO_GENERATE_SPECIAL"): 
                    await c.reply("Received your photo, now what we will do with this?")
                    await this.menuFeature.goTo(c, "VIDEO_SPECIAL_WAIT_FOR_TEXT_GENERATE")
                    break
            }
            await next()
        })
    }
}