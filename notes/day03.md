# Day 3 - Multer Upload

> 今天目標：建立圖片上傳流程，並理解 Multer 的 Storage 設計。


（Task 7 ~ Task 9）

---
## 資料夾結構
```
day03-multer-upload/
├── images/
│   └── cat.jpg
├── uploads/
├── task07.js
├── task08.js
└── task09.js

```

---

## 筆記

### Multer 使用 `dest` 簡寫時，檔案為什麼看起來無法開啟？

```js
multer({ dest: "./uploads" })
```

是 Disk Storage 的簡寫。

它會：

* 將檔案存進硬碟
* 自動產生新檔名
* 不保留原始副檔名
* 將原始檔名保留在 `req.file.originalname`
* 將實際儲存檔名放在 `req.file.filename`

例如原始檔案是：

```text
cat.jpg
```

但實際儲存後，檔名可能變成：

```text
uploads/
└── 9f4d31c6c8a4e8f92e3c0a1b2d3e4f5a
```

這個檔案沒有保留原本的副檔名：

```text
.jpg
.png
.webp
```

若嘗試開啟該檔案，Windows 或 VS Code 可能不知道該使用哪個程式開啟，並將它顯示為「二進位檔案」。但這不代表上傳失敗，檔案內容仍然是原本的圖片，只是儲存時沒有副檔名。

---

### `req.file` 中的各項資訊

上傳後的 `req.file` 可能長這樣：

```js
{
  fieldname: "image",
  originalname: "cat.jpg",
  mimetype: "image/jpeg",
  destination: "./uploads",
  filename: "9f4d31c6c8a4e8f92e3c0a1b2d3e4f5a",
  path: "uploads/9f4d31c6c8a4e8f92e3c0a1b2d3e4f5a",
  size: 245678
}
```

| 屬性             | 範例值                                          | 說明                                                            |
| -------------- | -------------------------------------------- | ------------------------------------------------------------- |
| `fieldname`    | `"image"`                                    | 表單中 `<input>` 或 Postman 的欄位名稱，要與 `upload.single("image")` 一致。 |
| `originalname` | `"cat.jpg"`                                  | 使用者上傳時的原始檔名。                                                  |
| `encoding`     | `"7bit"`                                     | 檔案傳輸時使用的編碼方式，通常不太需要特別使用。                                      |
| `mimetype`     | `"image/jpeg"`                               | 檔案的 MIME Type（由上傳端宣告），可用於初步判斷檔案類型。                            |
| `destination`  | `"./uploads"`                                | Multer 將檔案儲存到的資料夾路徑。使用 `dest` 或 `diskStorage()` 時才會有。         |
| `filename`     | `"9f4d31c6c8a..."`         | Multer 實際儲存在硬碟上的檔名，不一定保留原始檔名或副檔名。                             |
| `path`         | `"uploads/9f4d31c6c8a..."` | 檔案完整儲存路徑（`destination + filename`）。                           |
| `size`         | `245678`                                     | 檔案大小（單位：Bytes）。                                               |

---

### 為什麼 Multer 不保留原始檔名

`dest` 是快速設定 Disk Storage 的簡寫。

Multer 會自動產生新的檔名，主要可以避免：

* 不同使用者上傳同名檔案
* 新檔案覆蓋舊檔案
* 直接使用使用者提供的原始檔名

因此這種寫法適合快速測試上傳功能。

---

### 如何確認檔案仍然是圖片

可以查看：

```js
req.file.mimetype
```

例如：

```text
image/jpeg
```

表示上傳端宣告這個檔案是 JPEG 圖片。

也可以暫時手動補上正確副檔名。

例如將：

```text
9f4d31c6c8a4e8f92e3c0a1b2d3e4f5a
```

改成：

```text
9f4d31c6c8a4e8f92e3c0a1b2d3e4f5a.jpg
```

通常就可以直接用圖片檢視器開啟。

---

### 若需要保留副檔名

可以改用完整的 `diskStorage()` 設定，自訂儲存檔名：

```js
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./uploads");
  },

  filename: (req, file, callback) => {
    const extension = path.extname(file.originalname);
    const filename = `${Date.now()}${extension}`;

    callback(null, filename);
  },
});

const upload = multer({
  storage,
});
```

