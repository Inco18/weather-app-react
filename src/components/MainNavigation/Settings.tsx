import React, { useContext } from "react";
import { GeneralContext } from "../../context/general-context";

import styles from "./Settings.module.css";

const Settings = React.forwardRef((props: any, ref: any) => {
  const generalCtx = useContext(GeneralContext);

  const clickHandler = (e: React.MouseEvent) => {
    const optionDivData = (e.target as HTMLElement)
      .closest("#option")
      ?.getAttribute("data-name");
    const buttonData = (e.target as HTMLElement)
      .closest("button")
      ?.getAttribute("data-value");
    if (optionDivData && buttonData) {
      generalCtx.updateUnits(optionDivData, buttonData);
    }
  };

  return (
    <div ref={ref} className={styles.container} onClick={clickHandler}>
      <div
        className={styles["option-container"]}
        id="option"
        data-name="temperature"
      >
        <p>Temperature units</p>
        <div className={styles["buttons-div"]}>
          <button
            className={
              generalCtx.units.temperature === "c" ? styles.active : ""
            }
            data-value="c"
          >
            &#176;C
          </button>
          |
          <button
            className={
              generalCtx.units.temperature === "f" ? styles.active : ""
            }
            data-value="f"
          >
            &#176;F
          </button>
        </div>
      </div>
      <div
        className={styles["option-container"]}
        id="option"
        data-name="pressure"
      >
        <p>Pressure units</p>
        <div className={styles["buttons-div"]}>
          <button
            className={generalCtx.units.pressure === "hpa" ? styles.active : ""}
            data-value="hpa"
          >
            hPa
          </button>
          |
          <button
            className={generalCtx.units.pressure === "in" ? styles.active : ""}
            data-value="in"
          >
            in
          </button>
        </div>
      </div>
      <div className={styles["option-container"]} id="option" data-name="wind">
        <p>Wind units</p>
        <div className={styles["buttons-div"]}>
          <button
            className={generalCtx.units.wind === "kph" ? styles.active : ""}
            data-value="kph"
          >
            kph
          </button>
          |
          <button
            className={generalCtx.units.wind === "mph" ? styles.active : ""}
            data-value="mph"
          >
            mph
          </button>
        </div>
      </div>
      <div
        className={styles["option-container"]}
        id="option"
        data-name="distance"
      >
        <p>Distance units</p>
        <div className={styles["buttons-div"]}>
          <button
            className={generalCtx.units.distance === "km" ? styles.active : ""}
            data-value="km"
          >
            km
          </button>
          |
          <button
            className={generalCtx.units.distance === "mi" ? styles.active : ""}
            data-value="mi"
          >
            mi
          </button>
        </div>
      </div>
    </div>
  );
});

export default Settings;
