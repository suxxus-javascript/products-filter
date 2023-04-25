import bus from "../eventBus";

const template = document.createElement("template");

template.innerHTML = `
 <style>
  ::slotted(input) {
    width: 100%;
  }
</style>
 <slot name="searchbox"></slot>
`;

/**
 * Searbox
 * input element
 */
export class SearchBox extends HTMLElement {
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

      const slot = this.shadowRoot.querySelector("slot");
      slot.addEventListener("input", this.inputEventHandler);
    }
  }

  /**
   *@param {event} e
   */
  inputEventHandler(e) {
    bus.publish("filterProds", e.target.value);
  }
}
