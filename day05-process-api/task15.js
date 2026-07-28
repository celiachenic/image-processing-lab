
/*# Task 15：設計 API Response

## 目標
建立一致且容易被前端使用的 API 回傳格式。

## 任務
成功時回傳：

```json
{
  "filename": "",
  "originalSize": 0,
  "outputSize": 0,
  "savedPercent": 0,
  "format": "webp",
  "previewUrl": "",
  "downloadUrl": ""
}
```

計算：
- originalSize
- outputSize
- savedPercent

確認：
- JSON 欄位命名一致
- 前端容易使用

## 完成條件
能正確回傳圖片資訊，並計算壓縮比例。

思考：
如果轉檔後圖片反而變大，`savedPercent` 應該如何呈現？是否需要另外顯示提示？
*/