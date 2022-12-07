import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import clear from "../assets/images/clear.jpg";
import clearNight from "../assets/images/clear-night.jpg";
import thunderstorm from "../assets/images/thunderstorm.jpg";
import drizzle from "../assets/images/drizzle.jpg";
import rain from "../assets/images/rain.jpg";
import snow from "../assets/images/snow.jpg";
import clouds from "../assets/images/clouds.jpg";
import mist from "../assets/images/mist.jpg";
import squall from "../assets/images/squall.jpg";
import tornado from "../assets/images/tornado.jpg";

type WeatherContextType = {
  weatherData: any;
  setWeatherData: (data: any) => void;
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  error: string;
  setError: (errorMsg: string) => void;
};

export const WeatherContext = React.createContext<WeatherContextType>({
  selectedIndex: 0,
  weatherData: {},
  setSelectedIndex: () => {},
  isLoading: false,
  setIsLoading: () => {},
  setWeatherData: () => {},
  error: "",
  setError: () => {},
});

const WeatherContextProvider = (props: { children?: React.ReactNode }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState<any>({});

  const location = useLocation();

  useEffect(() => {
    setSelectedIndex(0);
  }, [location.pathname]);

  const setStyles = (bgUrl: string, themeColor: string) => {
    const img = new Image();
    img.onload = () => {
      document.body.style.backgroundImage = `url(${bgUrl})`;
    };
    img.src = bgUrl;

    document.documentElement.style.setProperty("--main-theme", themeColor);
  };

  if (data?.current?.weather[0]?.main) {
    const weatherMain = data.current.weather[0].main;
    // Setting styles
    if (weatherMain === "Clear") {
      if (data.current.weather[0].icon === "01n")
        setStyles(clearNight, "#023266");
      else setStyles(clear, "#014e8d");
    } else if (weatherMain === "Thunderstorm") {
      setStyles(thunderstorm, "#25476d");
    } else if (weatherMain === "Drizzle") {
      setStyles(drizzle, "#c55f00");
    } else if (weatherMain === "Rain") {
      setStyles(rain, "#2c4444");
    } else if (weatherMain === "Snow") {
      setStyles(snow, "#444444");
    } else if (weatherMain === "Clouds") {
      setStyles(clouds, "#444444");
    } else if (
      weatherMain === "Mist" ||
      weatherMain === "Smoke" ||
      weatherMain === "Haze" ||
      weatherMain === "Dust" ||
      weatherMain === "Fog" ||
      weatherMain === "Sand" ||
      weatherMain === "Dust" ||
      weatherMain === "Ash"
    ) {
      setStyles(mist, "#727465");
    } else if (weatherMain === "Squall") {
      setStyles(squall, "#444444");
    } else if (weatherMain === "Tornado") {
      setStyles(tornado, "#28434a");
    }
  }

  const contextValue: WeatherContextType = {
    selectedIndex: selectedIndex,
    setSelectedIndex: (index: number) => setSelectedIndex(index),
    isLoading: isLoading,
    setIsLoading: (loading: boolean) => setIsLoading(loading),
    weatherData: data,
    setWeatherData: (data: any) => setData(data),
    error: error,
    setError: (errorMsg: string) => setError(errorMsg),
  };

  return (
    <WeatherContext.Provider value={contextValue}>
      {props.children}
    </WeatherContext.Provider>
  );
};

export default WeatherContextProvider;
