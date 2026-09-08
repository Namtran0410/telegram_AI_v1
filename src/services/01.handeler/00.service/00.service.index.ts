import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
import { context } from "../../run.js";
import { UiIndex as UI } from "../../00.ui/00.index.ui.js";
import { ServiceStar } from "./02.service.star.js";
import { ServiceUser } from "./03.service.user.js";
import { ServiceAiVideo } from "./04.service.ai.video.js";

export class ServiceIndex {
  private bot: Bot<context>;
  readonly star;
  readonly user;
  readonly aiVideo;
  constructor(bot: Bot<context>) {
    this.bot = bot;
    this.star = new ServiceStar(this.bot);
    this.user = new ServiceUser(this.bot);
    this.aiVideo = new ServiceAiVideo(this.bot);
  }
  async serviceAction() {
    return {
      video: new ServiceAiVideo(this.bot),
    };
  }
}
