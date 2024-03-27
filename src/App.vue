<script setup>
import HelloWorld from './components/HelloWorld.vue';

let dialog = window.ZyDialog();
dialog.mount();
window.zyAlert = function (text = '') {
  dialog.show({
    title: '提示',
    html: text,
  });
};
</script>

<template>
  <HelloWorld msg="Lit + Vue" />
</template>

<style>
:root {
  --app-color-blue: #3aacff;
}
</style>
