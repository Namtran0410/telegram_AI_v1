import { InlineKeyboard } from "grammy";

export const ImageMenu = {
    subMenu: ():InlineKeyboard=>{
        return new InlineKeyboard()
        .text("✏️ Edit Image", "btn_sub_edit_image")
        .text("🎨 Generate Image", "btn_sub_gen_image")
        .row()
        .text("🔙 Back", "btn_back")
    }
}