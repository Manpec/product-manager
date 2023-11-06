import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { XMarkIcon, PencilIcon } from "@heroicons/react/24/outline";

export default function EditModal({ product, onEditProduct }) {
  const [showModal, setShowModal] = React.useState(false);
  const modalRef = useRef();
  const [formData, setFormData] = useState({
    name: product.name,
    sku: product.sku,
    description: product.description,
    image: product.image,
    price: product.price,
  });
  const [errors, setErrors] = useState({});

  const handleCloseModal = () => {
    
    setErrors({});
    setShowModal(false);
  };

  const isValidDecimal18_2 = (value) => {
    const regex = /^\d{1,16}\.\d{2}$/;
    return regex.test(value.toString());
  };
  
  const handleValidation = () => {
    let newErrors = {};
  
    if (!formData.name) {
      newErrors.name = "Please fill in the product name.";
    } else if (!formData.name.match(/^[a-zA-Z0-9\s-]+$/)) {
      newErrors.name =
        "Only alphabetic characters, numbers, and hyphens are allowed.";
    }
  
    if (formData.description.trim() === "") {
      newErrors.description = "Please fill in the description.";
    }
  
    if (formData.image.trim() === "") {
      newErrors.image = "Please fill in the image URL.";
    }
  
    if (!formData.price) {
      newErrors.price = "Please fill in the price.";
    } else if (!(formData.price >= 0)) {
      newErrors.price = "Invalid price, negative value.";
    } else if (!isValidDecimal18_2(formData.price)) {
      newErrors.price = "Invalid format.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Check if there are no errors
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (handleValidation()) {
      const updatedProduct = { ...formData, sku: product.sku, id: product.id };
      console.log(updatedProduct);

      onEditProduct(updatedProduct);

      handleCloseModal();
    }
    console.log(handleValidation());
    return;
  };

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
      <Button color={"bright"} onClick={() => setShowModal(true)}>
        <PencilIcon className="w-4"/>
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
                <div className="flex justify-between p-5 border-b border-solid border-blueGray-200 rounded-t">
                  <h3 className="text-3xl font-semibold">Update product</h3>
                  <button className="p-1" onClick={handleCloseModal}>
                    <span className="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">
                      <XMarkIcon />
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit}>
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        disabled
                        type="text"
                        name="sku"
                        id="sku"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-slate-400/60 border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={formData.sku}
                      />
                      <label
                        htmlFor="sku"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-2 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        SKU
                      </label>
                    </div>
                    <div className={`relative z-0 w-full mb-6 group`}>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        value={formData.name}
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="name"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Name
                      </label>
                      <span className="text-red-500 text-xs  float-left">
                        {errors.name}
                      </span>
                    </div>
                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="text"
                        name="description"
                        id="description"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={formData.description}
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="description"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Description
                      </label>
                      <span className="text-red-500 text-xs  float-left">
                        {errors.description}
                      </span>
                    </div>

                    <div className="relative z-0 w-full mb-6 group">
                      <input
                        type="text"
                        name="image"
                        id="Image"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={formData.image}
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="Image"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Image URL
                      </label>
                      <span className="text-red-500 text-xs  float-left">
                        {errors.image}
                      </span>
                    </div>

                    <div
                      className={`${
                        errors.price ? "pb-1" : ""
                      } relative z-0 w-full mb-6 group`}
                    >
                      <input
                        type="text"
                        name="price"
                        id="price"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=" "
                        value={formData.price}
                        onChange={handleInputChange}
                      />
                      <label
                        htmlFor="price"
                        className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 left-0 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                      >
                        Price
                      </label>
                      <span className={`text-red-500 text-xs  float-left `}>
                        {errors.price}
                      </span>
                    </div>
                    <Button color={"primary"}>Update</Button>
                  </form>
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
