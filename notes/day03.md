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