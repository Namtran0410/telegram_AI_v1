import { RequestAiVideo } from "./01.request.ai.video.js";
import { RequestAiImage } from "./02.request.ai.image.js";

export const Request = {
  aiVideo: new RequestAiVideo(),
  aiImage: new RequestAiImage()
};
