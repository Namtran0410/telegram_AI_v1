import { Bot, CallbackQueryContext, CommandContext, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
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

  // 1. Hàm điều hướng tập trung duy nhất
  private async navigateTo(c: CallbackQueryContext<context>, arrayState: BotState[]) {
    if (!arrayState || arrayState.length === 0) {
      arrayState = ["IDLE"];
    }
    const currentState = arrayState[arrayState.length - 1];
    c.session.state = currentState
    console.log({currentState})
    switch (currentState) {
      case "IDLE":
        await c.reply("Please choose your AI model!", {
          reply_markup: UI.menuKeyboard.btnMenu(),
        });
        break;
/** action with video */
      case "AI_VIDEO_SELECT":
        await c.reply("Choosing action with your video", {
          reply_markup: UI.menuKeyboard.btnAiVideo(),
        });
        break;
      case "AI_CUT_VIDEO": 
        await c.reply("You choosed Cut Video, tell me the type of cutting that you want", 
          {
            reply_markup: UI.menuKeyboard.btnCuttingVideoType()
          })
        break;
      case "CUT_VIDEO_BY_TIME":
        await c.reply("You choosed Cut Video by time, Send me your video below",
          {reply_markup: UI.menuKeyboard.btnBack()}
        )
        break;
      case "CUT_VIDEO_BY_LENGTH":
        await c.reply("You choosed Cut Video by length, Send me your video below",
          {reply_markup: UI.menuKeyboard.btnBack()}
        )
        break;
/** action with image */
      case "AI_IMAGE_SELECT":
        await c.reply("Choosing action with your image", {
          reply_markup: UI.menuKeyboard.btnAiImage(),
        });
        break;
      case "AI_IMAGE_EDIT":
        await c.reply("Insert your picture below", {reply_markup: UI.menuKeyboard.btnBack()});
        break;

      case "AI_IMAGE_GENERATE":
        await c.reply("Insert your idea for generating picture",{reply_markup: UI.menuKeyboard.btnBack()});
        break;

/** Balance */
      case "STARS_BALANCE_SELECT":
        const currentStars = c.session?.stars || 0;
        await c.reply(`This is your star balance: ${currentStars.toFixed(1)} ⭐`);
        break;

      case "AI_CONTENT_SELECT":
        await c.reply("Tell me what content you are interested in?");
        break;

      case "PURCHASE_STAR_SELECT":
        await c.reply("You want to buy some stars?");
        break;

      case "HISTORY_SELECT":
        await c.reply("Not updated yet");
        break;

      case "AI_DOCUMENT_SELECT":
        await c.reply("This function is only written for admin");
        break;

      default:
        await c.reply("Please choose your AI model!", {
          reply_markup: UI.menuKeyboard.btnMenu(),
        });
        break;
    }
  }

  // 2. Hàm xử lý nút Back
  private async backToMenu() {
    this.bot.callbackQuery("btn_back", async (c) => {
      await c.deleteMessage()
      await c.answerCallbackQuery();
      
      if (c.session.arrayBotState.length <= 1 || !c.session.arrayBotState) {
        c.session.arrayBotState = ["IDLE"];
      } else {
        c.session.arrayBotState.pop(); 
      }
      
      await this.navigateTo(c, c.session.arrayBotState);
    });
  }

  private async manageContext() {
    // action when user type start
    this.bot.command("start", async (c) => {
      if (c.session.stars === undefined) c.session.stars = 0;
      
      await c.reply(UI.menuKeyboard.welcomeText, {
        reply_markup: UI.botKeyboard.btnHomePage(),
      });
    })

    const mappingButton = {
      // home
      btn_home: "IDLE",
      // video

      btn_ai_video: "AI_VIDEO_SELECT",
      btn_cut_video: "AI_CUT_VIDEO",
      btn_generate_video: "GENERTATE_VIDEO",
      btn_cut_by_time: "CUT_VIDEO_BY_TIME",
      btn_cut_by_length: "CUT_VIDEO_BY_LENGTH",

      //image
      btn_ai_image: "AI_IMAGE_SELECT",
      btn_edit_image: "AI_IMAGE_EDIT",
      btn_generate_image: "AI_IMAGE_GENERATE"
    }

    Object.entries(mappingButton).forEach(([key, config]) => {
      this.bot.callbackQuery(key, async(c)=> {
        await c.deleteMessage()
        await c.answerCallbackQuery()
        c.session.arrayBotState.push(config as BotState)
        await this.navigateTo(c, c.session.arrayBotState) 
      })
    })
  }

  private async contentExecutionHandler() {
    await this.func.user.setActivatedUser();
    await this.func.star.loadUserStar();
    await this.manageContext();
    await this.backToMenu(); 
    await this.func.star.actionBuyStar();
    await this.func.user.actionHome();
    await this.func.aiVideo.actionAiVideoSelection();
    await this.func.aiDocument.actionGetFileDocument();
  }
}