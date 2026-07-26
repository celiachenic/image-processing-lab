# Day 4 - Validation

> 今天目標：讓 API 能拒絕非法輸入，而不是只處理成功案例。

（Task 10 ~ Task 12）

---

---
## 資料夾結構
```
day04-validation/
├── images/
│   └── cat.jpg
├── uploads/
├── task10.js
├── task11.js
└── task12.js

```

---

## 筆記

###  `path.extname()` 回傳值包含 `.`

我原本寫：

```js
const extname = path.extname(req.file.originalname);

const allowType = ["jpg", "png", "webp"];

allowType.includes(extname);
```

但：

```js
path.extname("cat.jpg");
// ".jpg"
```

實際比較變成：

```js
allowType.includes(".jpg");
// false
```

#### 正確寫法

```js
const extension = path.extname(req.file.originalname).toLowerCase();

const allowedExtensions = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
];
```

---

###  `mimetype` 格式和 `path.extname()` 不同

我原本以為：

```js
req.file.mimetype
```

會得到

```text
jpg
png
webp
```

實際上得到的是

```text
image/jpeg
image/png
image/webp
```

因此不能和副檔名共用同一個陣列。

#### 正確寫法

```js
const allowedMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
];
```

---

### Extension 與 MIME Type 要分開驗證

不要寫：

```js
const allowType = ["jpg", "png", "webp"];
```

然後同時拿去比：

```js
extension
mimetype
```

因為兩者格式完全不同。

應該分成：

```js
allowedExtensions
```

以及

```js
allowedMimeTypes
```

---

### JPEG 有兩種副檔名

除了

```text
.jpg
```

還有

```text
.jpeg
```

但 MIME Type 都是

```text
image/jpeg
```

因此副檔名要允許：

```js
[
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
]
```

---

### 在 `fileFilter` 裡過濾檔案格式


較好的流程：

```text
upload.single()

↓

fileFilter()

↓

格式正確才進入 Route

↓

格式錯誤直接丟 Error Middleware
```

這也是 Multer 官方推薦的做法。

```js
const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
  ];

  const isAllowedExtension = allowedExtensions.includes(extension);
  const isAllowedMimeType = allowedMimeTypes.includes(file.mimetype);

  if (!isAllowedExtension || !isAllowedMimeType) {
    return callback(new Error("只接受 JPG、PNG、WebP 圖片"));
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
});
```
---
### Multer 三種 callback 的用途

Multer 中目前遇到三種 callback：

1. `destination`
2. `filename`
3. `fileFilter`

它們都是 **Multer 提供給我們的 callback function**，只是用途不同。

- destination、filename 是 diskStorage() 是 multer.diskStorage() 的設定。
- fileFilter 是 Multer 本身的設定。

```
multer()
│
├── Storage（檔案怎麼存）
│      ├── memoryStorage
│      └── diskStorage
│             ├── destination
│             └── filename
│
├── fileFilter（哪些檔案可以收）
│
└── limits（有哪些限制）
```

#### callback 是什麼

Multer 執行到某個階段時，會暫停一下，把控制權交給我們，我們完成判斷後，再呼叫 `callback()` 告訴 Multer 下一步該怎麼做。

可以把 callback 想成：

> **Multer 在每個重要步驟都會停下來問我：「接下來要怎麼做？」**

例如：

```text
destination：
「要存哪裡？」
          ↓
callback(null, "./uploads")
```

```text
filename：
「要叫什麼名字？」
            ↓
callback(null, "cat.webp")
```

```text
fileFilter：
「這張圖片可以收嗎？」
               ↓
callback(null, true)
```

所以雖然都叫做 `callback`，但**真正有意義的是第二個參數**，因為它代表的是「這個階段需要回覆給 Multer 的資訊」。


流程：

```text
使用者上傳圖片
        │
        ▼
Multer 開始處理
        │
        ▼
Multer 呼叫 fileFilter(req, file, callback)
        │
        ▼
我們的程式開始執行
        │
        ▼
我們呼叫 callback(...)
        │
        ▼
Multer 收到結果
        │
        ▼
繼續處理或丟出錯誤
```

#### 1. destination callback

決定 **檔案要存到哪個資料夾？**

