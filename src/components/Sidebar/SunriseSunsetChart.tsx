import React from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement } from "chart.js";

import styles from "./SunriseSunsetChart.module.css";

ChartJS.register(ArcElement);

type Props = {
  children?: React.ReactNode;
  sunriseTime: number;
  sunsetTime: number;
  actTime: number;
};

const SunriseSunsetChart = (props: Props) => {
  const actTime: number = props.actTime;
  const sunriseTime = new Date(props.sunriseTime * 1000);
  const sunsetTime = new Date(props.sunsetTime * 1000);

  const data = {
    labels: [],
    datasets: [
      {
        label: "Sunrise/Sunset",
        data: [
          Math.max(0, actTime - props.sunriseTime),
          Math.min(0, actTime - props.sunsetTime),
        ],
        backgroundColor: ["#D78100", "gray"],
        borderWidth: 0,
      },
    ],
  };

  return (
    <div className={styles["chart-div"]}>
      <Doughnut
        data={data}
        options={{
          rotation: -90,
          circumference: 180,
          events: [],
          cutout: 45,
          maintainAspectRatio: false,
        }}
      />
      <div className={styles.hours}>
        <span>
          {sunriseTime.toLocaleTimeString("en-UK", {
            timeStyle: "short",
          })}
        </span>
        <span>
          {sunsetTime.toLocaleTimeString("en-UK", {
            timeStyle: "short",
          })}
        </span>
      </div>
    </div>
  );
};

export default SunriseSunsetChart;
