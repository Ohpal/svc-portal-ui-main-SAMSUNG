import FileSaver from 'file-saver';
import axiosInstance from '/src/axios';

export function downloadExcel(res: any, fileName: any) {
  const blob = new Blob([res], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
  });
  fileName = decodeURI(fileName);
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.target = '_self';
  if (fileName) link.download = fileName;
  link.click();
}

export function downloadImage(res: any) {
  try {
    const blob = new Blob([res], {
      type: 'application/octet-stream;charset=UTF-8'
    });
    let fileName = getFileName(`attachment;fileName="workflow_new.JPG";`);
    fileName = decodeURI(fileName);

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.target = '_self';
    if (fileName) link.download = fileName;
    link.click();
    // requestObj.callback(res.data)
  } catch (e) {
    console.error(e);
  }
}

function getFileName(contentDisposition: any) {
  const fileName = contentDisposition
    .split(';')
    .filter((ele: any) => {
      return ele.includes('fileName');
    })
    .map((ele: any) => {
      return ele.replace(/"/g, '').split('=')[1];
    });
  return fileName[0] ? fileName[0] : null;
}

export function downloadFileUtil(res: any) {
  const blob = new Blob([res.data], {
    type: res.contentType
  });
  let fileName = getFileName(res.contentDisposition);
  fileName = decodeURI(fileName);
  FileSaver.saveAs(blob, fileName);
  /** if (window.navigator.msSaveOrOpenBlob) {
    // IE11
    window.navigator.msSaveOrOpenBlob(blob, fileName)
  } else {
    // chrome, firefox
    let link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.target = '_self'
    if (fileName) link.download = fileName
    link.click()
  } */
}

export async function getFileInfo(url, body?) {
  let contentDisposition: string | null = '';
  let contentType: string | null = '';
  const options = {};
  if (body) {
    options.data = body;
  }

  axiosInstance
    .get(url, {
      ...options
    })
    .then((response) => {
      contentDisposition = response.headers.get('content-disposition');
      contentType = response.headers.get('content-type');
      downloadFileUtil({ data: response.data, contentDisposition, contentType });
    });
}
