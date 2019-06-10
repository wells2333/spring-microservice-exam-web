import { validatenull } from '@/utils/validate'
/**
 * 存储localStorage
 */
export const setStore = (params) => {
  const {
    name,
    content,
    type
  } = params
  const obj = {
    dataType: typeof (content),
    content: content,
    type: type,
    datetime: new Date().getTime()
  }
  // 直接放到localStorage
  window.localStorage.setItem(name, JSON.stringify(obj))
}
/**
 * 获取localStorage
 */
export const getStore = (params) => {
  const {
    name
  } = params
  let obj = {}
  let content
  obj = window.localStorage.getItem(name)
  if (validatenull(obj)) return
  obj = JSON.parse(obj)
  if (obj.dataType === 'string') {
    content = obj.content
  } else if (obj.dataType === 'number') {
    content = Number(obj.content)
  } else if (obj.dataType === 'object') {
    content = obj.content
  }
  return content
}
/**
 * 删除localStorage
 */
export const removeStore = params => {
  const {
    name
  } = params
  window.localStorage.removeItem(name)
}
