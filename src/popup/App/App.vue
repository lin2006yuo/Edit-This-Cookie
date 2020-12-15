<template>
  <div class="main_app" style="width: 200px">
    <!-- <h5>dom选择器</h5>
    <input v-model="inputValue" />
    <button @click="handleClick" class="button button-outline">搜索</button> -->
    <fieldset>
      <label for="nameField">dom选择器</label>
      <input
        v-model="inputValue"
        type="text"
        placeholder="输入要监听的dom元素"
        id="nameField"
      />
      <button @click="handleClick" class="button-primary">
        搜索
      </button>
    </fieldset>
    <span href="">debugger</span>
    <div>
      <button
        @click="handleInsert"
        class="button-primary"
        type="submit"
        value="插入元素"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "app",
  data() {
    return {
      inputValue: "body"
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
      this.sendMessageToContentScript(
        {
          action: "bindDom",
          value: this.inputValue
        },
        (res) => {
          console.log(res.dom)
        }
      )
    },
    handleInsert() {
      this.sendMessageToContentScript({
        action: 'insert'
      })
    },
    sendMessageToContentScript(message, callback) {
      this.getCurrentTabId((tabId) => {
        chrome.tabs.sendMessage(tabId, message, function(response) {
          if (callback && response) callback(response)
        })
      })
    },
    getCurrentTabId(callback) {
      chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        if (callback) callback(tabs.length ? tabs[0].id : null)
      })
    }
  },
  components: {}
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
