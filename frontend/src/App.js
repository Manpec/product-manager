import "./App.css";
import Header from "./components/Header";
import { Routes, Route } from "react-router-dom";
import Home from "./components/pages/Home";

import ProductPage from "./components/pages/ProductPage";
import CategoryPage from "./components/pages/CategoryPage";
import { useDispatch } from "react-redux";
import { setAuth } from "./redux/authSlice";
import { jwtDecode } from "jwt-decode";
import Error401Page from "./components/pages/Error401Page";
import Error404Page from "./components/pages/Error404Page";

function App() {
  const dispatch = useDispatch();
  const savedToken = localStorage.getItem("authToken");
  if (savedToken) {
    dispatch(setAuth({ token: savedToken, user: jwtDecode(savedToken) }));
  }
  return (
    <div className="App">
      <Header />
      <Routes>
        <Route path="/401" element={<Error401Page />} />
        <Route path="/*" element={<Error404Page />} />
        <Route path="/" element={<Home />} />

        <Route path="/products" element={<ProductPage />} />

        <Route path="/categories" element={<CategoryPage />} />
      </Routes>
    </div>
  );
}

export default App;
