<template>
  <BaseAutocomplete
    v-if="useShipType"
    :model-value="selectedResult.shipType"
    return-object
    single-line
    hide-details="auto"
    menu-icon="mdi-chevron-down"
    variant="outlined"
    density="comfortable"
    :style="{ 'min-width': minWidth + 'px', flex: 1 }"
    :items="selectItems.shipType"
    :placeholder="$t('common.select.shipType')"
    :clearable="clearable"
    @click:clear="clickClear('shipType')"
    @update:model-value="
      (v: any) => {
        selectedResult.shipType = v;
        // 하위 선택박스 초기화
        initShip();
        if (props.useShip) {
          searchShip();
        }
      }
    "
  />
  <BaseAutocomplete
    v-if="useShip"
    :model-value="selectedResult.ship"
    return-object
    single-line
    hide-details="auto"
    menu-icon="mdi-chevron-down"
    variant="outlined"
    density="comfortable"
    :style="{ 'min-width': minWidth + 'px', flex: 1 }"
    :items="selectItems.ship"
    :placeholder="$t('common.select.ship')"
    :disabled="disable.ship"
    :clearable="clearable"
    @click:clear="clickClear('ship')"
    @update:model-value="
      (v: any) => {
        selectedResult.ship = v;
        // 하위 선택박스 초기화
        initEquipment();
        if (props.useEquipment) {
          searchEquipment();
        }
      }
    "
  />
  <BaseAutocomplete
    v-if="useEquipment"
    :model-value="selectedResult.equipment"
    return-object
    single-line
    hide-details="auto"
    menu-icon="mdi-chevron-down"
    variant="outlined"
    density="comfortable"
    :style="{ 'min-width': minWidth + 'px', flex: 1 }"
    :items="selectItems.equipment"
    :placeholder="$t('common.select.equipment')"
    :disabled="disable.equipment"
    :clearable="clearable"
    @click:clear="clickClear('equipment')"
    @update:model-value="
      (v: any) => {
        selectedResult.equipment = v;
        // 하위 선택박스 초기화
        initSubEquipment();
        if (props.useSubEquipment) {
          searchSubEquipment();
        }
      }
    "
  />
  <BaseAutocomplete
    v-if="useSubEquipment"
    :model-value="selectedResult.subEquipment"
    return-object
    single-line
    hide-details="auto"
    menu-icon="mdi-chevron-down"
    variant="outlined"
    density="comfortable"
    :style="{ 'min-width': minWidth + 'px', flex: 1 }"
    :items="selectItems.subEquipment"
    :placeholder="$t('common.select.subEquipment')"
    :disabled="disable.subEquipment"
    :clearable="clearable"
    @click:clear="clickClear('subEquipment')"
    @update:model-value="
      (v: any) => {
        selectedResult.subEquipment = v;
        // 하위 선택박스 초기화
        initSensor();
        if (props.useSensor) {
          searchSensor();
        }
      }
    "
  />
  <BaseAutocomplete
    v-if="useSensor"
    :model-value="selectedResult.sensor"
    return-object
    single-line
    hide-details="auto"
    menu-icon="mdi-chevron-down"
    variant="outlined"
    density="comfortable"
    :style="{ 'min-width': minWidth + 'px', flex: 1 }"
    :items="selectItems.sensor"
    :clearable="clearable"
    :placeholder="$t('common.select.sensor')"
    :disabled="disable.sensor"
    @update:model-value="
      (v: any) => {
        selectedResult.sensor = v;
      }
    "
  />
</template>

<script setup lang="ts">
import _ from 'lodash';
import { useI18n } from 'vue-i18n';
import { onMounted, reactive, watch } from 'vue';
import axiosInstance from '@/axios';


const { t } = useI18n();

// props 의 defaultValue 사용 예
/**
 :default-value="{
 shipType: { title: '', value: '' },
 ship: { title: '', value: '' },
 equipment: { title: '', value: '' },
 subEquipment: { title: '', value: '' },
 sensor: { title: '', value: '' }
 }"
 */

export interface Props {
  useShipType?: boolean; // 함형 선택박스 사용여부
  useShip?: boolean; // 함정 선택박스 사용여부
  useEquipment?: boolean; // 장비 선택박스 사용여부
  useSubEquipment?: boolean; // 계통 선택박스 사용여부
  useSensor?: boolean; // 센서 선택박스 사용여부
  defaultValue?: any; // 부모창에서 받아온 선택박스의 고정값
  clearable?: boolean; // 선택박스 X 버튼 사용여부
  childrenDisable?: boolean; // 하위 선택박스 비활성화 여부
  minWidth?: number; // 선택박스 최소 width
}

