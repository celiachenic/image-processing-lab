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