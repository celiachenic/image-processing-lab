/*## Task 2：JPG / PNG → WebP

### 目標
了解 Sharp 最基本的圖片轉檔流程。

### 任務
- 建立 Node.js Script
- 不使用 Express
- 成功輸出 WebP

### 完成條件
成功將 JPG、PNG 轉成 WebP。*/
const sharp = require("sharp");

const main = async () => {
  try {
    const image = sharp("./images/cat.jpg");
    const info = await image.toFile("./output/cat.webp");
    console.log(info);
  } catch (error) {
    console.log(error.message);
  }
};

main();
