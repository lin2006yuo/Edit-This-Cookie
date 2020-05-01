<template>
  <div class="main_app">
    <div class="c-panel">
      <div>
        <h2 class="c-title">Filter</h2>
        <Input v-model="filter" />
      </div>
      <h2 class="c-title">当前</h2>
      <pannel-item
        v-for="cookie in filterCookies"
        :key="cookie.name"
        :name="cookie.name"
      >
        <template #content>
          <Select
            :value="cookie.value"
            @input="handleSelect(cookie, $event)"
            :options="cookie.options"
          />
        </template>
        <template #action>
          <Button @click="handleEdit(cookie.name, cookie.value)">
            修改
          </Button>
          <Button @click="handleDelete(cookie.name)">删除</Button>
        </template>
      </pannel-item>
    </div>
    <div class="c-panel">
      <h2 class="c-title">追踪</h2>
      <div v-for="(cookies, index) in traceCookiesGroup" :key="index">
        <h4>{{ cookies.url }}</h4>

        <div class="c-cookie-item">
          <div>
            <pannel-item
              v-for="(cookie, index) in cookies.cookies"
              :key="index"
              :name="cookie.name"
            >
              <template #content>
                <span :class="{
                  'c-cms_key': cookie.name === 'cms_key',
                  'c-cshop-cms_key': cookie.name === 'cshop_cms_key'
                }">
                   {{ cookie.value }}
                </span>
              </template>
            </pannel-item>
          </div>
          <Button @click="handleReplace(cookies.cookies)">替换</Button>
        </div>
      </div>
    </div>
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
        const a = filterByKeys(sortCookies, GM_COOKIES_KEY)
          .sort((a, b) => a.name - b.name)
          .map((item) => ({
            ...item,
            options: getOptions(item),
          }))
        return a
      }
      return sortCookies.map((item) => ({
        ...item,
        options: getOptions(item),
      }))
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
    handleSelect(cookie, value) {
      const targetCookie = this.cookies.find((c) => c.name === cookie.name)
      if (!targetCookie) {
        return this.cookies.push({ name: cookie.name, value: value })
      }
      targetCookie.value = value
    },
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
      location.reload(true)
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
