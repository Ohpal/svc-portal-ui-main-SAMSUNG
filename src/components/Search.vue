<template>
  <BaseAutocomplete
    v-model="searchOptions.searchKey"
    :items="searchKeyList"
    :clearable="true"
    :placeholder="'searchKey'"
  />
  <BaseTextField
    v-model="searchOptions.searchText"
    :placeholder="'searchText'"
    :clearable="true"
  />
  <v-btn
    v-permission="'read'"
    icon="mdi-magnify"
    ><v-icon
      size="16"
      @click="$emit('click:search', searchOptions)"
  /></v-btn>
</template>

<script setup lang="ts">



import { reactive, watch } from 'vue';

const props = defineProps<{
  searchKeyList: Array<any>;
}>();

defineEmits(['click:search']);

const searchOptions = reactive({
  searchKey: null,
  searchText: ''
});

// searchKey List가 바뀌면 선택,입력 했던 값 초기화
watch(
  () => props.searchKeyList,
  () => {
    searchOptions.searchKey = null;
    searchOptions.searchText = '';
  }
);
</script>
