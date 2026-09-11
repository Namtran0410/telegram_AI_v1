import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
import { context } from "../../run.js";
import { UiIndex as UI } from "../../00.ui/00.index.ui.js";
import { Request } from "../01.request.execution/00.request.index.js";
import { StarStorage } from "src/utils/storage.star.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";

// Cấu hình đường dẫn binary của ffmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export class ServiceAiVideoGenerating {
  private bot: Bot<context>;
  private strg: StarStorage;
  constructor(bot: Bot<context>) {
    this.bot = bot;
    this.strg = new StarStorage();
  }
  /**  */
  async actionVideoAiGeneration() {
    this.bot.callbackQuery("btn_generate_video", async (c) => {
      c.session.state = 'AI_VIDEO_SELECT'
      if (c.session.state == "AI_VIDEO_SELECT") {
        await c.answerCallbackQuery();
        await c.reply("Please choose your video length", {
          reply_markup: UI.menuKeyboard.btnGenVideoSelection(),
        });
        const listOption = ["6", "30", "60", "120"];
        for (let i of listOption) {
          const btn = `btn_gen_video_${i}s`;

          this.bot.callbackQuery(btn, async (c) => {
            await c.answerCallbackQuery();
            await c.reply(
              `You choosed AI generate mode for ${i}s video \nPlease describe your idea and send it to me`,
              { reply_markup: UI.botKeyboard.btnHomePage() },
            );
            c.session.state='GENERTATE_VIDEO'
            c.session.duration = Number(i);
          });
        }
        this.bot.on("message:text", async (c, next) => {
          console.log("BOT STATE: ", c.session.state)
          if (
            c.session.state=='GENERTATE_VIDEO'
          ) {
            const text = c.msg.text;
            const res = await Request.aiVideo.requestGenVideo(
              c.from.id,
              c.session.duration,
              text,
            );
            await c.reply(res.message, {
              reply_markup: UI.menuKeyboard.btnMenu(),
            });
            c.session.state = "IDLE";
          }
          await next()
        });
      }
    });
  }
}
