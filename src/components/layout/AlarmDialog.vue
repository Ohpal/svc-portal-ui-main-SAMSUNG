<template>
  <BaseDialog
    :width="400"
    :opacity="0"
    class="top-right-dialog"
    :retain-focus="false"
    title="Alarm"
    @click:cancel="close"
    persistent
    hide-footer
  >
    <template v-slot:header>
      <div 
        class="dialog-header"
        :class="noData ? 'mb-2' : ''"
      >
        <div class="dialog-title">Alarm</div>
        <v-icon
          class="ml-12 cursor-pointer"
          icon="mdi-cancel"
          size="24"
          color="var(--black60)"
          @click="close"
        >
        </v-icon>
      </div>
    </template>
    <template v-slot:body>
      <div class="dialog-body">
        <EmptyChart
          v-if="noData"
          message="'No Data'"
        />
        <div v-else>
          <div class="flex">
            <div class="info-title voyage">
              Voyage
              <v-btn
                size="small"
              >
                Planner
              </v-btn>
            </div>
          </div>
          <div class="sub-info-box">
            <div class="item">
              <div class="label">New voyage updated</div>
              <div class="value">{{ voyageInfo?.voyageUpdated }}</div>
            </div>
            <div class="item">
              <div class="label">New voyage proposed</div>
              <div class="value">{{ voyageInfo?.voyageProposed }}</div>
            </div>
            <div class="item">
              <div class="label">ECA</div>
              <div class="value">{{ voyageInfo?.eca }}</div>
            </div>
          </div>
          <div class="info-title">
            Alarm
          </div>
          <v-data-table-virtual
            :headers="voyageAlarmTable.headers"
            :items="voyageAlarmTable.items"
            fixed-header
            class="virtual-table"
            density="comfortable"
            height="264"
          >
            <template #[`item.no`]="{ index }">
              <span>{{ index + 1 }}</span>
            </template>
            <template #[`item.move`]="{ item }">
              <v-btn
                size="small"
                icon="mdi-new-window"
                variant="text"
                color="secondary"
                @click="onClickMoveBtn(item)"
              >
              </v-btn>
            </template>
          </v-data-table-virtual>
        </div>
      </div>
    </template>
  </BaseDialog>
</template>

<script setup lang="ts">
import { defineEmits, reactive, ref, onMounted } from 'vue';
import type { DataTableType } from '@/types';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import axiosInstance from '@/axios';

const emit = defineEmits(['close']);

const router = useRouter();

// TODO : noData flag
const noData = ref(true);

// TODO : voyage Info
const voyageInfo = ref({
  voyageUpdated: 0,
  voyageProposed: '-',
  eca: 'OUT',
});

// 알람 검색 조건
let alarmSearchOption = {
  timeSorting: 'Descending',
  searchSeverity: 'All',
  searchClass: 'All',
  from: dayjs().subtract(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
  to: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  pageSize: 10
};

// Voyage Alarm 테이블
const voyageAlarmTable: DataTableType = reactive({
  title: '',
  headers: [
    { title: 'No', key: 'no', align: 'center', sortable: false, maxWidth: 48 },
    { title: 'Alarm name', key: 'dataChannelId', align: 'center', sortable: false, width: 150 },
    { title: 'Level', key: 'alarmLevel', align: 'center', sortable: false, maxWidth: 80 },
    { title: 'Occurrence time', key: 'createdTime', align: 'center', sortable: false, maxWidth: 160 },
    { title: '', key: 'move', align: 'center', sortable: false, maxWidth: 42},
  ],
  items: [],
  totalRecords: 0
});

onMounted(() => {
  // const platform = 'platform-sysm';
  const service = 'service-sysm';
  axiosInstance
    .get(
      `/krakend/${service}/sysm/alarm/history`
      , { params: { ...alarmSearchOption } }
    )
    .then((response: any) => {
      if (response.data.rows && response.data.rows.length > 0) {
        const rows = response.data.rows;
        rows.forEach((row: any, index: any) => {
          row['move'] = '';
          row.createdTime = dayjs(row.createdTime).format('YYYY-MM-DD HH:mm:ss');
          if (index === rows.length - 1) {
            alarmSearchOption.from = row.createdTime;
          }
        })
        voyageAlarmTable.items = response.data.rows;
      }
    });
});

function onClickMoveBtn(item: any) {
  router.push({
    path: '/security/it-device/alarm-log-monitoring',
    query: {
      tab: 'sf',
      from: alarmSearchOption.from,
      to: alarmSearchOption.to,
      searchSeverity: item?.alarmLevel,
      dataChannelId: item?.dataChannelId
    }
  });
};

const close = () => {
  emit('close');
};

</script>

<style scoped lang="scss">
.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  box-shadow: 0px 2px 8px 0px #0000000F;
}

.dialog-title {
  font-size: 15px;
}

.dialog-wrapper {
  .v-overlay__content {
    .dialog-body {
      height: 352px;
      padding: 10px 20px 20px;
      overflow-y: auto;
    }
  }
}


.info-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  font-size: 14px;
  color: var(--black80);
}

.sub-info-box {
  width: 100%;
  padding: 8px 16px;
  margin-top: 10px;
  border-radius: 4px;
  background: rgba(50, 119, 255, 0.05);

  .item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 28px;
    font-size: 13px;

    .label {
      color: rgba(0, 0, 0, 0.55);
    }

    .value {
      margin-left: 12px;
      color: rgba(0, 0, 0, 0.8);
    }
  }

  .item + .item {
    border-top: 1px solid var(--black8);
  }
}
</style>
