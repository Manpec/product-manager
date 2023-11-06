import React from "react";
import Login from "../Login";
import { useSelector } from "react-redux";
import categoryPhoto from "../images/woman-holding-blank-business-card.jpg";
import productPhoto from "../images/sport-items.jpg";

const Home = () => {
  const { token, user } = useSelector((state) => state.auth);
  if (!token) {
    return <Login />;
  }
  return (
    <>
      <h1 className="text-3xl font-bold mt-10">Welcome {user?.nameid} !</h1>
      <div className="flex justify-center mt-20">
        <a href="/products">
          <img
            src={productPhoto}
            alt="productphoto"
            className="object-scale-down h-48 w-96 hover:scale-110"
          />
          <span className="text-2xl font-semibold">Products</span>
        </a>
        <a href="/categories">
          <img
            src={categoryPhoto}
            alt="categoryphoto"
            className="object-scale-down h-48 w-96  hover:scale-110"
          />
          <span className="text-2xl font-semibold">Categories</span>
        </a>
      </div>
    </>
  );
};

export default Home;
