import { Bot, Context, CommandContext } from "grammy";
import { context } from "src/run.js";
import { MenuFeature } from "../menu/menu.feature.js";
import { MenuIndex } from "src/00.ui/00.index.ui.js";

export class VideoFeature {
    readonly menuFeature = new MenuFeature()

    registerBehavior(bot: Bot<context>){
        bot.on("message:text", async(c, next)=>{
            switch(c.session.botState) {
                case("VIDEO_UPLOADED_AND_WAIT_FOR_TIME_INPUT"):
                    await c.api.deleteMessage(
                        c.chatId,
                        c.session.botLastMessageId
                    )
                    c.session.botLastMessageId = 0
                    await c.reply("Receive your request, please wait for a momment 🔄") 

                    // send video back to user
                    await c.reply("✅ Your videos are ready now", {reply_markup: MenuIndex.main.homeButton()})
                    /** */
                    await this.menuFeature.goTo(c, 'IDLE')
                    break;
                case("VIDEO_UPLOADED_AND_WAIT_FOR_LENGTH_INPUT"):
                    await c.api.deleteMessage(
                        c.chatId,
                        c.session.botLastMessageId
                    )
                    c.session.botLastMessageId = 0
                    await c.reply("Receive your request, please wait for a momment 🔄")

                    // send video back to user
                    await c.reply("✅ Your videos are ready now", {reply_markup: MenuIndex.main.homeButton()})

                    /** */
                    await this.menuFeature.goTo(c, 'IDLE')
                    break;
                case("VIDEO_GENERATE"):
                    await c.api.deleteMessage(
                        c.chatId,
                        c.session.botLastMessageId
                    )
                    c.session.botLastMessageId = 0
                    await c.reply("Receive your request, please wait for a momment 🔄")

                    // send video back to user
                    await c.reply("✅ Your videos are ready now", {reply_markup: MenuIndex.main.homeButton()})

                    /** */
                    await this.menuFeature.goTo(c, 'IDLE')
                    break;
                case("VIDEO_SPECIAL_WAIT_FOR_TEXT_GENERATE"):
                    await c.api.deleteMessage(
                        c.chatId,
                        c.session.botLastMessageId
                    )
                    c.session.botLastMessageId = 0
                    await c.reply("Receive your request, please wait for a momment 🔄")

                    // send video back to user
                    await c.reply("✅ Your videos are ready now", {reply_markup: MenuIndex.main.homeButton()})

                    /** */
                    await this.menuFeature.goTo(c, 'IDLE')
                    break;
            }
            await next()
        })
        bot.on("message:video", async(c, next)=>{
            switch(c.session.botState){
                case("VIDEO_WAIT_FOR_USER_UPLOAD_VIDEO_TIME"):
                    await c.api.deleteMessage(
                        c.chatId,
                        c.session.botLastMessageId
                    )
                    await c.reply("✅ Received your video!");
                    await this.menuFeature.goTo(c, "VIDEO_UPLOADED_AND_WAIT_FOR_TIME_INPUT")
                    break;
                case("VIDEO_WAIT_FOR_USER_UPLOAD_VIDEO_SIZE"):
                    await c.api.deleteMessage(
                        c.chatId,
                        c.session.botLastMessageId
                    )
                    await c.reply("✅ Received your video!");
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