假設原始檔案是：

```text
cat.jpg
```
搭配 `path` 模組的 `extname()` 可以取得檔案副檔名

```js
path.extname(file.originalname)
```

會取得：

```text
.jpg
```

最後檔案可能儲存成：

```text
uploads/1784734567890.jpg
```

這樣作業系統就能根據 `.jpg` 判斷它是圖片檔案。

---

### 使用 `memoryStorage()` 時不建議直接回傳 Buffer

若寫：

```js
 return res.status(200).json({
    status: "success",
    buffer: req.file.buffer
  });
```

雖然可以，但 Buffer 轉成 JSON 後會變成很長的數字陣列，例如：

{
  "type": "Buffer",
  "data": [255, 216, 255, 224, 0, 16]
}

圖片一大，Postman 回應會非常龐大。

測試時這樣就夠了：
```js
hasBuffer: Boolean(req.file.buffer)
```
如果結果是：
```js
{
  "hasBuffer": true
}
```
就代表 Memory Storage 成功把檔案放進記憶體。

---
### `memoryStorage()` 和 `diskStorage()` 比較

| 項目 | memoryStorage() | diskStorage() |
|------|-----------------|---------------|
| 優點 | 不需先寫入硬碟，直接取得 `Buffer`，方便後續圖片處理 | 檔案會保存於硬碟，方便查看、測試與除錯 |
| 缺點 | 佔用記憶體，大檔案或大量上傳容易增加記憶體負擔 | 需要占用硬碟空間，若不清理容易累積大量檔案 |
| 適用情境 | 圖片壓縮、圖片轉檔、直接上傳雲端 | 暫存檔案、需要保留原始檔、開發測試 |


**問題：**

如果是本次side project 圖片壓縮工具，我會選擇哪一種 Storage？為什麼？

**回答：**

我會選擇 `memoryStorage()` 因為圖片上傳後會立即交給 Sharp 進行壓縮、轉檔，不需要先存入硬碟，直接使用 `req.file.buffer` 就能處理，流程較簡潔，也能減少暫存檔案的管理。

在正式專案中，如果圖片最終要直接上傳到 AWS S3、Cloudinary、Google Cloud Storage 等雲端儲存服務，通常會搭配 `memoryStorage()`，因為可以直接使用 `req.file.buffer` 上傳，不需要經過硬碟。

---

### Memory Storage  和	Disk Storage 比較

| Memory Storage   | Disk Storage |
| ---------------- | ------------ |
| 放在 **RAM**       | 放在 **硬碟**    |
| 程式結束就消失          | 檔案會保留下來      |
| 不占硬碟             | 會占硬碟         |
| 會占記憶體            | 幾乎不占記憶體      |
| 適合立即處理（Sharp、S3） | 適合需要保留檔案     |

---

### 用 `fs` 模組先確定資料夾是否已存在

自訂 `diskStorage()` 寫法時，最好先建立資料夾，避免資料夾不存在導致錯誤。

放在建立 Storage 之前：
```js
const express = require("express");
const multer = require("multer");
const fs = require("node:fs");

const app = express();

fs.mkdirSync("uploads", {
  recursive: true,
});
```

---

### 避免將為上傳圖片的錯誤和 HTTP 500 混用

沒有上傳圖片屬於使用者送出的請求不完整，是 Client Error，
不是伺服器內部發生故障，因此應回傳 `HTTP 400 Bad Request`。

如果回傳 `HTTP 500`，會讓前端或使用者誤以為是伺服器本身出問題，
不利於判斷錯誤原因。

```
沒有選檔案
→ req.file 不存在
→ Route 回傳 400

檔案太大、欄位名稱錯誤等 Multer 問題
→ MulterError
→ Error middleware 回傳 400

真正的伺服器錯誤
→ Error middleware 回傳 500
```
---

## 流程圖

```text
Client (Postman / Browser)
        │
        ▼
multipart/form-data
        │
        ▼
upload.single("image")
        │
        ▼
Multer 解析 Request
        │
        ├── req.file  ← 圖片
        └── req.body  ← 文字欄位
        │
        ▼
Route Handler
        │
        ▼
res.json(...)
```