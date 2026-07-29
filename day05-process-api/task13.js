/*# Task 13：建立圖片處理 API

## 目標
整合前幾天所學，建立第一支完整的圖片處理 API。

## 任務

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

## 完成條件
成功上傳一張圖片後，可以完成圖片處理，並回傳 JSON。

思考：
如果之後要支援更多圖片處理功能（例如 Resize、Rotate、Crop），API 是否需要重新設計？為什麼？
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

app.post("/images/process", upload.single("image"), async (req, res, next) => {
  if (!req.file) {
    return next(new Error("未上傳圖片"));
  }
  try {
    const outputBuffer = await sharp(req.file.buffer)
      .webp({ quality: 80 })
      .toBuffer();
    return res.status(200).json({
      status: "success",
      message: "圖片處理成功",
      outputBufferSize: outputBuffer.length,
    });
  } catch (error) {
    return next(new Error("圖片處理出錯"));
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
    err.message === "只接受 JPG、PNG、WebP"
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
