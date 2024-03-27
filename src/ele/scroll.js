import BScroll from '@better-scroll/core';
import Wheel from '@better-scroll/wheel';
import { LitElement, css, html } from 'lit';
BScroll.use(Wheel);
import { repeat } from 'lit/directives/repeat.js';
import { classMap } from 'lit/directives/class-map.js';

const DATA = [
  {
    text: 'Venomancer',
    value: 1,
    disabled: 'wheel-disabled-item',
  },
  {
    text: 'Nerubian Weaver',
    value: 2,
  },
  {
    text: 'Spectre',
    value: 3,
  },
  {
    text: 'Juggernaut',
    value: 4,
  },
  {
    text: 'Karl',
    value: 5,
  },
  {
    text: 'Zeus',
    value: 6,
  },
  {
    text: 'Witch Doctor',
    value: 7,
  },
  {
    text: 'Lich',
    value: 8,
  },
  {
    text: 'Oracle',
    value: 9,
  },
  {
    text: 'Earthshaker',
    value: 10,
  },
];

class MyScroller extends LitElement {
  constructor() {
    super();
    this.wheelEle = null;
  }

  static styles = css`
  .wheel-wrapper {
    display: flex;
    padding: 0 16px;
  }
  .wheel {
    flex: 1;
    width: 1%;
    height: 173px;
    overflow: hidden;
    font-size: 18px;
  }
  .wheel-scroll {
    padding: 0;
    margin-top: 68px;
    line-height: 36px;
    list-style: none;
  }
  .wheel-item {
    list-style: none;
    height: 36px;
    overflow: hidden;
    white-space: nowrap;
    color: #333;
  }
  .wheel-item.wheel-disabled-item {
    opacity: 0.2;
  }

  .border-bottom-1px, .border-top-1px {
    position: relative;
    &:before, &:after {
      content: "";
      display: block;
      position: absolute;
      transform-origin: 0 0;
    }
  }
.border-bottom-1px:after {
  border-bottom: 1px solid #ebebeb;
  left: 0;
  bottom: 0;
  width: 100%;
  transform-origin: 0 bottom;
}
.border-top-1px:before {
  border-top: 1px solid #ebebeb;
  left: 0;
  top: 0;
  width: 100%;
  transform-origin: 0 top;
}
@media (-webkit-min-device-pixel-ratio: 2), (min-device-pixel-ratio: 2) {
  .border-top-1px: before {
    width: 200%;
    transform: scale(.5) translateZ(0);
  }
  .border-bottom-1px:after {
    width: 200%;
    transform: scale(.5) translateZ(0);
  }
}

@media (-webkit-min-device-pixel-ratio: 3), (min-device-pixel-ratio: 3) {
  .border-top-1px:before {
    width: 300%;
    transform: scale(.333) translateZ(0);
  }
  .border-bottom-1px:after {
    width: 300%;
    transform: scale(.333) translateZ(0);
  }
}

.picker-content {
  position: relative;
}
.mask-top, .mask-bottom {
  z-index: 10;
  width: 100%;
  height: 68px;
  pointer-events: none;
  transform: translateZ(0);
}
.mask-top {
  position: absolute;
  top: 0;
  background: linear-gradient(to top, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
}
.mask-bottom {
  position: absolute;
  bottom: 1px;
  background: linear-gradient(to bottom, rgba(255, 255, 255, 0.4), rgba(255, 255, 255, 0.8));
}

  `;

  static get properties() {
    return {
      selectedIndex: {
        type: Number,
      },
    };
  }

  connectedCallback() {
    super.connectedCallback();
    setTimeout(() => {
      console.log(this.children[0]);
      let wheelWrapper = this.shadowRoot.querySelector('#wrapper').children[0];
      this.wheelEle = new BScroll(wheelWrapper, {
        wheel: {
          selectedIndex: this.selectedIndex,
          wheelWrapperClass: 'wheel-scroll',
          wheelItemClass: 'wheel-item',
          wheelDisabledItemClass: 'wheel-disabled-item',
        },
        useTransition: false,
        probeType: 3,
      });
    }, 100);
  }
  render() {
    // <li

    // :class="{'wheel-disabled-item':item.disabled}"
    // class="wheel-item">{{item.text}}</li>

    let content = repeat(
      DATA,
      (v) => v,
      (v) => {
        let cls = {
          'wheel-item': true,
          'wheel-disabled-item': v.disabled,
        };
        return html`<li class="${classMap(cls)}">${v.text}</li>`;
      }
    );

    return html`
    <div class="picker-content">
      <div class="mask-top border-bottom-1px"></div>
      <div class="mask-bottom border-top-1px"></div>
      <div class="wheel-wrapper" id="wrapper">
        <div class="wheel">
          <ul class="wheel-scroll">
          ${content}
            </ul>
          </div>
      </div>
    </div>
    `;
  }
}

customElements.define('my-scroller', MyScroller);
