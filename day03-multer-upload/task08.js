/*# Task 8：比較 Storage

## 目標
了解 Multer 的兩種 Storage 機制，並思考正式專案該如何選擇。

## 任務
分別實作：
- `memoryStorage()`
- `diskStorage()`

紀錄：
- 優點
- 缺點
- 適用情境

## 完成條件
回答：
如果是本次圖片壓縮工具，你會選擇哪一種 Storage？為什麼？

研究：
如果圖片要直接上傳到 AWS S3，通常會搭配哪種 Storage？
 */

const express = require("express");
const multer = require("multer");

const app = express();

// Disk Storage
const diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploads/");
  },

  filename: (req, file, callback) => {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    callback(null, uniqueName);
  },
});
const diskStorageUpload = multer({ storage: diskStorage });

// Memory Storage
const memoryStorage = multer.memoryStorage();
const memoryStorageUpload = multer({ storage: memoryStorage }); //檔案會在 req.file.buffer

app.post("/diskupload", diskStorageUpload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "請上傳圖片",
    });
  }
  return res.status(200).json({
    status: "success",
    file: req.file,
  });
});

app.post("/memoryupload", memoryStorageUpload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      status: "error",
      message: "請上傳圖片",
    });
  }
  return res.status(200).json({
    status: "success",
    hasBuffer: Boolean(req.file.buffer),
  });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
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
  console.log("server is running on localhost port 3000");
});
