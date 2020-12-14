document.addEventListener("DOMContentLoaded", () => {
  let dom = document.querySelector("#some-id")
  if (dom) {
    const callback = function(mutationsList, observer) {
      for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
          console.log(chrome)
          console.log("A child node has been added or removed.")

          chrome.runtime.sendMessage(
            { greeting: "你好，我是content-script呀，我主动发消息给后台！" },
            function(response) {
              console.log("收到来自后台的回复：" + response)
            }
          )
        } else if (mutation.type === "attributes") {
          console.log(
            "The " + mutation.attributeName + " attribute was modified."
          )
        }
      }
    }
    const observer = new MutationObserver(callback)
    observer.observe(dom, { childList: true })
  }
})

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  // console.log(sender.tab ?"from a content script:" + sender.tab.url :"from the extension");
  sendResponse("我收到了你的消息")
})
