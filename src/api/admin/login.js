import request from '@/router/axios'
import { getRefreshToken } from '@/utils/auth'

const baseAuthenticationUrl = '/api/auth/v1/authentication/'

const basicAuthorization = 'Basic ' + btoa('web_app:spring-microservice-exam-secret')

export function loginByUsername (username, password, code, randomStr, tenantCode) {
  const grantType = 'password'
  const scope = 'read'
  return request({
    url: '/api/auth/oauth/token',
    headers: {
      'Authorization': basicAuthorization
    },
    method: 'post',
    params: {username, password, randomStr, code, grant_type: grantType, scope, tenantCode}
  })
}

export function registerByUsername (username, name, password, code, randomStr, tenantCode) {
  return request({
    url: '/api/user/v1/user/register',
    method: 'post',
    params: {username, name, password, randomStr, code, tenantCode}
  })
}

export function logout (accesstoken, refreshToken) {
  return request({
    url: baseAuthenticationUrl + 'removeToken',
    method: 'post'
  })
}

export function getUserInfo (token) {
  return request({
    url: '/api/user/v1/user/info',
    method: 'get'
  })
}

/**
 * 刷新token
 */
export function refreshToken () {
  //  grant_type为refresh_token
  const grantType = 'refresh_token'
  const scope = 'read'
  const refreshToken = getRefreshToken()
  return request({
    url: '/api/auth/oauth/token',
    headers: {
      'Authorization': basicAuthorization
    },
    method: 'post',
    params: { grant_type: grantType, scope, refresh_token: refreshToken }
  })
}
