/*# Task 10：圖片格式驗證

## 目標
建立第一層輸入驗證，確保 API 只接受支援的圖片格式。

## 任務
允許：
- JPG
- PNG
- WebP

拒絕：
- PDF
- TXT
- 其他非圖片檔案

研究：
- 副檔名（Extension）
- MIME Type
- 真正的檔案格式（Magic Number，可先了解概念）

## 完成條件
- 成功阻擋非圖片檔案
- 回傳清楚的錯誤訊息
- 能說明副檔名驗證與 MIME Type 驗證的差異

研究：
如果使用者把 `cat.pdf` 改名成 `cat.jpg`，API 是否仍可能被騙？為什麼？
*/