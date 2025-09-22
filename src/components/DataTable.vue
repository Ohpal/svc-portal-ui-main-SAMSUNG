<template>
  <v-data-table
    v-model="selected"
    density="comfortable"
    :headers="table.headers"
    :items="table.items"
    :page="usePagination ? table.pageNumber : 1"
    :items-per-page="usePagination ? table.pageSize : 10"
    :hover="true"
    :show-select="table.useCheckBox"
    :loading="isLoading"
  >
    <!-- 인덱스 -->
    <template #[`item.no`]="{ index }">
      <span v-if="!usePagination">{{ index + 1 }}</span>
      <span v-else>{{ (table.pageNumber - 1) * table.pageSize + (index + 1) }}</span>
    </template>
    <!-- 편집 버튼 -->
    <template #[`item.update`]="{ item }">
      <v-btn
        v-permission="'update'"
        variant="text"
        size="small"
        color="secondary"
        icon="mdi-pencil"
        @click="emit('click:update', item)"
      />
    </template>
    <!-- 삭제 버튼 -->
    <template #[`item.delete`]="{ item }">
      <v-btn
        v-permission="'delete'"
        variant="text"
        size="small"
        color="secondary"
        icon="mdi-trash-can-outline"
        @click="emit('click:delete', item)"
      />
    </template>
    <!-- 다운로드 버튼 -->
    <template #[`item.download`]="{ item }">
      <v-btn
        v-permission="'read'"
        variant="text"
        size="small"
        color="secondary"
        icon="mdi-arrow-collapse-down"
        @click="emit('click:download', item)"
      />
    </template>
    <template
      v-for="(_, slot) of $slots"
      #[slot]="slotProps"
    >
      <slot
        :name="slot"
        v-bind="slotProps"
      ></slot>
    </template>
    <!-- 페이징 -->
    <template #bottom>
      <div
        v-if="table.usePagination"
        class="v-data-table-footer mt-4"
      >
        <div class="txt mr-2">Per page</div>
        <v-select
          v-model="pageOptions.pageSize"
          hide-details="auto"
          menu-icon="mdi-chevron-down"
          variant="underlined"
          density="compact"
          :items="pageSizeItems"
          @update:model-value="onChangePage()"
        />
        <v-pagination
          v-model="pageOptions.pageNumber"
          variant="text"
          density="compact"
          active-color="primary"
          class="ml-auto"
          :length="pageCount"
          :total-visible="10"
          @update:model-value="onChangePage()"
        />
      </div>
    </template>
  </v-data-table>
</template>
<script setup lang="ts">
import type { DataTableType } from '@/types';
import { computed, ref, watch, nextTick, onMounted } from 'vue';
import _ from 'lodash';

const props = defineProps<DataTableType>(); // :headers..로 들어올 경우
const propTable = defineModel<DataTableType>(); // v-model로 들어올 경우

const emit = defineEmits(['click:update', 'click:delete', 'click:download', 'click:check', 'click:search']);

// props 담을 객체
const table: DataTableType | any = ref(propTable.value || props);

// 페이징 옵션 아이템 리스트
const pageSizeItems = ref([
  { value: 10, title: '10' },
  { value: 20, title: '20' },
  { value: 50, title: '50' },
  { value: 100, title: '100' }
]);

// 부모로 보낼 페이지 옵션
const pageOptions = ref({
  pageNumber: table.value.pageNumber,
  pageSize: table.value.pageSize
});

// 체크박스 선택 값
const selected = ref([]);

// 테이블 로딩 여부
const isLoading = ref(false);

// 페이지 카운트
const pageCount = computed(() => {
  return table.value.totalRecords !== 0 ? Math.ceil(table.value.totalRecords / table.value.pageSize) : 0;
});

// 선택박스 선택시 값 넘겨주기 위해
watch(
  () => selected.value,
  () => {
    emit('click:check', selected.value);
  }
);

// props에서 pageNumber가 바뀌면 pageOptions에 넣어줌
watch(
  () => props.pageNumber || propTable.value?.pageNumber,
  (newValue) => {
    pageOptions.value.pageNumber = newValue;
  },
  { immediate: true }
);

// 페이지 사이즈 변경될 때
watch(
  () => props.pageSize || propTable.value?.pageSize,
  (newValue, oldValue) => {
    if (pageOptions.value.pageNumber && pageOptions.value.pageNumber !== 1 && oldValue) {
      const stayedPage = pageOptions.value.pageNumber; // 이전에 보고 있던 페이지
      const stayedPageFirstIndex = stayedPage * oldValue - oldValue + 1; // 이전 페이지 사이즈의 첫번째 인덱스 ex) 1,11,21...
      const stayedPageLastIndex = stayedPageFirstIndex + oldValue - 1; // 이전 페이지 사이즈의 마지막 인덱스 ex) 10,20,30...

      if (newValue) {
        let page = 1;
        if (stayedPageFirstIndex <= newValue || stayedPageLastIndex === newValue) {
          // 1페이지인 경우
          // 이전 페이지 사이즈의 첫번째 인덱스가 새 페이지 사이즈 보다 작음 || 이전 페이지 사이즈의 마지막 인덱스가 새 페이지 사이즈와 같음
          page = 1;
        } else {
          // 1 페이지 제외인 경우
          const newTotalPage = Math.ceil(table.value.totalRecords / newValue); // 바뀐 totalPageCount
          for (let i = 1; i < newTotalPage; i += 1) {
            const changedPageFirstIndex = i * newValue + 1; // 변경된 페이지 첫번째 인덱스
            const changedPageLastIndex = changedPageFirstIndex + newValue - 1; // 변경된 페이지 마지막 인덱스

            if (stayedPageLastIndex === changedPageLastIndex) {
              // 이전 페이지 사이즈의 마지막 인덱스와 변경된 페이지 사이즈의 마지막 인덱스가 같을때
              page = Math.ceil(changedPageLastIndex / newValue);
              break;
            } else if (stayedPageFirstIndex === changedPageFirstIndex) {
              // 이전 페이지 사이즈의 첫번째 인덱스와 현재 바뀐 페이지 사이즈의 첫번째 인덱스가 같을때 > 변경된 페이지 사이즈로 계산
              page = Math.ceil(changedPageFirstIndex / newValue);
              break;
            } else if (
              _.inRange(stayedPageFirstIndex, changedPageFirstIndex, changedPageLastIndex) ||
              _.inRange(stayedPageLastIndex, changedPageFirstIndex, changedPageLastIndex)
            ) {
              // 이전 페이지 사이즈의 첫번째 인덱스 or 마지막 인덱스가 변경된 페이지 사이즈의 인덱스 범위 안에 들어올때
              page = Math.ceil(changedPageFirstIndex / newValue);
              break;
            }
          }
        }

        pageOptions.value.pageNumber = page;
        nextTick(() => onChangePage());
      }
    }
  },
  { immediate: true }
);

watch(
  () => props.loading,
  (newValue) => {
    if (newValue) {
      isLoading.value = true;
    } else {
      isLoading.value = false;
    }
  }
);

onMounted(() => {
  // 부모창에서 지정한 pageSizeItems가 있다면 적용
  if (table.value.pageSizeItems?.length > 0) {
    pageSizeItems.value = table.value.pageSizeItems;
  }
});

// 페이지 사이즈 , 페이지 번호 변경 시
function onChangePage() {
  emit('click:search', pageOptions.value);
}
</script>
