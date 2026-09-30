
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
//about us
|'ABOUT_US'

export const CoinNumber = [
    "100",
    "250",
    "500", 
    "1000"
]
export const CoinPackages = [
    { coins: 100,  stars: 100 },
    { coins: 250,  stars: 240 },
    { coins: 500,  stars: 450 },
    { coins: 1000, stars: 850 },
] as const;

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

export const WELCOME_MESSAGE = `👋 Welcome to Nexus Bridge! ✨

Your AI studio right inside Telegram 🚀

🎨 Generate images from your ideas
🖼️ Edit photos with a simple text prompt
🎁 Claim free coins every day

🎬 Coming soon: AI video &amp; TikTok tools!

Tap a button below to get started 
👇`;


export const ABOUT_MESSAGE = `🌉 About Nexus Bridge

Nexus Bridge connects you to powerful AI creative tools, right here in Telegram, with no apps to install and no complicated setup 🚀

🎨 What we do now
- AI image generation
- AI photo editing

🔮 What's next
- AI video creation 🎬
- TikTok content tools 📱

💡 Our mission
Make AI creativity simple, fast, and fun for everyone ✨

📩 Questions or feedback? Contact us: namqt.hust@gmail.com`;