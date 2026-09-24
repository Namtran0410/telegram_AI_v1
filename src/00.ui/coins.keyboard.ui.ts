import { InlineKeyboard } from "grammy";

export const CoinMenu = {
    subMenu : (): InlineKeyboard=> {
        return new InlineKeyboard()
        .text("🪙 100 coins", "btn_star_select_100")
        .text("🪙 250 coins", "btn_star_select_250")
        .row()
        .text("🪙 500 coins", "btn_star_select_500")
        .text("🪙 1000 coins", "btn_star_select_1000")
        .row()
        .text("🏠 Home", "btn_home")
    },
    starPurchaseAction: (): InlineKeyboard=>{
        return new InlineKeyboard()
        .text("Confirm", "btn_confirm_purchase")
        .text("🏠 Home", "btn_home")
    }
}
