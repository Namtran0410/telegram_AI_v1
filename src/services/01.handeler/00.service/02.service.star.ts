import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
import { context } from "../../run.js";
import { StarStorage } from "src/utils/storage.star.js";
import { UiIndex as UI } from "../../00.ui/00.index.ui.js";

export class ServiceStar {
  private bot: Bot<context>;
  private storagefunc: StarStorage;
  constructor(bot: Bot<context>) {
    this.bot = bot;
    this.storagefunc = new StarStorage();
  }
  async loadUserStar() {
    this.bot.use(async (c, next) => {
      if (c.session.isActive) {
        /** Lấy userId */
        const userId = c.from?.id;
        const getUserInfor = await this.storagefunc.getStorageUserInfor(
          userId as number,
        );

        c.session.stars = getUserInfor.star || 0;
      }
      await next();
    });
  }
  async actionBuyStar() {
    this.bot.callbackQuery("btn_buy_star", async (c) => {
      //query
      await c.answerCallbackQuery();
      await c.reply("How many Star that you want to buy?", {
        reply_markup: UI.starKeyboard.btnStarToBuy(),
      });
    });

    Object.keys(UI.starKeyboard.starButtonContext).forEach((key: any) => {
      this.bot.callbackQuery(key, async (c) => {
        //Delete
        await c.deleteMessage();
        const addedStars =
          UI.starKeyboard.starButtonContext[
            key as keyof typeof UI.starKeyboard.starButtonContext
          ];
        c.reply(`Do you want to buy : ${addedStars} ⭐`, {
          reply_markup: UI.menuKeyboard.btnConfirmBuy(),
        });
        c.session.tempStarBuy = addedStars;
      });
    });

    /** Deal with button pressed */
    this.bot.callbackQuery("btn_confirm_buy", async (c) => {
      c.session.stars = (c.session.stars || 0) + c.session.tempStarBuy;
      this.storagefunc.storageStarOfUser({
        star: c.session.stars,
        userId: c.from.id,
        username: c.from.username,
      });
      // query
      await c.answerCallbackQuery({
        text: `🎉 Successfully added ${c.session.tempStarBuy} stars!`,
        show_alert: false,
      });

      await c.reply(
        `You have bought ${c.session.tempStarBuy} ⭐, ` +
          `Your account contain ${c.session.stars.toFixed(1)} ⭐, please continue your conversation!`,
        { reply_markup: UI.botKeyboard.btnHomePage() },
      );
    });
    this.bot.callbackQuery("btn_cancel_buy", async (c) => {
      await c.reply("How can I help you next?", {
        reply_markup: UI.botKeyboard.btnHomePage(),
      });
    });
  }
}
