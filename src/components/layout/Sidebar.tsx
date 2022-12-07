import { useEffect, useState } from "react";
import { Scrollbars } from "react-custom-scrollbars-2";
import Details from "../Sidebar/Details";
import Form from "../Sidebar/Form";
import SavedLocations from "../Sidebar/SavedLocations";
import Footer from "./Footer";

import styles from "./Sidebar.module.css";

const Sidebar = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    function handleWindowResize() {
      setWindowWidth(window.innerWidth);
    }

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  if (windowWidth > 950) {
    return (
      <div className={styles["sidebar-div"]}>
        <Scrollbars
          autoHide
          renderThumbVertical={({ style, ...props }) => (
            <div
              {...props}
              style={{
                ...style,
                backgroundColor: "rgba(255,255,255, 0.2)",
                borderRadius: "100vw",
                width: "10px",
                right: "5px",
              }}
            />
          )}
        >
          <Form />
          <SavedLocations />
          <Details />
        </Scrollbars>
        <Footer />
      </div>
    );
  } else {
    return (
      <div className={styles["sidebar-div"]}>
        <Form />
        <SavedLocations />
        <Details />
        <Footer />
      </div>
    );
  }
};

export default Sidebar;
