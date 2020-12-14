import Vue from "vue";
import AppComponent from "./App/App.vue";
import '../assets/style.styl'
// eslint-disable-next-line
import '../script/content-script'
import '../assets/img/icon_32x32.png'
import 'milligram/dist/milligram.css'

Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
