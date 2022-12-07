import React, { useContext } from "react";
import CurrentBlock from "../components/Main/CurrentBlock";
import MinutelyBlock from "../components/Main/MinutelyBlock";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { WeatherContext } from "../context/weather-context";

import styles from "./Minutely.module.css";

const Minutely = () => {
  const weatherCtx = useContext(WeatherContext);

  if (
    !weatherCtx.weatherData.minutely &&
    !weatherCtx.error &&
    !weatherCtx.isLoading &&
    weatherCtx.weatherData.lat
  ) {
    return (
      <p className={styles.error}>
        No minutely weather available for this location
      </p>
    );
  }

  if (
    !weatherCtx.weatherData.lat &&
    !weatherCtx.isLoading &&
    !weatherCtx.error
  ) {
    return <></>;
  }

  if (weatherCtx.error && !weatherCtx.isLoading) {
    return <p className={styles.error}>{weatherCtx.error}</p>;
  }

  if (weatherCtx.isLoading) {
    return <LoadingSpinner size={1} />;
  }

  return (
    <main className={styles.main}>
      <CurrentBlock size={0.7} />
      <MinutelyBlock />
    </main>
  );
};

export default Minutely;
