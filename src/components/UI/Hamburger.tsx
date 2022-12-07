import React from "react";

import styles from "./Hamburger.module.css";

type Props = {
  isActive: boolean;
  toggleActive: () => void;
};

const Hamburger = React.forwardRef((props: Props, ref: any) => {
  return (
    <div className={styles.wrapper} ref={ref}>
      <div
        className={`${styles.hamburger} ${styles["hamburger--squeeze"]} ${
          styles["js-hamburger"]
        } ${props.isActive ? styles["is-active"] : ""}`}
        onClick={props.toggleActive}
      >
        <div className={styles["hamburger-box"]}>
          <div className={styles["hamburger-inner"]}></div>
        </div>
      </div>
    </div>
  );
});

export default Hamburger;
