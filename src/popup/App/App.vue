<template>
  <div class="main_app">
    <div>
      <div>
        <h2>Filter</h2>
        <input v-model="filter" />
      </div>
      <div
        class="c-cookie-item"
        v-for="(cookie, index) in filterCookies"
        :key="index"
      >
        <input type="text" v-model="cookie.name" />
        <input type="text" v-model="cookie.value" />
        <button @click="handleEdit(cookie, index)">修改</button>
        <button @click="handleDelete(cookie, cookie.name)">删除</button>
        <!-- <button>复制</button> -->
      </div>
    </div>
    <div>
      <h2>预设</h2>
      <div class="c-cookie-item">
        <span>cms_key</span>
        <select v-model="preCmsKey">
          <option disabled>请选择</option>
          <option>qcg</option>
          <option>miaotest</option>
          <option>ddmc</option>
        </select>
        <button
          @click="
            handleEdit(cookie, null, { name: 'cms_key', value: preCmsKey })
          "
        >
          修改
        </button>
      </div>
      <div class="c-cookie-item">
        <span>cshop_cms_key</span>
        <select v-model="preCshopCmsKey">
          <option disabled>请选择</option>
          <option>gmxls</option>
        </select>
        <button
          @click="
            handleEdit(cookie, null, { name: 'cshop_cms_key', value: preCshopCmsKey })
          "
        >
          修改
        </button>
      </div>
    </div>
  </div>
</template>

<script>
const GM_COOKIES_KEY = ["cms_key", "sessionid", "group"]
export default {
  name: "app",
  data() {
    return {
      filter: "gm",
      cookies: [],
      currentTabURL: "",
      currentTabId: "",

      preCmsKey: "",
      preCshopCmsKey: "",
    }
  },
  computed: {
    filterCookies() {
      if (this.filter === "gm") {
        return this.cookies.filter((cookie) => {
          let flag = false
          for (const key of GM_COOKIES_KEY) {
            if (cookie.name.includes(key)) {
              flag = true
              break
            }
          }
          return flag
        })
      }
      return this.cookies
    },
  },
  mounted() {
    const { chrome } = window
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true,
      },
      (tabs) => {
        const currentTabURL = tabs[0].url
        const currentTabId = tabs[0].id
        this.currentTabId = currentTabId
        this.currentTabURL = currentTabURL
        chrome.cookies.getAll(
          {
            url: currentTabURL,
          },
          (cookies) => {
            console.log(cookies)
            // domain: "www.huya.com"
            // expirationDate: 1588345525
            // hostOnly: true
            // httpOnly: false
            // name: "vplayer_sbanner_1447933316_1447933316"
            // path: "/293684"
            // sameSite: "unspecified"
            // secure: false
            // session: false
            // storeId: "0"
            // value: "1"
            this.cookies = cookies
          }
        )
      }
    )
  },
  methods: {
    handleEdit(cookie, index, options = {}) {
      let name, value
      if (index) {
        name = cookie.name
        value = this.filterCookies[index].value
      } else {
        name = options.name
        value = options.value
      }
      const { chrome } = window
      chrome.cookies.set({
        url: this.currentTabURL,
        name,
        value,
      })
      this.handleDelete(cookie, "sessionid")
    },
    handleDelete(cookie, name) {
      const { chrome } = window
      chrome.cookies.remove({
        url: this.currentTabURL,
        name,
      })
      this.handleReload()
    },
    handleReload() {
      const { chrome } = window
      chrome.tabs.reload(this.currentTabId)
    },
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
</style>
