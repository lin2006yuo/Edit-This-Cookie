import { cmsKeySelect, cshopCmsKeySelect } from "./config"

export const filterByKeys = (array, keys, options = { name: "name" }) => {
  const keyName = options.name
  keys = [...keys]
  let filterList = array.filter((item) => {
    let flag = false
    let map = new Map(keys.map((key, index) => [key, index]))
    for (const [key, index] of map) {
      if (item[keyName] === key) {
        keys.splice(index, 1)
        map = new Map(keys.map((key, index) => [key, index]))
        flag = true
        break
      }
    }
    return flag
  })
  for(const key of keys) {
    filterList.push({
      name: key,
      value: ""
    })
  }
  return filterList
}

export const getOptions = (cookie) => {
  switch (cookie.name) {
    case "cms_key":
      return cmsKeySelect
    case "cshop_cms_key":
      return cshopCmsKeySelect
    default:
      return []
  }
}
