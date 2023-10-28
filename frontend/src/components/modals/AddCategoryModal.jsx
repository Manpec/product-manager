import React, { useEffect, useRef, useState } from "react";
import Button from "../Button";
import { XMarkIcon } from "@heroicons/react/24/outline";


export default function AddCategoryModal({ title, onAddCategory }) {
  const [showModal, setShowModal] = useState(false);
  const modalRef = useRef();
  const [categoryData, setCategoryData] = useState({ name: ""});

  const [errors, setErrors] = useState({});

  const handleCloseModal = () => {
    setCategoryData({ name: ""});
    setErrors({});
    setShowModal(false);
  };

 

  const handleValidation = () => {
    let newErrors = {};

    if (!categoryData.name) {
      newErrors.name = "Vänligen fyll i category namn";
    } else if (!categoryData.name.match(/^[a-zA-Z0-9\s-]+$/)) {
      newErrors.name =
        "Endast alfabetiska tecken, siffror och bindestreck är tillåtna.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Check if there are no errors
  };

  const handleInputChange = (e) => {
    const {name, value} = e.target;
    setCategoryData({ ...categoryData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
     if (handleValidation()) {
      

    
      onAddCategory(categoryData);

      handleCloseModal();
     }
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
      <Button color={"dark"} onClick={() => setShowModal(true)}>
        {title}
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
                  <h3 className="text-3xl font-semibold">New category</h3>
                  <button className="p-1" onClick={handleCloseModal}>
                    <span className="bg-transparent h-6 w-6 text-2xl block outline-none focus:outline-none">
                      <XMarkIcon />
                    </span>
                  </button>
                </div>
                {/*body*/}
                <div className="relative p-6 flex-auto">
                  <form onSubmit={handleSubmit}>
                    
                    <div className={`relative z-0 w-full mb-6 group`}>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                        placeholder=""
                        value={categoryData.name}
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
                    <Button color={"primary"}>Submit</Button>
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