const props = withDefaults(defineProps<Props>(), {
  useShipType: false,
  useShip: false,
  useEquipment: false,
  useSubEquipment: false,
  useSensor: false,
  defaultValue: {},
  clearable: false,
  childrenDisable: false,
  minWidth: 100
});

// 선택박스 옵션
const selectItems: { [key: string]: any } = reactive({
  shipType: [],
  ship: [],
  equipment: [],
  subEquipment: [],
  sensor: []
});

// 선택박스 선택된 값
const selectedResult: { [key: string]: any } = reactive({
  shipType: null,
  ship: null,
  equipment: null,
  subEquipment: null,
  sensor: null
});

// 선택박스 disable여부
const disable: { [key: string]: boolean } = reactive({
  ship: false,
  equipment: false,
  subEquipment: false,
  sensor: false
});

// 부모창에서 받은 defaultValue 사용 여부
const useDefaultValue: { [key: string]: boolean } = reactive({
  shipType: false,
  ship: false,
  equipment: false,
  subEquipment: false,
  sensor: false
});

const emit = defineEmits(['update:select']);
// 선택박스 변경될때마다 실행
watch(selectedResult, async () => {
  // 함형 선택박스가 전체 선택일때 함정으로 함형정보 찾아서 emit 두번째 파라미터로 보냄
  if (selectedResult.ship && selectedResult.shipType && selectedResult.shipType.value === 'all') {
    axiosInstance.get('/api/ships', { params: { shipId: selectedResult.ship.value } }).then((response) => {
      if (response.data?.rows.length > 0) {
        emit('update:select', selectedResult, { title: response.data.rows[0].typeName, value: response.data.rows[0].shipTypeId });
      }
    });
  } else {
    emit('update:select', selectedResult);
  }
});

onMounted(async () => {
  // childrenDisable이 true면 하위선택박스 disable세팅
  if (props.childrenDisable) {
    disable.ship = true;
    disable.equipment = true;
    disable.subEquipment = true;
    disable.sensor = true;
  }

  // defaultValue가 있으면 부모한테 받아온 값 세팅
  if (!_.isEmpty(props.defaultValue)) {
    settingDefaultValue();
  }

  // 함형 사용한다면 전체 함형 세팅
  if (props.useShipType) {
    selectItems.shipType.push({ title: t('common.select.all'), value: 'all' });
    axiosInstance.get(`/api/ship-types/all`).then((response) => {
      response.data?.forEach((item) => {
        //  defaultValue의 value와 장비 이름이 같다면 데이터 세팅
        if (props.defaultValue.shipType?.value === item.id) {
          selectedResult.shipType = { title: item.name, value: item.id };
        }
        selectItems.shipType.push({ title: item.name, value: item.id });
      });
    });
  } else {
    // 함형 사용하지 않는다면 전체 함정 세팅
    axiosInstance.get(`/api/ships/all`).then((response) => {
      response.data?.forEach((item: any) => {
        selectItems.ship.push({ title: item.name, value: item.id });
      });
    });
  }
});

// defaultValue 세팅
function settingDefaultValue() {
  const defaultKeys = _.keys(props.defaultValue);
  defaultKeys.forEach((item: string) => {
    // 값이 있을때 실행
    if (props.defaultValue[item]) {
      selectedResult[item] = props.defaultValue[item];
      useDefaultValue[item] = true; // search..()함수 내부의 초기화 함수(initOptions)가 실행될때 defaultValue가 있는 선택박스는 초기화 하지 않기 위해 true 설정
      disable[item] = false; // defaultValue가 있다면 disable 여부 true로 변경
      switch (item) {
        case 'ship':
          searchShip();
          if (props.useEquipment) {
            searchEquipment(); // 다음 선택박스도 바로 고를 수 있게 미리 조회
          }
          break;
        case 'equipment':
          if (props.useSubEquipment) {
            searchSubEquipment(); // 다음 선택박스도 바로 고를 수 있게 미리 조회
          }
          break;
        case 'subEquipment':
          if (props.useSensor) {
            searchSensor(); // 다음 선택박스도 바로 고를 수 있게 미리 조회
          }
          break;
        case 'sensor':
          searchSensor();
          break;
        default:
          break;
      }
      // 초기 진입 초기화만 방지하기 위해 사용하므로 다시 false 설정
      useDefaultValue[item] = false;
    }
  });
}

