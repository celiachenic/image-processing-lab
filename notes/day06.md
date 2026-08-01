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


###  Static File 靜態資源

Static File（靜態資源）是指**不需要經過伺服器運算即可直接回傳給使用者的檔案**。

常見的靜態資源：

- HTML
- CSS
- JavaScript
- 圖片（JPG、PNG、WebP）
- PDF
- 影片

例如：

```text
outputs/
├── cat.webp
├── dog.webp
└── bird.webp
```

Express 可以直接將這些檔案提供給瀏覽器存取。

---

### `express.static()`：將某個資料夾公開成可透過 URL 存取的靜態資源。

例如：

```js
app.use("/outputs", express.static(path.join(__dirname, "outputs")));
```

Express 會自動處理檔案回傳。

資料夾：

```text
outputs/
└── cat.webp
```

使用者即可透過：

```text
GET /outputs/cat.webp
```

直接取得圖片。

#### 特點

- 不需自己建立 Route
- Express 自動尋找並回傳檔案
- 適合公開圖片、CSS、JavaScript 等靜態資源
- 常用於圖片預覽


#### 運作流程

```text
Browser

GET /outputs/cat.webp

        ↓

express.static()

        ↓

outputs/cat.webp

        ↓

Response
```

#### 成功

若檔案存在：

```text
GET /outputs/cat.webp
```

Express 自動回傳：

```text
200 OK
```

並直接顯示圖片。


#### 失敗

若檔案不存在：

```text
GET /outputs/notfound.webp
```

Express 會回傳：

```text
404 Not Found
```


`express.static()` 沒有 callback，因此：

- 無法得知檔案是否傳送完成
- 無法在成功下載後執行其他程式
- 無法像 `res.sendFile()` 或 `res.download()` 一樣處理傳送過程中的錯誤

若需要權限驗證、下載紀錄或自訂回應流程，通常會使用 `res.sendFile()` 或 `res.download()`。

---

### express.static() 的安全性

`express.static()` 會公開整個指定資料夾，只要使用者知道或猜到檔名（URL），就能直接存取檔案。

因此：

- 不應公開不該存取的資料夾
- 檔名應避免使用容易猜測的名稱（如 `image1.webp`、`Date.now()`）
- 可使用 `crypto.randomUUID()` 提高檔名的不可預測性
- 若需要權限控管，應改用 `res.sendFile()` 或 `res.download()` 搭配自訂 Route

---

### `res.sendFile()`：由程式指定要回傳哪一個檔案。

例如：

```js
res.sendFile(path.join(__dirname, "outputs", filename));
```

與 `express.static()` 不同的是，它不是公開整個資料夾，而是由程式決定要回傳哪一個檔案。

#### 運作流程

```text
Route

↓

檢查條件

↓

res.sendFile()

↓

回傳檔案
```

#### 適用情境

可以先：

- 檢查權限
- 檢查檔案是否存在
- 記錄下載 Log

再決定是否回傳檔案。

例如：

```text
GET /preview/:filename
```

---

### `res.download()`：回傳檔案，但要求瀏覽器**下載**而不是直接顯示。

例如：

```js
res.download(filePath);
```

#### 運作流程

```text
Browser

GET /downloads/cat.webp

↓

res.download()

↓

Save As...
```

#### 原理

`res.download()` 本質上也是回傳檔案，但會額外加入 HTTP Header：

```http
Content-Disposition: attachment
```

因此瀏覽器會：

- 顯示下載視窗
- 而不是直接預覽圖片

---

### Content-Disposition

`Content-Disposition` 是 HTTP Response Header，用來告訴瀏覽器收到檔案後應如何處理。

常見值：

| Header | 瀏覽器行為 |
|--------|-----------|
| `inline` | 直接顯示內容（預設） |
| `attachment` | 強制下載 |

例如：

```http
Content-Disposition: attachment
```

瀏覽器會跳出下載視窗，而不是直接顯示圖片。

Express 的 `res.download()` 會自動加入：

```http
Content-Disposition: attachment
```

因此非常適合提供檔案下載功能。

---


### sendFile() vs download()

| 方法 | 瀏覽器行為 | 適用情境 |
|-------|-----------|---------|
| `res.sendFile()` | 顯示圖片 | 預覽 |
| `res.download()` | 下載圖片 | 下載 |

---

### Preview URL

圖片預覽通常使用：

```text
GET /outputs/cat.webp
```

API Response：

```json
{
  "previewUrl": "/outputs/cat.webp"
}
```

點擊網址：

瀏覽器直接顯示圖片。

---

### Download URL

圖片下載通常使用：

```text
GET /downloads/cat.webp
```

Route：

```js
app.get("/downloads/:filename", ...);
```

回傳：

```js
res.download(filePath);
```

API Response：

```json
{
  "downloadUrl": "/downloads/cat.webp"
}
```

點擊網址：

瀏覽器會直接下載圖片。

---

### `path.join()` ：安全地組合路徑，自動處理不同作業系統的路徑格式

