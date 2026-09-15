import { Bot, Context, CommandContext } from "grammy";
import { context } from "src/run.js";
import { BotState } from "src/types/session.type.js";
import { MenuIndex } from "src/00.ui/00.index.ui.js";
export class MenuFeature {
    // Gộp "push state" + "render" thành 1 hàm duy nhất — điểm vào DUY NHẤT để chuyển màn
    async goTo(c: context, newState: BotState) {
        if (!c.session.arrayBotState) {
            c.session.arrayBotState = ["MENU"];
        }
        c.session.arrayBotState.push(newState);
        await this.render(c, c.session.arrayBotState);
    }

    // Tách riêng phần "render theo state hiện tại" — dùng lại được cho cả navigate lẫn back
    private async render(c: context, arrayState: BotState[]) {
        if (!arrayState || arrayState.length === 0) {
            arrayState = ["MENU"];
        }
        const currentState = arrayState[arrayState.length - 1];
        c.session.botState = currentState;

        switch (currentState) {
            case "START":
                await c.reply("Hello!", { reply_markup: MenuIndex.main.welcomeContext() });
                break;
            case "MENU":
                await c.reply("Please choose your AI model below", { reply_markup: MenuIndex.main.mainScreen() });
                break;
            case "MENU_IMAGE":
                await c.reply("Please choose your image edit tool", { reply_markup: MenuIndex.image.subMenu() });
                break;
            case "MENU_VIDEO":
                await c.reply("Please choose your video edit tool", { reply_markup: MenuIndex.video.subMenu() });
                break;
            case "IMAGE_EDIT":
                await c.reply("You choose edit image, send us your image")
                break;
            case "IMAGE_GENERATE":
                await c.reply("Tell me what you want to create")
                break;
            case "VIDEO_CUT":
                await c.reply("Send me your video that you want to cut")
                break;
            case "VIDEO_EDIT":
                await c.reply("Tell me what type of edit video that you want", {
                    reply_markup: MenuIndex.video.cutVideoOption()
                })
                break;
        }
    }
    registerNavigation(bot: Bot<context>){
        const pairButtonState = {
            "btn_home": {
                state: "MENU",
            },
            "btn_image_main_editing": {
                state: "MENU_IMAGE",
            },
            "btn_video_main_editing": {
                state: "MENU_VIDEO",
            },
            "btn_sub_edit_image": {
                state: "IMAGE_EDIT"
            },
            "btn_sub_gen_image": {
                state: "IMAGE_GENERATE"
            }
        }
        Object.entries(pairButtonState).forEach(([btn, val])=> {
            bot.callbackQuery(btn, async(c)=> {
                await c.deleteMessage().catch(() => {});
                await this.goTo(c, val.state as BotState);
            })
        })
    }
    // Back thì dùng lại render(), vì Back không "push" state mới, mà "pop" state cũ
    async goBack(c: context) {
        if (!c.session.arrayBotState || c.session.arrayBotState.length <= 1) {
            c.session.arrayBotState = ["MENU"];
        } else {
            c.session.arrayBotState.pop();
        }
        await this.render(c, c.session.arrayBotState);
    }

    registerRoutes(bot: Bot<context>) {
        bot.command("start", async (c) => {
            if (!c.session.stars) c.session.stars = 0;
            c.session.arrayBotState = ["START"];
            await this.goTo(c, "START");   // 1 lệnh — không cần nhớ 2 bước
        });

        bot.callbackQuery("btn_back", async (c) => {
            await c.deleteMessage();
            await c.answerCallbackQuery();
            await this.goBack(c);          // 1 lệnh
        });
    }
}