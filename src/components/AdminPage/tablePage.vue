<template>
    <div class="page-header">
              <h3 class="page-title"> Basic Tables </h3>
              <nav aria-label="breadcrumb">
                <ol class="breadcrumb">
                  <li class="breadcrumb-item"><a href="#">Tables</a></li>
                  <li class="breadcrumb-item active" aria-current="page">Basic tables</li>
                </ol>
              </nav>
            </div>
            <div class="main-panel">
          <div class="content-wrapper" v-if="dataNewId.id != null">
            <div class="row">
              <div class="col-lg-6 grid-margin stretch-card" style="width: 1200px;">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Basic Table</h4>
                    <p class="card-description"> Add class <code>.table</code>
                    </p>
                    <div style="margin: 10px 0; display: flex;">
                        <div v-if="dataNewId.id != null" style="width: 550px; height: 200px; background-color: rgba(255, 255, 255, 0.4); border-radius: 10px;">
                            <div>
                            <div v-if="dataNewId.repairStatus == 0" style="cursor: pointer; border-radius: 10px; padding: 20px; margin-bottom: 10px;">
                              <h4>category Code: {{ dataNewId.categoryCode }}</h4>
                              <div style="display: flex;">
                                <div>
                                    <p style="font-size: 12px;">IdentificationCode: <strong>{{ dataNewId.identificationCode }}</strong></p>
                                    <p style="font-size: 12px;">Lat: <strong>{{ dataNewId.lat }}</strong></p>
                                    <p style="font-size: 12px;">Lng: <strong>{{ dataNewId.log }}</strong></p>
                                </div>
                                <div>
                                    <p style="font-size: 12px;">signal Number: <strong>{{ dataNewId.signalNumber }}</strong></p>
                                    <p style="font-size: 12px;">Types Of Signal: <strong>{{ dataNewId.typesOfSignal }}</strong></p>
                                    <p style="font-size: 20px; font-weight: bold;">Status: <i class="fa fa-window-close-o" style="animation: thei1 0.5s ease-in-out infinite;" aria-hidden="true"></i></p>
                                    <div v-if="dataNewId.images.length > 0 && dataNewId.images != null">
                                              <div  v-for="(image, indexImage) in dataNewId.images" :key="indexImage">
                                                <img @click="expandVideo(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                                <div v-if="image != null && getFileType(image) === 'video'" @click="expandVideo(image)">
                                                  <video
                                                @click="expandVideo(image)"
                                                    autoplay
                                                    muted
                                                    loop
                                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                                    :src="image"
                                                  />
                                                </div>
                                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                                              </div>
                                            </div>
                                  </div>
                              </div>
                            
                            </div>
                            
                            <div v-if="dataNewId.repairStatus == 1" style="cursor: pointer; border-radius: 10px; padding: 20px; margin-bottom: 10px;">
                                <h4>category Code: {{ dataNewId.categoryCode }}</h4>
                                <div style="display: flex;">
                              <div>
                              <p style="font-size: 12px;">IdentificationCode: <strong>{{ dataNewId.identificationCode }}</strong></p>
                              <p style="font-size: 12px;">Lat: <strong>{{ dataNewId.lat }}</strong></p>
                              <p style="font-size: 12px;">Lng: <strong>{{ dataNewId.log }}</strong></p>
                            </div>
                            <div>
                              <p style="font-size: 12px;">signal Number: <strong>{{ dataNewId.signalNumber }}</strong></p>
                              <p style="font-size: 12px;">Types Of Signal: <strong>{{ dataNewId.typesOfSignal }}</strong></p>
                              <p style="font-size: 20px; color: greenyellow;">Status: <i class="fa fa-check" aria-hidden="true"></i></p>
                              
                            </div>
                            <div>
                              <select v-model="dataNewId.repairStatus" @change="updateDataStatus(dataNewId.id)" style="border-radius: 10px; padding: 10px; margin: 0 10px;">
                                          <option value="0">尚未確認</option>
                                          <option value="1">已分配工程師</option>
                                          <option value="2">工程師正在維修中</option>
                                          <option value="3">已完成維修</option>
                                        </select>

                                        <select v-model="dataNewId.faultCodes" @change="updateDataStatus(dataNewId.id)" style="border-radius: 10px; padding: 10px; margin: 15px 10px;">
                                          <option value="0">號誌正常</option>
                                          <option value="1">號誌設備故障</option>
                                          <option value="2">號誌停電</option>
                                        </select>
                                        <div v-if="dataNewId.images.length > 0 && dataNewId.images != null" style="display: flex;">
                                              <div  v-for="(image, indexImage) in dataNewId.images" :key="indexImage">
                                                <img @click="expandVideo(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                                <div v-if="image != null && getFileType(image) === 'video'" @click="expandVideo(image)">
                                                  <video
                                                @click="expandVideo(image)"
                                                    autoplay
                                                    muted
                                                    loop
                                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                                    :src="image"
                                                  />
                                                </div>
                                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                                              </div>
                                            </div>
                                      </div>

                                      
                            </div>
                            </div>

                            <div v-if="dataNewId.repairStatus == 2" style="cursor: pointer; border-radius: 10px; padding: 20px; margin-bottom: 10px;">
                                <h4>category Code: {{ dataNewId.categoryCode }}</h4>
                                <div style="display: flex;">
                              <div>
                              <p style="font-size: 12px;">IdentificationCode: <strong>{{ dataNewId.identificationCode }}</strong></p>
                              <p style="font-size: 12px;">Lat: <strong>{{ dataNewId.lat }}</strong></p>
                              <p style="font-size: 12px;">Lng: <strong>{{ dataNewId.log }}</strong></p>
                            </div>
                            <div>
                              <p style="font-size: 12px;">signal Number: <strong>{{ dataNewId.signalNumber }}</strong></p>
                              <p style="font-size: 12px;">Types Of Signal: <strong>{{ dataNewId.typesOfSignal }}</strong></p>
                              <p style="font-size: 20px; color: greenyellow; animation: thei1 0.5s ease-in-out infinite;">Status: <i class="fa fa-exclamation-triangle" aria-hidden="true"></i></p>
                            </div>
                            <div>
                              <select v-model="dataNewId.repairStatus" @change="updateDataStatus(dataNewId.id)" style="border-radius: 10px; padding: 10px; margin: 0 10px;">
                                          <option value="0">尚未確認</option>
                                          <option value="1">已分配工程師</option>
                                          <option value="2">工程師正在維修中</option>
                                          <option value="3">已完成維修</option>
                                        </select>

                                        <select v-model="dataNewId.faultCodes" @change="updateDataStatus(dataNewId.id)" style="border-radius: 10px; padding: 10px; margin: 15px 10px;">
                                          <option value="0">號誌正常</option>
                                          <option value="1">號誌設備故障</option>
                                          <option value="2">號誌停電</option>
                                        </select>

                                        <div v-if="dataNewId.images.length > 0 && dataNewId.images != null" style="display: flex; margin: 0 50px;">
                                              <div  v-for="(image, indexImage) in dataNewId.images" :key="indexImage">
                                                <img @click="expandVideo(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                                <div v-if="image != null && getFileType(image) === 'video'" @click="expandVideo(image)">
                                                  <video
                                                @click="expandVideo(image)"
                                                    autoplay
                                                    muted
                                                    loop
                                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                                    :src="image"
                                                  />
                                                </div>
                                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                                              </div>
                                            </div>
                            </div>
                            </div>
                              
                            </div>

                            <div v-if="dataNewId.repairStatus == 3" style="cursor: pointer; border-radius: 10px; padding: 20px; margin-bottom: 10px;">
                                <h4>category Code: {{ dataNewId.categoryCode }}</h4>
                                <div style="display: flex;">
                              <div>
                              <p style="font-size: 12px;">IdentificationCode: <strong>{{ dataNewId.identificationCode }}</strong></p>
                              <p style="font-size: 12px;">Lat: <strong>{{ dataNewId.lat }}</strong></p>
                              <p style="font-size: 12px;">Lng: <strong>{{ dataNewId.log }}</strong></p>
                            </div>
                            <div>
                              <p style="font-size: 12px;">signal Number: <strong>{{ dataNewId.signalNumber }}</strong></p>
                              <p style="font-size: 12px;">Types Of Signal: <strong>{{ dataNewId.typesOfSignal }}</strong></p>
                              <p style="font-size: 20px; color: greenyellow; animation: thei2 0.5s ease-in-out infinite;">Status: <i class="fa fa-handshake-o" aria-hidden="true"></i></p>
                              <div v-if="dataNewId.images.length > 0 && dataNewId.images != null">
                                              <div  v-for="(image, indexImage) in dataNewId.images" :key="indexImage">
                                                <img @click="expandVideo(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                                <div v-if="image != null && getFileType(image) === 'video'" @click="expandVideo(image)">
                                                  <video
                                                @click="expandVideo(image)"
                                                    autoplay
                                                    muted
                                                    loop
                                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                                    :src="image"
                                                  />
                                                </div>
                                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                                              </div>
                                            </div>
                            </div>
                            </div>
                              
                            </div>
                          </div>

                          
                        </div>

                        <div>
                            <GMapMap
                                ref="mapRefs"
                                :center="mapCenter"
                                :zoom="zoomLevel"
                                style="width: 500px; height: 200px; border-radius: 10px; margin-left: 30px;"
                                :options="mapOptions"
                              >
                              <GMapMarker :position="userLocation" />
                            </GMapMap>
                          </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- partial -->
        </div>
            <div class="row">
              <div class="col-lg-12 grid-margin stretch-card">
                <div class="card">
                  <div class="card-body">
                    <h4 class="card-title">Striped Table</h4>
                    <p class="card-description"> Add class <code>.table-striped</code>
                    </p>
                    <div class="table-responsive">
                      <table class="table table-striped">
                        <thead>
                          <tr>
                            <th> id </th>
                            <th> lat </th>
                            <th> log </th>
                            <th> managementUnit </th>
                            <th> signalNumber </th>
                            <th> user_name </th>
                            <th> faultCodes </th>
                            <th> repairStatus </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="(item, index) in dataLoadStart" :key="index">
                            <td style="color: white;">
                              {{ item.id }}
                            </td>
                            <td style="color: white;"> {{ item.lat }} </td>
                            <td style="color: white;">
                              {{ item.log }}
                            </td>
                            <td style="color: white;"> {{ item.managementUnit }} </td>
                            <td v-if="item.images.length > 0 && item.images != null">
                              <div  v-for="(image, indexImage) in item.images" :key="indexImage">
                                <img @click="expandVideo(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && getFileType(image) === 'video'" @click="expandVideo(image)">
                                  <video
                                @click="expandVideo(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                              </div>
                            </td>
                            <td style="color: white;"> {{ item.signalNumber }} </td>
                            <td style="color: white;"> {{ item.user_name }} </td>
                            <td style="color: white;"> 
                              <div v-if="item.faultCodes == 0">
                                <p>號誌正常</p>
                            </div> 
                            <div v-else-if="item.faultCodes == 1">
                                <p>號誌設備故障</p>
                            </div> 
                            <div v-else-if="item.faultCodes == 2">
                                <p>號誌停電</p>
                            </div> 
                          </td>
                            <td style="color: white;"> 
                              <div v-if="item.repairStatus == 0" style="display: flex;">
                                <i class="fa fa-window-close-o" style="animation: thei1 0.5s ease-in-out infinite;" aria-hidden="true"></i>
                                <div style="margin: 0 10px;">
                                <button @click="addDataPlan(item.id)" style="border: none; outline: none; padding: 10px 25px; border-radius: 10px; background-color: red; color: white;">
                                  Nhận
                                </button>
                              </div>
                              </div> 

                              <div v-else-if="item.repairStatus == 1" style="display: flex;">
                                <i class="fa fa-check" style="animation: thei2 0.5s ease-in-out infinite;" aria-hidden="true"></i>
                                <div style="margin: 0 10px;">
                                <button @click="updateData(item.id)" style="border: none; outline: none; padding: 10px 25px; border-radius: 10px; background-color: yellow; color: back;">
                                  Update
                                </button>
                              </div>
                              </div> 

                              
                              <div v-else-if="item.repairStatus == 2" style="display: flex;">
                                <i class="fa fa-exclamation-triangle" style="animation: thei2 0.5s ease-in-out infinite;" aria-hidden="true"></i>
                                <div style="margin: 0 10px;">
                                <button @click="updateData(item.id)" style="border: none; outline: none; padding: 10px 25px; border-radius: 10px; background-color: yellow; color: black;">
                                  Update
                                </button>
                              </div>
                              </div> 

                              <div v-else-if="item.repairStatus == 3">
                                <i class="fa fa-handshake-o" style="animation: thei1 0.5s ease-in-out infinite;" aria-hidden="true"></i>
                              
                              </div> 

                              
                          </td>
                          </tr>
                        </tbody>
                      </table>

                      <div v-if="expandedIndex !== null && getFileType(expandedIndex) === 'video'" class="modal-overlay" @click="closeModal">
                          <div class="modal-content">
                            <video v-if="getFileType(expandedIndex) === 'video'" :src="expandedIndex" controls></video>
                          </div>
                        </div>

                       <!-- Modal khi phóng to video -->
                        <div v-else-if="expandedIndex !== null && getFileType(expandedIndex) === 'image'" style="width: 500px; margin: 0 auto; top: 50%; left: 50%; transform: translate(-50%, -50%);" class="modal-overlay" @click="closeModal">
                          <div class="modal-content">
                            <img v-if=" getFileType(expandedIndex) === 'image'" :src="expandedIndex" alt="">
                          </div>
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              <PagesTotal :page="page" :totalPage="totalPage" :valueE="valueE" @pageChange="findAllDataMap" @pageSizeChange="changeReload"></PagesTotal>
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

  const valueE = ref("")
  const page = ref(1)
  const totalPage = ref(0)
  const pageSize = ref(5)
  const dataLoadStart = ref([])
  const locations = ref([])
  const userLocation = ref(null)
  const mapCenter = ref({ lat: 22.841228204468152, lng: 120.26414714944056 });
  const zoomLevel = ref(21);
  const store = useCounterStore();
  const mapOptions = {
  mapTypeId: 'satellite',
  disableDefaultUI: true,
  draggable: false,
  zoomControl: false,
  scrollwheel: false,
  disableDoubleClickZoom: true,
  keyboardShortcuts: false,
}

  const dataNewId = ref({})
  onMounted(() => {
    findAllDataMap(valueE.value, page.value)
  })

  watch(page.value, (newPage) => {
    findAllDataMap(valueE.value, newPage)
})

