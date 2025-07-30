import bridge from "@vkontakte/vk-bridge";

import { Gallery, FormItem, Button, ButtonGroup } from "@vkontakte/vkui";
import { usePlatform } from "@vkontakte/vkui";

import screen from "./screen.webp";
import screen1 from "./screen2.webp";
import screen2 from "./screen3.webp";
import "./Info.css";

const Info = () => {
  const platform = usePlatform();
  //platform == "vkcom" ? screen2 : screen6
  return (
    <div className="Info">
      <br />
      <h1>Голосования в виджетах</h1>
      <p>
        С помощью нашего приложения вы сможете перенести голосования в виджет.
      </p>
      <p>
        Тем самым вы улучшите опыт использования вашей группы и поднимете ей
        активность.
      </p>
      <p>
        Только с нашей системой вы сможете избавиться от ботов через условия
        голоса.
      </p>
      <h4>Скриншот виджета</h4>
      <img
        className={platform == "vkcom" ? "screen2" : "screen4"}
        src={screen}
      />
      <FormItem>
        <ButtonGroup align="center" mode="horizontal" stretched={true}>
          <Button
            onClick={() =>
              window.open(
                "https://vk.com/widgetvoting",
                "_blank",
                "noopener,noreferrer"
              )
            }
            stretched
            size="l"
            mode="primary"
          >
            Пример
          </Button>
          <Button
            onClick={() => bridge.send("VKWebAppAddToCommunity")}
            stretched
            size="l"
            mode="primary"
          >
            Добавить
          </Button>
        </ButtonGroup>
      </FormItem>
    </div>
  );
};

export default Info;
