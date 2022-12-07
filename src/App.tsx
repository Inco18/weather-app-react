import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import Layout from "./components/layout/Layout";
import LoadingSpinner from "./components/UI/LoadingSpinner";
import WeatherContextProvider from "./context/weather-context";
import Current from "./pages/Current";

const Minutely = React.lazy(() => import("./pages/Minutely"));
const Hourly = React.lazy(() => import("./pages/Hourly"));
const Daily = React.lazy(() => import("./pages/Daily"));

const App = () => {
  return (
    <WeatherContextProvider>
      <Routes>
        <Route
          path="/:latlng/"
          element={
            <Layout>
              <Outlet />
            </Layout>
          }
        >
          <Route path="current" element={<Current />} />
          <Route
            path="minutely"
            element={
              <React.Suspense fallback={<LoadingSpinner size={1} />}>
                <Minutely />
              </React.Suspense>
            }
          />
          <Route
            path="hourly"
            element={
              <React.Suspense fallback={<LoadingSpinner size={1} />}>
                <Hourly />
              </React.Suspense>
            }
          />
          <Route
            path="daily"
            element={
              <React.Suspense fallback={<LoadingSpinner size={1} />}>
                <Daily />
              </React.Suspense>
            }
          />
          <Route path="*" element={<Navigate to="current" />} />
          <Route path="" element={<Navigate to="current" />} />
        </Route>
        <Route path="" element={<Layout></Layout>}></Route>
      </Routes>
    </WeatherContextProvider>
  );
};

export default App;
