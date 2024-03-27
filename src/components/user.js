import { html } from 'lit';
import { MyInputPopoverElement } from '../ele/inputPopover.js';

class MyInputPopover extends MyInputPopoverElement {
  constructor() {
    super();
  }

  _handleClick(context) {
    context._setVal('test' + Date.now());
  }

  renderContent({ context } = {}) {
    return html`<div @click=${(e) => {
      this._handleClick(context, e);
    }}>my-target-style-tag</div>`;
  }
}

customElements.define('app-input-popover', MyInputPopover);
