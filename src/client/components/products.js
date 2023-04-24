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
 */
export class Products extends HTMLElement {
  products = [];

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
  }

  /**
   */
  async fetchProducts() {
    try {
      const response = await fetch("/products");
      const data = await response.json();
      const ok = validateJson(data);

      if (ok) {
        return data;
      } else {
        return [];
      }
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

      this.products = (await this.fetchProducts()) || [];

      const productsElm = document.querySelector(".products");
      const products = [];

      this.products.forEach((item) => {
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
  }

  /**
   *@param {evebt} e
   */
}
