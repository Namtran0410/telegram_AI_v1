import { Bot, Context, CommandContext } from "grammy";
import { context } from "src/run.js";
import { MenuFeature } from "../menu/menu.feature.js";

export class ImageFeature {
    readonly menuFeature = new MenuFeature()
    registerBehavior(bot: Bot<context>){
        bot.on("message:text", async(c, next)=>{
            switch(c.session.botState){
                case "IMAGE_WAIT_FOR_TEXT":
                    c.reply("Receive your request, please wait while we are processing")
                    await this.menuFeature.goTo(c, 'IDLE')
                    break;
                case "IMAGE_GENERATE":
                    c.reply("Receive your request, please wait while we are processing")
                    await this.menuFeature.goTo(c, 'IDLE')
                    break;
            }
            await next()
        })
        bot.on("message:photo", async(c, next)=>{
            switch(c.session.botState){
                case "IMAGE_EDIT":
                    c.reply("Receive your picture, what do you want to do with this picture?")
                    await this.menuFeature.goTo(c, 'IMAGE_WAIT_FOR_TEXT')
                    break;
            }
            await next()
        })
    }
}