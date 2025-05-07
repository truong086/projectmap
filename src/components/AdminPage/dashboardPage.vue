<template>

            <div class="row">
              <div class="col-xl-3 col-sm-6 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-9">
                        <div class="d-flex align-items-center align-self-start">
                          <h3 class="mb-0"> {{ totalPhanTram }}</h3>
                          <p class="text-success ms-2 mb-0 font-weight-medium">%</p>
                        </div>
                      </div>
                      <div class="col-3">
                        <div class="icon icon-box-success ">
                          <span class="mdi mdi-arrow-top-right icon-item"></span>
                        </div>
                      </div>
                    </div>
                    <h6 class="text-muted font-weight-normal">燈沒壞</h6>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-6 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-9">
                        <div class="d-flex align-items-center align-self-start">
                          <h3 class="mb-0">{{ totalLanUpdate }}</h3>
                          <p class="text-success ms-2 mb-0 font-weight-medium">個</p>
                        </div>
                      </div>
                      <div class="col-3">
                        <div class="icon icon-box-success">
                          <span class="mdi mdi-arrow-top-right icon-item"></span>
                        </div>
                      </div>
                    </div>
                    <h6 class="text-muted font-weight-normal">建設中</h6>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-6 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-9">
                        <div class="d-flex align-items-center align-self-start">
                          <h3 class="mb-0">{{ totalPhanTramError }}</h3>
                          <p class="text-danger ms-2 mb-0 font-weight-medium">%</p>
                        </div>
                      </div>
                      <div class="col-3">
                        <div class="icon icon-box-danger">
                          <span class="mdi mdi-arrow-bottom-left icon-item"></span>
                        </div>
                      </div>
                    </div>
                    <h6 class="text-muted font-weight-normal">燈壞了</h6>
                  </div>
                </div>
              </div>
              <div class="col-xl-3 col-sm-6 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <div class="row">
                      <div class="col-9">
                        <div class="d-flex align-items-center align-self-start">
                          <h3 class="mb-0">沒有資料</h3>
                          <p class="text-success ms-2 mb-0 font-weight-medium">沒有資料</p>
                        </div>
                      </div>
                      <div class="col-3">
                        <div class="icon icon-box-success ">
                          <span class="mdi mdi-arrow-top-right icon-item"></span>
                        </div>
                      </div>
                    </div>
                    <h6 class="text-muted font-weight-normal">沒有資料</h6>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" style="width: 100%;">
              <div class="stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h1 style="color: white;">燈沒壞</h1>
                    <SalesChartPage2 :products="dataUpdate" :colorData="color1" :text="text1" :loai="phantram"/>
                  </div>
                </div>
              </div>
            </div>
            <div class="row" style="width: 100%;">
              <div class="stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h1 style="color: white;">建設中</h1>
                    <SalesChartPage2 :products="dataUpdateDistrics" :colorData="color2" :text="text2" :loai="ge"/>
                    
                  </div>
                </div>
              </div>
            </div>

            <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <p>載入中......</p>
  </div>
</template>

<script setup>
import {ref, getCurrentInstance, onMounted} from 'vue'
import {useCounterStore} from '../../store'
import axios from 'axios';
import SalesChartPage2 from "../Statistics/SalesChart.vue";

const store = useCounterStore()
const dataUpdate = ref([])
const dataUpdateDistrics = ref([])
const { proxy } = getCurrentInstance();
const hostName = proxy?.hostname;
const isLoading = ref(false)
const color1 = ref('#de0dad')
const color2 = ref('#7FFF00')
const text1 = ref('燈沒壞')
const text2 = ref('建設中')
const ge = ref('個')
const phantram = ref('%')
const totalPhanTram = ref(0)
const totalLanUpdate = ref(0)
const totalPhanTramError = ref(0)
const getToken = () => {

var result = {
  headers: { Authorization: `Bearer ${store.getToken}` },
};
return result;
};

const totalUpdate = async () => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";
  const res = await axios.get(hostName + '/api/TrafficEquipment/GetNormalDistrict2', getToken())
  if(res.data.success){
    dataUpdate.value = res.data.content
    console.log(dataUpdate.value)
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
}

const totalUpdateDistrics = async () => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";
  const res = await axios.get(hostName + '/api/TrafficEquipment/GetNormalDistrictUpdate2', getToken())
  if(res.data.success){
    dataUpdateDistrics.value = res.data.content
    totalLanUpdate.value = Object.values(dataUpdateDistrics.value).reduce((sum, val) => sum + val, 0) // TÍnh tổng số lần sửa khi BackEnd trả ra 1 "Dictionary"
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
}

const totalPhanTranData = async () => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";
  const res = await axios.get(hostName + '/api/TrafficEquipment/GetNormal', getToken())
  if(res.data.success){
    totalPhanTram.value = res.data.content
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
}


const totalPhanTranDataError = async () => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";
  const res = await axios.get(hostName + '/api/TrafficEquipment/GetNormalError', getToken())
  if(res.data.success){
    totalPhanTramError.value = res.data.content
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
}
onMounted(() => {
  totalUpdate()
  totalUpdateDistrics()
  totalPhanTranData()
  totalPhanTranDataError()
})
</script>

<style>
/* Màn hình chờ */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  pointer-events: all; /* Kích hoạt lớp phủ ngăn tương tác */
}

/* Biểu tượng spinner */
.spinner {
  border: 4px solid #f3f3f3; /* Light grey */
  border-top: 4px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
}

/* Hiệu ứng xoay */
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* Ngăn người dùng thao tác khi đang load */
body.loading {
  pointer-events: none; /* Ngăn tất cả tương tác */
  user-select: none; /* Ngăn chọn văn bản */
}
</style>