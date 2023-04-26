const template = document.createElement("template");

template.innerHTML = `
 <style>
  ::slotted(input) {
    width: 100%;
  }
</style>
 <slot name="mainMenu"></slot>
`;

/**
 * Searbox
 * input element
 */
export class MainMenu extends HTMLElement {
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
   *
   */
  connectedCallback() {
    if (!this.rendered) {
      this.render();
      this.rendered = true;

      const mainMenuElm = document.querySelector(".main-menu");
      const menuItems = [];

      this.categories.forEach((item) => {
        menuItems.push(`
         <li class="border-b-2 border-gray-200 mb-4">
            <a href="${item.link}" class="block" data-navigo>${item.title}</a>
         </li>
        `);
      });

      mainMenuElm.innerHTML = menuItems.join("");
    }
  }

  /**
   *@param {evebt} e
   */
}
