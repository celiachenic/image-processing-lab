# Image Processing Bootcamp

正式開始 **【圖片壓縮與轉檔工具】Side Project** 前的技術暖身。

這份 Bootcamp 的目的不是完成產品，而是透過 7 天、21 個任務，熟悉圖片處理、檔案上傳、API 設計與前後端串接。

希望正式開始 Side Project 時，可以將重心放在程式架構、產品設計，而不是花大量時間查詢套件用法與基礎語法。

---

## 預期學習成果

完成 Bootcamp 後，應具備以下能力：

- 使用 Sharp 進行圖片壓縮與轉檔
- 使用 Multer 接收圖片
- 設計圖片處理 API
- 驗證圖片格式與大小
- 回傳處理結果 JSON
- 建立簡易前端操作頁面
- 建立圖片下載流程
- 熟悉正式 Side Project 所需技術

---

## 資料夾

```text
image-processing-lab/
├── README.md
├── notes/
│   ├── day01.md
│   ├── day02.md
│   ├── day03.md
│   ├── day04.md
│   ├── day05.md
│   ├── day06.md
│   └── day07.md
├── day01-sharp-basics/
├── day02-image-resize/
├── day03-multer-upload/
├── day04-validation/
├── day05-process-api/
├── day06-file-lifecycle/
└── day07-integration/
```

### 資料夾說明

| 資料夾 | 說明 |
|--------|------|
| `README.md` | Bootcamp 總說明、任務與進度 |
| `notes/` | 每日學習筆記紀錄與反思 |
| `day01-sharp-basics/` | Sharp 基本操作、Metadata、圖片轉檔與壓縮品質 |
| `day02-image-resize/` | Resize、maxWidth 與圖片處理函式封裝 |
| `day03-multer-upload/` | Multer 圖片上傳與 Storage 比較 |
| `day04-validation/` | 圖片格式驗證、大小限制與錯誤處理 |
| `day05-process-api/` | 建立完整圖片處理 API |
| `day06-file-lifecycle/` | 唯一檔名、圖片下載與暫存檔管理 |
| `day07-integration/` | 前後端整合與 Bootcamp 最終驗收 |

---

## Day 1 - Sharp Basics

> 今天目標：熟悉 Sharp 的核心功能，理解圖片資訊、轉檔與壓縮品質。
> 
（Task 1 ~ Task 3）

### Task 1：讀取圖片 Metadata

#### 目標

了解 Sharp 能取得哪些圖片資訊。

#### 任務

- 使用 `sharp().metadata()`
- 印出 format
- 印出 width
- 印出 height
- 印出 channels
- 測試 JPG、PNG、WebP

#### 完成條件

能說明每個 metadata 欄位代表什麼。

---

### Task 2：JPG / PNG → WebP

#### 目標

了解 Sharp 最基本的圖片轉檔流程。

#### 任務

- 建立 Node.js Script
- 不使用 Express
- 成功輸出 WebP

#### 完成條件

成功將 JPG、PNG 轉成 WebP。

---

### Task 3：Quality 比較

#### 目標

了解圖片品質與檔案大小的取捨。

#### 任務

輸出：

- quality = 100
- quality = 80
- quality = 50
- quality = 20

紀錄：

- 原始大小
- 輸出大小
- 壓縮比例
- 視覺差異

### 完成條件

理解「為什麼許多工具預設使用 quality = 80？」

試著找一張照片與一張插圖，比較兩者壓縮後的差異。

---

## Day 2 - Image Resize

> 今天目標：了解圖片縮放流程，並開始建立可重複使用的圖片處理函式。
>

（Task 4 ~ Task 6）


### Task 4：等比例縮圖

#### 目標

了解 Sharp 如何在不改變圖片比例的情況下縮放圖片。

#### 任務

- 將圖片寬度設定為 `1000px`
- 確認圖片沒有變形
- 比較縮放前後的圖片尺寸
- 記錄縮放前後的檔案大小

#### 完成條件

能解釋：

- 為什麼只設定 `width` 就能維持圖片比例？
- 哪些情況適合先縮放再壓縮？

研究：

- `fit`
- `withoutEnlargement`

並了解用途。

---

### Task 5：maxWidth

#### 目標

