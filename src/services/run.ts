import { Bot, Context, SessionFlavor, session } from "grammy";
import { run } from "@grammyjs/runner";
import { ContentExecution } from "./01.handeler/00.service/01.service.execution.js";
import { StarStorage } from "src/utils/storage.star.js";
import { sessionData } from "src/types/session.type.js";
import dotenv from "dotenv";
dotenv.config();

export type context = Context & SessionFlavor<sessionData>;
const token = process.env.TOKEN_BOT as string;

export class RunAiBot {
  private bot;
  private contentExecution;
  private starStorage;
  constructor() {
    this.bot = new Bot<context>(token);
    this.setupMiddleWare();
    this.contentExecution = new ContentExecution(this.bot);
    this.starStorage = new StarStorage();
  }
  basicStateValue: sessionData = {
    stars: 0,
    isActive: false,
    isBuying: false,
    isAiContent: false,
    isAiImage: false,
    isAiVideo: false,
    tempStarBuy: 0,
    file_id: "",
    duration: 0,
    isReceiveDocument: false,
    isCheckStar: false,
    isDocument: false,
    isHistory: false,
    state: "IDLE",
  };
  private setupMiddleWare() {
    const initialState = this.basicStateValue;
    this.bot.use(
      session({
        initial(): sessionData {
          return initialState;
        },
      }),
    );
  }
  async runBot() {
    run(this.bot);
  }
  async botStateBehavior(state: 'ACTIVE' | 'MAINTENANCE') {
    console.log("BOT STATUS:", state)
    if(state === 'MAINTENANCE') {
      this.bot.on("message:text", async(c)=> {
        await c.reply("Our AI BOT is under maintenance, sorry for the inconvenience.")
      })
      await this.bot.start(); 
    }
    else {
      await this.runBot()
    }
  }
}
