import { useContext, useEffect, useRef } from "react";
import { GeneralContext } from "../../context/general-context";
import { WeatherContext } from "../../context/weather-context";

import styles from "./CurrentBlock.module.css";

type Props = {
  size: number;
};

const CurrentBlock = (props: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const generalCtx = useContext(GeneralContext);
  const weatherCtx = useContext(WeatherContext);

  useEffect(() => {
    containerRef?.current?.style.setProperty("--size", props.size.toString());
  }, [props.size]);

  const date = new Date(weatherCtx.weatherData.current.dt * 1000);
  const dateNoTimezone = new Date(
    weatherCtx.weatherData.current.dt * 1000 +
      date.getTimezoneOffset() * 60000 +
      weatherCtx.weatherData.timezone_offset * 1000
  );

  return (
    <div className={styles.container} ref={containerRef}>
      <div className={styles.temperature}>
        {generalCtx.units.temperature === "c"
          ? Math.round(weatherCtx.weatherData.current.temp)
          : Math.round((weatherCtx.weatherData.current.temp / 5) * 9 + 32)}
        &#176;
      </div>
      <div className={styles.general}>
        <p className={styles.location}>
          {generalCtx.geocoding.cityName && generalCtx.geocoding.countryNameLong
            ? generalCtx.geocoding.cityName + ", "
            : parseFloat(generalCtx.geocoding.latlng.split("_")[0]).toFixed(3) +
              ", " +
              parseFloat(generalCtx.geocoding.latlng.split("_")[1]).toFixed(3)}

          {generalCtx.geocoding.cityName &&
          generalCtx.geocoding.countryNameLong ? (
            <span className={styles.country}>
              {generalCtx.geocoding.countryNameLong}
            </span>
          ) : (
            ""
          )}
        </p>
        <p className={styles.date}>{`${dateNoTimezone.toLocaleTimeString(
          "en-UK",
          {
            timeStyle: "short",
          }
        )} - ${dateNoTimezone.toLocaleDateString("en-UK", {
          weekday: "long",
          day: "numeric",
          month: "short",
          year: "numeric",
        })}`}</p>
      </div>
      <div className={styles.weather}>
        <img
          src={`/weather-icons/${weatherCtx.weatherData.current.weather[0].icon}.png`}
          alt=""
        />
        <p>{weatherCtx.weatherData.current.weather[0].main}</p>
      </div>
    </div>
  );
};

export default CurrentBlock;