實作圖片「只縮小、不放大」的邏輯。

#### 任務

需求：

- 原圖寬度大於 `maxWidth` 時縮小
- 原圖寬度小於 `maxWidth` 時維持原尺寸
- 測試一張大圖
- 測試一張小圖

#### 完成條件

能說明：

- 為什麼網站通常不會放大小圖片？
- `maxWidth` 的設計可以解決什麼問題？

比較：

- `width`
- `height`
- `fit`

三者的差異。

---

### Task 6：封裝圖片處理函式

#### 目標

將圖片處理流程封裝成可重複使用的函式。

#### 任務

建立：

```js
processImage({
  inputPath,
  outputPath,
  quality,
  maxWidth,
});
```

功能包含：

- WebP 轉檔
- quality
- resize
- 回傳處理資訊（可自行設計）

#### 完成條件

之後所有圖片處理都能透過 `processImage()` 完成，而不是重複撰寫 Sharp 程式碼。

思考：
如果未來要支援 JPEG、PNG，只需要修改哪裡？

---

## Day 3 - Multer Upload

> 今天目標：建立圖片上傳流程，並理解 Multer 的 Storage 設計。

（Task 7 ~ Task 9）

### Task 7：單張圖片上傳

#### 目標

建立第一支可以接收圖片的 API。

#### 任務

建立：

```http
POST /upload
```

- 使用 `multipart/form-data`
- 成功取得 `req.file`
- 印出 `req.file` 內容
- 使用 Postman 測試

#### 完成條件

理解 `req.file` 包含哪些資訊：

- originalname
- mimetype
- size
- filename
- path


研究：

`req.body` 與 `req.file` 的差異。

---

### Task 8：比較 Storage

#### 目標

了解 Multer 的兩種 Storage 機制，並思考正式專案該如何選擇。

#### 任務

分別實作：

- `memoryStorage()`
- `diskStorage()`

紀錄：

- 優點
- 缺點
- 適用情境

#### 完成條件

回答：

如果是本次圖片壓縮工具，你會選擇哪一種 Storage？為什麼？

研究：

如果圖片要直接上傳到 AWS S3，通常會搭配哪種 Storage？

---

### Task 9：未上傳圖片

#### 目標

處理最常見的 API 錯誤情境。

#### 任務

當沒有上傳圖片時：

- 回傳 HTTP 400
- 回傳清楚錯誤訊息
- 避免程式發生例外（Exception）

例如：

```json
{
  "status": "error",
  "message": "請上傳圖片"
}
```

#### 完成條件

使用 Postman 測試：

- 有圖片
- 沒有圖片

兩種情境皆能正常回應。


思考：
為什麼不應該讓這種錯誤變成 HTTP 500？


---

## Day 4 - Validation

> 今天目標：讓 API 能拒絕非法輸入，而不是只處理成功案例。

（Task 10 ~ Task 12）

### Task 10：圖片格式驗證

#### 目標

建立第一層輸入驗證，確保 API 只接受支援的圖片格式。

#### 任務

允許：

- JPG
- PNG
- WebP

拒絕：

- PDF
- TXT
- 其他非圖片檔案

研究：

- 副檔名（Extension）
- MIME Type
- 真正的檔案格式（Magic Number，可先了解概念）

#### 完成條件

- 成功阻擋非圖片檔案
- 回傳清楚的錯誤訊息
- 能說明副檔名驗證與 MIME Type 驗證的差異

研究：

如果使用者把 `cat.pdf` 改名成 `cat.jpg`，API 是否仍可能被騙？為什麼？

### Task 11：限制檔案大小

#### 目標

避免使用者上傳過大的圖片，保護伺服器資源。

#### 任務

- 使用 Multer 設定 `limits.fileSize`
- 限制單張圖片大小為 **5MB**
- 超過限制時回傳 **HTTP 413**
- 提供清楚的錯誤訊息

#### 完成條件

使用 Postman 測試：

- 小於 5MB
- 大於 5MB

兩種情況皆能正常回應。


思考：

為什麼圖片太大通常使用 **413 Payload Too Large**，而不是 **400 Bad Request**？

---

### Task 12：統一 Error Handling

#### 目標

建立一致的錯誤處理流程，讓 API 回傳格式統一且容易維護。

