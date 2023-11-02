import React from "react";
import logo from "../logoipsum-221.svg";
import { clearAuth } from "../redux/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import { useSelector } from "react-redux";

function Header() {
  const { token, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(clearAuth());
    navigate("/");
  };
  return (
    <header className="bg-purple-600 p-4 mb-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-white text-2xl font-bold mb-4 md:mb-0">
          {" "}
          <img src={logo} alt="logo" />
        </div>
        {user && (
          <>
            <div className="ml-auto mr-10">
              <nav className="space-x-4">
                <a href="/" className="text-white">
                  Home
                </a>
                <a href="/products" className="text-white">
                  Products
                </a>
                <a href="/categories" className="text-white">
                  Categories
                </a>
              </nav>
            </div>

            <Button color={"alternative"} onClick={handleLogout}>
              Log out
            </Button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
