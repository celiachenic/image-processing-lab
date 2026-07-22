/*#Task 7：單張圖片上傳

## 目標
建立第一支可以接收圖片的 API。

## 任務

建立：
```http
POST /upload
```

- 使用 `multipart/form-data`
- 成功取得 `req.file`
- 印出 `req.file` 內容
- 使用 Postman 測試

## 完成條件
理解 `req.file` 包含哪些資訊：

- originalname
- mimetype
- size
- filename
- path

研究：
`req.body` 與 `req.file` 的差異。*/

const express = require("express");
const multer = require("multer");
const app = express();

app.use(express.json());

const upload = multer({ dest: "./uploads" });
app.post("/upload", upload.single("image"), (req, res) => {
  console.log(req.file);
  return res.status(200).json({
    status: "success",
    file: req.file,
  });
});

app.listen(3000, () => {
  console.log("server is running on port 3000");
});


/*用 postman 測試：

multipart/form-data
| Key | Type | Value |
| --- | --- | --- |
| `image` | File | `cat.jpg` |

回傳 req.file 結果 ：
{
  fieldname: 'image',
  originalname: 'cat.jpg',
  encoding: '7bit',
  mimetype: 'image/jpeg',
  path: 'uploads\\597ebb81658c2532aaebb185796ff498',
  destination: './uploads',
  filename: '597ebb81658c2532aaebb185796ff498',
  size: 262179
}
*/