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


### 什麼是檔案生命週期？

檔案生命週期是指一個檔案從建立、使用，到最後刪除的完整流程。

在圖片處理工具中，流程可能是：

```text
使用者上傳圖片
↓
伺服器接收圖片
↓
Sharp 處理圖片
↓
產生輸出檔案
↓
使用者預覽或下載
↓
檔案過期後刪除
```

如果沒有清理策略，伺服器硬碟會持續累積檔案，最後可能造成：

- 磁碟空間不足
- Server 無法繼續寫入檔案
- 備份與維護成本增加
- 舊檔案長期暴露
- 使用者隱私風險增加

---

### 圖片處理流程中可能產生的檔案

#### 1. 原始上傳檔案

如果 Multer 使用：

```js
multer.diskStorage()
```

使用者上傳的原始圖片會先寫入硬碟。

例如：

```text
uploads/
└── original-cat.jpg
```

圖片處理完成後，如果不再需要原圖，通常應立即刪除。

如果使用：

```js
multer.memoryStorage()
```

原圖只存在於：

```js
req.file.buffer
```

不會產生原始暫存檔，因此不需要刪除硬碟上的原圖。

#### 2. 處理後圖片

Sharp 處理後可能產生：

```text
outputs/
└── UUID.webp
```

處理後圖片需要保留一段時間，讓使用者可以：

- 預覽
- 下載
- 重新整理頁面後再次取得

但若永久保留，檔案會持續累積，因此通常需要設定保存期限。

#### 3. 處理失敗時留下的檔案

圖片處理過程若中途失敗，可能留下：

- 已上傳但尚未刪除的原始檔
- 寫入到一半的輸出檔
- 空檔案
- 損壞的圖片檔案

因此錯誤處理時也要考慮清理。

---

### Node.js 刪除檔案

 `fs.unlink()`：用來刪除檔案。

Promise 版本：

```js
const fsPromises = require("node:fs/promises");

await fsPromises.unlink(filePath);
```

例如：

```js
await fsPromises.unlink(
  path.join(__dirname, "outputs", filename)
);
```


#### 檔案不存在時

如果刪除不存在的檔案，會產生錯誤：

```text
ENOENT
```

代表：

> Error NO ENTry，找不到檔案或路徑。

因此刪除時通常需要處理錯誤：

```js
try {
  await fsPromises.unlink(filePath);
} catch (error) {
  if (error.code === "ENOENT") {
    console.log("檔案已不存在");
  } else {
    console.error("刪除失敗", error);
  }
}
```

---

### 為什麼清理失敗不應讓請求崩潰？

假設圖片已經成功處理，使用者也應該取得結果。

如果清理暫存檔失敗就回傳：

```text
500 Internal Server Error
```

會造成一個奇怪結果：

```text
圖片處理成功
↓
清理失敗
↓
整個 API 顯示失敗
```

但真正的主要功能其實已經完成。

因此應區分：

- 圖片處理失敗：主要流程失敗
- 暫存檔清理失敗：次要流程失敗

清理失敗通常應：

- 記錄 Error Log
- 不讓整個 Request 崩潰
- 之後再由排程補清理

---

### 清理策略比較

#### 策略一：圖片處理完成後立即刪除原始檔案

流程：

```text
上傳原始圖片
↓
Sharp 處理
↓
輸出新圖片
↓
刪除原始圖片
```

##### 優點：

- 原圖不會長期佔用空間
- 隱私風險較低
- 邏輯簡單

##### 缺點

- 刪除失敗時仍可能留下檔案
- 如果後續還需要重新處理原圖，就無法使用

#### 適用情境

- 原圖只用一次
- 輸出完成後不再需要原圖
- 使用 `diskStorage()` 接收上傳檔案


#### 策略二：輸出圖片保留一段時間再刪除

流程：

```text
產生輸出圖片
↓
使用者預覽與下載
↓
保留一段時間
↓
刪除輸出圖片
```

例如：

```text
保留 30 分鐘
保留 1 小時
保留 24 小時
```

##### 優點

- 使用者有時間預覽與下載
- 不會永久累積檔案

##### 缺點

- 需要追蹤檔案建立時間
- Server 停機後，記憶體中的計時器會消失


#### 策略三：Server 啟動時清理過期檔案

流程：

```text
Server 啟動
↓
讀取 outputs/
↓
檢查檔案建立或修改時間
↓
刪除超過期限的檔案
```

可以使用：

```js
fs.readdir()
fs.stat()
fs.unlink()
```

##### 優點

- 可清理由上一次執行留下的檔案
- 不依賴舊的 `setTimeout()`

##### 缺點

- 只有 Server 啟動時才執行
- Server 長時間不重啟時，過期檔案仍會累積
- 檔案很多時，啟動速度可能變慢


#### 策略四：使用排程定期清理

例如：

```text
每 1 小時清理一次
每天凌晨清理一次
```

可使用：

