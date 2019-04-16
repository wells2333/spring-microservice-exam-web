import CryptoJS from 'crypto-js'
import { ATTACHMENT_URL } from '@/config/attachment'

/**
 * 加密处理
 */
export const encryption = (params) => {
  var {
    data,
    type,
    param,
    key
  } = params
  const result = JSON.parse(JSON.stringify(data))
  if (type === 'Base64') {
    param.forEach(ele => {
      result[ele] = btoa(result[ele])
    })
  } else {
    param.forEach(ele => {
      var data = result[ele]
      key = CryptoJS.enc.Latin1.parse(key)
      var iv = key
      var encrypted = CryptoJS.AES.encrypt(
        data,
        key,
        {
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.ZeroPadding
        })
      result[ele] = encrypted.toString()
    })
  }
  return result
}

/**
 * esc监听全屏
 */
export const listenfullscreen = (callback) => {
  function listen () {
    callback()
  }

  document.addEventListener('fullscreenchange', function (e) {
    listen()
  })
  document.addEventListener('mozfullscreenchange', function (e) {
    listen()
  })
  document.addEventListener('webkitfullscreenchange', function (e) {
    listen()
  })
  document.addEventListener('msfullscreenchange', function (e) {
    listen()
  })
}

/**
 * 浏览器判断是否全屏
 */
export const fullscreenEnable = () => {
  var isFullscreen = document.fullscreenEnabled ||
    window.fullScreen ||
    document.mozFullscreenEnabled ||
    document.webkitIsFullScreen
  return isFullscreen
}

/**
 * 浏览器全屏
 */
export const reqFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.documentElement.requestFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.documentElement.webkitRequestFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.documentElement.mozRequestFullScreen()
  }
}

/**
 * 浏览器退出全屏
 */
export const exitFullScreen = () => {
  if (document.documentElement.requestFullScreen) {
    document.exitFullScreen()
  } else if (document.documentElement.webkitRequestFullScreen) {
    document.webkitCancelFullScreen()
  } else if (document.documentElement.mozRequestFullScreen) {
    document.mozCancelFullScreen()
  }
}

/**
 * 生成随机len位数字
 */
export const randomLenNum = (len, date) => {
  let random = ''
  random = Math.ceil(Math.random() * 100000000000000).toString().substr(0, typeof len === 'number' ? len : 4)
  if (date) random = random + Date.now()
  return random
}

/**
 * 获取附件下载地址
 * @param attachmentId
 * @returns {string}
 */
export const getDownloadUrl = (attachmentId) => {
  return ATTACHMENT_URL + '/download?id=' + attachmentId
}

/**
 * 返回附件的预览地址
 * @param sysConfig
 * @param fastFileId
 * @returns {string}
 */
export const getAttachmentPreviewUrl = function(sysConfig, fastFileId) {
  let url = ''
  if (isNotEmpty(sysConfig.fdfsHttpHost)) {
    url = sysConfig.fdfsHttpHost + '/' + fastFileId
  }
  return url
}

/**
 * 判断对象是否为空
 * @param obj
 * @returns {boolean}
 */
export const isNotEmpty = (obj) => {
  let flag = true
  if (obj === '' || obj == null || obj === undefined || obj === 'undefined') {
    flag = false
  }
  return flag
}

/**
 * 提示
 * @param obj
 * @param title
 * @param msg
 * @param type
 * @param duration
 */
export const notify = (obj, title, msg, type, duration) => {
  obj.$notify({ title: title, message: msg, type: type, duration: duration })
}

/**
 * 成功提示
 * @param obj
 * @param msg
 */
export const notifySuccess = (obj, msg) => {
  notify(obj, '成功', msg, 'success', 2000)
}

/**
 * 失败提示
 * @param obj
 * @param msg
 */
export const notifyFail = (obj, msg) => {
  notify(obj, '失败', msg, 'error', 2000)
}
