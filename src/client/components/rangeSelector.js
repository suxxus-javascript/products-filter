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

    bus.subscribe("fetchedProdsEvt", (products) => {
      this.setMaxAndMinPriceValues(getMaxAndMinPrices(products));
    });
  }

  /**
   *
   * @param {object} range
   *
   */
  setMaxAndMinPriceValues(range) {
    //
    if (this.rendered) {
      //
      const input = this.shadowRoot.querySelector("#priceInput");
      input.setAttribute("max", range.maxPrice);
      input.setAttribute("min", range.minPrice);
      input.setAttribute("value", (range.maxPrice - range.minPrice) / 2);
      const span = this.shadowRoot.querySelector("#selectedPrice");

      span.textContent = range.maxPrice.toString();
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
