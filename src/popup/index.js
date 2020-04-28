import Vue from "vue";
import AppComponent from "./App/App.vue";
import '../assets/style.styl'

Vue.component("app-component", AppComponent);

new Vue({
  el: "#app",
  render: createElement => {
    return createElement(AppComponent);
  }
});
