/*# Task 12：統一 Error Handling

## 目標
建立一致的錯誤處理流程，讓 API 回傳格式統一且容易維護。

## 任務
處理至少以下情境：
- 未上傳圖片
- 不支援的圖片格式
- 檔案超過 5MB
- 建立 Error Handler Middleware
- 將 Multer 錯誤交由 Error Middleware 統一處理

統一回傳格式，例如：

```json
{
  "status": "error",
  "message": ""
}
```

## 完成條件
每種錯誤：
- 都有適當的 HTTP Status Code
- 都有明確的錯誤訊息
- 不會直接回傳 500 Internal Server Error

思考：
如果未來錯誤種類越來越多，是否適合建立一個共用的 Error Handler Middleware？它有哪些優點？
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
    fileSize: 5 * 1024 * 1024, //5 MB
  },
});

app.post("/upload", upload.single("image"), (req, res, next) => {
  if (!req.file) {
    return next(new Error("未上傳圖片"));
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

  if (
    err.message === "未上傳圖片" ||
    err.message === "只接受 JPG、PNG、WebP" ||
    err.message === "格式錯誤"
  ) {
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
