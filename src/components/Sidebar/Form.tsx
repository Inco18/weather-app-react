import React, { useRef, useState, useContext } from "react";

import styles from "./Form.module.css";
import buttonImg from "../../assets/icons/search.png";
import Search from "../Form/Search";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { GeneralContext } from "../../context/general-context";

const Form = () => {
  const [query, setQuery] = useState<string>("");
  const [resultsVisible, setResultsVisible] = useState(false);
  const [resultsFocused, setResultsFocused] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>("");
  const formRef = useRef(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const generalCtx = useContext(GeneralContext);

  const emptyQuery = () => setQuery("");

  const goToResults = (event: React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === "ArrowDown" && query) {
      event.preventDefault();
      setResultsFocused(true);
    }
  };

  const unFocusResults = () => {
    setResultsFocused(false);
    inputRef?.current?.setSelectionRange(
      inputRef.current.value.length,
      inputRef.current.value.length
    );
    inputRef?.current?.focus();
  };

  const handleConfirm = (result: any) => {
    unFocusResults();
    setResultsVisible(false);
    setQuery(
      `${result.place_name} (${result.center[1].toFixed(
        2
      )}/${result.center[0].toFixed(2)})`
    );
    setResult(result);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query) return;
    if (!result) {
      axios
        .get(
          `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.jso?limit=1&types=region,postcode,district,place&access_token=${process.env.REACT_APP_GEOCODING_API_KEY}`,
          { timeout: 5000 }
        )
        .then((response) => {
          if (response.data.features.length === 0)
            setError("No cities found for your query.");
          else {
            const fetched = response.data.features[0];
            console.log(fetched);
            generalCtx.replaceGeocodingData({
              fullPlaceName: fetched.place_name,
              cityName: fetched.text,
              countryNameLong: fetched.context.find((element: any) =>
                element.id.includes("country")
              ).text,
              latlng: `${fetched.center[1]}_${fetched.center[0]}`,
            });
            navigate(`/${fetched.center[1]}_${fetched.center[0]}/`);
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
        });
    } else {
      generalCtx.replaceGeocodingData({
        fullPlaceName: result.place_name,
        cityName: result.text,
        countryNameLong: result.context.find((element: any) =>
          element.id.includes("country")
        ).text,
        latlng: `${result.center[1]}_${result.center[0]}`,
      });
      navigate(`/${result.center[1]}_${result.center[0]}/`);
    }

    setQuery("");
  };

  return (
    <form
      className={styles.form}
      ref={formRef}
      onKeyDown={goToResults}
      onSubmit={handleSubmit}
    >
      {error && <p className={styles.error}>{error}</p>}
      <input
        ref={inputRef}
        id="location"
        name="location"
        placeholder="Search for a city"
        autoComplete="off"
        className={styles["location-input"]}
        onChange={(event) => {
          if (!resultsVisible) setResultsVisible(true);
          setError("");
          setResult(null);
          setQuery(event.target.value);
        }}
        value={query}
        onFocus={unFocusResults}
      />
      {resultsVisible && query && (
        <Search
          query={query}
          emptyQuery={emptyQuery}
          ref={formRef}
          focused={resultsFocused}
          unFocus={unFocusResults}
          handleConfirm={handleConfirm}
        />
      )}
      <button className={styles["submit-btn"]} type="submit">
        <img src={buttonImg} alt="search" />
      </button>
    </form>
  );
};

export default Form;
