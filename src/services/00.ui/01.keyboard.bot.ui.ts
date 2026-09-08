import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
export class BotKeyboard {
  btnHomePage(): InlineKeyboard {
    return new InlineKeyboard()
      .text("Home Page", "btn_home")
      .text("Buy more star", "btn_buy_star");
  }
}
