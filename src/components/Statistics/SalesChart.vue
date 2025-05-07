<script setup>
import { ref, watch, defineProps } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

// Nhận dữ liệu từ props
const props = defineProps({
  products: Array,
  colorData: String,
  text: String,
  loai: String
});


const series = ref([]);

// const customTicks = [5, 7, 12, 20, 35, 50, 75, 100];
const chartOptions = ref({
  
});

watch(
  () => props.products,
  (newProducts) => {
    const names = [];
    const sales = [];

    Object.entries(newProducts).forEach(([key, value]) => {
      names.push(key);
      sales.push(value);
    });

    series.value = [{ name: props.text, data: sales }];

    chartOptions.value = {
      chart: {
        type: 'bar',
        toolbar: { show: false },
        background: 'transparent',
      },
      colors: [props.colorData],
      xaxis: {
        categories: names,
        // labels: {
        //   style: {
        //     colors: '#fff'
        //   }
        // }
      },
      yaxis: {
        // Cách 1
        min: 5,
  max: 100,
  labels: {
    formatter: function (val) {
      return val + `${props.loai}`; // Thêm dấu %
    },
    style: {
      colors: '#ffffff' // Cho màu chữ sáng nếu nền tối
    }
  
  }

  // Cách 2
  // min: 0,
  // max: 100,
  // tickAmount: customTicks.length - 1,
  // labels: {
  //   formatter: function (val, index) {
  //     return customTicks[index] !== undefined ? customTicks[index] + '%' : '';
  //   },
  //   style: {
  //     colors: '#ffffff'
  //   }
  // }
      },
      dataLabels: {
        enabled: true,
        style: {
          fontSize: '8.5px', 
          colors: ['#fff']
        },
        formatter: function (val) {
          return val +  `${props.loai}`
        }
      },
      tooltip: {
        enabled: true,
        custom: function({ seriesIndex, dataPointIndex, w }) {
          const product = w.globals.series[seriesIndex][dataPointIndex];
          const name = w.config.xaxis.categories[dataPointIndex]; // CHÍNH XÁC!
          const sales = product;

          return `
            <div style="padding: 10px; text-align: center;">
              <div><strong>Name: ${name}</strong></div>
              <div>${props.text}: ${sales}%</div>
            </div>
          `;
        },
        style: {
          fontSize: '2px',
          fontFamily: 'Arial, sans-serif',
          background: '#2f3e46', // Màu nền tooltip
          color: '#fff',         // Màu chữ tooltip
          borderRadius: '5px',   // Bo góc tooltip
          padding: '10px',       // Padding cho tooltip
        },
        theme: 'dark'
      }
    };
  },
  { immediate: true }
);

</script>

<template>
  <div>
    <VueApexCharts :options="chartOptions" :series="series" height="400" />
  </div>
</template>

<style scoped>
button {
  margin-top: 10px;
  padding: 8px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
</style>