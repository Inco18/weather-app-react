import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Scrollbars from "react-custom-scrollbars-2";
import useOutsideClick from "../../hooks/useOutsideClick";
import LoadingSpinner from "../UI/LoadingSpinner";

import styles from "./Search.module.css";

type Props = {
  query: string;
  emptyQuery: () => void;
  focused: boolean;
  unFocus: () => void;
  handleConfirm: (result: {}) => void;
};

const Search = React.forwardRef((props: Props, formRef: any) => {
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [error, setError] = useState<String | null>(null);
  const [selected, setSelected] = useState<number>(-1);
  const ulRef = useRef<HTMLUListElement>(null);
  const scrollbar = useRef<any>(null);
  useOutsideClick([ulRef, formRef], props.emptyQuery);

  useEffect(() => {
    setError(null);
    const timeout = setTimeout(() => {
      setFetchedData(null);
      setError(null);
      if (!props.query) return;
      setIsLoading(true);
      axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${props.query}.json?limit=10&types=region,postcode,district,place&access_token=${process.env.REACT_APP_GEOCODING_API_KEY}`,
          { timeout: 5000 }
        )
        .then((response) => {
          setIsLoading(false);
          if (response.data.features.length === 0)
            setError("No cities found for your query.");
          else {
            setFetchedData(response.data.features);
          }
        })
        .catch((error) => {
          setIsLoading(false);

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
        });
    }, 1000);

    return () => {
      clearTimeout(timeout);
    };
  }, [props.query]);

  useEffect(() => {
    if (props.focused === true) {
      ulRef?.current?.focus();
    } else setSelected(-1);
  }, [props.focused]);

  const handleKeyUp = (event: React.KeyboardEvent) => {
    event.preventDefault();
    if (
      event.key !== "ArrowDown" &&
      event.key !== "ArrowUp" &&
      event.key !== "Enter"
    )
      return;

    const scrollHeight = scrollbar.current.getScrollHeight();
    if (event.key === "ArrowUp" && selected < 1) props.unFocus();

    if (event.key === "ArrowUp" && selected >= 0) {
      setSelected((prev) => {
        scrollbar.current.scrollTop((prev * scrollHeight - 2500) / 10);
        return prev - 1;
      });
    }

    if (event.key === "ArrowDown" && selected !== fetchedData?.length - 1) {
      setSelected((prev) => {
        scrollbar.current.scrollTop((prev * scrollHeight) / 10);
        return prev + 1;
      });
    }

    if (event.key === "ArrowDown" && selected === fetchedData?.length - 1)
      return;

    if (
      event.key === "Enter" &&
      selected >= 0 &&
      selected <= fetchedData?.length - 1
    ) {
      props.handleConfirm(fetchedData[selected]);
    }
  };

  const handleClick = (event: React.MouseEvent) => {
    if (event.button === 0 && event.target instanceof HTMLElement) {
      const number = event.target.getAttribute("data-key");
      if (!number) return;
      props.handleConfirm(fetchedData[number]);
    }
  };

  return (
    <ul
      className={styles.container}
      ref={ulRef}
      onKeyUp={handleKeyUp}
      onKeyDown={(e) => e.preventDefault()}
      tabIndex={0}
      onClick={handleClick}
    >
      <Scrollbars
        ref={scrollbar}
        style={{ scrollBehavior: "smooth" }}
        autoHide
        autoHeight
        autoHeightMin={0}
        autoHeightMax={"20rem"}
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
        renderView={({ style, ...props }) => (
          <div
            {...props}
            style={{
              ...style,
              scrollBehavior: "smooth",
            }}
          />
        )}
      >
        {!isLoading && !error && !fetchedData && (
          <p className={styles.message}>
            Stop typing for 1 second to see results
          </p>
        )}
        {isLoading && <LoadingSpinner size={1} />}
        {error && (
          <p className={`${styles.message} ${styles.error}`}>{error}</p>
        )}
        {fetchedData &&
          fetchedData.map((item: any, i: number) => {
            return (
              <li
                className={`${styles.result} ${
                  selected === i ? styles.active : ""
                }`}
                data-key={i}
                key={i}
              >
                {item.place_name} ({item.center[1].toFixed(2)}/
                {item.center[0].toFixed(2)})
              </li>
            );
          })}
      </Scrollbars>
    </ul>
  );
});

export default Search;
