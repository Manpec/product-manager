import React from "react";
const ProductCatalog = ({ products }) => {
  return (
    <div>
      <div className="bg-white">
        <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            Products
          </h2>

          <div className="mt-6 grid grid-cols-4 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {products.length > 0 ? (
              products?.map((product, index) => (
                <div key={product.id || index} className="group relative">
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className="mt-4 flex flex-col justify-between">
                    <h3 className="text-sm text-gray-700">
                      <a href="#">
                        <span
                          aria-hidden="true"
                          className="absolute inset-0"
                        ></span>
                        {product.name} ({product.sku})
                      </a>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {product.description}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      {product.price} SEK
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div>No Data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCatalog;
