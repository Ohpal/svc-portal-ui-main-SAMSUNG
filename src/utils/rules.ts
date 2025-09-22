// TODO 사용하는곳에서 text를 넘겨주어여야한다.

export const required = (value: string, text: string) => {
  return !!value || text;
};
export const atLeast7 = (value: string, text: string) => {

  return value.length >= 7 || text;
};

const passwordRegExp = /^(?=.*[!@#$%^&*(),.?":{}|<>~_-])(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z\d!@#$%^&*(),.?":{}|<>~_-]{8,}$/;
export const passwordRule = (value: string, text: string) => {

  return passwordRegExp.test(value) || text;
};

export const emailRule = (value: string, text?: string) => {
  return /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(value) || text ? text : 'Please enter a valid email.'
}
