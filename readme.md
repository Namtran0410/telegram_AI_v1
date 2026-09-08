# Install

npm init -y
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

## ============================================================================================================

# 📌 Tính năng chính

App Name: NexusBridge
user trigger → api server → api provider → api server → user

## ✍️ AI Content — Sinh nội dung văn bản

**Mô tả**: Người dùng nhập mô tả bằng ngôn ngữ tự nhiên (chủ đề, mục đích, tone giọng...), hệ thống gọi AI Provider để sinh ra văn bản tương ứng — bài viết, caption, ý tưởng, kịch bản ngắn, email, v.v.

**Luồng sử dụng**:

1. Người dùng chọn "AI Content" từ menu chính
2. Hệ thống kiểm tra số dư Star — nếu đủ, yêu cầu người dùng nhập mô tả
3. Người dùng gửi tin nhắn text mô tả nội dung mong muốn
4. Hệ thống trừ Star, gọi AI Provider, trả kết quả về cho người dùng
5. Kết quả và số Star còn lại được hiển thị kèm gợi ý bước tiếp theo

**Yêu cầu**:

- Chấp nhận input là văn bản tự do, không giới hạn cấu trúc câu lệnh
- Có cơ chế chờ input tiếp theo (bot phải "nhớ" đang ở chế độ AI Content cho tới khi nhận được text từ người dùng)
- Nếu người dùng không đủ Star, hiển thị cảnh báo rõ ràng và điều hướng sang mục nạp Star, không cho phép tiếp tục yêu cầu
- Không trừ Star nếu AI Provider trả lỗi hoặc timeout

---

## 🎨 AI Image — Sinh / chỉnh sửa hình ảnh

**Mô tả**: Người dùng mô tả hình ảnh muốn tạo (hoặc gửi kèm ảnh gốc để chỉnh sửa, nếu hỗ trợ), hệ thống gọi AI Provider sinh ảnh và trả về trực tiếp trong khung chat.

**Luồng sử dụng**:

1. Người dùng chọn "AI Image" từ menu chính
2. Hệ thống kiểm tra số dư Star (chi phí có thể cao hơn AI Content)
3. Người dùng nhập mô tả (và/hoặc gửi kèm ảnh nếu là chức năng chỉnh sửa)
4. Hệ thống trừ Star, gọi AI Provider, gửi ảnh kết quả về cho người dùng

**Yêu cầu**:

- Kết quả trả về dưới dạng ảnh hiển thị trực tiếp trong chat, không chỉ là link
- Hỗ trợ tối thiểu 1 trong 2 mode: **tạo mới từ mô tả (text-to-image)**; có thể mở rộng thêm **chỉnh sửa từ ảnh có sẵn (image-to-image)** ở giai đoạn sau
- Xử lý trường hợp mô tả vi phạm chính sách nội dung của AI Provider (bị filter) — cần thông báo rõ lý do cho người dùng, không trừ Star trong trường hợp này
- Thời gian chờ hợp lý (vài giây đến vài chục giây); nếu vượt ngưỡng cần có phản hồi trung gian (VD: "Đang xử lý...") để tránh người dùng tưởng bot bị treo

---

## 🎬 AI Video — Sinh video từ ý tưởng

**Mô tả**: Người dùng mô tả concept video (chủ đề, phong cách, độ dài mong muốn...), hệ thống gọi AI Provider sinh video và gửi kết quả về cho người dùng.

**Luồng sử dụng**:

1. Người dùng chọn "AI Video" từ menu chính
2. Hệ thống kiểm tra số dư Star (chi phí cao nhất trong 3 loại dịch vụ do chi phí compute lớn)
3. Người dùng nhập mô tả concept
4. Hệ thống trừ Star, gửi yêu cầu tới AI Provider
5. Do thời gian xử lý video thường lâu hơn đáng kể so với text/ảnh, hệ thống cần xử lý ở chế độ nền và **chủ động gửi thông báo** cho người dùng khi video hoàn tất, thay vì bắt người dùng chờ trong cùng một lượt tương tác

**Yêu cầu**:

- Không block luồng xử lý chính của bot trong lúc chờ video được sinh ra (xử lý bất đồng bộ)
- Người dùng có thể tiếp tục dùng các chức năng khác của bot trong lúc video đang xử lý
- Khi video hoàn tất, hệ thống chủ động gửi video (hoặc thông báo kèm link) tới đúng người dùng đã yêu cầu
- Có cơ chế xử lý trường hợp AI Provider sinh video thất bại — hoàn Star và thông báo lý do

---

## ⭐ Hệ thống Star — Đơn vị tiền tệ nội bộ

**Mô tả**: Star là đơn vị "tiền tệ" nội bộ dùng để quy đổi cho mỗi lượt sử dụng dịch vụ AI. Mỗi loại dịch vụ (Content/Image/Video) có thể có chi phí Star khác nhau tùy độ phức tạp và chi phí vận hành thực tế của AI Provider tương ứng.

**Yêu cầu**:

