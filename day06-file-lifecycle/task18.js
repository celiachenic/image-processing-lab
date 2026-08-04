/*# Task 18：設計暫存檔清理策略

## 目標
了解上傳檔案與輸出檔案的生命週期，避免伺服器長期累積無用檔案。

## 任務
整理圖片處理過程中可能產生的檔案：
- 原始上傳檔案
- 處理後圖片
- 圖片處理失敗時留下的檔案

比較以下清理策略：
- 圖片處理完成後立即刪除原始檔案
- 處理後圖片保留一段時間再刪除
- Server 啟動時清理過期檔案
- 使用排程定期清理檔案

至少實作一種策略，例如：

```text
圖片處理成功
↓
回傳處理結果
↓
刪除原始上傳檔案
```

測試：
- 圖片處理成功
- Sharp 處理失敗
- 檔案不存在
- 刪除檔案失敗

## 完成條件
- 至少完成一種檔案清理策略
- 清理失敗時不會造成整個請求崩潰
- 能說明原始檔與輸出檔分別應保留多久
- 將採用的清理策略記錄於 `notes/day06.md`

思考：
- 如果 API 回傳後立刻刪除輸出圖片，使用者還能下載嗎？
- 使用 `setTimeout()` 清理檔案有哪些限制？
- 如果伺服器重新啟動，尚未清理的檔案該怎麼辦？
- 正式部署後，將圖片存在本機硬碟可能遇到哪些問題？
 */

/*task 18 先專注於實做刪除 outputs 資料夾內過期檔案
 目前設定一分鐘過期，比較好確認是否真的有刪除
*/

const fspromises = require("node:fs/promises");
const path = require("path");

const dirpath = path.join(__dirname, "outputs");
const EXPIRE_TIME = 60 * 1000; // 測試用：1 分鐘 ( 60000 毫秒)

const readDir = async (dirpath) => {
  return fspromises.readdir(dirpath);
};

const main = async () => {
  let files;
  try {
    files = await readDir(dirpath);
  } catch (error) {
    console.log("讀取資料夾失敗");
    return; //避免後續繼續執行
  }
  for (const file of files) {
    const filepath = path.join(dirpath, file);
    try {
      const stat = await fspromises.stat(filepath);
      //若已建立 1 分鐘以上就刪除
      if (Date.now() > stat.birthtimeMs + EXPIRE_TIME) {
        await fspromises.unlink(filepath);
        console.log(`已刪除過期檔案：${file}`);
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        console.log("檔案已不存在");
      } else {
        console.error("檔案處理失敗", error);
      }
    }
  }
};
main();
