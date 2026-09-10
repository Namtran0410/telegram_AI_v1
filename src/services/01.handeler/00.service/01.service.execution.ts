import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
import { context } from "../../run.js";
import { StarStorage } from "src/utils/storage.star.js";
import { UiIndex as UI } from "../../00.ui/00.index.ui.js";
import { ServiceIndex as func } from "./00.service.index.js";
import { BotState } from "src/types/session.type.js";
export class ContentExecution {
  private bot: Bot<context>;
  private storagefunc: StarStorage;
  private func: func;
  constructor(bot: Bot<context>) {
    this.bot = bot;
    this.func = new func(this.bot);
    this.contentExecutionHandler();
    this.storagefunc = new StarStorage();
  }
  private async handelerIdleState() {
    this.bot.on("message:text", async (c, next) => {
      if (c.session.state == "IDLE") {
        await c.reply("Please choose your AI model!", {
          reply_markup: UI.menuKeyboard.btnMenu(),
        });
      }
      await next();
    });
  }

  private async manageContext() {
    this.bot.command("start", async (c) => {
      c.session.isAiContent = false;
      c.session.isAiImage = false;
      c.session.isAiVideo = false;
      if (c.session.stars === undefined) c.session.stars = 0;
      await c.reply(UI.menuKeyboard.welcomeText, {
        reply_markup: UI.botKeyboard.btnHomePage(),
      });
    });

    this.bot.callbackQuery("btn_star_balance", async (c) => {
      await c.answerCallbackQuery();
      const currentStars = c.session?.stars || 0;
      await c.reply(`This is your star balance: ${currentStars.toFixed(1)} ⭐`);
    });

    const aiActions = {
      btn_star_balance: {
        text: "This is your star balance",
        flag: "isCheckStar",
        state: "STARS_BALANCE_SELECT",
      },
      btn_ai_content: {
        text: "Tell me what content you are interested in?",
        flag: "isAiContent",
        state: "AI_CONTENT_SELECT",
      },
      btn_ai_image: {
        text: "Describe the image you want to generate:",
        flag: "isAiImage",
        state: "AI_IMAGE_SELECT",
      },
      btn_ai_video: {
        text: "Describe the video concept you want:",
        flag: "isAiVideo",
        state: "AI_VIDEO_SELECT",
      },
      btn_buy_star: {
        text: "You want to buy some stars? ",
        flag: "isBuying",
        state: "PURCHASE_STAR_SELECT",
      },
      btn_history: {
        text: "Not updated yet",
        flag: "isHistory",
        state: "HISTORY_SELECT",
      },
      btn_document: {
        text: "This function is only written for admin",
        flag: "isDocument",
        state: "AI_DOCUMENT_SELECT",
      },
    };

    Object.entries(aiActions).forEach(([key, config]) => {
      this.bot.callbackQuery(key, async (c) => {
        await c.answerCallbackQuery();

        const currentStars = c.session?.stars || 0;

        if (currentStars > 0) {
          c.session.isAiContent = false;
          c.session.isAiImage = false;
          c.session.isAiVideo = false;
          c.session.isDocument = false;
          c.session.isCheckStar = false;
          c.session.isBuying = false;
          c.session.isHistory = false;

          (c.session as any)[config.flag] = true;
          c.session.state = config.state as BotState;

          if (key == "btn_ai_video") {
            await c.reply("Choosing action with your video", {
              reply_markup: UI.menuKeyboard.btnAiVideo(),
            });
          } else if (key == "btn_ai_content") {
            c.session.state = "AI_CONTENT_SELECT";
            c.reply(config.text);
          } else {
            await c.reply(config.text);
          }
        } else {
          await c.answerCallbackQuery({
            text: "⚠️ You have run out of stars! Please top up.",
            show_alert: true,
          });
          await c.reply("Seem like you run out of star", {
            reply_markup: UI.botKeyboard.btnHomePage(),
          });
        }
      });
    });
  }

  private async contentExecutionHandler() {
    await this.func.user.setActivatedUser();
    await this.func.star.loadUserStar();
    await this.manageContext();
    await this.func.star.actionBuyStar();
    await this.func.user.actionHome();
    await this.func.aiVideo.actionAiVideoSelection();
    await this.func.aiDocument.actionGetFileDocument();
    await this.func.aiVideoGenerating.actionVideoAiGeneration();
    await this.handelerIdleState();
  }
}
