import { html, LitElement } from 'lit';

export class MyFieldElement extends LitElement {
  constructor() {
    super();
    this._id = 'field__' + ZID();
  }
  static get properties() {
    return {
      inputattr: {
        type: String,
      },
      value: { type: String },
      sname: { type: String },
      type: { type: String },
    };
  }
  createRenderRoot() {
    return this;
  }
  render() {
    let id = this._id;

    return html`<div>
      <input
        id="${id}"
        name="${this.sname}"
        value="${this.value}"
        type="${this.type}"
        attributes=${spreadAttributes(
          simplerAttrsToObject.toAttribute(this.inputattr)
        )}
      
      /><label for="${id}">${this.children}</label>
      <div></div>
    </div>`;
  }
}
