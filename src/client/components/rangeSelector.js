import bus from "../eventBus";

const template = document.createElement("template");
template.innerHTML = `
       <slot name="title"></slot>
       <div class="price-range-selector">
         <input 
            type="range" 
            step="10" 
            class="slider" 
            id="priceInput" 
            max="1" 
            min="1">
         <span>$</span><span id="selectedPrice"></span>
       </div>
`;

const getMaxAndMinPrices = (products) => {
  //
  const buffer = 2;
  const prices = products.map(({ price }) => price);
  const maxPrice = Math.ceil(Math.max.apply(null, prices) + buffer);
  const minPrice = Math.floor(Math.min.apply(null, prices) - buffer);

  return {
    maxPrice,
    minPrice,
  };
};

/**
 *
 */
export class RangeSelector extends HTMLElement {
  /**
   * render shadow
   */
  render() {
    const shadow = this.attachShadow({ mode: "open" });
    const rangeInstance = template.content;
    shadow.appendChild(rangeInstance.cloneNode(true));
  }

  /**
   *
   */
  constructor() {
    super();

    bus.subscribe("productsUpdated", (products) => {
      this.setMaxAndMinPriceValues(getMaxAndMinPrices(products));
    });
  }

  /**
   *
   * @param {object} range
   *
   */
  setMaxAndMinPriceValues({ maxPrice, minPrice }) {
    //
    if (this.rendered) {
      //
      const input = this.shadowRoot.querySelector("#priceInput");
      input.setAttribute("max", maxPrice);
      input.setAttribute("min", minPrice);
      input.setAttribute("value", Math.round(maxPrice));

      const span = this.shadowRoot.querySelector("#selectedPrice");
      span.textContent = maxPrice.toString();
    } else {
      //
      console.error("Not rendered");
    }
  }

  /**
   *
   */
  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;

      const input = this.shadowRoot.querySelector("#priceInput");

      input.addEventListener("input", (evt) => {
        bus.publish("filterByPriceEvt", evt.target.value);
      });
    }
  }
}
