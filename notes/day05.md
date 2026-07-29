# Day 5 - Process API

> 今天目標：整合前幾天成果，建立第一支完整圖片處理 API。

（Task 13 ~ Task 15）

---
## 資料夾結構
```
day05-process-api/
├── task13.js
├── task14.js
└── task15.js

```

---

## 筆記

### Node Script 和 Express API 架構差異

#### Sharp 在 Node Script（Day1~Day2）

只有執行一次，所以需要一個入口。

```text
main()
  ↓
讀圖片
  ↓
Sharp 處理
  ↓
輸出圖片
  ↓
程式結束
```

```js
async function main() {
  const result = await sharp(inputPath)
    .webp()
    .toFile(outputPath);

  console.log(result);
}

main();
```

> **main() = 程式入口（只執行一次）**

#### Sharp 在 Express（Day5）

Express 本身就是 Server。

Server 啟動後會一直等待 Request，因此 **Route Handler 就變成新的入口**。

```text
Server 啟動
      ↓
等待 Request
      ↓
POST /images/process
      ↓
Validation
      ↓
Sharp 處理
      ↓
Response
```

```js
app.post("/images/process", async (req, res, next) => {
  // 以前 main() 裡面的程式寫在這裡
});
```

> **Route Handler = 新的入口（每個 Request 都會執行一次）**

基本架構整合：

```text
POST /images/process
        │
        ▼
upload.single("image")
        │
        ▼
Validation
(req.file、格式、大小)
        │
        ▼
sharp(req.file.buffer)
        │
        ▼
.toBuffer()
        │
        ▼
res.json(...)
```
---

### Buffer 與 `length`

Buffer 是 **Node.js 用來存放二進位資料（Binary Data）** 的物件。

例如：

* 圖片
* 影片
* 音訊
* PDF

都會以 Buffer 的形式存在記憶體。

```js
req.file.buffer
```

就是 Multer 讀進來的圖片資料。


#### Buffer 長什麼樣

可以想像成：

```text
Buffer
┌────┬────┬────┬────┬────┐
│255 │216 │255 │224 │... │
└────┴────┴────┴────┴────┘
```

每一格都是 **1 Byte**。

#### Buffer.length

`length` 代表 Buffer 佔用了多少 Bytes。

例如：

```js
const buffer = Buffer.from("Hello");

console.log(buffer.length);
```

輸出：

```text
5
```

因為：

```text
H e l l o
```

共有 5 Bytes（ASCII）。


#### 在圖片處理中的用途

Multer 上傳圖片後：

```js
req.file.buffer
```

就是原始圖片。

例如：

```text
cat.jpg
↓
Buffer
↓
500000 Bytes
```

經過 Sharp：

```js
const outputBuffer = await sharp(req.file.buffer)
  .webp({ quality: 80 })
  .toBuffer();
```

得到新的 Buffer：

```text
WebP Buffer
↓
180000 Bytes
```

因此：

```js
outputBuffer.length
```

代表壓縮後圖片大小（Bytes）

#### buffer 的大小是 `.length`，不是 `.size`

Buffer 沒有 `size` 屬性。

* `req.file.size`：Multer 提供的原始檔案大小。
* `outputBuffer.length`：Sharp 處理後 Buffer 的大小（也就是輸出圖片大小），。


---

## 參考資料

