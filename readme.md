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
│   │   │   └── star.storage.ts         # StarStorage (đổi từ src/utils)
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