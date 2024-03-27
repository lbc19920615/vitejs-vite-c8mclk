import { html, css, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';
import { getTpl } from './base.js';
import './datepicker.js';
import './inputPopover.js';
import './swiper.js';
import './scroll.js';

class MySelectPanel extends LitElement {
  constructor() {
    super();
    this.sindex = 0;
  }
  static styles = css`
   :host {
     display: block;
     width: 200px;
     --my-select-panel-active-color: #3aacff;
   }

  .navbar {
    display: flex;
    
    gap: 10px;
    .item.active {
      color: var(--my-select-panel-active-color);
    }
  }
  .container {
    display: flex;
    width: 100%;
    overflow: auto;
    overflow-x: hidden; 
    .item {
      width: 100%;
      flex-shrink: 0;
    }
  }
  `;

  static get properties() {
    return {
      value: { type: String },
      sindex: { state: true },
    };
  }

  /**
   * @return {Array}
   */
  _buildOptionsFromValue() {
    let arr = this.value.split(',');
    return arr || [];
  }

  _onIndicatorClick(e) {
    let index = parseFloat(e.currentTarget.dataset.index);
    this.sindex = index;
    this.shadowRoot
      .querySelector(`[con-index='${index}']`)
      ?.scrollIntoView({ behavior: 'smooth' });
  }

  render() {
    let self = this;
    let options = this._buildOptionsFromValue();

    let optionIndicators = repeat(
      options,
      (option) => {
        return option;
      },
      (option, index) => {
        let cls = {
          item: true,
          active: index === self.sindex,
        };

        return html`<div  class="${classMap(
          cls
        )}" data-index="${index}" @click="${
          this._onIndicatorClick
        }">${option}</div>`;
      }
    );

    let optionCons = repeat(
      options,
      (option) => {
        return option;
      },
      (option, index) => {
        return html`<div class="item" con-index="${index}" data-index="${index}"><slot name="con${index}"></slot></div>`;
      }
    );

    return html`<div>
      <div class="navbar" >${optionIndicators}</div>
      <div class="container" >${optionCons}</div>
    </div>`;
  }
}
customElements.define('my-select-panel', MySelectPanel);

class MyListPanel extends LitElement {
  constructor() {
    super();
    this.selectedIndex = [];
    this.items = [];
  }

  static get properties() {
    return {
      selectedIndex: { type: Array },
      items: { type: Array },
      itemtpl: { type: String },
    };
  }

  render() {
    let self = this;
    let options = this.items;

    let optionCons = repeat(
      options,
      (option) => {
        return option;
      },
      (option, index) => {
        let itemContent = '';
        if (getTpl(self.itemtpl)) {
          itemContent = getTpl(self.itemtpl)(option, index);
        }

        return html`<div class="item" con-index="${index}" data-index="${index}">${itemContent}</div>`;
      }
    );

    return html`
      <div part="list_con">${optionCons} </div>
    `;
  }
}

customElements.define('my-list-panel', MyListPanel);

class MySelected extends LitElement {
  constructor() {
    super();
  }

  createRenderRoot() {
    return this;
  }

  static get properties() {
    return {
      selectedIndex: { type: Array },
    };
  }

  /**
   * @return {Array}
   */
  get elements() {
    let arr = [...this.children];
    return arr.slice(0, arr.length - 1);
  }

  _updateIndex() {
    this.elements.forEach((v) => {
      v.removeAttribute('item-selected');
    });
    this.selectedIndex.forEach((v) => {
      if (this.elements[v]) {
        this.elements[v].setAttribute('item-selected', 1);
      }
    });
  }

  render() {
    setTimeout(() => {
      this._updateIndex();
    }, 30);
    return html`<div><slot></slot></div>`;
  }
}

customElements.define('my-selected', MySelected);
