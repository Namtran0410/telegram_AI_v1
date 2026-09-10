interface sessionStar {
    stars: number;
    isBuying: boolean;
    tempStarBuy: number;
    isCheckStar: boolean;
    isHistory: boolean
}

interface sessionContent {
    isAiContent: boolean;
}

interface sessionUser {
    file_id: string;
    isActive: boolean;
}

interface sessionContext {
    isReceiveText: boolean,
}

interface sessionVideo {
    isAiVideo: boolean;
    isCutVideoByTime: boolean;
    isCutVideoByLength: boolean;
    duration: number;
    isGenerateVideo: boolean,
}

interface sessionImage {
    isAiImage: boolean;
}

interface sessionDocument {
    isDocument: boolean,
    isReceiveDocument: boolean
}

export interface sessionData extends 
    sessionStar, 
    sessionContent, 
    sessionUser, 
    sessionContext,
    sessionVideo,
    sessionImage,
    sessionDocument
{}   