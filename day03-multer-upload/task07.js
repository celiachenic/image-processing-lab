/*#Task 7：單張圖片上傳

## 目標
建立第一支可以接收圖片的 API。

## 任務

建立：
```http
POST /upload
```

- 使用 `multipart/form-data`
- 成功取得 `req.file`
- 印出 `req.file` 內容
- 使用 Postman 測試

## 完成條件
理解 `req.file` 包含哪些資訊：

- originalname
- mimetype
- size
- filename
- path

研究：
`req.body` 與 `req.file` 的差異。*/