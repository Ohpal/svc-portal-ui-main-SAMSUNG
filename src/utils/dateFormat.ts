export function datePickerFormat(date: any) {
  const year = date.getFullYear();
  const month = plusZeroText(date.getMonth() + 1);
  const day = plusZeroText(date.getDate());
  return `${year}.${month}.${day}`;
}

export function timePickerFormat(date: any) {
  const year = date.getFullYear();
  const month = plusZeroText(date.getMonth() + 1);
  const day = plusZeroText(date.getDate());
  const hours = plusZeroText(date.getHours());
  const minutes = plusZeroText(date.getMinutes());
  const seconds = plusZeroText(date.getSeconds());

  return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
}

export function rangePickerFormat(dates: any) {
  const start = dates[0];
  const end = dates[1];
  if (start && end) {
    return `${start.getFullYear()}.${plusZeroText(start.getMonth() + 1)}.${plusZeroText(start.getDate())} ~ ${end.getFullYear()}.${plusZeroText(end.getMonth() + 1)}.${plusZeroText(end.getDate())}`;
  }
  return '';
}

// 10보다 작으면 0 붙이기
function plusZeroText(number) {
  return number > 9 ? number : `0${number}`;
}

export function round(number: number, decimalPlaces: number) {
  if (decimalPlaces < 0) {
    throw new Error("소수점 자리수는 0 이상이어야 합니다.");
  }
  const factor = Math.pow(10, decimalPlaces);
  return Math.round(number * factor) / factor;
}

