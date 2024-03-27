<script setup>
import { Swiper, SwiperSlide } from 'swiper/vue';
// Import Swiper styles
import 'swiper/css';
import { onMounted, ref,watch } from 'vue';

let swiper1 = null;
function onSwiper(swiper) {
  swiper1 = swiper;
}

let props = defineProps({
  activeIndex: Number,
  items: Array
});

watch(() => props.activeIndex, (newVal) => {
  //console.log('activeIndex', newVal);
  swiper1.slideTo(newVal);
})

</script>

<template>
    <swiper
      :slides-per-view="1"
      :space-between="50"
      :active-index="activeIndex"
      @swiper="onSwiper"
      style="width: 350px"
    >
      <swiper-slide v-for="(option, index) in items"
        >Slide {{ index }}</swiper-slide
      >
    </swiper>
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
</style>
