import { useContext } from "react";
import DailyList from "../components/Main/DailyList";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { WeatherContext } from "../context/weather-context";

import styles from "./Daily.module.css";

const Daily = () => {
  const weatherCtx = useContext(WeatherContext);

  if (
    !weatherCtx.weatherData.daily &&
    !weatherCtx.error &&
    !weatherCtx.isLoading &&
    weatherCtx.weatherData.lat
  ) {
    return (
      <p className={styles.error}>
        No daily weather available for this location
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
      <DailyList />
    </main>
  );
};

export default Daily;
