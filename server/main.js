const express = require("express");
const fs = require("fs");
const https = require("https");
const crypto = require("crypto");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");

const app = express();

const appsecret = "token_secret";
const appkey = "token_secret_key";

const tablstart =
  '{"title":"Голосования","rows":[], "more": "Приложение", "more_url": "https://vk.com/app51824047"}';

app.use(cors());
app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(upload.single("photo.jpg"), (req, res, next) => {
  const url = req.body.sign;
  if (url) {
    const launchParams = decodeURIComponent(url.slice(url.indexOf("?") + 1));
    if (verifyLaunchParams(launchParams, appsecret)) {
      next();
    } else {
      res.send("error");
    }
  } else {
    res.send("error");
  }
});

app.post("/", (req, res) => {
  let groupid = req.body.hash;
  if (groupid == "") {
    groupid = new URLSearchParams(req.body.sign).get("vk_group_id");
  } else {
    groupid = req.body.hash.split("#")[1].split("_")[0];
  }

  if (groupid != null) {
    fs.access("./bass/" + groupid + "/tabl.json", function (err) {
      if (err) {
        fs.mkdirSync("./bass/" + groupid);
        fs.writeFileSync("./bass/" + groupid + "/tabl.json", tablstart);
        res.send(tablstart);
      } else {
        const tabl = JSON.parse(
          fs.readFileSync("./bass/" + groupid + "/tabl.json", "utf-8")
        );

        let tabl2 = { title: "Голосование", rows: [] };

        tabl.rows.map((voting) => {
          if (voting.active != true) {
            tabl2.rows.push(voting);
          }
        });

        res.send(tabl2);
      }
    });
  } else {
    res.send("error");
  }
});

app.post("/admin", (req, res) => {
  const params = new URLSearchParams(req.body.sign);
  if (params.get("vk_viewer_group_role") == "admin") {
    res.send(
      JSON.parse(
        fs.readFileSync(
          "./bass/" + params.get("vk_group_id") + "/tabl.json",
          "utf-8"
        )
      )
    );
  }
});

app.post("/set", (req, res) => {
  const params = new URLSearchParams(req.body.sign);
  if (params.get("vk_viewer_group_role") == "admin") {
    fs.writeFileSync(
      "./bass/" + params.get("vk_group_id") + "/tabl.json",
      req.body.tabl
    );
    res.send("ok");
  }
});

