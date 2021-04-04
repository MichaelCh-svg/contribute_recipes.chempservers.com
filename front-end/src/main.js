import Vue from 'vue'
import App from './App.vue'
import router from './router'
// import mock from "./images.js";

Vue.config.productionTip = false

let data = {
  // products: mock,
  cart: [],
  index: "",
  quantity: [],
  numItems: 0,
  comments: [],
  currentRecipe: null,
  recipe: {},
};

new Vue({
  router,
  data,
  render: h => h(App)
}).$mount('#app')
