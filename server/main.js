const express = require("express");
const fs = require("fs");
const https = require("https");
const crypto = require("crypto");
const cors = require("cors");
const multer = require("multer");
const axios = require("axios");
const FormData = require("form-data");
// const ipfilter = require("express-ipfilter").IpFilter;

const app = express();

const appsecret = "";
const appkey = "";

const tablstart =
  '{"title":"Голосования","rows":[], "more": "Приложение", "more_url": "https://vk.com/app51824047"}';

// const ips = ["109.237.8.0/21"];

// app.use(ipfilter(ips));
app.use(cors());
app.use(express.json());
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.get("/sampbinder", (req, res) => {
  res.send(
    "2.03'https://drive.google.com/uc?export=download&confirm=no_antivirus&id=1yWhFkVCftbtHiKWEPvbM6OquoSASbNGu'1. Пофикшены баги'"
  );
});

app.use(upload.single("photo.jpg"), (req, res, next) => {
  const url = req.body.sign;
  try {
    if (url) {
      const launchParams = decodeURIComponent(url.slice(url.indexOf("?") + 1));
      const params = new URLSearchParams(req.body.sign);
      if (
        verifyLaunchParams(launchParams, appsecret) &&
        checkapi(params, req.body.code)
      ) {
        next();
      } else {
        res.send("error");
      }
    } else {
      res.send("error");
    }
  } catch {
    res.send("error");
  }
});

app.post("/", (req, res) => {
  const groupid = new URLSearchParams(req.body.sign).get("vk_group_id");
  const userid = new URLSearchParams(req.body.sign).get("vk_user_id");

  console.log(`id: ${userid}, group: ${groupid}, ip: ${req.ip}`);

  try {
    if (groupid != null && userid != null) {
      fs.access("./bass/" + groupid + "/tabl.json", function (err) {
        if (err) {
          fs.mkdirSync("./bass/" + groupid);
          fs.writeFileSync("./bass/" + groupid + "/tabl.json", tablstart);
          res.send(tablstart);
        } else {
          try {
            const tabl = JSON.parse(
              fs.readFileSync("./bass/" + groupid + "/tabl.json", "utf-8")
            );

            let tabl2 = { title: "Голосование", rows: [] };

            tabl.rows.map((voting) => {
              if (!voting.active) {
                if (voting.active5 == true) {
                  tabl2.rows.push(voting);
                } else {
                  voting.buttonotvet.map((data, i2) => {
                    for (let i = 0; i < data.static.length; i++) {
                      if (userid != data.static[i]) {
                        data.static[i] = "411660512_" + i2 + "_" + i;
                      }
                    }
                    for (let i = 0; i < data.staticall.length; i++) {
                      if (userid != data.staticall[i]) {
                        data.staticall[i] = "411660512_" + i2 + "_" + i;
                      }
                    }
                  });
                  tabl2.rows.push(voting);
                }
              }
            });

            res.send(tabl2);
          } catch (error) {
            res.send(tablstart);
          }
        }
      });
    } else {
      res.send("error");
    }
  } catch {
    res.send("error");
  }
});

app.post("/admin", (req, res) => {
  const params = new URLSearchParams(req.body.sign);
  try {
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
  } catch {
    res.send("error");
  }
});

app.post("/set", (req, res) => {
  const params = new URLSearchParams(req.body.sign);
  try {
    if (params.get("vk_viewer_group_role") == "admin") {
      const tabl3 = JSON.parse(
        fs.readFileSync(
          "./bass/" + params.get("vk_group_id") + "/tabl.json",
          "utf-8"
        )
      );

      try {
        const tabl4 = JSON.parse(req.body.tabl);

        if (tabl3.rows != null) {
          tabl3.rows.map((data, i) => {
            if (tabl4.rows[i] != null) {
              tabl4.rows[i].buttonotvet.map((button, i2) => {
                if (
                  tabl4.rows[i].buttonotvet[i2] != null &&
                  data.buttonotvet[i2] != null &&
                  tabl3.rows.length == tabl4.rows.length
                ) {
                  button.static = data.buttonotvet[i2].static;
                  button.staticall = data.buttonotvet[i2].staticall;
                }
              });
            }
          });
        }

        fs.writeFileSync(
          "./bass/" + params.get("vk_group_id") + "/tabl.json",
          JSON.stringify(tabl4)
        );
        res.send(tabl4);
      } catch (error) {
        res.send(tabl3);
      }
    }
  } catch {
    res.send("error");
  }
});

function charToNumber(text) {
  return text
    .split("")
    .map((char) => {
      return char.toLowerCase().charCodeAt(0) + 57354;
    })
    .join("")
    .slice(0, 10);
}

function checkapi(params, code) {
  return charToNumber(params.get("sign")) == code;
}

