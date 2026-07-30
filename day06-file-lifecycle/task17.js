/*# Task 17：建立圖片預覽與下載流程

## 目標
讓使用者可以透過 URL 預覽處理後圖片，並下載圖片檔案。

## 任務
研究並實作：
- `express.static()`
- `res.sendFile()`
- `res.download()`

建立處理後圖片存放資料夾，例如：

```text
outputs/
```

提供：
- 圖片預覽 URL
- 圖片下載 URL

例如：

```text
GET /outputs/:filename
GET /downloads/:filename
```

確認 API Response 中的：

- `previewUrl`
- `downloadUrl`

可以正常使用。

## 完成條件
- 使用瀏覽器可以開啟處理後圖片
- 使用下載連結可以下載圖片
- 不存在的檔案能回傳適當錯誤，而不是讓程式中斷
- 能說明預覽與下載的回應方式有何不同

思考：
- 為什麼預覽圖片可以使用 `express.static()`，下載時卻可能使用 `res.download()`？
- 是否應允許使用者直接存取整個輸出資料夾？
- 如何避免使用者透過 URL 存取非預期檔案？
*/