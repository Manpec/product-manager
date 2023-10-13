import { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import ProductList from './components/ProductList';
import Search from './components/Search';



function App() {
  const URL = "http://localhost:3000/products.json"
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
  

  return (
    <div className="App">
      <Header />
      <Search />
      <ProductList products={products}/>
    </div>
  );
}

export default App;