- Số dư Star phải được lưu trữ bền vững (không chỉ trong session tạm thời), đảm bảo không mất số dư khi bot khởi động lại hoặc người dùng dùng trên nhiều thiết bị
- Trừ Star phải là thao tác **chính xác và không trùng lặp** — một yêu cầu chỉ được trừ Star đúng một lần, kể cả khi có lỗi mạng hoặc người dùng bấm nút nhiều lần liên tiếp
- Có cơ chế kiểm tra số dư **trước khi** cho phép thực hiện bất kỳ tác vụ AI nào; nếu không đủ, chặn thao tác và điều hướng sang nạp thêm Star
- Cần định nghĩa rõ **bảng giá Star** cho từng loại dịch vụ (ví dụ: 1 Star/Content, X Star/Image, Y Star/Video) — chi phí này nên có khả năng cấu hình lại mà không cần sửa code (config/DB)
- Xem xét: quyết định thời điểm trừ Star — trừ trước khi gọi AI Provider (kèm cơ chế hoàn lại nếu lỗi) hoặc trừ sau khi có kết quả thành công (kèm cơ chế "giữ chỗ" số Star trong lúc xử lý để tránh người dùng chi tiêu Star đó cho việc khác)

---

## 💳 Top-up qua Telegram Stars — Nạp Star bằng thanh toán native

**Mô tả**: Người dùng nạp thêm Star vào tài khoản thông qua cơ chế thanh toán tích hợp sẵn của Telegram (Telegram Stars), không cần rời khỏi app Telegram, không cần tích hợp cổng thanh toán bên ngoài (VNPay, Momo, thẻ...).

**Luồng sử dụng**:

1. Người dùng chọn "Top up Stars" từ menu chính
2. Hệ thống hiển thị các gói nạp có sẵn (ví dụ: 10 / 30 / 50 / 70 / 100 / 200 / 300 / 500 / 1000 Star)
3. Người dùng chọn gói, xác nhận ý định mua
4. Hệ thống khởi tạo yêu cầu thanh toán qua Telegram Stars
5. Người dùng hoàn tất thanh toán ngay trong giao diện Telegram
6. Sau khi Telegram xác nhận thanh toán thành công, hệ thống mới cộng số Star tương ứng vào tài khoản người dùng

**Yêu cầu**:

- Số Star **chỉ được cộng sau khi nhận xác nhận thanh toán thành công thực sự từ Telegram**, không cộng ở bước "người dùng bấm xác nhận ý định mua" — hai việc này là khác nhau và không được gộp làm một, để tránh gian lận hoặc lỗi cộng Star mà chưa thu tiền
- Mỗi giao dịch thanh toán phải được xử lý **đúng một lần duy nhất**, kể cả khi hệ thống nhận được thông báo xác nhận thanh toán lặp lại
- Ghi nhận đầy đủ lịch sử mỗi lần nạp: số Star, thời điểm, mã giao dịch — phục vụ tra soát khi có khiếu nại
- Có bước xác nhận trung gian trước khi tiến hành thanh toán thật (hiển thị lại gói đã chọn, cho phép hủy) để tránh người dùng bấm nhầm

---

## 📜 Lịch sử — Xem lại giao dịch và hoạt động đã dùng

**Mô tả**: Người dùng có thể xem lại lịch sử các lần nạp Star và lịch sử các yêu cầu đã dùng dịch vụ AI (nội dung/ảnh/video đã tạo).

**Yêu cầu**:

- Hiển thị tối thiểu: loại giao dịch (nạp/sử dụng), thời gian, số Star liên quan
- Với lịch sử sử dụng dịch vụ AI: nên lưu lại mô tả (prompt) đã dùng và kết quả liên quan (hoặc reference tới kết quả), để người dùng có thể xem lại hoặc tái sử dụng
- Nếu danh sách dài, cần có cơ chế phân trang hoặc giới hạn hiển thị (ví dụ: chỉ hiện 10 giao dịch gần nhất, có nút xem thêm)

---

## 🔘 Inline Keyboard UX — Điều hướng bằng nút bấm

**Mô tả**: Toàn bộ luồng tương tác của người dùng với bot được thiết kế để có thể thực hiện chỉ bằng cách bấm nút (Inline Keyboard), hạn chế tối đa việc yêu cầu người dùng phải nhớ và gõ lệnh cụ thể.

**Yêu cầu**:

- Sau mỗi hành động hoàn tất (sinh nội dung xong, nạp Star xong, xem lịch sử xong...), hệ thống luôn cung cấp nút điều hướng về menu chính hoặc bước tiếp theo hợp lý — không để người dùng "lạc" giữa luồng
- Các nút mang tính "hành động cần xác nhận" (ví dụ: xác nhận mua Star) phải có cặp lựa chọn rõ ràng: xác nhận / hủy
- Trạng thái chờ input tiếp theo (ví dụ: bot đang chờ người dùng nhập mô tả sau khi bấm "AI Content") cần được xử lý nhất quán, tránh trường hợp bot hiểu nhầm tin nhắn tiếp theo của người dùng thuộc về luồng khác
- Văn phong hiển thị trên nút và thông báo cần ngắn gọn, thân thiện, nhất quán về tone xuyên suốt toàn bộ bot
