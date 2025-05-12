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
    const maxSum = Math.max(...Object.values(props.products)) // Lấy ra giá trị lớn nhất
    if(maxSum <= 10){
      chartOptions.value = {
      chart: {
        type: 'bar',
        toolbar: { show: false },
        background: 'transparent',
      },
      colors: [props.colorData],
      borderColor: '#2F4F4F',
      strokeDashArray: 0,
      xaxis: {
        categories: names,
        labels: {
          style: {
            colors: 'black'
          }
        }
      },
      yaxis: {
        // Cách 1
        // min: null,
  max: 10,
  labels: {
    formatter: function (val) {
      return val + `${props.loai}`; // Thêm dấu %
    },
    style: {
      colors: 'black' // Cho màu chữ sáng nếu nền tối
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
          colors: ['grey']
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
      },
      // 👉 Đây là phần thêm để đổi màu đường kẻ ngang
  grid: {
    borderColor: 'black', // Màu của đường kẻ ngang (ví dụ: đỏ)
    strokeDashArray: 0,     // Đặt là 0 để đường kẻ liền, >0 để chấm chấm
    yaxis: {
      lines: {
        show: true
      }
    },
    xaxis: {
      lines: {
        show: false // Nếu bạn chỉ muốn hiển thị đường kẻ ngang (trục Y)
      }
    }
  }
    };
    }

    else if(maxSum > 10 && maxSum <= 20){
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
  //       min: null,
  max: 20,
  labels: {
    formatter: function (val) {
      return val + `${props.loai}`; // Thêm dấu %
    },
    style: {
      colors: 'black' // Cho màu chữ sáng nếu nền tối
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
          colors: ['grey']
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
      },
      // 👉 Đây là phần thêm để đổi màu đường kẻ ngang
  grid: {
    borderColor: 'black', // Màu của đường kẻ ngang (ví dụ: đỏ)
    strokeDashArray: 0,     // Đặt là 0 để đường kẻ liền, >0 để chấm chấm
    yaxis: {
      lines: {
        show: true
      }
    },
    xaxis: {
      lines: {
        show: false // Nếu bạn chỉ muốn hiển thị đường kẻ ngang (trục Y)
      }
    }
  }
    };
    }
    else{
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
  //       min: null,
  // max: null,
  labels: {
    formatter: function (val) {
      return val + `${props.loai}`; // Thêm dấu %
    },
    style: {
      colors: 'black' // Cho màu chữ sáng nếu nền tối
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
          colors: ['black']
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
      },
      // 👉 Đây là phần thêm để đổi màu đường kẻ ngang
  grid: {
    borderColor: 'black', // Màu của đường kẻ ngang (ví dụ: đỏ)
    strokeDashArray: 0,     // Đặt là 0 để đường kẻ liền, >0 để chấm chấm
    yaxis: {
      lines: {
        show: false
      }
    },
    xaxis: {
      lines: {
        show: false // Nếu bạn chỉ muốn hiển thị đường kẻ ngang (trục Y)
      }
    }
  },

  // ĐÂY LÀ HIỂN THỊ ĐƯỜNG KẺ NGANG Ở CUỐI CÙNG (y: 0 là hiển thị đường kẻ ngang ở cuối cùng)
  // ✅ Thêm đúng 1 đường kẻ ngang bằng annotations
  annotations: {
    yaxis: [
      {
        y: 0, // Vị trí đường ngang (cuối trục Y)
        borderColor: 'black', // Màu đường
        strokeDashArray: 0,
        label: {
          show: false // Nếu bạn muốn ẩn nhãn
        }
      }
    ],
    xaxis: [
      {
        x: 0, // Vị trí đường ngang (cuối trục X)
        borderColor: 'black', // Màu đường
        strokeDashArray: 0,
        label: {
          show: false // Nếu bạn muốn ẩn nhãn
        }
      }
    ]
  }
    };
    }
    
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