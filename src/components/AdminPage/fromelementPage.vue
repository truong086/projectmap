<template>
    <div class="page-header">
              <h3 class="page-title"> Form elements </h3>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item"><a href="#">Forms</a></li>
                  <li class="breadcrumb-item active" aria-current="page">Form elements</li>
                </ol>
              </nav>
            </div>
            <div class="row">
              <div class="col-md-6 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Default form</h4>
                    <p class="card-description"> Basic form layout </p>
                    <div style="margin: 10px 0;">
                        <div v-if="dataNewId.id != null" style="width: 550px; height: 200px; background-color: rgba(255, 255, 255, 0.4); border-radius: 10px;">
                            <div v-if="dataNewId.isError">
            <div v-if="dataNewId.statusError == 0" style="cursor: pointer; border-radius: 10px; padding: 20px; margin-bottom: 10px;">
              <h4>category Code: {{ dataNewId.categoryCode }}</h4>
              <div style="display: flex;">
                <div>
                    <p style="font-size: 12px;">IdentificationCode: <strong>{{ dataNewId.identificationCode }}</strong></p>
                    <p style="font-size: 12px;">Lat: <strong>{{ dataNewId.latitude }}</strong></p>
                    <p style="font-size: 12px;">Lng: <strong>{{ dataNewId.longitude }}</strong></p>
                </div>
                <div>
                    <p style="font-size: 12px;">signal Number: <strong>{{ dataNewId.signalNumber }}</strong></p>
                    <p style="font-size: 12px;">Types Of Signal: <strong>{{ dataNewId.typesOfSignal }}</strong></p>
                    <p style="font-size: 20px; font-weight: bold;">Status: <i class="fa fa-window-close-o" style="animation: thei1 0.5s ease-in-out infinite;" aria-hidden="true"></i></p>
                </div>
              </div>
             
            </div>
            
            <div v-if="dataNewId.statusError == 1" style="cursor: pointer; border-radius: 10px; padding: 20px; margin-bottom: 10px;">
                <h4>category Code: {{ dataNewId.categoryCode }}</h4>
                <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ dataNewId.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ dataNewId.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ dataNewId.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ dataNewId.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ dataNewId.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; color: greenyellow;">Status: <i class="fa fa-check" aria-hidden="true"></i></p>
            </div>
            </div>
              
            </div>

            <div v-if="dataNewId.statusError == 2" style="cursor: pointer; border-radius: 10px; padding: 20px; margin-bottom: 10px;">
                <h4>category Code: {{ dataNewId.categoryCode }}</h4>
                <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ dataNewId.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ dataNewId.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ dataNewId.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ dataNewId.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ dataNewId.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; color: greenyellow; animation: thei1 0.5s ease-in-out infinite;">Status: <i class="fa fa-exclamation-triangle" aria-hidden="true"></i></p>
            </div>
            </div>
              
            </div>

            <div v-if="dataNewId.statusError == 3" style="cursor: pointer; border-radius: 10px; padding: 20px; margin-bottom: 10px;">
                <h4>category Code: {{ dataNewId.categoryCode }}</h4>
                <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ dataNewId.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ dataNewId.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ dataNewId.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ dataNewId.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ dataNewId.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; color: greenyellow; animation: thei2 0.5s ease-in-out infinite;">Status: <i class="fa fa-handshake-o" aria-hidden="true"></i></p>
            </div>
            </div>
              
            </div>
          </div>
          <div v-else style="cursor: pointer; padding: 20px; margin-bottom: 10px;">
            <h4>category Code: {{ dataNewId.categoryCode }}</h4>
            
            <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ dataNewId.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ dataNewId.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ dataNewId.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ dataNewId.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ dataNewId.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; color: greenyellow;"><i class="fa fa-check" aria-hidden="true"></i></p>
            </div>
            </div>
            
          </div>
                        </div>
                    </div>
                    <form class="forms-sample">
                      <div class="form-group">
                        <label for="exampleInputUsername1">fault Codes</label>
                        <select v-model="addData.faultCodes" style="border-radius: 10px; padding: 10px; margin: 0 10px;">
                          <option value="0">號誌正常</option>
                          <option value="1">號誌設備故障</option>
                          <option value="2">號誌停電</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="exampleInputEmail1">repair Status</label>
                        <select v-model="addData.repairStatus" style="border-radius: 10px; padding: 10px; margin: 0 10px;">
                          <option value="0">尚未確認</option>
                          <option value="1">已分配工程師</option>
                          <option value="2">工程師正在維修中</option>
                          <option value="3">已完成維修</option>
                        </select>
                      </div>
                      <div class="form-group">
                        <label for="exampleInputPassword1">remark</label>
                        <input type="text" class="form-control" v-model="addData.remark" id="exampleInputPassword1" placeholder="remark">
                      </div>
                      
                      <button type="button" class="btn btn-primary me-2" @click="add">Submit</button>
                      <button class="btn btn-dark">Cancel</button>
                    </form>
                  </div>
                </div>
              </div>
              <div class="col-md-6 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Horizontal Form</h4>
                    <p class="card-description"> Horizontal form layout </p>
                    <div>
                        <input type="text" v-model="valueE" style="border: none; padding: 5px 10px; border-radius: 10px;" placeholder="Search...">
                        <button v-on:click="findAllDataMap(valueE, page)" style="outline: none; cursor: pointer; border: none; padding: 5px 15px; border-radius: 10px; margin: 10px 5px;">💨</button>
                    </div>
                    <div style=" padding: 10px; width: 550px; height: 400px; overflow: auto; background-color: rgba(255, 255, 255, 0.8); border: 1px solid black; border-radius: 10px;">
        <div v-for="(location, index) in locations" :key="index">
          <div v-if="location.isError">
            <div v-if="location.statusError == 0" @click="showDataMap(location)" style="cursor: pointer; border: 1px dashed black; border-radius: 10px; padding: 10px; margin-bottom: 10px;">
              <h4>category Code: {{ location.categoryCode }}</h4>
              <div style="display: flex;">
                <div>
                    <p style="font-size: 12px;">IdentificationCode: <strong>{{ location.identificationCode }}</strong></p>
                    <p style="font-size: 12px;">Lat: <strong>{{ location.latitude }}</strong></p>
                    <p style="font-size: 12px;">Lng: <strong>{{ location.longitude }}</strong></p>
                </div>
                <div>
                    <p style="font-size: 12px;">signal Number: <strong>{{ location.signalNumber }}</strong></p>
                    <p style="font-size: 12px;">Types Of Signal: <strong>{{ location.typesOfSignal }}</strong></p>
                    <p style="font-size: 20px; font-weight: bold;">Status: <i class="fa fa-window-close-o" style="animation: thei1 0.5s ease-in-out infinite;" aria-hidden="true"></i></p>
                </div>
              </div>
             
            </div>
            
            <div v-if="location.statusError == 1" @click="showDataMap(location)" style="cursor: pointer; border: 1px dashed black; border-radius: 10px; padding: 10px; margin-bottom: 10px;">
                <h4>category Code: {{ location.categoryCode }}</h4>
                <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ location.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ location.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ location.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ location.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; color: greenyellow;">Status: <i class="fa fa-check" aria-hidden="true"></i></p>
            </div>
            </div>
              
            </div>

            <div v-if="location.statusError == 2" @click="showDataMap(location)" style="cursor: pointer; border: 1px dashed black; border-radius: 10px; padding: 10px; margin-bottom: 10px;">
                <h4>category Code: {{ location.categoryCode }}</h4>
                <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ location.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ location.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ location.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ location.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; color: greenyellow; animation: thei1 0.5s ease-in-out infinite;">Status: <i class="fa fa-exclamation-triangle" aria-hidden="true"></i></p>
            </div>
            </div>
              
            </div>

            <div v-if="location.statusError == 3" @click="showDataMap(location)" style="cursor: pointer; border: 1px dashed black; border-radius: 10px; padding: 10px; margin-bottom: 10px;">
                <h4>category Code: {{ location.categoryCode }}</h4>
                <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ location.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ location.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ location.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ location.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; color: greenyellow; animation: thei2 0.5s ease-in-out infinite;">Status: <i class="fa fa-handshake-o" aria-hidden="true"></i></p>
            </div>
            </div>
              
            </div>
          </div>
          <div v-else style="cursor: pointer; border: 1px dashed black; border-radius: 10px; padding: 10px; margin-bottom: 10px;" @click="showDataMap(location)">
            <h4>category Code: {{ location.categoryCode }}</h4>
            
            <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ location.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ location.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ location.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ location.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; color: greenyellow;"><i class="fa fa-check" aria-hidden="true"></i></p>
            </div>
            </div>
            
          </div>
        </div>
        <PagesTotal :page="page" :totalPage="totalPage" :valueE="valueE" @pageChange="findAllDataMap" @pageSizeChange="changeReload"></PagesTotal>
       </div>
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
  import { ref, onMounted, getCurrentInstance, watch } from "vue";
  import axios from "axios";
  import PagesTotal from "../PageList/PagesTotal.vue";
  import { useCounterStore } from "../../store";
  import { useRoute } from "vue-router";

  const valueE = ref("")
  const page = ref(1)
  const totalPage = ref(0)
  const pageSize = ref(5)
  const dataLoadStart = ref([])
  const locations = ref([])
  const store = useCounterStore();
  const route = useRoute()

  const addData = ref({
    traff_id: 0,
    faultCodes: 0,
    repairStatus: 0,
    user_id: 0,
    remark: ""
  })

  onMounted(() => {
    findAllDataMap(valueE.value, page.value)
    if(route.query.id){
      findOneData(route.query.id)
    }
  })

  watch(page.value, (newPage) => {
    findAllDataMap(valueE.value, newPage)
})

