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

> 注意：原始檔案大小需使用 fs 模組取得，無法直接透過 `metadata()`存取
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

---

### `metadata()` 不會有檔案大小，要用 fs 模組取得檔案大小

- `metadata()`：看「圖片內容」的資訊（格式、尺寸、通道等）。
- `fs.stat()`：看「檔案」的資訊（大小、建立時間、修改時間等）。


```js
//使用 fs 模組取得原始檔案大小
const fs = require("node:fs/promises");

const stat = await fs.stat("./images/cat.jpg");
console.log(stat.size);
```

---

### Quality = 100 的意思

#### 疑問

執行 `.jpeg({ quality: 100 })` 後，為什麼輸出的檔案反而比原始檔更大？

```text
原始大小：900980 bytes ≒ 880 KB
輸出大小：2242274 bytes ≒ 2190 KB
節省比例：-149%（表示檔案反而變大）
```

#### 原因

`quality: 100` **不代表保留原始檔案大小**，而是告訴 JPEG 編碼器：

> **以最高品質重新編碼圖片，盡可能保留細節，減少壓縮。**

Sharp 讀入後會先解碼，再用你指定的設定重新編碼：
```
原始 JPEG（已壓縮）
        ↓ 解碼
圖片像素資料
        ↓ quality 100 重新編碼
新的 JPEG（壓縮很少）
```

因此，Sharp 會重新產生一張新的 JPEG，而不是沿用原本的壓縮結果。

如果原始圖片本身已經是經過壓縮的 JPEG（例如 quality 約 80），重新以 `quality: 100` 編碼後，輸出的檔案就可能比原始檔更大。

---

### 注意：Quality 不是「畫質百分比」

`quality: 100` 並不表示：

* 畫質是原圖的 100%
* 完全不壓縮
* 檔案大小維持不變

它只是 **JPEG 編碼器的品質設定（Quality Setting）**。

一般而言：

```text
Quality 越高
↓
壓縮越少
↓
保留更多細節
↓
檔案通常越大
```

反之：

```text
Quality 越低
↓
壓縮越多
↓
檔案越小
↓
細節流失越明顯
```

---

### 為什麼許多工具預設使用 Quality = 80？

`quality: 100` 通常會讓檔案明顯變大，但肉眼看到的畫質提升卻有限。

相較之下，`quality: 80` 往往能：

* 大幅減少檔案大小
* 保留大部分細節
* 肉眼幾乎看不出與原圖的差異

因此，多數圖片壓縮工具都會將 **80 左右** 作為預設值，在畫質與檔案大小之間取得良好的平衡。

---


## 參考資源

[sharp Documentation](https://www.npmjs.com/package/sharp)

練習圖片來源：Photo by [Cédric VT](https://unsplash.com/@cedric_photography?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/photos/silver-tabby-cat-IuJc2qh2TcA?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText)

