import { html, css, LitElement } from 'lit';
import { Directive, directive } from 'lit/directive.js';
import { ref, createRef } from 'lit/directives/ref.js';
import { classMap } from 'lit/directives/class-map.js';
import { styleMap } from 'lit/directives/style-map.js';
import './ele/base.js';
import './ele/style.css';

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

window.ZID = function () {
  // return window.crypto.randomUUID().replaceAll('-', '_');
  return makeid(20)
};

function createFlatten() {
  var r = [];
  const flatten = (a) => {
    if (a.firstChild === null) {
      r.push(a);
    } else if (a.children.length > 0) {
      var c = a.children;
      Array.from(c).forEach(function (v) {
        r.push(v);
        if (v.firstChild !== null) {
          flatten.apply(this, [v]);
        }
      });
    }
    return r;
  };
  return flatten;
}

class MyDialog extends LitElement {
  constructor() {
    super();
    this.opened = false;
  }

  static get properties() {
    return {
      opened: { type: Boolean },
      title: { type: String },
    };
  }

  render() {
    return html` <style>
        .opened {
          display: flex;
        }
        .closed {
          display: none;
        }
        .dialog {
          flex-direction: column;
          border: 2px outset black;
          padding: 1em;
          margin: 1em;
          background: #fff;
        }
        .buttons {
          display: flex;
          flex-direction: row;
        }
        .accept {
          justify-content: space-around;
          align-content: space-around;
        }
        .cancel {
          justify-content: space-around;
          align-content: space-around;
        }
      </style>
      <div
        class="${classMap({
          dialog: true,
          opened: this.opened,
          closed: !this.opened,
        })}"
      >
        <h3 class="title ">${this.title}</h3>
        <p class="content"><slot></slot></p>
        <div class="buttons">
          <button
            class="accept"
            @click="${() =>
              this.dispatchEvent(new CustomEvent('dialog.accept'))}"
          >
            Ok
          </button>
          <button
            class="cancel"
            @click="${() =>
              this.dispatchEvent(new CustomEvent('dialog.cancel'))}"
          >
            Cancel
          </button>
        </div>
      </div>`;
  }
}

customElements.define('my-dialog', MyDialog);

class MyDropdown extends LitElement {
  constructor() {
    super();
    this.opened = false;
    this.stylemap = {
      left: '0',
      top: '0',
    };
    this.resizeHandler = this._resizeHandler.bind(this);
    window.addEventListener('resize', this.resizeHandler);
  }

  connectedCallback() {
    super.connectedCallback();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    console.log('disconnectedCallback');
    window.removeEventListener('resize', this.resizeHandler);
  }

  static styles = css`
    .dropdown button {
      anchor-name: --my-anchor;
    }

    .dropdown .list {
      position: absolute;
      top: anchor(--my-anchor bottom);
      left: anchor(--my-anchor left);
      right: anchor(--my-anchor right);
      margin: 0;
      border: 1px solid #c5c5c5;
      border-top: 0;
    }

    .dropdown .list-con {
      padding: 0;
      margin: 0;
    }
  `;

  static get properties() {
    return {
      opened: { type: Boolean },
      stylemap: { state: true },
    };
  }

  buttonRef = createRef();

  _resizeHandler() {
    this._fixedcssanchor();
  }

  _fixedcssanchor() {
    if (!('anchorName' in document.documentElement.style)) {
      setTimeout(() => {
        if (this.buttonRef?.value) {
          let rect = this.buttonRef?.value?.getBoundingClientRect();

          this.stylemap.left = rect.left + 'px';
          this.stylemap.top =
            Math.abs(rect.top) + rect.height + window.scrollY + 'px';
          this.requestUpdate();
        }
      }, 100);
    }
  }

  _onTrigger() {
    this._fixedcssanchor();
  }

  _onClickHandler(e) {
    if (e.target !== e.currentTarget) {
      e.currentTarget.parentElement.hidePopover();
      let myEvent = new CustomEvent('item_click', {
        detail: { message: 'item_click', target: e.target },
        bubbles: true,
        composed: true,
      });
      this.dispatchEvent(myEvent);
    }
  }

  render() {
    let id = 'dropdown__' + window.crypto.randomUUID();

    return html`
      <div class="dropdown">
        <button
          ${ref(this.buttonRef)}
          @mousedown="${this._onTrigger}"
          popovertarget="${id}"
        >
          <slot name="trigger"></slot>
        </button>
        <div
          class="list"
          popover="auto"
          id="${id}"
          style=${styleMap(this.stylemap)}
        >
          <div class="list-con" @click="${this._onClickHandler}">
            <slot></slot>
          </div>
        </div>
      </div>
    `;
  }
}
customElements.define('my-dropdown', MyDropdown);

class MyDropdownItem extends LitElement {
  constructor() {
    super();
  }
  static get properties() {
    return {
      value: { type: String },
    };
  }
  render() {
    return html`<div>
      <slot></slot>
      <div></div>
    </div>`;
  }
}
customElements.define('my-dropdown-item', MyDropdownItem);

