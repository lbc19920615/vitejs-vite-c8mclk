<script setup>
import './user.js';
import { onMounted, ref } from 'vue';
const myform = ref(null);

defineProps({
  msg: String,
});

const count = ref(0);
onMounted(() => {
  let formData = () => {
    return new ZyFormData(myform.value);
  };
  window.formData = formData;
});

function handleSubmit() {
  let f = formData();
  window.zyAlert(f.get('radio1'));
}

const selectedArr = ref([0]);

const opts = ref([]);

opts.value[0] = 'opt1';

function selectLevel(level = 0) {
  if (level === 1) {
    opts.value[1] = 'opt2';
  }
  if (level === 2) {
    opts.value[2] = 'opt3';
  }
}

function onSetOption(index) {
  selectedArr.value[0] = index;
}

const items = ref(['item1']);

let itemtplstr = ref('itemtpl1');

window.ZYE.setTpl('itemtpl1', function (lit) {
  const { html } = lit;
  return (item, index) => {
    return html`index1: ${index} ${item}`;
  };
});

window.ZYE.setTpl('itemtpl2', function (lit) {
  const { html } = lit;
  return (item, index) => {
    return html`index2: ${index} ${item}`;
  };
});

function changeLitTpl() {
  let v = itemtplstr.value;
  itemtplstr.value = v == 'itemtpl1' ? 'itemtpl2' : 'itemtpl1';
}
</script>

<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="count++">count is {{ count }}</button>
  </div>

  <button popovertarget="mypopover">Toggle the popover</button>
<div id="mypopover" popover>Popover content</div>

  <form ref="myform" id="myform">
    <p>input</p>
    <my-input sname="input1" type="text"></my-input>
    <my-datepicker sname="input2"></my-datepicker>
    <app-input-popover sname="input3"></app-input-popover>

    <p>radio</p>
    <my-radio sname="radio1" value="ra1"><span>radio1 option1</span></my-radio>
    <my-radio sname="radio1" value="ra2"><span>radio1 option2</span></my-radio>

    <p>checkbox</p>
    <my-checkbox sname="checkbox1" value="ck1"
      ><span>checkbox1 option1</span></my-checkbox
    >
    <my-checkbox sname="checkbox1" value="ck2"
      ><span>checkbox1 option2</span></my-checkbox
    >

    <p>select</p>
    <my-select sname="select1" value="1">
      <my-option value="1">Menu Item 1</my-option>
      <my-option value="2">Menu Item 2</my-option>
    </my-select>

    <p>extend</p>

    <my-select-panel :value="opts.join(',')">
      <div slot="con0">
        <scrollable-component class="my-content">
          111
          <div @click="selectLevel(1)">item1</div>
          <div style="height: 300px"></div>
          end
        </scrollable-component>
      </div>
      <div slot="con1">
        <scrollable-component class="my-content">
          222
          <div @click="selectLevel(2)">item2</div>
          <div style="height: 300px"></div>
          end
        </scrollable-component>
      </div>
      <div slot="con2">
        <scrollable-component class="my-content">
          222
          <div @click="selectLevel(3)">item3</div>
          <div style="height: 300px"></div>
          end
        </scrollable-component>
      </div>
    </my-select-panel>

    <p>自动加active</p>
    <my-selected class="row" :selectedIndex="[...selectedArr]">
      <div v-for="(option, index) in opts" @click="onSetOption(index)">
        {{ option }}
      </div>
    </my-selected>

    <!-- <HelloSwiper :activeIndex="selectedArr[0]" :items="opts"></HelloSwiper> -->

    <my-swiper :activeIndex="selectedArr[0]" :items="[...opts]"></my-swiper>

    <p>列表自定义渲染</p>
    <button type="button" @click="changeLitTpl">changeLitTpl</button>
    <my-list-panel :items="[...items]" :itemtpl="itemtplstr"> </my-list-panel>

    <p>滚动</p>
    <my-scroller></my-scroller>

    <p>富文本</p>
    <my-editor></my-editor>
  </form>

  <button @click="handleSubmit">提交</button>
</template>

<style>
.my-content {
  height: 200px;
}

.row {
  display: flex;
  gap: 10px;
}

.list::part(list_con) {
  height: 200px;
}

[item-selected] {
  color: var(--app-color-blue);
}
</style>
