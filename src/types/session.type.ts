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

  | "PURCHASE_STAR_SELECT"
  | "HISTORY_SELECT"
  | "AI_DOCUMENT_SELECT"
// Video 
  | "AI_VIDEO_SELECT"
  | "AI_CUT_VIDEO"
  | "CUT_VIDEO_BY_TIME"
  | "CUT_VIDEO_BY_LENGTH"
  | "GENERTATE_VIDEO"
// Image
  | "AI_IMAGE_EDIT"
  | "AI_IMAGE_GENERATE"
  | "AI_IMAGE_EDIT_WAIT_FOR_DESC"
  | "AI_IMAGE_GEN_WAIT_FOR_DESC"


export type Button = 
  | "btn_home"
  | "btn_buy_star"
  | "btn_star_balance"
  | "btn_ai_content"
  | "btn_ai_image"
  | "btn_ai_video"
  | "btn_buy_star"
  | "btn_history"
  | "btn_document"
  | "btn_edit_image"
  | "btn_generate_image"
  | "btn_cut_video"
  | "btn_generate_video"
  | "btn_cut_by_time"
  | "btn_cut_by_length"

export interface sessionData
  extends
    sessionStar,
    sessionContent,
    sessionUser,
    sessionVideo,
    sessionImage,
    sessionDocument
  {
    state: BotState,
    arrayBotState : BotState[]
  }