- `setInterval()`
- cron
- `node-cron`
- 作業系統排程
- 雲端排程服務

| 方法              | Node 必須一直執行？ | 電腦關機後還會執行？ | 適合                    |
| --------------- | ------------ | ---------- | --------------------- |
| `setInterval()` | ✔            | ✘          | 每隔幾秒、測試、小工具           |
| `node-cron`     | ✔            | ✘          | Node 專案內定時任務          |
| Linux `cron`    | ✘（由 OS 啟動）   | ✘（電腦關機就不會） | 伺服器排程、備份              |
| 作業系統排程          | ✘（由 OS 啟動）   | ✘（電腦關機就不會） | 執行腳本、維護工作             |
| 雲端排程服務          | ✘            | ✔（由雲端執行）   | 正式產品、Serverless、跨機器服務 |


##### 優點

- Server 長時間運作時仍能持續清理
- 不需要依賴每個 Request 個別建立計時器

##### 缺點

- 排程可能因 Server 停止而中斷
- 多台 Server 同時執行時，可能重複清理
- 需要處理競爭條件與錯誤紀錄

---

### `setTimeout()` 清理檔案

例如：

```js
setTimeout(async () => {
  try {
    await fsPromises.unlink(outputPath);
  } catch (error) {
    console.error("刪除檔案失敗", error);
  }
}, 60 * 60 * 1000);
```

代表一小時後刪除。

---

### `setTimeout()` 清理檔案的限制

- Server 重啟後 Timer 消失
- 大量檔案會建立大量 Timer
- 執行時間不一定精準
- 不適合多台 Server
- 無法清理先前遺留下來的檔案

因此 `setTimeout()` 適合 Demo 或小型專案，但正式環境通常還需要定期掃描與清理機制。

以下為細節補充：

#### 1. Server 重啟後計時器會消失

```text
圖片產生
↓
設定 1 小時後刪除
↓
30 分鐘後 Server 重啟
↓
原本的計時器消失
↓
檔案不會被刪除
```

#### 2. 大量檔案會建立大量 Timer

如果每天處理很多圖片，每張圖都建立一個 `setTimeout()`，記憶體中會存在大量計時器。

#### 3. 不適合多台 Server

若正式部署有多個 Server Instance，每台機器只知道自己建立的 Timer，不容易統一管理。

#### 4. 刪除時間不保證精準

`setTimeout()` 表示：

> 最早在指定時間後執行。

若 Event Loop 忙碌，實際執行時間可能延後。

---

### 檔案建立時間與修改時間

`fsPromises.stat()` 可取得指定檔案或資料夾的詳細資訊。


```js
const stat = await fsPromises.stat(filePath);
//stat：回傳的檔案資訊物件（Stats Object）。
```

可取得：

```js
stat.birthtime //檔案建立時間（Date）

stat.birthtimeMs //檔案建立時間（毫秒 Timestamp）

stat.mtime //檔案最後修改時間（Date）

stat.mtimeMs //檔案最後修改時間（毫秒 Timestamp）
```

常用屬性：
| 屬性            | 型別       | 說明                             | 範例                    |
| ------------- | -------- | ------------------------------ | --------------------- |
| `birthtime`   | `Date`   | 檔案建立時間                         | `2026-08-02 14:30:10` |
| `birthtimeMs` | `Number` | 檔案建立時間（毫秒 Timestamp），適合計算時間差   | `1754122610123`       |
| `mtime`       | `Date`   | 檔案最後修改時間                       | `2026-08-02 15:20:45` |
| `mtimeMs`     | `Number` | 檔案最後修改時間（毫秒 Timestamp），適合計算時間差 | `1754127645123`       |
| `size`        | `Number` | 檔案大小，單位為 bytes                 | `182345`              |



判斷檔案是否過期時，常使用 `stat.birthtimeMs` 或是 `stat.mtimeMs`

```js
const age = Date.now() - stat.birthtimeMs
//檔案距離建立已經過多久（毫秒）
```

```js
const age = Date.now() - stat.mtimeMs; 
//檔案距離上次被修改已經過多久（毫秒）
```

例如：

```js
if (Date.now() - stat.birthtimeMs > 60 * 60 * 1000) {
  await fsPromises.unlink(filePath);
}
```

若超過設定的保存期限，就可以刪除檔案。


---

### 清理資料夾的基本流程

```text
讀取 outputs/
↓
逐一取得檔案資訊
↓
判斷是否過期
↓
過期則刪除
↓
單一檔案刪除失敗時記錄錯誤
↓
繼續處理其他檔案
```

常用 API：

```js
fsPromises.readdir() //看資料夾裡有哪些東西
fsPromises.stat()    //查看每個檔案的資訊
fsPromises.unlink()  //刪除檔案
```

---

### 如果 API 回傳後立刻刪除輸出圖片，使用者還能下載嗎？

通常不能。

因為 API 回傳的：

```text
/download/:filename
```

只是網址。

使用者之後點擊下載連結時，Server 才會重新讀取檔案。

