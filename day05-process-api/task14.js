/*# Task 14：驗證圖片處理參數

## 目標
建立圖片處理參數驗證，避免非法輸入造成程式錯誤。

## 任務

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

## 完成條件
所有非法輸入都能回傳適當的 HTTP Status Code 與錯誤訊息，而不會直接進入圖片處理流程。

思考：
哪些參數應該在 Controller 驗證？哪些適合交給圖片處理函式判斷？
 */

/* 合格參數格式：
quality
---------
型別：Number
範圍：1 ~ 100（含）

maxWidth
---------
型別：Number
範圍：> 0
 */

const express = require("express");
const multer = require("multer");
const sharp = require("sharp");
const path = require("node:path");
const app = express();

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
    const outputBuffer = await sharp(req.file.buffer)
      .resize({ width: maxWidth, withoutEnlargement: true })
      .webp({ quality })
      .toBuffer();
    return res.status(200).json({
      status: "success",
      message: "圖片處理成功",
      outputBufferSize: outputBuffer.length,
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
    err.message === "MIME Type 不支援" ||
    err.message === "只接受 JPG、PNG、WebP" ||
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
    message: "伺服器出錯",
  });
});
app.listen(3000, () => {
  console.log("server is running on localhost port 3000.");
});
