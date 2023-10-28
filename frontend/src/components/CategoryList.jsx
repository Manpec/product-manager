import React, { useState } from "react";
import CategoryModal from "./modals/CategoryModal";
import AddCategoryModal from "./modals/AddCategoryModal";

const CategoryList = ({ categories, onAddCategory}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const openModal = (category) => {
    setSelectedCategory(category);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setShowModal(false);
  };


  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Categories
        </h2>
        <div className="flex flex-1 justify-end">
          <AddCategoryModal title="+ New Category" onAddCategory={onAddCategory}/>
        </div>
        <section className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5">
          {categories?.map((category) => (
            <div
              className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl cursor-pointer"
              onClick={() => {
                openModal(category);
              }}
              key={category.id}
            >
              <div className="px-4 py-3 w-72">
                <p className="text-lg font-bold text-black truncate block capitalize">
                  {category.name}
                </p>
              </div>
            </div>
          ))}
        </section>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto">
            <div
              className="fixed inset-0 bg-black opacity-50"
              onClick={closeModal}
            />
            <CategoryModal
              category={selectedCategory}
              closeModal={closeModal}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryList;