若圖片已經被刪除：

```text
點擊下載
↓
找不到檔案
↓
404 Not Found
```

因此輸出圖片至少要保留到使用者完成下載，或保留一段合理期限。

---

### Server 重新啟動後，尚未清理的檔案怎麼辦？

可在 Server 啟動時：

```text
讀取 outputs/
↓
檢查每個檔案的修改時間
↓
刪除超過期限的檔案
```

也可以搭配定期排程，避免只依賴啟動時清理。

---

### 正式部署後，將圖片存在本機硬碟可能遇到哪些問題？

#### 檔案可能消失

部分雲端部署環境的本機硬碟是暫時性的，重新部署或重新啟動後，檔案可能消失。

#### 多台 Server 無法共享檔案

例如：

```text
圖片存到 Server A
↓
下一次下載請求被導向 Server B
↓
Server B 找不到圖片
```

#### 磁碟空間有限

檔案持續累積可能塞滿硬碟。

#### 備份與擴充困難

圖片放在本機，不容易進行跨機器共享、備份與擴充。

正式產品通常會考慮：

- AWS S3
- Google Cloud Storage
- Cloudflare R2
- Azure Blob Storage

---

### bootcamp 練習策略

目前使用：

```js
multer.memoryStorage()
```

因此原始圖片只存在於 Buffer，不會寫入硬碟，不需要清理原始上傳檔。

處理後圖片會存入：

```text
outputs/
```

策略：

```text
圖片處理成功
↓
輸出檔案保留一段時間
↓
使用者可以預覽與下載
↓
到期後刪除
```

初步可以先實作：

```text
setTimeout() 延遲刪除輸出圖片
```

後續較完整的版本可再加入：

```text
Server 啟動時掃描 outputs/
↓
清理過期檔案
```

---

### 讀取資料夾

```js
const fs = require("node:fs/promises");

const files = await fs.readdir("./outputs");

console.log(files);
```

假設 outputs 裡有：

```
outputs/
├── a.webp
├── b.webp
├── c.webp
```

files 會是：
```
["a.webp", "b.webp", "c.webp"]
```


若想逐一讀取，最常見就是：

```js
for (const file of files) {
  console.log(file);
}
```

輸出：
```
a.webp
b.webp
c.webp
```

---

### `for...of` 迴圈中的錯誤處理

當使用 `for...of` 搭配 `await` 逐一處理檔案時，**是否會繼續處理後面的檔案，取決於錯誤處理的位置。**


#### 情況一：沒有 `try...catch`

```js
for (const file of files) {
  const stat = await fs.stat(file);
  console.log(stat.size);
}

console.log("完成");
```

假設：

```text
a.webp ✅
b.webp ❌（不存在）
c.webp
```

執行結果：

```text
a.webp
Error: ENOENT
```

* 程式立即停止。
* `c.webp` 不會繼續處理。
* `console.log("完成")` 也不會執行。


#### 情況二：每個檔案各自使用 `try...catch`（推薦）

```js
for (const file of files) {
  try {
    const stat = await fs.stat(file);
    console.log(file, stat.size);
  } catch (err) {
    console.log(`${file} 讀取失敗`);
  }
}

console.log("完成");
```

假設：

```text
a.webp ✅
b.webp ❌
c.webp ✅
```

執行結果：

```text
a.webp 12345
b.webp 讀取失敗
c.webp 98765
完成
```


* 單一檔案失敗不會影響其他檔案。
* 其他檔案仍會繼續處理。
* 最後仍會執行後續程式。



#### 情況三：整個迴圈只包一個 `try...catch`

```js
try {
  for (const file of files) {
    const stat = await fs.stat(file);
    console.log(stat.size);
  }
} catch (err) {
  console.log(err);
}
```

假設第二個檔案失敗：

```text
a.webp
ENOENT
```


* `catch` 會接收到錯誤。
* 但整個 `for...of` 會立即結束。
* `c.webp` 不會繼續處理。



如果是在做批次工作，例如：

* 清理圖片
* 壓縮圖片
* 備份檔案
* 讀取大量資料

通常希望：

* 一個檔案失敗，不影響其他檔案。

因此推薦寫法：

```js
for (const file of files) {
  try {
    // 處理單一檔案
  } catch (err) {
    console.error(`${file} 處理失敗：`, err.message);
    continue; // 可省略，catch 結束後本來就會進入下一圈
  }
}
```


#### 在圖片壓縮專案中的應用

假設 `outputs/` 資料夾共有 500 張圖片：

* 第 37 張被手動刪除
* 第 85 張權限不足
* 第 142 張檔案損毀

如果沒有個別處理錯誤，程式會在第一個錯誤就停止，後面的檔案都無法處理。

因此，實務上批次處理通常會在每一次迴圈內使用 `try...catch`，讓單一檔案失敗時，只記錄錯誤並繼續處理下一個檔案，提高整體工作的穩定性。


---

## 參考資料

