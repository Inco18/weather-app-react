import { useContext } from "react";
import HourlyList from "../components/Main/HourlyList";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { WeatherContext } from "../context/weather-context";

import styles from "./Hourly.module.css";

const Hourly = () => {
  const weatherCtx = useContext(WeatherContext);

  if (
    !weatherCtx.weatherData.hourly &&
    !weatherCtx.error &&
    !weatherCtx.isLoading &&
    weatherCtx.weatherData.lat
  ) {
    return (
      <p className={styles.error}>
        No hourly weather available for this location
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
      <HourlyList />
    </main>
  );
};

export default Hourly;
