// const passMessage = (type, msg, color = 'grey darken-1') => document.dispatchEvent(new CustomEvent('passMessage({ detail: { type, msg, color } }));

import { useMessageStore } from '@/portalStores/message';
import i18nInstance from '@/i18n';

export const Message = () => {

  const messageStore = useMessageStore();
  function info(msg: string) {
    messageStore.SetMessageOption({ contents: i18nInstance.global.t(msg), color: 'info' });
    messageStore.SetShowMessage(true);
    // passMessage('info( msg);
  }
  function show(msg: string, color: string = 'grey darken-1') {
    messageStore.SetMessageOption({ contents: i18nInstance.global.t(msg), color });
    messageStore.SetShowMessage(true);
    // passMessage('show( msg, color);
  }
  function success(msg: string) {
    messageStore.SetMessageOption({ contents: i18nInstance.global.t(msg), color: 'success' });
    messageStore.SetShowMessage(true);
    // passMessage('success( msg);
  }
  function warn(msg: string) {
    messageStore.SetMessageOption({ contents: i18nInstance.global.t(msg), color: 'warning' });
    messageStore.SetShowMessage(true);
    // passMessage('warn( msg);
  }
  function err(msg: string) {
    messageStore.SetMessageOption({ contents: i18nInstance.global.t(msg), color: 'error' });
    messageStore.SetShowMessage(true);
    // passMessage('err( msg);
  }
  return { info, show, success, warn, err };
};
