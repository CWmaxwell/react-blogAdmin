const minute = 1000 * 60;
const hour = minute * 60;
const day = hour * 24;

function zeroize(num) {
  return (String(num).length === 1 ? '0' : '') + num;
}

export function timeToDateTime(timeString) {
  const dataDate = new Date(timeString);
  const Y = dataDate.getFullYear();
  const M = dataDate.getMonth() + 1;
  const D = dataDate.getDate();
  const HoursTime = timeString.slice(11, 16);
  const result = `${Y}.${zeroize(M)}.${zeroize(D)} ${HoursTime}`;
  return result;
}

export function timeToBeforeTime(timeString) {
  const dataDate = new Date(timeString);
  const dataTimestamp = dataDate.getTime();
  const nowTimestamp = new Date().getTime();
  const diffValue = nowTimestamp - dataTimestamp;
  const dayC = diffValue / day;
  const hourC = diffValue / hour;
  const minC = diffValue / minute;
  const Y = dataDate.getFullYear();
  const M = dataDate.getMonth() + 1;
  const D = dataDate.getDate();
  const HoursTime = timeString.slice(11, 16);
  let result = `${Y}.${zeroize(M)}.${zeroize(D)} ${HoursTime}`;
  if (dayC >= 1 && dayC < 7) {
    result = `${Math.floor(dayC)}天以前`;
  } else if (hourC >= 1 && hourC < 24) {
    result = `${Math.floor(hourC)}小时以前`;
  } else if (minC >= 1 && minC < 60) {
    result = `${Math.floor(minC)}分钟以前`;
  } else if (minC < 1) {
    result = '刚刚';
  }
  return result;
}
