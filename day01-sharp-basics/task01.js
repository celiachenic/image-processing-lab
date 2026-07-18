/*## Task 1：讀取圖片 Metadata

### 目標
了解 Sharp 能取得哪些圖片資訊。

### 任務
- 使用 `sharp().metadata()`
- 印出 format
- 印出 width
- 印出 height
- 印出 channels
- 測試 JPG、PNG、WebP

### 完成條件
能說明每個 metadata 欄位代表什麼。*/

const sharp = require("sharp");

const main = async () => {
  try {
    const image = sharp("./images/cat.jpg");
    //建立一個要處理 cat.jpg 的 Sharp 物件
    //只是建立圖片處理流程（Pipeline）。後續呼叫 metadata()、toFile()、toBuffer() 等方法時，才會開始執行處理。

    const metadata = await image.metadata();
    console.log(`圖片格式：${metadata.format}`);
    console.log(`圖片寬度：${metadata.width}`);
    console.log(`圖片高度：${metadata.height}`);
    console.log(`圖片色彩通道數：${metadata.channels}`);
  } catch (error) {
    console.log(error.message);
  }
};

main();
