import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
import { context } from "../../run.js";
import { UiIndex as UI } from "../../00.ui/00.index.ui.js";
import { Request } from "../01.request.execution/00.request.index.js";
import { StarStorage } from "src/utils/storage.star.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import path from "node:path";
import fs from "node:fs";

// Cấu hình đường dẫn binary của ffmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export class ServiceAiDocument {
  private bot: Bot<context>;
  private strg: StarStorage;
  private pluggin: PlugginDocument;
  constructor(bot: Bot<context>) {
    this.bot = bot;
    this.strg = new StarStorage();
    this.pluggin = new PlugginDocument();
  }
  /**  */
  async actionGetFileDocument() {
    this.bot.callbackQuery("btn_document", async (c, next) => {
      await c.answerCallbackQuery();
      await next();
    });
    this.bot.on("message:document", async (c) => {
      // Kiểm tra xem có phải file PDF không (tùy chọn)
      console.log("Running");
      const doc = c.msg.document;
      console.log(c.session.isDocument);
      if (c.session.isDocument) {
        if (!doc || !doc.mime_type?.includes("pdf")) {
          return c.reply("File incorrect format");
        }
        const fileInfo = await c.api.getFile(doc.file_id);
        const filePath = fileInfo.file_path;
        const token = process.env.TOKEN_BOT;
        const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

        await this.pluggin.getDocument(downloadUrl, "output");
        await c.reply("File download successful");
      } else if (!c.session.isDocument) {
        await c.reply(
          "Seem like you have just select an other AI, please select AI Document again",
          { reply_markup: UI.menuKeyboard.btnMenu() },
        );
      }
      c.session.isDocument = false;
    });
  }
}

export class PlugginDocument {
  async getDocument(downloadUrl: string, folderName: string) {
    const res = await fetch(downloadUrl);
    if (!res.ok) throw new Error("Error when get file");

    const fileContent = await res.arrayBuffer();
    const buffer = Buffer.from(fileContent);

    const outputDir = path.join(process.cwd(), folderName);
    const fileName = path.join(outputDir, `file_${Date.now()}.pdf`);
    fs.writeFileSync(fileName, buffer);
  }
}
