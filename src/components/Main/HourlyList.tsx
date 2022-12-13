import React, { useContext } from "react";
import { GeneralContext } from "../../context/general-context";
import { WeatherContext } from "../../context/weather-context";

import waterDrop from "../../assets/icons/water.png";
import snowFlake from "../../assets/icons/snow.png";
import arrow from "../../assets/icons/arrow.png";
import styles from "./HourlyList.module.css";
import Scrollbars from "react-custom-scrollbars-2";
import { useLocation } from "react-router-dom";

const timeFormat = new Intl.DateTimeFormat("en-UK", {
  timeStyle: "short",
});
const dateFormat = new Intl.DateTimeFormat("en-UK", {
  weekday: "long",
  day: "numeric",
  month: "short",
});

const HourlyList = () => {
  const generalCtx = useContext(GeneralContext);
  const weatherCtx = useContext(WeatherContext);
  const location = useLocation();

  const handleClick = (e: React.MouseEvent) => {
    if (e.target instanceof HTMLElement) {
      const key = e.target.closest(`.${styles.item}`)?.getAttribute("data-key");
      if (key) {
        weatherCtx.setSelectedIndex(parseInt(key));
      }
    }
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <Scrollbars
        autoHide
        autoHeight
        autoHeightMin={0}
        autoHeightMax={"100%"}
        renderThumbVertical={({ style, ...props }) => (
          <div
            {...props}
            style={{
              ...style,
              backgroundColor: "rgba(255,255,255, 0.2)",
              borderRadius: "100vw",
              width: "10px",
              right: "5px",
            }}
          />
        )}
      >
        {weatherCtx.weatherData.hourly.map((el: any, i: number) => {
          return (
            <>
              {i === 0 ||
              new Date(
                weatherCtx?.weatherData?.hourly[i - 1]?.dt * 1000
              ).getDate() !== new Date(el?.dt * 1000).getDate() ? (
                <div className={styles.dayItem} key={el.dt}>
                  {dateFormat.format(el.dt * 1000)}
                </div>
              ) : (
                ""
              )}

              <div
                className={`${styles.item} ${
                  location.pathname.includes("hourly") &&
                  weatherCtx.selectedIndex === i
                    ? styles.selected
                    : ""
                }`}
                key={i}
                data-key={i}
                tabIndex={0}
              >
                <div className={styles.hour}>
                  {timeFormat.format(el.dt * 1000)}
                </div>
                <div className={styles.temperature}>
                  {generalCtx.units.temperature === "c"
                    ? Math.round(el.temp)
                    : Math.round((el.temp / 5) * 9 + 32)}
                  &#176;
                </div>
                <div className={styles.weather}>
                  <img
                    src={`/weather-icons/${el.weather[0].icon}.png`}
                    alt=""
                  />
                  <p>{el.weather[0].main}</p>
                </div>
                <div className={styles.right}>
                  <div className={styles.precipitation}>
                    <img
                      src={
                        (el.snow?.["1h"] && !el.rain?.["1h"]) ||
                        el.snow?.["1h"] > el.rain?.["1h"]
                          ? snowFlake
                          : waterDrop
                      }
                      alt={
                        (el.snow?.["1h"] && !el.rain?.["1h"]) ||
                        el.snow?.["1h"] > el.rain?.["1h"]
                          ? "snow"
                          : "rain"
                      }
                    />
                    <p>{Math.round(el.pop * 100)}%</p>
                  </div>
                  <div className={styles.wind}>
                    <img
                      src={arrow}
                      style={{ transform: `rotate(${el.wind_deg + 180}deg)` }}
                      alt={`wind direction: ${el.wind_deg + 180} degrees`}
                    />
                    <p>
                      {generalCtx.units.wind === "kph"
                        ? `${Math.round(el.wind_speed)} km/h`
                        : `${Math.round(el.wind_speed / 1.609344)} mph`}
                    </p>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </Scrollbars>
    </div>
  );
};

export default HourlyList;
