import React from "react";
import Button from "./Button";
import Modal from "./Modal";

const ProductList = ({ products }) => {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Products
        </h2>
        <div className="flex flex-1 justify-end">
          <Modal title="Ny Produkt" />
        </div>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                {products.length > 0 ? (
                  Object.keys(products[0]).map((key) => (
                    <th key={key} scope="col" className="px-6 py-3">
                      {key}
                    </th>
                  ))
                ) : (
                  <th scope="col" className="px-6 py-3">
                    No Data
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.sku}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover-bg-gray-50 dark-hover-bg-gray-600"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark-text-white"
                  >
                    {product.name}
                  </th>
                  <td className="px-6 py-4">{product.sku}</td>
                  <td className="px-6 py-4">{product.description}</td>
                  <td className="px-6 py-4">{product.image}</td>
                  <td className="px-6 py-4">{product.price}</td>
                  <td className="px-6 py-4 text-right">
                    <Button color={"bright"}>Edit</Button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button color={"danger"}>Delete</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
