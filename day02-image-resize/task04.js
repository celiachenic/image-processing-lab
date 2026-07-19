/*# Task 4：等比例縮圖

## 目標
了解 Sharp 如何在不改變圖片比例的情況下縮放圖片。

## 任務
- 將圖片寬度設定為 `1000px`
- 確認圖片沒有變形
- 比較縮放前後的圖片尺寸
- 記錄縮放前後的檔案大小

## 完成條件
能解釋：
- 為什麼只設定 `width` 就能維持圖片比例？
- 哪些情況適合先縮放再壓縮？

研究：
- `fit`
- `withoutEnlargement`
並了解用途。
*/

const sharp = require("sharp");
const fspromises = require("node:fs/promises");

const getFileSize = async (path) => {
  return (await fspromises.stat(path)).size;
};

const originalPath = "./images/cat.jpg";
const outputPath = "./output/cat-width1000.jpg";

const main = async () => {
  try {
    const originalSize = await getFileSize(originalPath);
    const metadata = await sharp(originalPath).metadata();

    const info = await sharp(originalPath)
      .resize({
        width: 1000,
      })
      .toFile(outputPath);

    const originalRatio = metadata.width / metadata.height;
    const outputRatio = info.width / info.height;
    const ratioDifference = Math.abs(originalRatio - outputRatio);

    console.log(`原始檔案大小：${originalSize} Bytes`);
    console.log(`原始檔案寬度：${metadata.width} px`);
    console.log(`原始檔案高度：${metadata.height} px`);
    console.log(`原始長寬比：${originalRatio}`);

    console.log("==============================");

    console.log(`縮放後檔案大小：${info.size} Bytes`);
    console.log(`縮放後寬度：${info.width} px`);
    console.log(`縮放後高度：${info.height} px`);
    console.log(`縮放後長寬比：${outputRatio}`);

    console.log("==============================");

    // 以 0.01 作為本練習可接受的長寬比誤差
    if (ratioDifference < 0.01) {
      console.log("縮放前後長寬比視為相同");
      console.log("微小差異來自高度像素必須取整數");
    } else {
      console.log("縮放前後長寬比不同");
    }
  } catch (error) {
    console.error(error.message);
  }
};

main();

/* console 

原始檔案大小：262179 Bytes
原始檔案寬度：1920 px
原始檔案高度：1280 px
原始長寬比：1.5
==============================
縮放後檔案大小：53678 Bytes
縮放後寬度：1000 px
縮放後高度：667 px
縮放後長寬比：1.4992503748125936
==============================
縮放前後長寬比視為相同
微小差異來自高度像素必須取整數
*/
