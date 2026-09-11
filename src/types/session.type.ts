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


interface sessionVideo {
  isAiVideo: boolean;
  duration: number;
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
  | "AI_DOCUMENT_SELECT"
  | "CUT_VIDEO_BY_TIME"
  | "CUT_VIDEO_BY_LENGTH"
  | "GENERTATE_VIDEO"
  | "AI_IMAGE_EDIT"
  | "AI_IMAGE_GENERATE"
  | "AI_IMAGE_EDIT_WAIT_FOR_DESC"
  | "AI_IMAGE_GEN_WAIT_FOR_DESC"

export interface sessionData
  extends
    sessionStar,
    sessionContent,
    sessionUser,
    sessionVideo,
    sessionImage,
    sessionDocument {
  state: BotState;
}