```js
destination: (req, file, callback) => {
  callback(null, "./uploads");
}
```

##### 語法和參數

```js
callback(error, destination)
```

例如：

```js
callback(null, "./uploads");
```

表示：

* 沒有錯誤
* 儲存到 `./uploads`

#### 2. filename callback

決定 **檔案要叫什麼名字？**

```js
filename: (req, file, callback) => {
  callback(null, Date.now() + ".jpg");
}
```

##### 語法和參數

```js
callback(error, filename)
```

例如：

```js
callback(null, "172190123123.jpg");
```

表示：

* 沒有錯誤
* 檔名叫做 `172190123123.jpg`


#### 3. fileFilter callback

決定 **這個檔案要不要接受？**

```js
fileFilter: (req, file, callback) => {
  ...
}
```

##### 語法和參數

```js
callback(error, acceptFile)
```

接受：

```js
callback(null, true);
```

表示：

* 沒有錯誤
* 接受這個檔案

拒絕：

```js
callback(new Error("只接受 JPG、PNG、WebP"));
```

表示：

* 發生錯誤
* 不接受這個檔案
* Error 會交給 Error Middleware 處理

也可以寫：

```js
callback(null, false);
```

表示：

* 沒有系統錯誤
* 但不接受這個檔案

（較少使用，需要自己處理 `req.file` 為 `undefined` 的情況。）

---

### 三種 callback 比較

| callback      | 用途       | callback 第二個參數    |
| ------------- | -------- | ----------------- |
| `destination` | 決定儲存資料夾  | `destination`（路徑） |
| `filename`    | 決定儲存檔名   | `filename`（檔名）    |
| `fileFilter`  | 決定是否接受檔案 | `true` / `false`  |

共同點：

```js
callback(error, ...)
```

第一個參數都是：

```js
error
```

* `null`：沒有錯誤
* `new Error(...)`：發生錯誤

第二個參數則依 callback 的用途不同而改變。

---

### Extension（副檔名）、MIME Type、Magic Number

#### Extension 來自檔名

```text
cat.jpg
```

取得方式：

```js
path.extname(file.originalname)
```

容易被改名，可信度較低。

#### MIME Type 來自上傳資訊

```text
image/jpeg
image/png
application/pdf
```

取得方式：

```js
req.file.mimetype
```

比副檔名可靠，但仍可能被偽造。

#### Magic Number

每種檔案格式在設計時，都會在檔案開頭預留幾個固定位元組作為格式宣告——這就是魔數（Magic Number），也叫檔案簽章（File Signature）或檔頭（File Header），簡單來說，檔案類型由內容決定，不由名稱決定。

例如：

JPEG 開頭固定是

```text
FF D8 FF
```

因此就算：

```text
cat.pdf
↓

cat.jpg
```

因此只要檢查 Magic Number，就知道它其實不是 JPEG。

---

### `callback(new Error(...))` 不是 `multer.MulterError`

如果 `fileFilter` 中寫：

```js
const fileFilter = (req, file, callback) => {
  if (file.mimetype !== "image/jpeg") {
    return callback(new Error("只接受 JPG、PNG、WebP"));
  }

  callback(null, true);
};
```

`callback(new Error(...))` 建立的是一般的 `Error`，並不是 `multer.MulterError`。

因此 Error Middleware 收到的錯誤會是：

```js
err instanceof Error              // true
err instanceof multer.MulterError // false
```

所以：

```js
if (err instanceof multer.MulterError)
```

這個條件不會成立。

如果沒有再額外處理這類一般 `Error`，程式就會繼續往下執行，最後很可能回傳：

```http
500 Internal Server Error
```

但「圖片格式不支援」屬於使用者輸入錯誤，應回傳 **400 Bad Request**，因此還需要額外處理這類 `Error`，將它們轉成適當的 HTTP Status Code，而不是一律視為伺服器錯誤。


task 10 裡利用 error.message 來判斷只是簡單處理：

```js
if (
    err.message === "只接受 JPG、PNG、WebP" ||
    err.message === "格式錯誤"
  ) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
```
---


## 參考資料

- [什麼是檔案魔數（Magic Number）？格式辨識原理與常見範例](https://viewjson.net/zh-hant/blog/what-is-file-magic-number/)