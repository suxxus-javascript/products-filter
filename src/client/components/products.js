import bus from "../eventBus";

const template = document.createElement("template");

template.innerHTML = `
 <style>
  ::slotted(input) {
    width: 100%;
  }
</style>
 <slot name="products"></slot>
`;

/**
 * given an unknown object validate it
 *
 * @param {array} data
 *
 * @return {boolean}
 */
function validateJson(data) {
  let isValid = true;

  if (Array.isArray(data)) {
    const len = data.length;
    let i = 0;

    while (i < len) {
      const { id, title, description, price, brand, category, thumbnail } =
        data[i];

      [
        {
          value: id,
          type: "number",
          name: "id",
        },
        {
          value: title,
          type: "string",
          name: "title",
        },
        {
          value: description,
          type: "string",
          name: "description",
        },
        {
          value: price,
          type: "number",
          name: "price",
        },
        {
          value: brand,
          type: "string",
          name: "brand",
        },
        {
          value: category,
          type: "string",
          name: "category",
        },
        {
          value: thumbnail,
          type: "string",
          name: "thumbnail",
        },
      ].forEach(({ value, type, name }) => {
        const currentType = typeof value;
        const ok = currentType === type;
        const position = i;

        if (!ok) {
          isValid = false;
          console.error(
            `Array at ${position}: ${name} expected ${type} got ${currentType}`
          );
        }
      });

      i++;
    }
  } else {
    isValid = false;
    console.error("expected an array");
  }

  return isValid;
}

/**
 * @param {string} str
 * @param {array} products
 *
 * @return {array}
 */
function doSearchProductByTitle(str, products) {
  //
  const minLength = 1;
  const productLen = products.length;
  let i = 0;

  const found = [];
  //
  if (str.length >= minLength) {
    while (i < productLen) {
      const product = products[i];
      const title = product?.title.toUpperCase() || "";
      if (title.includes(str.toUpperCase())) {
        found.push(product);
      }
      i++;
    }
  }

  return found;
}

/**
 */
export class Products extends HTMLElement {
  _products = [];

  /**
   *
   */
  render() {
    const shadowRoot = this.attachShadow({ mode: "open" });
    shadowRoot.appendChild(template.content.cloneNode(true));
  }

  /**
   *
   */
  constructor() {
    super();

    // TODO remove declared function
    bus.subscribe("filterProds", (value) => {
      this.onFilterStrChange(value);
    });

    bus.subscribe("filterByPriceEvt", this.onPriceRangeChange.bind(this));
    bus.subscribe("filterByCategory", this.onCategoryChange.bind(this));
  }

  /**
   *
   */
  get products() {
    return this._products;
  }

  /**
   * @param {object} value
   */
  set products(value) {
    this._products = value;
  }

  /**
   * @param {array} items
   */
  doProducts(items) {
    const productsElm = document.querySelector(".products");
    const products = [];

    items.forEach((item) => {
      products.push(`
           <li class="grid-item">
             <a data-category="${item.category}" href="#">
               <img class="grid-item-img-mini" src="${item.thumbnail}" alt="${item.title}">
             </a>
             <ul>
              <li>${item.title}</li>
              <li class="product-price">$${item.price}</li>
             </ul>
           </li>
        `);
    });

    productsElm.innerHTML = products.join("");
  }

  /**
   *
   * @param {string} category
   */
  onCategoryChange(category) {
    const products =
      category.toUpperCase() === "ALL"
        ? this.products
        : this.products.filter(
            (product) =>
              product.category.toUpperCase() === category.toUpperCase()
          );

    this.doProducts(products);
  }

  /**
   * @param {number} value
   */
  onPriceRangeChange(value) {
    const maxPrice = parseFloat(value);
    const isValid = typeof maxPrice === "number" && !isNaN(maxPrice);

    if (isValid) {
      const max = Math.ceil(value);
      const products = this.products.filter((product) => product.price <= max);
      this.doProducts(products);
    } else {
      console.error(`expected number type, got ${maxPrice}`);
    }
  }

  /**
   * @param {string} value
   */
  onFilterStrChange(value) {
    const filtered = value
      ? doSearchProductByTitle(value, this.products)
      : this.products;

    this.doProducts(filtered);
  }

  /**
   * @param {array} products
   *
   * @return {array} with filtered products
   */
  onProductFetched(products) {
    const categoriesNames = this.categories.map((cat) =>
      cat.title.toUpperCase()
    );

    return products.filter(({ category }) =>
      categoriesNames.includes(category.toUpperCase())
    );
  }

  /**
   *
   */
  async fetchProducts() {
    try {
      const response = await fetch("/products");
      const data = await response.json();
      const ok = validateJson(data);

      return ok ? data : [];
    } catch (e) {
      console.error(e.message);
    }
  }

  /**
   *
   */
  async connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;
      this.products = this.onProductFetched((await this.fetchProducts()) || []);
      bus.publish("fetchedProdsEvt", JSON.parse(JSON.stringify(this.products)));
      this.doProducts(this.products);
    }
  }
}
