import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
export class StarKeyboard {
  readonly starButtonContext = {
    btn_10_star: 10,
    btn_30_star: 30,
    btn_50_star: 50,
    btn_70_star: 70,
    btn_100_star: 100,
    btn_200_star: 200,
    btn_300_star: 300,
    btn_500_star: 500,
    btn_1000_star: 1000,
  };
  btnStarToBuy(): InlineKeyboard {
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
}
