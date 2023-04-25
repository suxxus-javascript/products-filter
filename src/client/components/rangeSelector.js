const template = document.createElement("template");
template.innerHTML = `
       <slot name="title"></slot>
       <div class="price-range-selector">
         <input type="range" step="10" class="slider" id="priceInput" max="1751" min="11">
         <span>$</span><span id="selectedPrice">741</span>
       </div>
`;

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
        console.log(evt.target.value);
      });
    }
  }
}
