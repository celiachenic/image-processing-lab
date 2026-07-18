/*## Task 3：Quality 比較

### 目標
了解圖片品質與檔案大小的取捨。

### 任務

輸出：
- quality = 100
- quality = 80
- quality = 50
- quality = 20

紀錄：
- 原始大小
- 輸出大小
- 壓縮比例
- 視覺差異

## 完成條件
理解「為什麼許多工具預設使用 quality = 80？」
試著找一張照片與一張插圖，比較兩者壓縮後的差異。*/

const sharp = require("sharp");

//用 fs 模組的 stat.size 取得原始圖片檔案大小
const fspromises = require("fs/promises");
const getOriginalImageSize = async (path) => {
  const stat = await fspromises.stat(path);
  const originalSize = stat.size;
  return originalSize;
};

const main = async () => {
  const qualityValues = [100, 80, 50, 20];
  const originalPath = "./images/cat.jpg";

  try {
    const originalSize = await getOriginalImageSize(originalPath);
    console.log(
      `原始大小：${originalSize} bytes ≒ ${Math.round(originalSize / 1024)} KB`,
    );

    for (const value of qualityValues) {
      const image = sharp(originalPath);
      console.log(`quality 值：${value}`);

      const info = await image
        .jpeg({ quality: value })
        .toFile(`./output/quality${value}.jpg`);
      console.log(
        `輸出大小：${info.size} bytes ≒ ${Math.round(info.size / 1024)} KB`,
      );
      console.log(
        `節省比例：${Math.round(((originalSize - info.size) / originalSize) * 100)}%`,
      );
      console.log("-----------------");
    }
  } catch (error) {
    console.log(error.message);
  }
};

main();

/* console 結果：

原始大小：900980 bytes ≒ 880 KB
quality 值：100
輸出大小：2242274 bytes ≒ 2190 KB
節省比例：-149%
-----------------
quality 值：80
輸出大小：723869 bytes ≒ 707 KB
節省比例：20%
-----------------
quality 值：50
輸出大小：315783 bytes ≒ 308 KB
節省比例：65%
-----------------
quality 值：20
輸出大小：168038 bytes ≒ 164 KB
節省比例：81%

*/
