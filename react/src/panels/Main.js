import React, { useState, useEffect, useRef } from "react";
import bridge from "@vkontakte/vk-bridge";
import axios from "axios";
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
  Text,
  Select,
  Root,
} from "@vkontakte/vkui";

import {
  Icon28InfoOutline,
  Icon28SettingsOutline,
  Icon28ListOutline,
  Icon28ErrorCircleOutline,
  Icon24CalendarOutline,
  Icon24Camera,
  Icon16Clear,
  Icon28PictureOutline,
  Icon28GraphOutline,
  Icon28DeleteOutlineAndroid,
  Icon28Done,
  Icon24Done,
  Icon28CopyOutline,
} from "@vkontakte/icons";

const Main = ({
  location,
  groupid,
  list,
  setlist,
  votingset,
  setvoting,
  activeModal,
  setActiveModal,
}) => {
  const [fetchedUser, setUser] = useState(null);
  const appid = 51824047;
  const [tokengroup, settokengroup] = useState(null);
  const [activePanel, setActivePanel] = useState("panel1");
  const [snackbar, setSnackbar] = useState(null);
  const [popout, setPopout] = useState(<ScreenSpinner size="large" />);
  const [activeModalstats, setActiveModalstats] = useState(null);
  const [datavalue, datasetValue] = useState(() => new Date());
  const [errorcolor, seterrorcolor] = useState(null);
  const [showPicker, setShowPicker] = useState([]);
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

  const pickerContainerRef = useRef([]);

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

      if (clickedIndex !== -1) {
        handlePickerToggle(clickedIndex);
      } else {
        if (!event.target.closest(".sketch-picker ")) {
          const updatedList = [...showPicker];
          updatedList.map((value, i) => {
            updatedList[i] = false;
          });
          setShowPicker(updatedList);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  async function widgettoken() {
    try {
      const tokeninfo = await bridge.send("VKWebAppStorageGet", {
        keys: ["token_" + groupid],
      });

      if (tokeninfo.keys[0].value == "") {
        const response = await bridge.send("VKWebAppGetCommunityToken", {
          app_id: appid,
          group_id: groupid,
          scope: "app_widget",
        });

        const checkprava = await bridge.send("VKWebAppCallAPIMethod", {
          method: "groups.getTokenPermissions",
          params: {
            v: "5.131",
            access_token: response.access_token,
          },
        });

        if (checkprava.response.mask == 0) {
          return false;
        } else {
          await bridge.send("VKWebAppStorageSet", {
            key: "token_" + groupid,
            value: response.access_token,
          });

          return response.access_token;
        }
      } else {
        const checkprava = await bridge.send("VKWebAppCallAPIMethod", {
          method: "groups.getTokenPermissions",
          params: {
            v: "5.131",
            access_token: tokeninfo.keys[0].value,
          },
        });

        if (checkprava.response.mask == 0) {
          await bridge.send("VKWebAppStorageSet", {
            key: "token_" + groupid,
            value: "",
          });
          return false;
        } else {
          return tokeninfo.keys[0].value;
        }
      }
    } catch (error) {
      console.log(error);
      await bridge.send("VKWebAppStorageSet", {
        key: "token_" + groupid,
        value: "",
      });
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={
            <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
          }
        >
          Необходим токен для обновления виджета
        </Snackbar>
      );
      return false;
    }
  }

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
      "https://www.vpn.svetafe8.beget.tech/admin",
      {
        sign: location.origin + location.search,
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

  const handleAddButton = () => {
    const newList = [...list.rows];
    newList[votingset].buttonotvet.push({
      static: [],
      staticall: [],
      color: "#FF0000",
      text: "Кнопка " + (newList[votingset].buttonotvet.length + 1),
    });
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

  const handleNameButton = (e, i) => {
    const newList = [...list.rows];
    if (
      e.target.value.length > 0 &&
      e.target.value.length < 40 &&
      e.target.value.trim() !== ""
    ) {
      newList[votingset].buttonotvet[i].text = e.target.value;
      setlist({ ...list, rows: newList });
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

          const response = await axios.post(
            "https://www.vpn.svetafe8.beget.tech/vkphotoapp",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

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

  const [selectType, setSelectType] = useState("00");
  const [selectType2, setSelectType2] = useState("00");

  async function savebutton() {
    const response = await axios.post(
      "https://www.vpn.svetafe8.beget.tech/set",
      {
        sign: location.origin + location.search,
        tabl: JSON.stringify(list),
      },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );
    if (response != "error") {
      <Snackbar
        onClose={() => setSnackbar(null)}
        before={
          <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
        }
      >
        Ошибка
      </Snackbar>;
    } else {
      setSnackbar(
        <Snackbar
          onClose={() => setSnackbar(null)}
          before={<Icon28Done fill="var(--vkui--color_icon_positive)" />}
        >
          Голосования успешно сохранены
        </Snackbar>
      );
    }
  }

  async function savewidget() {
    try {
      const listzaliv = {
        title: "Голосование",
        rows: [],
        more: "Приложение",
        more_url: "https://vk.com/app51824047",
      };

      list.rows.map((time) => {
        time.active6
          ? (time.descr = `${time.time}`)
          : (time.descr = `${time.text}`);

        if (time.active3) {
          listzaliv.rows.push(time);
        }
      });

      list.rows.map((url, i) => {
        url.button_url =
          "https://vk.com/app51824047_-" + groupid + "#" + groupid + "_" + i;
        url.url =
          "https://vk.com/app51824047_-" + groupid + "#" + groupid + "_" + i;
      });

      listzaliv.rows.map((url, i) => {
        url.button_url =
          "https://vk.com/app51824047_-" + groupid + "#" + groupid + "_" + i;
        url.url =
          "https://vk.com/app51824047_-" + groupid + "#" + groupid + "_" + i;
      });

      await bridge
        .send("VKWebAppShowCommunityWidgetPreviewBox", {
          group_id: groupid,
          type: "cover_list",
          code: "return " + JSON.stringify(listzaliv) + ";",
        })
        .then((data) => {
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
                  Ни одно голосование не добавлено в виджет. Или их больше трёх
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

  function isHtml(text) {
    var doc = new DOMParser().parseFromString(text, "text/html");
    return doc.body.childElementCount > 0;
  }

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
    }
  };

  const handleTextVoting = (e) => {
    const updatedList = { ...list };
    if (
      e.target.value.length > 0 &&
      e.target.value.length < 101 &&
      e.target.value.trim() !== "" &&
      !isHtml(e.target.value)
    ) {
      list.rows[votingset].text = e.target.value;
      setlist(updatedList);
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

  async function handleClickButton(numbervoting, number) {
    const response = await axios.post(
      "https://www.vpn.svetafe8.beget.tech/clickbutton",
      {
        sign: location.origin + location.search,
        voting: numbervoting,
        number: number,
        click: list.rows[numbervoting].active4,
      },
      {
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      }
    );

    setlist(response.data);
  }

  const listh = Array.from({ length: 24 }, (_, index) => ({
    label: index.toString().padStart(2, "0"), // Применяем padStart для добавления ведущего нуля
    value: index.toString().padStart(2, "0"),
  }));

  const listm = Array.from({ length: 60 }, (_, index) => ({
    label: index.toString().padStart(2, "0"),
    value: index.toString().padStart(2, "0"), // Заменил 'key' на 'value'
  }));

  const modal = (
    <ModalRoot activeModal={activeModal}>
      <ModalPage
        id="stats"
        onClose={async () => {
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
                top="Всего участников в голосовании"
              >
                {`${
                  list.rows[votingset].active4 === true
                    ? list.rows[votingset].buttonotvet.reduce(
                        (uniqueSet, button) => {
                          button.staticall.forEach((item) =>
                            uniqueSet.add(item)
                          );
                          return uniqueSet;
                        },
                        new Set()
                      ).size
                    : list.rows[votingset].buttonotvet.reduce(
                        (total, button) => total + button.static.length,
                        0
                      )
                } человек`}
              </FormItem>
              <FormItem style={{ textAlign: "center" }} top="Выбор участников">
                {list.rows[votingset].buttonotvet.length > 0 ? (
                  <ButtonGroup align="center" mode="vertical" stretched={true}>
                    {list.rows[votingset].buttonotvet.map((button, i) => (
                      <Button
                        size="l"
                        stretched={true}
                        before={
                          <Text weight="2">
                            {list.rows[votingset].active4 === true
                              ? button.staticall.length
                              : button.static.length}
                          </Text>
                        }
                        after={
                          <Text weight="2">
                            {list.rows[votingset].active4 === true
                              ? button.staticall.length
                              : button.static.length}
                          </Text>
                        }
                        style={{
                          backgroundColor: `rgb(${button.color.r}, ${button.color.g}, ${button.color.b}, ${button.color.a})`,
                        }}
                        key={i}
                      >
                        {button.text}
                      </Button>
                    ))}
                  </ButtonGroup>
                ) : (
                  "Кнопки отсутствуют"
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
              <FormItem>
                <ButtonGroup align="center" mode="vertical" stretched={true}>
                  {list.rows[votingset].buttonotvet.map((button, i) => {
                    const image =
                      list.rows[votingset].active4 != true ? (
                        button.static.includes(String(fetchedUser.id)) ? (
                          <Icon24Done />
                        ) : (
                          ""
                        )
                      ) : button.staticall.includes(String(fetchedUser.id)) ? (
                        <Icon24Done />
                      ) : (
                        ""
                      );

                    return (
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
                  setActiveModal(null);
                  list.rows.splice(votingset, 1);
                  setvoting(0);
                  savebutton();
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
              <FormItem top="Название голосования">
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
              <FormItem top="Описание голосования">
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
                {list.rows[votingset].buttonotvet.map((button, i) => (
                  <div key={i} className="input-group">
                    <Input
                      className="inputbutton"
                      id={i}
                      placeholder="Название кнопки"
                      defaultValue={
                        list.rows[votingset] == null
                          ? `Пусто`
                          : `${button.text}`
                      }
                      onChange={(e) => {
                        handleNameButton(e, i);
                      }}
                      /*after={
                        <IconButton onClick={() => handleDeletedButton(i)}>
                          <Icon16Clear /> ПОЧЕМУ ОНО НЕ РАБОТАЕТ, ЧИСТО ВИЗУАЛЬНО ЗАЛУПА ПОЛУЧАЕТСЯ
                        </IconButton>
                      }*/
                    />
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
                  </div>
                ))}
                <br />
                <ButtonGroup mode="horizontal" gap="s" stretched>
                  <Button onClick={handleAddButton} appearance="positive">
                    Добавить
                  </Button>
                  <Button onClick={handleDeletedButton} appearance="negative">
                    Удалить
                  </Button>
                </ButtonGroup>
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
        header={<ModalPageHeader>Доступные настройки</ModalPageHeader>}
      >
        <FormItem>
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
        </FormItem>
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
                {list.rows.length > 0 ? (
                  <>
                    {list.rows
                      .filter((voting) => !voting.active)
                      .map((voting, i) => (
                        <SimpleCell
                          subtitle={`Проголосовало: ${
                            voting.active4
                              ? voting.buttonotvet.reduce(
                                  (uniqueSet, button) => {
                                    button.staticall.forEach((item) =>
                                      uniqueSet.add(item)
                                    );
                                    return uniqueSet;
                                  },
                                  new Set()
                                ).size
                              : voting.buttonotvet.reduce(
                                  (total, button) =>
                                    total + button.static.length,
                                  0
                                )
                          } человек`}
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
                  </>
                ) : (
                  <>
                    <div style={{ textAlign: "center" }}>
                      <FormItem>
                        <h1>Список голосований пуст.</h1>
                        <p>
                          Для добавления голосования нажмите на кнопку настройки
                          и подтвердите запрос на токен вашей группы при
                          обновлении виджета.
                        </p>
                        <p>Иначе приложение не сможет обновить ваш виджет.</p>
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
                    </>
                  }
                ></PanelHeader>
                {list.rows.map((voting, i) => {
                  return (
                    <SimpleCell
                      subtitle={`Проголосовало: ${
                        voting.active4 === true
                          ? voting.buttonotvet.reduce((uniqueSet, button) => {
                              button.staticall.forEach((item) =>
                                uniqueSet.add(item)
                              );
                              return uniqueSet;
                            }, new Set()).size
                          : voting.buttonotvet.reduce(
                              (total, button) => total + button.static.length,
                              0
                            )
                      } человек`}
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
                      onClick={async () => {
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
                          cover_id: "51824047_2460869",
                          urlphoto:
                            "https://sun1-91.userapi.com/fU9xHe6hOhaPC1Cpi4--UNaqqjtFe_-R7gK4KQ/L9SwXxs_gzY.jpg",
                          buttonotvet: [
                            {
                              static: [],
                              staticall: [],
                              color: { r: 0, g: 255, b: 0, a: 1 },
                              text: "За",
                            },
                            {
                              static: [],
                              staticall: [],
                              color: { r: 255, g: 0, b: 0, a: 1 },
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
                      onClick={() => savewidget()}
                      stretched
                      size="l"
                      mode="primary"
                    >
                      Обновить
                    </Button>
                  </ButtonGroup>
                </Div>
              </Panel>
            </View>
          </Root>
        </React.Fragment>
      )}
    </SplitLayout>
  );
};

// Уникальный id - {setuser}
//list.body.push([{ text: "asd" }, { text: "3000 баллов" }]
export default Main;