const { proxy } = getCurrentInstance();
const hostName = proxy?.hostname;
const isLoading = ref(false)
const expandedIndex = ref(null);

// Mở modal phóng to video
const expandVideo = (index) => {
  expandedIndex.value = index;
};

// Đóng modal
const closeModal = () => {
  expandedIndex.value = null;
};
const getFileType = (url) => {
  const extension = url.split('.').pop().toLowerCase()

  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) return 'image'
  if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video'
  if (['pdf'].includes(extension)) return 'pdf'
  if (['doc', 'docx'].includes(extension)) return 'word'
  if (['xls', 'xlsx'].includes(extension)) return 'excel'

  return 'other'
}
const updateDataStatus = async (id) => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";
  const res = await axios.put(hostName + '/api/RepairDetails/UpdateByAccout', {id: id, status: dataNewId.value.repairStatus, faultCodes: dataNewId.value.faultCodes}, getToken())
  if(res.data.success){
    alert("Success")
    if(dataNewId.value.repairStatus == 3 || dataNewId.value.repairStatus == 0)
        dataNewId.value = {}
    findAllDataMap(valueE.value, page.value)
    
  }else{
    alert(res.data.error)
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
}
const updateData = async (id) => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";
  const res = await axios.get(hostName + `/api/RepairDetails/FindOneId?id=${id}`, getToken())
  if(res.data.success){
    dataNewId.value = res.data.content
    userLocation.value = {
        lat: dataNewId.value.lat,
        lng: dataNewId.value.log,
      }

       mapCenter.value = { lat: dataNewId.value.lat, lng: dataNewId.value.log };

       console.log("Data Id", dataNewId.value)
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
}

const addDataPlan = async (id) => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";
  const res = await axios.put(hostName + '/api/RepairDetails/Update', {id: id}, getToken())
  if(res.data.success){
    alert("Success")
    findAllDataMap(valueE.value, page.value)
  }else{
    alert(res.data.error)
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
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
    const res = searchData == "" ? await axios.get(hostName + `/api/RepairDetails/FindAll?page=${pageData}&pageSize=${pageSize.value}`, getToken())
    : await axios.get(hostName + `/api/RepairDetails/FindAll?name=${searchData}&page=${pageData}&pageSize=${pageSize.value}`, getToken())

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
.video-container {
  width: 100%;
  max-width: 400px;
  margin: 10px;
  cursor: pointer;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: #fff;
  padding: 20px;
  border-radius: 10px;
}

.modal-content video {
  width: 80vw;
  height: auto;
  max-width: 100%;
  max-height: 80vh;
}

.modal-content img {
  width: 50vw;
  height: auto;
  max-width: 100%;
  max-height: 50vh;
}

video {
  width: 100%;
  max-width: 100%;
  height: auto;
}


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