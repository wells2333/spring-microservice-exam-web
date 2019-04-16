import request from '@/router/axios'

const baseAnswerUrl = '/api/exam/v1/answer/'

export function fetchAnswerList(query) {
  return request({
    url: baseAnswerUrl + 'answerList',
    method: 'get',
    params: query
  })
}

export function getAnswer(id) {
  return request({
    url: baseAnswerUrl + id,
    method: 'get'
  })
}

export function addAnswer(obj) {
  return request({
    url: baseAnswerUrl,
    method: 'post',
    data: obj
  })
}

export function putAnswer(obj) {
  return request({
    url: baseAnswerUrl,
    method: 'put',
    data: obj
  })
}

export function delAnswer(id) {
  return request({
    url: baseAnswerUrl + id,
    method: 'delete'
  })
}

export function saveOrUpdate(obj) {
  return request({
    url: baseAnswerUrl + 'saveOrUpdate',
    method: 'post',
    data: obj
  })
}

export function submit(obj) {
  return request({
    url: baseAnswerUrl + 'submit',
    method: 'post',
    data: obj
  })
}
