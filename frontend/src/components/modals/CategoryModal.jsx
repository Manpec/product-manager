import React from "react";
import Button from "../Button";

function CategoryModal({ category, closeModal }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none">
      <div className="relative w-auto max-w-3xl mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-lg outline-none focus:outline-none">
          <div className="relative p-6 flex-auto">
            <h3 className="text-3xl font-semibold mb-10 text-gray-900">
              {" "}
              {category.name}{" "}
            </h3>
            <table className="table-auto">
              <thead>
                <tr>
                  {category?.products?.length > 0 ? (
                    Object.keys(category?.products?.[0]).map((key) => (
                      <th
                        key={key}
                        scope="col"
                        className="px-6 py-3 text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400"
                      >
                        {key}
                      </th>
                    ))
                  ) : (
                    <th scope="col" className="px-6 py-3">
                      No Product
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {category.products.map((product) => (
                  <tr key={product.id} className=" text-gray-600">
                    <td className="px-6 py-4">{product.id}</td>
                    <td className="px-6 py-4">{product.sku}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.description}</td>
                    <td className="px-6 py-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-12 h-12"
                      />
                    </td>
                    <td className="px-6 py-4">{product.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-end p-6 border-t border-solid border-gray-300 rounded-b">
            <Button color={"danger"} type="button" onClick={closeModal}>
              CLOSE
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoryModal;