app.post("/clickbutton", async (req, res) => {
  const params = new URLSearchParams(req.body.sign);
  const userid = params.get("vk_user_id");
  const groupid = params.get("vk_group_id");
  const tabl = JSON.parse(
    fs.readFileSync(
      "./bass/" + params.get("vk_group_id") + "/tabl.json",
      "utf-8"
    )
  );
  //const token = req.body.token;

  var error = "";
  let tablclick = { title: "Голосование", rows: [] };

  try {
    tabl.rows.map((voting) => {
      if (voting.active != true) {
        tablclick.rows.push(voting);
      }
    });

    /*const list = tablclick;
  const buttonstatic = tablclick.rows[req.body.voting].buttonotvet;
  const buttonstatic2 =
    tablclick.rows[req.body.voting].buttonotvet[req.body.number].static;
  const buttonstaticall =
    tablclick.rows[req.body.voting].buttonotvet[req.body.number].staticall;*/

    /*let check = await checkvote(
    req.body.number,
    userid,
    tabl.rows[req.body.voting],
    groupid,
    token
  );*/

    if (
      tablclick.rows[req.body.voting] &&
      !tablclick.rows[req.body.voting].active &&
      tablclick.rows[req.body.voting].active2
      //&& checkapi(params, req.body.code)
    ) {
      if (!tablclick.rows[req.body.voting].active4) {
        if (
          tablclick.rows[req.body.voting].buttonotvet.some((button) =>
            button.static.includes(userid)
          )
        ) {
          const indexToDeleted = tablclick.rows[req.body.voting].buttonotvet[
            req.body.number
          ].static.findIndex((button) => button.includes(userid));

          const indexToDeleted2 = tablclick.rows[
            req.body.voting
          ].buttonotvet.findIndex((button) => button.static.includes(userid));

          if (indexToDeleted != -1) {
            tablclick.rows[req.body.voting].buttonotvet[
              req.body.number
            ].static.splice(indexToDeleted, 1);
          } else {
            if (indexToDeleted2 != req.body.number && indexToDeleted2 != -1) {
              const indexToDeleted3 = tablclick.rows[
                req.body.voting
              ].buttonotvet[indexToDeleted2].static.findIndex((button) =>
                button.includes(userid)
              );

              tablclick.rows[req.body.voting].buttonotvet[
                indexToDeleted2
              ].static.splice(indexToDeleted3, 1);

              tablclick.rows[req.body.voting].buttonotvet[
                req.body.number
              ].static.push(userid);
            }
          }

          /* if (indexToDeleted2 != req.body.number) {
          tablclick.rows[req.body.voting].buttonotvet[
            indexToDeleted2
          ].static.push(userid);
        }*/
        } else {
          tablclick.rows[req.body.voting].buttonotvet[
            req.body.number
          ].static.push(userid);
        }
      } else {
        if (
          tablclick.rows[req.body.voting].buttonotvet[
            req.body.number
          ].staticall.includes(userid)
        ) {
          const indexToReplace = tablclick.rows[req.body.voting].buttonotvet[
            req.body.number
          ].staticall.findIndex((button) => button.includes(userid));

          tablclick.rows[req.body.voting].buttonotvet[
            req.body.number
          ].staticall.splice(indexToReplace, 1);
        } else {
          tablclick.rows[req.body.voting].buttonotvet[
            req.body.number
          ].staticall.push(userid);
        }
      }
    } else {
      //error = check[1] == "" ? "Ошибка выполнения условий" : check[1];
      error = "Ошибка выполнения условий";
    }

    fs.writeFileSync(
      "./bass/" + groupid + "/tabl.json",
      JSON.stringify(tablclick)
    );

    let list2 = { title: "Голосование", rows: [] };

    tablclick.rows.map((voting) => {
      if (voting.active != true) {
        if (voting.active5 == true) {
          list2.rows.push(voting);
        } else {
          voting.buttonotvet.map((data, i2) => {
            for (let i = 0; i < data.static.length; i++) {
              if (userid != data.static[i]) {
                data.static[i] = "411660512_" + i2 + "_" + i;
              }
            }
            for (let i = 0; i < data.staticall.length; i++) {
              if (userid != data.staticall[i]) {
                data.staticall[i] = "411660512_" + i2 + "_" + i;
              }
            }
          });
          list2.rows.push(voting);
        }
      }
    });

    res.send({ list2, error });
  } catch (error) {
    res.send("error");
  }
});

