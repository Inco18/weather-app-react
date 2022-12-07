import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

type GeocodingData = {
  fullPlaceName: string;
  cityName: string;
  countryNameLong: string;
  latlng: string;
};

type Units = {
  temperature: string;
  pressure: string;
  wind: string;
  distance: string;
};

type GeneralContextType = {
  geocoding: GeocodingData;
  units: Units;
  replaceGeocodingData: (newData: GeocodingData) => void;
  updateUnits: (updatedUnit: string, value: string) => void;
};

export const GeneralContext = React.createContext<GeneralContextType>({
  geocoding: {
    fullPlaceName: "",
    cityName: "",
    countryNameLong: "",
    latlng: "",
  },
  units: {
    temperature: "",
    pressure: "",
    wind: "",
    distance: "",
  },
  replaceGeocodingData: (newData: GeocodingData) => {},
  updateUnits: (updatedUnit, value) => {},
});

const GeneralContextProvider = (props: { children?: React.ReactNode }) => {
  const [geocodingData, setGeocodingData] = useState<GeocodingData>({
    fullPlaceName: "",
    cityName: "",
    countryNameLong: "",
    latlng: "",
  });
  const [units, setUnits] = useState<Units>({
    temperature: "c",
    pressure: "hpa",
    wind: "kph",
    distance: "km",
  });
  const navigate = useNavigate();
  const params = useParams();

  // Set units used last time if present
  useEffect(() => {
    const localStorageUnits = localStorage.getItem("units");
    if (localStorageUnits) {
      setUnits(JSON.parse(localStorageUnits));
    }
  }, []);

  // Set location used last time if present
  useEffect(() => {
    const localStorageLocation = localStorage.getItem("lastLocation");
    if (
      localStorageLocation &&
      JSON.parse(localStorageLocation) &&
      !params.latlng
    ) {
      setGeocodingData(JSON.parse(localStorageLocation));
      navigate(JSON.parse(localStorageLocation).latlng);
    }
  }, []);

  const replaceGeocodingData = (newData: GeocodingData) => {
    localStorage.setItem("lastLocation", JSON.stringify(newData));
    setGeocodingData(newData);
  };

  const updateUnits = (updatedUnit: string, value: string) => {
    setUnits((prev) => {
      const newObj = { ...prev, [`${updatedUnit}`]: value };
      localStorage.setItem("units", JSON.stringify(newObj));
      return newObj;
    });
  };

  const contextValue: GeneralContextType = {
    geocoding: geocodingData,
    units: units,
    replaceGeocodingData: replaceGeocodingData,
    updateUnits: updateUnits,
  };

  return (
    <GeneralContext.Provider value={contextValue}>
      {props.children}
    </GeneralContext.Provider>
  );
};

export default GeneralContextProvider;
