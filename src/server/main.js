const express = require("express");
const ViteExpress = require("vite-express");
const axios = require("axios");

const app = express();

const ALL_PRODUCTS_URL = "https://dummyjson.com/products";

/**
 * GET fetch helper
 *
 * @param {string} url
 */
async function doFetch(url) {
  try {
    const response = await axios.get(url);
    return response;
  } catch (e) {
    console.error(e.message);
  }
}

const prodData = (() => {
  let prods = [];

  return {
    setProducts: (data) => {
      prods = data;
    },
    getProducts: () => prods,
  };
})();

app.get("/products", (_, res) => {
  const products = prodData.getProducts();
  if (products.length > 0) {
    res.send(products);
  } else {
    doFetch(ALL_PRODUCTS_URL).then(({ data }) => {
      prodData.setProducts(
        data.products.reduce((acc, value) => {
          const { id, title, description, price, brand, category, thumbnail } =
            value;

          return [
            ...acc,
            {
              id,
              title,
              description,
              price,
              brand,
              category,
              thumbnail,
            },
          ];
        }, [])
      );
      res.send(prodData.getProducts());
    });
  }
});

ViteExpress.listen(app, 3000, () =>
  console.log("Server is listening on port 3000...")
);
