import request from '@/utils/request'

export const fetchLogPage = (param) => {
  return request({
    url: '/syslog/log/page',
    method: 'get',
    params: param
  })
}

