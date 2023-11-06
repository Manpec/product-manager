import React, { useEffect, useState } from "react";
import ProductList from "../ProductList";
import SearchComponent from "../Search";
import { useSelector } from "react-redux";
import  ProductCatalog  from "../ProductCatalog";


const ProductPage = () => {
  const { token, user } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const URL = "https://localhost:7012/products";

  useEffect(() => {
    fetch(URL, {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${token}`,
      },
    })
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
  useEffect(() => {
    fetch("https://localhost:7012/categories", {
      method: "get",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
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

  const handleOnAddProduct = (product) => {
    fetch(URL, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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
      headers: {
        "Authorization": `Bearer ${token}`,
      },
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
        "Authorization": `Bearer ${token}`,
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

  const handleOnAddProductToCategory = (id, product) => {
    fetch(`https://localhost:7012/categories/${id}/products`, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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

  return (
    <>
      <SearchComponent
        products={products}
        setSearchResults={setSearchResults}
      />

      {user?.role === "Administrator" ? (
          <ProductList
            setProducts={setProducts}
            categories={categories}
            products={searchResults.length > 0 ? searchResults : products}
            onAddProduct={handleOnAddProduct}
            onDeleteProduct={handleOnDelete}
            onEditProduct={handleOnUpdateProduct}
            onAddProductToCategory={handleOnAddProductToCategory}
          />
        
      ) : (
        <ProductCatalog
        products={searchResults.length > 0 ? searchResults : products}
        />
      )}
    </>
  );
};

export default ProductPage;
