import React, { useContext, useEffect, useMemo, useState } from "react";
import {
  Chart as ChartJS,
  LinearScale,
  BarElement,
  Tooltip,
  CategoryScale,
} from "chart.js";
import { getRelativePosition } from "chart.js/helpers";
import zoomPlugin from "chartjs-plugin-zoom";
import { Bar } from "react-chartjs-2";
import { WeatherContext } from "../../context/weather-context";

import styles from "./MinutelyBlock.module.css";

ChartJS.register(LinearScale, BarElement, Tooltip, CategoryScale, zoomPlugin, {
  id: "uniqueid5",
  afterDraw: function (chart: any, easing: any) {
    if (chart.tooltip?._active && chart.tooltip?._active.length) {
      const activePoint = chart.tooltip._active[0];
      const ctx = chart.ctx;
      const x = activePoint.element.x;
      const topY = chart.scales.y.top;
      const bottomY = chart.scales.y.bottom;
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(x, topY);
      ctx.lineTo(x, bottomY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.restore();
    }
  },
});

const timeFormat = Intl.DateTimeFormat("en-UK", {
  hour: "numeric",
  minute: "2-digit",
});

const MinutelyBlock = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [hoveredIndex, setHoveredIndex] = useState<number>(0);
  const [rainString, setRainString] = useState("No precipitation expected");
  const weatherCtx = useContext(WeatherContext);

  const themeColor = window
    .getComputedStyle(document.documentElement)
    .getPropertyValue("--main-theme");

  const chartHoverHandler = (e: any) => {
    const canvasPosition = getRelativePosition(e, e.chart);
    const dataX = e.chart.scales.x.getValueForPixel(canvasPosition.x);

    if (dataX > -1 && dataX < weatherCtx.weatherData.minutely.length) {
      setHoveredIndex(dataX);
    }
  };

  const labels = weatherCtx.weatherData.minutely.map((el: any) =>
    timeFormat.format(el.dt * 1000)
  );

  const chartData = {
    labels: labels,
    datasets: [
      {
        barPercentage: 0.95,
        categoryPercentage: 0.95,
        data: weatherCtx.weatherData.minutely.map(
          (el: any) => el.precipitation
        ),
      },
    ],
  };

  const chartOptions = useMemo(() => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          min: 0,
          max:
            windowWidth < 1200
              ? 20
              : windowWidth < 1500
              ? 40
              : weatherCtx.weatherData.minutely.length,
          ticks: {
            color: "white",
            font: {
              family: "Montserrat",
              size: 14,
            },
          },
          grid: { drawTicks: true },
        },
        y: {
          min: 0,
          max: 10,
          ticks: {
            color: "white",
            font: {
              family: "Montserrat",
              size: 14,
            },
          },
        },
      },
      elements: {
        bar: {
          backgroundColor: themeColor,
          hoverBackgroundColor: themeColor,
        },
      },
      plugins: {
        zoom: {
          pan: {
            enabled: true,
            mode: "x" as const,
          },
          limits: {
            x: {
              min: 0,
              max: weatherCtx.weatherData.minutely.length,
            },
          },
        },
        tooltip: {
          intersect: false,
          backgroundColor: "transparent",
          titleColor: "transparent",
          bodyColor: "transparent",
          displayColors: false,
        },
      },
      interaction: {
        mode: "index" as const,
      },
      onHover: chartHoverHandler,
    };
  }, [windowWidth, weatherCtx.weatherData.minutely[0].dt]);

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    if (weatherCtx.weatherData.minutely[0].precipitation === 0) {
      const firstRain = weatherCtx.weatherData.minutely.find(
        (el: any) => el.precipitation > 0
      );
      if (firstRain) {
        console.log("123");
        setRainString(
          `Precipitation in about ${Math.ceil(
            (firstRain.dt * 1000 - weatherCtx.weatherData.current.dt * 1000) /
              60000
          )} min`
        );
      }
    } else {
      const rainEnd = weatherCtx.weatherData.minutely.find(
        (el: any) => el.precipitation === 0
      );
      if (rainEnd) {
        setRainString(
          `Precipitation for the next ${Math.floor(
            (rainEnd.dt * 1000 - weatherCtx.weatherData.current.dt * 1000) /
              60000
          )} min`
        );
      } else {
        setRainString(`Precipitation for at least the next hour`);
      }
    }
  }, []);

  return (
    <div className={styles.container}>
      <p className={styles.general}>{rainString}</p>
      <div className={styles.precipitation}>
        <p className={styles.hour}>
          {timeFormat.format(
            weatherCtx.weatherData.minutely[hoveredIndex].dt * 1000
          )}
        </p>
        <p className={styles.volume}>
          {weatherCtx.weatherData.minutely[hoveredIndex].precipitation} mm
        </p>
      </div>
      <div className={styles["chart-container"]}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default MinutelyBlock;
