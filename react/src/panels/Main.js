import React, { useState, useEffect, useRef } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "axios";
import { write, utils } from "xlsx";
import { format } from "date-fns";
import { SketchPicker } from "react-color";

import "./Main.css";
import "@vkontakte/vkui/dist/vkui.css";

import {
  SplitLayout,
  PanelHeader,
  Group,
  IconButton,
  SimpleCell,
  Panel,
  View,
  Button,
  Snackbar,
  Div,
  ButtonGroup,
  ModalRoot,
  ModalPage,
  ModalPageHeader,
  FormItem,
  Input,
  DateInput,
  File,
  Textarea,
  Checkbox,
  Avatar,
  Gallery,
  Link,
  ScreenSpinner,
  Select,
  Root,
  Text,
  CustomSelect,
  Slider,
  usePlatform,
  Platform,
} from "@vkontakte/vkui";

import {
  Icon28InfoOutline,
  Icon28SettingsOutline,
  Icon28ListOutline,
  Icon28ErrorCircleOutline,
  Icon24Camera,
  Icon28PictureOutline,
  Icon28GraphOutline,
  Icon28DeleteOutlineAndroid,
  Icon28Done,
  Icon24Done,
  Icon28CopyOutline,
  Icon28InfoCircleOutline,
  Icon24CopyOutline,
  Icon28PaletteOutline,
} from "@vkontakte/icons";

let listuserbutton = [];
const sextabl = [
  {
    label: "Не выбран",
    value: 0,
  },
  {
    label: "Женский",
    value: 1,
  },
  {
    label: "Мужской",
    value: 2,
  },
];

