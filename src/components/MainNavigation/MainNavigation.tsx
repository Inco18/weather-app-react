import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import CSSTransition from "react-transition-group/CSSTransition";
import useOutsideClick from "../../hooks/useOutsideClick";
import Settings from "./Settings";
import Hamburger from "../UI/Hamburger";

import settingsImg from "../../assets/icons/settings.png";
import styles from "./MainNavigation.module.css";
import { WeatherContext } from "../../context/weather-context";

const MainNavigation = () => {
  const [settingsOpen, setSettingsOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const weatherCtx = useContext(WeatherContext);

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const settingsDivRef = useRef(null);
  const settingOpenBtnRef = useRef(null);
  const containerRef = useRef(null);
  const containerOpenBtnRef = useRef(null);

  useOutsideClick([settingsDivRef, settingOpenBtnRef], () => {
    setSettingsOpen(false);
  });
  useOutsideClick([containerRef, containerOpenBtnRef, settingsDivRef], () =>
    setNavOpen(false)
  );

  const content = (
    <>
      <div className={styles["main-div"]} ref={containerRef}>
        {weatherCtx.weatherData.current && (
          <NavLink
            to="current"
            className={({ isActive }) =>
              (isActive ? styles["active"] : "") + " " + styles["nav-btn"]
            }
          >
            Current
          </NavLink>
        )}
        {weatherCtx.weatherData.minutely?.length > 0 && (
          <NavLink
            to="minutely"
            className={({ isActive }) =>
              (isActive ? styles["active"] : "") + " " + styles["nav-btn"]
            }
          >
            Minutely
          </NavLink>
        )}
        {weatherCtx.weatherData.hourly?.length > 0 && (
          <NavLink
            to="hourly"
            className={({ isActive }) =>
              (isActive ? styles["active"] : "") + " " + styles["nav-btn"]
            }
          >
            Hourly
          </NavLink>
        )}
        {weatherCtx.weatherData.daily?.length > 0 && (
          <NavLink
            to="daily"
            className={({ isActive }) =>
              (isActive ? styles["active"] : "") + " " + styles["nav-btn"]
            }
          >
            Daily
          </NavLink>
        )}
        <img
          src={settingsImg}
          alt="settings"
          className={styles["settings-btn"]}
          role="button"
          tabIndex={0}
          style={settingsOpen ? { transform: "rotate(180deg)" } : {}}
          onClick={() => setSettingsOpen((prev) => !prev)}
          ref={settingOpenBtnRef}
        />
      </div>
      <CSSTransition
        in={settingsOpen}
        nodeRef={settingsDivRef}
        timeout={300}
        classNames={{
          enter: styles["settings-enter"],
          enterActive: styles["settings-enter-active"],
          exit: styles["settings-exit"],
          exitActive: styles["settings-exit-active"],
        }}
        unmountOnExit
      >
        <Settings ref={settingsDivRef} />
      </CSSTransition>
    </>
  );

  return (
    <>
      {windowWidth < 1200 && (
        <Hamburger
          ref={containerOpenBtnRef}
          isActive={navOpen}
          toggleActive={() => setNavOpen((prev) => !prev)}
        />
      )}
      {windowWidth >= 1200 && content}
      {windowWidth < 1200 && (
        <CSSTransition
          in={navOpen}
          nodeRef={containerRef}
          timeout={300}
          classNames={{
            enter: styles["container-enter"],
            enterActive: styles["container-enter-active"],
            exit: styles["container-exit"],
            exitActive: styles["container-exit-active"],
          }}
          unmountOnExit
        >
          {content}
        </CSSTransition>
      )}
    </>
  );
};

export default MainNavigation;
