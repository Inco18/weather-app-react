import React from "react";
import github from "../../assets/icons/github.png";

import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <div className={styles.container}>
      &#169; Patryk Pacholczyk{" "}
      <a href="https://github.com/Inco18" target="_blank" rel="noreferrer">
        <img src={github} className={styles.social} alt="github" />
      </a>
    </div>
  );
};

export default Footer;
