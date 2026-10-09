# Install

npm init -y
npx tsc --init
npm i -D tsconfig-paths
npm i grammy  
npm install --save-dev @types/node
npm i dotenv
npm install typescript @types/node ts-node --save-dev
npm install telegraf
npm i @grammyjs/runner
npm install hono
npm install @hono/node-server
npm install -D tsx
npm install -D selfsigned @types/selfsigned
npm i fluent-ffmpeg @ffmpeg-installer/ffmpeg
npm i -D @types/fluent-ffmpeg
npm i @ffprobe-installer/ffprobe
npm install @fal-ai/serverless-client
npm install async-mutex
npm install better-sqlite3
npm install better-sqlite3
npm install --save-dev @types/better-sqlite3
npm install --save-dev @faker-js/faker
npm i bullmq
npm i ioredis

extension: SQLite Viewer

docker
docker run -d --name redis-bullmq -p 6379:6379 redis:7-alpine
sudo apt update
sudo apt install redis-server -y
sudo systemctl enable --now redis-server
## ==================================================================================telegram/
├── src/
│   ├── run.ts                          # Composition Root — entry point, wiring toàn bộ bot
│   │
│   ├── 00.bot/
│   │   ├── bot.instance.ts             # Khởi tạo Bot<context>, session middleware
│   │   └── context.ts                  # Định nghĩa type context (SessionFlavor, custom props)
│   │
│   ├── 00.ui/                          # Presentation layer — chỉ chứa UI/keyboard, KHÔNG có logic
│   │   ├── 00.index.ui.ts              # Export tổng (UiIndex)
│   │   ├── menu.keyboard.ui.ts
│   │   ├── video.keyboard.ui.ts
│   │   └── image.keyboard.ui.ts
│   │
│   ├── 01.router/                      # Presentation layer — CHỈ nơi được gọi bot.on(...)
│   │   ├── text.router.ts              # TextStateRouter (dispatch theo session.state)
│   │   ├── photo.router.ts
│   │   ├── callback.router.ts
│   │   └── router.types.ts
│   │
│   ├── 02.domain/                      # Domain layer — thuần logic, KHÔNG import grammY
│   │   ├── state-machine.ts            # transitions[], canTransition()
│   │   ├── session.type.ts             # BotState, SessionData
│   │   └── rules/                      # business rule thuần (vd: check đủ star để dùng feature)
│   │       └── star-balance.rule.ts
│   │
│   ├── 03.features/                    # Application layer — 1 folder = 1 feature, tự register vào router
│   │   ├── ai-image/
│   │   │   ├── image.feature.ts        # registerRoutes(router) — thay cho actionImageAiGeneration cũ
│   │   │   ├── image.service.ts        # logic gọi API gen/edit ảnh
│   │   │   └── image.download.ts       # tách riêng phần tải ảnh (thay PlugginImage)
│   │   │
│   │   ├── ai-video/
│   │   │   ├── video.feature.ts
│   │   │   ├── video.cut.service.ts
│   │   │   └── video.generate.service.ts
│   │   │
│   │   ├── menu/
│   │   │   └── menu.feature.ts         # xử lý IDLE, navigateTo, back button
│   │   │
│   │   ├── star/
│   │   │   ├── star.feature.ts
│   │   │   └── star.service.ts         # loadUserStar, actionBuyStar
│   │   │
│   │   └── user/
│   │       ├── user.feature.ts
│   │       └── user.service.ts         # setActivatedUser, actionHome
│   │
│   ├── 04.request.execution/           # Application layer — gọi API bên ngoài (backend Hono)
│   │   ├── 00.request.index.ts
│   │   ├── ai-image.request.ts
│   │   └── ai-video.request.ts
│   │
│   ├── 05.infra/                       # Infrastructure layer — chi tiết kỹ thuật, có thể thay thế
│   │   ├── ffmpeg/
│   │   │   └── ffmpeg.client.ts        # setFfmpegPath, setFfprobePath, các hàm cắt video
│   │   ├── storage/
│   │   │   └── star.storage.ts         # coinstorage (đổi từ src/utils)
│   │   └── telegram-file/
│   │       └── file.downloader.ts      # tải file từ Telegram API (getFile, fetch buffer)
│   │
│   └── types/
│       ├── session.type.ts             # BotState union type (giữ nguyên vị trí cũ nếu muốn ít đổi)
│       └── env.type.ts                 # type cho process.env (TOKEN_BOT, ...)
│
├── uploads/                            # runtime output — KHÔNG commit (thêm vào .gitignore)
├── dist/                               # build output
├── .env
├── .gitignore
├── package.json
└── tsconfig.json

## =================================PHASE 1================================================= 

# 1. RELEASE:
    - Release Image Editing : Edit ảnh - Generate ảnh
    - Release User Balance
    - Purchase Coin

## ** Image Editing **
## Pricing — Phase 1 (Image)

Model: FLUX.2 [pro] via fal.ai — output capped at 1MP, 1 input image per edit.
Price: 10 coin/image (generate or edit). Payout rate ≈ $0.013/Star (verify on Fragment).

### Per image (base rate 1 Star = 1 coin)

| Type     | Cost (USD) | Price (coin) | Revenue (USD) | Profit/image (USD) | Margin |
|----------|-----------:|-------------:|--------------:|-------------------:|-------:|
| Generate | 0.030      | 10           | 0.130         | 0.100              | 77%    |
| Edit     | 0.045      | 10           | 0.130         | 0.085              | 65%    |

### Coin packs

| Coins | Stars | Discount | Images | Revenue (USD) | Profit — all Generate (USD) | Profit — all Edit (USD) |
|------:|------:|---------:|-------:|--------------:|----------------------------:|------------------------:|
| 100   | 100   | —        | 10     | 1.30          | 1.00 (77%)                  | 0.85 (65%)              |
| 250   | 240   | -4%      | 25     | 3.12          | 2.37 (76%)                  | 2.00 (64%)              |
| 500   | 450   | -10%     | 50     | 5.85          | 4.35 (74%)                  | 3.60 (62%)              |
| 1000  | 850   | -15%     | 100    | 11.05         | 8.05 (73%)                  | 6.55 (59%)              |

> Excludes: free trial images, refunds on failed generations, server costs.