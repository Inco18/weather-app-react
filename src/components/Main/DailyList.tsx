import React, { useContext } from "react";
import { GeneralContext } from "../../context/general-context";
import { WeatherContext } from "../../context/weather-context";

import waterDrop from "../../assets/icons/water.png";
import snowFlake from "../../assets/icons/snow.png";
import arrow from "../../assets/icons/arrow.png";
import styles from "./DailyList.module.css";
import Scrollbars from "react-custom-scrollbars-2";
import { useLocation } from "react-router-dom";

const dateFormat = new Intl.DateTimeFormat("en-UK", {
  weekday: "short",
  day: "numeric",
  month: "2-digit",
});

const DailyList = () => {
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
        {weatherCtx.weatherData.daily.map((el: any, i: number) => {
          const dateObj = dateFormat.formatToParts(el.dt * 1000);
          return (
            <div
              className={`${styles.item} ${
                location.pathname.includes("daily") &&
                weatherCtx.selectedIndex === i
                  ? styles.selected
                  : ""
              }`}
              key={i}
              data-key={i}
              tabIndex={0}
            >
              <div className={styles.day}>
                <p className={styles.name}>{dateObj[0].value}.</p>
                <p className={styles.number}>
                  {dateObj[2].value}.{dateObj[4].value}
                </p>
              </div>
              <div className={styles.temperature}>
                {generalCtx.units.temperature === "c"
                  ? `${Math.round(el.temp.max)}`
                  : Math.round((el.temp.max / 5) * 9 + 32)}
                &#176;
                <span className={styles.min}>
                  /
                  {generalCtx.units.temperature === "c"
                    ? `${Math.round(el.temp.min)}`
                    : Math.round((el.temp.min / 5) * 9 + 32)}
                  &#176;
                </span>
              </div>
              <div className={styles.weather}>
                <img src={`/weather-icons/${el.weather[0].icon}.png`} alt="" />
                <p>{el.weather[0].main}</p>
              </div>
              <div className={styles.right}>
                <div className={styles.precipitation}>
                  <img
                    src={
                      (el.snow && !el.rain) || el.snow > el.rain
                        ? snowFlake
                        : waterDrop
                    }
                    alt={
                      (el.snow && !el.rain) || el.snow > el.rain
                        ? "snow"
                        : "rain"
                    }
                  />
                  <p>{Math.round(el.pop * 100)}%</p>
                </div>
                <div className={styles.wind}>
                  <img
                    src={arrow}
                    style={{ transform: `rotate(${el.wind_deg}deg)` }}
                    alt={`wind direction: ${el.wind_deg} degrees`}
                  />
                  <p>
                    {generalCtx.units.wind === "kph"
                      ? `${Math.round(el.wind_speed)} km/h`
                      : `${Math.round(el.wind_speed / 1.609344)} mph`}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </Scrollbars>
    </div>
  );
};

export default DailyList;