#### 任務

處理至少以下情境：

- 未上傳圖片
- 不支援的圖片格式
- 檔案超過 5MB
- 建立 Error Handler Middleware
- 將 Multer 錯誤交由 Error Middleware 統一處理

統一回傳格式，例如：

```json
{
  "status": "error",
  "message": ""
}
```

#### 完成條件

每種錯誤：

- 都有適當的 HTTP Status Code
- 都有明確的錯誤訊息
- 不會直接回傳 500 Internal Server Error

思考：

如果未來錯誤種類越來越多，是否適合建立一個共用的 Error Handler Middleware？它有哪些優點？

---

## Day 5 - Process API

> 今天目標：整合前幾天成果，建立第一支完整圖片處理 API。

### Task 13：建立圖片處理 API

#### 目標

整合前幾天所學，建立第一支完整的圖片處理 API。

#### 任務

建立：

```http
POST /images/process
```

API 流程：

```text
Upload
↓
Validation
↓
Process Image
↓
Response JSON
```

整合：

- Multer 圖片上傳
- 圖片格式驗證
- 檔案大小限制
- Sharp 圖片處理

使用 Postman 完成測試。

#### 完成條件

成功上傳一張圖片後，可以完成圖片處理，並回傳 JSON。

思考：

如果之後要支援更多圖片處理功能（例如 Resize、Rotate、Crop），API 是否需要重新設計？為什麼？

---

### Task 14：驗證圖片處理參數

#### 目標

建立圖片處理參數驗證，避免非法輸入造成程式錯誤。

#### 任務

驗證：

- quality
- maxWidth

測試：

- quality = abc
- quality = 0
- quality = 101
- maxWidth = abc
- maxWidth = -100

提供清楚的錯誤訊息。

#### 完成條件

所有非法輸入都能回傳適當的 HTTP Status Code 與錯誤訊息，而不會直接進入圖片處理流程。

思考：

哪些參數應該在 Controller 驗證？哪些適合交給圖片處理函式判斷？

---

### Task 15：設計 API Response

#### 目標

建立一致且容易被前端使用的 API 回傳格式。

#### 任務

成功時回傳：

```json
{
  "filename": "",
  "originalSize": 0,
  "outputSize": 0,
  "savedPercent": 0,
  "format": "webp",
  "previewUrl": "",
  "downloadUrl": ""
}
```

計算：

- originalSize
- outputSize
- savedPercent

確認：

- JSON 欄位命名一致
- 前端容易使用

#### 完成條件

能正確回傳圖片資訊，並計算壓縮比例。

思考：

如果轉檔後圖片反而變大，`savedPercent` 應該如何呈現？是否需要另外顯示提示？

---

## Day 6 - File Lifecycle

> 今天目標：思考圖片從上傳到下載的完整生命週期。

（Task 16 ~ Task 18）

### Task 16：產生唯一檔名

#### 目標

避免不同使用者上傳相同檔名時，處理後的圖片互相覆蓋。

#### 任務

比較以下檔名產生方式：

- `Date.now()`
- `crypto.randomUUID()`
- UUID 套件

產生處理後圖片的唯一檔名，例如：

```text
550e8400-e29b-41d4-a716-446655440000.webp
```

測試：

- 連續上傳兩張相同檔名的圖片
- 確認輸出檔案不會互相覆蓋
- 確認輸出副檔名固定為 `.webp`

#### 完成條件

每次圖片處理都能產生唯一檔名，且不直接信任使用者提供的原始檔名。

思考：

- 為什麼不應直接使用 `req.file.originalname` 作為輸出檔名？
- `Date.now()` 是否能完全保證檔名不重複？
- 是否需要保留部分原始檔名，方便使用者辨識？

---

### Task 17：建立圖片預覽與下載流程

#### 目標

讓使用者可以透過 URL 預覽處理後圖片，並下載圖片檔案。

#### 任務

研究並實作：

- `express.static()`
- `res.sendFile()`
- `res.download()`

建立處理後圖片存放資料夾，例如：

```text
outputs/
```

提供：

- 圖片預覽 URL
- 圖片下載 URL

例如：

```text
GET /outputs/:filename
GET /downloads/:filename
```

確認 API Response 中的：