// 함정 select items 조회
async function searchShip() {
  if (props.childrenDisable) {
    disable.ship = false;
    disable.equipment = true;
    disable.subEquipment = true;
    disable.sensor = true;
  }

  if (selectedResult.shipType?.value) {
    axiosInstance(`/api/ships`, { params: { shipTypeId: selectedResult.shipType?.value } }).then((response) => {
      response.data?.rows.forEach((item: any) => {
        // defaultValue의 value와 함정 번호가 같다면 데이터 세팅
        if (props.defaultValue.ship?.value === item.shipId) {
          selectedResult.ship = { title: item.shipName, value: item.shipId };
        }
        selectItems.ship.push({ title: item.shipName, value: item.shipId });
      });
    });
  }
}

// 장비 select items 조회
async function searchEquipment() {
  if (props.childrenDisable) {
    disable.equipment = false;
    disable.subEquipment = true;
    disable.sensor = true;
  }

  if (selectedResult.ship?.value && selectedResult.shipType?.value) {
    axiosInstance
      .get(`/api/equipments/codes`, {
        params: {
          shipId: selectedResult.ship?.value,
          shipTypeId: selectedResult.shipType?.value,
          sort: 'id',
          order: 'asc'
        }
      })
      .then((response) => {
        response.data?.rows.forEach((item: any) => {
          //  defaultValue의 value와 장비 이름이 같다면 데이터 세팅
          if (props.defaultValue.equipment?.value === item.name) {
            selectedResult.equipment = { title: item.name, value: item.id };
          }
          selectItems.equipment.push({ title: item.name, value: item.id });
        });
      });
  }
}

// 하위장비 select Items 조회
async function searchSubEquipment() {
  if (props.childrenDisable) {
    disable.subEquipment = false;
    disable.sensor = true;
  }

  if (selectedResult.ship?.value && selectedResult.equipment?.title && selectedResult.equipment?.value) {
    axiosInstance
      .get('/api/equipments/io-lists/sub-systems', {
        params: {
          shipId: selectedResult.ship?.value,
          system: selectedResult.equipment?.title,
          systemNumber: selectedResult.equipment?.value
        }
      })
      .then((response) => {
        response.data?.forEach((item: any) => {
          //  defaultValue의 value와 같다면 데이터 세팅
          if (props.defaultValue.subEquipment?.value === item.subSystem) {
            selectedResult.subEquipment = { title: item.subSystem, value: item.subSystem };
          }
          selectItems.subEquipment.push({ title: item.subSystem, value: item.subSystem });
        });
      });
  }
}

// 센서 select Items 조회
async function searchSensor() {
  if (props.childrenDisable) {
    disable.sensor = false;
  }

  if (selectedResult.ship?.value && selectedResult.equipment?.title && selectedResult.equipment?.value && selectedResult.subEquipment?.value) {
    axiosInstance('/api/equipments/io-lists', {
      params: {
        shipId: selectedResult.ship?.value,
        system: selectedResult.equipment?.title,
        systemNumber: selectedResult.equipment?.value,
        subSystem: selectedResult.subEquipment?.value
      }
    }).then((response) => {
      response.data?.rows.forEach((item: any) => {
        //  defaultValue의 value와 같다면 데이터 세팅
        if (props.defaultValue.sensor?.value === item.id) {
          selectedResult.sensor = { title: item.name, value: item.id };
        }
        selectItems.sensor.push({ title: item.name, value: item.id });
      });
    });
  }
}

// clear 버튼 클릭
function clickClear(type: string) {
  // 자식 비활성화가 true면 동작
  if (props.childrenDisable && type) {
    switch (type) {
      case 'shipType':
        disable.ship = true;
        initShip();
        break;
      case 'ship':
        disable.equipment = true;
        initEquipment();
        break;
      case 'equipment':
        disable.subEquipment = true;
        initSubEquipment();
        break;
      case 'subEquipment':
        disable.sensor = true;
        initSensor();
        break;
      default:
        break;
    }
  }
}

// 함정 초기화
function initShip() {
  selectItems.ship = [];
  selectItems.equipment = [];
  selectItems.subEquipment = [];
  selectItems.sensor = [];
  selectedResult.ship = null;
  selectedResult.equipment = null;
  selectedResult.subEquipment = null;
  selectedResult.sensor = null;
}

// 장비 초기화
function initEquipment() {
  selectItems.equipment = [];
  selectItems.subEquipment = [];
  selectItems.sensor = [];
  selectedResult.equipment = null;
  selectedResult.subEquipment = null;
  selectedResult.sensor = null;
}

// 하위장비 초기화
function initSubEquipment() {
  selectItems.subEquipment = [];
  selectItems.sensor = [];
  selectedResult.subEquipment = null;
  selectedResult.sensor = null;
}

// 센서 초기화
function initSensor() {
  selectItems.sensor = [];
  selectedResult.sensor = null;
}
</script>
