import React, { Suspense, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "./store/store";
import { authCheckState } from "./store/authSlice";
import { Navigate, Route, Routes } from "react-router-dom";
import SignIn from "./components/auth/SignIn/SignIn";
import { Spinner } from "./components/UI/Spinner/Spinner";
import Layout from "./components/Layout/Layout";
import Register from "./components/auth/Register/Register";

const Dashboard = React.lazy(() => import("./components/Dashboard/Dashboard"));

function App() {
  const { token } = useAppSelector((state) => state.auth);
  const isAuthenticated = token !== null;
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(authCheckState());
  }, [token]);

  let routes = (
    <>
      <Route path="/login" element={<SignIn />} />
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<Navigate to="/login" />} />
    </>
  );

  if (isAuthenticated) {
    routes = (
      <>
        <Route
          path="/dashboard"
          element={
            <Suspense fallback={<Spinner />}>
              <Dashboard />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/dashboard" />} />
      </>
    );
  }

  return (
    <Layout>
      <Routes>{routes}</Routes>
    </Layout>
  );
}

export default App;
