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

`metadata()` 會回傳一個包含圖片資訊的物件，常用欄位如下：

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
---

### `toFile()`：把處理結果寫到檔案

`toFile()` 本身不是負責轉檔，它只是把處理結果寫到檔案。Sharp 會根據指定的輸出格式（副檔名或 `.jpeg()`、`.png()`、`.webp()` 等）來決定輸出成什麼格式。

`toFile()` 成功後，會回傳一個 **info 物件（Object）**，裡面包含**輸出圖片**的資訊，而不是原始圖片的資訊。

例如：

```js
{
  format: 'webp',
  width: 2333,
  height: 2333,
  channels: 3,
  premultiplied: false,
  hasAlpha: false,
  size: 387792
}
```


| 屬性              | 說明                
| --------------- | ----------------- |
| `format`        | 輸出圖片格式            |
| `width`         | 輸出圖片寬度（px）        |
| `height`        | 輸出圖片高度（px）        | 
| `channels`      | 色彩通道數             |
| `premultiplied` | 表示圖片是否使用 Premultiplied Alpha（預乘 Alpha）。這是圖片處理和繪圖引擎常用的技術，用來提升合成效率。 | 
| `hasAlpha`      | 是否具有透明通道          |
| `size`          | 輸出檔案大小（Bytes）     | 

#### 單位換算
1 KB = 1024 Bytes
1 MB = 1024 KB
1 GB = 1024 MB

```text
387792 Bytes
≈ 379 KB
```

之後可以直接算：

```js
const saved = ((originalSize - info.size) / originalSize) * 100;
```

得到：

```text
節省 42%
```

---


### 並非所有格式都能互相轉換

不是每種格式都有相同能力，所以轉檔時可能會遺失某些資訊。

例如 PNG → JPEG：
```
PNG（有透明背景）
        │
        ▼
JPEG（不支援透明）
```

透明背景會消失，通常會變成白色或黑色背景（可設定）。

例如：
```js
await sharp("logo.png")
  .jpeg()
  .toFile("logo.jpg");
```
如果 logo.png 有透明背景，輸出的 logo.jpg 就一定沒有透明背景。



## 參考資源

[sharp Documentation](https://www.npmjs.com/package/sharp)

練習圖片來源：Photo by [Cédric VT](https://unsplash.com/@cedric_photography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/silver-tabby-cat-IuJc2qh2TcA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

