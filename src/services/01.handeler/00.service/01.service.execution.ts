import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
import { context } from "../../run.js";
import { StarStorage } from "src/utils/storage.star.js";
import { UiIndex as UI } from "../../00.ui/00.index.ui.js";
import { ServiceIndex as func } from "./00.service.index.js";
export class ContentExecution {
    private bot: Bot<context>;
    private storagefunc : StarStorage
    private func: func
    constructor(bot: Bot<context>) {
        this.bot = bot;
        this.func = new func(this.bot)
        this.contentExecutionHandler();
        this.storagefunc = new StarStorage()
    }

    private async manageContext() {
        this.bot.command("start", async (c) => {
            c.session.isAiContent = false;
            c.session.isAiImage = false;
            c.session.isAiVideo = false;
            if (c.session.stars === undefined) c.session.stars = 0;
            await c.reply(UI.menuKeyboard.welcomeText, { reply_markup: UI.botKeyboard.btnHomePage() });
        });

        this.bot.callbackQuery("btn_star_balance", async (c) => {
            await c.answerCallbackQuery();
            const currentStars = c.session?.stars || 0;
            await c.reply(`This is your star balance: ${currentStars.toFixed(3)} ⭐`);
        });

        const aiActions = {
            "btn_ai_content": { text: "Tell me what content you are interested in?", flag: "isAiContent" },
            "btn_ai_image": { text: "Describe the image you want to generate:", flag: "isAiImage" },
            "btn_ai_video": { text: "Describe the video concept you want:", flag: "isAiVideo" }
        };

        Object.entries(aiActions).forEach(([key, config]) => {
            this.bot.callbackQuery(key, async (c) => {
                await c.answerCallbackQuery();
                
                const currentStars = c.session?.stars || 0;

                if (currentStars > 0) {
                    c.session.isAiContent = false;
                    c.session.isAiImage = false;
                    c.session.isAiVideo = false;

                    (c.session as any)[config.flag] = true;

                    if(key == "btn_ai_video") {
                        await c.reply("Chosing action with your video", {reply_markup: UI.menuKeyboard.btnAiVideo()})
                    } else {
                        await c.reply(config.text);
                    }
                } else {
                    await c.answerCallbackQuery({
                        text: "⚠️ You have run out of stars! Please top up.",
                        show_alert: true
                    });
                    await c.reply("Seem like you run out of star", { reply_markup: UI.botKeyboard.btnHomePage() });
                }
            });
        });
    }

    private async contentExecutionHandler() {
        await this.func.user.setActivatedUser()
        await this.func.star.loadUserStar()
        await this.manageContext();
        await this.func.star.actionBuyStar();
        await this.func.user.actionHome();
        await this.func.aiVideo.actionAiVideoSelection()
    }
}