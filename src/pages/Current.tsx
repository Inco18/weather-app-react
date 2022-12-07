import { useContext } from "react";
import CurrentBlock from "../components/Main/CurrentBlock";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { WeatherContext } from "../context/weather-context";

import styles from "./Current.module.css";

const Current = () => {
  const weatherCtx = useContext(WeatherContext);

  if (
    !weatherCtx.weatherData.current &&
    !weatherCtx.error &&
    !weatherCtx.isLoading &&
    weatherCtx.weatherData.lat
  ) {
    return (
      <p className={styles.error}>
        No current weather available for this location
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
      <CurrentBlock size={1} />
    </main>
  );
};

export default Current;
