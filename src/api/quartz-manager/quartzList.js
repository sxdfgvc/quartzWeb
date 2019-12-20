import request from '@/utils/request'

export function fetchQuartzPage(query) {
  return request({
    url: '/api/quartz/quartzList',
    method: 'post',
    data: query
  });
}

export function saveQuartzJob(form) {
  return request({
    url: '/api/quartz/updateQuartzJob',
    method: 'post',
    data: form
  });
}

export function deleteQuartzJob(name,group) {
  return request({
    url: '/api/quartz/deleteQuartzJob',
    method: 'post',
    data: {'name': name,'jobGroupName':group}
  });
}

export function pauseQuartzJob(name,group) {
  return request({
    url: '/api/quartz/pauseQuartzJob',
    method: 'post',
    data: {'name': name,'jobGroupName':group}
  });
}
export function resumeQuartzJob(name,group) {
  return request({
    url: '/api/quartz/resumeQuartzJob',
    method: 'post',
    data: {'name': name,'jobGroupName':group}
  });
}

export function fetchColumnList(query) {
  return request({
    url: '/api/code/database/columnList',
    method: 'post',
    data: query
  });
}

export function saveTable(tableInfo) {
  return request({
    url: '/api/code/database/saveTable',
    method: 'post',
    data: tableInfo
  });
}
