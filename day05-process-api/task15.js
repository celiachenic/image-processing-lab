/*# Task 15：設計 API Response

## 目標
建立一致且容易被前端使用的 API 回傳格式。

## 任務
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

## 完成條件
能正確回傳圖片資訊，並計算壓縮比例。

思考：
如果轉檔後圖片反而變大，`savedPercent` 應該如何呈現？是否需要另外顯示提示？
*/

const express = require("express");
const sharp = require("sharp");
const multer = require("multer");
const path = require("node:path");
const fs = require("node:fs");
const app = express();

fs.mkdirSync("./outputs", {
  recursive: true,
});

// multer
const storage = multer.memoryStorage();
const fileFilter = (req, file, callback) => {
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return callback(new Error("只接受 JPG、PNG、WebP"));
  }
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(new Error("MIME Type 不支援"));
  }
  return callback(null, true);
};
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

const checkQuality = (quality) => {
  return Number.isInteger(quality) && quality >= 1 && quality <= 100;
};
const checkMaxWidth = (maxWidth) => {
  return Number.isInteger(maxWidth) && maxWidth > 0;
};

//sharp
const imageProcess = async (inputBuffer, quality, maxWidth) => {
  const filename = `${Date.now()}.webp`;
  const sharpInfo = await sharp(inputBuffer)
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality })
    .toFile(`./outputs/${filename}`);
  return { sharpInfo, filename };
};

app.post("/images/process", upload.single("image"), async (req, res, next) => {
  if (!req.file) {
    return next(new Error("未上傳圖片"));
  }

  const quality = Number(req.body.quality);
  const maxWidth = Number(req.body.maxWidth);
  if (!checkQuality(quality))
    return next(new Error("quality 必須是 1 到 100 的整數"));
  if (!checkMaxWidth(maxWidth))
    return next(new Error("maxWidth 必須是大於 0 的整數"));

  try {
    const info = await imageProcess(req.file.buffer, quality, maxWidth);
    const originalSize = req.file.size;
    const outputSize = info.sharpInfo.size;
    const savedPercent = Number(
      (((originalSize - outputSize) / originalSize) * 100).toFixed(2),
    );

    return res.status(200).json({
      status: "success",
      message: "圖片處理成功",
      filename: info.filename,
      originalSize,
      outputSize,
      savedPercent,
      format: info.sharpInfo.format,
      //previewUrl 與 downloadUrl 目前僅為 API 回傳格式，真正提供圖片預覽與下載功能會在 Day 7 實作。
      previewUrl: "",
      downloadUrl: "",
    });
  } catch (error) {
    return next(error);
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        status: "error",
        message: "圖片大小超過 5MB 限制",
      });
    }
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
  if (
    err.message === "未上傳圖片" ||
    err.message === "只接受 JPG、PNG、WebP" ||
    err.message === "MIME Type 不支援" ||
    err.message === "quality 必須是 1 到 100 的整數" ||
    err.message === "maxWidth 必須是大於 0 的整數"
  ) {
    return res.status(400).json({
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
