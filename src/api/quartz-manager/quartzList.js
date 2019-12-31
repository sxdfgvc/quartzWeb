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

export function queryJobDate(name,date) {
    return request({
      url: '/api/quartz/getWrongJobDate',
      method: 'post',
      data: {'jobName': name,'startTime':date[0],'endTime':date[1]}
    });
}

export function queryJobDateList(name,date) {
  return request({
    url: '/api/quartz/getWrongJobDateList',
    method: 'post',
    data: {'jobName': name, 'startTime': date[0], 'endTime': date[1]}
  });
}
export function triggerQuartzJobNow(multipleSelection) {
  return request({
    url: '/api/quartz/triggerQuartzJobNow',
    method: 'post',
    data: multipleSelection
  });
}