app.post("/vkphotoapp", async (req, res) => {
  try {
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

    const lengthimg = fs.readdirSync("./img").length;
    const namefile = `photo${lengthimg}.png`;

    fs.writeFileSync(`./img/${namefile}`, req.file.buffer);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(`./img/${namefile}`));

    const uploadResponse = await axios.post(
      uploadServerResponse.data.response.upload_url,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const photo = await axios.get(
      "https://api.vk.com/method/appWidgets.saveAppImage",
      {
        params: {
          access_token: appkey,
          v: "5.199",
          image: btoa(JSON.stringify(uploadResponse.data)),
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
  } catch {
    res.send("error");
  }
});

app.post("/vkphotoappbutton", async (req, res) => {
  try {
    const uploadServerResponse = await axios.get(
      "https://api.vk.com/method/appWidgets.getAppImageUploadServer",
      {
        params: {
          image_type: "160x160",
          access_token: appkey,
          v: "5.199",
        },
      }
    );

    const lengthimg = fs.readdirSync("./img").length;
    const namefile = `photo${lengthimg}.png`;

    fs.writeFileSync(`./img/${namefile}`, req.file.buffer);

    const formData = new FormData();
    formData.append("file", fs.createReadStream(`./img/${namefile}`));

    const uploadResponse = await axios.post(
      uploadServerResponse.data.response.upload_url,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    const photo = await axios.get(
      "https://api.vk.com/method/appWidgets.saveAppImage",
      {
        params: {
          access_token: appkey,
          v: "5.199",
          image: btoa(JSON.stringify(uploadResponse.data)),
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
  } catch (error) {
    //console.log(error);
    res.send("error");
  }
});

app.post("/deletedvoting", (req, res) => {
  const params = new URLSearchParams(req.body.sign);
  const tabl = req.body.tabl;

  try {
    if (params.get("vk_viewer_group_role") == "admin") {
      const tabl3 = JSON.parse(
        fs.readFileSync(
          "./bass/" + params.get("vk_group_id") + "/tabl.json",
          "utf-8"
        )
      );

      try {
        fs.writeFileSync(
          "./bass/" + params.get("vk_group_id") + "/tabl.json",
          JSON.stringify(tabl)
        );
        res.send(tabl);
      } catch {
        res.send(tabl3);
      }
    }
  } catch {
    res.send("error");
  }
});

/*async function checkvote(number, userid, tabl, groupid, token) {
  let response = {};

  if (tabl.active7 || tabl.sex != 0 || tabl.friendslimit || tabl.yearlimit) {
    try {
      if (
        !tabl.buttonotvet[number][
          tabl.active4 ? "staticall" : "static"
        ].includes(String(userid))
      ) {
        if (tabl.active7) {
          const data = await axios.get(
            "https://api.vk.com/method/groups.isMember",
            {
              params: {
                user_id: userid,
                group_id: groupid,
                v: "5.199",
                access_token: token,
              },
            }
          );

          if (data.data.error && data.data.error.error_code == 6) {
            return [false, "Подождите"];
          }

          if (!(data.data.response == 1)) {
            response.tabl = true;
          }
        }

        if (tabl.friendslimit) {
          const data = await axios.get(
            "https://api.vk.com/method/friends.get",
            {
              params: {
                user_id: userid,
                v: "5.199",
                access_token: token,
              },
            }
          );

          console.log(data);

          if (data.data.error && data.data.error.error_code === 6) {
            return [false, "Подождите"];
          }

          if (
            data.data.response &&
            tabl.friendslimit >= data.data.response.count
          ) {
            response.friends = true;
          }
        }

        if (tabl.yearlimit || tabl.sex) {
          const data = await axios.get("https://api.vk.com/method/users.get", {
            params: {
              user_id: userid,
              v: "5.199",
              access_token: token,
              fields: "sex,bdate",
            },
          });

          if (data.data.error && data.data.error.error_code === 6) {
            return [false, "Подождите"];
          }

          const userData = data.data.response[0];

          if (tabl.sex && !(tabl.sex == userData.sex)) {
            response.sex = true;
          }

          if (tabl.yearlimit) {
            const myyear = Math.floor(
              (new Date() - new Date(userData.bdate)) / 31536000000
            );

            if (!(myyear >= tabl.yearlimit)) {
              response.year = true;
            }
          }
        }

        console.log(response);

        return [
          !response.tabl &&
            !response.friends &&
            !response.year &&
            !response.sex,
          "",
        ];
      } else {
        return [true, ""];
      }
    } catch (error) {
      console.log(error);
      return [false, ""];
    }
  } else {
    return [true, ""];
  }
}*/

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

/*const options = {
  key: fs.readFileSync("/etc/letsencrypt/live/widgetvoting.ru/privkey.pem"),
  cert: fs.readFileSync("/etc/letsencrypt/live/widgetvoting.ru/fullchain.pem"),
  ca: fs.readFileSync("/etc/letsencrypt/live/widgetvoting.ru/chain.pem"),
};

server = https.createServer(options, app);

server.listen(443, () => {
  console.log("Сервер запущен");
});*/

app.listen(3000, () => {
  console.log("Сервер запущен");
});
