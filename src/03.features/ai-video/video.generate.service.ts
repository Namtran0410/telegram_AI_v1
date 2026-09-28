import { generateVideoLength as length} from "src/types/session.type.js"
import { Bot, Context, CommandContext } from "grammy";
import { context } from "src/run.js";
import { BotState } from "src/types/session.type.js";
import { MenuIndex } from "src/00.ui/00.index.ui.js";
import { CommonUtilsIndex as plugging } from "src/05.infra/common/00.index.common.js";
import dataFeature from "src/06.data/03.db/data.feature.js";
export class GenerateVideoFeature {
    async registerBehavior(bot: Bot<context>){
        for(let i of length) {
            bot.callbackQuery(`btn_generate_video_${i}`, async(c, next)=> {
                await c.answerCallbackQuery()
                c.session.botState = `VIDEO_GENERATE_FOR_${i}_SECONDS` as BotState
                const botMessage = await c.reply(`You choose Video Length: ${i} seconds. Tell me the description of the video`, {
                    reply_markup: MenuIndex.main.homeButton()
                })
                try {
                    await c.api.deleteMessage(
                        c.chatId ?? "",
                        c.session.botLastMessageId
                    )
                    c.session.botLastMessageId = 0
                } catch {   
                    console.log("Message has been deleted before")
                }
                c.session.botLastMessageId = botMessage.message_id
            })
            bot.on("message:text", async(c, next)=> {
                // send video back to user
                if(c.session.botState == `VIDEO_GENERATE_FOR_${i}_SECONDS` as BotState) {
                    try {
                        await c.api.deleteMessage(
                            c.chatId ?? "",
                            c.session.botLastMessageId
                        )
                        c.session.botLastMessageId = 0
                    } catch {
                        c.session.botLastMessageId = 0
                    }
                    const watingMsg = await c.reply("Receive your request, please wait for a momment 🔄")
                    await c.reply("✅ Your videos are ready now", {reply_markup: MenuIndex.main.videoAndHome()})
                    await c.api.deleteMessage(c.chatId, watingMsg.message_id)
                    c.session.videoId = plugging.data.generateData("string", 10)
                    
                    await dataFeature.registerAddMediaInformation({
                        "generation_id": `${String(Date.now())}_${c.from.id}`,
                        "request_received_time": String(Date.now()),
                        "status": "SUCCESS",
                        "type": "video",
                        "user_id": String(c.from.id)
                    })
                }
            await next()
            })
        }
    }
}

export default new GenerateVideoFeature()