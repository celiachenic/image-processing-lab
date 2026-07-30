/*# Task 16：產生唯一檔名

## 目標
避免不同使用者上傳相同檔名時，處理後的圖片互相覆蓋。

## 任務
比較以下檔名產生方式：

- `Date.now()`
- `crypto.randomUUID()`
- UUID 套件

產生處理後圖片的唯一檔名，例如：

```text
550e8400-e29b-41d4-a716-446655440000.webp
```

測試：
- 連續上傳兩張相同檔名的圖片
- 確認輸出檔案不會互相覆蓋
- 確認輸出副檔名固定為 `.webp`

#### 完成條件
每次圖片處理都能產生唯一檔名，且不直接信任使用者提供的原始檔名。

思考：
- 為什麼不應直接使用 `req.file.originalname` 作為輸出檔名？
- `Date.now()` 是否能完全保證檔名不重複？
- 是否需要保留部分原始檔名，方便使用者辨識？
*/
const express = require("express");
const crypto = require("node:crypto");
const multer = require("multer");
const app = express();

const generateFilename = () => {
  const filename = `${crypto.randomUUID()}.webp`;
  return filename;
};

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

app.post("/images/process", upload.single("image"), (req, res, next) => {
  if (!req.file) {
    return next(new Error("未上傳檔案"));
  }
  const filename = generateFilename();
  //省略 sharp image process
  return res.status(200).json({
    status: "success",
    filename,
  });
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({
        status: "error",
        message: "檔案超過 5 MB 限制",
      });
    }
    return res.status(400).json({
      status: "error",
      message: err.message,
    });
  }
  if (err.message === "未上傳檔案") {
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

/*
測試結果：

使用 Postman 連續上傳相同檔名的圖片，API 每次皆產生不同的 UUID 檔名，且副檔名固定為 `.webp`。

目前尚未整合 Sharp 與實際存檔流程，因此本 Task 先驗證唯一檔名的產生邏輯；實際檔案是否不會被覆蓋，將於後續整合 `toFile()` 或 `fs.writeFile()` 時再次確認。
*/