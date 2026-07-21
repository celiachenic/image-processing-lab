/*# Task 5：maxWidth

## 目標
實作圖片「只縮小、不放大」的邏輯。

## 任務
需求：
- 原圖寬度大於 `maxWidth` 時縮小
- 原圖寬度小於 `maxWidth` 時維持原尺寸
- 測試一張大圖
- 測試一張小圖

## 完成條件
能說明：
- 為什麼網站通常不會放大小圖片？
- `maxWidth` 的設計可以解決什麼問題？

比較：
- `width`
- `height`
- `fit`
三者的差異。
*/
const sharp = require("sharp");
const inputPath = "./images/cat-width1000.jpg"; //以寬度1000px的圖片作為測試基準

const main = async () => {
  try {
    const originalWidth = (await sharp(inputPath).metadata()).width;

    //測試原圖寬度大於 maxWidth
    const maxWidth500 = 500;
    const test1Info = await sharp(inputPath)
      .resize({ width: maxWidth500, withoutEnlargement: true })
      .toFile("./output/maxwidth500.jpg");
    console.log(`原始寬度：${originalWidth} px`);
    console.log(`將 width 設定為 ${maxWidth500} px`);
    console.log(`測試結果：寬度為 ${test1Info.width} px`);

    console.log("===================");

    //測試原圖寬度小於 maxWidth
    const maxWidth2000 = 2000;
    const test2Info = await sharp(inputPath)
      .resize({ width: maxWidth2000, withoutEnlargement: true })
      .toFile("./output/maxwidth2000.jpg");
    console.log(`原始寬度：${originalWidth} px`);
    console.log(`將 width 設定為 ${maxWidth2000} px`);
    console.log(`測試結果：寬度為 ${test2Info.width} px`);
  } catch (error) {
    console.error(error.message);
  }
};

main();

/*console：

原始寬度：1000 px
將 width 設定為 500 px
測試結果：寬度為 500 px
===================
原始寬度：1000 px
將 width 設定為 2000 px
測試結果：寬度為 1000 px

*/
