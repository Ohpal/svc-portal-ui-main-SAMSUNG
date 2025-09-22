import type { FormBoxType } from '~/types';

export function parseFormboxData(items: FormBoxType) {
  const temp: any = {};
  items.forEach((item, index) => {
    const { value = '' } = item;
    if (item.id) {
      temp[item.id] = isObject(item) ? value.value : value;
    } else {
      temp[index] = value;
    }
  });
  return temp;
}
export function setFormboxData(items: FormBoxType, data: any) {
  Object.keys(data).forEach((key) => {
    items.forEach((item) => {
      if (item.id === key) {
        if (item.items) {
          const [selectObject] = item.items.filter((list) => {
            return list.value === data[key];
          });
          item.value = selectObject;
        } else {
          item.value = data[key];
        }
      }
    });
  });
}

export function resetFormboxData(items: FormBoxType) {
  items.forEach((item) => {
    item.value = '';
  });
}

// value가 object 형식이라면 해당하는 value를 return하도록하기위해 체크하는 함수
function isObject(item: FormBoxType) {
  let result = false;
  if (typeof item?.value === 'object') {
    result = true;
  }

  return result;
}