Windows：

```text
outputs\cat.webp
```

Linux / macOS：

```text
outputs/cat.webp
```

因此不要自己手動拼接字串，而是使用：

```js
path.join(__dirname, "outputs", filename);
// __dirname：目前程式所在資料夾（絕對路徑）
// "outputs"：輸出資料夾
// filename：檔名
```

讓 Node.js 自動處理不同作業系統的路徑格式。

---

### `fs.existsSync()`：下載圖片前先確認檔案是否存在

例如：

```js
if (!fs.existsSync(filePath)) {
  return res.status(404).json({
    status: "error",
    message: "找不到圖片"
  });
}
```

不存在時應回傳：

```text
404 Not Found
```

而不是：

```text
500 Internal Server Error
```

因為是找不到資源，而不是伺服器發生錯誤。

---


### Path Traversal（路徑穿越）

不要直接相信使用者輸入的檔名。

例如：

```text
GET /downloads/../../../package.json
```

如果直接將：

```js
req.params.filename
```

拼接成檔案路徑，就可能讓使用者存取伺服器上非預期的檔案。

#### 避免方式

- 驗證檔名是否合法
- 限制只能存取 `outputs/`
- 不允許 `../`
- 使用 `path.join()` 建立路徑

---

### 三種方式比較

| 方法 | 是否公開整個資料夾 | 是否需自行建立 Route | 適用情境 |
|------|------------------|--------------------|---------|
| `express.static()` | ✅ | ❌ | 圖片、CSS、JavaScript 等靜態資源 |
| `res.sendFile()` | ❌ | ✅ | 圖片預覽、權限控制 |
| `res.download()` | ❌ | ✅ | 提供檔案下載 |

---

### 下載圖片的兩種方式

#### 1. Buffer（不存檔）

流程：

```text
Upload
↓
Sharp
↓
toBuffer()
↓
res.send(buffer)
```

**優點**

- 不需建立 `outputs/`
- 不需清理暫存檔
- Disk I/O 較少，速度較快

**缺點**

- 無法再次下載
- 無法提供預覽網址（Preview URL）
- 每次下載都需要重新產生 Buffer


#### 2. File（先存檔）

流程：

```text
Upload
↓
Sharp
↓
toFile()
↓
outputs/
↓
res.download()
```

**優點**

- 可重複下載
- 可提供圖片預覽
- 可分享下載網址

**缺點**

- 需要硬碟空間
- 需要定期清理檔案
- Disk I/O 較多

#### 本專案採用

Task 17 需要實作：

- `previewUrl`
- `downloadUrl`
- `GET /outputs/:filename`
- `GET /downloads/:filename`

因此需要先將圖片存到 `outputs/`，再透過 URL 提供預覽與下載。

---

### I/O（Input / Output）

I/O（Input / Output）指的是程式與外部資源之間的資料讀寫，例如：

- 讀取檔案
- 寫入檔案
- 存取資料庫
- 網路傳輸

在圖片處理中：

- `toBuffer()`：資料保留在記憶體，不需讀寫硬碟，因此 Disk I/O 較少。
- `toFile()`：需要將圖片寫入硬碟，下載時再讀取檔案，因此 Disk I/O 較多。

一般而言，**硬碟 I/O 的速度比記憶體慢**，因此如果不需要保留檔案，直接使用 Buffer 通常會有較好的效能。

---

### 為什麼預覽圖片可以使用 `express.static()`，下載時卻可能使用 `res.download()`？

`express.static()` 會將指定資料夾中的檔案提供給瀏覽器存取。

瀏覽器收到圖片後，通常會根據 `Content-Type` 直接顯示，因此適合用來提供圖片預覽。

`express.static()` 並不是不能下載檔案，而是通常不會主動加入：

```http
Content-Disposition: attachment
```

所以瀏覽器傾向直接開啟圖片，而不是強制下載。

`res.download()` 會自動設定下載相關的 Response Header，讓瀏覽器將檔案視為附件下載，因此更適合提供下載功能。

---

### 是否應允許使用者直接存取整個輸出資料夾？

不一定，要依產品需求與檔案內容判斷。

若輸出圖片本來就是公開的暫存結果，而且檔名使用難以猜測的 UUID，可以公開專門存放公開圖片的 `outputs/` 資料夾。

但不應公開：

- 專案根目錄
- `.env`
- 使用者原始上傳檔案
- 私人圖片
- 包含敏感資料的資料夾

若圖片需要登入、所有權或有效期限等權限控管，就不適合直接使用 `express.static()`，應改用自訂 Route 驗證後再回傳。

---

### 如何避免使用者透過 URL 存取非預期檔案？

可以建立自訂 Route，在回傳檔案前進行驗證，例如：