const dataNewId = ref({})
const { proxy } = getCurrentInstance();
const hostName = proxy?.hostname;
const isLoading = ref(false)

const findOneData = async (id) => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";
  
  const res = await axios.get(hostName + `/api/TrafficEquipment/FindOneId?id=${id}`, getToken())
  if(res.data.success){
    dataNewId.value = res.data.content
    
    console.log("dataNewId.value", dataNewId.value)
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
}
const add = async () => {
  if(dataNewId.value.id == null)
      return

  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  addData.value.traff_id = dataNewId.value.id
  const res = await axios.post(hostName + '/api/RepairDetails/Add', addData.value, getToken())
  if(res.data.success){
    alert("Success")
  }else{
    alert(res.data.error)
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
}
const showDataMap = (location) => {
    dataNewId.value = location
}
const getToken = () => {
    var token = store.getToken;
    var result = {
      headers: { Authorization: `Bearer ${token}` },
    };
    return result;
  };

const changeReload = (event) =>{
    pageSize.value = event
    findAllDataMap(valueE.value, page.value)
  }
const findAllDataMap = async (searchData, pageData) => {
    isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";
    const res = searchData == "" ? await axios.get(hostName + `/api/TrafficEquipment/FindAll?page=${pageData}&pageSize=${pageSize.value}`, getToken())
    : await axios.get(hostName + `/api/TrafficEquipment/FindAll?name=${searchData}&page=${pageData}&pageSize=${pageSize.value}`, getToken())

    if(res.data.success){
        dataLoadStart.value = res.data.content.data.map(m => ({
            ...m,
            coordinates: { lat: m.latitude, lng: m.longitude }
        }))

        console.log(dataLoadStart.value)
        locations.value = dataLoadStart.value
        page.value = res.data.content.page;
        totalPage.value = res.data.content.totalPages;
    }
    console.log(res)
    isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
}


</script>

<style scoped>
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