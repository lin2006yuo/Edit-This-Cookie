<template>
  <div class="main_app">
    <div class="c-panel">
      <div>
        <h2 class='c-title'>Filter</h2>
        <Input v-model="filter" />
      </div>
      <div
        class="c-cookie-item"
        v-for="(cookie, index) in filterCookies"
        :key="index"
      >
        <input type="text" v-model="cookie.name" />
        <input type="text" v-model="cookie.value" />
        <Button @click="handleEdit(cookie.name, cookie.value)">修改</Button>
        <Button @click="handleDelete(cookie.name)">删除</Button>
        <!-- <Button>复制</Button> -->
      </div>
    </div>
    <div class="c-panel">
      <h2 class='c-title'>预设</h2>
      <div class="c-cookie-item">
        <span class="c-text">cms_key</span>
        <select v-model="preCmsKey">
          <option disabled>请选择</option>
          <option>qcg</option>
          <option>miaotest</option>
          <option>ddmc</option>
        </select>
        <Button @click="handleEdit('cms_key', preCmsKey)">
          修改
        </Button>
      </div>
      <div class="c-cookie-item">
        <span class="c-text">cshop_cms_key</span>
        <select v-model="preCshopCmsKey">
          <option disabled>请选择</option>
          <option>gmxls</option>
        </select>
        <Button @click="handleEdit('cshop_cms_key', preCshopCmsKey)">
          修改
        </Button>
      </div>
    </div>
    <div class="c-panel">
      <h2 class='c-title'>追踪</h2>
      <div v-for="(cookies, index) in traceCookiesGroup" :key="index">
        <h4>{{ cookies.url }}</h4>
        <div class="c-cookie-item">
          <div>
            <div v-for="(cookie, i) in cookies.cookies" :key="'cookie_' + i">
              <span>{{ cookie.name }}</span
              >：
              <span>{{ cookie.value }}</span>
            </div>
          </div>
          <Button @click="handleReplace(cookies.cookies)">替换</Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import qs from "query-string"
import { filterByKeys } from "./util"
import Input from "../../components/input"
import Button from '../../components/button'

const GM_COOKIES_KEY = ["cms_key", "sessionid", "group"]
export default {
  name: "app",
  data() {
    return {
      filter: "gm",
      cookies: [],
      currentTabURL: "",
      currentTabId: "",

      // 预设
      preCmsKey: "",
      preCshopCmsKey: "",
      // 追踪
      traceTabs: [],
      traceCookiesGroup: [{}], // [{ url, cookies: [{ name, value }] }]
    }
  },
  computed: {
    filterCookies() {
      const sortCookies = this.cookies
      if (this.filter === "gm") {
        return filterByKeys(sortCookies, GM_COOKIES_KEY).sort()
      }
      return sortCookies
    },
  },
  mounted() {
    const { chrome } = window
    // 所有tabs
    // active: false
    // audible: false
    // autoDiscardable: true
    // discarded: false
    // favIconUrl: "https://www.google.com/images/icons/product/chrome-32.png"
    // height: 766
    // highlighted: false
    // id: 75
    // incognito: false
    // index: 3
    // mutedInfo: {
    //   muted: false
    // }
    // pinned: false
    // selected: false
    // status: "complete"
    // title: "chrome.tabs - Google Chrome"
    // url: "https://developer.chrome.com/extensions/tabs#method-query"
    // width: 1376
    // windowId: 1
    chrome.tabs.query({}, (tabs) => {
      const traceTabs = tabs
        .filter((tab) => !!tab.url.match(/localhost|shop.guanmai/))
        .map((tab) => ({
          id: tab.id,
          url: tab.url,
        }))
      this.traceTabs = traceTabs

      const traceCookiesGroup = []
      traceTabs.forEach((tab) => {
        chrome.cookies.getAll(
          {
            url: tab.url,
          },
          (cookies) => {
            const traceCookies = filterByKeys(cookies, GM_COOKIES_KEY)
            traceCookiesGroup.push({ url: tab.url, cookies: traceCookies })
          }
        )
      })
      this.traceCookiesGroup = traceCookiesGroup
    })

    // 当前tab
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
    handleEdit(name, value) {
      const { chrome } = window
      chrome.cookies.set({
        url: this.currentTabURL,
        path: "/",
        name,
        value,
      })
      this.handleDelete("sessionid")
    },
    handleDelete(name) {
      const { chrome } = window
      chrome.cookies.remove({
        url: this.currentTabURL,
        name,
      })
      this.handleReload()
    },
    handleReload() {
      const { chrome } = window
      const { url } = qs.parseUrl(this.currentTabURL)
      chrome.tabs.update({
        url: url,
      })
    },
    handleReplace(cookies) {
      const { chrome } = window
      for (const cookie of cookies) {
        chrome.cookies.set({
          url: this.currentTabURL,
          name: cookie.name,
          value: cookie.value,
        })
      }
      this.handleReload()
    },
  },
  components: {
    Input,Button
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
