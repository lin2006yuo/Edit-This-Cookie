export const filterByKeys = (array, keys, options = { name: "name" }) => {
  const keyName = options.name
  return array.filter((item) => {
    let flag = false
    for (const key of keys) {
      if (item[keyName].includes(key)) {
        flag = true
        break
      }
    }
    return flag
  })
}
