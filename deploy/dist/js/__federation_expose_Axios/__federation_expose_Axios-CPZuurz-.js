import { importShared } from "../__federation_fn_import/__federation_fn_import-CyQYGTN2.js";
const { defineStore: defineStore$6 } = await importShared("pinia");
const { ref: ref$7 } = await importShared("vue");
const useMessageStore = defineStore$6("message", () => {
  const showMessage = ref$7(false);
  const messageOption = ref$7({
    contents: "",
    color: ""
  });
  function SetShowMessage(show) {
    showMessage.value = show;
  }
  function SetMessageOption(option) {
    messageOption.value = option;
  }
  function getShowMessage() {
    return showMessage.value;
  }
  function getMessageOption() {
    return messageOption.value;
  }
  return { SetShowMessage, SetMessageOption, getShowMessage, getMessageOption };
});
function getAccessToken() {
  var _a;
  return ((_a = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a.getItem("access_token")) || null;
}
function getRefreshToken() {
  var _a;
  return ((_a = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a.getItem("refresh_token")) || null;
}
async function setAccessToken(token) {
  if (token) {
    return new Promise((resolve) => {
      var _a;
      (_a = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a.setItem("access_token", token);
      resolve(true);
    });
  } else {
    return new Promise((resolve) => {
      sessionLogout();
      resolve(true);
    });
  }
}
function setRefreshToken(token) {
  var _a;
  if (token) {
    (_a = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a.setItem("refresh_token", token);
  } else {
    sessionLogout();
  }
}
async function setPlatform(platform) {
  if (platform) {
    return new Promise((resolve) => {
      window.sessionStorage.setItem("platform", platform);
      resolve(true);
    });
  }
}
function setUserInfo(userInfo) {
  if (userInfo) {
    window.sessionStorage.setItem("user_info", JSON.stringify(userInfo));
  }
}
function setLogoutTime(ms) {
  window.sessionStorage.setItem("logoutTime", `${ms}`);
}
function getLogoutTime() {
  return window.sessionStorage.getItem("logoutTime") || 864e5;
}
function setCommonIntervalTime(ms) {
  window.sessionStorage.setItem("commonIntervalTime", `${ms}`);
}
function getCommonIntervalTime() {
  let commonIntervalTime = Number(window.sessionStorage.getItem("commonIntervalTime"));
  if (commonIntervalTime === 0) {
    commonIntervalTime = 15e3;
  }
  return commonIntervalTime;
}
function sessionLogout() {
  removeStorage();
}
function removeStorage() {
  var _a, _b, _c, _d, _e, _f;
  (_a = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a.removeItem("access_token");
  (_b = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _b.removeItem("refresh_token");
  (_c = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _c.removeItem("ship_info");
  (_d = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _d.removeItem("company_info");
  (_e = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _e.removeItem("user_info");
  (_f = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _f.removeItem("status_check");
}
const { defineStore: defineStore$5 } = await importShared("pinia");
const { ref: ref$6 } = await importShared("vue");
const useLoadingStore = defineStore$5("loading", () => {
  const loading = ref$6(false);
  const loadingCount = ref$6(0);
  function getLoading() {
    return loading.value;
  }
  function setLoading(value) {
    loading.value = value;
  }
  function addLoadingCount() {
    loadingCount.value += 1;
  }
  function reduceLoadingCount() {
    if (loadingCount.value > 0) {
      loadingCount.value -= 1;
    }
  }
  function getLoadingCount() {
    return loadingCount.value;
  }
  return {
    setLoading,
    getLoading,
    addLoadingCount,
    reduceLoadingCount,
    getLoadingCount
  };
});
const { defineStore: defineStore$4 } = await importShared("pinia");
const { computed: computed$5, ref: ref$5 } = await importShared("vue");
const useMenuStore = defineStore$4("menu", () => {
  const menuList = ref$5();
  const getValue = computed$5(() => menuList.value);
  async function setMenuList(menus) {
    const roleMenuList = [];
    menus.forEach((e) => {
      if (e.aclr === "Y") roleMenuList.push(e.menu);
    });
    menuList.value = await setTreeMenu(roleMenuList.sort((a, b) => {
      if (a.depth < b.depth) return -1;
      if (a.depth > b.depth) return 1;
      if (a.menuId < b.menuId) return -1;
      if (a.menuId > b.menuId) return 1;
      return 0;
    }) || []);
  }
  async function setTreeMenu(menuData) {
    return new Promise(async (resolve) => {
      var _a;
      const tree = {
        menuId: 0,
        children: []
      };
      for (const menuItem of menuData) {
        await resolveTreeMenu(menuItem, tree, tree);
      }
      (_a = tree.children) == null ? void 0 : _a.sort((a, b) => a.sequence - b.sequence);
      resolve(tree.children);
    });
  }
  async function resolveTreeMenu(menuItem, targetMenuItem, tree) {
    new Promise(async (resolve) => {
      var _a;
      if (menuItem.depth === 1) {
        if (menuItem.useYN === "Y") {
          (_a = tree.children) == null ? void 0 : _a.push(menuItem);
        }
        return;
      }
      if (menuItem.parentId === targetMenuItem.menuId) {
        if (!targetMenuItem.children) {
          targetMenuItem.children = [];
        }
        if (!targetMenuItem.children.includes(menuItem)) {
          targetMenuItem.children.push(menuItem);
          targetMenuItem.children.sort((a, b) => a.sequence - b.sequence);
        }
        return;
      }
      if (targetMenuItem.children) {
        for (const newTargetMenuItem of targetMenuItem.children) {
          await resolveTreeMenu(menuItem, newTargetMenuItem, tree);
        }
      }
    });
  }
  return { getValue, setMenuList };
});
const { defineStore: defineStore$3 } = await importShared("pinia");
const { computed: computed$4, ref: ref$4 } = await importShared("vue");
const usePlatformStore = defineStore$3("platform", () => {
  var _a;
  const platform = computed$4(() => platformValue.value);
  const platformValue = ref$4(((_a = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a.getItem("platform")) || void 0);
  async function getPlatformInfo() {
    await axiosInstance.get("/krakend/svcfw/api/platforms").then((response) => {
      platformValue.value = response.data.platform;
      setPlatform(response.data.platform);
    });
    return Promise.resolve();
  }
  return { getPlatformInfo, platform };
});
const commonLocale = {
  en: {
    "common.add": "Add",
    "common.update": "Edit",
    "common.delete": "Delete",
    "common.menu": "Menu",
    "common.use": "Use",
    "common.read": "Read",
    "common.register": "Registration",
    "common.write": "Creating",
    "common.deleteConfirm": "Are you sure you want to delete this item?",
    "common.search": "Search",
    "common.reset": "Reset",
    "common.normal": "Normal",
    "common.warning": "Warning",
    "common.critical": "Critical",
    "common.total": "Total",
    "common.close": "Close",
    "common.confirm": "Confirm",
    "common.cancel": "Cancel",
    "common.save": "Save",
    "common.temp-save": "Temporarily Save",
    "common.excelDownload": "Excel Download",
    "common.addFile": "Add File",
    "common.sampleFile": "Sample File",
    "common.notice": "Notice",
    "common.download": "Download",
    "common.createTime": "Create Time",
    "common.createUser": "Create User",
    "common.edit": "Edit",
    "common.axis": "Axis",
    "common.file": "File",
    "common.fileName": "File Name",
    "common.description": "Description",
    "common.level": "Level",
    "common.sensor": "Sensor",
    "common.sensorCode": "Sensor Code",
    "common.sensorName": "Sensor Name",
    "common.sensorValue": "Sensor Value",
    "common.alarmRating": "Alarm Rating",
    "common.unit": "Unit",
    "common.equipment": "Equipment",
    "common.equipmentCode": "Equipment Code",
    "common.equipmentNo": "Equipment No",
    "common.equipmentName": "Equipment Name",
    "common.subEquipment": "Sub Equipment",
    "common.subEquipmentName": "Sub Equipment Name",
    "common.chart": "Chart",
    "common.shipType": "Ship Type",
    "common.shipTypeNo": "Ship Type No",
    "common.shipTypeName": "Ship Type Name",
    "common.ship": "Ship",
    "common.shipNo": "Ship No",
    "common.shipName": "Ship Name",
    "common.builder": "Builder",
    "common.tonnage": "Tonnage",
    "common.maximumSpeed": "MaximumSpeed",
    "common.commissionDate": "CommissionDate",
    "common.select": "Select",
    "common.select.all": "Select All",
    "common.select.shipType": "Select Ship Type",
    "common.select.ship": "Select Ship",
    "common.select.equipment": "Select Equipment",
    "common.select.subEquipment": "Select Sub Equipment",
    "common.select.sensor": "Select Sensor",
    "common.min": "Min",
    "common.max": "Max",
    "common.admin": "Admin",
    "common.user": "User",
    "common.download.chart.data": "Download Chart Data",
    "common.create.chart": "Create Chart",
    "common.load": "Load",
    "common.saved-name": "Saved Name",
    "common.input": "Input",
    "common.photo": "Photo"
  },
  ko: {
    "common.add": "신규 등록",
    "common.update": "수정",
    "common.delete": "삭제",
    "common.menu": "메뉴",
    "common.use": "사용",
    "common.read": "읽기",
    "common.register": "등록",
    "common.write": "작성",
    "common.deleteConfirm": "선택한 항목을 삭제하시겠습니까?",
    "common.search": "조회",
    "common.reset": "초기화",
    "common.normal": "정상",
    "common.warning": "이상",
    "common.critical": "경고",
    "common.total": "합계",
    "common.close": "닫기",
    "common.confirm": "확인",
    "common.cancel": "취소",
    "common.save": "저장",
    "common.temp-save": "임시 저장",
    "common.excelDownload": "Excel 다운로드",
    "common.addFile": "파일 등록",
    "common.sampleFile": "샘플파일",
    "common.notice": "알림",
    "common.download": "다운로드",
    "common.createTime": "등록일",
    "common.createUser": "등록자",
    "common.edit": "편집",
    "common.axis": "축",
    "common.file": "파일",
    "common.fileName": "파일명",
    "common.description": "설명",
    "common.level": "레벨",
    "common.sensor": "센서",
    "common.sensorCode": "센서 코드",
    "common.sensorName": "센서명",
    "common.sensorValue": "센서값",
    "common.alarmRating": "알람등급",
    "common.unit": "단위",
    "common.equipment": "장비",
    "common.equipmentCode": "장비부호",
    "common.equipmentNo": "장비번호",
    "common.equipmentName": "장비명",
    "common.subEquipment": "하위 장비",
    "common.subEquipmentName": "하위 장비명",
    "common.chart": "차트",
    "common.shipType": "함형",
    "common.shipTypeNo": "함형번호",
    "common.shipTypeName": "함형명",
    "common.ship": "함정",
    "common.shipNo": "함정번호",
    "common.shipName": "함정명",
    "common.builder": "건조사",
    "common.tonnage": "톤수",
    "common.maximumSpeed": "최대속도",
    "common.commissionDate": "취역내역",
    "common.select": "선택",
    "common.select.all": "전체 선택",
    "common.select.shipType": "함형 선택",
    "common.select.ship": "함정 선택",
    "common.select.equipment": "장비 선택",
    "common.select.subEquipment": "하위장비 선택",
    "common.select.sensor": "센서 선택",
    "common.min": "최소",
    "common.max": "최대",
    "common.admin": "관리자",
    "common.user": "사용자",
    "common.download.chart.data": "차트 데이터 다운로드",
    "common.create.chart": "차트 생성",
    "common.load": "불러오기",
    "common.saved-name": "저장명",
    "common.input": "입력"
  }
};
const menuLocale = {
  en: {
    "menu.administratorSettings": "Setting",
    "menu.company": "Company Account Management",
    "menu.user": "User Management",
    "menu.account": "User Management",
    "menu.group": "User Group Management",
    "menu.commonData": "Common Data Management",
    "menu.portCanal": "Port & Canal Data",
    "menu.settingEmission": "Emission",
    "menu.engineering": "Engineering Data",
    "menu.vessel": "Ship Data Management",
    "menu.vesselData": "Ship Data",
    "menu.fuelData": "Fuel Data",
    "menu.example": "예제",
    "menu.example.table": "테이블",
    "menu.example.chart": "차트",
    "menu.example.formBox": "폼 박스",
    "menu.example.input": "input",
    "menu.example.file": "파일",
    "menu.example.datePicker": "Date Picker",
    "menu.example.button": "버튼",
    "menu.application": "어플리케이션 관리",
    "menu.voyage": "Voyage",
    "menu.voyage.voyageMonitoring": "Voyage Monitoring",
    "menu.voyage.voyagePlanner": "Voyage Planner",
    "menu.voyage.trimOptimization": "Trim Optimization",
    "menu.SPMS": "Ship Performance",
    "menu.SPMS.voyage": "Voyage Information",
    "menu.SPMS.fuel": "Fuel Information",
    "menu.SPMS.performance": "Performance",
    "menu.equipmentSystem": "Equipment & System",
    "menu.equipmentSystem.overview": "Overview",
    "menu.equipmentSystem.mainEngine": "Main Engine",
    "menu.equipmentSystem.mainEngine.overview": "Overview",
    "menu.equipmentSystem.mainEngine.cylinderUnit": "Cylinder Unit",
    "menu.equipmentSystem.mainEngine.MEAuxiliarySystem": "ME Auxiliary System",
    "menu.equipmentSystem.generatorEngine": "Generator Engine",
    "menu.equipmentSystem.generatorEngine.overview": "Overview",
    "menu.equipmentSystem.generatorEngine.GEAuxiliarySystem": "GE Auxiliary System",
    "menu.equipmentSystem.gasManagementSystem": "Gas Management System",
    "menu.equipmentSystem.gasManagementSystem.overview": "Overview",
    "menu.equipment.gas.management.system.fuel.gas.supply.system": "Fuel Gas Supply System",
    // content 영역에서는 full로 표시
    "menu.equipmentSystem.gasManagementSystem.FGSS": "FGSS",
    // side navi에서는 약어로 표시
    "menu.equipmentSystem.gasManagementSystem.reliquefactionSystem": "Re-liquefaction System",
    "menu.equipmentSystem.gasManagementSystem.system.a-prs": "A-PRS",
    "menu.equipmentSystem.gasManagementSystem.smartBog": "Smart BOG",
    "menu.equipmentSystem.gasManagementSystem.diagnosis": "Diagnosis",
    "menu.equipmentSystem.auxBoiler": "Aux. Boiler",
    "menu.equipmentSystem.BWTS": "BWTS",
    "menu.equipmentSystem.setting": "Setting",
    "menu.emission": "Emission",
    "menu.emission.emission": "Emission",
    "menu.emission.CII": "CII",
    "menu.emissionCii": "Emission & CII",
    "menu.safetyMonitor": "Safety",
    "menu.safetyMonitor.alarm": "Alarm Monitoring",
    "menu.report": "Report",
    "menu.report.noon": "Noon",
    "menu.report.imodcs": "IMO DCS",
    "menu.report.eumrv": "EU MRV",
    "menu.report.eumrv.mrvservice": "MRV Service",
    "menu.report.eumrv.voyage": "Voyage",
    "menu.report.eumrv.annual": "Annual",
    "menu.report.mrvservice": "MRV Report Service",
    "menu.report.mrvmanager": "MRV Report Manager",
    "menu.report.bwts": "BWTS",
    "menu.report.cybersecurity": "Cyber Security",
    "menu.crewSupport": "Crew Support",
    "menu.dataViewer": "Data Viewer",
    "menu.dataCorrelation": "Data Correlation",
    "menu.smartManager": "Security Manager",
    "menu.network": "Network Monitoring",
    "menu.itDevice": "IT Device Management",
    "menu.deviceStatus": "Device Status Monitoring",
    "menu.deviceLog": "Device Log Management",
    "menu.alarmLogMonitoring": "Alarm Log Monitoring",
    "menu.alarmLogMgmt": "Alarm Log Management",
    "menu.audit": "Audit Monitoring",
    "menu.auditLog": "Audit Log History",
    "menu.securityMonitoring": "Security Monitoring",
    "menu.setting": "Setting",
    "menu.particular": "Ship Particular",
    "menu.fleet": "Fleet Management",
    "menu.lesson": "Lesson Learend",
    "menu.lesson.learned": "Lessonlearned Search",
    "menu.lesson.write": "Knowledge Sharing+",
    "menu.lesson.board": "Lessonlearned History",
    "menu.digitalization": "Digitalization",
    "menu.personnel": "Personnel",
    "menu.simulation": "Simulation",
    "menu.monitoring": "Monitoring",
    "menu.monitoring.safetyDashboard": "Safety Dashboard",
    "menu.monitoring.performance": "Performance",
    "menu.monitoring.alarmHistory": "Alarm History",
    "menu.monitoring.report": "SeaTrial Report",
    "menu.monitoring.seaTrial": "SeaTrial",
    "menu.monitoring.onboard": "OnBoard",
    "menu.analysis": "Cost Analysis",
    "menu.analysis.cost": "Cost Analysis",
    "menu.analysis.synth-data": "Synth Data",
    "menu.schedule": "Schedule",
    "menu.schedule.ship-mgmt": "Ship Mgmt",
    "menu.schedule.schedule-mgmt": "Schedule Mgmt",
    "menu.schedule.activity-mgmt": "Activity Mgmt",
    "menu.personnel.personnel-mgmt": "Perssonel Mgmt",
    "menu.personnel.boarding-mgmt": "Boarding Mgmt",
    "menu.digitalization.doc-mgmt": "Doc Mgmt",
    "menu.digitalization.daily-report": "Daily Report",
    "menu.simulation.digitaltwin": "Simulation"
  },
  ko: {
    "menu.administratorSettings": "Setting",
    "menu.user": "User Management",
    "menu.account": "User Management",
    "menu.group": "User Group Management",
    "menu.commonData": "Common Data Management",
    "menu.portCanal": "Port & Canal Data",
    "menu.settingEmission": "Emission",
    "menu.engineering": "Engineering Data",
    "menu.vessel": "Ship Data Management",
    "menu.example": "예제",
    "menu.example.table": "테이블",
    "menu.example.chart": "차트",
    "menu.example.formBox": "폼 박스",
    "menu.example.input": "input",
    "menu.example.file": "파일",
    "menu.example.datePicker": "Date Picker",
    "menu.example.button": "버튼",
    "menu.application": "어플리케이션 관리 (예제)",
    "menu.voyage": "항해",
    "menu.voyage.voyageMonitoring": "항해 모니터링",
    "menu.voyage.voyagePlanner": "항해 최적화",
    "menu.voyage.trimOptimization": "트림 최적화",
    "menu.SPMS": "Ship Performance",
    "menu.SPMS.voyage": "Voyage Information",
    "menu.SPMS.fuel": "Fuel Information",
    "menu.SPMS.performance": "Performance",
    "menu.equipmentSystem": "Equipment & System",
    "menu.equipmentSystem.overview": "Overview",
    "menu.equipmentSystem.mainEngine": "Main Engine",
    "menu.equipmentSystem.mainEngine.overview": "Overview",
    "menu.equipmentSystem.mainEngine.cylinderUnit": "Cylinder Unit",
    "menu.equipmentSystem.mainEngine.MEAuxiliarySystem": "ME Auxiliary System",
    "menu.equipmentSystem.generatorEngine": "Generator Engine",
    "menu.equipmentSystem.generatorEngine.overview": "Overview",
    "menu.equipmentSystem.generatorEngine.GEAuxiliarySystem": "GE Auxiliary System",
    "menu.equipmentSystem.gasManagementSystem": "Gas Management System",
    "menu.equipmentSystem.gasManagementSystem.overview": "Overview",
    "menu.equipment.gas.management.system.fuel.gas.supply.system": "Fuel Gas Supply System",
    // content 영역에서는 full로 표시
    "menu.equipmentSystem.gasManagementSystem.FGSS": "FGSS",
    // side navi에서는 약어로 표시
    "menu.equipmentSystem.gasManagementSystem.reliquefactionSystem": "Re-liquefaction System",
    "menu.equipmentSystem.gasManagementSystem.system.a-prs": "A-PRS",
    "menu.equipmentSystem.gasManagementSystem.smartBog": "Smart BOG",
    "menu.equipmentSystem.gasManagementSystem.diagnosis": "Diagnosis",
    "menu.equipmentSystem.auxBoiler": "Aux. Boiler",
    "menu.equipmentSystem.BWTS": "BWTS",
    "menu.equipmentSystem.setting": "Setting",
    "menu.emission": "Emission",
    "menu.emission.emission": "Emission",
    "menu.emission.CII": "CII",
    "menu.emissionCii": "Emission & CII",
    "menu.safetyMonitor": "Safety",
    "menu.safetyMonitor.alarm": "Alarm Monitoring",
    "menu.report": "Report",
    "menu.report.noon": "Noon",
    "menu.report.imodcs": "IMO DCS",
    "menu.report.eumrv": "EU MRV",
    "menu.report.eumrv.mrvservice": "MRV Service",
    "menu.report.eumrv.voyage": "Voyage",
    "menu.report.eumrv.annual": "Annual",
    "menu.report.mrvservice": "MRV Report Service",
    "menu.report.mrvmanager": "MRV Report Manager",
    "menu.report.bwts": "BWTS",
    "menu.report.cybersecurity": "Cyber Security",
    "menu.crewSupport": "Crew Support",
    "menu.dataViewer": "Data Viewer",
    "menu.dataCorrelation": "Data Correlation",
    "menu.smartManager": "Security Manager",
    "menu.setting": "설정",
    "menu.fleet": "Fleet Management",
    "menu.particular": "선박 상세정보",
    "menu.lesson": "지식공유",
    "menu.schedule": "스케줄관리",
    "menu.digitalization": "디지털절차서",
    "menu.personnel": "인원관리",
    "menu.simulation": "시뮬레이션",
    // 'menu.mrc': '해상시운전',
    "menu.analysis": "비용분석",
    "menu.personnel.boarding-mgmt": "승선자명단",
    "menu.personnel.personnel-mgmt": "인원등록",
    "menu.schedule.schedule-mgmt": "일정등록",
    "menu.schedule.activity-mgmt": "테스트항목",
    "menu.schedule.ship-mgmt": "선박등록",
    "menu.lesson.learned": "시운전지식공유",
    "menu.lesson.write": "지식공유+",
    "menu.lesson.board": "시운전지식검색",
    "menu.digitalization.daily-report": "일일보고",
    "menu.digitalization.doc-mgmt": "문서관리",
    "menu.simulation.digitaltwin": "시뮬레이션 시나리오",
    // 'menu.mrc.mrcworldmap': '운항상태',
    "menu.monitoring": "시운전 모니터링",
    "menu.monitoring.safetyDashboard": "안전대시보드",
    "menu.monitoring.performance": "기관성능지표",
    "menu.monitoring.alarmHistory": "시운전알람이력",
    "menu.monitoring.report": "시운전결과리포트",
    "menu.monitoring.seaTrial": "운항상태",
    "menu.monitoring.onboard": "안벽상태",
    "menu.analysis.cost": "비용분석",
    "menu.analysis.synth-data": "재현데이터생성"
  }
};
const formLocale = {
  en: {
    "form.systemCode": "System Code",
    "form.systemName": "System Name",
    "form.domainUrl": "System URL",
    "form.charger": "Charger Name",
    "form.company": "Company",
    "form.chargerTel": "Charger Tel",
    "form.chargerEmail": "Charger Email",
    "form.webDevServer": "Development Web",
    "form.wasDevServer": "Development Was",
    "form.webDistPath": "Web Deploy Path",
    "form.wasDistPath": "Web Deploy Path",
    "form.webProdServer1": "Production Web1",
    "form.webProdServer2": "Production Web2",
    "form.wasProdServer1": "Production Was1",
    "form.wasProdServer2": "Production Was2",
    "form.systemType": "System Type",
    "form.serviceType": "Service Type",
    "form.accessibleIp": "Accessible IP",
    "form.textarea.placeholder": "Please enter your details.",
    // user
    "form.title.create": "Add User Information",
    "form.title.edit": "Edit User Information",
    "form.userId": "User Id",
    "form.text.placeholder": "Input text",
    "form.userId.placeholder": "ID를 입력하세요.",
    "form.userName": "Name",
    "form.userName.placeholder": "성명을 입력하세요.",
    "form.division": "Belong",
    "form.division.placeholder": "소속을 입력하세요.",
    "form.rank": "Rank",
    "form.email": "E-Mail",
    "form.enabled": "Enabled",
    "form.rank.placeholder": "계급을 입력하세요.",
    "form.phone": "Contact",
    "form.phone.placeholder": "+82",
    "form.role": "User Group",
    "form.role.placeholder": "Select a user group",
    "form.description": "Description",
    "form.createTime": "Registration Time",
    "form.password": "Password",
    "form.password.placeholder": "Please enter your password.",
    "form.updatedTime": "Update date",
    "form.createdUser": "Posted by",
    "form.group.name": "Group name",
    // port & canal Info
    "form.port.title.create": "Add Port Information",
    "form.port.title.edit": "Edit Port Information",
    "form.port.timezone": "Time Zone",
    "form.port.name": "Port name",
    "form.port.code": "UN/LOCODE",
    "form.port.code.placeholder": "Please enter UN/LOCODE in capital letters",
    "form.port.country": "Country",
    "form.port.country.placeholder": "Select a country",
    "form.port.latitude": "Latitude",
    "form.port.longitude": "Longitude",
    "form.port.localTime": "Local time",
    "form.port.photo": "Photo",
    "form.port.photo.placeholder": "Please upload a photo file",
    "form.port.details": "Details",
    "form.port.edit": "Edit",
    "form.port.informPopupType": "Information Popup (Voyage Monitoring service)",
    "form.port.shiptype": "Ship Type",
    "form.port.shiptype.placeholder": "Select a ship Type",
    "form.port.euShare": "EU Share",
    "form.canal.title.create": "Add canal information",
    "form.canal.title.edit": "Edit canal information",
    "form.canal.timezone": "Time Zone",
    "form.canal.name": "Canal name",
    "form.canal.name.placeholder": "Please enter Canal name",
    "form.canal.code": "UN/LOCODE",
    "form.canal.code.placeholder": "Please enter UN/LOCODE in capital letters",
    "form.canal.country": "Country",
    "form.canal.country.placeholder": "Select a country",
    "form.canal.latitude": "Latitude",
    "form.canal.longitude": "Longitude",
    "form.canal.localTime": "Local time",
    "form.canal.photo": "Photo",
    "form.canal.photo.placeholder": "Please upload a photo file",
    "form.canal.details": "Details",
    "form.canal.edit": "Edit",
    "form.canal.length": "Length",
    "form.canal.length.placeholder": "Please enter Length",
    "form.canal.maxboatbeam": "Max Beam",
    "form.canal.maxboatbeam.placeholder": "Please enter Max Beam",
    "form.canal.maxboatdraft": "Max Draft",
    "form.canal.maxboatdraft.placeholder": "Please enter Max Draft",
    "form.canal.length2": "Length",
    "form.canal.maxboatbeam2": "Max Beam",
    "form.canal.maxboatdraft2": "Max Draft",
    "form.canal.logo": "Logo",
    // 함정 정보 관리
    "form.shipTypeName": "Ship Type Name",
    "form.shipName": "Ship Name",
    "form.builder": "Builder",
    "form.tonnage": "Tonnage",
    "form.maximumSpeed": "Maximum Speed",
    "form.commissionDate": "Commission Date",
    // Device Log & Alarm Log
    "form.log.device.name": "Device",
    "form.log.device.workcontent": "Work content",
    "form.log.device.worktype": "Work type",
    "form.log.device.startDate": "Work date (Start)",
    "form.log.device.endDate": "Work date (End)",
    "form.log.device.writer": "Writer",
    "form.log.device.company": "Company",
    "form.log.device.team": "Team",
    "form.log.device.technicianName": "Technician name",
    "form.log.device.email": "Email",
    "form.log.device.description": "Work detail (Description)",
    "form.log.device.title.add": "Add Device Log",
    "form.log.device.title.edit": "Edit Device Log",
    "form.log.device.worktype.placeholder": "Please Select Work Type",
    "form.log.device.workcontent.sw.placeholder": "Please Select S/W process",
    "form.log.device.technicianname.placeholder": "Please Input Technician Name",
    "form.log.device.email.placeholder": "Please Input Email Address",
    "form.log.device.description.placeholder": "Please Input Work Detail",
    "form.log.device.alarm.name": "Device",
    "form.log.device.alarm.dataChannelId": "Alarm Name",
    "form.log.device.alarm.class": "Alarm Class",
    "form.log.device.alarm.level": "Severity",
    "form.log.device.alarm.message": "Message",
    "form.log.device.alarm.resultStatus": "Result",
    "form.log.device.alarm.startDate": "Work date (Start)",
    "form.log.device.alarm.endDate": "Work date (End)",
    "form.log.device.alarm.writer": "Writer",
    "form.log.device.alarm.company": "Company",
    "form.log.device.alarm.team": "Team",
    "form.log.device.alarm.technicianName": "Technician name",
    "form.log.device.alarm.email": "Contact",
    "form.log.device.alarm.description": "Work detail (Description)",
    "form.log.device.alarm.title.add": "Add Device Alarm Log",
    "form.log.device.alarm.title.edit": "Edit Device Alarm Log",
    "form.log.device.alarm.dataChannelId.placeholder": "Please Select Alarm name",
    "form.log.device.alarm.workcontent.sw.placeholder": "Please Select S/W process",
    "form.log.device.alarm.technicianname.placeholder": "Please Input Technician Name",
    "form.log.device.alarm.email.placeholder": "Please Input Email Address",
    "form.log.device.alarm.description.placeholder": "Please Input Work Detail",
    "form.log.device.alarm.delete.confirm": "Are you sure you want to delete\nthat device?",
    "form.log.device.alarm.close.confirm": "Something has changed.\nDo you want to cancel without saving?",
    "form.log.device.alarm.required.confirm": "You cannot save because you did\nnot enter the required information."
  },
  ko: {
    "form.systemCode": "시스템 코드",
    "form.systemName": "시스템명",
    "form.domainUrl": "시스템 URL",
    "form.charger": "운영책임자 이름",
    "form.company": "회사",
    "form.chargerTel": "연락처",
    "form.chargerEmail": "이메일",
    "form.webDevServer": "개발 Web",
    "form.wasDevServer": "개발 Was",
    "form.webDistPath": "Web 배포 Path",
    "form.wasDistPath": "Was 배포 Path",
    "form.webProdServer1": "운영 Web1",
    "form.webProdServer2": "운영 Web2",
    "form.wasProdServer1": "운영 Was1",
    "form.wasProdServer2": "운영 Was2",
    "form.systemType": "시스템타입",
    "form.serviceType": "서비스타입",
    "form.accessibleIp": "접근가능한 IP",
    "form.textarea.placeholder": "내용을 입력하세요.",
    // user
    "form.title.create": "사용자 등록",
    "form.title.edit": "사용자 정보 수정",
    "form.userId": "사용자 ID",
    "form.userId.placeholder": "ID를 입력하세요.",
    "form.userName": "성명",
    "form.userName.placeholder": "성명을 입력하세요.",
    "form.division": "소속",
    "form.division.placeholder": "소속을 입력하세요.",
    "form.rank": "계급",
    "form.rank.placeholder": "계급을 입력하세요.",
    "form.phone": "연락처",
    "form.phone.placeholder": "연락처를 입력하세요.",
    "form.role": "권한",
    "form.role.placeholder": "권한을 선택하세요.",
    "form.createTime": "등록일",
    "form.password": "비밀번호",
    "form.password.placeholder": "비밀번호를 입력하세요.",
    "form.name": "Name",
    "form.name.placeholder": "Please enter name.",
    // port & canal Info
    "form.port.title.create": "Add port information",
    "form.port.title.edit": "Edit port information",
    "form.port.timezone": "Time Zone",
    "form.port.name": "Port name",
    "form.port.code": "UN/LOCODE",
    "form.port.code.placeholder": "Please enter UN/LOCODE in capital letters",
    "form.port.country": "Country",
    "form.port.country.placeholder": "Select a country",
    "form.port.latitude": "Latitude",
    "form.port.longitude": "Longitude",
    "form.port.localTime": "Local time",
    "form.port.photo": "Photo",
    "form.port.photo.placeholder": "Please upload a photo file",
    "form.port.details": "Details",
    "form.port.edit": "Edit",
    "form.port.informPopupType": "Information Popup (Voyage Monitoring service)",
    "form.port.shiptype": "Ship Type",
    "form.port.shiptype.placeholder": "Select a ship Type",
    "form.port.euShare": "EU Share",
    "form.canal.title.create": "Add canal information",
    "form.canal.title.edit": "Edit canal information",
    "form.canal.timezone": "Time Zone",
    "form.canal.name": "Canal name",
    "form.canal.name.placeholder": "Please enter Canal name",
    "form.canal.code": "UN/LOCODE",
    "form.canal.code.placeholder": "Please enter UN/LOCODE in capital letters",
    "form.canal.country": "Country",
    "form.canal.country.placeholder": "Select a country",
    "form.canal.latitude": "Latitude",
    "form.canal.longitude": "Longitude",
    "form.canal.localTime": "Local time",
    "form.canal.photo": "Photo",
    "form.canal.photo.placeholder": "Please upload a photo file",
    "form.canal.details": "Details",
    "form.canal.edit": "Edit",
    "form.canal.length": "Length",
    "form.canal.length.placeholder": "Please enter Length",
    "form.canal.maxboatbeam": "Max Beam",
    "form.canal.maxboatbeam.placeholder": "Please enter Max Beam",
    "form.canal.maxboatdraft": "Max Draft",
    "form.canal.maxboatdraft.placeholder": "Please enter Max Draft",
    "form.canal.length2": "Length",
    "form.canal.maxboatbeam2": "Max Beam",
    "form.canal.maxboatdraft2": "Max Draft",
    "form.canal.logo": "Logo",
    // 함정 정보 관리
    "form.shipTypeName": "함형명",
    "form.shipName": "함정명",
    "form.builder": "건조사",
    "form.tonnage": "톤수",
    "form.maximumSpeed": "최대속도",
    "form.commissionDate": "취역내역",
    // Device Log & Alarm Log
    "form.log.device.name": "Device",
    "form.log.device.workcontent": "Work content",
    "form.log.device.worktype": "Work type",
    "form.log.device.startDate": "Work date (Start)",
    "form.log.device.endDate": "Work date (End)",
    "form.log.device.writer": "Writer",
    "form.log.device.company": "Company",
    "form.log.device.team": "Team",
    "form.log.device.technicianName": "Technician name",
    "form.log.device.email": "Email",
    "form.log.device.description": "Work detail (Description)",
    "form.log.device.title.add": "Add Device Log",
    "form.log.device.title.edit": "Edit Device Log",
    "form.log.device.worktype.placeholder": "Please Select Work Type",
    "form.log.device.workcontent.sw.placeholder": "Please Select S/W process",
    "form.log.device.technicianname.placeholder": "Please Input Technician Name",
    "form.log.device.email.placeholder": "Please Input Email Address",
    "form.log.device.description.placeholder": "Please Input Work Detail",
    "form.log.device.alarm.name": "Device",
    "form.log.device.alarm.dataChannelId": "Alarm Name",
    "form.log.device.alarm.class": "Alarm Class",
    "form.log.device.alarm.level": "Severity",
    "form.log.device.alarm.message": "Message",
    "form.log.device.alarm.resultStatus": "Result",
    "form.log.device.alarm.startDate": "Work date (Start)",
    "form.log.device.alarm.endDate": "Work date (End)",
    "form.log.device.alarm.writer": "Writer",
    "form.log.device.alarm.company": "Company",
    "form.log.device.alarm.team": "Team",
    "form.log.device.alarm.technicianName": "Technician name",
    "form.log.device.alarm.email": "Contact",
    "form.log.device.alarm.description": "Work detail (Description)",
    "form.log.device.alarm.title.add": "Add Device Alarm Log",
    "form.log.device.alarm.title.edit": "Edit Device Alarm Log",
    "form.log.device.alarm.dataChannelId.placeholder": "Please Select Alarm name",
    "form.log.device.alarm.workcontent.sw.placeholder": "Please Select S/W process",
    "form.log.device.alarm.technicianname.placeholder": "Please Input Technician Name",
    "form.log.device.alarm.email.placeholder": "Please Input Email Address",
    "form.log.device.alarm.description.placeholder": "Please Input Work Detail",
    "form.log.device.alarm.delete.confirm": "Are you sure you want to delete\nthat device?",
    "form.log.device.alarm.close.confirm": "Something has changed.\nDo you want to cancel without saving?",
    "form.log.device.alarm.required.confirm": "You cannot save because you did\nnot enter the required information."
  }
};
const pagesLocale = {
  en: {
    // 로그인
    "login.id": "Please enter your ID",
    "login.password": "Please enter a password",
    "login.callAdmin": "* If you do not know your password, contact the administrator (919-XXXX).",
    // 비밀번호 변경
    "change-pw.changePw": "Change Password",
    "change-pw.origin": "Please enter your previous password.",
    "change-pw.new": "Please enter the new password to use.",
    "change-pw.newRe": "Please enter the new password again.",
    // 검색 전 조회 화면
    "no-search.title": "Please enter the conditions and proceed with the search.",
    // company
    "company.name": "Company name",
    "company.country": "Country",
    "company.account": "Company account",
    // 함정 정보 > 함정 목록
    "ship-info.list.msg": "Up to 8 can be selected",
    "ship-info.list.alert.msg": "You can select up to 8 ship types.",
    // 함정 정보 > 함정 운용현황
    "ship-info.operationStatus.info": "Ship Operation Information",
    "ship-info.operationStatus.speed": "Speed",
    "ship-info.operationStatus.direction": "Direction",
    "ship-info.operationStatus.pitch": "Pitch",
    "ship-info.operationStatus.rolling": "Rolling",
    "ship-info.operationStatus.drivingTime": "Driving Time",
    "ship-info.operationStatus.stopTime": "Stop Time",
    // 장비 운용현황
    "equipment.operationStatus.cw": "CW",
    "equipment.operationStatus.vds": "VDS",
    "equipment.operationStatus.ddu": "DDU",
    "equipment.operationStatus.vdsStatus": "VDS Status",
    "equipment.operationStatus.dduStatus": "DDU Status",
    "equipment.operationStatus.diagnosisTime": "Diagnosis Time",
    "equipment.operationStatus.alarmMessage": "Alarm Message",
    "equipment.operationStatus.alarmCount": "Alarm Count",
    // 장비 모니터링 > 장비
    equipment: "Equipment",
    "equipment.shipOperationInformation": "Ship Operation Information",
    "equipment.speed": "Speed",
    "equipment.wind": "Wind",
    "equipment.pitch": "Pitch",
    "equipment.rolling": "Rolling",
    "equipment.newTab": "NewTab",
    "equipment.newWindow": "NewWindow",
    "equipment.subEquipment.control": "Control",
    "equipment.subEquipment.cooling": "Cooling",
    "equipment.subEquipment.enclosure": "Enclosure",
    "equipment.subEquipment.fuel": "Fuel",
    "equipment.subEquipment.lubrication": "Lubrication",
    "equipment.subEquipment.starting": "Starting",
    "equipment.subEquipment.turbine": "Turbine",
    "equipment.subEquipment.vibration": "Vibration",
    "equipment.subEquipment.exhaust": "Exhaust",
    "equipment.subEquipment.turbocharger": "Turbocharger",
    "equipment.subEquipment.engine": "Engine",
    "equipment.subEquipment.alternator": "Alternator",
    "equipment.subEquipment.dg1Unit": "DG1 Unit",
    "equipment.subEquipment.dg2Unit": "DG2 Unit",
    "equipment.subEquipment.dg3Unit": "DG3 Unit",
    "equipment.subEquipment.dg4Unit": "DG4 Unit",
    "equipment.subEquipment.shore": "Shore",
    "equipment.subEquipment.msbd": "MSBD",
    "equipment.subEquipment.syncUnit": "Sync Unit",
    "equipment.subEquipment.electricMotor": "Electric Motor",
    "equipment.subEquipment.motorDrive": "Motor Drive",
    "equipment.subEquipment.portCpp": "Port CPP",
    "equipment.subEquipment.portShaft": "Port Shaft",
    "equipment.subEquipment.stbdCpp": "STBD CPP",
    "equipment.subEquipment.stbdShaft": "STBD Shaft",
    "equipment.subEquipment.portGear": "Port Gear",
    "equipment.subEquipment.stbdGear": "STBD Gear",
    "equipment.subEquipment.crossConnect": "Cross Connect",
    "equipment.subEquipment.chilledWaterZone": "Chilled Water Zone",
    "equipment.subEquipment.chilledWaterPlant": "Chilled Water Plant",
    "equipment.subEquipment.chilledWaterSeaWaterPump": "Chilled Water Sea Water Pump",
    "equipment.subEquipment.chilledWaterPump": "Chilled Water Pump",
    // 장비 모니터링 > 장비 > 개요 탭
    "equipment.outline": "Outline",
    "equipment.outline.title": "Equipment Status",
    "equipment.outline.card.title1": "Equipment Operation Status",
    "equipment.outline.card.title2": "Equipment Alarm Status",
    "equipment.outline.totalDrivingTime": "Total Driving Time",
    "equipment.outline.aWeekAgo": "a week ago",
    "equipment.outline.aMonthAgo": "a month ago",
    "equipment.outline.threeMonthAgo": "three month ago",
    "equipment.outline.card.title3": "Equipment Alarm Action Status",
    "equipment.outline.card.title4": "Sensor Alarm Status",
    "equipment.outline.notResolvedCount": "Number Of Cases Not Resolved",
    "equipment.outline.totalCommentsCount": "Total Number Of Comments",
    "equipment.outline.totalReportsCount": "Total Number Of Reports",
    "equipment.outline.totalAlarmsCount": "Total Number Of Alarms",
    "equipment.outline.sensorAlarmTime": "Sensor Alarm Time",
    // 장비 모니터링 > 장비 > 장비 알람현황 탭
    "equipment.alarmStatus": "Equipment Alarm Status",
    "equipment.alarmStatus.referencePeriod": "Reference Period",
    "equipment.alarmStatus.sensorValueBySubEquipment": "Sensor Value Status By Sub-equipment",
    // 장비 모니터링 > 장비 > 상태진단 탭
    "equipment.diagnosis": "Condition Diagnosis",
    "equipment.diagnosis.chart.legend1": "Trend Line",
    "equipment.diagnosis.chart.legend2": "Abnormally Detected Data",
    // 장비 모니터링 > 장비 > 상관관계분석 탭
    "equipment.analysis": "Correlation Analysis",
    "equipment.analysis.standardTable": "Standard Correlation Table",
    "equipment.analysis.analysisResults": "Correlation Analysis Results",
    "equipment.analysis.diagnosisChart": "Condition Diagnosis Chart",
    "equipment.analysis.analysisPeriod": "Analysis Period",
    // 장비 모니터링 > 장비 > 상태진단 데이터조회 탭
    "equipment.notice": "Notice",
    "equipment.diagnosisData": "Status Diagnosis Data Inquiry",
    "equipment.diagnosisData.notice": "Considering system performance, it is recommended to view the heat map on a sub-device basis. When searching by sensor, it may not be displayed properly.",
    "equipment.diagnosisData.listTitle": "Sub-equipment/Sensor List",
    "equipment.diagnosisData.heatmapTitle": "Heat Map Of Alarm Occurrence By Sub-equipment/Sensor",
    "equipment.diagnosisData.tableTitle": "Status Diagnosis Alarm Occurrence Statistics For Each Sub-equipment/Sensor",
    "equipment.diagnosisData.searchPeriod": "Search Period",
    "equipment.diagnosisData.chartPopupTitle": "Alarm Chart",
    "equipment.diagnosisData.chartPopupSubTitle": "Sensor Status Diagnosis Alarm Statistics Chart",
    "equipment.diagnosisData.occurrencesCount": "Number Of Occurrences",
    // 정비지원 > 함정 알람관리 > 상태진단 알람
    "support.alarm.status.level": "Alarm level",
    "support.alarm.status.table.time": "Time",
    "support.alarm.status.table.message": "Alarm message",
    "support.alarm.status.table.value": "Value",
    "support.alarm.status.table.criteria": "Criteria",
    "support.alarm.status.table.deviation": "Deviation",
    "support.alarm.status.table.comment": "Comment",
    "support.alarm.status.table.report": "Report",
    "support.alarm.status.comment.title": "Comment write",
    "support.alarm.status.excel.title": "Status diagnosis alarm",
    // 정비지원 > 함정 알람관리 > Ecs 알람
    "support.alarm.ecs.table.time": "Time",
    "support.alarm.ecs.table.type": "Type",
    "support.alarm.ecs.table.thresholds": "Thresholds",
    "support.alarm.ecs.table.range": "Range",
    // 정비지원 > 기술문서 관리
    "support.techDoc.file.type": "Document type",
    "support.techDoc.file.placeholder": "Select document type",
    "support.techDoc.shipType.placeholder": "Select Ship Type",
    "support.techDoc.ship.placeholder": "Select Ship Name",
    "support.techDoc.equipment.placeholder": "Select Equipment Name",
    "support.techDoc.doc.title": "Document Title",
    "support.techDoc.doc.placeholder": "Please enter the document title.",
    "support.techDoc.file.label": "Please select file.",
    "support.techDoc.add.title": "Add Technical Document File",
    "support.techDoc.type.all": "All",
    "support.techDoc.type.etc": "ETC",
    "support.techDoc.type.maintenanceManual": "Maintenance Manual",
    "support.techDoc.type.operatingTechnicalMenual": "Operation Manual Technical Manual",
    "support.techDoc.type.constructionOrder": "Construction order",
    "support.techDoc.type.powerManagemnetSystem": "Unit Power Management System",
    "support.techDoc.type.maintenanceDetails": "Maintenance Details",
    // 정비지원 > 보고서 관리
    "support.report.add": "Add",
    "support.report.type.select": "Select Report",
    "support.report.type.placeholder": "Report Type",
    "support.report.file.label": "Please select a file.",
    "support.report.file.upload": "Upload",
    "support.report.file.list": "File List",
    "support.report.ref.list": "Reference File List",
    "support.report.table.writeDate": "Write Date",
    "support.report.table.title": "Report Title",
    "support.report.table.writer": "Writer",
    "support.report.table.first": "First Report",
    "support.report.table.action": "Action Details",
    "support.report.table.analyze": "Post-action Analyze",
    "support.report.table.ref": "Reference",
    "support.report.file.title": "Upload Report File",
    "support.report.ref.title": "Reference File",
    "support.report.type.anomalyDetection": "Anomaly Detection Report",
    "support.report.type.equipmentDiagnosis": "Equipment Diagnosis Report",
    "support.report.type.equipmentBreakdown": "Equipment Breakdown Report",
    "support.report.file.error": "Please delete the existing file and upload it.",
    "support.report.write.chart": "Go to chart creation menu",
    "support.report.write.chart.tooltip1": "Go to the ‘Condition Diagnosis’ chart page",
    "support.report.write.chart.tooltip2": "where you can see the status diagnosis trend of the sensor.",
    "support.report.write.chart.tooltip3": "You can capture the chart",
    "support.report.write.chart.tooltip4": "and use it for report work.",
    "support.report.write.action.details": "Action Details",
    "support.report.write.save.msg": "Once you click 'Save', you will not be able to edit the report.\n Do you want to save it?",
    "support.report.write.reportNumber": "Report Number",
    "support.report.write.writeDate": "Creation Date",
    "support.report.write.writeDate.placeholder": "Please enter the creation date.",
    "support.report.write.writer": "Writer",
    "support.report.write.writer.placeholder": "Please enter the writer.",
    "support.report.write.basicInfo": "Basic Information",
    "support.report.write.basicInfo.shipType": "Ship Type",
    "support.report.write.basicInfo.ship": "Ship",
    "support.report.write.basicInfo.equipment": "Equipment Name",
    "support.report.write.basicInfo.codeSn": "Equipment Code / Serial Number",
    "support.report.write.basicInfo.subEquipment": "Sub Equipment",
    "support.report.write.basicInfo.sensor": "Sensor Name",
    "support.report.write.basicInfo.subEquipment.placeholder": "Select Sub Equipment",
    "support.report.write.basicInfo.analysisPeriod": "Analysis Period",
    "support.report.write.equipmentDiagnosis": "Equipment Diagnosis Period",
    "support.report.write.equipmentDiagnosis.title.placeholder": "Please enter the title.",
    "support.report.write.equipmentDiagnosis.details.placeholder": "Please enter details.",
    "support.report.write.breakdownInfo": "Breakdown Information",
    "support.report.write.breakdownInfo.details": "Breakdown Details",
    "support.report.write.breakdownInfo.details.placeholder": "Please enter the details of breakdown.",
    "support.report.write.breakdownInfo.reason": "Breakdown(estimated) cause",
    "support.report.write.breakdownInfo.reason.placeholder": "Please enter the cause of the breakdown.",
    "support.report.write.breakdownInfo.team": "Reporting Department/Team",
    "support.report.write.breakdownInfo.team.placeholder": "Reporting Department/Team",
    "support.report.write.currentRepair": "Recent Maintenance History",
    "support.report.write.currentRepair.date": "Date",
    "support.report.write.currentRepair.team": "Maintenance Department/Team",
    "support.report.write.currentRepair.details": "Work Details",
    "support.report.write.currentRepair.date.placeholder": "Please enter the date.",
    "support.report.write.currentRepair.team.placeholder": "Maintenance Department/Team",
    "support.report.write.currentRepair.details.placeholder": "Please enter the details of maintenance.",
    "support.report.write.anomalyDetection": "Anomaly Detection Details",
    "support.report.write.anomalyDetection.subEquipment": "Sub Equipment",
    "support.report.write.anomalyDetection.sensor": "Sensor Name",
    "support.report.write.anomalyDetection.message": "Alarm message",
    "support.report.write.anomalyDetection.value": "Sensor Value",
    "support.report.write.anomalyDetection.date": "Date of Anomaly detection",
    "support.report.write.anomalyDetection.placeholder": "Please enter the details of anomaly detection",
    "support.report.write.judgement": "Comprehensive Judgment",
    "support.report.write.judgement.placeholder": "Please enter the details of comprehensive judgment",
    // 장비 부호 관리
    "equipmentCode.fileTableTitle": "Ship Equipment Code File List",
    "equipmentCode.tableTitle": "Equipment Code List",
    "equipmentCode.fileUpload": "Upload Equipment Code File",
    "equipmentCode.serialNumber": "Serial Number",
    // 함정 정보 관리
    "shipInfo.notice": "※ If no information is displayed in the ship list table, upload the ‘Equipment Code’ file in the ‘Administrator Settings/Equipment Code Management’ menu to display ship information.",
    "shipInfo.editPopupTitle": "Change Ship Information",
    "shipInfo.deleteConfirmNotice": "If you delete ship information, all data associated with the ship will be deleted from the DB.",
    // 장비 정보 관리
    "equipmentInfo.file.table.title": "Ship Equipment Information File (IO List)",
    "equipmentInfo.table.title": "Equipment Information Inquiry",
    "equipmentInfo.create.dialog.title": "Register Equipment I/O list",
    "equipmentInfo.table.signal": "Signal",
    "equipmentInfo.table.type": "Type",
    "equipmentInfo.table.ll": "LL",
    "equipmentInfo.table.l": "L",
    "equipmentInfo.table.h": "H",
    "equipmentInfo.table.hh": "HH",
    // 데이터 분석 > 데이터 관리 > 데이터 파일 조회
    "analysis.data.file.msg": "※ This file is a file that stores the ECS original data received from the ship by grouping them on a daily basis for the user's convenience in viewing and sharing the data.",
    "analysis.data.file.createTime": "File Created Time",
    "analysis.data.file.size": "Size",
    // 데이터 분석 > 데이터 관리 > 센서 데이터 조회
    "analysis.data.sensor.time": "Time",
    "analysis.data.sensor.data": "Sensor Data",
    // 관리자 설정 > 계정 관리
    "user.btn.newItem": "New",
    "user.btn.resetPassword": "Reset password",
    "user.notice.passwordConfirm": "관리자 패스워드를 입력하세요.",
    "user.notice.passwordReset": "패스워드가 초기화되었습니다.",
    "user.btn.duplicateCheck": "Duplicate Check",
    // 관리자 설정 > 사용자 그룹 관리
    "user.auth.group": "User group",
    "user.auth.menuList": "Menu List",
    // 관리자 설정 > 선박 정보 관리
    "ship.name": "Ship name",
    "ship.imo": "IMO No.",
    "ship.type": "Type",
    "ship.size": "Size",
    "ship.built": "Year built",
    "ship.deliveryDate": "Delivery date",
    "ship.eedi": "EEDI",
    "ship.imo.number": "IMO number",
    "ship.mmsi.number": "MMSI number",
    "ship.country": "Country",
    "ship.country.placeholder": "Select a country",
    "ship.vesselType": "Vessel type",
    "ship.vesselType.placeholder": "Select a type",
    "ship.vesselSize": "Vessel size",
    "ship.vesselSize.placeholder": "Select a size",
    "ship.length": "Length",
    "ship.width": "Width",
    "ship.gt": "GT",
    "ship.nt": "NT",
    "ship.dwt": "DWT",
    "ship.year": "Year of Built",
    "ship.year.placeholder": "Select a year",
    "ship.iceClass": "Ice class",
    "ship.me": "M/E",
    "ship.equipment.name": "Model name",
    "ship.equipment.model": "Engine model",
    "ship.equipment.ofdf": "OF or DF",
    "ship.equipment.mcr": "MCR",
    "ship.equipment.cylinder": "No. of cylinder",
    "ship.equipment.fuelType1": "Fuel type #1",
    "ship.equipment.fuelType2": "Fuel type #2",
    "ship.equipment.shaftGenerator": "Shaft Generator",
    "ship.ge": "G/E",
    "ship.equipment.type": "Type",
    "ship.equipment.fuel": "Fuel",
    "ship.equipment.emergencyGe": "Emergency GE",
    "ship.equipment.df": "No. of DF",
    "ship.equipment.dfFuelType": "DF Fuel type",
    "ship.equipment.of": "No. of OF",
    "ship.equipment.ofFuelType": "OF Fuel type",
    "ship.aux": "Aux. Boiler",
    "ship.composite": "Composite Boiler",
    "ship.ese": "Energy Saving Equipment",
    "ship.equipment.fuelType": "Fuel type",
    "ship.tank": "No. of tank",
    "ship.bunkering": "Bunkering",
    "ship.method": "Method used to measure fuel oil consumption",
    "ship.fuel.type": "Fuel type",
    "ship.fuel.lhv": "LHV",
    "ship.fuel.density": "Density",
    "ship.fuel.bunkeringVolume": "Volume",
    "ship.fuel.bunkeringDate": "Date",
    "ship.fuel.bunkeringPort": "Port",
    "ship.emergencyGe": "Emergency G/E",
    "ship.equipment.fuelLine": "Fuel line",
    "ship.tank.type1": "Tank Type No.1",
    "ship.tank.type2": "Tank Type No.2",
    "ship.tank.type3": "Tank Type No.3",
    "ship.tank.type4": "Tank Type No.4",
    "ship.tank.capacity": "Capacity",
    // 데이터 분석 > 유사함정 교차 분석
    "similarity-crossing.title1": "Primary Ship Analysis",
    "similarity-crossing.title2": "Secondary Ship Analysis",
    "similarity-crossing.save.db": "Save(DB)",
    "similarity-crossing.load.db": "Load(DB)",
    "similarity-crossing.load.db.notice": "※ Select the saved data and press the ‘Load’ button",
    "similarity-crossing.saved-name.placeholder": "Enter a name to save",
    // safety > alarm
    "safety.alarm.channelId": "Data Channel ID",
    "safety.alarm.system": "System",
    "safety.alarm.data": "Data",
    "safety.alarm.currentState": "Current State",
    "safety.alarm.count": "Count",
    // security
    "security.device.name": "Device name",
    "security.device.category": "Category",
    "security.device.supplier": "Supplier",
    "security.device.hwManufacturer": "H/W manufacturer",
    "security.device.hwModel": "H/W model",
    "security.device.osName": "OS name",
    "security.device.osVersion": "OS Version",
    "security.device.status": "Status",
    "security.device.cpu": "CPU",
    "security.device.memory": "Memory",
    "security.device.disk": "Disk",
    "security.device.nic": "NIC",
    "security.device.network": "Network",
    "security.device.tx": "Tx",
    "security.device.rx": "Rx",
    "security.process.name": "Process name",
    "security.process.version": "Version",
    "security.process.status": "Status",
    "security.process.time": "Last started time",
    "security.process.description": "Description",
    "security.alarm.name": "Alarm name",
    "security.alarm.time": "Last updated time",
    "security.alarm.class": "Alarm class",
    "security.alarm.level": "Severity",
    "security.alarm.message": "Message"
  },
  ko: {
    // 로그인
    "login.id": "아이디를 입력하세요",
    "login.password": "비밀번호를 입력하세요",
    "login.callAdmin": "* 비빌번호를 모를 경우에는 관리자(919-XXXX)에게 문의하세요.",
    // 비밀번호 변경
    "change-pw.changePw": "비밀번호 변경",
    "change-pw.origin": "기존 비밀번호를 입력해주세요.",
    "change-pw.new": "새로 사용할 비밀번호를 입력해주세요.",
    "change-pw.newRe": "새로 사용할 비밀번호를 한번 더 입력해주세요.",
    // 검색 전 조회 화면
    "no-search.title": "조건을 입력하고 조회를 진행해 주세요.",
    // 함정 정보 > 함정 목록
    "ship-info.list.msg": "최대 8개까지 선택 가능",
    "ship-info.list.alert.msg": "함형은 최대 8개까지 선택할 수 있습니다.",
    // 함정 정보 > 함정 운용현황
    "ship-info.operationStatus.info": "함정 운항정보",
    "ship-info.operationStatus.speed": "속도",
    "ship-info.operationStatus.direction": "풍향",
    "ship-info.operationStatus.pitch": "피치",
    "ship-info.operationStatus.rolling": "롤링",
    "ship-info.operationStatus.drivingTime": "운전시간",
    "ship-info.operationStatus.stopTime": "정지시간",
    // 장비 운용현황
    "equipment.operationStatus.cw": "냉수기",
    "equipment.operationStatus.vds": "VDS",
    "equipment.operationStatus.ddu": "DDU",
    "equipment.operationStatus.vdsStatus": "VDS 현황",
    "equipment.operationStatus.dduStatus": "DDU 현황",
    "equipment.operationStatus.diagnosisTime": "진단시간",
    "equipment.operationStatus.alarmMessage": "알람 메시지",
    "equipment.operationStatus.alarmCount": "알람갯수",
    // 장비 모니터링 > 장비
    "equipment.shipOperationInformation": "함정 운항정보",
    "equipment.speed": "속도",
    "equipment.wind": "풍향",
    "equipment.pitch": "피치",
    "equipment.rolling": "롤링",
    "equipment.newTab": "새 탭에서 링크열기",
    "equipment.newWindow": "새 창에서 링크열기",
    "equipment.subEquipment.control": "제어",
    "equipment.subEquipment.cooling": "냉각",
    "equipment.subEquipment.enclosure": "차음상자",
    "equipment.subEquipment.fuel": "연료",
    "equipment.subEquipment.lubrication": "윤활",
    "equipment.subEquipment.starting": "시동",
    "equipment.subEquipment.turbine": "터빈",
    "equipment.subEquipment.vibration": "진동",
    "equipment.subEquipment.exhaust": "배기",
    "equipment.subEquipment.turbocharger": "과급기",
    "equipment.subEquipment.engine": "엔진",
    "equipment.subEquipment.alternator": "발전기",
    "equipment.subEquipment.dg1Unit": "No.1 발전기",
    "equipment.subEquipment.dg2Unit": "No.2 발전기",
    "equipment.subEquipment.dg3Unit": "No.3 발전기",
    "equipment.subEquipment.dg4Unit": "No.4 발전기",
    "equipment.subEquipment.shore": "육상전원",
    "equipment.subEquipment.msbd": "주배전반",
    "equipment.subEquipment.syncUnit": "동기화 장치",
    "equipment.subEquipment.electricMotor": "추진전동기",
    "equipment.subEquipment.motorDrive": "전동기드라이브",
    "equipment.subEquipment.portCpp": "좌현 추진기",
    "equipment.subEquipment.portShaft": "좌현 축계",
    "equipment.subEquipment.stbdCpp": "우현 추진기",
    "equipment.subEquipment.stbdShaft": "우현 축계",
    "equipment.subEquipment.portGear": "좌현기어",
    "equipment.subEquipment.stbdGear": "우현기어",
    "equipment.subEquipment.crossConnect": "크로스커넥트기어",
    "equipment.subEquipment.chilledWaterZone": "냉수구역",
    "equipment.subEquipment.chilledWaterPlant": "냉수플랜트",
    "equipment.subEquipment.chilledWaterSeaWaterPump": "냉수플랜트 해수 펌프",
    "equipment.subEquipment.chilledWaterPump": "냉수펌프",
    // 장비 모니터링 > 장비 > 개요 탭
    "equipment.outline": "개요",
    "equipment.outline.title": "장비 현황",
    "equipment.outline.card.title1": "장비운용현황",
    "equipment.outline.card.title2": "장비 알람현황",
    "equipment.outline.card.title3": "장비 알람조치현황",
    "equipment.outline.card.title4": "센서 알람 현황",
    "equipment.outline.totalDrivingTime": "총 운전시간",
    "equipment.outline.aWeekAgo": "전 1주",
    "equipment.outline.aMonthAgo": "전월",
    "equipment.outline.threeMonthAgo": "전 3개월",
    "equipment.outline.notResolvedCount": "미결 건수",
    "equipment.outline.totalCommentsCount": "코멘트 총수",
    "equipment.outline.totalReportsCount": "보고서 총수",
    "equipment.outline.totalAlarmsCount": "알람 총수",
    "equipment.outline.sensorAlarmTime": "센서 알람 시간",
    // 장비 모니터링 > 장비 > 장비 알람현황 탭
    "equipment.alarmStatus": "장비 알람현황",
    "equipment.alarmStatus.referencePeriod": "기준 기간",
    "equipment.alarmStatus.sensorValueBySubEquipment": "하위 장비별 센서값 현황",
    // 장비 모니터링 > 장비 > 상태진단 탭
    "equipment.diagnosis": "상태진단",
    "equipment.diagnosis.chart.legend1": "추세선",
    "equipment.diagnosis.chart.legend2": "이상 감지 된 데이터",
    // 장비 모니터링 > 장비 > 상관관계분석 탭
    "equipment.analysis": "상관관계분석",
    "equipment.analysis.standardTable": "기준상관계표",
    "equipment.analysis.analysisResults": "상관 관계 분석 결과",
    "equipment.analysis.diagnosisChart": "상태진단 차트",
    "equipment.analysis.analysisPeriod": "분석기간",
    // 장비 모니터링 > 장비 > 상태진단 데이터조회 탭
    "equipment.notice": "안내",
    "equipment.diagnosisData": "상태진단 데이터조회",
    "equipment.diagnosisData.notice": "시스템 성능을 고려하여 히트맵은 하위장비 단위로 조회를 권고합니다.<br/>센서 단위로 조회하는 경우에 정상적으로 표시가 안될 수 있습니다.",
    "equipment.diagnosisData.listTitle": "하위장비/센서 목록",
    "equipment.diagnosisData.heatmapTitle": "하위장비/센서 알람 발생 히트맵",
    "equipment.diagnosisData.tableTitle": "하위장비/센서 별 상태진단 알람 발생 통계",
    "equipment.diagnosisData.searchPeriod": "검색 주기",
    "equipment.diagnosisData.chartPopupTitle": "알람 차트",
    "equipment.diagnosisData.chartPopupSubTitle": "센서 상태진단 알람통계 차트",
    "equipment.diagnosisData.occurrencesCount": "발생횟수",
    // 정비지원 > 함정 알람관리 > 상태진단 알람
    "support.alarm.status.level": "알람 레벨",
    "support.alarm.status.table.time": "알람발생시간",
    "support.alarm.status.table.message": "알람 메세지",
    "support.alarm.status.table.value": "알람값",
    "support.alarm.status.table.criteria": "기준값",
    "support.alarm.status.table.deviation": "편차",
    "support.alarm.status.table.comment": "코멘트",
    "support.alarm.status.table.report": "레포트",
    "support.alarm.status.comment.title": "코멘트 작성",
    "support.alarm.status.excel.title": "상태진단 알람",
    // 정비지원 > 함정 알람관리 > Ecs 알람
    "support.alarm.ecs.table.time": "알람발생시간",
    "support.alarm.ecs.table.type": "Type",
    "support.alarm.ecs.table.thresholds": "Thresholds, Range (LL,L,H,HH)",
    // 정비지원 > 기술문서 관리
    "support.techDoc.file.type": "문서 유형",
    "support.techDoc.file.placeholder": "문서 유형 선택",
    "support.techDoc.shipType.placeholder": "함형 선택",
    "support.techDoc.ship.placeholder": "함정명 선택",
    "support.techDoc.equipment.placeholder": "장비명 선택",
    "support.techDoc.doc.title": "문서 제목",
    "support.techDoc.doc.placeholder": "문서 제목을 입력하세요.",
    "support.techDoc.file.label": "업로드할 파일을 선택하세요.",
    "support.techDoc.add.title": "기술문서 파일 등록",
    "support.techDoc.type.all": "전체",
    "support.techDoc.type.etc": "기타",
    "support.techDoc.type.maintenanceManual": "정비자 정비교범",
    "support.techDoc.type.operatingTechnicalMenual": "운용자 운용교범 기술교범",
    "support.techDoc.type.constructionOrder": "공사명령서",
    "support.techDoc.type.powerManagemnetSystem": "부대 전력관리시스템",
    "support.techDoc.type.maintenanceDetails": "정비창/수리창 정비내역",
    // 정비지원 > 보고서 관리
    "support.report.add": "신규작성",
    "support.report.type.select": "보고서 선택",
    "support.report.type.placeholder": "보고서 유형",
    "support.report.file.label": "업로드할 파일을 선택하세요.",
    "support.report.file.upload": "업로드",
    "support.report.file.list": "파일 목록",
    "support.report.ref.list": "참고파일 목록",
    "support.report.table.writeDate": "작성일",
    "support.report.table.title": "보고서 제목",
    "support.report.table.writer": "작성자",
    "support.report.table.first": "최초보고",
    "support.report.table.action": "조치내용",
    "support.report.table.analyze": "조치 후 분석",
    "support.report.table.ref": "참고자료",
    "support.report.file.title": "보고서 파일 업로드",
    "support.report.ref.title": "참고파일",
    "support.report.type.anomalyDetection": "이상탐지 보고서",
    "support.report.type.equipmentDiagnosis": "장비진단 보고서",
    "support.report.type.equipmentBreakdown": "장비고장 보고서",
    "support.report.file.error": "기존 파일을 삭제하고 업로드해주세요.",
    "support.report.write.chart": "차트 제작 메뉴로 이동",
    "support.report.write.chart.tooltip1": "해당 센서의 상태진단 추이를 볼 수 있는",
    "support.report.write.chart.tooltip2": "‘상태진단’ 차트 페이지로 이동합니다.",
    "support.report.write.chart.tooltip3": "해당 차트를 캡처해서 보고서 작업에",
    "support.report.write.chart.tooltip4": "활용할 수 있습니다.",
    "support.report.write.action.details": "조치 내용",
    "support.report.write.save.msg": "'저장'을 하면 보고서 수정이 불가합니다.\n 저장하시겠습니까?",
    "support.report.write.reportNumber": "보고서 번호",
    "support.report.write.writeDate": "작성일자",
    "support.report.write.writeDate.placeholder": "작성일자를 입력하세요.",
    "support.report.write.writer": "작성자",
    "support.report.write.writer.placeholder": "작성자를 입력하세요.",
    "support.report.write.basicInfo": "기본 정보",
    "support.report.write.basicInfo.shipType": "함형",
    "support.report.write.basicInfo.ship": "함정",
    "support.report.write.basicInfo.equipment": "장비명",
    "support.report.write.basicInfo.codeSn": "장비부호 / 일련번호",
    "support.report.write.basicInfo.subEquipment": "하위장비",
    "support.report.write.basicInfo.sensor": "센서명",
    "support.report.write.basicInfo.subEquipment.plcaeholder": "하위장비 선택",
    "support.report.write.basicInfo.analysisPeriod": "분석기간",
    "support.report.write.equipmentDiagnosis": "장비진단 내용",
    "support.report.write.equipmentDiagnosis.title.placeholder": "제목을 입력하세요.",
    "support.report.write.equipmentDiagnosis.details.placeholder": "내용을 입력하세요.",
    "support.report.write.breakdownInfo": "고장정보",
    "support.report.write.breakdownInfo.details": "고장 내용",
    "support.report.write.breakdownInfo.details.placeholder": "고장 내용을 입력하세요.",
    "support.report.write.breakdownInfo.reason": "고장(추정) 원인",
    "support.report.write.breakdownInfo.reason.placeholder": "고장 원인을 입력하세요.",
    "support.report.write.breakdownInfo.team": "보고 부서/팀",
    "support.report.write.breakdownInfo.team.placeholder": "보고 부서/팀",
    "support.report.write.currentRepair": "최근 정비 이력",
    "support.report.write.currentRepair.date": "일자",
    "support.report.write.currentRepair.team": "정비 부서/팀",
    "support.report.write.currentRepair.details": "작업 내용",
    "support.report.write.currentRepair.date.placeholder": "일자를 입력하세요.",
    "support.report.write.currentRepair.team.placeholder": "정비 부서/팀",
    "support.report.write.currentRepair.details.placeholder": "작업 내용을 입력하세요.",
    "support.report.write.anomalyDetection": "이상탐지 내용",
    "support.report.write.anomalyDetection.subEquipment": "하위 장비",
    "support.report.write.anomalyDetection.sensor": "센서명",
    "support.report.write.anomalyDetection.message": "알람메세지",
    "support.report.write.anomalyDetection.value": "센서값",
    "support.report.write.anomalyDetection.date": "이상탐지 발생일",
    "support.report.write.anomalyDetection.placeholder": "이상탐지 내용을 입력하세요.",
    "support.report.write.judgement": "종합 판단",
    "support.report.write.judgement.placeholder": "종합 판단 내용을 입력하세요.",
    // 장비 부호 관리
    "equipmentCode.fileTableTitle": "함정 장비부호 파일 목록",
    "equipmentCode.tableTitle": "장비부호 목록",
    "equipmentCode.fileUpload": "장비부호 파일 업로드",
    "equipmentCode.serialNumber": "일련번호",
    // 함정 정보 관리
    "shipInfo.notice": "※ 함정 목록 표에 어떤 정보도 표시되지 않으면 ‘관리자 설정/장비 부호관리’ 메뉴에서 ‘장비 부호’파일을 업로드하면 함정 정보가 표시됩니다.",
    "shipInfo.editPopupTitle": "함정 정보 변경",
    "shipInfo.deleteConfirmNotice": "함정 정보를 삭제하시면 해당 함정과 연계된 모든<br/>데이터가 DB에서 삭제됩니다.",
    // 장비 정보 관리
    "equipmentInfo.file.table.title": "함정 장비 정보 파일 (IO List)",
    "equipmentInfo.table.title": "장비 정보 조회",
    "equipmentInfo.create.dialog.title": "장비 I/O 리스트 등록",
    "equipmentInfo.table.signal": "Signal",
    "equipmentInfo.table.type": "Type",
    "equipmentInfo.table.ll": "LL",
    "equipmentInfo.table.l": "L",
    "equipmentInfo.table.h": "H",
    "equipmentInfo.table.hh": "HH",
    // 데이터 분석 > 데이터 관리 > 데이터 파일 조회
    "analysis.data.file.msg": "※ 이 파일은 함정으로부터 수신한 ECS 원본 데이터들을 사용자의 데이터 조회 및 공유 편의성을 위해 1일 단위로 파일들을 묶어서 저장한 파일임",
    "analysis.data.file.createTime": "파일 생성 시간",
    "analysis.data.file.size": "용량",
    // 데이터 분석 > 데이터 관리 > 센서 데이터 조회
    "analysis.data.sensor.time": "시각",
    "analysis.data.sensor.data": "센서 데이터",
    // 관리자 설정 > 계정 관리
    "user.btn.newItem": "New",
    "user.btn.resetPassword": "Reset password",
    "user.notice.passwordConfirm": "관리자 패스워드를 입력하세요.",
    "user.notice.passwordReset": "패스워드가 초기화되었습니다.",
    "user.btn.duplicateCheck": "Duplicate Check",
    // 관리자 설정 > 사용자 그룹 관리
    "user.auth.group": "User group",
    "user.auth.menuList": "Menu List",
    // 관리자 설정 > 선박 정보 관리
    "ship.name": "Vessel name",
    "ship.imo": "IMO No.",
    "ship.type": "Type",
    "ship.size": "Size",
    "ship.built": "Year built",
    "ship.deliveryDate": "Delivery date",
    "ship.eedi": "EEDI",
    "ship.imo.number": "IMO number",
    "ship.mmsi.number": "MMSI number",
    "ship.country": "Country",
    "ship.country.placeholder": "Select a country",
    "ship.vesselType": "Vessel type",
    "ship.vesselType.placeholder": "Select a type",
    "ship.vesselSize": "Vessel size",
    "ship.vesselSize.placeholder": "Select a size",
    "ship.length": "Length",
    "ship.width": "Width",
    "ship.gt": "GT",
    "ship.nt": "NT",
    "ship.dwt": "DWT",
    "ship.year": "Year of Built",
    "ship.year.placeholder": "Select a year",
    "ship.iceClass": "Ice class",
    "ship.me": "M/E",
    "ship.equipment.name": "Model name",
    "ship.equipment.model": "Engine model",
    "ship.equipment.ofdf": "OF or DF",
    "ship.equipment.mcr": "MCR",
    "ship.equipment.cylinder": "No. of cylinder",
    "ship.equipment.fuelType1": "Fuel type #1",
    "ship.equipment.fuelType2": "Fuel type #2",
    "ship.equipment.shaftGenerator": "Shaft Generator",
    "ship.ge": "G/E",
    "ship.equipment.type": "Type",
    "ship.equipment.fuel": "Fuel",
    "ship.equipment.emergencyGe": "Emergency GE",
    "ship.equipment.df": "No. of DF",
    "ship.equipment.dfFuelType": "DF Fuel type",
    "ship.equipment.of": "No. of OF",
    "ship.equipment.ofFuelType": "OF Fuel type",
    "ship.aux": "Aux. Boiler",
    "ship.composite": "Composite Boiler",
    "ship.ese": "Energy Saving Equipment",
    "ship.equipment.fuelType": "Fuel type",
    "ship.tank": "No. of tank",
    "ship.bunkering": "Bunkering",
    "ship.method": "Method used to measure fuel oil consumption",
    "ship.fuel.type": "Fuel type",
    "ship.fuel.lhv": "LHV",
    "ship.fuel.density": "Density",
    "ship.fuel.bunkeringVolume": "Volume",
    "ship.fuel.bunkeringDate": "Date",
    "ship.fuel.bunkeringPort": "Port",
    // 데이터 분석 > 유사함정 교차 분석
    "similarity-crossing.title1": "1차 함정 분석",
    "similarity-crossing.title2": "2차 함정 분석",
    "similarity-crossing.save.db": "저장하기(DB)",
    "similarity-crossing.load.db": "불러오기(DB)",
    "similarity-crossing.load.db.notice": "※ 저장된 데이터를 선택하고 ‘불러오기’ 버튼을 누르세요.",
    "similarity-crossing.saved-name.placeholder": "저장명을 입력하세요.",
    // safety > alarm
    "safety.alarm.channelId": "Data Channel ID",
    "safety.alarm.system": "System",
    "safety.alarm.data": "Data",
    "safety.alarm.currentState": "Current State",
    "safety.alarm.count": "Count"
  }
};
const alertLocale = {
  en: {
    "alert.401.Unauthorized": "Unauthorized Access",
    "alert.selectShipType": "Please select a Ship Type",
    "alert.selectShip": "Please select a Ship",
    "alert.selectEquipment": "Please select a Equipment",
    "alert.selectSubEquipment": "Please select a sub-equipment",
    "alert.selectSensor": "Please select a sensor",
    "alert.selectDate": "Please select a date",
    "alert.checkDate": "Please check the search start and end dates.",
    "alert.delete": "Are you sure you want to delete?",
    "alert.register-file": "Please select a file.",
    "alert.enter-password": "Please enter a password.",
    "alert.selectUploadFile": "Please select a file.",
    "alert.selectDelete": "Please select a item.",
    "alert.save": "The content has been saved.",
    "alert.default.save": "Saved.",
    "alert.enterDescription": "Please enter a description.",
    "alert.passwordRules": "비밀번호 생성조건에 부합하지 않습니다. 비밀번호 조건에 맞게 다시 입력해주세요.",
    "alert.passwordCheck": "새로운 입력한 비빌번호와 일치하지 않습니다. 다시 입력해주세요.",
    "alert.wrongPassword": "기존 비밀번호와 아이디가 일치하지 않습니다.",
    "alert.204.successChange": "Successfully changed",
    "alert.selectCondition": "Select the conditions to load",
    "alert.checkChartBeforeDownload": "After creating the chart, you can download the chart data.",
    "alert.download.file.error": "Please try again",
    "alert.passwordCheck.error": "The password is incorrect",
    "alert.enter.value": "Please enter a value",
    //port & canal Info
    "alert.port-canal.selectDelete": "Please select the item you want to delete.",
    "alert.port-canal.delete": "Are you sure you want to delete this item?"
  },
  ko: {
    "alert.401.Unauthorized": "접근 권한이 없습니다.",
    "alert.selectShipType": "함형을 선택하세요.",
    "alert.selectShip": "함정을 선택하세요.",
    "alert.selectEquipment": "장비를 선택하세요.",
    "alert.selectSubEquipment": "하위장비를 선택하세요.",
    "alert.selectSensor": "센서를 선택하세요.",
    "alert.selectDate": "날짜를 선택하세요.",
    "alert.checkDate": "검색 시작일과 종료일을 확인해주세요.",
    "alert.delete": "삭제하시겠습니까?",
    "alert.register-file": "파일을 등록하세요.",
    "alert.enter-password": "비밀번호를 입력하세요.",
    "alert.selectUploadFile": "업로드할 파일을 선택해주세요.",
    "alert.selectDelete": "삭제할 항목을 선택해주세요.",
    "alert.save": "내용이 저장되었습니다.",
    "alert.default.save": "저장되었습니다.",
    "alert.enterDescription": "설명을 입력하세요.",
    "alert.passwordRules": "비밀번호 생성조건에 부합하지 않습니다. 비밀번호 조건에 맞게 다시 입력해주세요.",
    "alert.passwordCheck": "새로운 입력한 비빌번호와 일치하지 않습니다. 다시 입력해주세요.",
    "alert.wrongPassword": "기존 비밀번호와 아이디가 일치하지 않습니다.",
    "alert.204.successChange": "변경 되었습니다.",
    "alert.selectCondition": "조건을 선택하세요.",
    "alert.checkChartBeforeDownload": "차트 생성 후 데이터를 다운로드 할 수 있습니다.",
    "alert.download.file.error": "다시 시도해주세요.",
    "alert.passwordCheck.error": "비밀번호가 맞지 않습니다.",
    "alert.enter.value": "값을 입력하세요.",
    //port & canal Info
    "alert.port-canal.selectDelete": "Please select the item you want to delete.",
    "alert.port-canal.delete": "Are you sure you want to delete this item?"
  }
};
const rulesLocale = {
  en: {
    "rules.required": "Required",
    "rules.atleast7": "must be at least 7 characters long",
    "rules.atLeast8": "must be at least 8 characters long",
    "rules.passwordRule": "The password must be at least 8 characters including numbers, letters, and special characters."
  },
  ko: {
    "rules.required": "필수입력 값 입니다.",
    "rules.atleast7": "must be at least 7 characters long",
    "rules.passwordRule": "비밀번호는 숫자, 영문, 특수기호를 조합해서 8글자 이상으로 입력해주세요."
  }
};
/*!
  * shared v9.14.4
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
const inBrowser = typeof window !== "undefined";
const makeSymbol = (name, shareable = false) => !shareable ? Symbol(name) : Symbol.for(name);
const generateFormatCacheKey = (locale, key, source) => friendlyJSONstringify({ l: locale, k: key, s: source });
const friendlyJSONstringify = (json) => JSON.stringify(json).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029").replace(/\u0027/g, "\\u0027");
const isNumber = (val) => typeof val === "number" && isFinite(val);
const isDate = (val) => toTypeString(val) === "[object Date]";
const isRegExp = (val) => toTypeString(val) === "[object RegExp]";
const isEmptyObject = (val) => isPlainObject(val) && Object.keys(val).length === 0;
const assign$1 = Object.assign;
const _create = Object.create;
const create = (obj = null) => _create(obj);
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : create());
};
function escapeHtml(rawText) {
  return rawText.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&apos;");
}
const hasOwnProperty = Object.prototype.hasOwnProperty;
function hasOwn(obj, key) {
  return hasOwnProperty.call(obj, key);
}
const isArray = Array.isArray;
const isFunction = (val) => typeof val === "function";
const isString$1 = (val) => typeof val === "string";
const isBoolean = (val) => typeof val === "boolean";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const isPlainObject = (val) => {
  if (!isObject$1(val))
    return false;
  const proto = Object.getPrototypeOf(val);
  return proto === null || proto.constructor === Object;
};
const toDisplayString = (val) => {
  return val == null ? "" : isArray(val) || isPlainObject(val) && val.toString === objectToString ? JSON.stringify(val, null, 2) : String(val);
};
function join$1(items, separator = "") {
  return items.reduce((str, item, index) => index === 0 ? str + item : str + separator + item, "");
}
function incrementer(code2) {
  let current = code2;
  return () => ++current;
}
function warn(msg, err) {
  if (typeof console !== "undefined") {
    console.warn(`[intlify] ` + msg);
    if (err) {
      console.warn(err.stack);
    }
  }
}
const isNotObjectOrIsArray = (val) => !isObject$1(val) || isArray(val);
function deepCopy(src, des) {
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    throw new Error("Invalid value");
  }
  const stack = [{ src, des }];
  while (stack.length) {
    const { src: src2, des: des2 } = stack.pop();
    Object.keys(src2).forEach((key) => {
      if (key === "__proto__") {
        return;
      }
      if (isObject$1(src2[key]) && !isObject$1(des2[key])) {
        des2[key] = Array.isArray(src2[key]) ? [] : create();
      }
      if (isNotObjectOrIsArray(des2[key]) || isNotObjectOrIsArray(src2[key])) {
        des2[key] = src2[key];
      } else {
        stack.push({ src: src2[key], des: des2[key] });
      }
    });
  }
}
/*!
  * message-compiler v9.14.4
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
function createPosition(line, column, offset) {
  return { line, column, offset };
}
function createLocation(start, end, source) {
  const loc = { start, end };
  return loc;
}
const RE_ARGS = /\{([0-9a-zA-Z]+)\}/g;
function format$1(message, ...args) {
  if (args.length === 1 && isObject(args[0])) {
    args = args[0];
  }
  if (!args || !args.hasOwnProperty) {
    args = {};
  }
  return message.replace(RE_ARGS, (match, identifier) => {
    return args.hasOwnProperty(identifier) ? args[identifier] : "";
  });
}
const assign = Object.assign;
const isString = (val) => typeof val === "string";
const isObject = (val) => val !== null && typeof val === "object";
function join(items, separator = "") {
  return items.reduce((str, item, index) => index === 0 ? str + item : str + separator + item, "");
}
const CompileWarnCodes = {
  USE_MODULO_SYNTAX: 1,
  __EXTEND_POINT__: 2
};
const warnMessages = {
  [CompileWarnCodes.USE_MODULO_SYNTAX]: `Use modulo before '{{0}}'.`
};
function createCompileWarn(code2, loc, ...args) {
  const msg = format$1(warnMessages[code2], ...args || []);
  const message = { message: String(msg), code: code2 };
  if (loc) {
    message.location = loc;
  }
  return message;
}
const CompileErrorCodes = {
  // tokenizer error codes
  EXPECTED_TOKEN: 1,
  INVALID_TOKEN_IN_PLACEHOLDER: 2,
  UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER: 3,
  UNKNOWN_ESCAPE_SEQUENCE: 4,
  INVALID_UNICODE_ESCAPE_SEQUENCE: 5,
  UNBALANCED_CLOSING_BRACE: 6,
  UNTERMINATED_CLOSING_BRACE: 7,
  EMPTY_PLACEHOLDER: 8,
  NOT_ALLOW_NEST_PLACEHOLDER: 9,
  INVALID_LINKED_FORMAT: 10,
  // parser error codes
  MUST_HAVE_MESSAGES_IN_PLURAL: 11,
  UNEXPECTED_EMPTY_LINKED_MODIFIER: 12,
  UNEXPECTED_EMPTY_LINKED_KEY: 13,
  UNEXPECTED_LEXICAL_ANALYSIS: 14,
  // generator error codes
  UNHANDLED_CODEGEN_NODE_TYPE: 15,
  // minifier error codes
  UNHANDLED_MINIFIER_NODE_TYPE: 16,
  // Special value for higher-order compilers to pick up the last code
  // to avoid collision of error codes. This should always be kept as the last
  // item.
  __EXTEND_POINT__: 17
};
const errorMessages = {
  // tokenizer error messages
  [CompileErrorCodes.EXPECTED_TOKEN]: `Expected token: '{0}'`,
  [CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER]: `Invalid token in placeholder: '{0}'`,
  [CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER]: `Unterminated single quote in placeholder`,
  [CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE]: `Unknown escape sequence: \\{0}`,
  [CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE]: `Invalid unicode escape sequence: {0}`,
  [CompileErrorCodes.UNBALANCED_CLOSING_BRACE]: `Unbalanced closing brace`,
  [CompileErrorCodes.UNTERMINATED_CLOSING_BRACE]: `Unterminated closing brace`,
  [CompileErrorCodes.EMPTY_PLACEHOLDER]: `Empty placeholder`,
  [CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER]: `Not allowed nest placeholder`,
  [CompileErrorCodes.INVALID_LINKED_FORMAT]: `Invalid linked format`,
  // parser error messages
  [CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL]: `Plural must have messages`,
  [CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER]: `Unexpected empty linked modifier`,
  [CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY]: `Unexpected empty linked key`,
  [CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS]: `Unexpected lexical analysis in token: '{0}'`,
  // generator error messages
  [CompileErrorCodes.UNHANDLED_CODEGEN_NODE_TYPE]: `unhandled codegen node type: '{0}'`,
  // minimizer error messages
  [CompileErrorCodes.UNHANDLED_MINIFIER_NODE_TYPE]: `unhandled mimifier node type: '{0}'`
};
function createCompileError(code2, loc, options = {}) {
  const { domain, messages, args } = options;
  const msg = format$1((messages || errorMessages)[code2] || "", ...args || []);
  const error = new SyntaxError(String(msg));
  error.code = code2;
  if (loc) {
    error.location = loc;
  }
  error.domain = domain;
  return error;
}
function defaultOnError(error) {
  throw error;
}
const CHAR_SP = " ";
const CHAR_CR = "\r";
const CHAR_LF = "\n";
const CHAR_LS = String.fromCharCode(8232);
const CHAR_PS = String.fromCharCode(8233);
function createScanner(str) {
  const _buf = str;
  let _index = 0;
  let _line = 1;
  let _column = 1;
  let _peekOffset = 0;
  const isCRLF = (index2) => _buf[index2] === CHAR_CR && _buf[index2 + 1] === CHAR_LF;
  const isLF = (index2) => _buf[index2] === CHAR_LF;
  const isPS = (index2) => _buf[index2] === CHAR_PS;
  const isLS = (index2) => _buf[index2] === CHAR_LS;
  const isLineEnd = (index2) => isCRLF(index2) || isLF(index2) || isPS(index2) || isLS(index2);
  const index = () => _index;
  const line = () => _line;
  const column = () => _column;
  const peekOffset = () => _peekOffset;
  const charAt = (offset) => isCRLF(offset) || isPS(offset) || isLS(offset) ? CHAR_LF : _buf[offset];
  const currentChar = () => charAt(_index);
  const currentPeek = () => charAt(_index + _peekOffset);
  function next() {
    _peekOffset = 0;
    if (isLineEnd(_index)) {
      _line++;
      _column = 0;
    }
    if (isCRLF(_index)) {
      _index++;
    }
    _index++;
    _column++;
    return _buf[_index];
  }
  function peek() {
    if (isCRLF(_index + _peekOffset)) {
      _peekOffset++;
    }
    _peekOffset++;
    return _buf[_index + _peekOffset];
  }
  function reset() {
    _index = 0;
    _line = 1;
    _column = 1;
    _peekOffset = 0;
  }
  function resetPeek(offset = 0) {
    _peekOffset = offset;
  }
  function skipToPeek() {
    const target = _index + _peekOffset;
    while (target !== _index) {
      next();
    }
    _peekOffset = 0;
  }
  return {
    index,
    line,
    column,
    peekOffset,
    charAt,
    currentChar,
    currentPeek,
    next,
    peek,
    reset,
    resetPeek,
    skipToPeek
  };
}
const EOF = void 0;
const DOT = ".";
const LITERAL_DELIMITER = "'";
const ERROR_DOMAIN$3 = "tokenizer";
function createTokenizer(source, options = {}) {
  const location = options.location !== false;
  const _scnr = createScanner(source);
  const currentOffset = () => _scnr.index();
  const currentPosition = () => createPosition(_scnr.line(), _scnr.column(), _scnr.index());
  const _initLoc = currentPosition();
  const _initOffset = currentOffset();
  const _context = {
    currentType: 14,
    offset: _initOffset,
    startLoc: _initLoc,
    endLoc: _initLoc,
    lastType: 14,
    lastOffset: _initOffset,
    lastStartLoc: _initLoc,
    lastEndLoc: _initLoc,
    braceNest: 0,
    inLinked: false,
    text: ""
  };
  const context = () => _context;
  const { onError } = options;
  function emitError(code2, pos, offset, ...args) {
    const ctx = context();
    pos.column += offset;
    pos.offset += offset;
    if (onError) {
      const loc = location ? createLocation(ctx.startLoc, pos) : null;
      const err = createCompileError(code2, loc, {
        domain: ERROR_DOMAIN$3,
        args
      });
      onError(err);
    }
  }
  function getToken(context2, type, value) {
    context2.endLoc = currentPosition();
    context2.currentType = type;
    const token = { type };
    if (location) {
      token.loc = createLocation(context2.startLoc, context2.endLoc);
    }
    if (value != null) {
      token.value = value;
    }
    return token;
  }
  const getEndToken = (context2) => getToken(
    context2,
    14
    /* TokenTypes.EOF */
  );
  function eat(scnr, ch) {
    if (scnr.currentChar() === ch) {
      scnr.next();
      return ch;
    } else {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
      return "";
    }
  }
  function peekSpaces(scnr) {
    let buf = "";
    while (scnr.currentPeek() === CHAR_SP || scnr.currentPeek() === CHAR_LF) {
      buf += scnr.currentPeek();
      scnr.peek();
    }
    return buf;
  }
  function skipSpaces(scnr) {
    const buf = peekSpaces(scnr);
    scnr.skipToPeek();
    return buf;
  }
  function isIdentifierStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc === 95;
  }
  function isNumberStart(ch) {
    if (ch === EOF) {
      return false;
    }
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function isNamedIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isListIdentifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ch = scnr.currentPeek() === "-" ? scnr.peek() : scnr.currentPeek();
    const ret = isNumberStart(ch);
    scnr.resetPeek();
    return ret;
  }
  function isLiteralStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 2) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === LITERAL_DELIMITER;
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDotStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 8) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ".";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedModifierStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 9) {
      return false;
    }
    peekSpaces(scnr);
    const ret = isIdentifierStart(scnr.currentPeek());
    scnr.resetPeek();
    return ret;
  }
  function isLinkedDelimiterStart(scnr, context2) {
    const { currentType } = context2;
    if (!(currentType === 8 || currentType === 12)) {
      return false;
    }
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === ":";
    scnr.resetPeek();
    return ret;
  }
  function isLinkedReferStart(scnr, context2) {
    const { currentType } = context2;
    if (currentType !== 10) {
      return false;
    }
    const fn = () => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return isIdentifierStart(scnr.peek());
      } else if (ch === "@" || ch === "%" || ch === "|" || ch === ":" || ch === "." || ch === CHAR_SP || !ch) {
        return false;
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn();
      } else {
        return isTextStart(scnr, false);
      }
    };
    const ret = fn();
    scnr.resetPeek();
    return ret;
  }
  function isPluralStart(scnr) {
    peekSpaces(scnr);
    const ret = scnr.currentPeek() === "|";
    scnr.resetPeek();
    return ret;
  }
  function detectModuloStart(scnr) {
    const spaces = peekSpaces(scnr);
    const ret = scnr.currentPeek() === "%" && scnr.peek() === "{";
    scnr.resetPeek();
    return {
      isModulo: ret,
      hasSpace: spaces.length > 0
    };
  }
  function isTextStart(scnr, reset = true) {
    const fn = (hasSpace = false, prev = "", detectModulo = false) => {
      const ch = scnr.currentPeek();
      if (ch === "{") {
        return prev === "%" ? false : hasSpace;
      } else if (ch === "@" || !ch) {
        return prev === "%" ? true : hasSpace;
      } else if (ch === "%") {
        scnr.peek();
        return fn(hasSpace, "%", true);
      } else if (ch === "|") {
        return prev === "%" || detectModulo ? true : !(prev === CHAR_SP || prev === CHAR_LF);
      } else if (ch === CHAR_SP) {
        scnr.peek();
        return fn(true, CHAR_SP, detectModulo);
      } else if (ch === CHAR_LF) {
        scnr.peek();
        return fn(true, CHAR_LF, detectModulo);
      } else {
        return true;
      }
    };
    const ret = fn();
    reset && scnr.resetPeek();
    return ret;
  }
  function takeChar(scnr, fn) {
    const ch = scnr.currentChar();
    if (ch === EOF) {
      return EOF;
    }
    if (fn(ch)) {
      scnr.next();
      return ch;
    }
    return null;
  }
  function isIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36;
  }
  function takeIdentifierChar(scnr) {
    return takeChar(scnr, isIdentifier);
  }
  function isNamedIdentifier(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 97 && cc <= 122 || // a-z
    cc >= 65 && cc <= 90 || // A-Z
    cc >= 48 && cc <= 57 || // 0-9
    cc === 95 || // _
    cc === 36 || // $
    cc === 45;
  }
  function takeNamedIdentifierChar(scnr) {
    return takeChar(scnr, isNamedIdentifier);
  }
  function isDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57;
  }
  function takeDigit(scnr) {
    return takeChar(scnr, isDigit);
  }
  function isHexDigit(ch) {
    const cc = ch.charCodeAt(0);
    return cc >= 48 && cc <= 57 || // 0-9
    cc >= 65 && cc <= 70 || // A-F
    cc >= 97 && cc <= 102;
  }
  function takeHexDigit(scnr) {
    return takeChar(scnr, isHexDigit);
  }
  function getDigits(scnr) {
    let ch = "";
    let num = "";
    while (ch = takeDigit(scnr)) {
      num += ch;
    }
    return num;
  }
  function readModulo(scnr) {
    skipSpaces(scnr);
    const ch = scnr.currentChar();
    if (ch !== "%") {
      emitError(CompileErrorCodes.EXPECTED_TOKEN, currentPosition(), 0, ch);
    }
    scnr.next();
    return "%";
  }
  function readText(scnr) {
    let buf = "";
    while (true) {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "}" || ch === "@" || ch === "|" || !ch) {
        break;
      } else if (ch === "%") {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else {
          break;
        }
      } else if (ch === CHAR_SP || ch === CHAR_LF) {
        if (isTextStart(scnr)) {
          buf += ch;
          scnr.next();
        } else if (isPluralStart(scnr)) {
          break;
        } else {
          buf += ch;
          scnr.next();
        }
      } else {
        buf += ch;
        scnr.next();
      }
    }
    return buf;
  }
  function readNamedIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let name = "";
    while (ch = takeNamedIdentifierChar(scnr)) {
      name += ch;
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return name;
  }
  function readListIdentifier(scnr) {
    skipSpaces(scnr);
    let value = "";
    if (scnr.currentChar() === "-") {
      scnr.next();
      value += `-${getDigits(scnr)}`;
    } else {
      value += getDigits(scnr);
    }
    if (scnr.currentChar() === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
    }
    return value;
  }
  function isLiteral2(ch) {
    return ch !== LITERAL_DELIMITER && ch !== CHAR_LF;
  }
  function readLiteral(scnr) {
    skipSpaces(scnr);
    eat(scnr, `'`);
    let ch = "";
    let literal = "";
    while (ch = takeChar(scnr, isLiteral2)) {
      if (ch === "\\") {
        literal += readEscapeSequence(scnr);
      } else {
        literal += ch;
      }
    }
    const current = scnr.currentChar();
    if (current === CHAR_LF || current === EOF) {
      emitError(CompileErrorCodes.UNTERMINATED_SINGLE_QUOTE_IN_PLACEHOLDER, currentPosition(), 0);
      if (current === CHAR_LF) {
        scnr.next();
        eat(scnr, `'`);
      }
      return literal;
    }
    eat(scnr, `'`);
    return literal;
  }
  function readEscapeSequence(scnr) {
    const ch = scnr.currentChar();
    switch (ch) {
      case "\\":
      case `'`:
        scnr.next();
        return `\\${ch}`;
      case "u":
        return readUnicodeEscapeSequence(scnr, ch, 4);
      case "U":
        return readUnicodeEscapeSequence(scnr, ch, 6);
      default:
        emitError(CompileErrorCodes.UNKNOWN_ESCAPE_SEQUENCE, currentPosition(), 0, ch);
        return "";
    }
  }
  function readUnicodeEscapeSequence(scnr, unicode, digits) {
    eat(scnr, unicode);
    let sequence = "";
    for (let i = 0; i < digits; i++) {
      const ch = takeHexDigit(scnr);
      if (!ch) {
        emitError(CompileErrorCodes.INVALID_UNICODE_ESCAPE_SEQUENCE, currentPosition(), 0, `\\${unicode}${sequence}${scnr.currentChar()}`);
        break;
      }
      sequence += ch;
    }
    return `\\${unicode}${sequence}`;
  }
  function isInvalidIdentifier(ch) {
    return ch !== "{" && ch !== "}" && ch !== CHAR_SP && ch !== CHAR_LF;
  }
  function readInvalidIdentifier(scnr) {
    skipSpaces(scnr);
    let ch = "";
    let identifiers = "";
    while (ch = takeChar(scnr, isInvalidIdentifier)) {
      identifiers += ch;
    }
    return identifiers;
  }
  function readLinkedModifier(scnr) {
    let ch = "";
    let name = "";
    while (ch = takeIdentifierChar(scnr)) {
      name += ch;
    }
    return name;
  }
  function readLinkedRefer(scnr) {
    const fn = (buf) => {
      const ch = scnr.currentChar();
      if (ch === "{" || ch === "%" || ch === "@" || ch === "|" || ch === "(" || ch === ")" || !ch) {
        return buf;
      } else if (ch === CHAR_SP) {
        return buf;
      } else if (ch === CHAR_LF || ch === DOT) {
        buf += ch;
        scnr.next();
        return fn(buf);
      } else {
        buf += ch;
        scnr.next();
        return fn(buf);
      }
    };
    return fn("");
  }
  function readPlural(scnr) {
    skipSpaces(scnr);
    const plural = eat(
      scnr,
      "|"
      /* TokenChars.Pipe */
    );
    skipSpaces(scnr);
    return plural;
  }
  function readTokenInPlaceholder(scnr, context2) {
    let token = null;
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        if (context2.braceNest >= 1) {
          emitError(CompileErrorCodes.NOT_ALLOW_NEST_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          2,
          "{"
          /* TokenChars.BraceLeft */
        );
        skipSpaces(scnr);
        context2.braceNest++;
        return token;
      case "}":
        if (context2.braceNest > 0 && context2.currentType === 2) {
          emitError(CompileErrorCodes.EMPTY_PLACEHOLDER, currentPosition(), 0);
        }
        scnr.next();
        token = getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
        context2.braceNest--;
        context2.braceNest > 0 && skipSpaces(scnr);
        if (context2.inLinked && context2.braceNest === 0) {
          context2.inLinked = false;
        }
        return token;
      case "@":
        if (context2.braceNest > 0) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
        }
        token = readTokenInLinked(scnr, context2) || getEndToken(context2);
        context2.braceNest = 0;
        return token;
      default: {
        let validNamedIdentifier = true;
        let validListIdentifier = true;
        let validLiteral = true;
        if (isPluralStart(scnr)) {
          if (context2.braceNest > 0) {
            emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          }
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (context2.braceNest > 0 && (context2.currentType === 5 || context2.currentType === 6 || context2.currentType === 7)) {
          emitError(CompileErrorCodes.UNTERMINATED_CLOSING_BRACE, currentPosition(), 0);
          context2.braceNest = 0;
          return readToken(scnr, context2);
        }
        if (validNamedIdentifier = isNamedIdentifierStart(scnr, context2)) {
          token = getToken(context2, 5, readNamedIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validListIdentifier = isListIdentifierStart(scnr, context2)) {
          token = getToken(context2, 6, readListIdentifier(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (validLiteral = isLiteralStart(scnr, context2)) {
          token = getToken(context2, 7, readLiteral(scnr));
          skipSpaces(scnr);
          return token;
        }
        if (!validNamedIdentifier && !validListIdentifier && !validLiteral) {
          token = getToken(context2, 13, readInvalidIdentifier(scnr));
          emitError(CompileErrorCodes.INVALID_TOKEN_IN_PLACEHOLDER, currentPosition(), 0, token.value);
          skipSpaces(scnr);
          return token;
        }
        break;
      }
    }
    return token;
  }
  function readTokenInLinked(scnr, context2) {
    const { currentType } = context2;
    let token = null;
    const ch = scnr.currentChar();
    if ((currentType === 8 || currentType === 9 || currentType === 12 || currentType === 10) && (ch === CHAR_LF || ch === CHAR_SP)) {
      emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
    }
    switch (ch) {
      case "@":
        scnr.next();
        token = getToken(
          context2,
          8,
          "@"
          /* TokenChars.LinkedAlias */
        );
        context2.inLinked = true;
        return token;
      case ".":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          9,
          "."
          /* TokenChars.LinkedDot */
        );
      case ":":
        skipSpaces(scnr);
        scnr.next();
        return getToken(
          context2,
          10,
          ":"
          /* TokenChars.LinkedDelimiter */
        );
      default:
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        if (isLinkedDotStart(scnr, context2) || isLinkedDelimiterStart(scnr, context2)) {
          skipSpaces(scnr);
          return readTokenInLinked(scnr, context2);
        }
        if (isLinkedModifierStart(scnr, context2)) {
          skipSpaces(scnr);
          return getToken(context2, 12, readLinkedModifier(scnr));
        }
        if (isLinkedReferStart(scnr, context2)) {
          skipSpaces(scnr);
          if (ch === "{") {
            return readTokenInPlaceholder(scnr, context2) || token;
          } else {
            return getToken(context2, 11, readLinkedRefer(scnr));
          }
        }
        if (currentType === 8) {
          emitError(CompileErrorCodes.INVALID_LINKED_FORMAT, currentPosition(), 0);
        }
        context2.braceNest = 0;
        context2.inLinked = false;
        return readToken(scnr, context2);
    }
  }
  function readToken(scnr, context2) {
    let token = {
      type: 14
      /* TokenTypes.EOF */
    };
    if (context2.braceNest > 0) {
      return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
    }
    if (context2.inLinked) {
      return readTokenInLinked(scnr, context2) || getEndToken(context2);
    }
    const ch = scnr.currentChar();
    switch (ch) {
      case "{":
        return readTokenInPlaceholder(scnr, context2) || getEndToken(context2);
      case "}":
        emitError(CompileErrorCodes.UNBALANCED_CLOSING_BRACE, currentPosition(), 0);
        scnr.next();
        return getToken(
          context2,
          3,
          "}"
          /* TokenChars.BraceRight */
        );
      case "@":
        return readTokenInLinked(scnr, context2) || getEndToken(context2);
      default: {
        if (isPluralStart(scnr)) {
          token = getToken(context2, 1, readPlural(scnr));
          context2.braceNest = 0;
          context2.inLinked = false;
          return token;
        }
        const { isModulo, hasSpace } = detectModuloStart(scnr);
        if (isModulo) {
          return hasSpace ? getToken(context2, 0, readText(scnr)) : getToken(context2, 4, readModulo(scnr));
        }
        if (isTextStart(scnr)) {
          return getToken(context2, 0, readText(scnr));
        }
        break;
      }
    }
    return token;
  }
  function nextToken() {
    const { currentType, offset, startLoc, endLoc } = _context;
    _context.lastType = currentType;
    _context.lastOffset = offset;
    _context.lastStartLoc = startLoc;
    _context.lastEndLoc = endLoc;
    _context.offset = currentOffset();
    _context.startLoc = currentPosition();
    if (_scnr.currentChar() === EOF) {
      return getToken(
        _context,
        14
        /* TokenTypes.EOF */
      );
    }
    return readToken(_scnr, _context);
  }
  return {
    nextToken,
    currentOffset,
    currentPosition,
    context
  };
}
const ERROR_DOMAIN$2 = "parser";
const KNOWN_ESCAPES = /(?:\\\\|\\'|\\u([0-9a-fA-F]{4})|\\U([0-9a-fA-F]{6}))/g;
function fromEscapeSequence(match, codePoint4, codePoint6) {
  switch (match) {
    case `\\\\`:
      return `\\`;
    case `\\'`:
      return `'`;
    default: {
      const codePoint = parseInt(codePoint4 || codePoint6, 16);
      if (codePoint <= 55295 || codePoint >= 57344) {
        return String.fromCodePoint(codePoint);
      }
      return "�";
    }
  }
}
function createParser(options = {}) {
  const location = options.location !== false;
  const { onError, onWarn } = options;
  function emitError(tokenzer, code2, start, offset, ...args) {
    const end = tokenzer.currentPosition();
    end.offset += offset;
    end.column += offset;
    if (onError) {
      const loc = location ? createLocation(start, end) : null;
      const err = createCompileError(code2, loc, {
        domain: ERROR_DOMAIN$2,
        args
      });
      onError(err);
    }
  }
  function emitWarn(tokenzer, code2, start, offset, ...args) {
    const end = tokenzer.currentPosition();
    end.offset += offset;
    end.column += offset;
    if (onWarn) {
      const loc = location ? createLocation(start, end) : null;
      onWarn(createCompileWarn(code2, loc, args));
    }
  }
  function startNode(type, offset, loc) {
    const node = { type };
    if (location) {
      node.start = offset;
      node.end = offset;
      node.loc = { start: loc, end: loc };
    }
    return node;
  }
  function endNode(node, offset, pos, type) {
    if (location) {
      node.end = offset;
      if (node.loc) {
        node.loc.end = pos;
      }
    }
  }
  function parseText(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(3, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseList(tokenizer, index) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(5, offset, loc);
    node.index = parseInt(index, 10);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseNamed(tokenizer, key, modulo) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(4, offset, loc);
    node.key = key;
    if (modulo === true) {
      node.modulo = true;
    }
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLiteral(tokenizer, value) {
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(9, offset, loc);
    node.value = value.replace(KNOWN_ESCAPES, fromEscapeSequence);
    tokenizer.nextToken();
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinkedModifier(tokenizer) {
    const token = tokenizer.nextToken();
    const context = tokenizer.context();
    const { lastOffset: offset, lastStartLoc: loc } = context;
    const node = startNode(8, offset, loc);
    if (token.type !== 12) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_MODIFIER, context.lastStartLoc, 0);
      node.value = "";
      endNode(node, offset, loc);
      return {
        nextConsumeToken: token,
        node
      };
    }
    if (token.value == null) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    node.value = token.value || "";
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node
    };
  }
  function parseLinkedKey(tokenizer, value) {
    const context = tokenizer.context();
    const node = startNode(7, context.offset, context.startLoc);
    node.value = value;
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseLinked(tokenizer) {
    const context = tokenizer.context();
    const linkedNode = startNode(6, context.offset, context.startLoc);
    let token = tokenizer.nextToken();
    if (token.type === 9) {
      const parsed = parseLinkedModifier(tokenizer);
      linkedNode.modifier = parsed.node;
      token = parsed.nextConsumeToken || tokenizer.nextToken();
    }
    if (token.type !== 10) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
    }
    token = tokenizer.nextToken();
    if (token.type === 2) {
      token = tokenizer.nextToken();
    }
    switch (token.type) {
      case 11:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLinkedKey(tokenizer, token.value || "");
        break;
      case 5:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseNamed(tokenizer, token.value || "");
        break;
      case 6:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseList(tokenizer, token.value || "");
        break;
      case 7:
        if (token.value == null) {
          emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
        }
        linkedNode.key = parseLiteral(tokenizer, token.value || "");
        break;
      default: {
        emitError(tokenizer, CompileErrorCodes.UNEXPECTED_EMPTY_LINKED_KEY, context.lastStartLoc, 0);
        const nextContext = tokenizer.context();
        const emptyLinkedKeyNode = startNode(7, nextContext.offset, nextContext.startLoc);
        emptyLinkedKeyNode.value = "";
        endNode(emptyLinkedKeyNode, nextContext.offset, nextContext.startLoc);
        linkedNode.key = emptyLinkedKeyNode;
        endNode(linkedNode, nextContext.offset, nextContext.startLoc);
        return {
          nextConsumeToken: token,
          node: linkedNode
        };
      }
    }
    endNode(linkedNode, tokenizer.currentOffset(), tokenizer.currentPosition());
    return {
      node: linkedNode
    };
  }
  function parseMessage(tokenizer) {
    const context = tokenizer.context();
    const startOffset = context.currentType === 1 ? tokenizer.currentOffset() : context.offset;
    const startLoc = context.currentType === 1 ? context.endLoc : context.startLoc;
    const node = startNode(2, startOffset, startLoc);
    node.items = [];
    let nextToken = null;
    let modulo = null;
    do {
      const token = nextToken || tokenizer.nextToken();
      nextToken = null;
      switch (token.type) {
        case 0:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseText(tokenizer, token.value || ""));
          break;
        case 6:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseList(tokenizer, token.value || ""));
          break;
        case 4:
          modulo = true;
          break;
        case 5:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseNamed(tokenizer, token.value || "", !!modulo));
          if (modulo) {
            emitWarn(tokenizer, CompileWarnCodes.USE_MODULO_SYNTAX, context.lastStartLoc, 0, getTokenCaption(token));
            modulo = null;
          }
          break;
        case 7:
          if (token.value == null) {
            emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, getTokenCaption(token));
          }
          node.items.push(parseLiteral(tokenizer, token.value || ""));
          break;
        case 8: {
          const parsed = parseLinked(tokenizer);
          node.items.push(parsed.node);
          nextToken = parsed.nextConsumeToken || null;
          break;
        }
      }
    } while (context.currentType !== 14 && context.currentType !== 1);
    const endOffset = context.currentType === 1 ? context.lastOffset : tokenizer.currentOffset();
    const endLoc = context.currentType === 1 ? context.lastEndLoc : tokenizer.currentPosition();
    endNode(node, endOffset, endLoc);
    return node;
  }
  function parsePlural(tokenizer, offset, loc, msgNode) {
    const context = tokenizer.context();
    let hasEmptyMessage = msgNode.items.length === 0;
    const node = startNode(1, offset, loc);
    node.cases = [];
    node.cases.push(msgNode);
    do {
      const msg = parseMessage(tokenizer);
      if (!hasEmptyMessage) {
        hasEmptyMessage = msg.items.length === 0;
      }
      node.cases.push(msg);
    } while (context.currentType !== 14);
    if (hasEmptyMessage) {
      emitError(tokenizer, CompileErrorCodes.MUST_HAVE_MESSAGES_IN_PLURAL, loc, 0);
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  function parseResource(tokenizer) {
    const context = tokenizer.context();
    const { offset, startLoc } = context;
    const msgNode = parseMessage(tokenizer);
    if (context.currentType === 14) {
      return msgNode;
    } else {
      return parsePlural(tokenizer, offset, startLoc, msgNode);
    }
  }
  function parse2(source) {
    const tokenizer = createTokenizer(source, assign({}, options));
    const context = tokenizer.context();
    const node = startNode(0, context.offset, context.startLoc);
    if (location && node.loc) {
      node.loc.source = source;
    }
    node.body = parseResource(tokenizer);
    if (options.onCacheKey) {
      node.cacheKey = options.onCacheKey(source);
    }
    if (context.currentType !== 14) {
      emitError(tokenizer, CompileErrorCodes.UNEXPECTED_LEXICAL_ANALYSIS, context.lastStartLoc, 0, source[context.offset] || "");
    }
    endNode(node, tokenizer.currentOffset(), tokenizer.currentPosition());
    return node;
  }
  return { parse: parse2 };
}
function getTokenCaption(token) {
  if (token.type === 14) {
    return "EOF";
  }
  const name = (token.value || "").replace(/\r?\n/gu, "\\n");
  return name.length > 10 ? name.slice(0, 9) + "…" : name;
}
function createTransformer(ast, options = {}) {
  const _context = {
    ast,
    helpers: /* @__PURE__ */ new Set()
  };
  const context = () => _context;
  const helper = (name) => {
    _context.helpers.add(name);
    return name;
  };
  return { context, helper };
}
function traverseNodes(nodes, transformer) {
  for (let i = 0; i < nodes.length; i++) {
    traverseNode(nodes[i], transformer);
  }
}
function traverseNode(node, transformer) {
  switch (node.type) {
    case 1:
      traverseNodes(node.cases, transformer);
      transformer.helper(
        "plural"
        /* HelperNameMap.PLURAL */
      );
      break;
    case 2:
      traverseNodes(node.items, transformer);
      break;
    case 6: {
      const linked = node;
      traverseNode(linked.key, transformer);
      transformer.helper(
        "linked"
        /* HelperNameMap.LINKED */
      );
      transformer.helper(
        "type"
        /* HelperNameMap.TYPE */
      );
      break;
    }
    case 5:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "list"
        /* HelperNameMap.LIST */
      );
      break;
    case 4:
      transformer.helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      );
      transformer.helper(
        "named"
        /* HelperNameMap.NAMED */
      );
      break;
  }
}
function transform(ast, options = {}) {
  const transformer = createTransformer(ast);
  transformer.helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  );
  ast.body && traverseNode(ast.body, transformer);
  const context = transformer.context();
  ast.helpers = Array.from(context.helpers);
}
function optimize(ast) {
  const body = ast.body;
  if (body.type === 2) {
    optimizeMessageNode(body);
  } else {
    body.cases.forEach((c) => optimizeMessageNode(c));
  }
  return ast;
}
function optimizeMessageNode(message) {
  if (message.items.length === 1) {
    const item = message.items[0];
    if (item.type === 3 || item.type === 9) {
      message.static = item.value;
      delete item.value;
    }
  } else {
    const values = [];
    for (let i = 0; i < message.items.length; i++) {
      const item = message.items[i];
      if (!(item.type === 3 || item.type === 9)) {
        break;
      }
      if (item.value == null) {
        break;
      }
      values.push(item.value);
    }
    if (values.length === message.items.length) {
      message.static = join(values);
      for (let i = 0; i < message.items.length; i++) {
        const item = message.items[i];
        if (item.type === 3 || item.type === 9) {
          delete item.value;
        }
      }
    }
  }
}
const ERROR_DOMAIN$1 = "minifier";
function minify(node) {
  node.t = node.type;
  switch (node.type) {
    case 0: {
      const resource = node;
      minify(resource.body);
      resource.b = resource.body;
      delete resource.body;
      break;
    }
    case 1: {
      const plural = node;
      const cases = plural.cases;
      for (let i = 0; i < cases.length; i++) {
        minify(cases[i]);
      }
      plural.c = cases;
      delete plural.cases;
      break;
    }
    case 2: {
      const message = node;
      const items = message.items;
      for (let i = 0; i < items.length; i++) {
        minify(items[i]);
      }
      message.i = items;
      delete message.items;
      if (message.static) {
        message.s = message.static;
        delete message.static;
      }
      break;
    }
    case 3:
    case 9:
    case 8:
    case 7: {
      const valueNode = node;
      if (valueNode.value) {
        valueNode.v = valueNode.value;
        delete valueNode.value;
      }
      break;
    }
    case 6: {
      const linked = node;
      minify(linked.key);
      linked.k = linked.key;
      delete linked.key;
      if (linked.modifier) {
        minify(linked.modifier);
        linked.m = linked.modifier;
        delete linked.modifier;
      }
      break;
    }
    case 5: {
      const list = node;
      list.i = list.index;
      delete list.index;
      break;
    }
    case 4: {
      const named = node;
      named.k = named.key;
      delete named.key;
      break;
    }
    default: {
      throw createCompileError(CompileErrorCodes.UNHANDLED_MINIFIER_NODE_TYPE, null, {
        domain: ERROR_DOMAIN$1,
        args: [node.type]
      });
    }
  }
  delete node.type;
}
const ERROR_DOMAIN = "parser";
function createCodeGenerator(ast, options) {
  const { filename, breakLineCode, needIndent: _needIndent } = options;
  const location = options.location !== false;
  const _context = {
    filename,
    code: "",
    column: 1,
    line: 1,
    offset: 0,
    map: void 0,
    breakLineCode,
    needIndent: _needIndent,
    indentLevel: 0
  };
  if (location && ast.loc) {
    _context.source = ast.loc.source;
  }
  const context = () => _context;
  function push(code2, node) {
    _context.code += code2;
  }
  function _newline(n, withBreakLine = true) {
    const _breakLineCode = withBreakLine ? breakLineCode : "";
    push(_needIndent ? _breakLineCode + `  `.repeat(n) : _breakLineCode);
  }
  function indent(withNewLine = true) {
    const level = ++_context.indentLevel;
    withNewLine && _newline(level);
  }
  function deindent(withNewLine = true) {
    const level = --_context.indentLevel;
    withNewLine && _newline(level);
  }
  function newline() {
    _newline(_context.indentLevel);
  }
  const helper = (key) => `_${key}`;
  const needIndent = () => _context.needIndent;
  return {
    context,
    push,
    indent,
    deindent,
    newline,
    helper,
    needIndent
  };
}
function generateLinkedNode(generator, node) {
  const { helper } = generator;
  generator.push(`${helper(
    "linked"
    /* HelperNameMap.LINKED */
  )}(`);
  generateNode(generator, node.key);
  if (node.modifier) {
    generator.push(`, `);
    generateNode(generator, node.modifier);
    generator.push(`, _type`);
  } else {
    generator.push(`, undefined, _type`);
  }
  generator.push(`)`);
}
function generateMessageNode(generator, node) {
  const { helper, needIndent } = generator;
  generator.push(`${helper(
    "normalize"
    /* HelperNameMap.NORMALIZE */
  )}([`);
  generator.indent(needIndent());
  const length = node.items.length;
  for (let i = 0; i < length; i++) {
    generateNode(generator, node.items[i]);
    if (i === length - 1) {
      break;
    }
    generator.push(", ");
  }
  generator.deindent(needIndent());
  generator.push("])");
}
function generatePluralNode(generator, node) {
  const { helper, needIndent } = generator;
  if (node.cases.length > 1) {
    generator.push(`${helper(
      "plural"
      /* HelperNameMap.PLURAL */
    )}([`);
    generator.indent(needIndent());
    const length = node.cases.length;
    for (let i = 0; i < length; i++) {
      generateNode(generator, node.cases[i]);
      if (i === length - 1) {
        break;
      }
      generator.push(", ");
    }
    generator.deindent(needIndent());
    generator.push(`])`);
  }
}
function generateResource(generator, node) {
  if (node.body) {
    generateNode(generator, node.body);
  } else {
    generator.push("null");
  }
}
function generateNode(generator, node) {
  const { helper } = generator;
  switch (node.type) {
    case 0:
      generateResource(generator, node);
      break;
    case 1:
      generatePluralNode(generator, node);
      break;
    case 2:
      generateMessageNode(generator, node);
      break;
    case 6:
      generateLinkedNode(generator, node);
      break;
    case 8:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 7:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 5:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "list"
        /* HelperNameMap.LIST */
      )}(${node.index}))`, node);
      break;
    case 4:
      generator.push(`${helper(
        "interpolate"
        /* HelperNameMap.INTERPOLATE */
      )}(${helper(
        "named"
        /* HelperNameMap.NAMED */
      )}(${JSON.stringify(node.key)}))`, node);
      break;
    case 9:
      generator.push(JSON.stringify(node.value), node);
      break;
    case 3:
      generator.push(JSON.stringify(node.value), node);
      break;
    default: {
      throw createCompileError(CompileErrorCodes.UNHANDLED_CODEGEN_NODE_TYPE, null, {
        domain: ERROR_DOMAIN,
        args: [node.type]
      });
    }
  }
}
const generate = (ast, options = {}) => {
  const mode = isString(options.mode) ? options.mode : "normal";
  const filename = isString(options.filename) ? options.filename : "message.intl";
  !!options.sourceMap;
  const breakLineCode = options.breakLineCode != null ? options.breakLineCode : mode === "arrow" ? ";" : "\n";
  const needIndent = options.needIndent ? options.needIndent : mode !== "arrow";
  const helpers = ast.helpers || [];
  const generator = createCodeGenerator(ast, {
    filename,
    breakLineCode,
    needIndent
  });
  generator.push(mode === "normal" ? `function __msg__ (ctx) {` : `(ctx) => {`);
  generator.indent(needIndent);
  if (helpers.length > 0) {
    generator.push(`const { ${join(helpers.map((s) => `${s}: _${s}`), ", ")} } = ctx`);
    generator.newline();
  }
  generator.push(`return `);
  generateNode(generator, ast);
  generator.deindent(needIndent);
  generator.push(`}`);
  delete ast.helpers;
  const { code: code2, map } = generator.context();
  return {
    ast,
    code: code2,
    map: map ? map.toJSON() : void 0
    // eslint-disable-line @typescript-eslint/no-explicit-any
  };
};
function baseCompile$1(source, options = {}) {
  const assignedOptions = assign({}, options);
  const jit = !!assignedOptions.jit;
  const enalbeMinify = !!assignedOptions.minify;
  const enambeOptimize = assignedOptions.optimize == null ? true : assignedOptions.optimize;
  const parser = createParser(assignedOptions);
  const ast = parser.parse(source);
  if (!jit) {
    transform(ast, assignedOptions);
    return generate(ast, assignedOptions);
  } else {
    enambeOptimize && optimize(ast);
    enalbeMinify && minify(ast);
    return { ast, code: "" };
  }
}
/*!
  * core-base v9.14.4
  * (c) 2025 kazuya kawaguchi
  * Released under the MIT License.
  */
function initFeatureFlags$1() {
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
  if (typeof __INTLIFY_JIT_COMPILATION__ !== "boolean") {
    getGlobalThis().__INTLIFY_JIT_COMPILATION__ = false;
  }
  if (typeof __INTLIFY_DROP_MESSAGE_COMPILER__ !== "boolean") {
    getGlobalThis().__INTLIFY_DROP_MESSAGE_COMPILER__ = false;
  }
}
function isMessageAST(val) {
  return isObject$1(val) && resolveType(val) === 0 && (hasOwn(val, "b") || hasOwn(val, "body"));
}
const PROPS_BODY = ["b", "body"];
function resolveBody(node) {
  return resolveProps(node, PROPS_BODY);
}
const PROPS_CASES = ["c", "cases"];
function resolveCases(node) {
  return resolveProps(node, PROPS_CASES, []);
}
const PROPS_STATIC = ["s", "static"];
function resolveStatic(node) {
  return resolveProps(node, PROPS_STATIC);
}
const PROPS_ITEMS = ["i", "items"];
function resolveItems(node) {
  return resolveProps(node, PROPS_ITEMS, []);
}
const PROPS_TYPE = ["t", "type"];
function resolveType(node) {
  return resolveProps(node, PROPS_TYPE);
}
const PROPS_VALUE = ["v", "value"];
function resolveValue$1(node, type) {
  const resolved = resolveProps(node, PROPS_VALUE);
  if (resolved != null) {
    return resolved;
  } else {
    throw createUnhandleNodeError(type);
  }
}
const PROPS_MODIFIER = ["m", "modifier"];
function resolveLinkedModifier(node) {
  return resolveProps(node, PROPS_MODIFIER);
}
const PROPS_KEY = ["k", "key"];
function resolveLinkedKey(node) {
  const resolved = resolveProps(node, PROPS_KEY);
  if (resolved) {
    return resolved;
  } else {
    throw createUnhandleNodeError(
      6
      /* NodeTypes.Linked */
    );
  }
}
function resolveProps(node, props, defaultValue) {
  for (let i = 0; i < props.length; i++) {
    const prop = props[i];
    if (hasOwn(node, prop) && node[prop] != null) {
      return node[prop];
    }
  }
  return defaultValue;
}
const AST_NODE_PROPS_KEYS = [
  ...PROPS_BODY,
  ...PROPS_CASES,
  ...PROPS_STATIC,
  ...PROPS_ITEMS,
  ...PROPS_KEY,
  ...PROPS_MODIFIER,
  ...PROPS_VALUE,
  ...PROPS_TYPE
];
function createUnhandleNodeError(type) {
  return new Error(`unhandled node type: ${type}`);
}
const pathStateMachine = [];
pathStateMachine[
  0
  /* States.BEFORE_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    0
    /* States.BEFORE_PATH */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  1
  /* States.IN_PATH */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1
    /* States.IN_PATH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4
    /* States.IN_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7
    /* States.AFTER_PATH */
  ]
};
pathStateMachine[
  2
  /* States.BEFORE_IDENT */
] = {
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    2
    /* States.BEFORE_IDENT */
  ],
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  3
  /* States.IN_IDENT */
] = {
  [
    "i"
    /* PathCharTypes.IDENT */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "0"
    /* PathCharTypes.ZERO */
  ]: [
    3,
    0
    /* Actions.APPEND */
  ],
  [
    "w"
    /* PathCharTypes.WORKSPACE */
  ]: [
    1,
    1
    /* Actions.PUSH */
  ],
  [
    "."
    /* PathCharTypes.DOT */
  ]: [
    2,
    1
    /* Actions.PUSH */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    1
    /* Actions.PUSH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: [
    7,
    1
    /* Actions.PUSH */
  ]
};
pathStateMachine[
  4
  /* States.IN_SUB_PATH */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ],
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ],
  [
    "["
    /* PathCharTypes.LEFT_BRACKET */
  ]: [
    4,
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ],
  [
    "]"
    /* PathCharTypes.RIGHT_BRACKET */
  ]: [
    1,
    3
    /* Actions.PUSH_SUB_PATH */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  5
  /* States.IN_SINGLE_QUOTE */
] = {
  [
    "'"
    /* PathCharTypes.SINGLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    5,
    0
    /* Actions.APPEND */
  ]
};
pathStateMachine[
  6
  /* States.IN_DOUBLE_QUOTE */
] = {
  [
    '"'
    /* PathCharTypes.DOUBLE_QUOTE */
  ]: [
    4,
    0
    /* Actions.APPEND */
  ],
  [
    "o"
    /* PathCharTypes.END_OF_FAIL */
  ]: 8,
  [
    "l"
    /* PathCharTypes.ELSE */
  ]: [
    6,
    0
    /* Actions.APPEND */
  ]
};
const literalValueRE = /^\s?(?:true|false|-?[\d.]+|'[^']*'|"[^"]*")\s?$/;
function isLiteral(exp) {
  return literalValueRE.test(exp);
}
function stripQuotes(str) {
  const a = str.charCodeAt(0);
  const b = str.charCodeAt(str.length - 1);
  return a === b && (a === 34 || a === 39) ? str.slice(1, -1) : str;
}
function getPathCharType(ch) {
  if (ch === void 0 || ch === null) {
    return "o";
  }
  const code2 = ch.charCodeAt(0);
  switch (code2) {
    case 91:
    case 93:
    case 46:
    case 34:
    case 39:
      return ch;
    case 95:
    case 36:
    case 45:
      return "i";
    case 9:
    case 10:
    case 13:
    case 160:
    case 65279:
    case 8232:
    case 8233:
      return "w";
  }
  return "i";
}
function formatSubPath(path) {
  const trimmed = path.trim();
  if (path.charAt(0) === "0" && isNaN(parseInt(path))) {
    return false;
  }
  return isLiteral(trimmed) ? stripQuotes(trimmed) : "*" + trimmed;
}
function parse(path) {
  const keys = [];
  let index = -1;
  let mode = 0;
  let subPathDepth = 0;
  let c;
  let key;
  let newChar;
  let type;
  let transition;
  let action;
  let typeMap;
  const actions = [];
  actions[
    0
    /* Actions.APPEND */
  ] = () => {
    if (key === void 0) {
      key = newChar;
    } else {
      key += newChar;
    }
  };
  actions[
    1
    /* Actions.PUSH */
  ] = () => {
    if (key !== void 0) {
      keys.push(key);
      key = void 0;
    }
  };
  actions[
    2
    /* Actions.INC_SUB_PATH_DEPTH */
  ] = () => {
    actions[
      0
      /* Actions.APPEND */
    ]();
    subPathDepth++;
  };
  actions[
    3
    /* Actions.PUSH_SUB_PATH */
  ] = () => {
    if (subPathDepth > 0) {
      subPathDepth--;
      mode = 4;
      actions[
        0
        /* Actions.APPEND */
      ]();
    } else {
      subPathDepth = 0;
      if (key === void 0) {
        return false;
      }
      key = formatSubPath(key);
      if (key === false) {
        return false;
      } else {
        actions[
          1
          /* Actions.PUSH */
        ]();
      }
    }
  };
  function maybeUnescapeQuote() {
    const nextChar = path[index + 1];
    if (mode === 5 && nextChar === "'" || mode === 6 && nextChar === '"') {
      index++;
      newChar = "\\" + nextChar;
      actions[
        0
        /* Actions.APPEND */
      ]();
      return true;
    }
  }
  while (mode !== null) {
    index++;
    c = path[index];
    if (c === "\\" && maybeUnescapeQuote()) {
      continue;
    }
    type = getPathCharType(c);
    typeMap = pathStateMachine[mode];
    transition = typeMap[type] || typeMap[
      "l"
      /* PathCharTypes.ELSE */
    ] || 8;
    if (transition === 8) {
      return;
    }
    mode = transition[0];
    if (transition[1] !== void 0) {
      action = actions[transition[1]];
      if (action) {
        newChar = c;
        if (action() === false) {
          return;
        }
      }
    }
    if (mode === 7) {
      return keys;
    }
  }
}
const cache = /* @__PURE__ */ new Map();
function resolveWithKeyValue(obj, path) {
  return isObject$1(obj) ? obj[path] : null;
}
function resolveValue(obj, path) {
  if (!isObject$1(obj)) {
    return null;
  }
  let hit = cache.get(path);
  if (!hit) {
    hit = parse(path);
    if (hit) {
      cache.set(path, hit);
    }
  }
  if (!hit) {
    return null;
  }
  const len = hit.length;
  let last = obj;
  let i = 0;
  while (i < len) {
    const key = hit[i];
    if (AST_NODE_PROPS_KEYS.includes(key) && isMessageAST(last)) {
      return null;
    }
    const val = last[key];
    if (val === void 0) {
      return null;
    }
    if (isFunction(last)) {
      return null;
    }
    last = val;
    i++;
  }
  return last;
}
const DEFAULT_MODIFIER = (str) => str;
const DEFAULT_MESSAGE = (ctx) => "";
const DEFAULT_MESSAGE_DATA_TYPE = "text";
const DEFAULT_NORMALIZE = (values) => values.length === 0 ? "" : join$1(values);
const DEFAULT_INTERPOLATE = toDisplayString;
function pluralDefault(choice, choicesLength) {
  choice = Math.abs(choice);
  if (choicesLength === 2) {
    return choice ? choice > 1 ? 1 : 0 : 1;
  }
  return choice ? Math.min(choice, 2) : 0;
}
function getPluralIndex(options) {
  const index = isNumber(options.pluralIndex) ? options.pluralIndex : -1;
  return options.named && (isNumber(options.named.count) || isNumber(options.named.n)) ? isNumber(options.named.count) ? options.named.count : isNumber(options.named.n) ? options.named.n : index : index;
}
function normalizeNamed(pluralIndex, props) {
  if (!props.count) {
    props.count = pluralIndex;
  }
  if (!props.n) {
    props.n = pluralIndex;
  }
}
function createMessageContext(options = {}) {
  const locale = options.locale;
  const pluralIndex = getPluralIndex(options);
  const pluralRule = isObject$1(options.pluralRules) && isString$1(locale) && isFunction(options.pluralRules[locale]) ? options.pluralRules[locale] : pluralDefault;
  const orgPluralRule = isObject$1(options.pluralRules) && isString$1(locale) && isFunction(options.pluralRules[locale]) ? pluralDefault : void 0;
  const plural = (messages) => {
    return messages[pluralRule(pluralIndex, messages.length, orgPluralRule)];
  };
  const _list = options.list || [];
  const list = (index) => _list[index];
  const _named = options.named || create();
  isNumber(options.pluralIndex) && normalizeNamed(pluralIndex, _named);
  const named = (key) => _named[key];
  function message(key) {
    const msg = isFunction(options.messages) ? options.messages(key) : isObject$1(options.messages) ? options.messages[key] : false;
    return !msg ? options.parent ? options.parent.message(key) : DEFAULT_MESSAGE : msg;
  }
  const _modifier = (name) => options.modifiers ? options.modifiers[name] : DEFAULT_MODIFIER;
  const normalize = isPlainObject(options.processor) && isFunction(options.processor.normalize) ? options.processor.normalize : DEFAULT_NORMALIZE;
  const interpolate = isPlainObject(options.processor) && isFunction(options.processor.interpolate) ? options.processor.interpolate : DEFAULT_INTERPOLATE;
  const type = isPlainObject(options.processor) && isString$1(options.processor.type) ? options.processor.type : DEFAULT_MESSAGE_DATA_TYPE;
  const linked = (key, ...args) => {
    const [arg1, arg2] = args;
    let type2 = "text";
    let modifier = "";
    if (args.length === 1) {
      if (isObject$1(arg1)) {
        modifier = arg1.modifier || modifier;
        type2 = arg1.type || type2;
      } else if (isString$1(arg1)) {
        modifier = arg1 || modifier;
      }
    } else if (args.length === 2) {
      if (isString$1(arg1)) {
        modifier = arg1 || modifier;
      }
      if (isString$1(arg2)) {
        type2 = arg2 || type2;
      }
    }
    const ret = message(key)(ctx);
    const msg = (
      // The message in vnode resolved with linked are returned as an array by processor.nomalize
      type2 === "vnode" && isArray(ret) && modifier ? ret[0] : ret
    );
    return modifier ? _modifier(modifier)(msg, type2) : msg;
  };
  const ctx = {
    [
      "list"
      /* HelperNameMap.LIST */
    ]: list,
    [
      "named"
      /* HelperNameMap.NAMED */
    ]: named,
    [
      "plural"
      /* HelperNameMap.PLURAL */
    ]: plural,
    [
      "linked"
      /* HelperNameMap.LINKED */
    ]: linked,
    [
      "message"
      /* HelperNameMap.MESSAGE */
    ]: message,
    [
      "type"
      /* HelperNameMap.TYPE */
    ]: type,
    [
      "interpolate"
      /* HelperNameMap.INTERPOLATE */
    ]: interpolate,
    [
      "normalize"
      /* HelperNameMap.NORMALIZE */
    ]: normalize,
    [
      "values"
      /* HelperNameMap.VALUES */
    ]: assign$1(create(), _list, _named)
  };
  return ctx;
}
let devtools = null;
function setDevToolsHook(hook) {
  devtools = hook;
}
function initI18nDevTools(i18n, version, meta) {
  devtools && devtools.emit("i18n:init", {
    timestamp: Date.now(),
    i18n,
    version,
    meta
  });
}
const translateDevTools = /* @__PURE__ */ createDevToolsHook(
  "function:translate"
  /* IntlifyDevToolsHooks.FunctionTranslate */
);
function createDevToolsHook(hook) {
  return (payloads) => devtools && devtools.emit(hook, payloads);
}
const code$1$1 = CompileWarnCodes.__EXTEND_POINT__;
const inc$1$1 = incrementer(code$1$1);
const CoreWarnCodes = {
  // 2
  FALLBACK_TO_TRANSLATE: inc$1$1(),
  // 3
  CANNOT_FORMAT_NUMBER: inc$1$1(),
  // 4
  FALLBACK_TO_NUMBER_FORMAT: inc$1$1(),
  // 5
  CANNOT_FORMAT_DATE: inc$1$1(),
  // 6
  FALLBACK_TO_DATE_FORMAT: inc$1$1(),
  // 7
  EXPERIMENTAL_CUSTOM_MESSAGE_COMPILER: inc$1$1(),
  // 8
  __EXTEND_POINT__: inc$1$1()
  // 9
};
const code$2 = CompileErrorCodes.__EXTEND_POINT__;
const inc$2 = incrementer(code$2);
const CoreErrorCodes = {
  INVALID_ARGUMENT: code$2,
  // 17
  INVALID_DATE_ARGUMENT: inc$2(),
  // 18
  INVALID_ISO_DATE_ARGUMENT: inc$2(),
  // 19
  NOT_SUPPORT_NON_STRING_MESSAGE: inc$2(),
  // 20
  NOT_SUPPORT_LOCALE_PROMISE_VALUE: inc$2(),
  // 21
  NOT_SUPPORT_LOCALE_ASYNC_FUNCTION: inc$2(),
  // 22
  NOT_SUPPORT_LOCALE_TYPE: inc$2(),
  // 23
  __EXTEND_POINT__: inc$2()
  // 24
};
function createCoreError(code2) {
  return createCompileError(code2, null, void 0);
}
function getLocale(context, options) {
  return options.locale != null ? resolveLocale(options.locale) : resolveLocale(context.locale);
}
let _resolveLocale;
function resolveLocale(locale) {
  if (isString$1(locale)) {
    return locale;
  } else {
    if (isFunction(locale)) {
      if (locale.resolvedOnce && _resolveLocale != null) {
        return _resolveLocale;
      } else if (locale.constructor.name === "Function") {
        const resolve = locale();
        if (isPromise(resolve)) {
          throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_PROMISE_VALUE);
        }
        return _resolveLocale = resolve;
      } else {
        throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_ASYNC_FUNCTION);
      }
    } else {
      throw createCoreError(CoreErrorCodes.NOT_SUPPORT_LOCALE_TYPE);
    }
  }
}
function fallbackWithSimple(ctx, fallback, start) {
  return [.../* @__PURE__ */ new Set([
    start,
    ...isArray(fallback) ? fallback : isObject$1(fallback) ? Object.keys(fallback) : isString$1(fallback) ? [fallback] : [start]
  ])];
}
function fallbackWithLocaleChain(ctx, fallback, start) {
  const startLocale = isString$1(start) ? start : DEFAULT_LOCALE;
  const context = ctx;
  if (!context.__localeChainCache) {
    context.__localeChainCache = /* @__PURE__ */ new Map();
  }
  let chain = context.__localeChainCache.get(startLocale);
  if (!chain) {
    chain = [];
    let block = [start];
    while (isArray(block)) {
      block = appendBlockToChain(chain, block, fallback);
    }
    const defaults = isArray(fallback) || !isPlainObject(fallback) ? fallback : fallback["default"] ? fallback["default"] : null;
    block = isString$1(defaults) ? [defaults] : defaults;
    if (isArray(block)) {
      appendBlockToChain(chain, block, false);
    }
    context.__localeChainCache.set(startLocale, chain);
  }
  return chain;
}
function appendBlockToChain(chain, block, blocks) {
  let follow = true;
  for (let i = 0; i < block.length && isBoolean(follow); i++) {
    const locale = block[i];
    if (isString$1(locale)) {
      follow = appendLocaleToChain(chain, block[i], blocks);
    }
  }
  return follow;
}
function appendLocaleToChain(chain, locale, blocks) {
  let follow;
  const tokens = locale.split("-");
  do {
    const target = tokens.join("-");
    follow = appendItemToChain(chain, target, blocks);
    tokens.splice(-1, 1);
  } while (tokens.length && follow === true);
  return follow;
}
function appendItemToChain(chain, target, blocks) {
  let follow = false;
  if (!chain.includes(target)) {
    follow = true;
    if (target) {
      follow = target[target.length - 1] !== "!";
      const locale = target.replace(/!/g, "");
      chain.push(locale);
      if ((isArray(blocks) || isPlainObject(blocks)) && blocks[locale]) {
        follow = blocks[locale];
      }
    }
  }
  return follow;
}
const VERSION$1 = "9.14.4";
const NOT_REOSLVED = -1;
const DEFAULT_LOCALE = "en-US";
const MISSING_RESOLVE_VALUE = "";
const capitalize = (str) => `${str.charAt(0).toLocaleUpperCase()}${str.substr(1)}`;
function getDefaultLinkedModifiers() {
  return {
    upper: (val, type) => {
      return type === "text" && isString$1(val) ? val.toUpperCase() : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? val.children.toUpperCase() : val;
    },
    lower: (val, type) => {
      return type === "text" && isString$1(val) ? val.toLowerCase() : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? val.children.toLowerCase() : val;
    },
    capitalize: (val, type) => {
      return type === "text" && isString$1(val) ? capitalize(val) : type === "vnode" && isObject$1(val) && "__v_isVNode" in val ? capitalize(val.children) : val;
    }
  };
}
let _compiler;
function registerMessageCompiler(compiler) {
  _compiler = compiler;
}
let _resolver;
function registerMessageResolver(resolver) {
  _resolver = resolver;
}
let _fallbacker;
function registerLocaleFallbacker(fallbacker) {
  _fallbacker = fallbacker;
}
let _additionalMeta = null;
const setAdditionalMeta = /* @__NO_SIDE_EFFECTS__ */ (meta) => {
  _additionalMeta = meta;
};
const getAdditionalMeta = /* @__NO_SIDE_EFFECTS__ */ () => _additionalMeta;
let _fallbackContext = null;
const setFallbackContext = (context) => {
  _fallbackContext = context;
};
const getFallbackContext = () => _fallbackContext;
let _cid = 0;
function createCoreContext(options = {}) {
  const onWarn = isFunction(options.onWarn) ? options.onWarn : warn;
  const version = isString$1(options.version) ? options.version : VERSION$1;
  const locale = isString$1(options.locale) || isFunction(options.locale) ? options.locale : DEFAULT_LOCALE;
  const _locale = isFunction(locale) ? DEFAULT_LOCALE : locale;
  const fallbackLocale = isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || isString$1(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale;
  const messages = isPlainObject(options.messages) ? options.messages : createResources(_locale);
  const datetimeFormats = isPlainObject(options.datetimeFormats) ? options.datetimeFormats : createResources(_locale);
  const numberFormats = isPlainObject(options.numberFormats) ? options.numberFormats : createResources(_locale);
  const modifiers = assign$1(create(), options.modifiers, getDefaultLinkedModifiers());
  const pluralRules = options.pluralRules || create();
  const missing = isFunction(options.missing) ? options.missing : null;
  const missingWarn = isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const fallbackWarn = isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const fallbackFormat = !!options.fallbackFormat;
  const unresolving = !!options.unresolving;
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  const processor = isPlainObject(options.processor) ? options.processor : null;
  const warnHtmlMessage = isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const escapeParameter = !!options.escapeParameter;
  const messageCompiler = isFunction(options.messageCompiler) ? options.messageCompiler : _compiler;
  const messageResolver = isFunction(options.messageResolver) ? options.messageResolver : _resolver || resolveWithKeyValue;
  const localeFallbacker = isFunction(options.localeFallbacker) ? options.localeFallbacker : _fallbacker || fallbackWithSimple;
  const fallbackContext = isObject$1(options.fallbackContext) ? options.fallbackContext : void 0;
  const internalOptions = options;
  const __datetimeFormatters = isObject$1(internalOptions.__datetimeFormatters) ? internalOptions.__datetimeFormatters : /* @__PURE__ */ new Map();
  const __numberFormatters = isObject$1(internalOptions.__numberFormatters) ? internalOptions.__numberFormatters : /* @__PURE__ */ new Map();
  const __meta = isObject$1(internalOptions.__meta) ? internalOptions.__meta : {};
  _cid++;
  const context = {
    version,
    cid: _cid,
    locale,
    fallbackLocale,
    messages,
    modifiers,
    pluralRules,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackFormat,
    unresolving,
    postTranslation,
    processor,
    warnHtmlMessage,
    escapeParameter,
    messageCompiler,
    messageResolver,
    localeFallbacker,
    fallbackContext,
    onWarn,
    __meta
  };
  {
    context.datetimeFormats = datetimeFormats;
    context.numberFormats = numberFormats;
    context.__datetimeFormatters = __datetimeFormatters;
    context.__numberFormatters = __numberFormatters;
  }
  if (__INTLIFY_PROD_DEVTOOLS__) {
    initI18nDevTools(context, version, __meta);
  }
  return context;
}
const createResources = (locale) => ({ [locale]: create() });
function handleMissing(context, key, locale, missingWarn, type) {
  const { missing, onWarn } = context;
  if (missing !== null) {
    const ret = missing(context, locale, key, type);
    return isString$1(ret) ? ret : key;
  } else {
    return key;
  }
}
function updateFallbackLocale(ctx, locale, fallback) {
  const context = ctx;
  context.__localeChainCache = /* @__PURE__ */ new Map();
  ctx.localeFallbacker(ctx, fallback, locale);
}
function isAlmostSameLocale(locale, compareLocale) {
  if (locale === compareLocale)
    return false;
  return locale.split("-")[0] === compareLocale.split("-")[0];
}
function isImplicitFallback(targetLocale, locales) {
  const index = locales.indexOf(targetLocale);
  if (index === -1) {
    return false;
  }
  for (let i = index + 1; i < locales.length; i++) {
    if (isAlmostSameLocale(targetLocale, locales[i])) {
      return true;
    }
  }
  return false;
}
function format(ast) {
  const msg = (ctx) => formatParts(ctx, ast);
  return msg;
}
function formatParts(ctx, ast) {
  const body = resolveBody(ast);
  if (body == null) {
    throw createUnhandleNodeError(
      0
      /* NodeTypes.Resource */
    );
  }
  const type = resolveType(body);
  if (type === 1) {
    const plural = body;
    const cases = resolveCases(plural);
    return ctx.plural(cases.reduce((messages, c) => [
      ...messages,
      formatMessageParts(ctx, c)
    ], []));
  } else {
    return formatMessageParts(ctx, body);
  }
}
function formatMessageParts(ctx, node) {
  const static_ = resolveStatic(node);
  if (static_ != null) {
    return ctx.type === "text" ? static_ : ctx.normalize([static_]);
  } else {
    const messages = resolveItems(node).reduce((acm, c) => [...acm, formatMessagePart(ctx, c)], []);
    return ctx.normalize(messages);
  }
}
function formatMessagePart(ctx, node) {
  const type = resolveType(node);
  switch (type) {
    case 3: {
      return resolveValue$1(node, type);
    }
    case 9: {
      return resolveValue$1(node, type);
    }
    case 4: {
      const named = node;
      if (hasOwn(named, "k") && named.k) {
        return ctx.interpolate(ctx.named(named.k));
      }
      if (hasOwn(named, "key") && named.key) {
        return ctx.interpolate(ctx.named(named.key));
      }
      throw createUnhandleNodeError(type);
    }
    case 5: {
      const list = node;
      if (hasOwn(list, "i") && isNumber(list.i)) {
        return ctx.interpolate(ctx.list(list.i));
      }
      if (hasOwn(list, "index") && isNumber(list.index)) {
        return ctx.interpolate(ctx.list(list.index));
      }
      throw createUnhandleNodeError(type);
    }
    case 6: {
      const linked = node;
      const modifier = resolveLinkedModifier(linked);
      const key = resolveLinkedKey(linked);
      return ctx.linked(formatMessagePart(ctx, key), modifier ? formatMessagePart(ctx, modifier) : void 0, ctx.type);
    }
    case 7: {
      return resolveValue$1(node, type);
    }
    case 8: {
      return resolveValue$1(node, type);
    }
    default:
      throw new Error(`unhandled node on format message part: ${type}`);
  }
}
const defaultOnCacheKey = (message) => message;
let compileCache = create();
function baseCompile(message, options = {}) {
  let detectError = false;
  const onError = options.onError || defaultOnError;
  options.onError = (err) => {
    detectError = true;
    onError(err);
  };
  return { ...baseCompile$1(message, options), detectError };
}
const compileToFunction = /* @__NO_SIDE_EFFECTS__ */ (message, context) => {
  if (!isString$1(message)) {
    throw createCoreError(CoreErrorCodes.NOT_SUPPORT_NON_STRING_MESSAGE);
  }
  {
    isBoolean(context.warnHtmlMessage) ? context.warnHtmlMessage : true;
    const onCacheKey = context.onCacheKey || defaultOnCacheKey;
    const cacheKey = onCacheKey(message);
    const cached = compileCache[cacheKey];
    if (cached) {
      return cached;
    }
    const { code: code2, detectError } = baseCompile(message, context);
    const msg = new Function(`return ${code2}`)();
    return !detectError ? compileCache[cacheKey] = msg : msg;
  }
};
function compile(message, context) {
  if (__INTLIFY_JIT_COMPILATION__ && !__INTLIFY_DROP_MESSAGE_COMPILER__ && isString$1(message)) {
    isBoolean(context.warnHtmlMessage) ? context.warnHtmlMessage : true;
    const onCacheKey = context.onCacheKey || defaultOnCacheKey;
    const cacheKey = onCacheKey(message);
    const cached = compileCache[cacheKey];
    if (cached) {
      return cached;
    }
    const { ast, detectError } = baseCompile(message, {
      ...context,
      location: false,
      jit: true
    });
    const msg = format(ast);
    return !detectError ? compileCache[cacheKey] = msg : msg;
  } else {
    const cacheKey = message.cacheKey;
    if (cacheKey) {
      const cached = compileCache[cacheKey];
      if (cached) {
        return cached;
      }
      return compileCache[cacheKey] = format(message);
    } else {
      return format(message);
    }
  }
}
const NOOP_MESSAGE_FUNCTION = () => "";
const isMessageFunction = (val) => isFunction(val);
function translate(context, ...args) {
  const { fallbackFormat, postTranslation, unresolving, messageCompiler, fallbackLocale, messages } = context;
  const [key, options] = parseTranslateArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  const fallbackWarn = isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const escapeParameter = isBoolean(options.escapeParameter) ? options.escapeParameter : context.escapeParameter;
  const resolvedMessage = !!options.resolvedMessage;
  const defaultMsgOrKey = isString$1(options.default) || isBoolean(options.default) ? !isBoolean(options.default) ? options.default : !messageCompiler ? () => key : key : fallbackFormat ? !messageCompiler ? () => key : key : "";
  const enableDefaultMsg = fallbackFormat || defaultMsgOrKey !== "";
  const locale = getLocale(context, options);
  escapeParameter && escapeParams(options);
  let [formatScope, targetLocale, message] = !resolvedMessage ? resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) : [
    key,
    locale,
    messages[locale] || create()
  ];
  let format2 = formatScope;
  let cacheBaseKey = key;
  if (!resolvedMessage && !(isString$1(format2) || isMessageAST(format2) || isMessageFunction(format2))) {
    if (enableDefaultMsg) {
      format2 = defaultMsgOrKey;
      cacheBaseKey = format2;
    }
  }
  if (!resolvedMessage && (!(isString$1(format2) || isMessageAST(format2) || isMessageFunction(format2)) || !isString$1(targetLocale))) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let occurred = false;
  const onError = () => {
    occurred = true;
  };
  const msg = !isMessageFunction(format2) ? compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) : format2;
  if (occurred) {
    return format2;
  }
  const ctxOptions = getMessageContextOptions(context, targetLocale, message, options);
  const msgContext = createMessageContext(ctxOptions);
  const messaged = evaluateMessage(context, msg, msgContext);
  const ret = postTranslation ? postTranslation(messaged, key) : messaged;
  if (__INTLIFY_PROD_DEVTOOLS__) {
    const payloads = {
      timestamp: Date.now(),
      key: isString$1(key) ? key : isMessageFunction(format2) ? format2.key : "",
      locale: targetLocale || (isMessageFunction(format2) ? format2.locale : ""),
      format: isString$1(format2) ? format2 : isMessageFunction(format2) ? format2.source : "",
      message: ret
    };
    payloads.meta = assign$1({}, context.__meta, /* @__PURE__ */ getAdditionalMeta() || {});
    translateDevTools(payloads);
  }
  return ret;
}
function escapeParams(options) {
  if (isArray(options.list)) {
    options.list = options.list.map((item) => isString$1(item) ? escapeHtml(item) : item);
  } else if (isObject$1(options.named)) {
    Object.keys(options.named).forEach((key) => {
      if (isString$1(options.named[key])) {
        options.named[key] = escapeHtml(options.named[key]);
      }
    });
  }
}
function resolveMessageFormat(context, key, locale, fallbackLocale, fallbackWarn, missingWarn) {
  const { messages, onWarn, messageResolver: resolveValue2, localeFallbacker } = context;
  const locales = localeFallbacker(context, fallbackLocale, locale);
  let message = create();
  let targetLocale;
  let format2 = null;
  const type = "translate";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    message = messages[targetLocale] || create();
    if ((format2 = resolveValue2(message, key)) === null) {
      format2 = message[key];
    }
    if (isString$1(format2) || isMessageAST(format2) || isMessageFunction(format2)) {
      break;
    }
    if (!isImplicitFallback(targetLocale, locales)) {
      const missingRet = handleMissing(
        context,
        // eslint-disable-line @typescript-eslint/no-explicit-any
        key,
        targetLocale,
        missingWarn,
        type
      );
      if (missingRet !== key) {
        format2 = missingRet;
      }
    }
  }
  return [format2, targetLocale, message];
}
function compileMessageFormat(context, key, targetLocale, format2, cacheBaseKey, onError) {
  const { messageCompiler, warnHtmlMessage } = context;
  if (isMessageFunction(format2)) {
    const msg2 = format2;
    msg2.locale = msg2.locale || targetLocale;
    msg2.key = msg2.key || key;
    return msg2;
  }
  if (messageCompiler == null) {
    const msg2 = () => format2;
    msg2.locale = targetLocale;
    msg2.key = key;
    return msg2;
  }
  const msg = messageCompiler(format2, getCompileContext(context, targetLocale, cacheBaseKey, format2, warnHtmlMessage, onError));
  msg.locale = targetLocale;
  msg.key = key;
  msg.source = format2;
  return msg;
}
function evaluateMessage(context, msg, msgCtx) {
  const messaged = msg(msgCtx);
  return messaged;
}
function parseTranslateArgs(...args) {
  const [arg1, arg2, arg3] = args;
  const options = create();
  if (!isString$1(arg1) && !isNumber(arg1) && !isMessageFunction(arg1) && !isMessageAST(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const key = isNumber(arg1) ? String(arg1) : isMessageFunction(arg1) ? arg1 : arg1;
  if (isNumber(arg2)) {
    options.plural = arg2;
  } else if (isString$1(arg2)) {
    options.default = arg2;
  } else if (isPlainObject(arg2) && !isEmptyObject(arg2)) {
    options.named = arg2;
  } else if (isArray(arg2)) {
    options.list = arg2;
  }
  if (isNumber(arg3)) {
    options.plural = arg3;
  } else if (isString$1(arg3)) {
    options.default = arg3;
  } else if (isPlainObject(arg3)) {
    assign$1(options, arg3);
  }
  return [key, options];
}
function getCompileContext(context, locale, key, source, warnHtmlMessage, onError) {
  return {
    locale,
    key,
    warnHtmlMessage,
    onError: (err) => {
      onError && onError(err);
      {
        throw err;
      }
    },
    onCacheKey: (source2) => generateFormatCacheKey(locale, key, source2)
  };
}
function getMessageContextOptions(context, locale, message, options) {
  const { modifiers, pluralRules, messageResolver: resolveValue2, fallbackLocale, fallbackWarn, missingWarn, fallbackContext } = context;
  const resolveMessage = (key) => {
    let val = resolveValue2(message, key);
    if (val == null && fallbackContext) {
      const [, , message2] = resolveMessageFormat(fallbackContext, key, locale, fallbackLocale, fallbackWarn, missingWarn);
      val = resolveValue2(message2, key);
    }
    if (isString$1(val) || isMessageAST(val)) {
      let occurred = false;
      const onError = () => {
        occurred = true;
      };
      const msg = compileMessageFormat(context, key, locale, val, key, onError);
      return !occurred ? msg : NOOP_MESSAGE_FUNCTION;
    } else if (isMessageFunction(val)) {
      return val;
    } else {
      return NOOP_MESSAGE_FUNCTION;
    }
  };
  const ctxOptions = {
    locale,
    modifiers,
    pluralRules,
    messages: resolveMessage
  };
  if (context.processor) {
    ctxOptions.processor = context.processor;
  }
  if (options.list) {
    ctxOptions.list = options.list;
  }
  if (options.named) {
    ctxOptions.named = options.named;
  }
  if (isNumber(options.plural)) {
    ctxOptions.pluralIndex = options.plural;
  }
  return ctxOptions;
}
function datetime(context, ...args) {
  const { datetimeFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __datetimeFormatters } = context;
  const [key, value, options, overrides] = parseDateTimeArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString$1(key) || key === "") {
    return new Intl.DateTimeFormat(locale, overrides).format(value);
  }
  let datetimeFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "datetime format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    datetimeFormat = datetimeFormats[targetLocale] || {};
    format2 = datetimeFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format2) || !isString$1(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __datetimeFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.DateTimeFormat(targetLocale, assign$1({}, format2, overrides));
    __datetimeFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const DATETIME_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "weekday",
  "era",
  "year",
  "month",
  "day",
  "hour",
  "minute",
  "second",
  "timeZoneName",
  "formatMatcher",
  "hour12",
  "timeZone",
  "dateStyle",
  "timeStyle",
  "calendar",
  "dayPeriod",
  "numberingSystem",
  "hourCycle",
  "fractionalSecondDigits"
];
function parseDateTimeArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  let value;
  if (isString$1(arg1)) {
    const matches = arg1.match(/(\d{4}-\d{2}-\d{2})(T|\s)?(.*)/);
    if (!matches) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
    const dateTime = matches[3] ? matches[3].trim().startsWith("T") ? `${matches[1].trim()}${matches[3].trim()}` : `${matches[1].trim()}T${matches[3].trim()}` : matches[1].trim();
    value = new Date(dateTime);
    try {
      value.toISOString();
    } catch (e) {
      throw createCoreError(CoreErrorCodes.INVALID_ISO_DATE_ARGUMENT);
    }
  } else if (isDate(arg1)) {
    if (isNaN(arg1.getTime())) {
      throw createCoreError(CoreErrorCodes.INVALID_DATE_ARGUMENT);
    }
    value = arg1;
  } else if (isNumber(arg1)) {
    value = arg1;
  } else {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  if (isString$1(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (DATETIME_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString$1(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearDateTimeFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__datetimeFormatters.has(id)) {
      continue;
    }
    context.__datetimeFormatters.delete(id);
  }
}
function number(context, ...args) {
  const { numberFormats, unresolving, fallbackLocale, onWarn, localeFallbacker } = context;
  const { __numberFormatters } = context;
  const [key, value, options, overrides] = parseNumberArgs(...args);
  const missingWarn = isBoolean(options.missingWarn) ? options.missingWarn : context.missingWarn;
  isBoolean(options.fallbackWarn) ? options.fallbackWarn : context.fallbackWarn;
  const part = !!options.part;
  const locale = getLocale(context, options);
  const locales = localeFallbacker(
    context,
    // eslint-disable-line @typescript-eslint/no-explicit-any
    fallbackLocale,
    locale
  );
  if (!isString$1(key) || key === "") {
    return new Intl.NumberFormat(locale, overrides).format(value);
  }
  let numberFormat = {};
  let targetLocale;
  let format2 = null;
  const type = "number format";
  for (let i = 0; i < locales.length; i++) {
    targetLocale = locales[i];
    numberFormat = numberFormats[targetLocale] || {};
    format2 = numberFormat[key];
    if (isPlainObject(format2))
      break;
    handleMissing(context, key, targetLocale, missingWarn, type);
  }
  if (!isPlainObject(format2) || !isString$1(targetLocale)) {
    return unresolving ? NOT_REOSLVED : key;
  }
  let id = `${targetLocale}__${key}`;
  if (!isEmptyObject(overrides)) {
    id = `${id}__${JSON.stringify(overrides)}`;
  }
  let formatter = __numberFormatters.get(id);
  if (!formatter) {
    formatter = new Intl.NumberFormat(targetLocale, assign$1({}, format2, overrides));
    __numberFormatters.set(id, formatter);
  }
  return !part ? formatter.format(value) : formatter.formatToParts(value);
}
const NUMBER_FORMAT_OPTIONS_KEYS = [
  "localeMatcher",
  "style",
  "currency",
  "currencyDisplay",
  "currencySign",
  "useGrouping",
  "minimumIntegerDigits",
  "minimumFractionDigits",
  "maximumFractionDigits",
  "minimumSignificantDigits",
  "maximumSignificantDigits",
  "compactDisplay",
  "notation",
  "signDisplay",
  "unit",
  "unitDisplay",
  "roundingMode",
  "roundingPriority",
  "roundingIncrement",
  "trailingZeroDisplay"
];
function parseNumberArgs(...args) {
  const [arg1, arg2, arg3, arg4] = args;
  const options = create();
  let overrides = create();
  if (!isNumber(arg1)) {
    throw createCoreError(CoreErrorCodes.INVALID_ARGUMENT);
  }
  const value = arg1;
  if (isString$1(arg2)) {
    options.key = arg2;
  } else if (isPlainObject(arg2)) {
    Object.keys(arg2).forEach((key) => {
      if (NUMBER_FORMAT_OPTIONS_KEYS.includes(key)) {
        overrides[key] = arg2[key];
      } else {
        options[key] = arg2[key];
      }
    });
  }
  if (isString$1(arg3)) {
    options.locale = arg3;
  } else if (isPlainObject(arg3)) {
    overrides = arg3;
  }
  if (isPlainObject(arg4)) {
    overrides = arg4;
  }
  return [options.key || "", value, options, overrides];
}
function clearNumberFormat(ctx, locale, format2) {
  const context = ctx;
  for (const key in format2) {
    const id = `${locale}__${key}`;
    if (!context.__numberFormatters.has(id)) {
      continue;
    }
    context.__numberFormatters.delete(id);
  }
}
{
  initFeatureFlags$1();
}
const { createVNode, Text, computed: computed$3, watch, getCurrentInstance, ref: ref$3, shallowRef, Fragment, defineComponent, h, effectScope, inject, onMounted, onUnmounted, onBeforeMount, isRef } = await importShared("vue");
const VERSION = "9.14.4";
function initFeatureFlags() {
  if (typeof __VUE_I18N_FULL_INSTALL__ !== "boolean") {
    getGlobalThis().__VUE_I18N_FULL_INSTALL__ = true;
  }
  if (typeof __VUE_I18N_LEGACY_API__ !== "boolean") {
    getGlobalThis().__VUE_I18N_LEGACY_API__ = true;
  }
  if (typeof __INTLIFY_JIT_COMPILATION__ !== "boolean") {
    getGlobalThis().__INTLIFY_JIT_COMPILATION__ = false;
  }
  if (typeof __INTLIFY_DROP_MESSAGE_COMPILER__ !== "boolean") {
    getGlobalThis().__INTLIFY_DROP_MESSAGE_COMPILER__ = false;
  }
  if (typeof __INTLIFY_PROD_DEVTOOLS__ !== "boolean") {
    getGlobalThis().__INTLIFY_PROD_DEVTOOLS__ = false;
  }
}
const code$1 = CoreWarnCodes.__EXTEND_POINT__;
const inc$1 = incrementer(code$1);
({
  // 9
  NOT_SUPPORTED_PRESERVE: inc$1(),
  // 10
  NOT_SUPPORTED_FORMATTER: inc$1(),
  // 11
  NOT_SUPPORTED_PRESERVE_DIRECTIVE: inc$1(),
  // 12
  NOT_SUPPORTED_GET_CHOICE_INDEX: inc$1(),
  // 13
  COMPONENT_NAME_LEGACY_COMPATIBLE: inc$1(),
  // 14
  NOT_FOUND_PARENT_SCOPE: inc$1(),
  // 15
  IGNORE_OBJ_FLATTEN: inc$1(),
  // 16
  NOTICE_DROP_ALLOW_COMPOSITION: inc$1(),
  // 17
  NOTICE_DROP_TRANSLATE_EXIST_COMPATIBLE_FLAG: inc$1()
  // 18
});
const code = CoreErrorCodes.__EXTEND_POINT__;
const inc = incrementer(code);
const I18nErrorCodes = {
  // composer module errors
  UNEXPECTED_RETURN_TYPE: code,
  // 24
  // legacy module errors
  INVALID_ARGUMENT: inc(),
  // 25
  // i18n module errors
  MUST_BE_CALL_SETUP_TOP: inc(),
  // 26
  NOT_INSTALLED: inc(),
  // 27
  NOT_AVAILABLE_IN_LEGACY_MODE: inc(),
  // 28
  // directive module errors
  REQUIRED_VALUE: inc(),
  // 29
  INVALID_VALUE: inc(),
  // 30
  // vue-devtools errors
  CANNOT_SETUP_VUE_DEVTOOLS_PLUGIN: inc(),
  // 31
  NOT_INSTALLED_WITH_PROVIDE: inc(),
  // 32
  // unexpected error
  UNEXPECTED_ERROR: inc(),
  // 33
  // not compatible legacy vue-i18n constructor
  NOT_COMPATIBLE_LEGACY_VUE_I18N: inc(),
  // 34
  // bridge support vue 2.x only
  BRIDGE_SUPPORT_VUE_2_ONLY: inc(),
  // 35
  // need to define `i18n` option in `allowComposition: true` and `useScope: 'local' at `useI18n``
  MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION: inc(),
  // 36
  // Not available Compostion API in Legacy API mode. Please make sure that the legacy API mode is working properly
  NOT_AVAILABLE_COMPOSITION_IN_LEGACY: inc(),
  // 37
  // for enhancement
  __EXTEND_POINT__: inc()
  // 38
};
function createI18nError(code2, ...args) {
  return createCompileError(code2, null, void 0);
}
const TranslateVNodeSymbol = /* @__PURE__ */ makeSymbol("__translateVNode");
const DatetimePartsSymbol = /* @__PURE__ */ makeSymbol("__datetimeParts");
const NumberPartsSymbol = /* @__PURE__ */ makeSymbol("__numberParts");
const SetPluralRulesSymbol = makeSymbol("__setPluralRules");
const InejctWithOptionSymbol = /* @__PURE__ */ makeSymbol("__injectWithOption");
const DisposeSymbol = /* @__PURE__ */ makeSymbol("__dispose");
function handleFlatJson(obj) {
  if (!isObject$1(obj)) {
    return obj;
  }
  if (isMessageAST(obj)) {
    return obj;
  }
  for (const key in obj) {
    if (!hasOwn(obj, key)) {
      continue;
    }
    if (!key.includes(".")) {
      if (isObject$1(obj[key])) {
        handleFlatJson(obj[key]);
      }
    } else {
      const subKeys = key.split(".");
      const lastIndex = subKeys.length - 1;
      let currentObj = obj;
      let hasStringValue = false;
      for (let i = 0; i < lastIndex; i++) {
        if (subKeys[i] === "__proto__") {
          throw new Error(`unsafe key: ${subKeys[i]}`);
        }
        if (!(subKeys[i] in currentObj)) {
          currentObj[subKeys[i]] = create();
        }
        if (!isObject$1(currentObj[subKeys[i]])) {
          hasStringValue = true;
          break;
        }
        currentObj = currentObj[subKeys[i]];
      }
      if (!hasStringValue) {
        if (!isMessageAST(currentObj)) {
          currentObj[subKeys[lastIndex]] = obj[key];
          delete obj[key];
        } else {
          if (!AST_NODE_PROPS_KEYS.includes(subKeys[lastIndex])) {
            delete obj[key];
          }
        }
      }
      if (!isMessageAST(currentObj)) {
        const target = currentObj[subKeys[lastIndex]];
        if (isObject$1(target)) {
          handleFlatJson(target);
        }
      }
    }
  }
  return obj;
}
function getLocaleMessages(locale, options) {
  const { messages, __i18n, messageResolver, flatJson } = options;
  const ret = isPlainObject(messages) ? messages : isArray(__i18n) ? create() : { [locale]: create() };
  if (isArray(__i18n)) {
    __i18n.forEach((custom) => {
      if ("locale" in custom && "resource" in custom) {
        const { locale: locale2, resource } = custom;
        if (locale2) {
          ret[locale2] = ret[locale2] || create();
          deepCopy(resource, ret[locale2]);
        } else {
          deepCopy(resource, ret);
        }
      } else {
        isString$1(custom) && deepCopy(JSON.parse(custom), ret);
      }
    });
  }
  if (messageResolver == null && flatJson) {
    for (const key in ret) {
      if (hasOwn(ret, key)) {
        handleFlatJson(ret[key]);
      }
    }
  }
  return ret;
}
function getComponentOptions(instance) {
  return instance.type;
}
function adjustI18nResources(gl, options, componentOptions) {
  let messages = isObject$1(options.messages) ? options.messages : create();
  if ("__i18nGlobal" in componentOptions) {
    messages = getLocaleMessages(gl.locale.value, {
      messages,
      __i18n: componentOptions.__i18nGlobal
    });
  }
  const locales = Object.keys(messages);
  if (locales.length) {
    locales.forEach((locale) => {
      gl.mergeLocaleMessage(locale, messages[locale]);
    });
  }
  {
    if (isObject$1(options.datetimeFormats)) {
      const locales2 = Object.keys(options.datetimeFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeDateTimeFormat(locale, options.datetimeFormats[locale]);
        });
      }
    }
    if (isObject$1(options.numberFormats)) {
      const locales2 = Object.keys(options.numberFormats);
      if (locales2.length) {
        locales2.forEach((locale) => {
          gl.mergeNumberFormat(locale, options.numberFormats[locale]);
        });
      }
    }
  }
}
function createTextNode(key) {
  return createVNode(Text, null, key, 0);
}
const DEVTOOLS_META = "__INTLIFY_META__";
const NOOP_RETURN_ARRAY = () => [];
const NOOP_RETURN_FALSE = () => false;
let composerID = 0;
function defineCoreMissingHandler(missing) {
  return (ctx, locale, key, type) => {
    return missing(locale, key, getCurrentInstance() || void 0, type);
  };
}
const getMetaInfo = /* @__NO_SIDE_EFFECTS__ */ () => {
  const instance = getCurrentInstance();
  let meta = null;
  return instance && (meta = getComponentOptions(instance)[DEVTOOLS_META]) ? { [DEVTOOLS_META]: meta } : null;
};
function createComposer(options = {}, VueI18nLegacy) {
  const { __root, __injectWithOption } = options;
  const _isGlobal = __root === void 0;
  const flatJson = options.flatJson;
  const _ref = inBrowser ? ref$3 : shallowRef;
  const translateExistCompatible = !!options.translateExistCompatible;
  let _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : true;
  const _locale = _ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.locale.value : isString$1(options.locale) ? options.locale : DEFAULT_LOCALE
  );
  const _fallbackLocale = _ref(
    // prettier-ignore
    __root && _inheritLocale ? __root.fallbackLocale.value : isString$1(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
  );
  const _messages = _ref(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = _ref(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = _ref(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  let _missingWarn = __root ? __root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  let _fallbackWarn = __root ? __root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  let _fallbackRoot = __root ? __root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  let _fallbackFormat = !!options.fallbackFormat;
  let _missing = isFunction(options.missing) ? options.missing : null;
  let _runtimeMissing = isFunction(options.missing) ? defineCoreMissingHandler(options.missing) : null;
  let _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  let _warnHtmlMessage = __root ? __root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  let _escapeParameter = !!options.escapeParameter;
  const _modifiers = __root ? __root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
  let _pluralRules = options.pluralRules || __root && __root.pluralRules;
  let _context;
  const getCoreContext = () => {
    _isGlobal && setFallbackContext(null);
    const ctxOptions = {
      version: VERSION,
      locale: _locale.value,
      fallbackLocale: _fallbackLocale.value,
      messages: _messages.value,
      modifiers: _modifiers,
      pluralRules: _pluralRules,
      missing: _runtimeMissing === null ? void 0 : _runtimeMissing,
      missingWarn: _missingWarn,
      fallbackWarn: _fallbackWarn,
      fallbackFormat: _fallbackFormat,
      unresolving: true,
      postTranslation: _postTranslation === null ? void 0 : _postTranslation,
      warnHtmlMessage: _warnHtmlMessage,
      escapeParameter: _escapeParameter,
      messageResolver: options.messageResolver,
      messageCompiler: options.messageCompiler,
      __meta: { framework: "vue" }
    };
    {
      ctxOptions.datetimeFormats = _datetimeFormats.value;
      ctxOptions.numberFormats = _numberFormats.value;
      ctxOptions.__datetimeFormatters = isPlainObject(_context) ? _context.__datetimeFormatters : void 0;
      ctxOptions.__numberFormatters = isPlainObject(_context) ? _context.__numberFormatters : void 0;
    }
    const ctx = createCoreContext(ctxOptions);
    _isGlobal && setFallbackContext(ctx);
    return ctx;
  };
  _context = getCoreContext();
  updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed$3({
    get: () => _locale.value,
    set: (val) => {
      _locale.value = val;
      _context.locale = _locale.value;
    }
  });
  const fallbackLocale = computed$3({
    get: () => _fallbackLocale.value,
    set: (val) => {
      _fallbackLocale.value = val;
      _context.fallbackLocale = _fallbackLocale.value;
      updateFallbackLocale(_context, _locale.value, val);
    }
  });
  const messages = computed$3(() => _messages.value);
  const datetimeFormats = /* @__PURE__ */ computed$3(() => _datetimeFormats.value);
  const numberFormats = /* @__PURE__ */ computed$3(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return isFunction(_postTranslation) ? _postTranslation : null;
  }
  function setPostTranslationHandler(handler) {
    _postTranslation = handler;
    _context.postTranslation = handler;
  }
  function getMissingHandler() {
    return _missing;
  }
  function setMissingHandler(handler) {
    if (handler !== null) {
      _runtimeMissing = defineCoreMissingHandler(handler);
    }
    _missing = handler;
    _context.missing = _runtimeMissing;
  }
  const wrapWithDeps = (fn, argumentParser, warnType, fallbackSuccess, fallbackFail, successCondition) => {
    trackReactivityValues();
    let ret;
    try {
      if (__INTLIFY_PROD_DEVTOOLS__) {
        /* @__PURE__ */ setAdditionalMeta(/* @__PURE__ */ getMetaInfo());
      }
      if (!_isGlobal) {
        _context.fallbackContext = __root ? getFallbackContext() : void 0;
      }
      ret = fn(_context);
    } finally {
      if (__INTLIFY_PROD_DEVTOOLS__) ;
      if (!_isGlobal) {
        _context.fallbackContext = void 0;
      }
    }
    if (warnType !== "translate exists" && // for not `te` (e.g `t`)
    isNumber(ret) && ret === NOT_REOSLVED || warnType === "translate exists" && !ret) {
      const [key, arg2] = argumentParser();
      return __root && _fallbackRoot ? fallbackSuccess(__root) : fallbackFail(key);
    } else if (successCondition(ret)) {
      return ret;
    } else {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_RETURN_TYPE);
    }
  };
  function t(...args) {
    return wrapWithDeps((context) => Reflect.apply(translate, null, [context, ...args]), () => parseTranslateArgs(...args), "translate", (root) => Reflect.apply(root.t, root, [...args]), (key) => key, (val) => isString$1(val));
  }
  function rt(...args) {
    const [arg1, arg2, arg3] = args;
    if (arg3 && !isObject$1(arg3)) {
      throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
    }
    return t(...[arg1, arg2, assign$1({ resolvedMessage: true }, arg3 || {})]);
  }
  function d(...args) {
    return wrapWithDeps((context) => Reflect.apply(datetime, null, [context, ...args]), () => parseDateTimeArgs(...args), "datetime format", (root) => Reflect.apply(root.d, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString$1(val));
  }
  function n(...args) {
    return wrapWithDeps((context) => Reflect.apply(number, null, [context, ...args]), () => parseNumberArgs(...args), "number format", (root) => Reflect.apply(root.n, root, [...args]), () => MISSING_RESOLVE_VALUE, (val) => isString$1(val));
  }
  function normalize(values) {
    return values.map((val) => isString$1(val) || isNumber(val) || isBoolean(val) ? createTextNode(String(val)) : val);
  }
  const interpolate = (val) => val;
  const processor = {
    normalize,
    interpolate,
    type: "vnode"
  };
  function translateVNode(...args) {
    return wrapWithDeps(
      (context) => {
        let ret;
        const _context2 = context;
        try {
          _context2.processor = processor;
          ret = Reflect.apply(translate, null, [_context2, ...args]);
        } finally {
          _context2.processor = null;
        }
        return ret;
      },
      () => parseTranslateArgs(...args),
      "translate",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root) => root[TranslateVNodeSymbol](...args),
      (key) => [createTextNode(key)],
      (val) => isArray(val)
    );
  }
  function numberParts(...args) {
    return wrapWithDeps(
      (context) => Reflect.apply(number, null, [context, ...args]),
      () => parseNumberArgs(...args),
      "number format",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root) => root[NumberPartsSymbol](...args),
      NOOP_RETURN_ARRAY,
      (val) => isString$1(val) || isArray(val)
    );
  }
  function datetimeParts(...args) {
    return wrapWithDeps(
      (context) => Reflect.apply(datetime, null, [context, ...args]),
      () => parseDateTimeArgs(...args),
      "datetime format",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (root) => root[DatetimePartsSymbol](...args),
      NOOP_RETURN_ARRAY,
      (val) => isString$1(val) || isArray(val)
    );
  }
  function setPluralRules(rules) {
    _pluralRules = rules;
    _context.pluralRules = _pluralRules;
  }
  function te(key, locale2) {
    return wrapWithDeps(() => {
      if (!key) {
        return false;
      }
      const targetLocale = isString$1(locale2) ? locale2 : _locale.value;
      const message = getLocaleMessage(targetLocale);
      const resolved = _context.messageResolver(message, key);
      return !translateExistCompatible ? isMessageAST(resolved) || isMessageFunction(resolved) || isString$1(resolved) : resolved != null;
    }, () => [key], "translate exists", (root) => {
      return Reflect.apply(root.te, root, [key, locale2]);
    }, NOOP_RETURN_FALSE, (val) => isBoolean(val));
  }
  function resolveMessages(key) {
    let messages2 = null;
    const locales = fallbackWithLocaleChain(_context, _fallbackLocale.value, _locale.value);
    for (let i = 0; i < locales.length; i++) {
      const targetLocaleMessages = _messages.value[locales[i]] || {};
      const messageValue = _context.messageResolver(targetLocaleMessages, key);
      if (messageValue != null) {
        messages2 = messageValue;
        break;
      }
    }
    return messages2;
  }
  function tm(key) {
    const messages2 = resolveMessages(key);
    return messages2 != null ? messages2 : __root ? __root.tm(key) || {} : {};
  }
  function getLocaleMessage(locale2) {
    return _messages.value[locale2] || {};
  }
  function setLocaleMessage(locale2, message) {
    if (flatJson) {
      const _message = { [locale2]: message };
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key]);
        }
      }
      message = _message[locale2];
    }
    _messages.value[locale2] = message;
    _context.messages = _messages.value;
  }
  function mergeLocaleMessage(locale2, message) {
    _messages.value[locale2] = _messages.value[locale2] || {};
    const _message = { [locale2]: message };
    if (flatJson) {
      for (const key in _message) {
        if (hasOwn(_message, key)) {
          handleFlatJson(_message[key]);
        }
      }
    }
    message = _message[locale2];
    deepCopy(message, _messages.value[locale2]);
    _context.messages = _messages.value;
  }
  function getDateTimeFormat(locale2) {
    return _datetimeFormats.value[locale2] || {};
  }
  function setDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = format2;
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function mergeDateTimeFormat(locale2, format2) {
    _datetimeFormats.value[locale2] = assign$1(_datetimeFormats.value[locale2] || {}, format2);
    _context.datetimeFormats = _datetimeFormats.value;
    clearDateTimeFormat(_context, locale2, format2);
  }
  function getNumberFormat(locale2) {
    return _numberFormats.value[locale2] || {};
  }
  function setNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = format2;
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  function mergeNumberFormat(locale2, format2) {
    _numberFormats.value[locale2] = assign$1(_numberFormats.value[locale2] || {}, format2);
    _context.numberFormats = _numberFormats.value;
    clearNumberFormat(_context, locale2, format2);
  }
  composerID++;
  if (__root && inBrowser) {
    watch(__root.locale, (val) => {
      if (_inheritLocale) {
        _locale.value = val;
        _context.locale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
    watch(__root.fallbackLocale, (val) => {
      if (_inheritLocale) {
        _fallbackLocale.value = val;
        _context.fallbackLocale = val;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    });
  }
  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale() {
      return _inheritLocale;
    },
    set inheritLocale(val) {
      _inheritLocale = val;
      if (val && __root) {
        _locale.value = __root.locale.value;
        _fallbackLocale.value = __root.fallbackLocale.value;
        updateFallbackLocale(_context, _locale.value, _fallbackLocale.value);
      }
    },
    get availableLocales() {
      return Object.keys(_messages.value).sort();
    },
    messages,
    get modifiers() {
      return _modifiers;
    },
    get pluralRules() {
      return _pluralRules || {};
    },
    get isGlobal() {
      return _isGlobal;
    },
    get missingWarn() {
      return _missingWarn;
    },
    set missingWarn(val) {
      _missingWarn = val;
      _context.missingWarn = _missingWarn;
    },
    get fallbackWarn() {
      return _fallbackWarn;
    },
    set fallbackWarn(val) {
      _fallbackWarn = val;
      _context.fallbackWarn = _fallbackWarn;
    },
    get fallbackRoot() {
      return _fallbackRoot;
    },
    set fallbackRoot(val) {
      _fallbackRoot = val;
    },
    get fallbackFormat() {
      return _fallbackFormat;
    },
    set fallbackFormat(val) {
      _fallbackFormat = val;
      _context.fallbackFormat = _fallbackFormat;
    },
    get warnHtmlMessage() {
      return _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      _warnHtmlMessage = val;
      _context.warnHtmlMessage = val;
    },
    get escapeParameter() {
      return _escapeParameter;
    },
    set escapeParameter(val) {
      _escapeParameter = val;
      _context.escapeParameter = val;
    },
    t,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    [SetPluralRulesSymbol]: setPluralRules
  };
  {
    composer.datetimeFormats = datetimeFormats;
    composer.numberFormats = numberFormats;
    composer.rt = rt;
    composer.te = te;
    composer.tm = tm;
    composer.d = d;
    composer.n = n;
    composer.getDateTimeFormat = getDateTimeFormat;
    composer.setDateTimeFormat = setDateTimeFormat;
    composer.mergeDateTimeFormat = mergeDateTimeFormat;
    composer.getNumberFormat = getNumberFormat;
    composer.setNumberFormat = setNumberFormat;
    composer.mergeNumberFormat = mergeNumberFormat;
    composer[InejctWithOptionSymbol] = __injectWithOption;
    composer[TranslateVNodeSymbol] = translateVNode;
    composer[DatetimePartsSymbol] = datetimeParts;
    composer[NumberPartsSymbol] = numberParts;
  }
  return composer;
}
function convertComposerOptions(options) {
  const locale = isString$1(options.locale) ? options.locale : DEFAULT_LOCALE;
  const fallbackLocale = isString$1(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : locale;
  const missing = isFunction(options.missing) ? options.missing : void 0;
  const missingWarn = isBoolean(options.silentTranslationWarn) || isRegExp(options.silentTranslationWarn) ? !options.silentTranslationWarn : true;
  const fallbackWarn = isBoolean(options.silentFallbackWarn) || isRegExp(options.silentFallbackWarn) ? !options.silentFallbackWarn : true;
  const fallbackRoot = isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  const fallbackFormat = !!options.formatFallbackMessages;
  const modifiers = isPlainObject(options.modifiers) ? options.modifiers : {};
  const pluralizationRules = options.pluralizationRules;
  const postTranslation = isFunction(options.postTranslation) ? options.postTranslation : void 0;
  const warnHtmlMessage = isString$1(options.warnHtmlInMessage) ? options.warnHtmlInMessage !== "off" : true;
  const escapeParameter = !!options.escapeParameterHtml;
  const inheritLocale = isBoolean(options.sync) ? options.sync : true;
  let messages = options.messages;
  if (isPlainObject(options.sharedMessages)) {
    const sharedMessages = options.sharedMessages;
    const locales = Object.keys(sharedMessages);
    messages = locales.reduce((messages2, locale2) => {
      const message = messages2[locale2] || (messages2[locale2] = {});
      assign$1(message, sharedMessages[locale2]);
      return messages2;
    }, messages || {});
  }
  const { __i18n, __root, __injectWithOption } = options;
  const datetimeFormats = options.datetimeFormats;
  const numberFormats = options.numberFormats;
  const flatJson = options.flatJson;
  const translateExistCompatible = options.translateExistCompatible;
  return {
    locale,
    fallbackLocale,
    messages,
    flatJson,
    datetimeFormats,
    numberFormats,
    missing,
    missingWarn,
    fallbackWarn,
    fallbackRoot,
    fallbackFormat,
    modifiers,
    pluralRules: pluralizationRules,
    postTranslation,
    warnHtmlMessage,
    escapeParameter,
    messageResolver: options.messageResolver,
    inheritLocale,
    translateExistCompatible,
    __i18n,
    __root,
    __injectWithOption
  };
}
function createVueI18n(options = {}, VueI18nLegacy) {
  {
    const composer = createComposer(convertComposerOptions(options));
    const { __extender } = options;
    const vueI18n = {
      // id
      id: composer.id,
      // locale
      get locale() {
        return composer.locale.value;
      },
      set locale(val) {
        composer.locale.value = val;
      },
      // fallbackLocale
      get fallbackLocale() {
        return composer.fallbackLocale.value;
      },
      set fallbackLocale(val) {
        composer.fallbackLocale.value = val;
      },
      // messages
      get messages() {
        return composer.messages.value;
      },
      // datetimeFormats
      get datetimeFormats() {
        return composer.datetimeFormats.value;
      },
      // numberFormats
      get numberFormats() {
        return composer.numberFormats.value;
      },
      // availableLocales
      get availableLocales() {
        return composer.availableLocales;
      },
      // formatter
      get formatter() {
        return {
          interpolate() {
            return [];
          }
        };
      },
      set formatter(val) {
      },
      // missing
      get missing() {
        return composer.getMissingHandler();
      },
      set missing(handler) {
        composer.setMissingHandler(handler);
      },
      // silentTranslationWarn
      get silentTranslationWarn() {
        return isBoolean(composer.missingWarn) ? !composer.missingWarn : composer.missingWarn;
      },
      set silentTranslationWarn(val) {
        composer.missingWarn = isBoolean(val) ? !val : val;
      },
      // silentFallbackWarn
      get silentFallbackWarn() {
        return isBoolean(composer.fallbackWarn) ? !composer.fallbackWarn : composer.fallbackWarn;
      },
      set silentFallbackWarn(val) {
        composer.fallbackWarn = isBoolean(val) ? !val : val;
      },
      // modifiers
      get modifiers() {
        return composer.modifiers;
      },
      // formatFallbackMessages
      get formatFallbackMessages() {
        return composer.fallbackFormat;
      },
      set formatFallbackMessages(val) {
        composer.fallbackFormat = val;
      },
      // postTranslation
      get postTranslation() {
        return composer.getPostTranslationHandler();
      },
      set postTranslation(handler) {
        composer.setPostTranslationHandler(handler);
      },
      // sync
      get sync() {
        return composer.inheritLocale;
      },
      set sync(val) {
        composer.inheritLocale = val;
      },
      // warnInHtmlMessage
      get warnHtmlInMessage() {
        return composer.warnHtmlMessage ? "warn" : "off";
      },
      set warnHtmlInMessage(val) {
        composer.warnHtmlMessage = val !== "off";
      },
      // escapeParameterHtml
      get escapeParameterHtml() {
        return composer.escapeParameter;
      },
      set escapeParameterHtml(val) {
        composer.escapeParameter = val;
      },
      // preserveDirectiveContent
      get preserveDirectiveContent() {
        return true;
      },
      set preserveDirectiveContent(val) {
      },
      // pluralizationRules
      get pluralizationRules() {
        return composer.pluralRules || {};
      },
      // for internal
      __composer: composer,
      // t
      t(...args) {
        const [arg1, arg2, arg3] = args;
        const options2 = {};
        let list = null;
        let named = null;
        if (!isString$1(arg1)) {
          throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
        }
        const key = arg1;
        if (isString$1(arg2)) {
          options2.locale = arg2;
        } else if (isArray(arg2)) {
          list = arg2;
        } else if (isPlainObject(arg2)) {
          named = arg2;
        }
        if (isArray(arg3)) {
          list = arg3;
        } else if (isPlainObject(arg3)) {
          named = arg3;
        }
        return Reflect.apply(composer.t, composer, [
          key,
          list || named || {},
          options2
        ]);
      },
      rt(...args) {
        return Reflect.apply(composer.rt, composer, [...args]);
      },
      // tc
      tc(...args) {
        const [arg1, arg2, arg3] = args;
        const options2 = { plural: 1 };
        let list = null;
        let named = null;
        if (!isString$1(arg1)) {
          throw createI18nError(I18nErrorCodes.INVALID_ARGUMENT);
        }
        const key = arg1;
        if (isString$1(arg2)) {
          options2.locale = arg2;
        } else if (isNumber(arg2)) {
          options2.plural = arg2;
        } else if (isArray(arg2)) {
          list = arg2;
        } else if (isPlainObject(arg2)) {
          named = arg2;
        }
        if (isString$1(arg3)) {
          options2.locale = arg3;
        } else if (isArray(arg3)) {
          list = arg3;
        } else if (isPlainObject(arg3)) {
          named = arg3;
        }
        return Reflect.apply(composer.t, composer, [
          key,
          list || named || {},
          options2
        ]);
      },
      // te
      te(key, locale) {
        return composer.te(key, locale);
      },
      // tm
      tm(key) {
        return composer.tm(key);
      },
      // getLocaleMessage
      getLocaleMessage(locale) {
        return composer.getLocaleMessage(locale);
      },
      // setLocaleMessage
      setLocaleMessage(locale, message) {
        composer.setLocaleMessage(locale, message);
      },
      // mergeLocaleMessage
      mergeLocaleMessage(locale, message) {
        composer.mergeLocaleMessage(locale, message);
      },
      // d
      d(...args) {
        return Reflect.apply(composer.d, composer, [...args]);
      },
      // getDateTimeFormat
      getDateTimeFormat(locale) {
        return composer.getDateTimeFormat(locale);
      },
      // setDateTimeFormat
      setDateTimeFormat(locale, format2) {
        composer.setDateTimeFormat(locale, format2);
      },
      // mergeDateTimeFormat
      mergeDateTimeFormat(locale, format2) {
        composer.mergeDateTimeFormat(locale, format2);
      },
      // n
      n(...args) {
        return Reflect.apply(composer.n, composer, [...args]);
      },
      // getNumberFormat
      getNumberFormat(locale) {
        return composer.getNumberFormat(locale);
      },
      // setNumberFormat
      setNumberFormat(locale, format2) {
        composer.setNumberFormat(locale, format2);
      },
      // mergeNumberFormat
      mergeNumberFormat(locale, format2) {
        composer.mergeNumberFormat(locale, format2);
      },
      // getChoiceIndex
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      getChoiceIndex(choice, choicesLength) {
        return -1;
      }
    };
    vueI18n.__extender = __extender;
    return vueI18n;
  }
}
const baseFormatProps = {
  tag: {
    type: [String, Object]
  },
  locale: {
    type: String
  },
  scope: {
    type: String,
    // NOTE: avoid https://github.com/microsoft/rushstack/issues/1050
    validator: (val) => val === "parent" || val === "global",
    default: "parent"
    /* ComponentI18nScope */
  },
  i18n: {
    type: Object
  }
};
function getInterpolateArg({ slots }, keys) {
  if (keys.length === 1 && keys[0] === "default") {
    const ret = slots.default ? slots.default() : [];
    return ret.reduce((slot, current) => {
      return [
        ...slot,
        // prettier-ignore
        ...current.type === Fragment ? current.children : [current]
      ];
    }, []);
  } else {
    return keys.reduce((arg, key) => {
      const slot = slots[key];
      if (slot) {
        arg[key] = slot();
      }
      return arg;
    }, create());
  }
}
function getFragmentableTag(tag) {
  return Fragment;
}
const TranslationImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-t",
  props: assign$1({
    keypath: {
      type: String,
      required: true
    },
    plural: {
      type: [Number, String],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      validator: (val) => isNumber(val) || !isNaN(val)
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const { slots, attrs } = context;
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return () => {
      const keys = Object.keys(slots).filter((key) => key !== "_");
      const options = create();
      if (props.locale) {
        options.locale = props.locale;
      }
      if (props.plural !== void 0) {
        options.plural = isString$1(props.plural) ? +props.plural : props.plural;
      }
      const arg = getInterpolateArg(context, keys);
      const children = i18n[TranslateVNodeSymbol](props.keypath, arg, options);
      const assignedAttrs = assign$1(create(), attrs);
      const tag = isString$1(props.tag) || isObject$1(props.tag) ? props.tag : getFragmentableTag();
      return h(tag, assignedAttrs, children);
    };
  }
});
const Translation = TranslationImpl;
function isVNode(target) {
  return isArray(target) && !isString$1(target[0]);
}
function renderFormatter(props, context, slotKeys, partFormatter) {
  const { slots, attrs } = context;
  return () => {
    const options = { part: true };
    let overrides = create();
    if (props.locale) {
      options.locale = props.locale;
    }
    if (isString$1(props.format)) {
      options.key = props.format;
    } else if (isObject$1(props.format)) {
      if (isString$1(props.format.key)) {
        options.key = props.format.key;
      }
      overrides = Object.keys(props.format).reduce((options2, prop) => {
        return slotKeys.includes(prop) ? assign$1(create(), options2, { [prop]: props.format[prop] }) : options2;
      }, create());
    }
    const parts = partFormatter(...[props.value, options, overrides]);
    let children = [options.key];
    if (isArray(parts)) {
      children = parts.map((part, index) => {
        const slot = slots[part.type];
        const node = slot ? slot({ [part.type]: part.value, index, parts }) : [part.value];
        if (isVNode(node)) {
          node[0].key = `${part.type}-${index}`;
        }
        return node;
      });
    } else if (isString$1(parts)) {
      children = [parts];
    }
    const assignedAttrs = assign$1(create(), attrs);
    const tag = isString$1(props.tag) || isObject$1(props.tag) ? props.tag : getFragmentableTag();
    return h(tag, assignedAttrs, children);
  };
}
const NumberFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-n",
  props: assign$1({
    value: {
      type: Number,
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return renderFormatter(props, context, NUMBER_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n[NumberPartsSymbol](...args)
    ));
  }
});
const NumberFormat = NumberFormatImpl;
const DatetimeFormatImpl = /* @__PURE__ */ defineComponent({
  /* eslint-disable */
  name: "i18n-d",
  props: assign$1({
    value: {
      type: [Number, Date],
      required: true
    },
    format: {
      type: [String, Object]
    }
  }, baseFormatProps),
  /* eslint-enable */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setup(props, context) {
    const i18n = props.i18n || useI18n({
      useScope: props.scope,
      __useComponent: true
    });
    return renderFormatter(props, context, DATETIME_FORMAT_OPTIONS_KEYS, (...args) => (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      i18n[DatetimePartsSymbol](...args)
    ));
  }
});
const DatetimeFormat = DatetimeFormatImpl;
function getComposer$2(i18n, instance) {
  const i18nInternal = i18n;
  if (i18n.mode === "composition") {
    return i18nInternal.__getInstance(instance) || i18n.global;
  } else {
    const vueI18n = i18nInternal.__getInstance(instance);
    return vueI18n != null ? vueI18n.__composer : i18n.global.__composer;
  }
}
function vTDirective(i18n) {
  const _process = (binding) => {
    const { instance, modifiers, value } = binding;
    if (!instance || !instance.$) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const composer = getComposer$2(i18n, instance.$);
    const parsedValue = parseValue(value);
    return [
      Reflect.apply(composer.t, composer, [...makeParams(parsedValue)]),
      composer
    ];
  };
  const register = (el, binding) => {
    const [textContent, composer] = _process(binding);
    if (inBrowser && i18n.global === composer) {
      el.__i18nWatcher = watch(composer.locale, () => {
        binding.instance && binding.instance.$forceUpdate();
      });
    }
    el.__composer = composer;
    el.textContent = textContent;
  };
  const unregister = (el) => {
    if (inBrowser && el.__i18nWatcher) {
      el.__i18nWatcher();
      el.__i18nWatcher = void 0;
      delete el.__i18nWatcher;
    }
    if (el.__composer) {
      el.__composer = void 0;
      delete el.__composer;
    }
  };
  const update = (el, { value }) => {
    if (el.__composer) {
      const composer = el.__composer;
      const parsedValue = parseValue(value);
      el.textContent = Reflect.apply(composer.t, composer, [
        ...makeParams(parsedValue)
      ]);
    }
  };
  const getSSRProps = (binding) => {
    const [textContent] = _process(binding);
    return { textContent };
  };
  return {
    created: register,
    unmounted: unregister,
    beforeUpdate: update,
    getSSRProps
  };
}
function parseValue(value) {
  if (isString$1(value)) {
    return { path: value };
  } else if (isPlainObject(value)) {
    if (!("path" in value)) {
      throw createI18nError(I18nErrorCodes.REQUIRED_VALUE, "path");
    }
    return value;
  } else {
    throw createI18nError(I18nErrorCodes.INVALID_VALUE);
  }
}
function makeParams(value) {
  const { path, locale, args, choice, plural } = value;
  const options = {};
  const named = args || {};
  if (isString$1(locale)) {
    options.locale = locale;
  }
  if (isNumber(choice)) {
    options.plural = choice;
  }
  if (isNumber(plural)) {
    options.plural = plural;
  }
  return [path, named, options];
}
function apply(app, i18n, ...options) {
  const pluginOptions = isPlainObject(options[0]) ? options[0] : {};
  const useI18nComponentName = !!pluginOptions.useI18nComponentName;
  const globalInstall = isBoolean(pluginOptions.globalInstall) ? pluginOptions.globalInstall : true;
  if (globalInstall) {
    [!useI18nComponentName ? Translation.name : "i18n", "I18nT"].forEach((name) => app.component(name, Translation));
    [NumberFormat.name, "I18nN"].forEach((name) => app.component(name, NumberFormat));
    [DatetimeFormat.name, "I18nD"].forEach((name) => app.component(name, DatetimeFormat));
  }
  {
    app.directive("t", vTDirective(i18n));
  }
}
function defineMixin(vuei18n, composer, i18n) {
  return {
    beforeCreate() {
      const instance = getCurrentInstance();
      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
      }
      const options = this.$options;
      if (options.i18n) {
        const optionsI18n = options.i18n;
        if (options.__i18n) {
          optionsI18n.__i18n = options.__i18n;
        }
        optionsI18n.__root = composer;
        if (this === this.$root) {
          this.$i18n = mergeToGlobal(vuei18n, optionsI18n);
        } else {
          optionsI18n.__injectWithOption = true;
          optionsI18n.__extender = i18n.__vueI18nExtend;
          this.$i18n = createVueI18n(optionsI18n);
          const _vueI18n = this.$i18n;
          if (_vueI18n.__extender) {
            _vueI18n.__disposer = _vueI18n.__extender(this.$i18n);
          }
        }
      } else if (options.__i18n) {
        if (this === this.$root) {
          this.$i18n = mergeToGlobal(vuei18n, options);
        } else {
          this.$i18n = createVueI18n({
            __i18n: options.__i18n,
            __injectWithOption: true,
            __extender: i18n.__vueI18nExtend,
            __root: composer
          });
          const _vueI18n = this.$i18n;
          if (_vueI18n.__extender) {
            _vueI18n.__disposer = _vueI18n.__extender(this.$i18n);
          }
        }
      } else {
        this.$i18n = vuei18n;
      }
      if (options.__i18nGlobal) {
        adjustI18nResources(composer, options, options);
      }
      this.$t = (...args) => this.$i18n.t(...args);
      this.$rt = (...args) => this.$i18n.rt(...args);
      this.$tc = (...args) => this.$i18n.tc(...args);
      this.$te = (key, locale) => this.$i18n.te(key, locale);
      this.$d = (...args) => this.$i18n.d(...args);
      this.$n = (...args) => this.$i18n.n(...args);
      this.$tm = (key) => this.$i18n.tm(key);
      i18n.__setInstance(instance, this.$i18n);
    },
    mounted() {
    },
    unmounted() {
      const instance = getCurrentInstance();
      if (!instance) {
        throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
      }
      const _vueI18n = this.$i18n;
      delete this.$t;
      delete this.$rt;
      delete this.$tc;
      delete this.$te;
      delete this.$d;
      delete this.$n;
      delete this.$tm;
      if (_vueI18n.__disposer) {
        _vueI18n.__disposer();
        delete _vueI18n.__disposer;
        delete _vueI18n.__extender;
      }
      i18n.__deleteInstance(instance);
      delete this.$i18n;
    }
  };
}
function mergeToGlobal(g, options) {
  g.locale = options.locale || g.locale;
  g.fallbackLocale = options.fallbackLocale || g.fallbackLocale;
  g.missing = options.missing || g.missing;
  g.silentTranslationWarn = options.silentTranslationWarn || g.silentFallbackWarn;
  g.silentFallbackWarn = options.silentFallbackWarn || g.silentFallbackWarn;
  g.formatFallbackMessages = options.formatFallbackMessages || g.formatFallbackMessages;
  g.postTranslation = options.postTranslation || g.postTranslation;
  g.warnHtmlInMessage = options.warnHtmlInMessage || g.warnHtmlInMessage;
  g.escapeParameterHtml = options.escapeParameterHtml || g.escapeParameterHtml;
  g.sync = options.sync || g.sync;
  g.__composer[SetPluralRulesSymbol](options.pluralizationRules || g.pluralizationRules);
  const messages = getLocaleMessages(g.locale, {
    messages: options.messages,
    __i18n: options.__i18n
  });
  Object.keys(messages).forEach((locale) => g.mergeLocaleMessage(locale, messages[locale]));
  if (options.datetimeFormats) {
    Object.keys(options.datetimeFormats).forEach((locale) => g.mergeDateTimeFormat(locale, options.datetimeFormats[locale]));
  }
  if (options.numberFormats) {
    Object.keys(options.numberFormats).forEach((locale) => g.mergeNumberFormat(locale, options.numberFormats[locale]));
  }
  return g;
}
const I18nInjectionKey = /* @__PURE__ */ makeSymbol("global-vue-i18n");
function createI18n(options = {}, VueI18nLegacy) {
  const __legacyMode = __VUE_I18N_LEGACY_API__ && isBoolean(options.legacy) ? options.legacy : __VUE_I18N_LEGACY_API__;
  const __globalInjection = isBoolean(options.globalInjection) ? options.globalInjection : true;
  const __allowComposition = __VUE_I18N_LEGACY_API__ && __legacyMode ? !!options.allowComposition : true;
  const __instances = /* @__PURE__ */ new Map();
  const [globalScope, __global] = createGlobal(options, __legacyMode);
  const symbol = /* @__PURE__ */ makeSymbol("");
  function __getInstance(component) {
    return __instances.get(component) || null;
  }
  function __setInstance(component, instance) {
    __instances.set(component, instance);
  }
  function __deleteInstance(component) {
    __instances.delete(component);
  }
  {
    const i18n = {
      // mode
      get mode() {
        return __VUE_I18N_LEGACY_API__ && __legacyMode ? "legacy" : "composition";
      },
      // allowComposition
      get allowComposition() {
        return __allowComposition;
      },
      // install plugin
      async install(app, ...options2) {
        app.__VUE_I18N_SYMBOL__ = symbol;
        app.provide(app.__VUE_I18N_SYMBOL__, i18n);
        if (isPlainObject(options2[0])) {
          const opts = options2[0];
          i18n.__composerExtend = opts.__composerExtend;
          i18n.__vueI18nExtend = opts.__vueI18nExtend;
        }
        let globalReleaseHandler = null;
        if (!__legacyMode && __globalInjection) {
          globalReleaseHandler = injectGlobalFields(app, i18n.global);
        }
        if (__VUE_I18N_FULL_INSTALL__) {
          apply(app, i18n, ...options2);
        }
        if (__VUE_I18N_LEGACY_API__ && __legacyMode) {
          app.mixin(defineMixin(__global, __global.__composer, i18n));
        }
        const unmountApp = app.unmount;
        app.unmount = () => {
          globalReleaseHandler && globalReleaseHandler();
          i18n.dispose();
          unmountApp();
        };
      },
      // global accessor
      get global() {
        return __global;
      },
      dispose() {
        globalScope.stop();
      },
      // @internal
      __instances,
      // @internal
      __getInstance,
      // @internal
      __setInstance,
      // @internal
      __deleteInstance
    };
    return i18n;
  }
}
function useI18n(options = {}) {
  const instance = getCurrentInstance();
  if (instance == null) {
    throw createI18nError(I18nErrorCodes.MUST_BE_CALL_SETUP_TOP);
  }
  if (!instance.isCE && instance.appContext.app != null && !instance.appContext.app.__VUE_I18N_SYMBOL__) {
    throw createI18nError(I18nErrorCodes.NOT_INSTALLED);
  }
  const i18n = getI18nInstance(instance);
  const gl = getGlobalComposer(i18n);
  const componentOptions = getComponentOptions(instance);
  const scope = getScope(options, componentOptions);
  if (__VUE_I18N_LEGACY_API__) {
    if (i18n.mode === "legacy" && !options.__useComponent) {
      if (!i18n.allowComposition) {
        throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_IN_LEGACY_MODE);
      }
      return useI18nForLegacy(instance, scope, gl, options);
    }
  }
  if (scope === "global") {
    adjustI18nResources(gl, options, componentOptions);
    return gl;
  }
  if (scope === "parent") {
    let composer2 = getComposer(i18n, instance, options.__useComponent);
    if (composer2 == null) {
      composer2 = gl;
    }
    return composer2;
  }
  const i18nInternal = i18n;
  let composer = i18nInternal.__getInstance(instance);
  if (composer == null) {
    const composerOptions = assign$1({}, options);
    if ("__i18n" in componentOptions) {
      composerOptions.__i18n = componentOptions.__i18n;
    }
    if (gl) {
      composerOptions.__root = gl;
    }
    composer = createComposer(composerOptions);
    if (i18nInternal.__composerExtend) {
      composer[DisposeSymbol] = i18nInternal.__composerExtend(composer);
    }
    setupLifeCycle(i18nInternal, instance, composer);
    i18nInternal.__setInstance(instance, composer);
  }
  return composer;
}
function createGlobal(options, legacyMode, VueI18nLegacy) {
  const scope = effectScope();
  {
    const obj = __VUE_I18N_LEGACY_API__ && legacyMode ? scope.run(() => createVueI18n(options)) : scope.run(() => createComposer(options));
    if (obj == null) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    return [scope, obj];
  }
}
function getI18nInstance(instance) {
  {
    const i18n = inject(!instance.isCE ? instance.appContext.app.__VUE_I18N_SYMBOL__ : I18nInjectionKey);
    if (!i18n) {
      throw createI18nError(!instance.isCE ? I18nErrorCodes.UNEXPECTED_ERROR : I18nErrorCodes.NOT_INSTALLED_WITH_PROVIDE);
    }
    return i18n;
  }
}
function getScope(options, componentOptions) {
  return isEmptyObject(options) ? "__i18n" in componentOptions ? "local" : "global" : !options.useScope ? "local" : options.useScope;
}
function getGlobalComposer(i18n) {
  return i18n.mode === "composition" ? i18n.global : i18n.global.__composer;
}
function getComposer(i18n, target, useComponent = false) {
  let composer = null;
  const root = target.root;
  let current = getParentComponentInstance(target, useComponent);
  while (current != null) {
    const i18nInternal = i18n;
    if (i18n.mode === "composition") {
      composer = i18nInternal.__getInstance(current);
    } else {
      if (__VUE_I18N_LEGACY_API__) {
        const vueI18n = i18nInternal.__getInstance(current);
        if (vueI18n != null) {
          composer = vueI18n.__composer;
          if (useComponent && composer && !composer[InejctWithOptionSymbol]) {
            composer = null;
          }
        }
      }
    }
    if (composer != null) {
      break;
    }
    if (root === current) {
      break;
    }
    current = current.parent;
  }
  return composer;
}
function getParentComponentInstance(target, useComponent = false) {
  if (target == null) {
    return null;
  }
  {
    return !useComponent ? target.parent : target.vnode.ctx || target.parent;
  }
}
function setupLifeCycle(i18n, target, composer) {
  {
    onMounted(() => {
    }, target);
    onUnmounted(() => {
      const _composer = composer;
      i18n.__deleteInstance(target);
      const dispose = _composer[DisposeSymbol];
      if (dispose) {
        dispose();
        delete _composer[DisposeSymbol];
      }
    }, target);
  }
}
function useI18nForLegacy(instance, scope, root, options = {}) {
  const isLocalScope = scope === "local";
  const _composer = shallowRef(null);
  if (isLocalScope && instance.proxy && !(instance.proxy.$options.i18n || instance.proxy.$options.__i18n)) {
    throw createI18nError(I18nErrorCodes.MUST_DEFINE_I18N_OPTION_IN_ALLOW_COMPOSITION);
  }
  const _inheritLocale = isBoolean(options.inheritLocale) ? options.inheritLocale : !isString$1(options.locale);
  const _locale = ref$3(
    // prettier-ignore
    !isLocalScope || _inheritLocale ? root.locale.value : isString$1(options.locale) ? options.locale : DEFAULT_LOCALE
  );
  const _fallbackLocale = ref$3(
    // prettier-ignore
    !isLocalScope || _inheritLocale ? root.fallbackLocale.value : isString$1(options.fallbackLocale) || isArray(options.fallbackLocale) || isPlainObject(options.fallbackLocale) || options.fallbackLocale === false ? options.fallbackLocale : _locale.value
  );
  const _messages = ref$3(getLocaleMessages(_locale.value, options));
  const _datetimeFormats = ref$3(isPlainObject(options.datetimeFormats) ? options.datetimeFormats : { [_locale.value]: {} });
  const _numberFormats = ref$3(isPlainObject(options.numberFormats) ? options.numberFormats : { [_locale.value]: {} });
  const _missingWarn = isLocalScope ? root.missingWarn : isBoolean(options.missingWarn) || isRegExp(options.missingWarn) ? options.missingWarn : true;
  const _fallbackWarn = isLocalScope ? root.fallbackWarn : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn) ? options.fallbackWarn : true;
  const _fallbackRoot = isLocalScope ? root.fallbackRoot : isBoolean(options.fallbackRoot) ? options.fallbackRoot : true;
  const _fallbackFormat = !!options.fallbackFormat;
  const _missing = isFunction(options.missing) ? options.missing : null;
  const _postTranslation = isFunction(options.postTranslation) ? options.postTranslation : null;
  const _warnHtmlMessage = isLocalScope ? root.warnHtmlMessage : isBoolean(options.warnHtmlMessage) ? options.warnHtmlMessage : true;
  const _escapeParameter = !!options.escapeParameter;
  const _modifiers = isLocalScope ? root.modifiers : isPlainObject(options.modifiers) ? options.modifiers : {};
  const _pluralRules = options.pluralRules || isLocalScope && root.pluralRules;
  function trackReactivityValues() {
    return [
      _locale.value,
      _fallbackLocale.value,
      _messages.value,
      _datetimeFormats.value,
      _numberFormats.value
    ];
  }
  const locale = computed$3({
    get: () => {
      return _composer.value ? _composer.value.locale.value : _locale.value;
    },
    set: (val) => {
      if (_composer.value) {
        _composer.value.locale.value = val;
      }
      _locale.value = val;
    }
  });
  const fallbackLocale = computed$3({
    get: () => {
      return _composer.value ? _composer.value.fallbackLocale.value : _fallbackLocale.value;
    },
    set: (val) => {
      if (_composer.value) {
        _composer.value.fallbackLocale.value = val;
      }
      _fallbackLocale.value = val;
    }
  });
  const messages = computed$3(() => {
    if (_composer.value) {
      return _composer.value.messages.value;
    } else {
      return _messages.value;
    }
  });
  const datetimeFormats = computed$3(() => _datetimeFormats.value);
  const numberFormats = computed$3(() => _numberFormats.value);
  function getPostTranslationHandler() {
    return _composer.value ? _composer.value.getPostTranslationHandler() : _postTranslation;
  }
  function setPostTranslationHandler(handler) {
    if (_composer.value) {
      _composer.value.setPostTranslationHandler(handler);
    }
  }
  function getMissingHandler() {
    return _composer.value ? _composer.value.getMissingHandler() : _missing;
  }
  function setMissingHandler(handler) {
    if (_composer.value) {
      _composer.value.setMissingHandler(handler);
    }
  }
  function warpWithDeps(fn) {
    trackReactivityValues();
    return fn();
  }
  function t(...args) {
    return _composer.value ? warpWithDeps(() => Reflect.apply(_composer.value.t, null, [...args])) : warpWithDeps(() => "");
  }
  function rt(...args) {
    return _composer.value ? Reflect.apply(_composer.value.rt, null, [...args]) : "";
  }
  function d(...args) {
    return _composer.value ? warpWithDeps(() => Reflect.apply(_composer.value.d, null, [...args])) : warpWithDeps(() => "");
  }
  function n(...args) {
    return _composer.value ? warpWithDeps(() => Reflect.apply(_composer.value.n, null, [...args])) : warpWithDeps(() => "");
  }
  function tm(key) {
    return _composer.value ? _composer.value.tm(key) : {};
  }
  function te(key, locale2) {
    return _composer.value ? _composer.value.te(key, locale2) : false;
  }
  function getLocaleMessage(locale2) {
    return _composer.value ? _composer.value.getLocaleMessage(locale2) : {};
  }
  function setLocaleMessage(locale2, message) {
    if (_composer.value) {
      _composer.value.setLocaleMessage(locale2, message);
      _messages.value[locale2] = message;
    }
  }
  function mergeLocaleMessage(locale2, message) {
    if (_composer.value) {
      _composer.value.mergeLocaleMessage(locale2, message);
    }
  }
  function getDateTimeFormat(locale2) {
    return _composer.value ? _composer.value.getDateTimeFormat(locale2) : {};
  }
  function setDateTimeFormat(locale2, format2) {
    if (_composer.value) {
      _composer.value.setDateTimeFormat(locale2, format2);
      _datetimeFormats.value[locale2] = format2;
    }
  }
  function mergeDateTimeFormat(locale2, format2) {
    if (_composer.value) {
      _composer.value.mergeDateTimeFormat(locale2, format2);
    }
  }
  function getNumberFormat(locale2) {
    return _composer.value ? _composer.value.getNumberFormat(locale2) : {};
  }
  function setNumberFormat(locale2, format2) {
    if (_composer.value) {
      _composer.value.setNumberFormat(locale2, format2);
      _numberFormats.value[locale2] = format2;
    }
  }
  function mergeNumberFormat(locale2, format2) {
    if (_composer.value) {
      _composer.value.mergeNumberFormat(locale2, format2);
    }
  }
  const wrapper = {
    get id() {
      return _composer.value ? _composer.value.id : -1;
    },
    locale,
    fallbackLocale,
    messages,
    datetimeFormats,
    numberFormats,
    get inheritLocale() {
      return _composer.value ? _composer.value.inheritLocale : _inheritLocale;
    },
    set inheritLocale(val) {
      if (_composer.value) {
        _composer.value.inheritLocale = val;
      }
    },
    get availableLocales() {
      return _composer.value ? _composer.value.availableLocales : Object.keys(_messages.value);
    },
    get modifiers() {
      return _composer.value ? _composer.value.modifiers : _modifiers;
    },
    get pluralRules() {
      return _composer.value ? _composer.value.pluralRules : _pluralRules;
    },
    get isGlobal() {
      return _composer.value ? _composer.value.isGlobal : false;
    },
    get missingWarn() {
      return _composer.value ? _composer.value.missingWarn : _missingWarn;
    },
    set missingWarn(val) {
      if (_composer.value) {
        _composer.value.missingWarn = val;
      }
    },
    get fallbackWarn() {
      return _composer.value ? _composer.value.fallbackWarn : _fallbackWarn;
    },
    set fallbackWarn(val) {
      if (_composer.value) {
        _composer.value.missingWarn = val;
      }
    },
    get fallbackRoot() {
      return _composer.value ? _composer.value.fallbackRoot : _fallbackRoot;
    },
    set fallbackRoot(val) {
      if (_composer.value) {
        _composer.value.fallbackRoot = val;
      }
    },
    get fallbackFormat() {
      return _composer.value ? _composer.value.fallbackFormat : _fallbackFormat;
    },
    set fallbackFormat(val) {
      if (_composer.value) {
        _composer.value.fallbackFormat = val;
      }
    },
    get warnHtmlMessage() {
      return _composer.value ? _composer.value.warnHtmlMessage : _warnHtmlMessage;
    },
    set warnHtmlMessage(val) {
      if (_composer.value) {
        _composer.value.warnHtmlMessage = val;
      }
    },
    get escapeParameter() {
      return _composer.value ? _composer.value.escapeParameter : _escapeParameter;
    },
    set escapeParameter(val) {
      if (_composer.value) {
        _composer.value.escapeParameter = val;
      }
    },
    t,
    getPostTranslationHandler,
    setPostTranslationHandler,
    getMissingHandler,
    setMissingHandler,
    rt,
    d,
    n,
    tm,
    te,
    getLocaleMessage,
    setLocaleMessage,
    mergeLocaleMessage,
    getDateTimeFormat,
    setDateTimeFormat,
    mergeDateTimeFormat,
    getNumberFormat,
    setNumberFormat,
    mergeNumberFormat
  };
  function sync(composer) {
    composer.locale.value = _locale.value;
    composer.fallbackLocale.value = _fallbackLocale.value;
    Object.keys(_messages.value).forEach((locale2) => {
      composer.mergeLocaleMessage(locale2, _messages.value[locale2]);
    });
    Object.keys(_datetimeFormats.value).forEach((locale2) => {
      composer.mergeDateTimeFormat(locale2, _datetimeFormats.value[locale2]);
    });
    Object.keys(_numberFormats.value).forEach((locale2) => {
      composer.mergeNumberFormat(locale2, _numberFormats.value[locale2]);
    });
    composer.escapeParameter = _escapeParameter;
    composer.fallbackFormat = _fallbackFormat;
    composer.fallbackRoot = _fallbackRoot;
    composer.fallbackWarn = _fallbackWarn;
    composer.missingWarn = _missingWarn;
    composer.warnHtmlMessage = _warnHtmlMessage;
  }
  onBeforeMount(() => {
    if (instance.proxy == null || instance.proxy.$i18n == null) {
      throw createI18nError(I18nErrorCodes.NOT_AVAILABLE_COMPOSITION_IN_LEGACY);
    }
    const composer = _composer.value = instance.proxy.$i18n.__composer;
    if (scope === "global") {
      _locale.value = composer.locale.value;
      _fallbackLocale.value = composer.fallbackLocale.value;
      _messages.value = composer.messages.value;
      _datetimeFormats.value = composer.datetimeFormats.value;
      _numberFormats.value = composer.numberFormats.value;
    } else if (isLocalScope) {
      sync(composer);
    }
  });
  return wrapper;
}
const globalExportProps = [
  "locale",
  "fallbackLocale",
  "availableLocales"
];
const globalExportMethods = ["t", "rt", "d", "n", "tm", "te"];
function injectGlobalFields(app, composer) {
  const i18n = /* @__PURE__ */ Object.create(null);
  globalExportProps.forEach((prop) => {
    const desc = Object.getOwnPropertyDescriptor(composer, prop);
    if (!desc) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    const wrap = isRef(desc.value) ? {
      get() {
        return desc.value.value;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set(val) {
        desc.value.value = val;
      }
    } : {
      get() {
        return desc.get && desc.get();
      }
    };
    Object.defineProperty(i18n, prop, wrap);
  });
  app.config.globalProperties.$i18n = i18n;
  globalExportMethods.forEach((method) => {
    const desc = Object.getOwnPropertyDescriptor(composer, method);
    if (!desc || !desc.value) {
      throw createI18nError(I18nErrorCodes.UNEXPECTED_ERROR);
    }
    Object.defineProperty(app.config.globalProperties, `$${method}`, desc);
  });
  const dispose = () => {
    delete app.config.globalProperties.$i18n;
    globalExportMethods.forEach((method) => {
      delete app.config.globalProperties[`$${method}`];
    });
  };
  return dispose;
}
{
  initFeatureFlags();
}
if (__INTLIFY_JIT_COMPILATION__) {
  registerMessageCompiler(compile);
} else {
  registerMessageCompiler(compileToFunction);
}
registerMessageResolver(resolveValue);
registerLocaleFallbacker(fallbackWithLocaleChain);
if (__INTLIFY_PROD_DEVTOOLS__) {
  const target = getGlobalThis();
  target.__INTLIFY__ = true;
  setDevToolsHook(target.__INTLIFY_DEVTOOLS_GLOBAL_HOOK__);
}
const getInitialLocale = () => {
  if (typeof window !== "undefined") {
    const savedLanguage = localStorage.getItem("language");
    if (savedLanguage && (savedLanguage === "ko" || savedLanguage === "en")) {
      return savedLanguage;
    }
  }
  return "ko";
};
const i18nInstance = createI18n({
  legacy: false,
  locale: getInitialLocale(),
  messages: {
    en: {
      welcome: "Welcome",
      ...commonLocale.en,
      ...menuLocale.en,
      ...formLocale.en,
      ...pagesLocale.en,
      ...alertLocale.en,
      ...rulesLocale.en
    },
    ko: {
      welcome: "웰컴",
      ...commonLocale.ko,
      ...menuLocale.ko,
      ...formLocale.ko,
      ...pagesLocale.ko,
      ...alertLocale.ko,
      ...rulesLocale.ko
    }
  }
});
const Message = () => {
  const messageStore = useMessageStore();
  function info(msg) {
    messageStore.SetMessageOption({ contents: i18nInstance.global.t(msg), color: "info" });
    messageStore.SetShowMessage(true);
  }
  function show(msg, color = "grey darken-1") {
    messageStore.SetMessageOption({ contents: i18nInstance.global.t(msg), color });
    messageStore.SetShowMessage(true);
  }
  function success(msg) {
    messageStore.SetMessageOption({ contents: i18nInstance.global.t(msg), color: "success" });
    messageStore.SetShowMessage(true);
  }
  function warn2(msg) {
    messageStore.SetMessageOption({ contents: i18nInstance.global.t(msg), color: "warning" });
    messageStore.SetShowMessage(true);
  }
  function err(msg) {
    messageStore.SetMessageOption({ contents: i18nInstance.global.t(msg), color: "error" });
    messageStore.SetShowMessage(true);
  }
  return { info, show, success, warn: warn2, err };
};
const { defineStore: defineStore$2 } = await importShared("pinia");
const { computed: computed$2, ref: ref$2 } = await importShared("vue");
const useNotificationStore = defineStore$2("notification", () => {
  const notificationValue = ref$2({
    isOpen: false,
    title: "Notification",
    message: "",
    confirm: () => {
      notificationValue.value.isOpen = false;
    },
    cancel: () => {
      notificationValue.value.isOpen = false;
    }
  });
  const notification = computed$2(() => notificationValue.value);
  function updateNotification(updateValue) {
    if (notificationValue.value.isOpen !== updateValue.isOpen) notificationValue.value = { ...notificationValue.value, ...updateValue };
  }
  return { notification, updateNotification };
});
const { defineStore: defineStore$1 } = await importShared("pinia");
const { computed: computed$1, ref: ref$1 } = await importShared("vue");
const useProfileDialogStore = defineStore$1("profileDialog", () => {
  const profileDialogValue = ref$1({
    isOpen: false,
    close: () => {
      profileDialogValue.value.isOpen = false;
    }
  });
  const profileDialog = computed$1(() => profileDialogValue.value);
  function updateProfileDialog(updateValue) {
    profileDialogValue.value = { ...profileDialogValue.value, ...updateValue };
  }
  return { profileDialog, updateProfileDialog };
});
const { ref, computed } = await importShared("vue");
const { defineStore } = await importShared("pinia");
const { useRouter } = await importShared("vue-router");
const dayjs = await importShared("dayjs");
const useAuthStore = defineStore("auth", () => {
  const router = useRouter();
  const menuStore = useMenuStore();
  const userSessionInfo = computed(() => userInfoValue.value);
  const roleInfoValue = computed(() => roleMenus);
  const accessToken = ref(null);
  const securityMessage = ref("");
  const platformStore = usePlatformStore();
  const platform = computed(() => platformStore.platform);
  const notificationStore = useNotificationStore();
  const profileDialogStore = useProfileDialogStore();
  const userInfoValue = ref(null);
  const roleMenus = ref();
  async function login(userId, password) {
    return new Promise(async (resolve, reject) => {
      await axiosInstance("/krakend/api/login", {
        method: "post",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        data: {
          client_id: "service-framework",
          grant_type: "password",
          username: userId,
          password
        }
      }).then(async (response) => {
        var _a;
        (_a = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a.setItem("status_check", "LOGIN");
        await setAccessToken(response.data.access_token);
        setRefreshToken(response.data.refresh_token);
        await getUserSessionInfo();
        await setPlatform(platform.value);
        router.push("/home");
      }).catch((err) => {
        reject(err);
      });
    });
  }
  async function logout(refreshToken) {
    if (refreshToken === null) {
      Message().err("Refresh token not found.");
      return;
    }
    axiosInstance("/krakend/api/logout", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        client_id: "service-framework",
        refresh_token: refreshToken
      }
    }).then(() => {
      sessionLogout();
      window.location.replace(window.location.href);
    });
  }
  async function tokenRefresh(refreshToken) {
    await axiosInstance("/krakend/api/refresh-token", {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      data: {
        client_id: "service-framework",
        grant_type: "refresh_token",
        refresh_token: refreshToken
      }
    }).then((response) => {
      setAccessToken(response.data.access_token);
      setRefreshToken(response.data.refresh_token);
      getUserSessionInfo();
    }).catch(() => {
      sessionLogout();
      window.location.replace(window.location.href);
      Message().err("alert.401.Unauthorized");
    });
  }
  async function getUserSessionInfo() {
    try {
      return new Promise(async (resolve) => {
        await axiosInstance("/krakend/svcfw/api/authn/session").then(async (response) => {
          var _a;
          if (response.data) {
            const { userId, roleId, roleName, roleType, companyId, companyName, passwordChangedDate, expiryDate, status } = response.data.sessionInfo;
            const statusCheck = (_a = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a.getItem("status_check");
            const expiredTime = dayjs(passwordChangedDate).add(expiryDate * 864e5);
            const nowTime = dayjs(/* @__PURE__ */ new Date());
            const remainingTime = expiryDate === -1 ? 99 : expiredTime.diff(nowTime, "days");
            if (remainingTime <= 0) {
              notificationStore.updateNotification({
                isOpen: true,
                message: "Your password has expired. Please reset your password.",
                confirm: () => {
                  var _a2;
                  (_a2 = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a2.setItem("status_check", "EXPIRED");
                  notificationStore.updateNotification({ isOpen: false });
                  profileDialogStore.updateProfileDialog({ isOpen: true });
                },
                cancel: () => {
                  notificationStore.updateNotification({ isOpen: false });
                  sessionLogout();
                  window.location.reload();
                }
              });
            } else if (remainingTime <= 14) {
              notificationStore.updateNotification({
                isOpen: true,
                message: "Your password is nearing expiration. Please reset your password.",
                confirm: () => {
                  notificationStore.updateNotification({ isOpen: false });
                  profileDialogStore.updateProfileDialog({ isOpen: true });
                }
              });
            } else if ((status === "CREATE" || status === "RESET") && statusCheck === "LOGIN") {
              notificationStore.updateNotification({
                isOpen: true,
                message: "You are logged in with your temporary password! Temporary passwords are less secure. You need to reset your password.",
                confirm: () => {
                  var _a2;
                  (_a2 = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a2.removeItem("status_check");
                  notificationStore.updateNotification({ isOpen: false });
                  profileDialogStore.updateProfileDialog({ isOpen: true });
                },
                cancel: () => {
                  var _a2;
                  (_a2 = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a2.removeItem("status_check");
                  notificationStore.updateNotification({ isOpen: false });
                }
              });
            }
            roleMenus.value = response.data.roleMenus.map((roleMenu) => {
              const { url } = roleMenu.menu;
              const permission = [];
              if (roleMenu.aclc === "Y") {
                permission.push("create");
              }
              if (roleMenu.acld === "Y") {
                permission.push("delete");
              }
              if (roleMenu.aclr === "Y") {
                permission.push("read");
              }
              if (roleMenu.aclu === "Y") {
                permission.push("update");
              }
              return { menuId: roleMenu.menuId, permission, url, roleId };
            });
            userInfoValue.value = { userId, roleName, roleType, companyName, passwordChangedDate, expiryDate, status };
            setUserInfo({ userId, roleId, roleName, companyId, companyName });
            await menuStore.setMenuList(response.data.roleMenus);
            resolve(true);
          }
        });
      });
    } catch (err) {
      return err;
    }
  }
  return { login, logout, tokenRefresh, getUserSessionInfo, userSessionInfo, roleInfoValue, accessToken, securityMessage };
});
const axios = await importShared("axios");
let isRefreshing = false;
let failedQueue = [];
const processQueue = (error, token = "") => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};
const axiosInstance = axios.create({
  headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-cache, no-store, must-revalidate"
  },
  withCredentials: true,
  timeout: 6e4
});
axiosInstance.interceptors.request.use(
  function(config) {
    const LoadingStore = useLoadingStore();
    if (config.useLoading) {
      LoadingStore.addLoadingCount();
    }
    if (LoadingStore.getLoadingCount() === 1) {
      LoadingStore.setLoading(true);
    }
    config.headers = {
      "X-APIVERSION": "1.0.0",
      "X-APPID": "svcfw",
      ...config.headers
    };
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers = {
        "Authorization": `bearer ${accessToken}`,
        ...config.headers
      };
    }
    if (config.params) {
      convertGetParam(config.params, config.url);
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);
axiosInstance.interceptors.response.use(
  function(response) {
    const LoadingStore = useLoadingStore();
    LoadingStore.reduceLoadingCount();
    if (LoadingStore.getLoading() && LoadingStore.getLoadingCount() === 0) {
      LoadingStore.setLoading(false);
    }
    return response;
  },
  async function(error) {
    const LoadingStore = useLoadingStore();
    const authStore = useAuthStore();
    if (LoadingStore.getLoading()) {
      LoadingStore.setLoading(false);
    }
    const originalRequest = error.config;
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    if (error.response && error.response.status === 401 && !originalRequest.url.includes("login")) {
      if (originalRequest._retry) {
        return Promise.reject(error);
      }
      originalRequest._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers["Authorization"] = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        }).catch((err) => {
          return Promise.reject(err);
        });
      }
      isRefreshing = true;
      try {
        await authStore.tokenRefresh(`${getRefreshToken()}`);
        processQueue(null, `${getAccessToken()}`);
        isRefreshing = false;
        originalRequest.headers["Authorization"] = `Bearer ${getAccessToken()}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        isRefreshing = false;
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
const convertGetParam = (params, url) => {
  params.pageNumber = params.pageNumber ? params.pageNumber - 1 : 0;
  if (params && params.searchKey && params.searchText) {
    params[params.searchKey] = params.searchText;
  }
  delete params.searchKey;
  if (!url.includes("sysm/log/audit")) delete params.searchText;
};
export {
  Message as M,
  useProfileDialogStore as a,
  useAuthStore as b,
  getLogoutTime as c,
  useI18n as d,
  axiosInstance as default,
  useMenuStore as e,
  usePlatformStore as f,
  getRefreshToken as g,
  setCommonIntervalTime as h,
  getAccessToken as i,
  i18nInstance as j,
  useMessageStore as k,
  sessionLogout as l,
  useLoadingStore as m,
  getCommonIntervalTime as n,
  setLogoutTime as s,
  useNotificationStore as u
};
