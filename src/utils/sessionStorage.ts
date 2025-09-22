export function getAccessToken() {
  return window?.sessionStorage?.getItem('access_token') || null;
}

export function getRefreshToken() {
  return window?.sessionStorage?.getItem('refresh_token') || null;
}

export async function setAccessToken(token: string | null) {
  if (token) {
    return new Promise((resolve) => {
      window?.sessionStorage?.setItem('access_token', token);
      resolve(true)
    })
  } else {
    return new Promise((resolve) => {
      sessionLogout();
      resolve(true)
    })
  }
}

export function setRefreshToken(token: string | null) {
  if (token) {
    window?.sessionStorage?.setItem('refresh_token', token);
  } else {
    sessionLogout();
  }
}

export async function setPlatform(platform: string | undefined) {
  if (platform) {
    return new Promise((resolve) => {
      window.sessionStorage.setItem('platform', platform);
      resolve(true)
    })
  }
}

interface userInfoType {
  companyId: string,
  companyName: string,
  division?: string,
  name?: string,
  roleId: string,
  roleName: string,
  userId: string
}
export function setUserInfo(userInfo: userInfoType) {
  if (userInfo) {
    window.sessionStorage.setItem('user_info', JSON.stringify(userInfo));
  }
}

export function setLogoutTime(ms: number) {
  window.sessionStorage.setItem('logoutTime', `${ms}`)
}

export function getLogoutTime() {
  return window.sessionStorage.getItem('logoutTime') || 86400000
}

export function setCommonIntervalTime(ms: number) {
  window.sessionStorage.setItem('commonIntervalTime', `${ms}`)
}

export function getCommonIntervalTime() {
  let commonIntervalTime = Number(window.sessionStorage.getItem('commonIntervalTime'));
  if (commonIntervalTime === 0) {
    commonIntervalTime = 15000
  }
  return commonIntervalTime
}


export function sessionLogout() {

  // 'Password change required.'

  removeStorage()
}

function removeStorage() {
  window?.sessionStorage?.removeItem('access_token');
  window?.sessionStorage?.removeItem('refresh_token');
  window?.sessionStorage?.removeItem('ship_info')
  window?.sessionStorage?.removeItem('company_info');
  window?.sessionStorage?.removeItem('user_info');
  window?.sessionStorage?.removeItem('status_check');
}
