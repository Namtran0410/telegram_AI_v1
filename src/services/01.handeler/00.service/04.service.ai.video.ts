import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
import { context } from "../../run.js";
import { UiIndex as UI } from "../../00.ui/00.index.ui.js";
import { Request } from "../01.request.execution/00.request.index.js";
import { StarStorage } from "src/utils/storage.star.js";

export class ServiceAiVideo {
    private bot: Bot<context>;
    private strg: StarStorage
    constructor(bot: Bot<context>) {
        this.bot = bot;
        this.strg = new StarStorage()
    }
    async actionAiVideoSelection(){
        let file_id = ""
        let duration = 0
        this.bot.callbackQuery("btn_cut_video", async(c)=> {
            await c.answerCallbackQuery()
            c.session.isCutVideo = true
            c.reply("Please send you video")
        })
        this.bot.on("message:video", async(c, next)=> {
            console.log(c.session.isCutVideo)
            if(c.session.isCutVideo) {
                await c.reply("How long would you like the video cut to be?")
                file_id = c.msg.video.file_id
                duration = c.msg.video.duration
            }    
            await next()        
        })
        this.bot.on("message:text", async(c)=> {
            const res = await Request.aiVideo.requestCutVideo(file_id, duration, +c.msg.text)
            const userInfor = await this.strg.getStorageUserInfor(c.from.id)
            const videoPrice = Number(process.env.videoPrice) || 0
            const remainStar = userInfor.star  - videoPrice

            await this.strg.storageStarOfUser({
                "username": c.from.username,
                "userId": c.from.id,
                "star": remainStar
            })
            await c.reply(`${res.message}, your star balance now is: $`, {reply_markup: UI.menuKeyboard.btnMenu()})
            


        })
    }
}