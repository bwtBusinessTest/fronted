 export function parseTime(time, cFormat) {
   if (arguments.length === 0) {
     return null
   }
   const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
   let date
   if (typeof time === 'object') {
     date = time
   } else {
     if (('' + time).length === 10) time = parseInt(time) * 1000
     date = new Date(time)
   }
   const formatObj = {
     y: date.getFullYear(),
     m: date.getMonth() + 1,
     d: date.getDate(),
     h: date.getHours(),
     i: date.getMinutes(),
     s: date.getSeconds(),
     a: date.getDay()
   }
   const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
     let value = formatObj[key]
     if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
     if (result.length > 0 && value < 10) {
       value = '0' + value
     }
     return value || 0
   })
   return time_str
 }

 export function formatTime(time, option) {
   time = +time * 1000
   const d = new Date(time)
   const now = Date.now()

   const diff = (now - d) / 1000

   if (diff < 30) {
     return '刚刚'
   } else if (diff < 3600) { // less 1 hour
     return Math.ceil(diff / 60) + '分钟前'
   } else if (diff < 3600 * 24) {
     return Math.ceil(diff / 3600) + '小时前'
   } else if (diff < 3600 * 24 * 2) {
     return '1天前'
   }
   if (option) {
     return parseTime(time, option)
   } else {
     return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
   }
 }

 export function formatDate(date) {
  var dateObj = new Date(date);
  var y = dateObj.getFullYear();
  var m = dateObj.getMonth() + 1;
  var d = dateObj.getDate();
  m = m < 10 ? '0' + m : m;
  var d = d < 10 ? ('0' + d) : d;
  return y + '-' + m + '-' + d;
 }

 export function formatLongDate(date) {
  var dateObj = new Date(date);
  var y = dateObj.getFullYear();
  var m = dateObj.getMonth() + 1;
  var d = dateObj.getDate();
  m = m < 10 ? '0' + m : m;
  var d = d < 10 ? ('0' + d) : d;
  var h = dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours();
  var mm = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
  return y + '-' + m + '-' + d + ' ' + h + ':' + mm;
 }

 export function formatLongDateToSecond(date) {
  var dateObj = new Date(date);
  var y = dateObj.getFullYear();
  var m = dateObj.getMonth() + 1;
  var d = dateObj.getDate();
  m = m < 10 ? '0' + m : m;
  var d = d < 10 ? ('0' + d) : d;
  var h = dateObj.getHours() < 10 ? '0' + dateObj.getHours() : dateObj.getHours();
  var mm = dateObj.getMinutes() < 10 ? '0' + dateObj.getMinutes() : dateObj.getMinutes();
  var ss = dateObj.getSeconds() < 10 ? '0' + dateObj.getSeconds() : dateObj.getSeconds();
  return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + ss;
 }
