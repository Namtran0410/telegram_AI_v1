import { Bot, Context, InlineKeyboard, SessionFlavor, session, InputFile } from "grammy";
import { context } from "../../run.js";
import { UiIndex as UI } from "../../00.ui/00.index.ui.js";
import { Request } from "../01.request.execution/00.request.index.js";
import { StarStorage } from "src/utils/storage.star.js";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import ffprobeInstaller from "@ffprobe-installer/ffprobe";
import path from "node:path";
import { cwd } from "node:process";
import fs from "node:fs";

// Cấu hình đường dẫn binary của ffmpeg
ffmpeg.setFfmpegPath(ffmpegInstaller.path);
ffmpeg.setFfprobePath(ffprobeInstaller.path);

export class ServiceAiImageGenerating {
  private bot: Bot<context>;
  private strg: StarStorage;
  private pluggin
  constructor(bot: Bot<context>) {
    this.bot = bot;
    this.strg = new StarStorage();
    this.pluggin  = new PlugginImage()
  }
  /**  */
  async actionImageAiGeneration() {
    let photoName = ""
    this.bot.callbackQuery("btn_edit_image", async(c)=> {
      c.session.state = 'AI_IMAGE_EDIT'
      if(c.session.state == 'AI_IMAGE_EDIT') {
        await c.reply("Please send me your image!")
      }
    })
    this.bot.on("message:photo", async(c)=> {
      if(c.session.state == 'AI_IMAGE_EDIT'){
        const photos = c.msg.photo
        const bestPhoto = photos[photos.length - 1];
        const fileId = bestPhoto.file_id
        const fileInfor =await c.api.getFile(fileId)
        const filePath = fileInfor.file_path
        const token = process.env.TOKEN_BOT

        const downloadUrl = `https://api.telegram.org/file/bot${token}/${filePath}`
        photoName = await this.pluggin.getImage(downloadUrl, `uploads/${c.from.id}`)
        await c.reply("What is your idea?")
        c.session.state = 'AI_IMAGE_EDIT_WAIT_FOR_DESC'
      }
    })

    this.bot.on("message:text", async(c, next)=> {
      if(c.session.state == 'AI_IMAGE_EDIT_WAIT_FOR_DESC') {
        const res = await Request.aiImage.requestEditImage(photoName, String(c.from.id), c.msg.text)
        await c.reply(res.data.message)
        const filePath = path.join(process.cwd(), `uploads/${c.from.id}/${photoName}`)

        console.log(filePath)
        await c.replyWithPhoto(new InputFile(filePath), {reply_markup: UI.botKeyboard.btnHomePage()})
        c.session.state = 'IDLE'
      }
      await next()
    })

    this.bot.callbackQuery("btn_generate_image", async(c)=> {
      c.session.state = 'AI_IMAGE_GENERATE'
      /** This part need to be updated */
    })
  }
}

export class PlugginImage {
  async getImage(downloadUrl: string, folderName: string){
    const res = await fetch(downloadUrl)
    if (!res.ok) throw new Error("Error when get file");
    const pictureContent= await res.arrayBuffer()
    const buffer = Buffer.from(pictureContent)

    const uploadDir = path.join(process.cwd(), folderName)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    const photoName = `file_${Date.now()}.png`
    const fileDir = path.join(uploadDir, photoName);
    fs.writeFileSync(fileDir, buffer);
    return photoName
  }
}
