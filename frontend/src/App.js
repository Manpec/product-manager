import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Search from './components/Search';




function App() {
  const URL = "https://localhost:7012/products"
  const [products, setProducts] = useState([]);
  
  useEffect(() => {
    fetch(URL)
    .then((response)=>{
      if(!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
       return response.json();
    }) 
    .then((products) => {
      setProducts(products)
    })
    .catch((error)=>{
      console.error("Error: ", error)
    });  
  }, []);
  
  const handleOnAddProduct = (product) => {
    fetch(URL, {
      method: "post",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    }).then((response)=>{
      if(!response.ok){
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
       return response.json();
    }) 
    .then((product) => {
      setProducts([...products, product]);
    })
    .catch((error)=>{
      console.error("Error: ", error)
    });  
  };

  const handleOnDelete = (productSku) => {
    const confirmed = window.confirm("Är du säker på att du vill radera produkten?");
    
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
        const newProducts = products.filter(x => x.sku !== productSku);
        setProducts(newProducts);
    })
    .catch((error) => {
        console.error("Error: ", error);
    });
  };

  return (
    <div className="App">
      <Header />
      <Search />
      <ProductList products={products} onAddProduct={handleOnAddProduct} onDeleteProduct={handleOnDelete}/>
    </div>
  );
}

export default App;
