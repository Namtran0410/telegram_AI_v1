import { InlineKeyboard } from "grammy";

export const MainMenu = {
    welcomeContext: ():InlineKeyboard=> {
        return new InlineKeyboard()
        .text("🏠 Home", "btn_home")
        .text("💳 Purchase Star", "btn_menu_star_purchase")
    },
    homeButton:():InlineKeyboard=> {
        return new InlineKeyboard().text("🏠 Home", "btn_home")
    },
    backButton:():InlineKeyboard=> {
        return new InlineKeyboard().text("🔙 Back", "btn_back")
    },
    mainScreen: (): InlineKeyboard => {
        return new InlineKeyboard()
        .text("🖼️ Image Editing", "btn_image_main_editing")
        .text("🎬 Video Editing", "btn_video_main_editing")
        .row()
        .text("🎵 TikTok Generating", "btn_tiktok_main_generating")
        .text("💰 User Balance", "btn_user_balance_main_information")
        .row()
        .text("💳 Purchase Star", "btn_menu_star_purchase")
        .row()
        .text("🚀 Contact me!", "btn_contact_main")
    },
    waitForResource: (): InlineKeyboard => {
        return new InlineKeyboard()
        .text("Wait when resource is syncing 🔄")
    }
}