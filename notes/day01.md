# Day 1 - Sharp Basics

> 今天目標：熟悉 Sharp 的核心功能，理解圖片資訊、轉檔與壓縮品質。
> 
（Task 1 ~ Task 3）

---
## 資料夾結構
```
day01-sharp-basics/
├── images/
│   └── cat.jpg
├── output/
├── task01.js
├── task02.js
└── task03.js
```

---

## 筆記
      
### 需建立 output 資料夾

存放輸入和輸出圖片的資料夾需分開，若圖片都存在同一個資料夾裡，會有混淆甚至覆蓋掉原圖的風險，因此須建立 output 資料夾。

```
images/      ← 原始素材（不要動）
output/      ← 所有測試結果
```

注意，sharp 不會自行建立不存在的資料夾，可先用node 內建的 fs 模組來檢查：

```js
import fs from "node:fs/promises";

await fs.mkdir("./output", {
  recursive: true,
});
```
---

### sharp 的圖片處理API多為非同步


Sharp 的 `metadata()`、`toFile()`、`toBuffer()` 等方法會回傳 Promise，因此通常需要搭配 `await` 或 `.then()` 使用。

`sharp()` 本身只是建立圖片處理流程（Pipeline），真正的圖片處理會在呼叫 `metadata()`、`toFile()`、`toBuffer()` 等方法時執行。

例如：

```js
const image = sharp("./cat.jpg"); // 建立流程（同步）

const metadata = await image.metadata(); // 執行處理（非同步）
```

---
### `metadata()`：取得圖片資訊

`metadata()` 會回傳一個包含圖片資訊的物件（Object），常用欄位如下：

| 欄位 | 說明 |
|------|------|
| `format` | 圖片格式，例如 `jpeg`、`png`、`webp` |
| `width` | 圖片寬度（px） |
| `height` | 圖片高度（px） |
| `channels` | 色彩通道數，`RGB = 3`、`RGBA = 4` |
| `hasAlpha` | 是否具有透明通道（Alpha Channel） |

例如：

```js
const metadata = await sharp("./cat.jpg").metadata();

console.log(metadata.width);      // 2333
console.log(metadata.height);     // 2333
console.log(metadata.format);     // jpeg
console.log(metadata.hasAlpha);   // false
```


## 參考資源

[sharp Documentation](https://www.npmjs.com/package/sharp)

練習圖片來源：Photo by [Cédric VT](https://unsplash.com/@cedric_photography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/silver-tabby-cat-IuJc2qh2TcA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

