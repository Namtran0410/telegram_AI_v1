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
    // Chuyển state thì sẽ xuất hiện button tiếp theo
    private async render(c: context, arrayState: BotState[]) {
        if (!arrayState || arrayState.length === 0) {
            arrayState = ["MENU"];
        }
        const currentState = arrayState[arrayState.length - 1];
        c.session.botState = currentState;
        console.log({currentState})
        let botMessage
        switch (currentState) {
            case "START":
                await c.reply("Hello!", { reply_markup: MenuIndex.main.welcomeContext()});
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
                botMessage= await c.reply("You choose edit image, send us your image")
                c.session.botLastMessageId = botMessage.message_id
                break;
            case "IMAGE_GENERATE":
                await c.reply("Tell me what you want to create")
                break;
            case "VIDEO_CUT":
                await c.reply("Choose tool that you want", {reply_markup:MenuIndex.video.cutVideoOption() })
                break;
            // chọn edit video
            case "VIDEO_EDIT":
                await c.reply("Tell me what type of edit video that you want", {
                    reply_markup: MenuIndex.video.cutVideoOption()
                })
                break;
            // chờ user upload video
            case "VIDEO_WAIT_FOR_USER_UPLOAD_VIDEO_TIME":
                botMessage = await c.reply("You choosed cut video by time, Please send your video for editing", {
                    reply_markup: MenuIndex.main.backButton()
                })
                c.session.botLastMessageId = botMessage.message_id
                break;
            // chờ user gửi duration time
            case "VIDEO_UPLOADED_AND_WAIT_FOR_TIME_INPUT":
                botMessage = await c.reply("Tell me the duration that you want",{
                    reply_markup: MenuIndex.main.backButton()
                })
                c.session.botLastMessageId = botMessage.message_id
                break;
            // chờ user upload video
            case "VIDEO_WAIT_FOR_USER_UPLOAD_VIDEO_SIZE":
                await c.reply("You choose cut video by size, Please send your video for editing", {
                    reply_markup: MenuIndex.main.backButton()
                })
                break;
            // chờ user gửi cutting size
            case "VIDEO_UPLOADED_AND_WAIT_FOR_LENGTH_INPUT":
                await c.reply("Tell me the size that you want to cut", {
                    reply_markup: MenuIndex.main.backButton()
                })
                break;
            case "VIDEO_GENERATE_SPECIAL":
                await c.reply("Please share with us the image that you want to base on it", {
                    reply_markup: MenuIndex.main.homeButton()
                })
                break
            case "VIDEO_GENERATE":
                await c.reply("Please tell me your idea", {
                    reply_markup: MenuIndex.main.homeButton()
                })
            case "MENU_COINS":
                await c.reply("Please select coins number that you want to purchase", {
                    reply_markup: MenuIndex.coins.subMenu()
                })
        }
    }
    // Bấm nút => Chuyển state
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
            },
            "btn_sub_cut_video": {
                state: "VIDEO_CUT"
            },
            "btn_sub_cut_by_time": {
                state: "VIDEO_WAIT_FOR_USER_UPLOAD_VIDEO_TIME"
            },
            "btn_sub_cut_by_length": {
                state: "VIDEO_WAIT_FOR_USER_UPLOAD_VIDEO_SIZE"
            },
            "btn_sub_gen_video":{
                state: "VIDEO_GENERATE"
            },
            "btn_sub_gen_special_video": {
                state: "VIDEO_GENERATE_SPECIAL"
            },
            "btn_menu_star_purchase": {
                state: "MENU_COINS"
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
            if (!c.session.coins) c.session.coins = 0;
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