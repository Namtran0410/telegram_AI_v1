import { Bot, Context, SessionFlavor, session} from "grammy";
import { ContentExecution } from "./telegram.services/telegram.service.js";
import { StarStorage } from "src/utils/storage.star.js";
import dotenv from 'dotenv'
dotenv.config()

interface sessionData {
    stars: number,
    isActive: boolean,
    isBuying: boolean,
    isAiContent: boolean,
    isAiImage: boolean,
    isAiVideo: boolean
} 
export type context = Context & SessionFlavor<sessionData>
const token = process.env.TOKEN_BOT as string

export class RunAiBot {
    private bot
    private contentExecution
    private starStorage
    constructor(){
        this.bot = new Bot<context>(token)
        this.setupMiddleWare();
        this.contentExecution = new ContentExecution(this.bot)
        this.starStorage = new StarStorage()
    }
    private setupMiddleWare (){
        this.bot.use(session({
            initial(): sessionData {
                return {
                    stars: 0, 
                    isActive: false,  
                    isBuying: false,
                    isAiContent: false,
                    isAiImage: false,
                    isAiVideo: false
                }     
            }
        })
        )
    }
    async runBot(){
        console.log("bot is running...")
        this.bot.start()
    }
}