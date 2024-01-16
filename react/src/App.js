import React, { useState, useEffect } from "react";
import axios from "axios";

import "./App.css";
import Main from "./panels/Main.js";
import Info from "./panels/Info.js";

import {
  ScreenSpinner,
  AdaptivityProvider,
  AppRoot,
  ConfigProvider,
  SplitLayout,
  SplitCol,
  View,
  Snackbar,
} from "@vkontakte/vkui";
import "@vkontakte/vkui/dist/vkui.css";

import { Icon28ErrorCircleOutline } from "@vkontakte/icons";

const App = () => {
  const [popout, setPopout] = useState(<ScreenSpinner size="large" />);
  const [groupid, setgroupid] = useState(0);
  const [list, setlist] = useState({});
  const [snackbar, setSnackbar] = useState(null);
  const location = window.location;

  const isDefaultState =
    location.hash === "" &&
    Number(new URLSearchParams(location.search).get("vk_group_id")) === 0;

  const defaultActivePanel = isDefaultState ? "Info" : "Main";
  const [activePanel, setActivePanel] = useState(defaultActivePanel);
  const [votingset, setvoting] = useState(0);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    function getgroup() {
      if (location.hash != "") {
        setgroupid(Number(location.hash.split("#")[1].split("_")[0]));
      } else {
        setgroupid(
          Number(new URLSearchParams(location.search).get("vk_group_id"))
        );
      }
      setPopout(null);
    }

    async function getinfo() {
      try {
        const response = await axios.post(
          "https://www.vpn.svetafe8.beget.tech/",
          {
            sign: location.origin + location.search,
            hash: location.hash,
          },
          {
            headers: {
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );
        if (response.data != "error") {
          setlist(response.data);
          /*setTimeout(() => {
          if (
            response.data.rows != null &&
            response.data.rows.length > 0 &&
            location.hash != ""
          ) {
            const numbervoting = location.hash.split("#")[1].split("_")[1];
            if (
              response.data.rows[numbervoting] != null &&
              response.data.rows[numbervoting].active2
            ) {
              setvoting(numbervoting);
              setActiveModal("voting");
            }
          }
        }, 300);*/

          setTimeout(() => {
            const isVotingCondition = location.hash !== "";
            const defaultVoting = isVotingCondition
              ? Number(location.hash.split("#")[1].split("_")[1])
              : 0;

            const defaultVoting2 =
              response.data.rows[defaultVoting] != null ? defaultVoting : 0;

            setvoting(defaultVoting2);
            setActiveModal(isVotingCondition ? "voting" : null);
          }, 300);
        }
      } catch (error) {
        console.log(error);
        setActivePanel("Info");
        setSnackbar(
          <Snackbar
            onClose={() => setSnackbar(null)}
            before={
              <Icon28ErrorCircleOutline fill="var(--vkui--color_icon_negative)" />
            }
          >
            Ошибка подключения к серверу.
          </Snackbar>
        );
      }
      setPopout(null);
    }

    getinfo();
    getgroup();
  }, []);

  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <AppRoot>
          <SplitLayout popout={popout}>
            {snackbar}
            <SplitCol>
              <View activePanel={activePanel}>
                <Main
                  id="Main"
                  location={location}
                  groupid={groupid}
                  list={list}
                  setlist={setlist}
                  votingset={votingset}
                  setvoting={setvoting}
                  activeModal={activeModal}
                  setActiveModal={setActiveModal}
                />
                <Info id="Info" />
              </View>
            </SplitCol>
          </SplitLayout>
        </AppRoot>
      </AdaptivityProvider>
    </ConfigProvider>
  );
};

export default App;
