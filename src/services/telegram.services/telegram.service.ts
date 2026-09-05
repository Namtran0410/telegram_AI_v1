import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
import { context } from "../run.js";
import { StarStorage } from "src/utils/storage.star.js";

export class ContentExecution {
    private bot: Bot<context>;
    private storagefunc : StarStorage
    constructor(bot: Bot<context>) {
        this.bot = bot;
        this.contentExecutionHandler();
        this.storagefunc = new StarStorage()
    }

    private starButtonContext = {
        "btn_10_star": 10,
        "btn_30_star": 30,
        "btn_50_star": 50,
        "btn_70_star": 70,
        "btn_100_star": 100,
        "btn_200_star": 200,
        "btn_300_star": 300,
        "btn_500_star": 500,
        "btn_1000_star": 1000
    };

    private welcomeText = 
`Welcome aboard! 🚀 I'm your all-in-one AI assistant, ready to help you create, generate, and explore without limits.

Here is everything you can do with me right at your fingertips:

⭐ Stars Balance: Check your current balance and rewards instantly.

✍️ AI Content: Generate engaging text, copy, articles, or ideas in seconds.

🖼 AI Image: Transform your imagination into stunning visual artwork.

🎬 AI Video: Bring dynamic video concepts to life effortlessly.

💳 Top up Stars: Top up your balance anytime to keep the creativity flowing.

📜 History: Review your past prompts, generations, and activities.

Tap any option below or type your request to get started! Let's build something amazing together. ✨`;

    private btnHomePage(): InlineKeyboard {
        return new InlineKeyboard()
            .text("Home Page", "btn_home")
            .text("Buy more star", "btn_buy_star");
    }

    private btnMenu(): InlineKeyboard {
        return new InlineKeyboard()
            .text("⭐ Stars Balance", "btn_star_balance")
            .text("✍️ AI Content", "btn_ai_content")
            .row()
            .text("🎨 AI Image", "btn_ai_image")
            .text("🎬 AI Video", "btn_ai_video")
            .row()
            .text("💳 Top up Stars", "btn_buy_star")
            .text("📜 History", "btn_history_star");
    }

    private btnStarToBuy(): InlineKeyboard {
        return new InlineKeyboard()
            .text("10⭐", "btn_10_star")
            .text("30⭐", "btn_30_star")
            .text("50⭐", "btn_50_star")
            .text("70⭐", "btn_70_star")
            .row()
            .text("100⭐", "btn_100_star")
            .text("200⭐", "btn_200_star")
            .text("300⭐", "btn_300_star")
            .text("500⭐", "btn_500_star")
            .row()
            .text("1000⭐", "btn_1000_star");
    }

    private async actionBuyStar() {
        this.bot.callbackQuery("btn_buy_star", async (c) => {
            await c.answerCallbackQuery();
            await c.reply("How many Star that you want to buy?", { reply_markup: this.btnStarToBuy() });
        });

        Object.keys(this.starButtonContext).forEach((key: any) => {
            this.bot.callbackQuery(key, async (c) => {
                const addedStars = this.starButtonContext[key as keyof typeof this.starButtonContext];
                c.session.stars = (c.session.stars || 0) + addedStars;
                this.storagefunc.storageStarOfUser({"star": c.session.stars, "userId": c.from.id, "username": c.from.username})

                await c.answerCallbackQuery({
                    text: `🎉 Successfully added ${addedStars} stars!`,
                    show_alert: false
                });

                await c.reply(
                    `You have bought ${addedStars} ⭐, ` +
                    `Your account contain ${c.session.stars} ⭐, please continue your conversation!`, 
                    { reply_markup: this.btnHomePage() }
                );
            });
        });
    }

    private async actionHome() {
        this.bot.callbackQuery("btn_home", async (c) => {
            await c.answerCallbackQuery();
            await c.reply("Choosing your AI service!", { reply_markup: this.btnMenu() });
        });
    }

    private async manageContext() {
        this.bot.command("start", async (c) => {
            c.session.isAiContent = false;
            c.session.isAiImage = false;
            c.session.isAiVideo = false;
            if (c.session.stars === undefined) c.session.stars = 0;
            await c.reply(this.welcomeText, { reply_markup: this.btnHomePage() });
        });

        this.bot.callbackQuery("btn_star_balance", async (c) => {
            await c.answerCallbackQuery();
            const currentStars = c.session?.stars || 0;
            await c.reply(`This is your star balance: ${currentStars} ⭐`);
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

                    await c.reply(config.text);
                } else {
                    await c.answerCallbackQuery({
                        text: "⚠️ You have run out of stars! Please top up.",
                        show_alert: true
                    });
                    await c.reply("Seem like you run out of star", { reply_markup: this.btnHomePage() });
                }
            });
        });

        this.bot.on("message:text", async (c) => {
            if (c.session.isAiContent || c.session.isAiImage || c.session.isAiVideo) {
                if ((c.session.stars || 0) > 0) {
                    c.session.stars--;
                     
                    this.storagefunc.storageStarOfUser({"star": c.session.stars, "userId": c.from.id, "username": c.from.username})

                    let modeName = "AI Content";
                    if (c.session.isAiImage) modeName = "AI Image";
                    if (c.session.isAiVideo) modeName = "AI Video";

                    await c.reply(`✨ ${modeName} processed successfully! Remaining stars: ${c.session.stars} ⭐`);
                } else {
                    await c.reply("⚠️ You have run out of stars! Please top up.");
                }

                await c.reply("Navigate to somewhere?", { reply_markup: this.btnHomePage() });
            } else {
                await c.reply("Navigate to somewhere?", { reply_markup: this.btnHomePage() });
            }
        });
    }

    private async contentExecutionHandler() {
        await this.manageContext();
        await this.actionBuyStar();
        await this.actionHome();
    }
}