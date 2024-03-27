import { LitElement, html } from "lit";
import Quill from "quill";
import "quill/dist/quill.snow.css";

class MyEditorELement extends LitElement {
    constructor() {
        super();
        this.editorEle = null;
        this._needFocus = false;
        this.listEle = null;
        this._curRange = null;
    }

    createRenderRoot() {
        return this
    }

    connectedCallback() {
        let self = this;
        super.connectedCallback();
        setTimeout(() => {
            this.editorEle = new Quill(this.children[0].children[1], {
                modules: { toolbar: this.children[0].children[0] },
                theme: 'snow'
            });

            this.editorEle.on('selection-change', function (range, oldRange, source) {
                if (!range && oldRange && self._needFocus) {
                    //blur occured 
                    self.editorEle.setSelection(oldRange);
                } 
                self._curRange = range
            });
            this.clickHandle = this._clickHandle.bind(this);
            window.addEventListener('mousedown', this.clickHandle);

            this.listEle  = this.children[0].children[2]
        }, 100)
    }

    disconnectedCallback() {
        window.removeEventListener('mousedown', this.clickHandle);
        super.disconnectedCallback();
      }

      _clickHandle(e) {
        console.log(e.target, this.contains(e.target));
        if (!this.contains(e.target)) {
          // this.inputEle.focus();
          this._needFocus = false;
        }  else {
            this._needFocus = true;
        }
      }

    _getSelection() {
        return new Promise(resolve => {
            const range = this.editorEle.getSelection();
            if (range) {
                if (range.length == 0) {
                    console.log('User cursor is at index', range.index);
                    resolve(range)
                } else {
                    // const text =  this.editorEle.getText(range.index, range.length);
                    // console.log('User has highlighted: ', text);
                    resolve(range)
                }
            } else {
                console.log('User cursor is not in editor');
            }
        })
    }

    _toggleList() {
        setTimeout(() => {
            console.log(   this._curRange )
            this.editorEle.setSelection( this._curRange);
        }, 100)
        this.listEle.classList.toggle('my-target-style-tag--show')
    }

    _handleBtn1() {
        this._needFocus = true;
        this._getSelection().then(range => {
            this.editorEle.insertText(range.index, 'Hello', 'link', 'https://world.com');
            this._needFocus = false;
        })
    }


    render() {
        return html`
<div style="position: relative">
<div id="toolbar">
<button id="custom-button" style="anchor-name: --my-anchor-link-tag;"  @click="${this._toggleList}" type="button" >$</button>
</div>


<div id="editor">
<p></p>
</div>
<div style=" top: anchor(--my-anchor-link-tag bottom);
left: anchor(--my-anchor-link-tag start); position: absolute;"  class="my-target-style-tag--init" > 
<div @click="${this._handleBtn1}">Popover content</div></div>

</div>
        `
    }
}

class MyEditor extends MyEditorELement {
    constructor() {
        super()
    }
}

customElements.define('my-editor', MyEditor)