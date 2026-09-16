import { InlineKeyboard } from "grammy";

export const VideoMenu = {
    subMenu : (): InlineKeyboard=> {
        return new InlineKeyboard()
        .text("✂️ Cut Video", "btn_sub_cut_video")
        .text("🎛️ Edit Video", "btn_sub_edit_video")
        .row()
        .text("Generate Video By Text And Picture", "btn_sub_gen_special_video")
        .row()
        .text("🔮 Generate Video", "btn_sub_gen_video")
        .row()
        .text("🔙 Back", "btn_back")
    },
    generate: (): InlineKeyboard=>{
        return new InlineKeyboard()
        .text("6s Video").text("30s Video")
        .row()
        .text("60s Video").text("90s Video")
        .text("🔙 Back", "btn_back")
    },
    cutVideoOption:(): InlineKeyboard => {
        return new InlineKeyboard()
        .text("Cut By Time", "btn_sub_cut_by_time")
        .text("Cut By Length", "btn_sub_cut_by_length")
        .text("🔙 Back", "btn_back")
    },
}