app.post("/clickbutton", (req, res) => {
  const params = new URLSearchParams(req.body.sign);
  const userid = params.get("vk_user_id");
  const tabl = JSON.parse(
    fs.readFileSync(
      "./bass/" + params.get("vk_group_id") + "/tabl.json",
      "utf-8"
    )
  );

  let tablclick = { title: "Голосование", rows: [] };

  tabl.rows.map((voting) => {
    if (voting.active != true) {
      tablclick.rows.push(voting);
    }
  });

  const list = tablclick;
  const buttonstatic = list.rows[req.body.voting].buttonotvet;
  const buttonstatic2 =
    list.rows[req.body.voting].buttonotvet[req.body.number].static;
  const buttonstaticall =
    list.rows[req.body.voting].buttonotvet[req.body.number].staticall;

<<<<<<< HEAD
  if (
    !list.rows[req.body.voting].active &&
    list.rows[req.body.voting].active2
  ) {
=======
  if (!list.rows[req.body.voting].active && list.rows[req.body.voting].active2) {
>>>>>>> 507121de1e7ee1c2f4a5334a91441f0e673baf3f
    if (!req.body.click) {
      if (buttonstatic.some((button) => button.static.includes(userid))) {
        const indexToDeleted = buttonstatic2.findIndex((button) =>
          button.includes(userid)
        );
        const indexToDeleted2 = buttonstatic.findIndex((button) =>
          button.static.includes(userid)
        );
        buttonstatic[indexToDeleted2].static.splice(indexToDeleted, 1);

        if (indexToDeleted2 != req.body.number) {
          buttonstatic2.push(userid);
        }
      } else {
        buttonstatic2.push(userid);
      }
    } else {
      if (buttonstaticall.includes(userid)) {
        const indexToReplace = buttonstaticall.findIndex((button) =>
          button.includes(userid)
        );

        buttonstaticall.splice(indexToReplace, 1);
      } else {
        buttonstaticall.push(userid);
      }
    }
  }

  fs.writeFileSync(
    "./bass/" + params.get("vk_group_id") + "/tabl.json",
    JSON.stringify(list)
  );
  res.send(list);
});

app.post("/vkphotoapp", async (req, res) => {
  const uploadServerResponse = await axios.get(
    "https://api.vk.com/method/appWidgets.getAppImageUploadServer",
    {
      params: {
        image_type: "510x128",
        access_token: appkey,
        v: "5.199",
      },
    }
  );

  const formData = new FormData();
  formData.append("image", req.file.buffer, {
    filename: "photo.jpg",
    contentType: "image/jpeg",
  });

  const uploadResponse = await axios.post(
    uploadServerResponse.data.response.upload_url,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  const photo = await axios.get(
    "https://api.vk.com/method/appWidgets.saveAppImage",
    {
      params: {
        access_token: appkey,
        v: "5.199",
        image: uploadResponse.data.image,
        hash: uploadResponse.data.hash,
      },
    }
  );

  if (photo.data.error == null) {
    res.send({
      response: photo.data.response,
    });
  } else {
    res.send({
      response: photo.data.error.error_msg,
    });
  }
});

function verifyLaunchParams(searchOrParsedUrlQuery, secretKey) {
  let sign;
  const queryParams = [];

  /**
   * Функция, которая обрабатывает входящий query-параметр. В случае передачи
   * параметра, отвечающего за подпись, подменяет "sign". В случае встречи
   * корректного в контексте подписи параметра добавляет его в массив
   * известных параметров.
   * @param key
   * @param value
   */
  const processQueryParam = (key, value) => {
    if (typeof value === "string") {
      if (key === "sign") {
        sign = value;
      } else if (key.startsWith("vk_")) {
        queryParams.push({ key, value });
      }
    }
  };

  if (typeof searchOrParsedUrlQuery === "string") {
    // Если строка начинается с вопроса (когда передан window.location.search),
    // его необходимо удалить.
    const formattedSearch = searchOrParsedUrlQuery.startsWith("?")
      ? searchOrParsedUrlQuery.slice(1)
      : searchOrParsedUrlQuery;

    // Пытаемся разобрать строку как query-параметр.
    for (const param of formattedSearch.split("&")) {
      const [key, value] = param.split("=");
      processQueryParam(key, value);
    }
  } else {
    for (const key of Object.keys(searchOrParsedUrlQuery)) {
      const value = searchOrParsedUrlQuery[key];
      processQueryParam(key, value);
    }
  }
  // Обрабатываем исключительный случай, когда не найдена ни подпись в параметрах,
  // ни один параметр, начинающийся с "vk_", чтобы избежать
  // излишней нагрузки, образующейся в процессе работы дальнейшего кода.
  if (!sign || queryParams.length === 0) {
    return false;
  }
  // Снова создаём запрос в виде строки из уже отфильтрованных параметров.
  const queryString = queryParams
    // Сортируем ключи в порядке возрастания.
    .sort((a, b) => a.key.localeCompare(b.key))
    // Воссоздаём новый запрос в виде строки.
    .reduce((acc, { key, value }, idx) => {
      return (
        acc + (idx === 0 ? "" : "&") + `${key}=${encodeURIComponent(value)}`
      );
    }, "");

  // Создаём хеш получившейся строки на основе секретного ключа.
  const paramsHash = crypto
    .createHmac("sha256", secretKey)
    .update(queryString)
    .digest()
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=$/, "");

  return paramsHash === sign;
}

/*const options = {
  key: fs.readFileSync("./privkey1.pem"),
  cert: fs.readFileSync("./fullchain1.pem"),
  ca: fs.readFileSync("./chain1.pem"),
};*/

const options = {
  key: fs.readFileSync(
    "/etc/letsencrypt/live/www.vpn.svetafe8.beget.tech/privkey.pem"
  ),
  cert: fs.readFileSync(
    "/etc/letsencrypt/live/www.vpn.svetafe8.beget.tech/fullchain.pem"
  ),
  ca: fs.readFileSync(
    "/etc/letsencrypt/live/www.vpn.svetafe8.beget.tech/chain.pem"
  ),
};

server = https.createServer(options, app);

server.listen(443, () => {
  console.log("Сервер запущен");
});
