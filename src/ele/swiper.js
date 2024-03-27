import { html, LitElement } from 'lit';
import { repeat } from 'lit/directives/repeat.js';

import { arraysEqual } from './base.js';
import Swiper from 'swiper';
// import Swiper styles
import 'swiper/css';

export class MySwiperElement extends LitElement {
  constructor() {
    super();
    this.swiperEle = null;
  }

  static get properties() {
    return {
      items: {
        type: Array,
      },
      activeIndex: {
        type: Number,
      },
    };
  }

  _prop = 0;

  set activeIndex(val) {
    // console.log('activeIndex', val);
    this._prop = Math.floor(val);
    if (this.swiperEle) {
      // console.log('      activeIndex swiperEle');
      setTimeout(() => {
        this.swiperEle.slideTo(val);
      }, 100);
    }
  }

  get activeIndex() {
    return this._prop;
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
  }

  _initSwiper() {
    if (this.swiperEle?.destroy) {
      // console.log(this.swiperEle);
      this.swiperEle.destroy();
    }
    const elem = this.children[0].children[0];
    this.swiperEle = new Swiper(elem, {
      initialSlide: this.activeIndex,
    });
    // this.swiperEle.init();
  }

  updated(changedProperties) {
    let items = changedProperties.get('items');
    console.log(
      '      this._initSwiper();',
      changedProperties,
      arraysEqual(items, this.items)
    );
    if (!arraysEqual(items, this.items)) {
      this._initSwiper();
    }
  }

  render() {
    let slides = repeat(
      this.items,
      (v) => v,
      (v) => {
        return html`<div class="swiper-slide">Slide ${v}</div>`;
      }
    );

    return html`
      <div style="width: 350px;">
        <div class="swiper">
        <div class="swiper-wrapper">
          <!-- Slides -->
          ${slides}
        </div>
      </div>
      </div>
    `;
  }
}

class MySwiper extends MySwiperElement {
  constructor() {
    super();
  }
}

customElements.define('my-swiper', MySwiper);
