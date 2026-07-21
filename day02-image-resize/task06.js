/*# Task 6：封裝圖片處理函式

## 目標
將圖片處理流程封裝成可重複使用的函式。

## 任務
建立：
```js
processImage({
  inputPath,
  outputPath,
  quality,
  maxWidth,
});
```

功能包含：
- WebP 轉檔
- quality
- resize
- 回傳處理資訊（可自行設計）

#### 完成條件
之後所有圖片處理都能透過 `processImage()` 完成，而不是重複撰寫 Sharp 程式碼。

思考：
如果未來要支援 JPEG、PNG，只需要修改哪裡？
*/

const sharp = require("sharp");

const processImage = async ({
  inputPath,
  outputPath,
  quality = 80,
  maxWidth,
}) => {
  const info = await sharp(inputPath)
    .resize({
      width: maxWidth,
      withoutEnlargement: true,
    })
    .webp({ quality })
    .toFile(outputPath);
  return {
    format: info.format,
    size: info.size,
    width: info.width,
    height: info.height,
  };
};

const main = async () => {
  try {
    const result = await processImage({
      inputPath: "./images/cat.jpg",
      outputPath: "./output/task06Test.webp",
      quality: 80,
      maxWidth: 1200,
    });
    console.log(result);
  } catch (error) {
    console.error(error.message);
  }
};

main();

/*console

{ format: 'webp', size: 43902, width: 1200, height: 800 }

*/