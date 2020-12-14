<template>
  <div class="main_app">
    <h5>dom选择器</h5>
    <input v-model="inputValue" />
    <button @click="handleClick" class="button button-outline">搜索</button>
  </div>
</template>

<script>
import qs from "query-string"
import { filterByKeys, getOptions } from "./util"
import Input from "../../components/input"
import Button from "../../components/button"
import Select from "../../components/select"
import PannelItem from "../../components/pannel-item"

const GM_COOKIES_KEY = ["cms_key", "cshop_cms_key", "sessionid", "group_id"]
export default {
  name: "app",
  data() {
    return {
      inputValue: ".",
    }
  },
  computed: {},
  mounted() {},
  methods: {
    handleClick() {
      let dom
      try {
        dom = document.querySelector(this.inputValue)
      } catch {
        alert("选择器不合法")
        return
      }
      console.log(dom)
      if (!dom) {
        alert("找不到元素")
      }
    },
    sendMessageToContentScript(message, callback) {
      this.getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function(response) {
          if (callback) callback(response)
        })
      })
    },
    getCurrentTabId(callback) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null)
      })
    },
  },
  components: {
    Input,
    Button,
    Select,
    PannelItem,
  },
}
</script>

<style>
.main_app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
.c-cookie-item {
  display: flex;
}
.c-cms_key {
  color: #4caf50;
  font-size: 20px;
  font-weight: bold;
}
.c-cshop-cms_key {
  color: #ff9800;
  font-size: 20px;
  font-weight: bold;
}
</style>
