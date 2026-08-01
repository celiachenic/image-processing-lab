/*# Task 17：建立圖片預覽與下載流程

## 目標
讓使用者可以透過 URL 預覽處理後圖片，並下載圖片檔案。

## 任務
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

## 完成條件
- 使用瀏覽器可以開啟處理後圖片
- 使用下載連結可以下載圖片
- 不存在的檔案能回傳適當錯誤，而不是讓程式中斷
- 能說明預覽與下載的回應方式有何不同

思考：
- 為什麼預覽圖片可以使用 `express.static()`，下載時卻可能使用 `res.download()`？
- 是否應允許使用者直接存取整個輸出資料夾？
- 如何避免使用者透過 URL 存取非預期檔案？
*/

const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const path = require("path");
const fs = require("node:fs");
const crypto = require("node:crypto");

const app = express();
fs.mkdirSync(path.join(__dirname, "outputs"), {
  recursive: true,
});

const generateFilename = () => {
  const filename = `${crypto.randomUUID()}.webp`;
  return filename;
};

const imageProcess = async (buffer) => {
  const filename = generateFilename();
  const outputPath = path.join(__dirname, "outputs", filename);
  await sharp(buffer).webp({ quality: 80 }).toFile(outputPath);
  return filename;
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  //fileFilter,
  // limits: { fileSize: 5 * 1024 * 1024 },
});

const checkFilename = (filename) => {
  const arr = filename.split(".");
  if (arr[arr.length - 1] !== "webp") {
    return false;
  }
  return true;
};

app.post("/images/process", upload.single("image"), async (req, res, next) => {
  if (!req.file) {
    return next(new Error("未上傳檔案"));
  }
  try {
    const filename = await imageProcess(req.file.buffer);
    return res.status(200).json({
      status: "success",
      filename,
      previewUrl: `/preview/${filename}`,
      downloadUrl: `/download/${filename}`,
      staticPreviewUrl:`/outputs/${filename}`
    });
  } catch (error) {
    return next(new Error("圖片處理失敗"));
  }
});
//express.static() 預覽
const outputs = path.join(__dirname, 'outputs')
app.use("/outputs", express.static(outputs));


//res.sendFile() 預覽
app.get("/preview/:filename", (req, res, next) => {
  const filename = req.params.filename;

  if (!checkFilename(filename)) {
    return next(new Error("非法檔名"));
  }
  const outputPath = path.join(__dirname, "outputs", filename);

  if (!fs.existsSync(outputPath)) {
    return res.status(404).json({
      status: "error",
      message: "找不到圖片",
    });
  }
  return res.sendFile(outputPath, (err) => {
    if (err) return next(new Error("預覽失敗"));
  });
});

//res.download() 下載
app.get("/download/:filename", (req, res, next) => {
  const filename = req.params.filename;
  if (!checkFilename(filename)) {
    return next(new Error("非法檔名"));
  }
  const outputPath = path.join(__dirname, "outputs", filename);

  if (!fs.existsSync(outputPath)) {
    return res.status(404).json({
      status: "error",
      message: "找不到圖片",
    });
  }
  return res.download(outputPath, (err) => {
    if (err) return next(new Error("下載失敗"));
  });
});

app.use((err, req, res, next) => {
  if (err.message === "未上傳檔案" || err.message === "非法檔名") {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
  if (
    err.message === "圖片處理失敗" ||
    err.message === "下載失敗" ||
    err.message === "預覽失敗"
  ) {
    return res.status(500).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: "伺服器錯誤",
  });
});

app.listen(3000, () => {
  console.log("server is running on localhost port 3000.");
});
