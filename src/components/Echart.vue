<template>
  <div
    ref="el"
    :style="{ width: '100%', height: '100%', position: 'relative' }"
  ></div>
</template>

<script setup lang="ts">
import * as echarts from 'echarts/core';
import {
  GridComponent,
  LegendComponent,
  VisualMapComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TooltipComponent,
  ToolboxComponent,
  PolarComponent,
  TitleComponent,
  DatasetComponent,
  TransformComponent
} from 'echarts/components';
import { BarChart, ScatterChart, LineChart, HeatmapChart } from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import { registerTransform } from 'echarts';
import * as ecStat from 'echarts-stat';
import { ref, watch, onMounted } from 'vue';

registerTransform((ecStat as any).transform.regression);

echarts.use([
  GridComponent,
  CanvasRenderer,
  LegendComponent,
  VisualMapComponent,
  MarkAreaComponent,
  MarkLineComponent,
  MarkPointComponent,
  TooltipComponent,
  ToolboxComponent,
  PolarComponent,
  TitleComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  ScatterChart,
  LineChart,
  HeatmapChart
]);

export interface Props {
  options: any;
  renderer?: string; // 'canvas' : 시각적효과가 있는 차트에 적합 , 'svg': 메모리 사용량이 적고 확대할 때 흐려지지 않음
  openDialog?: boolean; // 차트 클릭 시 팝업 생성 여부
  merge?: boolean; // 차트 옵션 새로 변경 시 이전 데이터와 병합할지 여부
  loading?: boolean; // api loading 여부
}
const props = withDefaults(defineProps<Props>(), {
  renderer: 'canvas',
  openDialog: false,
  merge: false,
  loading: false
});
const emit = defineEmits(['open:dialog']);

const el = ref(null);
let chart: any = null;

function initChart(dom: any) {
  const { renderer } = props;
  chart = echarts.init(dom, {
    renderer,
    width: 'auto',
    height: 'auto'
  });

  if (props.options) {
    chart.setOption(props.options);
  }

  // chart resize
  if (dom) {
    const resizeObserver = new ResizeObserver(() => {
      chart.resize();
    });
    resizeObserver.observe(dom);
  }

  // 차트 클릭 이벤트
  chart.on('click', (params: any) => {
    if (props.openDialog) {
      emit('open:dialog', params);
    }
  });
}

watch(
  () => props.options,
  () => {
    if (props.options) {
      chart.setOption(props.options);
    }
  }
);

watch(
  () => props.loading,
  (newValue) => {
    if (newValue) {
      chart.showLoading();
    } else {
      chart.hideLoading();
    }
  }
);

onMounted(() => {
  initChart(el.value);
});
</script>
