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

export class ServiceAiVideoCutting {
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
        await c.reply("How do you envision the video being edited?", {reply_markup: UI.menuKeyboard.btnCuttingVideoType()})
    });
    // Cut by time
    this.bot.callbackQuery("btn_cut_by_time", async(c)=> {
        if(c.session.isAiVideo) {
          await c.answerCallbackQuery()
          await c.reply("Please send me your video")
          c.session.isCutVideoByTime = true
          c.session.isCutVideoByLength = false
        } else {
          c.reply("Seem like you have just select an other AI, please select AI Video again", {reply_markup: UI.menuKeyboard.btnMenu()})
        }
    })

    // Cut by length
    this.bot.callbackQuery("btn_cut_by_length", async(c)=> {
      if(c.session.isAiVideo) {
        await c.deleteMessage()
        await c.answerCallbackQuery()
        await c.reply("Please send me your video")
        c.session.isCutVideoByLength = true
        c.session.isCutVideoByTime = false
      }
      else {
          c.reply("Seem like you have just select an other AI, please select AI Video again", {reply_markup: UI.menuKeyboard.btnMenu()})
      }
    })

    // message execution
    this.bot.on("message:video", async (c, next) => {
      if(c.session.isAiVideo) {
        if (c.session.isCutVideoByTime) {
          await c.reply("How long would you like each clip to be? \n (Just type the number in seconds 👇, for example: `30`)", {reply_markup: UI.botKeyboard.btnHomePage()});
          c.session.file_id = c.msg.video.file_id;
          c.session.duration = c.msg.video.duration;
          c.session.isReceiveText = true
        } 

        if (c.session.isCutVideoByLength) {
          await c.reply("What file size would you like each part to be? \n (Just type the size in KB 👇, for example: 1024 for 1MB)", {reply_markup: UI.botKeyboard.btnHomePage()})
          c.session.file_id = c.msg.video.file_id;
          c.session.duration = c.msg.video.duration;
          c.session.isReceiveText = true
        } 
      } else {
          await c.reply("Seem like you have just select an other AI or not select any AI video, please select AI Video again", {reply_markup: UI.menuKeyboard.btnMenu()})
      }
    });

    this.bot.on("message:text", async (c, next) => {
        if ((c.session.isCutVideoByTime || c.session.isCutVideoByLength) && c.session.isReceiveText) {
          if (!c.session.file_id) {
              return await c.reply("Please send me your video before entering the parameters! 👇", {
                  reply_markup: UI.menuKeyboard.btnMenu(),
              });
          }
          const res = await Request.aiVideo.requestCutVideo(
              c.session.file_id,
              c.session.duration,
              +c.msg.text,
          );
          await c.reply("Processing your video—this will just take a moment.")

          if(res.status == true) {
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
              let cutFile 
              if(c.session.isCutVideoByTime) {
                  cutFile = await this.plugginVideo.cutVideoBySecond(
                      localFilePath,
                      outputDir,
                      Number(c.msg.text),
                  );
              } else {
                  cutFile = await this.plugginVideo.cutVideoByLength(
                      localFilePath,
                      outputDir,
                      Number(c.msg.text),
                  );
              }

              c.session.isCutVideoByTime = false
              c.session.isCutVideoByLength = false
              
              c.session.file_id = ""
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
          }
          else {
              await c.reply(`Sorry, there are some error when processing, please try again`, {reply_markup: UI.menuKeyboard.btnMenu()})
          }
        } else if((c.session.isCutVideoByTime || c.session.isCutVideoByLength) && !c.session.isReceiveText) {
          await c.reply("Seem like you have just select an other AI, please select AI Video again", {reply_markup: UI.menuKeyboard.btnMenu()})
        }
        await next()
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
    async cutVideoByLength(
        inputPath: string,
        outputDir: string,
        targetSizeKB: number // Dung lượng mục tiêu mỗi phần tính bằng KB
    ): Promise<string[]> {
        const totalDuration = await this.getVideoDuration(inputPath);
        if (totalDuration <= 0) {
        throw new Error("Không thể đọc được thời lượng video hoặc video lỗi.");
        }

        const stats = fs.statSync(inputPath);
        const totalSizeBytes = stats.size;
        const targetSizeBytes = targetSizeKB * 1024; // Đổi KB ra Bytes

        // Nếu video nhỏ hơn hoặc bằng dung lượng mục tiêu thì giữ nguyên
        if (totalSizeBytes <= targetSizeBytes) {
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        const ext = path.extname(inputPath);
        const outputPath = path.join(outputDir, `part_1_${Date.now()}${ext}`);
        fs.copyFileSync(inputPath, outputPath);
        return [outputPath];
        }

        // Tính thời lượng mỗi phần dựa trên tỷ lệ dung lượng (nhân 0.95 để an toàn tránh vượt quá)
        const safetyFactor = 0.95;
        const durationPerPart = (targetSizeBytes / totalSizeBytes) * totalDuration * safetyFactor;

        if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
        }

        const outputFiles: string[] = [];
        let startTime = 0;
        let index = 1;

        while (startTime < totalDuration) {
        const currentDuration = Math.min(durationPerPart, totalDuration - startTime);
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
                `Đã cắt xong phần ${index}: từ giây ${startTime.toFixed(2)} đến ${(startTime + currentDuration).toFixed(2)}`,
                );
                outputFiles.push(outputPath);
                resolve();
            })
            .on("error", (err) => {
                console.error(`Lỗi khi cắt phần ${index}:`, err.message);
                reject(err);
            })
            .run();
        });

        startTime += durationPerPart;
        index++;
        }
        return outputFiles;
    }
}
