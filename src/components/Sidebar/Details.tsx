import { useContext, useEffect, useState } from "react";
import SunriseSunsetChart from "./SunriseSunsetChart";
import { CSSTransition } from "react-transition-group";
import { useLocation } from "react-router-dom";

import arrowImg from "../../assets/icons/arrow.png";
import styles from "./Details.module.css";
import { WeatherContext } from "../../context/weather-context";
import { GeneralContext } from "../../context/general-context";
import LoadingSpinner from "../UI/LoadingSpinner";

const Details = () => {
  const [showMore, setShowMore] = useState<boolean>(false);
  const [page, setPage] = useState<string>("");
  const weatherCtx = useContext(WeatherContext);
  const generalCtx = useContext(GeneralContext);
  const location = useLocation();

  useEffect(() => {
    setPage(location.pathname.split("/")[2]);
  }, [location.pathname]);

  const btn = (
    <button
      className={styles["shw-btn"]}
      onClick={() => setShowMore((prev) => !prev)}
    >
      {!showMore ? "Show More" : "Hide"}
    </button>
  );

  if (
    !weatherCtx.weatherData.lat &&
    !weatherCtx.isLoading &&
    !weatherCtx.error
  ) {
    return <p className={styles["info-p"]}>Pick a city to see the weather</p>;
  }

  if (weatherCtx.error && !weatherCtx.isLoading) {
    return (
      <p className={`${styles["info-p"]} ${styles.error}`}>
        {weatherCtx.error}
      </p>
    );
  }

  if (weatherCtx.isLoading) {
    return (
      <div className={styles.container}>
        <p className={styles["main-p"]}>Weather Details</p>
        <LoadingSpinner size={1} />
      </div>
    );
  }

  let alwaysVisibleContent = <></>,
    moreInfoContent = <></>;

  if (page === "current" || page === "minutely") {
    alwaysVisibleContent = (
      <>
        <div className={styles.info}>
          <p className={styles.infoName}>Description</p>
          <p className={styles.infoVal}>
            {weatherCtx.weatherData.current.weather[0].description}
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Clouds</p>
          <p className={styles.infoVal}>
            {weatherCtx.weatherData.current.clouds}%
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Humidity</p>
          <p className={styles.infoVal}>
            {weatherCtx.weatherData.current.humidity}%
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Wind</p>
          <div className={styles.infoVal}>
            <img
              src={arrowImg}
              alt="wind direction"
              style={{
                transform: `rotate(${weatherCtx.weatherData.current.wind_deg}deg)`,
              }}
            />{" "}
            {generalCtx.units.wind === "kph"
              ? `${Math.round(weatherCtx.weatherData.current.wind_speed)} km/h`
              : `${Math.round(
                  weatherCtx.weatherData.current.wind_speed / 1.609344
                )} mph`}
          </div>
        </div>
      </>
    );

    moreInfoContent = (
      <div className={styles.more}>
        {weatherCtx.weatherData.current.wind_gust && (
          <div className={styles.info}>
            <p className={styles.infoName}>Wind gusts</p>
            <p className={styles.infoVal}>
              {generalCtx.units.wind === "kph"
                ? `${Math.round(weatherCtx.weatherData.current.wind_gust)} km/h`
                : `${Math.round(
                    weatherCtx.weatherData.current.wind_gust / 1.609344
                  )} mph`}
            </p>
          </div>
        )}
        <div className={styles.info}>
          <p className={styles.infoName}>Pressure</p>
          <p className={styles.infoVal}>
            {generalCtx.units.pressure === "hpa"
              ? `${Math.round(weatherCtx.weatherData.current.pressure)} hPa`
              : `${(
                  weatherCtx.weatherData.current.pressure * 0.02952998330101
                ).toFixed(2)} inHg`}
          </p>
        </div>
        {weatherCtx.weatherData.current.rain && (
          <div className={styles.info}>
            <p className={styles.infoName}>Rain</p>
            <p className={styles.infoVal}>
              {weatherCtx.weatherData.current.rain["1h"]} mm
            </p>
          </div>
        )}
        {weatherCtx.weatherData.current.snow && (
          <div className={styles.info}>
            <p className={styles.infoName}>Snow</p>
            <p className={styles.infoVal}>
              {weatherCtx.weatherData.current.snow["1h"]} mm
            </p>
          </div>
        )}
        <div className={styles.info}>
          <p className={styles.infoName}>Feels Like</p>
          <p className={styles.infoVal}>
            {generalCtx.units.temperature === "c"
              ? Math.round(weatherCtx.weatherData.current.feels_like)
              : Math.round(
                  (weatherCtx.weatherData.current.feels_like / 5) * 9 + 32
                )}
            &#176;
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Dew Point</p>
          <p className={styles.infoVal}>
            {generalCtx.units.temperature === "c"
              ? Math.round(weatherCtx.weatherData.current.dew_point)
              : Math.round(
                  (weatherCtx.weatherData.current.dew_point / 5) * 9 + 32
                )}
            &#176;
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>UV Index</p>
          <p className={styles.infoVal}>
            {Math.round(weatherCtx.weatherData.current.uvi)} of 10
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Visibility</p>
          <p className={styles.infoVal}>
            {generalCtx.units.distance === "km"
              ? weatherCtx.weatherData.current.visibility < 1000
                ? `${weatherCtx.weatherData.current.visibility} m`
                : `${Math.round(
                    weatherCtx.weatherData.current.visibility / 1000
                  )} km`
              : weatherCtx.weatherData.current.visibility < 1610
              ? `${Math.round(
                  weatherCtx.weatherData.current.visibility * 3.28
                )} ft`
              : `${Math.round(
                  weatherCtx.weatherData.current.visibility * 0.000621371192237
                )} mi`}
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Sunrise/Sunset</p>
          <SunriseSunsetChart
            sunriseTime={
              weatherCtx.weatherData.current.sunrise +
              weatherCtx.weatherData.timezone_offset -
              3600
            }
            sunsetTime={
              weatherCtx.weatherData.current.sunset +
              weatherCtx.weatherData.timezone_offset -
              3600
            }
            actTime={
              weatherCtx.weatherData.current.dt +
              weatherCtx.weatherData.timezone_offset -
              3600
            }
          />
        </div>
      </div>
    );
  }

  if (page === "hourly") {
    const selectedData =
      weatherCtx.weatherData.hourly[weatherCtx.selectedIndex];
    alwaysVisibleContent = (
      <>
        <div className={styles.info}>
          <p className={styles.infoName}>Description</p>
          <p className={styles.infoVal}>
            {selectedData.weather[0].description}
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Clouds</p>
          <p className={styles.infoVal}>{selectedData.clouds}%</p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Humidity</p>
          <p className={styles.infoVal}>{selectedData.humidity}%</p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Pressure</p>
          <p className={styles.infoVal}>
            {generalCtx.units.pressure === "hpa"
              ? `${Math.round(selectedData.pressure)} hPa`
              : `${(selectedData.pressure * 0.02952998330101).toFixed(2)} inHg`}
          </p>
        </div>
      </>
    );

    moreInfoContent = (
      <div className={styles.more}>
        {selectedData.rain && (
          <div className={styles.info}>
            <p className={styles.infoName}>Rain</p>
            <p className={styles.infoVal}>{selectedData.rain["1h"]} mm</p>
          </div>
        )}
        {selectedData.snow && (
          <div className={styles.info}>
            <p className={styles.infoName}>Snow</p>
            <p className={styles.infoVal}>{selectedData.snow["1h"]} mm</p>
          </div>
        )}
        <div className={styles.info}>
          <p className={styles.infoName}>Wind gusts</p>
          <p className={styles.infoVal}>
            {generalCtx.units.wind === "kph"
              ? `${Math.round(selectedData.wind_gust)} km/h`
              : `${Math.round(selectedData.wind_gust / 1.609344)} mph`}
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Feels Like</p>
          <p className={styles.infoVal}>
            {generalCtx.units.temperature === "c"
              ? Math.round(selectedData.feels_like)
              : Math.round((selectedData.feels_like / 5) * 9 + 32)}
            &#176;
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Dew Point</p>
          <p className={styles.infoVal}>
            {generalCtx.units.temperature === "c"
              ? Math.round(selectedData.dew_point)
              : Math.round((selectedData.dew_point / 5) * 9 + 32)}
            &#176;
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>UV Index</p>
          <p className={styles.infoVal}>{Math.round(selectedData.uvi)} of 10</p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Visibility</p>
          <p className={styles.infoVal}>
            {generalCtx.units.distance === "km"
              ? selectedData.visibility < 1000
                ? `${selectedData.visibility} m`
                : `${Math.round(selectedData.visibility / 1000)} km`
              : selectedData.visibility < 1610
              ? `${Math.round(selectedData.visibility * 3.28)} ft`
              : `${Math.round(selectedData.visibility * 0.000621371192237)} mi`}
          </p>
        </div>
      </div>
    );
  }

  if (page === "daily") {
    const selectedData = weatherCtx.weatherData.daily[weatherCtx.selectedIndex];
    alwaysVisibleContent = (
      <>
        <div className={styles.info}>
          <p className={styles.infoName}>Description</p>
          <p className={styles.infoVal}>
            {selectedData.weather[0].description}
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Clouds</p>
          <p className={styles.infoVal}>{selectedData.clouds}%</p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Humidity</p>
          <p className={styles.infoVal}>{selectedData.humidity}%</p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Pressure</p>
          <p className={styles.infoVal}>
            {generalCtx.units.pressure === "hpa"
              ? `${Math.round(selectedData.pressure)} hPa`
              : `${(selectedData.pressure * 0.02952998330101).toFixed(2)} inHg`}
          </p>
        </div>
      </>
    );

    moreInfoContent = (
      <div className={styles.more}>
        {selectedData.rain && (
          <div className={styles.info}>
            <p className={styles.infoName}>Rain</p>
            <p className={styles.infoVal}>{selectedData.rain} mm</p>
          </div>
        )}
        {selectedData.snow && (
          <div className={styles.info}>
            <p className={styles.infoName}>Snow</p>
            <p className={styles.infoVal}>{selectedData.snow} mm</p>
          </div>
        )}
        <div className={styles.info}>
          <p className={styles.infoName}>Wind gusts</p>
          <p className={styles.infoVal}>
            {generalCtx.units.wind === "kph"
              ? `${Math.round(selectedData.wind_gust)} km/h`
              : `${Math.round(selectedData.wind_gust / 1.609344)} mph`}
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Feels Like</p>
          <p className={styles.infoVal}>
            {generalCtx.units.temperature === "c"
              ? Math.round(selectedData.feels_like.day)
              : Math.round((selectedData.feels_like.day / 5) * 9 + 32)}
            &#176;
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Dew Point</p>
          <p className={styles.infoVal}>
            {generalCtx.units.temperature === "c"
              ? Math.round(selectedData.dew_point)
              : Math.round((selectedData.dew_point / 5) * 9 + 32)}
            &#176;
          </p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>UV Index</p>
          <p className={styles.infoVal}>{Math.round(selectedData.uvi)} of 10</p>
        </div>
        <div className={styles.info}>
          <p className={styles.infoName}>Sunrise/Sunset</p>
          <SunriseSunsetChart
            sunriseTime={
              selectedData.sunrise +
              weatherCtx.weatherData.timezone_offset -
              3600
            }
            sunsetTime={
              selectedData.sunset +
              weatherCtx.weatherData.timezone_offset -
              3600
            }
            actTime={
              weatherCtx.weatherData.current.dt +
              weatherCtx.weatherData.timezone_offset -
              3600
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className={styles["main-p"]}>Weather Details</p>
      {alwaysVisibleContent}

      <CSSTransition
        timeout={500}
        in={showMore}
        classNames={{
          enter: styles["more-enter"],
          enterActive: styles["more-enter-active"],
          exit: styles["more-exit"],
          exitActive: styles["more-exit-active"],
        }}
        unmountOnExit
      >
        {moreInfoContent}
      </CSSTransition>
      {btn}
    </div>
  );
};

export default Details;
