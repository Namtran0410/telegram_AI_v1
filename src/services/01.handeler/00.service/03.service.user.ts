import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
import { context } from "../../run.js";
import { UiIndex as UI } from "../../00.ui/00.index.ui.js";
import { User } from "src/utils/storage.star.js";

export class ServiceUser {
  private bot: Bot<context>;
  constructor(bot: Bot<context>) {
    this.bot = bot;
  }
  async setActivatedUser() {
    this.bot.use(async (c, next) => {
      if (c.session) {
        c.session.isActive = true;
      }
      await next();
    });
  }

  async actionHome() {
    this.bot.callbackQuery("btn_home", async (c) => {
      //Delete
      c.session.state = "IDLE";

      // callback query
      await c.answerCallbackQuery();
      await c.reply("Choosing your AI service!", {
        reply_markup: UI.menuKeyboard.btnMenu(),
      });
    });
  }
}
