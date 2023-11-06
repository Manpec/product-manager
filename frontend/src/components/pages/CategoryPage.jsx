import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import CategoryList from '../CategoryList';
import { useNavigate } from 'react-router-dom';

const CategoryPage = () => {
  const nav = useNavigate();
    const { token, user } = useSelector((state) => state.auth);
    const [categories, setCategories] = useState([]);
    const URLCategory = "https://localhost:7012/categories";


    useEffect(() => {
      if(token === null){
        return  nav("/401")
       }
        fetch(URLCategory, 
        {
          method: "get",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
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
    
      
      const handleOnAddCategory = (newCategory) => {
        fetch("https://localhost:7012/categories/new", {
          method: "post",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${token}`,
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
  return (
    <CategoryList
    categories={categories}
    onAddCategory={handleOnAddCategory}
    user={user}
  />
  )
}

export default CategoryPage