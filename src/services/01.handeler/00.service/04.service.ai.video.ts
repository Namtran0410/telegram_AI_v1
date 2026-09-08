import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
import { context } from "../../run.js";
import { UiIndex as UI } from "../../00.ui/00.index.ui.js";
import { Request } from "../01.request.execution/00.request.index.js";

export class ServiceAiVideo {
    private bot: Bot<context>;
    constructor(bot: Bot<context>) {
        this.bot = bot;
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
            // Thêm trường hợp user nhập chữ
            const res = await Request.aiVideo.requestCutVideo(file_id, duration, +c.msg.text)
            await c.reply(res.message, {reply_markup: UI.menuKeyboard.btnMenu()})
        })
    }
}