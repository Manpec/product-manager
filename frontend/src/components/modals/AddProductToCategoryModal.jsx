import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AddProductToCategoryModal({
  categories,
  onAddProductToCategory,
  product,
  products,
  setProducts
}) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setSelectedCategory(e.target.value);
    console.log(selectedCategory);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    onAddProductToCategory(selectedCategory, product);
    const category = categories?.find(c => c.id === parseInt(selectedCategory));
    console.log("selectedCategory", category)
   const updatedProduct = {
      ...product,
      categories: [...product.categories, category],
    };

    // Update the products list with the updated product
    const updatedProducts = products.map((p) =>
      p.id === updatedProduct.id ? updatedProduct : p
    );

    // Set the updated products list
    setProducts(updatedProducts);

  // Update the products state with the updatedProducts array
  setProducts(updatedProducts);
    handleCloseModal();
  };


  const filteredCategories = categories.filter((category) => {
    return !product?.categories?.some((productCategory) => productCategory.id === category.id);
  });
  console.log(filteredCategories)

  // Add a click event listener when the modal is shown
  useEffect(() => {
    if (showModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [showModal]);

  // Function to handle clicks outside the modal
  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      handleCloseModal();
    }
  };

  return (
    <>
      <Button color={"dark"} onClick={() => setShowModal(true)}>
        +Category
      </Button>
      {showModal ? (
        <>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div
              ref={modalRef}
              className="relative w-full my-6 mx-auto max-w-md"
            >
              {/*content*/}
              <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                {/*header*/}
                <div className="flex justify-between p-5 border-b border-solid border-blueGray-200  text-gray-500 rounded-t">
                  <h3 className="text-3xl font-semibold">Select a category</h3>
                  <button className="p-1" onClick={handleCloseModal}>
                    <span className="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">
                      <XMarkIcon />
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <label
                    htmlFor="categories"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    Select a category
                  </label>
                  <select
                    id="categories"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    onChange={handleInputChange}
                    defaultValue={"1"}
                  >
                    <option value="1" disabled >
                      Select your option
                    </option>
                    {filteredCategories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                  </select>

                  <Button color={"dark"} onClick={(e) => handleSubmit(e)}>
                    Add
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </>
  );
}
