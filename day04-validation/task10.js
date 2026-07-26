/*# Task 10：圖片格式驗證

## 目標
建立第一層輸入驗證，確保 API 只接受支援的圖片格式。

## 任務
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

## 完成條件
- 成功阻擋非圖片檔案
- 回傳清楚的錯誤訊息
- 能說明副檔名驗證與 MIME Type 驗證的差異

研究：
如果使用者把 `cat.pdf` 改名成 `cat.jpg`，API 是否仍可能被騙？為什麼？
*/

const express = require("express");
const multer = require("multer");
const path = require("node:path");

const app = express();
const storage = multer.memoryStorage();
const fileFilter = (req, file, callback) => {
  const extension = path.extname(file.originalname).toLowerCase();
  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];
  const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];

  if (!allowedExtensions.includes(extension)) {
    return callback(new Error("只接受 JPG、PNG、WebP"));
  }
  if (!allowedMimeTypes.includes(file.mimetype)) {
    return callback(new Error("格式錯誤"));
  }
  return callback(null, true);
};

const upload = multer({ storage, fileFilter });
app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "未上傳圖片",
    });
  }
  return res.status(200).json({
    status: "success",
    extension: path.extname(req.file.originalname).toLowerCase(),
    mimetype: req.file.mimetype,
  });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }

  if (err.message === "只接受 JPG、PNG、WebP" || err.message === "格式錯誤") {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }

  return res.status(500).json({
    status: "error",
    message: err.message,
  });
});

app.listen(3000, () => {
  console.log("server is running on localhost port 3000.");
});