- `previewUrl`
- `downloadUrl`

可以正常使用。

#### 完成條件

- 使用瀏覽器可以開啟處理後圖片
- 使用下載連結可以下載圖片
- 不存在的檔案能回傳適當錯誤，而不是讓程式中斷
- 能說明預覽與下載的回應方式有何不同

思考：

- 為什麼預覽圖片可以使用 `express.static()`，下載時卻可能使用 `res.download()`？
- 是否應允許使用者直接存取整個輸出資料夾？
- 如何避免使用者透過 URL 存取非預期檔案？

---

### Task 18：設計暫存檔清理策略

#### 目標

了解上傳檔案與輸出檔案的生命週期，避免伺服器長期累積無用檔案。

#### 任務

整理圖片處理過程中可能產生的檔案：

- 原始上傳檔案
- 處理後圖片
- 圖片處理失敗時留下的檔案

比較以下清理策略：

- 圖片處理完成後立即刪除原始檔案
- 處理後圖片保留一段時間再刪除
- Server 啟動時清理過期檔案
- 使用排程定期清理檔案

至少實作一種策略，例如：

```text
圖片處理成功
↓
回傳處理結果
↓
刪除原始上傳檔案
```

測試：

- 圖片處理成功
- Sharp 處理失敗
- 檔案不存在
- 刪除檔案失敗

#### 完成條件

- 至少完成一種檔案清理策略
- 清理失敗時不會造成整個請求崩潰
- 能說明原始檔與輸出檔分別應保留多久
- 將採用的清理策略記錄於 `notes/day06.md`

思考：

- 如果 API 回傳後立刻刪除輸出圖片，使用者還能下載嗎？
- 使用 `setTimeout()` 清理檔案有哪些限制？
- 如果伺服器重新啟動，尚未清理的檔案該怎麼辦？
- 正式部署後，將圖片存在本機硬碟可能遇到哪些問題？

---

## Day 7 - Integration

> 今天目標：完成最小可行產品（MVP），並驗證自己是否真正理解整個流程。

（Task 19 ~ Task 21）

### Task 19：建立前端操作頁面

#### 目標

建立一個可操作的前端頁面，讓使用者不需要 Postman 即可使用圖片處理功能。

#### 任務

建立一個簡單的 HTML 頁面，包含：

- 圖片上傳
- Quality 設定
- maxWidth 設定
- Submit 按鈕

使用：

- FormData
- Fetch API

串接：

```http
POST /images/process
```

#### 完成條件

使用瀏覽器即可完成圖片上傳與圖片處理，不需要使用 Postman。

思考：

- 為什麼圖片上傳通常使用 `FormData`？
- 如果改成 JSON，可以直接傳送圖片嗎？

---

### Task 20：顯示圖片處理結果

#### 目標

將 API 回傳結果顯示於前端，完成完整的使用者流程。

#### 任務

成功時顯示：

- 處理後圖片
- 原始檔案大小
- 處理後檔案大小
- 節省比例
- Download 按鈕

失敗時顯示：

- API 回傳錯誤訊息

測試：

- 正常圖片
- 未上傳圖片
- 不支援格式
- 超過 5MB
- quality 錯誤

#### 完成條件

所有成功與失敗情境都能在前端正確顯示，不需要查看 Terminal。

思考：

如果未來要加入 Loading 動畫，你會放在哪個階段？

---

### Task 21：Final Challenge

#### 目標

驗證自己是否真正理解整個 Bootcamp，而不是只會跟著步驟完成任務。

#### 任務

重新建立一個新的專案。

限制：

- 不直接複製 Bootcamp 程式碼
- 可以查官方文件
- 可以參考自己的筆記
- 可以使用 AI，但需理解產生的程式碼

完成：

- 建立 Express Server
- GET `/health`
- POST `/images/process`
- Multer 圖片上傳
- 圖片格式驗證
- 檔案大小限制
- Sharp 圖片處理
- 回傳 JSON
- HTML 上傳頁面
- 顯示處理結果
- 圖片下載

#### 完成條件

成功完成一個最小可行產品（MVP），並能完整 Demo：

```text
選擇圖片
↓
設定 Quality
↓
送出圖片
↓
圖片處理
↓
顯示結果
↓
下載圖片
```
