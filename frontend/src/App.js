import { useEffect, useState } from "react";
import "./App.css";
import Header from "./components/Header";
import ProductList from "./components/ProductList";
import Search from "./components/Search";
import CategoryList from "./components/CategoryList";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";

function App() {
  const URL = "https://localhost:7012/products";
  const URLCategory = "https://localhost:7012/categories";

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    fetch(URLCategory)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((categories) => {
        setCategories(categories);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  const handleOnAddProductToCategory = (id, product) => {
    fetch(`${URLCategory}/${id}/products`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  // To add new category
  const handleOnAddCategory = (newCategory) => {
    fetch("https://localhost:7012/categories/new", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newCategory),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((category) => {
        console.log("Category added successfully:", category);
        setCategories([...categories, category]);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  useEffect(() => {
    fetch(URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((products) => {
        setProducts(products);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  }, []);

  const handleOnAddProduct = (product) => {
    fetch(URL, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((product) => {
        setProducts([...products, product]);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  const handleOnDelete = (productSku) => {
    const confirmed = window.confirm(
      "Är du säker på att du vill radera produkten?"
    );

    if (!confirmed) {
      return;
    }

    fetch(`${URL}/${productSku}`, {
      method: "delete",
    })
      .then((response) => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Produkten hittades inte.");
          }
        }
      })
      .then(() => {
        const newProducts = products.filter((x) => x.sku !== productSku);
        setProducts(newProducts);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  const handleOnUpdateProduct = (product) => {
    console.log(product);
    const confirmed = window.confirm("Är detta korrekt?");

    if (!confirmed) {
      return;
    }

    fetch(`${URL}/${product.sku}`, {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
      })
      .then(() => {
        const updatedProducts = products.map((p) =>
          p.sku === product.sku ? product : p
        );
        setProducts(updatedProducts);
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  return (
    <div className="App">
      <Header />
      <Search products={products} setSearchResults={setSearchResults} />
      {/*  {user?.role === "administrator" ?  <ProductList products={products} onAddProduct={handleOnAddProduct} onDeleteProduct={handleOnDelete} onEditProduct={handleOnUpdateProduct}/> : <ProductListUserView products={products} /> } */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/products"
          element={
            <ProductList
              setProducts={setProducts}
              categories={categories}
              products={searchResults.length > 0 ? searchResults : products} // 検索結果を表示
              onAddProduct={handleOnAddProduct}
              onDeleteProduct={handleOnDelete}
              onEditProduct={handleOnUpdateProduct}
              onAddProductToCategory={handleOnAddProductToCategory}
            />
          }
        />

        <Route
          path="/categories"
          element={
            <CategoryList
              categories={categories}
              onAddCategory={handleOnAddCategory}
            />
          }
        />
      </Routes>
    </div>
  );
}

export default App;
