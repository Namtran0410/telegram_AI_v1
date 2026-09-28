
export type BotState = 
//MENU
| 'START'
| 'MENU' 
| 'IDLE'
//IMAGE
| 'MENU_IMAGE'
| 'IMAGE_GENERATE'
| 'IMAGE_EDIT'
| 'IMAGE_WAIT_FOR_TEXT'
//VIDEO
| 'MENU_VIDEO'
| 'VIDEO_CUT'
| 'VIDEO_GENERATE'
| 'VIDEO_GENERATE_SPECIAL'
| 'VIDEO_EDIT'
| 'VIDEO_WAIT_FOR_TEXT_EDIT_SIZE'
| 'VIDEO_WAIT_FOR_USER_UPLOAD_VIDEO_TIME'
| 'VIDEO_WAIT_FOR_USER_UPLOAD_VIDEO_SIZE'
| 'VIDEO_UPLOADED_AND_WAIT_FOR_TIME_INPUT'
| 'VIDEO_UPLOADED_AND_WAIT_FOR_LENGTH_INPUT'
| 'VIDEO_SPECIAL_WAIT_FOR_TEXT_GENERATE'
| 'VIDEO_SPECIAL_WAIT_FOR_TEXT_DESCRIPTION'
| 'VIDEO_GENERATE_FOR_6_SECONDS'
| 'VIDEO_GENERATE_FOR_15_SECONDS'
| 'VIDEO_GENERATE_FOR_30_SECONDS'
//coins
| 'MENU_COINS'

export const CoinNumber = [
    "100",
    "250",
    "500", 
    "1000"
]

export type UserInfor = {
    userId: string | number,
    username: string | undefined
    coins: number
} 

export const generateVideoLength = ["6", "15", "30"]
export type dataGenerationType = 'string' | 'uuid' | 'number' | 'strAndNum' 
export type generationInformation = {
    generation_id: string,
    user_id: string, 
    type: string,
    request_received_time: string,
    status: "PROCESSING" | "SUCCESS" | "FAIL"
}