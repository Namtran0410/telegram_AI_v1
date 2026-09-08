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
import { InputFile } from "grammy";

// Cấu hình đường dẫn binary của ffmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export class ServiceAiVideo {
  private bot: Bot<context>;
  private strg: StarStorage;
  private plugginVideo: PlugginVideo;
  constructor(bot: Bot<context>) {
    this.bot = bot;
    this.strg = new StarStorage();
    this.plugginVideo = new PlugginVideo();
  }
  async actionAiVideoSelection() {
    this.bot.callbackQuery("btn_cut_video", async (c) => {
      await c.answerCallbackQuery();
      c.session.isCutVideo = true;
      c.reply("Please send your video!");
    });
    this.bot.on("message:video", async (c, next) => {
      console.log(c.session.isCutVideo);
      if (c.session.isCutVideo) {
        await c.reply("How long would you like the video cut to be? (seconds)");
        c.session.file_id = c.msg.video.file_id;
        c.session.duration = c.msg.video.duration;
      }
      await next();
    });
    this.bot.on("message:text", async (c) => {
      const res = await Request.aiVideo.requestCutVideo(
        c.session.file_id,
        c.session.duration,
        +c.msg.text,
      );
      const userInfor = await this.strg.getStorageUserInfor(c.from.id);

      /** Get video from telegram */
      const fileInfor = await c.api.getFile(c.session.file_id);
      const filePath = fileInfor.file_path;
      const token = process.env.TOKEN_BOT;
      const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`;

      const response = await fetch(downloadUrl);
      if (!response.ok)
        throw new Error("Không thể tải file từ server Telegram");

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadDir = path.join(process.cwd(), "uploads");
      const outputDir = path.join(process.cwd(), `output/${c.from.id}`);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const localFilePath = path.join(uploadDir, `video_${Date.now()}.mp4`);
      fs.writeFileSync(localFilePath, buffer);

      /** Cut video by time */
      const cutFile = await this.plugginVideo.cutVideoBySecond(
        localFilePath,
        outputDir,
        Number(c.msg.text),
      );

      for (let item = 0; item < cutFile.length; item++) {
        const filePath = cutFile[item];
        await c.replyWithVideo(new InputFile(filePath), {
          caption: `Part ${item + 1}`,
        });
      }
      if (fs.existsSync(outputDir)) {
        fs.rmSync(outputDir, { recursive: true, force: true });
        console.log("Clear data generation success");
      }
      if (fs.existsSync(uploadDir)) {
        fs.rmSync(uploadDir, { recursive: true, force: true });
        console.log("Clear data uploaded success");
      }

      /** Deal with upload information*/
      const videoPrice = Number(process.env.videoPrice) || 0;
      const remainStar = (userInfor.star - videoPrice).toFixed(1);
      await this.strg.storageStarOfUser({
        username: c.from.username,
        userId: c.from.id,
        star: Number(remainStar),
      });
      await c.reply(
        `${res.message}, your star balance now is: ${remainStar} ⭐`,
        { reply_markup: UI.menuKeyboard.btnMenu() },
      );
    });
  }
}

export class PlugginVideo {
  private getVideoDuration(inputPath: string): Promise<number> {
    return new Promise((resolve, reject) => {
      ffmpeg.ffprobe(inputPath, (err, metadata) => {
        if (err) return reject(err);
        resolve(metadata.format.duration || 0);
      });
    });
  }

  async cutVideoBySecond(
    inputPath: string,
    outputDir: string,
    time: number,
  ): Promise<string[]> {
    const totalDuration = await this.getVideoDuration(inputPath);
    if (totalDuration <= 0) {
      throw new Error("Không thể đọc được thời lượng video hoặc video lỗi.");
    }

    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputFiles: string[] = [];
    let startTime = 0;
    let index = 1;

    while (startTime < totalDuration) {
      const currentDuration = Math.min(time, totalDuration - startTime);
      const ext = path.extname(inputPath);
      const outputPath = path.join(
        outputDir,
        `part_${index}_${Date.now()}${ext}`,
      );

      await new Promise<void>((resolve, reject) => {
        ffmpeg(inputPath)
          .setStartTime(startTime)
          .setDuration(currentDuration)
          .output(outputPath)
          .on("end", () => {
            console.log(
              `Đã cắt xong đoạn ${index}: từ giây ${startTime} đến ${startTime + currentDuration}`,
            );
            outputFiles.push(outputPath);
            resolve();
          })
          .on("error", (err) => {
            console.error(`Lỗi khi cắt đoạn ${index}:`, err.message);
            reject(err);
          })
          .run();
      });
      startTime += time;
      index++;
    }
    return outputFiles;
  }
}
