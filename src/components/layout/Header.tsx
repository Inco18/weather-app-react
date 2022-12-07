import React from "react";
import { useParams } from "react-router-dom";
import logo from "../../assets/icons/logo.png";
import MainNavigation from "../MainNavigation/MainNavigation";

import styles from "./Header.module.css";

const Header = () => {
  const params = useParams();

  return (
    <header className={styles.header}>
      <a href="/">
        <div className={styles["logo-div"]}>
          <img src={logo} alt="logo" />
          <h1 className={styles.name}>WeatherApp</h1>
        </div>
      </a>
      {params.latlng && <MainNavigation />}
    </header>
  );
};

export default Header;
