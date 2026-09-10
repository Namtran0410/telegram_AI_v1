import { Bot, Context, InlineKeyboard, SessionFlavor, session } from "grammy";
import { context } from "../../run.js";
import { UiIndex as UI } from "../../00.ui/00.index.ui.js";
import { ServiceStar } from "./02.service.star.js";
import { ServiceUser } from "./03.service.user.js";
import { ServiceAiVideoCutting } from "./04.service.ai.video.cut.js";
import { ServiceAiDocument } from "./06.service.ai.document.js";
import { ServiceAiVideoGenerating } from "./05.service.ai.video.generate.js";

export class ServiceIndex {
  private bot: Bot<context>;
  readonly star;
  readonly user;
  readonly aiVideo;
  readonly aiDocument;
  readonly aiVideoGenerating;
  constructor(bot: Bot<context>) {
    this.bot = bot;
    this.star = new ServiceStar(this.bot);
    this.user = new ServiceUser(this.bot);
    this.aiVideo = new ServiceAiVideoCutting(this.bot);
    this.aiDocument = new ServiceAiDocument(this.bot);
    this.aiVideoGenerating = new ServiceAiVideoGenerating(this.bot);
  }
  // async serviceAction() {
  //   return {
  //     video: new ServiceAiVideoCutting(this.bot),
  //   };
  // }
}
