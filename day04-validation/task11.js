/*# Task 11：限制檔案大小

## 目標
避免使用者上傳過大的圖片，保護伺服器資源。

## 任務
- 使用 Multer 設定 `limits.fileSize`
- 限制單張圖片大小為 **5MB**
- 超過限制時回傳 **HTTP 413**
- 提供清楚的錯誤訊息

## 完成條件
使用 Postman 測試：
- 小於 5MB
- 大於 5MB

兩種情況皆能正常回應。

思考：
為什麼圖片太大通常使用 **413 Payload Too Large**，而不是 **400 Bad Request**？
*/

const express = require("express");
const multer = require("multer");
const path = require("path");
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

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, //5MB
  },
});

app.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "未上傳圖片",
    });
  }
  return res.status(200).json({
    status: "success",
    message: "上傳成功",
    fileSizeMB: `${(req.file.size / 1024 / 1024).toFixed(2)} MB`,
  });
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

  if (err.message === "只接受 JPG、PNG、WebP" || err.message === "格式錯誤") {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "伺服器發生錯誤",
  });
});

app.listen(3000, () => {
  console.log("server is running on localhost port 3000.");
});
