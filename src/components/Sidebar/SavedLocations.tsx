import React, { useContext, useEffect, useRef, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { GeneralContext } from "../../context/general-context";
import styles from "./SavedLocations.module.css";
import rmBook from "../../assets/icons/remove-bookmark.png";
import addBook from "../../assets/icons/add-bookmark.png";
import axios from "axios";

const SavedLocations = () => {
  const [data, setData] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [error, setError] = useState<string>("");
  const [errorVisible, setErrorVisible] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  const errorRef = useRef(null);

  const params = useParams();
  const navigate = useNavigate();

  const generalCtx = useContext(GeneralContext);

  useEffect(() => {
    const localStorageData = localStorage.getItem("bookmarks");
    const localStorageDataParsed = localStorageData
      ? JSON.parse(localStorageData)
      : null;
    if (localStorageDataParsed) setBookmarks(localStorageDataParsed);

    const localStorageLast = localStorage.getItem("lastLocation");
    const localStorageLastParsed = localStorageLast
      ? JSON.parse(localStorageLast)
      : null;

    const latlng = params.latlng;

    if (
      latlng &&
      localStorageLastParsed &&
      localStorageLastParsed.latlng === latlng
    ) {
      generalCtx.replaceGeocodingData({
        fullPlaceName: localStorageLastParsed.fullPlaceName,
        cityName: localStorageLastParsed.cityName,
        countryNameLong: localStorageLastParsed.countryNameLong,
        latlng: localStorageLastParsed.latlng,
      });
    } else if (
      latlng &&
      localStorageDataParsed &&
      localStorageDataParsed.length > 0 &&
      localStorageDataParsed.some((el: any) => el.latlng === params.latlng)
    ) {
      const locationInfo = localStorageDataParsed.find(
        (el: any) => el.latlng === params.latlng
      );
      generalCtx.replaceGeocodingData({
        fullPlaceName: locationInfo.fullPlaceName,
        cityName: locationInfo.cityName,
        countryNameLong: locationInfo.countryNameLong,
        latlng: locationInfo.latlng,
      });
    } else if (
      latlng &&
      (!localStorageDataParsed ||
        localStorageDataParsed.length < 1 ||
        !localStorageDataParsed.some(
          (el: any) => el.latlng === params.latlng
        ) ||
        !localStorageLastParsed ||
        localStorageLastParsed.latlng !== latlng)
    ) {
      console.log("123");
      const query =
        parseInt(latlng.split("_")[1]) && parseInt(latlng.split("_")[0])
          ? `${latlng.split("_")[1]},${latlng.split("_")[0]}`
          : latlng;
      axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json?limit=1&types=region,district,place&access_token=${process.env.REACT_APP_GEOCODING_API_KEY}`
        )
        .then((response) => {
          if (response.data.features.length === 0) {
            setError("No city found for this url.");
            if (
              parseInt(latlng.split("_")[1]) &&
              parseInt(latlng.split("_")[0]) &&
              parseInt(latlng.split("_")[0]) >= -90 &&
              parseInt(latlng.split("_")[0]) <= 90 &&
              parseInt(latlng.split("_")[1]) >= -180 &&
              parseInt(latlng.split("_")[1]) <= 180
            ) {
              generalCtx.replaceGeocodingData({
                fullPlaceName: "",
                cityName: "",
                countryNameLong: "",
                latlng: latlng,
              });
            }
          } else {
            generalCtx.replaceGeocodingData({
              fullPlaceName: response.data.features[0].place_name,
              cityName: response.data.features[0].text,
              countryNameLong: response.data.features[0].context.find(
                (element: any) => element.id.includes("country")
              ).text,
              latlng:
                parseInt(latlng.split("_")[1]) && parseInt(latlng.split("_")[0])
                  ? latlng
                  : `${response.data.features[0].center[1]}_${response.data.features[0].center[0]}`,
            });

            if (
              !parseInt(latlng.split("_")[1]) ||
              !parseInt(latlng.split("_")[0])
            ) {
              navigate(
                `/${response.data.features[0].center[1]}_${response.data.features[0].center[0]}/`
              );
            }
          }
        })
        .catch((error) => {
          if (error.response) {
            setError(
              `There was an error fetching data. Please, try again later or contact website administrator. [${error.response.status}]`
            );
          } else if (error.request) {
            setError(
              `There was a problem with data server. Please try again later or contact website administrator`
            );
          } else {
            setError(
              "There was a request setting error. Please contact website administrator."
            );
          }

          if (
            parseInt(latlng.split("_")[1]) &&
            parseInt(latlng.split("_")[0]) &&
            parseInt(latlng.split("_")[0]) >= -90 &&
            parseInt(latlng.split("_")[0]) <= 90 &&
            parseInt(latlng.split("_")[1]) >= -180 &&
            parseInt(latlng.split("_")[1]) <= 180
          ) {
            generalCtx.replaceGeocodingData({
              fullPlaceName: "",
              cityName: "",
              countryNameLong: "",
              latlng: latlng,
            });
          }
        });
    }
  }, []);

  useEffect(() => {
    if (generalCtx.geocoding.latlng) {
      if (!bookmarks.some((el) => el.latlng === generalCtx.geocoding.latlng)) {
        setData([generalCtx.geocoding, ...bookmarks]);
      } else {
        setData(bookmarks);
      }
    } else {
      setData(bookmarks);
    }
  }, [generalCtx.geocoding.latlng, bookmarks]);

  useEffect(() => {
    if (error) {
      setErrorVisible(true);
      const timeout = setTimeout(() => {
        setErrorVisible(false);
      }, 7000);

      const timeout2 = setTimeout(() => {
        setError("");
      }, 7500);

      return () => {
        clearTimeout(timeout);
        clearTimeout(timeout2);
      };
    }
  }, [error]);

  const handleClick = (e: React.MouseEvent) => {
    // Bookmark
    const divKey = (e.target as HTMLElement)
      .closest(`.${styles.location}`)
      ?.getAttribute("data-key");

    if ((e.target as HTMLElement).tagName === "IMG" && divKey) {
      if (bookmarks.some((el) => el.latlng === data[parseInt(divKey)].latlng)) {
        setBookmarks((prev: any[]) => {
          localStorage.setItem(
            "bookmarks",
            JSON.stringify(
              prev.filter((el) => el.latlng !== data[parseInt(divKey)].latlng)
            )
          );
          return prev.filter(
            (el) => el.latlng !== data[parseInt(divKey)].latlng
          );
        });
      } else {
        if (data.length > 8) {
          setError("Too many bookmarks");
        } else {
          setBookmarks((prev) => {
            localStorage.setItem(
              "bookmarks",
              JSON.stringify([data[parseInt(divKey)], ...prev])
            );
            return [data[parseInt(divKey)], ...prev];
          });
        }
      }
    }

    // Navigation
    if (
      (e.target as HTMLElement).closest("a") &&
      divKey &&
      data[parseInt(divKey)]?.latlng !== generalCtx.geocoding.latlng
    ) {
      generalCtx.replaceGeocodingData(data[parseInt(divKey)]);
    }
  };

  const alwaysVisible = data.map((el, i) => {
    if (i >= 4) return;
    return (
      <div className={styles.location} data-key={i} key={i}>
        <NavLink
          to={`/${el.latlng}/`}
          className={({ isActive }) =>
            (isActive ? styles["active"] : "") + " " + styles.cityName
          }
        >
          {el.fullPlaceName
            ? el.fullPlaceName
            : parseFloat(el.latlng.split("_")[0]).toFixed(3) +
              " " +
              parseFloat(el.latlng.split("_")[1]).toFixed(3)}{" "}
          {el.fullPlaceName && (
            <span className={styles.small}>
              ({parseFloat(el.latlng.split("_")[0]).toFixed(3)},{" "}
              {parseFloat(el.latlng.split("_")[1]).toFixed(3)})
            </span>
          )}
        </NavLink>
        <img
          src={
            bookmarks.some((elb) => elb.latlng === el.latlng) ? rmBook : addBook
          }
          alt="delete from bookmarks"
          role="button"
          tabIndex={0}
        />
      </div>
    );
  });

  const moreVisible = data.map((el, i) => {
    if (i < 4) return;
    return (
      <div className={styles.location} data-key={i} key={i}>
        <NavLink
          to={`/${el.latlng}/`}
          className={({ isActive }) =>
            (isActive ? styles["active"] : "") + " " + styles.cityName
          }
        >
          {el.fullPlaceName}{" "}
          <span className={styles.small}>
            ({parseFloat(el.latlng.split("_")[0]).toFixed(3)},{" "}
            {parseFloat(el.latlng.split("_")[1]).toFixed(3)})
          </span>
        </NavLink>
        <img
          src={
            bookmarks.some((elb) => elb.latlng === el.latlng) ? rmBook : addBook
          }
          alt="delete from bookmarks"
          role="button"
          tabIndex={0}
        />
      </div>
    );
  });

  return (
    <div className={styles.container} onClick={handleClick}>
      <CSSTransition
        in={errorVisible}
        nodeRef={errorRef}
        timeout={500}
        classNames={{
          enter: styles["error-enter"],
          enterActive: styles["error-enter-active"],
          exit: styles["error-exit"],
          exitActive: styles["error-exit-active"],
        }}
        unmountOnExit
      >
        <div
          ref={errorRef}
          className={styles.error}
          onClick={() => {
            setErrorVisible(false);
            setTimeout(() => {
              setError("");
            }, 500);
          }}
        >
          {error}
          <div className={styles.progress}></div>
        </div>
      </CSSTransition>
      {alwaysVisible}

      <CSSTransition
        timeout={500}
        in={showMore}
        classNames={{
          enter: styles["more-enter"],
          enterActive: styles["more-enter-active"],
          exit: styles["more-exit"],
          exitActive: styles["more-exit-active"],
        }}
        unmountOnExit
      >
        <div className={styles.more}>{moreVisible}</div>
      </CSSTransition>

      {data.length > 4 && (
        <button
          className={styles["shw-btn"]}
          onClick={() => setShowMore((prev) => !prev)}
        >
          {!showMore ? "Show More" : "Hide"}
        </button>
      )}
    </div>
  );
};

export default SavedLocations;
