interface sessionStar {
  stars: number;
  isBuying: boolean;
  tempStarBuy: number;
  isCheckStar: boolean;
  isHistory: boolean;
}

interface sessionContent {
  isAiContent: boolean;
}

interface sessionUser {
  file_id: string;
  isActive: boolean;
}

interface sessionContext {
  isReceiveText: boolean;
}

interface sessionVideo {
  isAiVideo: boolean;
  isCutVideoByTime: boolean;
  isCutVideoByLength: boolean;
  duration: number;
  isGenerateVideo: boolean;
}

interface sessionImage {
  isAiImage: boolean;
}

interface sessionDocument {
  isDocument: boolean;
  isReceiveDocument: boolean;
}
export type BotState =
  | "IDLE"
  | "STARS_BALANCE_SELECT"
  | "AI_CONTENT_SELECT"
  | "AI_IMAGE_SELECT"
  | "AI_VIDEO_SELECT"
  | "PURCHASE_STAR_SELECT"
  | "HISTORY_SELECT"
  | "AI_DOCUMENT_SELECT";

export interface sessionData
  extends
    sessionStar,
    sessionContent,
    sessionUser,
    sessionContext,
    sessionVideo,
    sessionImage,
    sessionDocument {
  state: BotState;
}
