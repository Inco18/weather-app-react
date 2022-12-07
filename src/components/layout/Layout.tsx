import axios from "axios";
import React, { useContext, useEffect } from "react";
import { useParams } from "react-router-dom";
import GeneralContextProvider from "../../context/general-context";
import { WeatherContext } from "../../context/weather-context";
import Header from "./Header";

import Sidebar from "./Sidebar";

type props = { children?: React.ReactNode };

const Layout = (props: props) => {
  const params = useParams();
  const weatherCtx = useContext(WeatherContext);
  useEffect(() => {
    if (!params.latlng) return;

    if (
      parseInt(params.latlng.split("_")[1]) &&
      parseInt(params.latlng.split("_")[0])
    ) {
      weatherCtx.setIsLoading(true);
      weatherCtx.setError("");
      axios
        .get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${
            params.latlng.split("_")[0]
          }&lon=${params.latlng.split("_")[1]}&units=metric&appid=${
            process.env.REACT_APP_WEATHER_API_KEY
          }`,
          { timeout: 5000 }
        )
        .then((response) => {
          weatherCtx.setIsLoading(false);
          if (!response.data.lat)
            weatherCtx.setError("Nothing found for these coordinates");
          else {
            weatherCtx.setWeatherData(response.data);
          }
        })
        .catch((error) => {
          weatherCtx.setIsLoading(false);
          if (error.response) {
            weatherCtx.setError(
              `There was an error fetching weather data. Please, try again later or contact website administrator. [${error.response.status}]`
            );
          } else if (error.request) {
            weatherCtx.setError(
              `There was a problem with weather data server. Please try again later or contact website administrator`
            );
          } else {
            weatherCtx.setError(
              "There was a weather request setting error. Please contact website administrator."
            );
          }
        });
    }
  }, [params.latlng]);

  return (
    <GeneralContextProvider>
      <Header />
      {props.children}
      <Sidebar />
    </GeneralContextProvider>
  );
};

export default Layout;
