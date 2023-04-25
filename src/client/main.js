import { SearchBox } from "./components/searchBox";
import { MainMenu } from "./components/leftMenu";
import { Products } from "./components/products";
import { RangeSelector } from "./components/rangeSelector";
//
customElements.define("search-box", SearchBox);
customElements.define("main-menu", MainMenu);
customElements.define("main-products", Products);
customElements.define("range-selector", RangeSelector);

const template = document.createElement("template");
template.innerHTML = `
    <div>
        <slot name="mainLeft"></slot>
        <slot name="mainRight"></slot>
    </div>
`;

/**
 *
 */
class MainPage extends HTMLElement {
  /**
   * render shadow
   */
  render() {
    const shadow = this.attachShadow({ mode: "open" });
    shadow.appendChild(template.content.cloneNode(true));
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
    }
  }
}

customElements.define("main-page", MainPage);

document.querySelector("#app").innerHTML = `
    <main-page>
       <section 
        slot="mainLeft"
        id="main-left">
        <search-box value="test">
            <input type="text"
                slot="searchbox"
                class="border-b-2 border-gray-300 bg-transparent"
                placeholder="search product"/>
        </search-box>
        <h2 class="mt-5 text-xl">Categories</h2>
        <main-menu>
            <ul
             slot="mainMenu"
             class="main-menu">
            </ul>
        </main-menu>
        <range-selector>
          <h3 slot="title">Maximun Price</h3>
        </range-selector>
       </section>
       <!-- -->
       <section 
         slot="mainRight"
         id="main-right">
         <main-products>
            <ul
             slot="products"
             class="products">
            </ul>
         </main-products>
       </section>
    </main-page>
`;
