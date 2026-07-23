/*# Task 9：未上傳圖片

## 目標
處理最常見的 API 錯誤情境。

## 任務
當沒有上傳圖片時：

- 回傳 HTTP 400
- 回傳清楚錯誤訊息
- 避免程式發生例外（Exception）

例如：
```json
{
  "status": "error",
  "message": "請上傳圖片"
}
```

## 完成條件
使用 Postman 測試：
- 有圖片
- 沒有圖片

兩種情境皆能正常回應。

思考：
為什麼不應該讓這種錯誤變成 HTTP 500？
 */

const express = require("express");
const multer = require("multer");
const fs = require("node:fs");

fs.mkdirSync("./upload", {
  recursive: true,
});

const app = express();

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "./upload");
  },
  filename: (req, file, callback) => {
    const unique = Date.now();
    const originalName = file.originalname;
    callback(null, `${unique}-${originalName}`);
  },
});
const upload = multer({ storage });

app.post("/upload", upload.single("image"), (req, res) => {
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

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
  return res.status(500).json({
    status: "error",
    message: "伺服器出問題",
  });
});

const server = app.listen(3000, () => {
  console.log("server is running on localhost port 3000.");
});

server.on("error", (err) => {
  console.error("Server 啟動失敗：", err.message);
});
