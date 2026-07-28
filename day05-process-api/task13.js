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