// Composition Root - wiring toan bo bot
import { Bot, session, SessionFlavor, Context } from 'grammy'
import { run } from "@grammyjs/runner"
import { BotState } from './types/session.type.js'
import dotenv from 'dotenv'
dotenv.config()
import { MenuFeature } from './03.features/menu/menu.feature.js'
import { VideoFeature } from './03.features/ai-video/video.feature.js'
import { ImageFeature } from './03.features/ai-image/image.feature.js'
export interface SessionData {
    botState: BotState
    arrayBotState: BotState[]
    stars: number
    lastMessageId?: number
}

export type context = Context & SessionFlavor<SessionData>

export class BotRunner {
    private bot: Bot<context>
    private menuFeature: MenuFeature
    private videoFeature: VideoFeature
    private imageFeature: ImageFeature
    constructor() {
        this.bot = new Bot<context>(process.env.TOKEN_BOT as string)
        this.mySession()
        this.myErrorHandler()   
        // assign object       
        this.menuFeature = new MenuFeature()
        this.videoFeature = new VideoFeature()
        this.imageFeature = new ImageFeature()

        // assign action
        this.menuFeature.registerNavigation(this.bot)
        this.videoFeature.registerBehavior(this.bot)
        this.menuFeature.registerRoutes(this.bot)
        this.imageFeature.registerBehavior(this.bot)
        
    }

    private mySession() {
        this.bot.use(session({
            initial: (): SessionData => ({
                botState: "MENU",
                arrayBotState: ["MENU"],
                stars: 0,
            })
        }))
    }

    // THÊM: bắt lỗi tập trung, không để bot crash khi 1 handler throw
    private myErrorHandler() {
        this.bot.catch((err) => {
            console.error(
                `Lỗi khi xử lý update ${err.ctx.update.update_id}:`,
                err.error
            )
        })
    }

    async run() {
        await this.bot.init()        
        console.log(`Bot @${this.bot.botInfo.username} đang khởi động...`)

        run(this.bot)
        console.log("Bot is running...")
    }
}

const runner = new BotRunner()
await runner.run()