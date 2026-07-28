/*# Task 14：驗證圖片處理參數

## 目標
建立圖片處理參數驗證，避免非法輸入造成程式錯誤。

## 任務

驗證：
- quality
- maxWidth

測試：
- quality = abc
- quality = 0
- quality = 101
- maxWidth = abc
- maxWidth = -100

提供清楚的錯誤訊息。

## 完成條件
所有非法輸入都能回傳適當的 HTTP Status Code 與錯誤訊息，而不會直接進入圖片處理流程。

思考：
哪些參數應該在 Controller 驗證？哪些適合交給圖片處理函式判斷？
 */