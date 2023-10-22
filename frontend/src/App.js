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
      method: "POST",
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
  }

  return (
    <div className="App">
      <Header />
      <Search />
      <ProductList products={products} onAddProduct={handleOnAddProduct}/>
    </div>
  );
}

export default App;
