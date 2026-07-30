# Day 6 - File Lifecycle

> 今天目標：思考圖片從上傳到下載的完整生命週期。

（Task 16 ~ Task 18）

---
## 資料夾結構
```
day06-file-lifecycle/
├── output/
├── task16.js
├── task17.js
└── task18.js

```

---

## 筆記

###  為什麼需要唯一檔名？

圖片處理後，如果直接使用使用者上傳的原始檔名作為輸出檔名，可能導致檔案被覆蓋。

例如：

```
使用者 A
cat.jpg
↓
outputs/cat.webp

使用者 B
cat.jpg
↓
outputs/cat.webp
```

第二次上傳會直接覆蓋第一次的圖片。

因此，每次處理圖片時，都應產生唯一檔名。

---

### 唯一檔名方法一：Date.now()


`Date.now()` 是 JavaScript 內建的靜態方法，用來取得**目前時間的 Unix Timestamp（時間戳）**。

回傳值是一個 **Number**，代表自 **1970/01/01 00:00:00 UTC（Unix Epoch）** 起，經過了多少**毫秒（milliseconds）**。

可利用目前時間（Unix Timestamp）作為檔名。

```js
const filename = `${Date.now()}.webp`;
```

例如：

```
1753978834210.webp
```

#### 優點

- Node.js 內建
- 不需安裝套件
- 實作非常簡單

#### 缺點

- 無法保證 100% 不重複

    `Date.now()` 的精確度只有 **毫秒（ms）**。

    若兩次請求剛好發生在同一毫秒：

    ```
    A
    1753978834210

    B
    1753978834210
    ```

    就可能產生相同檔名。

    平常測試幾乎不會遇到，但正式網站在高併發情況下仍有機會發生。

- 容易被猜測

    若圖片網址為：

    ```
    /outputs/1753978834210.webp
    ```

    攻擊者可能依序猜測：

    ```
    1753978834211.webp
    1753978834212.webp
    ```

    安全性較差。

#### 適用情境

- Demo
- 練習專案
- 小型工具

---

### 唯一檔名方法二：crypto.randomUUID()

使用 Node.js 內建的 UUID 產生器。

```js
const crypto = require("node:crypto");

const filename = `${crypto.randomUUID()}.webp`;
```

例如：

```
550e8400-e29b-41d4-a716-446655440000.webp
```

#### UUID 是什麼？

UUID（Universally Unique Identifier）

中文通常翻譯為 **通用唯一識別碼**

目的就是讓每個識別碼幾乎不會重複。

格式通常為：

```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

例如：

```
550e8400-e29b-41d4-a716-446655440000
```

#### 優點

- Node.js 內建
- 幾乎不會重複
- 不容易被猜測
- 適合正式專案

#### 缺點

- 檔名較長

#### 適用情境

- 正式網站
- API
- Side Project

---

### 唯一檔名方法三：uuid 套件

在 Node.js 尚未內建 `crypto.randomUUID()` 前，常使用第三方套件。

安裝：

```bash
npm install uuid
```

使用：

```js
const { v4: uuidv4 } = require("uuid");

const filename = `${uuidv4()}.webp`;
```

效果與 `crypto.randomUUID()` 幾乎相同。

#### 優點

除了 v4 外，還支援多種版本：


| 版本 | 產生方式 | 特點 | 適用情境 |
|------|---------|------|---------|
| v1 | 時間 + MAC Address | 可依時間排序，但可能洩漏裝置資訊 | 舊系統、內部系統 |
| v3 | Namespace + MD5 | 相同輸入一定得到相同 UUID | 固定識別碼 |
| v4 | 完全隨機 | 最常用、碰撞率極低 | API、檔名、資料 ID |
| v5 | Namespace + SHA-1 | 與 v3 類似，但使用較安全的 SHA-1 | 固定識別碼 |
| v6 | 改良版 v1 | 保留時間排序能力，但排序更友善 | Database |
| v7 | Unix Timestamp + Random | 可排序、隨機、安全，目前越來越流行 | Database、大型系統 |

適合不同場景和需求：

v4：目前最常見，用於 API、檔名、ID（你的專案就是這個）。
v7：近年越來越受歡迎，特別是資料庫需要大量寫入和排序的系統。
v1：老系統還會看到，但新專案通常不建議使用。
v3 / v5：只有在「相同輸入必須得到相同 UUID」的需求才會用到，例如根據網址、Email 或檔案路徑產生固定識別碼。
v6：主要作為 v1 的改良版，實務上普及度不如 v4 和 v7。

#### 缺點

- 需要額外安裝套件
- Node.js 新版本通常直接使用 `crypto.randomUUID()` 即可

---

### 三種方式比較

| 方法 | 是否內建 | 是否容易撞名 | 是否容易猜測 | 建議程度 |
|------|----------|-------------|--------------|---------|
| Date.now() | ✅ | 有機會 | 容易 | ⭐⭐ |
| crypto.randomUUID() | ✅ | 幾乎不會 | 很難 | ⭐⭐⭐⭐⭐ |
| uuid 套件 | ❌ | 幾乎不會 | 很難 | ⭐⭐⭐⭐ |

---

### 為什麼不要直接使用 originalname？

例如：

```
cat.jpg
```

可能產生以下問題：

#### 1. 同名覆蓋

多位使用者可能都上傳：

```
cat.jpg
```

導致檔案互相覆蓋。


#### 2. 特殊字元

例如：

```
我的貓!!.jpg
```

可能造成跨平台相容性問題。


#### 3. 安全性問題

惡意使用者可能使用：

```
../../../secret.txt
```

若未妥善處理，可能造成 **Path Traversal（路徑穿越）** 等安全風險。


#### 4. 檔名過長

例如：

```
aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa.jpg
```

直接作為輸出檔名不易管理。

---

### 正式專案檔名常見做法

#### 方法一：UUID + 副檔名（最常見）

```
550e8400-e29b-41d4-a716-446655440000.webp
```

優點：

- 唯一性高
- 安全性佳
- 不會被覆蓋


#### 方法二：UUID + 部分原始檔名

例如：

```
550e8400-cat.webp
```

兼顧：

- 唯一性
- 可讀性

方便日後辨識檔案。

---

## 參考資料

