import React, { Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Spinner } from "./components/UI/Spinner/Spinner";

const Restaurants = React.lazy(
  () => import("./components/Restaurants/Restaurants")
);
const SingleRestaurant = React.lazy(
  () => import("./components/Restaurants/SingleRestaurant/SingleRestaurant")
);

function App() {
  return (
    <Routes>
      <Route
        path="/restaurants"
        element={
          <Suspense fallback={<Spinner />}>
            <Restaurants />
          </Suspense>
        }
      />
      <Route
        path="/restaurants/:idRestaurant"
        element={
          <Suspense fallback={<Spinner />}>
            <SingleRestaurant />
          </Suspense>
        }
      />
      <Route path="*" element={<Navigate to="/restaurants" />} />
    </Routes>
  );
}

export default App;
