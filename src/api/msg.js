import request from '@/utils/request'

export function fetchMsgList(query) {
  return request({
    url: '/tsc/msg/getMsgByCondtion',
    method: 'post',
    data: query
  })
}

export function reSendMsg(obj) {
  return request({
    url: '/tsc/msg/reSendMsg',
    method: 'post',
    data: obj
  })
}
