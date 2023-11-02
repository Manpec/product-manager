import React from "react";
import Login from "./Login";
import { useSelector } from "react-redux";

const Home = () => {
  const { token, user } = useSelector((state) => state.auth);
  if (!token) {
    return <Login />;
  }
  return (
    <>
      <h1>Welcome {user?.nameid} !</h1>
    </>
  );
};

export default Home;
