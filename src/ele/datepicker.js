import { html } from 'lit';
import { MyFieldElement } from './field.js';
import { Datepicker } from 'vanillajs-datepicker';
import 'vanillajs-datepicker/css/datepicker-bs5.css';

class MyDatepicker extends MyFieldElement {
  constructor() {
    super();
    this.datepicker = null;
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      const elem = this.children[0].children[0];
      this.datepicker = new Datepicker(elem, {
        format: 'yyyy-mm-dd',
      });
    }, 100);
  }

  _changeDate(v) {
    // console.log('changeDate', v);
    // this.value = this.children[0].children[0].value;
  }

  get zyFormVal() {
    return this.children[0].children[0].value;
  }

  render() {
    return html`<div class="my-datepciker__inner"><input @changeDate="${this._changeDate}" type="text" ></div>`;
  }
}

customElements.define('my-datepicker', MyDatepicker);