class MySelect extends LitElement {
  constructor() {
    super();
    this.options = [];
  }
  connectedCallback() {
    let self = this;
    super.connectedCallback();
    setTimeout(() => {
      let children = self._slottedChildren;

      self.options = children.map((v) => {
        return {
          label: v.textContent,
          value: v.value,
        };
      });
      self.requestUpdate();
    }, 30);
  }
  static get properties() {
    return {
      value: { type: String },
      options: { state: true },
      sname: { type: String },
    };
  }
  _handleOptionSelect(e) {
    let { target } = e.detail;
    // console.log('_handleOptionSelect',e.detail.target.value);
    this.value = e.detail.target.value;
  }
  _getSelectedText() {
    let index = this.options.findIndex((v) => v.value === this.value);
    if (index < 0) {
      index = 0;
    }
    return this.options?.length > 0
      ? html`${this.options[index].label}`
      : html`请选择`;
  }

  get zyFormVal() {
    return this.value;
  }

  get _slottedChildren() {
    const slot = this.shadowRoot.querySelector('slot');
    return slot?.assignedElements({ flatten: true });
  }
  render() {
    return html`
      <my-dropdown @item_click=${this._handleOptionSelect}>
        <div slot="trigger">${this._getSelectedText()}</div>
        <slot></slot>
      </my-dropdown>
    `;
  }
}
customElements.define('my-select', MySelect);

class MyOption extends LitElement {
  constructor() {
    super();
  }
  static get properties() {
    return {
      value: { type: String },
    };
  }

  render() {
    return html`<div>
      <slot></slot>
      <div></div>
    </div>`;
  }
}
customElements.define('my-option', MyOption);

window.ZyDialog = function () {
  let obj = {};
  obj.ele = document.createElement('my-dialog');
  obj.ele.classList.add('zy-fixed-dialog');

  obj.ele.addEventListener('dialog.accept', function (e) {
    if (obj.onAction) {
      obj.onAction(e);
    } else {
      obj.hide();
    }
  });

  obj.ele.addEventListener('dialog.cancel', function (e) {
    if (obj.onAction) {
      obj.onAction(e);
    } else {
      obj.hide();
    }
  });

  obj.show = function ({ html = '', title = '' } = '') {
    obj.ele.title = title;
    obj.ele.innerHTML = html;
    obj.ele.setAttribute('opened', true);
  };

  obj.hide = function () {
    obj.ele.removeAttribute('opened');
  };

  obj.mount = function () {
    document.body.appendChild(obj.ele);
  };

  obj.destory = function () {
    document.body.removeChild(obj.ele);
    obj.ele = null;
  };
  return obj;
};
// Create an empty "constructed" stylesheet
const sheet = new CSSStyleSheet();
// Apply a rule to the sheet
sheet.replaceSync(`.zy-fixed-dialog {
                          position: fixed;
    left: 0;
    top: 0;
    z-index: 111111;
                  }

                  `);

// Apply the stylesheet to a document
document.adoptedStyleSheets = [sheet];

const parsingEl = document.createElement('div');
const simplerAttrsToObject = {
  toAttribute: (attrs) => {
    parsingEl.innerHTML = `<div ${attrs}></div>`;
    const el = parsingEl.firstChild;
    const obj = {};
    for (let i = 0; i < el.attributes.length; i++) {
      const attr = el.attributes[i];
      obj[attr.name] = attr.value;
    }
    // console.log(attrs, obj);
    return obj;
  },
};

const attrsMap = new WeakMap();
const spreadAttributes1 = directive((attrs) => (part) => {
  const el = part.committer.element;
  for (let name in attrs) {
    const value = attrs[name];
    if (value != null) {
      el.setAttribute(name, attrs[name]);
    } else {
      el.removeAttribute(name);
    }
  }
  const oldValues = attrsMap.get(part);
  if (oldValues) {
    for (let name in oldValues) {
      if (!(name in attrs)) {
        el.removeAttribute(name);
      }
    }
  }
  attrsMap.set(part, attrs);
});

class HelloDirective extends Directive {
  render(attrs) {
    if (!attrs) {
      return;
    }
    const el = this.__part.element;
    for (let name in attrs) {
      const value = attrs[name];
      if (value != null) {
        el.setAttribute(name, attrs[name]);
      } else {
        el.removeAttribute(name);
      }
    }
    // const oldValues = attrsMap.get(part);
    // if (oldValues) {
    //   for (let name in oldValues) {
    //     if (!(name in attrs)) {
    //       el.removeAttribute(name);
    //     }
    //   }
    // }
    // attrsMap.set(part, attrs);
  }
}
// Create the directive function
const spreadAttributes = directive(HelloDirective);

class MyFieldElement extends LitElement {
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

class MyRadio extends MyFieldElement {
  constructor() {
    super();
    this.type = 'radio';
  }
}
customElements.define('my-radio', MyRadio);

class MyCheckbox extends MyFieldElement {
  constructor() {
    super();
    this.type = 'checkbox';
  }
}
customElements.define('my-checkbox', MyCheckbox);

class MyInput extends MyFieldElement {
  constructor() {
    super();
  }
}
customElements.define('my-input', MyInput);

class ZyFormData {
  constructor(formDom) {
    let flatFun = createFlatten();
    let nodes = flatFun(formDom);
    //console.log(nodes);
    let base = new FormData(formDom);
    nodes.forEach((node) => {
      if (typeof node.zyFormVal !== 'undefined') {
        base.set(node.sname, node.zyFormVal);
      }
    });
    return base;
  }
}
window.ZyFormData = ZyFormData;
