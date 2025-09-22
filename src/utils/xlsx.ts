import * as XLSX from 'xlsx';

export const exportExcel = (tableData: any) => {
  // 가장 간단한 방법이지만 이경우 원치않는 checkbox, icon 등 같이 들어간다.
  // var excelData = XLSX.utils.table_to_sheet(document.getElementById(this.uuid)) // table id를 넣어주면된다
  // console.dir(document.getElementById(this.uuid))
  // 아래와 같이 jsondata인 items를 통해서도 만들수 있지만 화면에 표시되지 않는 데이터들도 들어간다.
  // var excelData = XLSX.utils.json_to_sheet(items)

  // 좀 복잡하지만 아래와 같이 case by case로 데이터를 만들어주자.
  // header을 통해 items의 데이터를 필터링하여 데이터를 생성하자.
  // const { t } = useI18n();
  const temps = JSON.parse(JSON.stringify(tableData.items)); // deepcopy
  const jsondata = temps.map((item: any) => {
    const json = {};
    tableData.headers.forEach((head: { key: string; click: any; icon: any; title: string | number; action: boolean }) => {
      if (head.key === 'update') return;
      if (head.action) return;
      if (head.click || head.icon) return;
      // if ((head.click || head.icon) && !item[head.value]) return
      if (tableData.i18n) {
        json[head.title] = item[head.key];
      } else {
        json[head.title] = item[head.key];
      }
    });
    return json;
  });
  // console.dir(jsondata)

  const excelData = XLSX.utils.json_to_sheet(jsondata);
  const workBook = XLSX.utils.book_new(); // 새 시트 생성
  XLSX.utils.book_append_sheet(workBook, excelData, tableData.title); // 시트 명명, 데이터 지정
  XLSX.writeFile(workBook, `${tableData.title}.xlsx`); // 엑셀파일 만듬
};