const Main = ({
  location,
  groupid,
  list,
  setlist,
  votingset,
  setvoting,
  activeModal,
  setActiveModal,
  site,
  charToNumber,
}) => {
  const [fetchedUser, setUser] = useState(null);
  const appid = 51824047;
  const [activePanel, setActivePanel] = useState("panel1");
  const [snackbar, setSnackbar] = useState(null);
  const [popout, setPopout] = useState(<ScreenSpinner size="large" />);
  const [activeModalstats, setActiveModalstats] = useState(null);
  const [datavalue, datasetValue] = useState(() => new Date());
  const [errorcolor, seterrorcolor] = useState(null);
  const [showPicker, setShowPicker] = useState([]);
  const [statsbutton, setstatsbutton] = useState(0);
  const [selectType, setSelectType] = useState("00");
  const [selectType2, setSelectType2] = useState("00");
  const [errorstyletitlebutton, seterrorstyletitlebutton] = useState("default");
  const [errorstyletextbutton, seterrorstyletextbutton] = useState("default");
  const [errorstyletitle, seterrorstyletitle] = useState("default");
  const [errorstyletext, seterrorstyletext] = useState("default");
  const pickerContainerRef = useRef([]);
  /*const isVotingCondition = list.rows?.length > 0 && location.hash !== "";
  const defaultVoting = isVotingCondition
    ? Number(location.hash.split("#")[1].split("_")[1])
    : 0;*/

  const [listphoto, setlistphoto] = useState([
    {
      urlphoto:
        "https://sun1-91.userapi.com/fU9xHe6hOhaPC1Cpi4--UNaqqjtFe_-R7gK4KQ/-snHiizBrOE.jpg",
      cover_id: "51824047_2460869",
    },
    {
      urlphoto:
        "https://sun1-84.userapi.com/ZHfzxTbuxltx50vs-jQlygsyDHxic3p55a4lTg/M3CoYsnXzgk.jpg",
      cover_id: "51824047_2460870",
    },
    {
      urlphoto:
        "https://sun1-30.userapi.com/DzFX0-8wsLJqNdQIugy3NNh46lRgd8GuCQGgJw/VLnn0MCduo8.jpg",
      cover_id: "51824047_2460871",
    },
  ]);

  useEffect(() => {
    async function getuser() {
      const user = await bridge.send("VKWebAppGetUserInfo");
      setUser(user);
      setPopout(null);
    }

    getuser();

    const handleOutsideClick = (event) => {
      const clickedIndex = pickerContainerRef.current.findIndex(
        (ref) => ref && ref.contains(event.target)
      );

      //ref.current.contains(event.target)

      if (clickedIndex != -1) {
        handlePickerToggle(clickedIndex);
      } else {
        if (!event.target.closest(".sketch-picker ")) {
          setShowPicker([]);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  /*bridge.send("VKWebAppCheckBannerAd").then((data) => {
    if (!data.result) {
      bridge
        .send("VKWebAppShowBannerAd", {
          banner_location: "bottom",
        })
        .catch(() => {
          console.log("Реклама не найдена");
        });
    }
  });*/

  async function NextPanel(panel) {
    if (panel == "settings") {
      if (await votinglist()) {
        //widgettoken
        setActivePanel("panel2");
      }
    } else {
      setActivePanel(panel);
    }
  }

  async function votinglist() {
    const response = await axios.post(
      `${site}/admin`,
      {
        sign: location.origin + location.search,
        code: charToNumber(new URLSearchParams(location.search).get("sign")),
      },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    if (response != null && response.data != "error") {
      setlist(response.data);
      return true;
    } else {
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={
            <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
          }
        >
          Ошибка
        </Snackbar>
      );
      return false;
    }
  }

  async function savebutton() {
    const response = await axios.post(
      `${site}/set`,
      {
        sign: location.origin + location.search,
        tabl: JSON.stringify(list),
        code: charToNumber(new URLSearchParams(location.search).get("sign")),
      },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );

    if (response.data == "error") {
      <Snackbar
        onClose={() => setSnackbar(null)}
        before={
          <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
        }
      >
        Ошибка
      </Snackbar>;
    } else {
      setlist(response.data);
    }
  }

  async function savewidget(typewidget) {
    try {
      const listzaliv = {
        title: "Голосование",
        rows: [],
        more: "Приложение",
        more_url: "https://vk.com/app51824047",
      };

      list.rows.map((time) => {
        var newTime = { ...time };
        if (typewidget == 1) {
          newTime.active6
            ? (newTime.descr = `${newTime.time}`)
            : (newTime.descr = `${newTime.text}`);
        } else if (typewidget == 2) {
          newTime.active6
            ? (newTime.time = `${newTime.time}`)
            : (newTime.time = null);
          newTime.descr = null;
        } else {
          newTime.active6
            ? (newTime.time = `${newTime.time}`)
            : (newTime.time = null);
          newTime.descr = null;
        }

        if (newTime.active3) {
          listzaliv.rows.push(newTime);
        }
      });

      list.rows.map((url, i) => {
        url.button_url = `https://vk.com/app51824047_-${groupid}#${groupid}_${i}`;
        url.url = `https://vk.com/app51824047_-${groupid}#${groupid}_${i}`;
      });

      listzaliv.rows.map((url, i) => {
        url.button_url = `https://vk.com/app51824047_-${groupid}#${groupid}_${i}`;
        url.url = `https://vk.com/app51824047_-${groupid}#${groupid}_${i}`;
      });

      await bridge
        .send("VKWebAppShowCommunityWidgetPreviewBox", {
          group_id: groupid,
          type: "compact_list",
          type:
            typewidget == 1
              ? "cover_list"
              : typewidget == 2
              ? "compact_list"
              : "list",
          code: "return " + JSON.stringify(listzaliv) + ";",
        })
        .then((data) => {
          setActiveModal(null);
          setSnackbar(
            <Snackbar
              onClose={() => setSnackbar(null)}
              before={<Icon28Done fill="var(--vkui--color_icon_positive)" />}
            >
              Виджет обновлён
            </Snackbar>
          );
        })
        .catch((error) => {
          console.log(error);
          if (error.error_data.error_code != 4) {
            setActiveModal(null);
            if (
              error.error_data.error_reason ==
              "One of the parameters specified was missing or invalid: rows should contain at least 1 elements"
            ) {
              setSnackbar(
                <Snackbar
                  onClose={() => setSnackbar(null)}
                  before={
                    <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
                  }
                >
                  Ни одно голосование не добавлено в виджет. Или их больше трёх
                </Snackbar>
              );
            } else if (
              error.error_data.error_reason ==
              "Access denied: app must be installed in group as community app"
            ) {
              setSnackbar(
                <Snackbar
                  onClose={() => setSnackbar(null)}
                  before={
                    <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
                  }
                >
                  Вам необходимо добавить приложение в сообщество
                </Snackbar>
              );
            } else if (error.error_data.error_reason == "Invalid params") {
              setSnackbar(
                <Snackbar
                  onClose={() => setSnackbar(null)}
                  before={
                    <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
                  }
                >
                  Ошибка, причины в описании настроек
                </Snackbar>
              );
            } else {
              setSnackbar(
                <Snackbar
                  onClose={() => setSnackbar(null)}
                  before={
                    <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
                  }
                >
                  {error.error_data.error_reason}
                </Snackbar>
              );
            }
          }
        });

      savebutton();
    } catch (error) {
      console.log(error);
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={
            <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
          }
        >
          Ошибка
        </Snackbar>
      );
    }
  }

  async function clickbutton(numbervoting, number, token) {
    const tabl = list.rows[numbervoting];
    const responsecheck = {};
    var responseotver = "Ошибка выполнения условий";
    if (
      !tabl.buttonotvet[number][tabl.active4 ? "staticall" : "static"].includes(
        String(fetchedUser.id)
      )
    ) {
      if (tabl.active7) {
        await bridge
          .send("VKWebAppCallAPIMethod", {
            method: "groups.isMember",
            params: {
              user_id: fetchedUser.id,
              group_id: groupid,
              v: "5.199",
              access_token: token,
            },
          })
          .then((data) => {
            if (!(data.response == 1)) {
              responsecheck.tabl = true;
            }
          })
          .catch((error) => {
            responsecheck.tabl = true;
            if (error.error_data.error_code == 6) {
              responseotver = "Подождите";
            }
          });
      }

      if (tabl.yearlimit || tabl.sex || tabl.active8) {
        await bridge
          .send("VKWebAppCallAPIMethod", {
            method: "users.get",
            params: {
              user_id: fetchedUser.id,
              v: "5.199",
              access_token: token,
              fields: "sex,bdate,is_verified",
            },
          })
          .then((data) => {
            const userData = data.response[0];
            if (tabl.active8) {
              responsecheck.pasport = !userData.is_verified;
            }

            if (tabl.sex && !(tabl.sex == userData.sex)) {
              responsecheck.sex = true;
            }

            if (tabl.yearlimit) {
              const myyear = Math.floor(
                (new Date() -
                  new Date(
                    parseInt(userData.bdate.split(".")[2]),
                    parseInt(userData.bdate.split(".")[1]) - 1,
                    parseInt(userData.bdate.split(".")[0])
                  )) /
                  31536000000
              );

              if (!(myyear >= tabl.yearlimit)) {
                responsecheck.year = true;
              }
            }
          })
          .catch((error) => {
            responsecheck.year = true;
            responsecheck.sex = true;
            if (error.error_data.error_code === 6) {
              responseotver = "Подождите";
            }
          });
      }

      if (tabl.friendslimit) {
        await bridge
          .send("VKWebAppCallAPIMethod", {
            method: "friends.get",
            params: {
              v: "5.199",
              access_token: token,
            },
          })
          .then((data) => {
            if (data.response && tabl.friendslimit >= data.response.count) {
              responsecheck.friends = true;
            }
          })
          .catch((error) => {
            responsecheck.friends = true;
            if (error.error_data.error_code === 6) {
              responseotver = "Подождите";
            }
          });
      }

      if (
        !responsecheck.sex &&
        !responsecheck.year &&
        !responsecheck.tabl &&
        !responsecheck.friends &&
        !responsecheck.pasport
      ) {
        await clikbuttonsend(numbervoting, number, token);
      } else {
        setSnackbar(
          <Snackbar
            onClose={() => setSnackbar(null)}
            before={
              <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
            }
          >
            {responseotver}
          </Snackbar>
        );
      }
    } else {
      await clikbuttonsend(numbervoting, number, token);
    }
  }

  const clikbuttonsend = async (numbervoting, number, token) => {
    const response = await axios.post(
      `${site}/clickbutton`,
      {
        sign: location.origin + location.search,
        voting: numbervoting,
        number: number,
        token: token,
        code: charToNumber(new URLSearchParams(location.search).get("sign")),
      },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );

    setlist(response.data.list2);

    if (response.data.error != "") {
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={
            <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
          }
        >
          {response.data.error}
        </Snackbar>
      );
    } else {
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={<Icon28Done fill="var(--vkui--color_icon_positive)" />}
        >
          Голос засчитан
        </Snackbar>
      );
    }
  };

  async function handleClickButton(numbervoting, number) {
    const gettoken = `${list.rows[numbervoting].active7 ? "groups," : ""}${
      list.rows[numbervoting].friendslimit ? "friends," : ""
    }${
      list.rows[numbervoting].yearlimit || list.rows[numbervoting].sex != 0
        ? "status"
        : ""
    }`;

    // offline

    if (gettoken != "") {
      await bridge
        .send("VKWebAppGetAuthToken", {
          app_id: appid,
          scope: gettoken,
        })
        .then(async (data) => {
          if (data.access_token) {
            clickbutton(numbervoting, number, data.access_token);
          }
        })
        .catch((error) => {
          console.log(error);
          setSnackbar(
            <Snackbar
              onClose={() => setSnackbar(null)}
              before={
                <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
              }
            >
              Ошибка выполнения условий
            </Snackbar>
          );
        });
    } else {
      //console.log(gettoken);
      clickbutton(numbervoting, number, null);
    }
  }

  function isHtml(text) {
    var doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.childElementCount > 0;
  }

  async function updateuserlist(votingnumber, buttonnumber) {
    await bridge
      .send("VKWebAppCallAPIMethod", {
        method: "users.get",
        params: {
          user_ids:
            list.rows[votingnumber].buttonotvet[buttonnumber][
              list.rows[votingnumber].active4 === true ? "staticall" : "static"
            ].join(","),
          fields: "photo_400_orig",
          v: "5.154",
          access_token:
            "00e42a6900e42a6900e42a69fe03f2efc6000e400e42a6965446abf4f91139bd32d3a5f",
        },
      })
      .then((data) => {
        listuserbutton = data.response;
      });

    if (listuserbutton.length > 0) {
      if (listuserbutton.length <= 500) {
        await bridge
          .send("VKWebAppCallAPIMethod", {
            method: "groups.isMember",
            params: {
              user_ids: listuserbutton
                .map((text) => {
                  return text.id;
                })
                .join(","),
              group_id: groupid,
              v: "5.154",
              access_token:
                "00e42a6900e42a6900e42a69fe03f2efc6000e400e42a6965446abf4f91139bd32d3a5f",
            },
          })
          .then((data2) => {
            for (let i = 0; i < data2.response.length; i++) {
              listuserbutton[i].member = data2.response[i].member;
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } else {
        const user500 = [];

        for (let i = 0; i < listuserbutton.length; i += 500) {
          const userinfo = listuserbutton.slice(i, i + 500);
          user500.push(userinfo);
        }

        for (let index = 0; index < user500.length; index++) {
          await bridge
            .send("VKWebAppCallAPIMethod", {
              method: "groups.isMember",
              params: {
                user_ids: user500[index]
                  .map((text) => {
                    return text.id;
                  })
                  .join(","),
                group_id: groupid,
                v: "5.154",
                access_token:
                  "00e42a6900e42a6900e42a69fe03f2efc6000e400e42a6965446abf4f91139bd32d3a5f",
              },
            })
            .then((data) => {
              data.response.map((data2, i) => {
                listuserbutton[i + index * 500].member = data2.member;
              });
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    }
  }

  const handleAddButton = (button) => {
    const newList = [...list.rows];
    if (!button) {
      newList[votingset].buttonotvet.push({
        static: [],
        staticall: [],
        color: { r: 191, g: 35, b: 35, a: 1 },
        text: "Кнопка " + (newList[votingset].buttonotvet.length + 1),
      });
    } else {
      newList[votingset].buttonotvet.push({
        static: [],
        staticall: [],
        color: {
          r: button.color.r,
          g: button.color.g,
          b: button.color.b,
          a: button.color.a,
        },
        descr: button.descr,
        img: button.img,
        text: button.text,
      });
    }
    setlist({ ...list, rows: newList });
  };

  const handleDeletedButton = () => {
    const newList = [...list.rows];
    newList[votingset].buttonotvet.splice(
      newList[votingset].buttonotvet.length - 1,
      1
    );
    setlist({ ...list, rows: newList });
  };

  const handleDeletedVoting = async () => {
    const newList = [...list.rows];
    if (
      newList[votingset].buttonotvet.some(
        (datacheck) => datacheck.static > 0
      ) ||
      newList[votingset].buttonotvet.some(
        (datacheck) => datacheck.staticall > 0
      )
    ) {
      newList[votingset].buttonotvet.map((data) => {
        data.static = [];
        data.staticall = [];
      });
      setlist({ ...list, rows: newList });

      const response = await axios.post(
        `${site}/deletedvoting`,
        {
          sign: location.origin + location.search,
          tabl: JSON.stringify(list),
          code: charToNumber(new URLSearchParams(location.search).get("sign")),
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setlist(response.data);

      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={<Icon28Done fill="var(--vkui--color_icon_positive)" />}
        >
          Голоса успешно обнулены
        </Snackbar>
      );
    } else {
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={
            <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
          }
        >
          Голоса отсутствуют
        </Snackbar>
      );
    }
  };

  const handleNameButton = (e, i) => {
    const newList = [...list.rows];
    if (
      e.target.value.length > 0 &&
      e.target.value.length < 40 &&
      e.target.value.trim() !== ""
    ) {
      newList[votingset].buttonotvet[i].text = e.target.value;
      setlist({ ...list, rows: newList });
      seterrorstyletitlebutton("default");
    } else {
      seterrorstyletitlebutton("error");
    }
  };

  const handleDescriptionButton = (e, i) => {
    if (e.target.value.length < 5000) {
      const newList = [...list.rows];
      newList[votingset].buttonotvet[i].descr = e.target.value;
      setlist({ ...list, rows: newList });
      seterrorstyletextbutton("default");
    } else {
      seterrorstyletextbutton("error");
    }
  };

  const handleColorButton = (e, i) => {
    const newList = [...list.rows];
    newList[votingset].buttonotvet[i].color = e.rgb;
    setlist({ ...list, rows: newList });
  };

  const handleGallery = (e) => {
    setTimeout(() => {
      const newList = [...list.rows];
      newList[votingset].urlphoto = listphoto[e].urlphoto;
      newList[votingset].cover_id = listphoto[e].cover_id;
      setlist({ ...list, rows: newList });
    }, 150);
  };

  const handleImageUpload = async (e) => {
    if (
      e.target.files[0] &&
      (e.target.files[0].type == "image/jpeg" ||
        e.target.files[0].type == "image/png")
    ) {
      const file = e.target.files[0];

      const img = new Image();

      const dataUrl = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target.result);
        reader.readAsDataURL(file);
      });

      img.src = dataUrl;

      img.onload = async () => {
        if (img.width == 1530 && img.height == 384) {
          const formData = new FormData();
          formData.append("photo.jpg", file, "photo.jpg");
          formData.append("sign", location.origin + location.search);
          formData.append(
            "code",
            charToNumber(new URLSearchParams(location.search).get("sign"))
          );

          const response = await axios.post(`${site}/vkphotoapp`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          listphoto.push({
            urlphoto: response.data.response.images[2].url,
            cover_id: response.data.response.id,
          });

          seterrorcolor("green");
        } else {
          seterrorcolor("red");
        }
      };
    } else {
      seterrorcolor("red");
    }
  };

  const handleImageUploadButton = async (e) => {
    if (
      e.target.files[0] &&
      (e.target.files[0].type === "image/jpeg" ||
        e.target.files[0].type === "image/png")
    ) {
      const file = e.target.files[0];

      const formData = new FormData();

      const img = new Image();

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 480;
        canvas.height = 480;

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          formData.append("photo.jpg", blob, "photo.jpg");
          formData.append(
            "sign",
            window.location.origin + window.location.search
          );
          formData.append(
            "code",
            charToNumber(new URLSearchParams(location.search).get("sign"))
          );

          const img = await axios.post(`${site}/vkphotoappbutton`, formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });

          const newList = [...list.rows];
          newList[votingset].buttonotvet[statsbutton].img =
            img.data.response.images[2].url;
          setlist({ ...list, rows: newList });
        });
      };

      const reader = new FileReader();
      reader.onload = (e) => {
        img.src = e.target.result;
      };

      reader.readAsDataURL(file);
    }
  };

  const handleCheckboxChange = (index, number) => {
    const updatedList = { ...list };
    if (number == 1) {
      updatedList.rows[index].active = !updatedList.rows[index].active;
    } else if (number == 2) {
      updatedList.rows[index].active2 = !updatedList.rows[index].active2;
    } else if (number == 3) {
      updatedList.rows[index].active3 = !updatedList.rows[index].active3;
    } else if (number == 4) {
      updatedList.rows[index].active4 = !updatedList.rows[index].active4;
    } else if (number == 5) {
      updatedList.rows[index].active5 = !updatedList.rows[index].active5;
    } else if (number == 6) {
      updatedList.rows[index].active6 = !updatedList.rows[index].active6;
      if (!updatedList.rows[index].active6) {
        updatedList.rows[votingset].time = null;
      }
    } else if (number == 7) {
      updatedList.rows[index].active7 = !updatedList.rows[index].active7;
    } else if (number == 8) {
      updatedList.rows[index].active8 = !updatedList.rows[index].active8;
    }
    setlist(updatedList);
  };

  const handleВatetime = (e) => {
    if (
      format(e, "yyyy") < 100000 &&
      format(e, "yyyy") > 1000 &&
      format(e, "MM") < 13 &&
      format(e, "MM") > 0 &&
      format(e, "dd") < 32 &&
      format(e, "dd") > 0
    ) {
      const updatedList = { ...list };
      updatedList.rows[votingset].time =
        format(e, "dd.MM.yyyy") + " " + selectType2 + ":" + selectType + ":00";
      datasetValue(e);
      setlist(updatedList);
    } else {
      e = new Date();
    }
  };

  const handleNameVoting = (e) => {
    const updatedList = { ...list };
    if (
      e.target.value.length > 0 &&
      e.target.value.length < 101 &&
      e.target.value.trim() !== "" &&
      !isHtml(e.target.value)
    ) {
      list.rows[votingset].title = e.target.value;
      setlist(updatedList);
      seterrorstyletitle("default");
    } else {
      seterrorstyletitle("error");
    }
  };

  const downloadExcelFile = (typevoting, voting, allnumbervoting) => {
    const data = [[]];
    const groupvoting = [];

    voting.map((data3, index) => {
      const percentvoting = Math.round(
        (100 / allnumbervoting) * data3[typevoting].length
      );
      data[0].push([data3.text, percentvoting]);
      if (data3[typevoting].length > 0) {
        data3[typevoting].map((data2, index2) => {
          if (groupvoting[index2]) {
            groupvoting[index2].push(data2);
          } else {
            groupvoting.push([data2]);
          }
        });
      }
    });

    groupvoting.map((data2) => {
      data.push(data2);
    });

    data[0].sort((a, b) => b[1] - a[1]);

    data[0].map((data2, index) => {
      data[0][index] = `${data2[0]} ${data2[1]}%`;
    });

    const ws = utils.aoa_to_sheet(data);
    const wb = utils.book_new();

    const cols = [];
    for (let i = 0; i < data.length; i++) {
      cols.push({ wch: 20 });
    }

    ws["!cols"] = cols;

    utils.book_append_sheet(wb, ws, "Голосование");
    const wbout = write(wb, { type: "binary", bookType: "xlsx" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "data.xlsx");
    document.body.appendChild(link);
    link.click();
  };

  const s2ab = (s) => {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  };

  const handleTextVoting = (e) => {
    const updatedList = { ...list };
    if (
      e.target.value.length > 0 &&
      e.target.value.length < 101 &&
      e.target.value.trim() !== "" &&
      !isHtml(e.target.value)
    ) {
      seterrorstyletext("default");
      list.rows[votingset].text = e.target.value;
      setlist(updatedList);
    } else {
      seterrorstyletext("error");
    }
  };

  const styles = {
    "--error-color": errorcolor,
  };

  const handlePickerToggle = (index) => {
    const updatedList = [...showPicker];
    updatedList[index] = !updatedList[index];
    setShowPicker(updatedList);
  };

  const listh = Array.from({ length: 24 }, (_, index) => ({
    label: index.toString().padStart(2, "0"), // Применяем padStart для добавления ведущего нуля
    value: index.toString().padStart(2, "0"),
  }));

  const listm = Array.from({ length: 60 }, (_, index) => ({
    label: index.toString().padStart(2, "0"),
    value: index.toString().padStart(2, "0"), // Заменил 'key' на 'value'
  }));

  function getvoting(voting) {
    return list.rows[voting].buttonotvet.reduce((uniqueSet, button) => {
      button[
        list.rows[voting].active4 == true ? "staticall" : "static"
      ].forEach((item) => uniqueSet.add(item));
      return uniqueSet;
    }, new Set()).size;
  }

  const modal = (
    <ModalRoot activeModal={activeModal}>
      <ModalPage
        id="deletedvoting"
        onClose={() => setActiveModal("votingset")}
        header={<ModalPageHeader>Удаление голосования</ModalPageHeader>}
      >
        <FormItem style={{ textAlign: "center" }}>
          Вы уверены в том, что хотите удалить голосование?
        </FormItem>
        <FormItem>
          <ButtonGroup mode="horizontal" stretched>
            <Button
              stretched
              onClick={() => {
                setActiveModal(null);
                list.rows.splice(votingset, 1);
                setvoting(0);
                savebutton();
              }}
              appearance="positive"
              size="l"
            >
              Да
            </Button>
            <Button
              stretched
              onClick={() => setActiveModal("votingset")}
              appearance="negative"
              size="l"
            >
              Нет
            </Button>
          </ButtonGroup>
        </FormItem>
      </ModalPage>
      <ModalPage
        id="buttonset"
        onClose={() => {
          setActiveModal("votingset");
        }}
        header={<ModalPageHeader>Настройка кнопки</ModalPageHeader>}
        dynamicContentHeight
      >
        {list.rows != null &&
          list.rows.length > 0 &&
          list.rows[votingset] != null &&
          list.rows[votingset].buttonotvet[statsbutton] != null && (
            <React.Fragment>
              <FormItem top="Фото:" style={{ textAlign: "center" }}>
                {list.rows[votingset].buttonotvet[statsbutton].img ? (
                  <img
                    style={{
                      width: "50%",
                      height: "25%",
                      borderRadius: "10px",
                    }}
                    src={list.rows[votingset].buttonotvet[statsbutton].img}
                  ></img>
                ) : (
                  "Фото отсутствует"
                )}
              </FormItem>
              <FormItem status={errorstyletitlebutton} top="Название:">
                <Input
                  name="namebutton"
                  placeholder="Название"
                  defaultValue={
                    list.rows[votingset].buttonotvet[statsbutton].text
                  }
                  onChange={(e) => {
                    handleNameButton(e, statsbutton);
                  }}
                />
              </FormItem>
              <FormItem status={errorstyletextbutton} top="Описание:">
                <Textarea
                  name="descriptionbutton"
                  placeholder="Описание"
                  defaultValue={
                    list.rows[votingset].buttonotvet[statsbutton].descr
                  }
                  onChange={(e) => {
                    handleDescriptionButton(e, statsbutton);
                  }}
                />
              </FormItem>
              <FormItem>
                <ButtonGroup align="center" mode="horizontal" stretched={true}>
                  <File
                    before={<Icon24Camera role="presentation" />}
                    stretched={true}
                    size="l"
                    onChange={handleImageUploadButton}
                    appearance="positive"
                  >
                    Загрузить
                  </File>
                  <Button
                    size="l"
                    stretched={true}
                    onClick={() => {
                      list.rows[votingset].buttonotvet[statsbutton].img = null;
                    }}
                    appearance="negative"
                  >
                    Удалить
                  </Button>
                </ButtonGroup>
                <p style={{ marginTop: "10px" }}>
                  Рекомендуемое изображение квадратное (PNG/JPG)
                </p>
              </FormItem>
            </React.Fragment>
          )}
      </ModalPage>
      <ModalPage
        id="button"
        onClose={() => {
          setActiveModal("voting");
        }}
        header={
          <ModalPageHeader
            before={
              list.rows != null &&
              list.rows.length > 0 &&
              list.rows[votingset].active5 ? (
                <IconButton
                  onClick={async () => {
                    await updateuserlist(votingset, statsbutton);
                    setActiveModal("statsuser");
                    setstatsbutton(statsbutton);
                    setActiveModalstats("voting");
                  }}
                >
                  <Icon28GraphOutline />
                </IconButton>
              ) : null
            }
          >
            Кнопка
          </ModalPageHeader>
        }
        dynamicContentHeight
      >
        {list.rows != null &&
          list.rows.length > 0 &&
          list.rows[votingset] != null &&
          fetchedUser != null &&
          list.rows[votingset].buttonotvet[statsbutton] != null && (
            <React.Fragment>
              <FormItem top="Фото:" style={{ textAlign: "center" }}>
                {list.rows[votingset].buttonotvet[statsbutton].img ? (
                  <img
                    style={{
                      width: "50%",
                      height: "25%",
                      borderRadius: "10px",
                    }}
                    src={list.rows[votingset].buttonotvet[statsbutton].img}
                  ></img>
                ) : (
                  "Фото отсутствует"
                )}
              </FormItem>
              <FormItem top="Название кнопки:" style={{ textAlign: "center" }}>
                {list.rows[votingset].buttonotvet[statsbutton].text}
              </FormItem>
              <FormItem top="Описание кнопки:" style={{ textAlign: "center" }}>
                {list.rows[votingset].buttonotvet[statsbutton].descr
                  ? list.rows[votingset].buttonotvet[statsbutton].descr
                  : "Описание отсутствует"}
              </FormItem>
              <br />
              {/*
              <FormItem>
                <Button
                  size="l"
                  stretched={true}
                  onClick={() => handleClickButton(votingset, statsbutton)}
                  appearance="positive"
                  before={
                    (list.rows[votingset].active4 != true &&
                      list.rows[votingset].buttonotvet[
                        statsbutton
                      ].static.includes(String(fetchedUser.id))) ||
                    (list.rows[votingset].active4 == true &&
                      list.rows[votingset].buttonotvet[
                        statsbutton
                      ].staticall.includes(String(fetchedUser.id))) ? (
                      <Icon24Done />
                    ) : (
                      ""
                    )
                  }
                  after={
                    (list.rows[votingset].active4 != true &&
                      list.rows[votingset].buttonotvet[
                        statsbutton
                      ].static.includes(String(fetchedUser.id))) ||
                    (list.rows[votingset].active4 == true &&
                      list.rows[votingset].buttonotvet[
                        statsbutton
                      ].staticall.includes(String(fetchedUser.id))) ? (
                      <Icon24Done />
                    ) : (
                      ""
                    )
                  }
                >
                  Голосовать
                </Button>
              </FormItem>
                */}
            </React.Fragment>
          )}
      </ModalPage>
      <ModalPage
        id="statsuser"
        onClose={() => {
          setActiveModal("stats");
        }}
        dynamicContentHeight
        header={<ModalPageHeader>Статистика выбора</ModalPageHeader>}
      >
        {list.rows != null &&
        list.rows.length > 0 &&
        list.rows[votingset] != null &&
        list.rows[votingset].buttonotvet[statsbutton] != null &&
        list.rows[votingset].buttonotvet[statsbutton][
          list.rows[votingset].active4 === true ? "staticall" : "static"
        ].length > 0 &&
        listuserbutton.length > 0 ? (
          <>
            <React.Fragment>
              <Group>
                <FormItem
                  style={{ textAlign: "center" }}
                  top={
                    <React.Fragment>
                      Голосов:{" "}
                      {list.rows[votingset].active4 === true
                        ? list.rows[votingset].buttonotvet[statsbutton]
                            .staticall.length
                        : list.rows[votingset].buttonotvet[statsbutton].static
                            .length}
                      <br />
                      Подписано:{" "}
                      {(() => {
                        const filteredMembers = listuserbutton.filter(
                          (array) => array.member == 1
                        );
                        return filteredMembers.length;
                      })()}
                      {/* <br />
                      Ботов:{" "} */}
                    </React.Fragment>
                  }
                >
                  {list.rows[votingset].buttonotvet[statsbutton][
                    list.rows[votingset].active4 === true
                      ? "staticall"
                      : "static"
                  ].map((user, i) => {
                    return (
                      <React.Fragment key={i}>
                        {listuserbutton[i] != null && (
                          <SimpleCell
                            before={
                              <Avatar src={listuserbutton[i].photo_400_orig} />
                            }
                            key={i}
                            onClick={() =>
                              window.open(
                                `https://vk.com/id${listuserbutton[i].id}`,
                                "_blank",
                                "noopener,noreferrer"
                              )
                            }
                            after={
                              listuserbutton[i].member != null
                                ? listuserbutton[i].member == 1
                                  ? "Подписан"
                                  : "Не подписан"
                                : "Доступа нет"
                            }
                          >
                            {`${listuserbutton[i].first_name} ${listuserbutton[i].last_name}`}
                          </SimpleCell>
                        )}
                      </React.Fragment>
                    );
                  })}
                </FormItem>
              </Group>
            </React.Fragment>
          </>
        ) : (
          <Group>
            <FormItem
              top="Голоса отсутствуют"
              style={{ textAlign: "center" }}
            ></FormItem>
          </Group>
        )}
      </ModalPage>
      <ModalPage
        id="stats"
        onClose={() => {
          //if (activeModalstats === "votingset") {
          //await votinglist();
          setActiveModal(activeModalstats);
          // } else {
          //  setActiveModal(activeModalstats);
          //}
        }}
        header={<ModalPageHeader>Статистика голосования</ModalPageHeader>}
      >
        {list.rows != null &&
          list.rows.length > 0 &&
          list.rows[votingset] != null && (
            <React.Fragment>
              <FormItem>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      backgroundImage: `url(${list.rows[votingset].urlphoto})`,
                      width: "100%",
                      height: "100px",
                      display: "block",
                      borderRadius: "10px",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  ></span>
                  <span className="app_widget_list_cover_gradient"></span>
                </div>
              </FormItem>
              <FormItem style={{ textAlign: "center" }} top="Название:">
                {list.rows[votingset].title}
              </FormItem>
              <FormItem style={{ textAlign: "center" }} top="Описание:">
                <div style={{ whiteSpace: "pre-line" }}>
                  {list.rows[votingset].text}
                </div>
              </FormItem>
              <FormItem
                style={{ textAlign: "center" }}
                top="Всего участников в голосовании:"
              >
                {`${getvoting(votingset)} человек`}
              </FormItem>
              <FormItem style={{ textAlign: "center" }} top="Выбор участников:">
                {list.rows[votingset].buttonotvet.length > 0 ? (
                  <ButtonGroup align="center" mode="vertical" stretched={true}>
                    {list.rows[votingset].buttonotvet.map((button, i) => {
                      button.originitem = i;
                    })}
                    {list.rows[votingset].buttonotvet
                      .slice()
                      .sort(
                        (a, b) =>
                          b[
                            list.rows[votingset].active4 == true
                              ? "staticall"
                              : "static"
                          ].length -
                          a[
                            list.rows[votingset].active4 == true
                              ? "staticall"
                              : "static"
                          ].length
                      )
                      .map((button, i) => {
                        return (
                          <Button
                            size="l"
                            stretched={true}
                            style={{
                              backgroundColor: `rgb(${button.color.r}, ${button.color.g}, ${button.color.b}, ${button.color.a})`,
                            }}
                            key={i}
                            onClick={async () => {
                              await updateuserlist(
                                votingset,
                                button.originitem
                              );
                              setActiveModal("statsuser");
                              setstatsbutton(button.originitem);
                            }}
                            after={
                              <Text weight="2">
                                {getvoting(votingset) != 0
                                  ? Math.round(
                                      (100 / getvoting(votingset)) *
                                        button[
                                          list.rows[votingset].active4 == true
                                            ? "staticall"
                                            : "static"
                                        ].length
                                    )
                                  : "0"}
                                %
                              </Text>
                            }
                            before={
                              <Text weight="2">
                                {getvoting(votingset) != 0
                                  ? Math.round(
                                      (100 / getvoting(votingset)) *
                                        button[
                                          list.rows[votingset].active4 == true
                                            ? "staticall"
                                            : "static"
                                        ].length
                                    )
                                  : "0"}
                                %
                              </Text>
                            }
                          >
                            {button.text}
                          </Button>
                        );
                      })}
                  </ButtonGroup>
                ) : (
                  "Кнопки отсутствуют"
                )}
              </FormItem>
              <FormItem>
                {usePlatform() === Platform.VKCOM ? (
                  <Button
                    onClick={() => {
                      downloadExcelFile(
                        list.rows[votingset].active4 == true
                          ? "staticall"
                          : "static",
                        list.rows[votingset].buttonotvet,
                        getvoting(votingset)
                      );
                    }}
                    stretched={true}
                    size="l"
                    appearance="positive"
                  >
                    Скачать итоги голосования в XLSX
                  </Button>
                ) : (
                  ""
                )}
              </FormItem>
            </React.Fragment>
          )}
      </ModalPage>

      <ModalPage
        id="voting"
        onClose={() => setActiveModal(null)}
        header={
          <ModalPageHeader
            after={
              <IconButton
                onClick={() => {
                  bridge.send("VKWebAppCopyText", {
                    text: list.rows[votingset].button_url,
                  });
                }}
              >
                <Icon28CopyOutline />
              </IconButton>
            }
            before={
              list.rows != null &&
              list.rows.length > 0 &&
              list.rows[votingset].active5 ? (
                <IconButton
                  onClick={() => {
                    setActiveModal("stats");
                    setActiveModalstats("voting");
                  }}
                >
                  <Icon28GraphOutline />
                </IconButton>
              ) : null
            }
          >
            Голосования
          </ModalPageHeader>
        }
      >
        {list.rows != null &&
          list.rows[votingset] != null &&
          fetchedUser != null && (
            <React.Fragment>
              <FormItem>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      backgroundImage: `url(${list.rows[votingset].urlphoto})`,
                      width: "100%",
                      height: "100px",
                      display: "block",
                      borderRadius: "10px",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  ></span>
                  <span className="app_widget_list_cover_gradient"></span>
                </div>
              </FormItem>
              <FormItem style={{ textAlign: "center" }} top="Название:">
                {list.rows[votingset].title}
              </FormItem>
              <FormItem style={{ textAlign: "center" }} top="Описание:">
                <div style={{ whiteSpace: "pre-line" }}>
                  {list.rows[votingset].text}
                </div>
              </FormItem>
              <FormItem
                style={{ textAlign: "center" }}
                top="Дополнительные условия голоса:"
              >
                {list.rows[votingset].active7 ||
                list.rows[votingset].active8 ||
                list.rows[votingset].sex ||
                list.rows[votingset].friendslimit ||
                list.rows[votingset].yearlimit ? (
                  <>
                    {list.rows[votingset].active7 && (
                      <>
                        Подписка на сообщество
                        <br />
                      </>
                    )}
                    {list.rows[votingset].active8 && (
                      <>
                        Верификация по паспорту
                        <br />
                      </>
                    )}
                    {list.rows[votingset].sex != null &&
                      list.rows[votingset].sex != 0 && (
                        <>
                          {sextabl[list.rows[votingset].sex].label} пол
                          <br />
                        </>
                      )}
                    {list.rows[votingset].friendslimit && (
                      <>
                        Ограничение по количеству друзей:{" "}
                        {list.rows[votingset].friendslimit}+
                        <br />
                      </>
                    )}
                    {list.rows[votingset].yearlimit && (
                      <>
                        Ограничение по возрасту:{" "}
                        {list.rows[votingset].yearlimit}+
                        <br />
                      </>
                    )}
                  </>
                ) : (
                  "Отсутствуют"
                )}
              </FormItem>
              <FormItem>
                <ButtonGroup align="center" mode="vertical" stretched={true}>
                  {list.rows[votingset].buttonotvet.map((button, i) => {
                    const image =
                      list.rows[votingset].active4 != true ? (
                        button.static.includes(String(fetchedUser.id)) ? (
                          <Icon24Done />
                        ) : null
                      ) : button.staticall.includes(String(fetchedUser.id)) ? (
                        <Icon24Done />
                      ) : null;

                    return (
                      <div
                        key={i}
                        style={{
                          width: "100%",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Button
                          size="l"
                          stretched={true}
                          before={image}
                          after={image}
                          style={{
                            backgroundColor: `rgb(${button.color.r}, ${button.color.g}, ${button.color.b}, ${button.color.a})`,
                          }}
                          key={i}
                          onClick={() => handleClickButton(votingset, i)}
                        >
                          {button.text}
                        </Button>
                        <Icon28InfoCircleOutline
                          className="iconbutton"
                          style={{
                            color: `rgb(${button.color.r}, ${button.color.g}, ${button.color.b}, ${button.color.a})`,
                          }}
                          onClick={() => {
                            setActiveModal("button");
                            setstatsbutton(i);
                          }}
                        />
                      </div>
                    );
                  })}
                </ButtonGroup>
              </FormItem>
            </React.Fragment>
          )}
      </ModalPage>
      <ModalPage
        id="votingset"
        onClose={() => {
          setActiveModal(null);
          savebutton();
        }}
        header={
          // Icon28CrossLargeOutline
          <ModalPageHeader
            after={
              /*<PanelHeaderClose
                onClick={() => {
                  setActiveModal(null);
                  list.rows.splice(votingset, 1);
                }}
              />*/
              <IconButton
                onClick={() => {
                  setActiveModal("deletedvoting");
                }}
              >
                <Icon28DeleteOutlineAndroid />
              </IconButton>
            }
            before={
              <IconButton
                onClick={() => {
                  setActiveModal("stats");
                  setActiveModalstats("votingset");
                }}
              >
                <Icon28GraphOutline />
              </IconButton>
            }
          >
            Настройка
          </ModalPageHeader>
        }
      >
        {list.rows != null && list.rows[votingset] != null && (
          <React.Fragment>
            <Group>
              <FormItem>
                <div style={{ position: "relative" }}>
                  <span
                    style={{
                      backgroundImage: `url(${list.rows[votingset].urlphoto})`,
                      width: "100%",
                      height: "100px",
                      display: "block",
                      borderRadius: "10px",
                      backgroundPosition: "center",
                      backgroundSize: "cover",
                    }}
                  ></span>
                  <span className="app_widget_list_cover_gradient"></span>
                  <span className="app_widget_list_cover_controls">
                    <object className="app_widget_list_cover_button">
                      <a className="FlatButton">
                        <span className="FlatButton__in">
                          <span className="FlatButton__content">
                            Голосовать
                          </span>
                        </span>
                      </a>
                    </object>
                    <span className="app_widget_list_cover_content">
                      <span className="app_widget_list_title">
                        {list.rows[votingset].title}
                      </span>
                      <span className="app_widget_list_info">
                        {" "}
                        {list.rows[votingset].active6
                          ? `${list.rows[votingset].time}`
                          : `${list.rows[votingset].text}`}
                      </span>
                    </span>
                  </span>
                </div>
              </FormItem>
              <FormItem status={errorstyletitle} top="Название голосования">
                <Input
                  id="exampleClickable1"
                  type="text"
                  placeholder="Название голосования"
                  defaultValue={
                    list.rows[votingset] == null
                      ? `Пусто`
                      : `${list.rows[votingset].title}`
                  }
                  onChange={handleNameVoting}
                />
              </FormItem>
              <FormItem status={errorstyletext} top="Описание голосования">
                <Textarea
                  id="exampleClickable2"
                  placeholder="Описание голосования"
                  defaultValue={
                    list.rows[votingset] == null
                      ? `Пусто`
                      : `${list.rows[votingset].text}`
                  }
                  onChange={handleTextVoting}
                />
              </FormItem>
              <FormItem top="Варианты ответов">
                <Group>
                  {list.rows[votingset].buttonotvet.map((button, i) => (
                    <div key={i} className="input-group">
                      <Button
                        style={{
                          backgroundColor: `rgba(${button.color.r}, ${button.color.g}, ${button.color.b}, ${button.color.a})`,
                        }}
                        className="inputbutton"
                        stretched={true}
                        size="l"
                        key={i}
                        onClick={() => {
                          setActiveModal("buttonset");
                          setstatsbutton(i);
                        }}
                      >
                        {button.text}
                      </Button>
                      <div
                        style={{
                          width: "20px",
                          height: "20px", // я хуй знает, но проценты не хотят работать
                          backgroundColor: `rgb(${button.color.r}, ${button.color.g}, ${button.color.b}, ${button.color.a})`,
                          border: "0.2vw solid #000",
                          borderRadius: "0.7vw",
                          cursor: "pointer",
                          marginTop: "4px",
                        }}
                        ref={(ref) => (pickerContainerRef.current[i] = ref)}
                      />
                      {showPicker[i] && (
                        <div
                          style={{
                            position: "absolute",
                            zIndex: "2",
                          }}
                        >
                          <SketchPicker
                            key={i}
                            color={button.color}
                            onChange={(color) => {
                              handleColorButton(color, i);
                            }}
                          />
                        </div>
                      )}
                      <Icon24CopyOutline
                        className="iconbutton"
                        style={{
                          color: `rgb(${button.color.r}, ${button.color.g}, ${button.color.b}, ${button.color.a})`,
                          marginTop: "4px",
                        }}
                        onClick={() =>
                          handleAddButton(list.rows[votingset].buttonotvet[i])
                        }
                      />
                    </div>
                  ))}
                  <br />
                  <ButtonGroup mode="horizontal" gap="s" stretched>
                    <Button
                      onClick={() => handleAddButton(null)}
                      appearance="positive"
                    >
                      Добавить
                    </Button>
                    <Button onClick={handleDeletedButton} appearance="negative">
                      Удалить
                    </Button>
                    <Button onClick={handleDeletedVoting}>
                      Обнулить голоса
                    </Button>
                  </ButtonGroup>
                </Group>
              </FormItem>
              <FormItem style={styles} top="Фото голосования">
                <Gallery
                  className="galleryphoto"
                  bullets={"light"}
                  showArrows
                  onChange={handleGallery}
                >
                  {listphoto.map((photo, i) => (
                    <img key={i} src={photo.urlphoto} />
                  ))}
                </Gallery>
                <br />
                <File
                  before={<Icon24Camera role="presentation" />}
                  size="l"
                  onChange={handleImageUpload}
                >
                  Загрузить фото
                </File>
                <p className="texterror">
                  Изображение должно быть 1530x384 (PNG/JPG)
                </p>
              </FormItem>
              <FormItem top="Настройки голосования">
                <Checkbox
                  id="checkbox1"
                  checked={
                    list.rows[votingset] == null
                      ? false
                      : Boolean(list.rows[votingset].active)
                  }
                  onChange={() => handleCheckboxChange(votingset, 1)}
                >
                  Скрыть
                </Checkbox>
                <Checkbox
                  id="checkbox2"
                  checked={
                    list.rows[votingset] == null
                      ? false
                      : Boolean(list.rows[votingset].active2)
                  }
                  onChange={() => handleCheckboxChange(votingset, 2)}
                >
                  Включён
                </Checkbox>
                <Checkbox
                  id="checkbox3"
                  checked={
                    list.rows[votingset] == null
                      ? false
                      : Boolean(list.rows[votingset].active3)
                  }
                  onChange={() => handleCheckboxChange(votingset, 3)}
                >
                  Включен в виджет
                </Checkbox>
                <Checkbox
                  id="checkbox4"
                  checked={
                    list.rows[votingset] == null
                      ? false
                      : Boolean(list.rows[votingset].active4)
                  }
                  onChange={() => handleCheckboxChange(votingset, 4)}
                >
                  Выбор нескольких вариантов ответов
                </Checkbox>
                <Checkbox
                  id="checkbox5"
                  checked={
                    list.rows[votingset] == null
                      ? false
                      : Boolean(list.rows[votingset].active5)
                  }
                  onChange={() => handleCheckboxChange(votingset, 5)}
                >
                  Отображение статистики для обычных пользователей
                </Checkbox>
                {/* <Checkbox
                  id="checkbox7"
                  checked={
                    list.rows[votingset] == null
                      ? false
                      : Boolean(list.rows[votingset].active7)
                  }
                  onChange={() => handleCheckboxChange(votingset, 7)}
                >
                  Голос только подписчикам
                </Checkbox> */}
                {/*<Checkbox
                  id="checkbox8"
                  checked={
                    list.rows[votingset] == null
                      ? false
                      : Boolean(list.rows[votingset].active8)
                  }
                  onChange={() => handleCheckboxChange(votingset, 8)}
                >
                  Сортировка кнопок
                </Checkbox>*/}
                <Checkbox
                  id="checkbox6"
                  checked={
                    list.rows[votingset] == null
                      ? false
                      : Boolean(list.rows[votingset].active6)
                  }
                  onChange={() => handleCheckboxChange(votingset, 6)}
                >
                  Ограничение по времени
                </Checkbox>
                {list.rows[votingset] != null &&
                  list.rows[votingset].active6 == true && (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <DateInput
                        value={datavalue}
                        onChange={handleВatetime}
                        showNeighboringMonth={true}
                        closeOnChange={true}
                        disablePast={true}
                        disablePickers={true}
                        after={null}
                      />
                      <p
                        style={{
                          color: "rgb(102, 96, 96)",
                          margin: "10px",
                        }}
                      >
                        в
                      </p>
                      <Select
                        name="h"
                        placeholder={selectType2}
                        onChange={(e) => {
                          const updatedList = { ...list };
                          updatedList.rows[votingset].time =
                            format(datavalue, "dd.MM.yyyy") +
                            " " +
                            e.target.value +
                            ":" +
                            selectType +
                            ":00";
                          setlist(updatedList);
                          setSelectType2(e.target.value);
                        }}
                        options={listh}
                        selectType={selectType2}
                      />
                      <p style={{ color: "rgb(102, 96, 96)", margin: "10px" }}>
                        :
                      </p>
                      <Select
                        name="m"
                        placeholder={selectType}
                        onChange={(e) => {
                          const updatedList = { ...list };
                          updatedList.rows[votingset].time =
                            format(datavalue, "dd.MM.yyyy") +
                            " " +
                            selectType2 +
                            ":" +
                            e.target.value +
                            ":00";

                          setlist(updatedList);
                          setSelectType(e.target.value);
                        }}
                        options={listm}
                        selectType={selectType}
                      />
                    </div>
                  )}
                <br />
                <Group>
                  <Button
                    size="l"
                    stretched
                    onClick={async () => {
                      /*await bridge
                        .send("VKWebAppGetAuthToken", {
                          app_id: appid,
                          scope: "stats",
                        })
                        .then((data) => {
                          console.log(data);
                          setlist((prevlist) => {
                            prevlist.rows[votingset].tokengroup -
                              data.access_token;
                          });
                          setActiveModal("settingsvote");
                        })
                        .catch((error) => {
                          console.log(error);
                        });*/
                      setActiveModal("settingsvote");
                    }}
                  >
                    Настройка условий голоса
                  </Button>
                </Group>
              </FormItem>
            </Group>
          </React.Fragment>
        )}
      </ModalPage>
      <ModalPage
        id="infoapp"
        onClose={() => setActiveModal(null)}
        header={<ModalPageHeader>Описание приложения</ModalPageHeader>}
      >
        <FormItem>
          Данное приложение является системой голосования с возможностью
          разместить эти голосования в виджет группы.
          <br />
          <br />
          Возможности:
          <br />
          1. Создание голосования без труда благодаря интуитивному интерфейсу.
          😊
          <br />
          2. Персонализация стиля, цвета и вопросов для идеального соответствия
          вашим потребностям. 🎨
          <br />
          3. Поддерживаются разные типы голосований, включая одиночный и
          множественный выбор. 🔄
          <br />
          4. Получайте качественные и детальные данные об итогах голосования. 📈
          <br />
          5. Подойдет к любой группе! 🌐
          <br />
          6. Ваши данные защищены с соблюдением стандартов безопасности. 🔒
          <br />
          7. Возможность отображения голосования в виджете сообщества. 💣
          <br />
          8. Возможность ставить условия для голоса. Таким образом можно
          избежать полностью накрутку и ботов. 👩🏻‍💻
          <br />
          <br />
          <Link
            target="_blank"
            href="https://www.donationalerts.com/r/ShishkinBlasthk"
          >
            DonatAlerts 💰
          </Link>
          <br />
          <Link target="_blank" href="https://vk.com/shishkin666">
            Разработчик 👨‍💻
          </Link>
          <br />
          <Link target="_blank" href="https://t.me/AlexMuchoGusto">
            Дизайнер 🎨
          </Link>
          <br />
          <Link
            target="_blank"
            href="https://github.com/eftsoons/WidgetVoting.git"
          >
            Github 🚀
          </Link>
        </FormItem>
      </ModalPage>
      <ModalPage
        id="infoset"
        onClose={() => setActiveModal(null)}
        header={<ModalPageHeader>Описание настроек</ModalPageHeader>}
      >
        <FormItem>
          Доступные настройки:
          <br />
          1. Названия.
          <br />
          2. Описания.
          <br />
          3. Полная и безграничная настройка ответов.
          <br />
          4. Фото голосования (Обязательно 1530x384, PNG/JPG).
          <br />
          5. Видимость голосования.
          <br />
          6. Начало работы голосования.
          <br />
          7. Режим нескольких ответов.
          <br />
          8. Отображение статистики.
          <br />
          9. Ограничение по времени.
          <br />
          <br />
          Возможные причины ошибки сохранения виджета:
          <br />
          1. Виджет состоит из менее 1 голосования.
          <br />
          2. Виджет состоит из более 3 голосований.
          <br />
          3. Вы пытаетесь флудить отправкой обновления виджета.
          <br />
          4. Приложение не установлено в сообществе.
        </FormItem>
      </ModalPage>
      <ModalPage
        id="setwidget"
        onClose={() => setActiveModal(null)}
        header={<ModalPageHeader>Тип виджета</ModalPageHeader>}
      >
        <FormItem>
          <ButtonGroup mode="vertical" gap="s" stretched>
            <Button
              onClick={() => savewidget(1)}
              stretched
              size="l"
              mode="primary"
            >
              Виджет с покрытием
            </Button>
            <Button
              onClick={() => savewidget(2)}
              stretched
              size="l"
              mode="primary"
            >
              Компактный виджет
            </Button>
            <Button
              onClick={() => savewidget(3)}
              stretched
              size="l"
              mode="primary"
            >
              Виджет
            </Button>
          </ButtonGroup>
        </FormItem>
      </ModalPage>
      <ModalPage
        id="settingsvote"
        onClose={() => setActiveModal("votingset")}
        header={<ModalPageHeader>Настройка условий</ModalPageHeader>}
      >
        {list.rows != null && list.rows[votingset] != null && (
          <React.Fragment>
            <FormItem>
              <Checkbox
                id="checkbox7"
                checked={
                  list.rows[votingset] == null
                    ? false
                    : Boolean(list.rows[votingset].active7)
                }
                onChange={async () => handleCheckboxChange(votingset, 7)}
              >
                Голос только подписчикам
              </Checkbox>
              <Checkbox
                id="checkbox8"
                checked={
                  list.rows[votingset] == null
                    ? false
                    : Boolean(list.rows[votingset].active8)
                }
                onChange={async () => handleCheckboxChange(votingset, 8)}
              >
                Голос только верифицированному пользователю паспортом
              </Checkbox>
            </FormItem>
            <FormItem
              top={`Ограничение по количеству друзей: ${
                list.rows[votingset].friendslimit
                  ? `${list.rows[votingset].friendslimit}+`
                  : "отсутствует"
              }`}
            >
              <Slider
                min={1}
                max={500}
                step={1}
                value={
                  list.rows[votingset].friendslimit
                    ? list.rows[votingset].friendslimit
                    : 1
                }
                aria-labelledby="basic"
                onChange={(e) =>
                  setlist((prevlist) => {
                    if (e > 1) {
                      prevlist.rows[votingset].friendslimit = e;
                    } else {
                      prevlist.rows[votingset].friendslimit = false;
                    }
                    return prevlist;
                  })
                }
              />
            </FormItem>
            <FormItem
              top={`Ограничение по возрасту: ${
                list.rows[votingset].yearlimit
                  ? `${list.rows[votingset].yearlimit}+`
                  : "отсутствует"
              }`}
            >
              <Slider
                min={1}
                max={50}
                step={1}
                value={
                  list.rows[votingset].yearlimit
                    ? list.rows[votingset].yearlimit
                    : 1
                }
                aria-labelledby="basic"
                onChange={(e) =>
                  setlist((prevlist) => {
                    if (e > 1) {
                      prevlist.rows[votingset].yearlimit = e;
                    } else {
                      prevlist.rows[votingset].yearlimit = false;
                    }
                    return prevlist;
                  })
                }
              />
            </FormItem>
            <FormItem top="Пол">
              <CustomSelect
                name="select"
                placeholder={
                  sextabl[
                    list.rows[votingset].sex ? list.rows[votingset].sex : 0
                  ].label
                }
                options={sextabl}
                onChange={(e) => {
                  setlist((prevlist) => {
                    prevlist.rows[votingset].sex = Number(e.target.value);
                    return prevlist;
                  });
                }}
              />
            </FormItem>
          </React.Fragment>
        )}
      </ModalPage>
    </ModalRoot>
  );

  return (
    <SplitLayout modal={modal} popout={popout}>
      {snackbar}
      {list.rows != null && (
        <React.Fragment>
          <Root activeView={activePanel}>
            <View activePanel="panel1" id="panel1">
              <Panel id="panel1">
                <PanelHeader
                  before={
                    <>
                      <IconButton onClick={() => NextPanel("settings")}>
                        <Icon28SettingsOutline />
                      </IconButton>
                      <IconButton onClick={() => setActiveModal("infoapp")}>
                        <Icon28InfoOutline />
                      </IconButton>
                    </>
                  }
                ></PanelHeader>
                {list.rows.filter((voting) => !voting.active).length > 0 ? (
                  <>
                    <Group>
                      {/*<img
                        style={{
                          width: "100%",
                          height: "10vh",
                          borderRadius: "20px",
                          border: "2px double",
                          borderColor: "red",
                          marginBottom: "1%",
                        }}
                        src="https://sun1-84.userapi.com/ZHfzxTbuxltx50vs-jQlygsyDHxic3p55a4lTg/M3CoYsnXzgk.jpg"
                      ></img>*/}

                      {list.rows
                        .filter((voting) => !voting.active)
                        .map((voting, i) => (
                          <SimpleCell
                            subtitle={`Проголосовало: ${getvoting(i)} человек`}
                            key={i}
                            before={
                              voting.urlphoto != null ? (
                                <Avatar size={48} src={voting.urlphoto} />
                              ) : (
                                <Avatar
                                  size={48}
                                  fallbackIcon={<Icon28PictureOutline />}
                                  src="#"
                                />
                              )
                            }
                            onClick={() => {
                              if (voting.active2) {
                                setvoting(i);
                                setActiveModal("voting");
                              } else {
                                setSnackbar(
                                  <Snackbar
                                    onClose={() => setSnackbar(null)}
                                    before={
                                      <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
                                    }
                                  >
                                    Недоступно
                                  </Snackbar>
                                );
                              }
                            }}
                            after={voting.active2 ? "" : "Недоступно"}
                          >
                            {voting.title}
                          </SimpleCell>
                        ))}
                    </Group>
                  </>
                ) : (
                  <>
                    <div style={{ textAlign: "center" }}>
                      <FormItem>
                        <h1>Список голосований пуст.</h1>
                        <p>
                          Для добавления голосования нажмите на кнопку
                          настройки.
                        </p>
                      </FormItem>
                      <FormItem>
                        <Button
                          onClick={() => NextPanel("settings")}
                          stretched
                          size="l"
                          mode="primary"
                          appearance="positive"
                        >
                          Настройки
                        </Button>
                      </FormItem>
                    </div>
                  </>
                )}
              </Panel>
            </View>
            <View activePanel="panel2" id="panel2">
              <Panel id="panel2">
                <PanelHeader
                  before={
                    <>
                      <IconButton onClick={() => NextPanel("panel1")}>
                        <Icon28ListOutline />
                      </IconButton>
                      <IconButton onClick={() => setActiveModal("infoset")}>
                        <Icon28InfoOutline />
                      </IconButton>
                      {/* <IconButton onClick={() => setActiveModal("infoapp")}>
                        <Icon28PaletteOutline />
                  </IconButton> */}
                    </>
                  }
                >
                  {/*Тип виджета - 123 */}
                </PanelHeader>
                <Group>
                  {list.rows.map((voting, i) => {
                    return (
                      <SimpleCell
                        subtitle={`Проголосовало: ${getvoting(i)} человек`}
                        key={i}
                        before={
                          voting.urlphoto != null ? (
                            <Avatar size={48} src={voting.urlphoto} />
                          ) : (
                            <Avatar
                              size={48}
                              fallbackIcon={<Icon28PictureOutline />}
                              src="#"
                            />
                          )
                        }
                        onClick={() => {
                          setActiveModal("votingset");
                          setvoting(i);
                          seterrorcolor(null);
                          //await votinglist(); если будут жалобы - сделать
                          if (voting.time != null) {
                            datasetValue(
                              () =>
                                new Date(
                                  voting.time.split(".")[2].split(" ")[0],
                                  voting.time.split(".")[1] - 1,
                                  voting.time.split(".")[0],
                                  voting.time.split(":")[0].split(" ")[1],
                                  voting.time.split(":")[1],
                                  voting.time.split(":")[2]
                                )
                            );
                            setSelectType2(
                              voting.time.split(":")[0].split(" ")[1]
                            );
                            setSelectType(voting.time.split(":")[1]);
                          } else {
                            const e = new Date();
                            list.rows[votingset].time = format(
                              e,
                              "dd.MM.yyyy HH:mm:00"
                            );
                            setSelectType2(format(new Date(), "HH"));
                            setSelectType(format(new Date(), "mm"));
                            datasetValue(e);
                            setlist(list);
                          }
                        }}
                      >
                        {voting.title}
                      </SimpleCell>
                    );
                  })}
                  <Div>
                    <ButtonGroup mode="horizontal" gap="s" stretched>
                      <Button
                        onClick={() => {
                          list.rows.push({
                            title: "Голосование " + (list.rows.length + 1),
                            button: "Голосовать",
                            button_url:
                              "https://vk.com/app51824047_-" +
                              groupid +
                              "#" +
                              groupid +
                              "_" +
                              list.rows.length,
                            url:
                              "https://vk.com/app51824047_-" +
                              groupid +
                              "#" +
                              groupid +
                              "_" +
                              list.rows.length,
                            descr: null,
                            time: format(new Date(), "dd.MM.yyyy HH:mm:ss"),
                            text: "Описание голосования",
                            active: false,
                            active2: false,
                            active3: false,
                            active4: false,
                            active5: false,
                            active6: false,
                            active7: false,
                            /*active8: false,*/
                            cover_id: "51824047_2460869",
                            urlphoto:
                              "https://sun1-91.userapi.com/fU9xHe6hOhaPC1Cpi4--UNaqqjtFe_-R7gK4KQ/L9SwXxs_gzY.jpg",
                            buttonotvet: [
                              {
                                static: [],
                                staticall: [],
                                color: { r: 63, g: 167, b: 52, a: 1 },
                                text: "За",
                              },
                              {
                                static: [],
                                staticall: [],
                                color: { r: 191, g: 35, b: 35, a: 1 },
                                text: "Против",
                              },
                            ],
                          });
                          setlist(list);
                          setvoting(list.rows.length - 1);
                          datasetValue(() => new Date());
                          setSelectType2(format(new Date(), "HH"));
                          setSelectType(format(new Date(), "mm"));
                          setActiveModal("votingset");
                        }}
                        stretched
                        size="l"
                        mode="primary"
                        appearance="positive"
                      >
                        Добавить
                      </Button>
                      <Button
                        onClick={() => setActiveModal("setwidget")}
                        stretched
                        size="l"
                        mode="primary"
                      >
                        Обновить
                      </Button>
                    </ButtonGroup>
                  </Div>
                </Group>
              </Panel>
            </View>
          </Root>
        </React.Fragment>
      )}
    </SplitLayout>
  );
};

export default Main;