- 驗證檔名格式
- 只接受 UUID 加 `.webp`
- 拒絕包含 `/`、`\` 或 `..` 的檔名
- 確認檔案路徑仍位於 `outputs/` 內
- 確認檔案存在
- 有會員系統時，驗證登入狀態與檔案所有權

例如，可限制檔名格式為：

```text
UUID.webp
```

重點不是只擋掉部分不合法請求，而是要明確定義：

> 哪些檔名、路徑與使用者可以存取，其他請求全部拒絕。


---

### `res.sendFile()` 與 `res.download()` 為什麼要使用 Callback？

`sendFile()` 和 `download()` 傳送檔案的過程包含非同步操作。檔案不存在、讀取失敗等錯誤，通常不會被外層這種同步 `try...catch` 完整捕捉。

這兩個方法本身提供 callback，用來取得傳送過程中的錯誤。當檔案傳送完成或發生錯誤時，Express 會呼叫 callback。

例如：

```js
try {
  res.download(filePath);
} catch (error) {
  // 不一定能捕捉到下載過程中的錯誤
}
```


#### Callback 的用途

可用於：

- 處理檔案不存在
- 處理檔案讀取失敗
- 處理下載中斷
- 記錄下載成功
- 傳送完成後刪除暫存檔

#### 注意事項

當 callback 執行時，Response 可能已經送出部分內容。

若 `res.headersSent === true`，代表回應已開始傳送，此時不應再次回傳新的 Response（例如 `res.status().json()`），否則可能出現：

```text
Cannot set headers after they are sent
```

---

### `res.sendFile()` Callback 錯誤語法


```js
res.sendFile(filePath, (err) => {
  if (err) {
    return next(err);
  }
});
```
---

### `res.download()` Callback 錯誤語法

```js
res.download(filePath, (err) => {
  if (err) {
    return next(err);
  }
});
```
---

### 為什麼要驗證 UUID？

如果只檢查副檔名：

```text
secret.webp
image.webp
abc.webp
```

都會被視為合法檔名。

驗證完整 UUID 格式可以確保只有系統產生的檔名才能被存取，降低使用者透過猜測檔名存取非預期檔案的風險。

---

### 驗證 UUID 檔名

由於本專案使用：

```js
crypto.randomUUID()
```

產生檔名，因此除了確認副檔名為 `.webp` 外，也應驗證檔名是否符合 UUID 格式，避免使用者透過猜測檔名存取非預期檔案。

例如：

```text
550e8400-e29b-41d4-a716-446655440000.webp
```

#### 使用 Regular Expression 驗證

```js
const uuidWebpPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.webp$/i;

const checkFilename = (filename) => {
  return uuidWebpPattern.test(filename);
};
```

| 語法 | 說明 |
|------|------|
| `^` | 字串開頭 |
| `$` | 字串結尾 |
| `[0-9a-f]` | 十六進位字元 |
| `{8}` | 前 8 個字元 |
| `4` | UUID Version 4 |
| `[89ab]` | UUID Variant |
| `\.webp` | 必須以 `.webp` 結尾 |
| `i` | 忽略大小寫 |


#### 可通過

```text
550e8400-e29b-41d4-a716-446655440000.webp
```

#### 不可通過

```text
abc.webp
secret.webp
550e8400-e29b-41d4-a716-446655440000.txt
550e8400-e29b-11d4-a716-446655440000.webp
550e8400-e29b-41d4-a716-446655440000.webp.exe
```

---


### `express.static()` 專用 404

當使用者請求靜態檔案時：

```text
GET /outputs/:filename
```

若檔案不存在，`express.static()` 會呼叫 `next()`，繼續往後尋找符合的 Middleware。

因此可以在 `express.static()` 後方建立一個專門處理 `/outputs` 的 404 Middleware。

例如：

```js
app.use("/outputs", express.static(outputs));

app.use("/outputs", (req, res) => {
  return res.status(404).json({
    status: "error",
    message: "找不到圖片",
  });
});
```

#### 運作流程

檔案存在：

```text
GET /outputs/cat.webp
        ↓
express.static()
        ↓
找到檔案
        ↓
200 OK
```

檔案不存在：

```text
GET /outputs/not-found.webp
        ↓
express.static()
        ↓
找不到檔案
        ↓
next()
        ↓
/outputs 專用 404 Middleware
        ↓
404 Not Found
```

#### 為什麼需要？

若沒有專用的 404 Middleware，找不到檔案時通常會回傳 Express 預設的 404 頁面：

```text
Cannot GET /outputs/not-found.webp
```

加入專用的 404 Middleware 後，可以統一 API 的錯誤格式，例如：

```json
{
  "status": "error",
  "message": "找不到圖片"
}
```

### `express.static()` 專用 404 與一般 404 的差異

| 情境 | 處理方式 |
|------|---------|
| `/outputs/not-found.webp` | `/outputs` 專用 404 Middleware |
| `/preview/not-found.webp` | `sendFile()` Route 自行處理 |
| `/download/not-found.webp` | `download()` Route 自行處理 |
| `/unknown-route` | 全域 404 Middleware |

因此通常會同時存在：

- `/outputs` 專用 404（處理靜態檔案）
- 全域 404（處理不存在的 API 路由）
  
---

## 參考資料

