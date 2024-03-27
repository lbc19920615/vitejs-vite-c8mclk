import { html } from 'lit';
import { classMap } from 'lit/directives/class-map.js';
import { MyFieldElement } from './field.js';

export class MyInputPopoverElement extends MyFieldElement {
  constructor() {
    super();
    this.inputEle = null;
    this.canBlur = true;
  }

  static get properties() {
    let obj = super.properties;
    obj.isPopUp = {
      state: true,
    };
    return obj;
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      this.inputEle = this.children[0].children[0];
    }, 100);
    this.clickHandle = this._clickHandle.bind(this);
    window.addEventListener('click', this.clickHandle);
  }

  disconnectedCallback() {
    window.removeEventListener('click', this.clickHandle);
    super.disconnectedCallback();
  }

  _clickHandle(e) {
    // console.log(e);
    if (this.contains(e.target)) {
      // this.inputEle.focus();
      this.canBlur = false;
    } else {
      this.canBlur = true;
      this.isPopUp = false;
      this.inputEle.blur();
    }
  }

  get zyFormVal() {
    return this.inputEle.value;
  }

  _focus(e) {
    // console.dir(e.currentTarget.nextElementSibling);
    this.isPopUp = true;
  }

  _blur(e) {
    // console.log(this.canBlur);
    if (this.canBlur) {
      return;
    }
    if (e.relatedTarget === null && !this.canBlur) {
      e.target.focus();
    }
  }

  _setVal(v) {
    this.inputEle.value = v;
  }

  render() {
    let cls = {
      'my-target-style-tag': true,
      'my-target-style-tag--show': this.isPopUp,
    };

    let content = '';
    if (this.renderContent) {
      content = this.renderContent({ context: this });
    }

    return html`<div class="my-input-popover__inner"  style="position: realtive">
      <input class="my-anchor-style-tag" @focus="${this._focus}" @blur="${
      this._blur
    }"/>
      <div class="${classMap(cls)}">${content}</div><slot></slot>
    </div>`;
  }
}


