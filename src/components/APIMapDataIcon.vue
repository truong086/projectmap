<template>
  <div>
    <h3>Tìm kiếm và Tìm đường</h3>

    <!-- Tìm kiếm địa chỉ -->
    <div>
      <input
        v-model="searchAddress"
        type="text"
        placeholder="Nhập địa chỉ cần tìm"
        @keyup.enter="searchLocation"
      />
      <button @click="searchLocation">Tìm kiếm</button>
    </div>

    <!-- Nút tìm đường đến địa điểm đã chọn -->
    <div v-if="selectedLocation">
      <button @click="getDirections">Tìm đường đến {{ selectedLocation.address }}</button>
    </div>

    <div v-if="routeDistance">
    <p><strong>Khoảng cách:</strong> {{ routeDistance.toFixed(2) }} km</p>
  </div>

   <!-- Nút hiển thị lại số km -->
   <button v-if="routeDistance" @click="showDistance = !showDistance">
    {{ showDistance ? "Ẩn khoảng cách" : "Hiện khoảng cách" }}
  </button>

  <button v-if="locations.length > 0" @click="showDistanceList = !showDistanceList">
    {{ showDistanceList ? "Ẩn Data" : "Hiện Data" }}
  </button>

  <!-- Chọn phương tiện -->
  <select v-model="selectedTransport" @change="getDirections">
    <option value="driving-car">Ô tô</option>
    <option value="cycling-regular">Xe đạp</option>
    <option value="foot-walking">Đi bộ</option>
    <option value="driving-hgv">Xe tải</option>
    <option value="airplane">Máy bay</option>
  </select>
    <!-- Bản đồ -->
    <GMapMap
      :center="mapCenter"
      :zoom="zoomLevel"
      style="height: 500px; width: 100%;"
    >

    
      <!-- Marker cho tất cả vị trí tìm kiếm được -->
      <GMapMarker
        v-for="(location, index) in resolvedLocations"
        :key="index"
        :position="location.coordinates"
        :label="location.address"
        @click="showInfo(index)"
        
      >
          <!-- Hiển thị thông tin khi bấm vào marker -->
      <GMapInfoWindow
        v-if="selectedMarker === index"
        :options="{ maxWidth: 250 }"
        @closeclick="selectedMarker = null"
      >
        <div>
          <h4>{{ location.name }}</h4>
          <p>{{ location.details }}</p>

          <button @click="clickDataLocation(location)">🚗 Tìm đường</button>
        </div>
      </GMapInfoWindow>
  </GMapMarker>


  <!-- Marker cho tất cả vị trí tìm kiếm được -->
   <div v-for="(location, index) in locations" :key="index">
      <GMapMarker
      v-if="location.status == 1"
        :position="location.coordinates"
        :label="location.address"
        @click="showInfo(index)"
        :icon="{
          url: marker1.url,
          scaledSize: { width: 40, height: 40 }
        }"
      >
          <!-- Hiển thị thông tin khi bấm vào marker -->

           <GMapInfoWindow
                  v-if="selectedMarker === index && showDistanceList"
                  :options="{ maxWidth: 250 }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                      <h4>{{ location.name }}</h4>
                      <p>{{ location.details }}</p>

                      <button @click="clickDataLocation(location)">🚗 Tìm đường</button>
                  </div>
                  </GMapInfoWindow>
     
  </GMapMarker>
  <GMapMarker
      v-if="location.status == 2"
        :position="location.coordinates"
        :label="location.address"
        @click="showInfo(index)"
        :icon="{
          url: marker1.url,
          scaledSize: { width: 40, height: 40 }
        }"
      >
          <!-- Hiển thị thông tin khi bấm vào marker -->

           <GMapInfoWindow
                  v-if="selectedMarker === index && showDistanceList"
                  :options="{ maxWidth: 250 }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                      <h4>{{ location.name }}</h4>
                      <p>{{ location.details }}</p>

                      <button @click="clickDataLocation(location)">🚗 Tìm đường</button>
                  </div>
                  </GMapInfoWindow>
     
  </GMapMarker>

  <GMapMarker
      v-if="location.status == 3"
        :position="location.coordinates"
        :label="location.address"
        @click="showInfo(index)"
        :icon="{
          url: marker1.url,
          scaledSize: { width: 40, height: 40 }
        }"
      >
          <!-- Hiển thị thông tin khi bấm vào marker -->

           <GMapInfoWindow
                  v-if="selectedMarker === index && showDistanceList"
                  :options="{ maxWidth: 250 }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                      <h4>{{ location.name }}</h4>
                      <p>{{ location.details }}</p>

                      <button @click="clickDataLocation(location)">🚗 Tìm đường</button>
                  </div>
                  </GMapInfoWindow>
     
  </GMapMarker>
   </div>
  

      <!-- Marker cho vị trí hiện tại -->
      <GMapMarker
        :position="currentLocation"
        label="Bạn"
        :icon="{
          url: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
          scaledSize: { width: 40, height: 40 }
        }"
      />

      <!-- Đường đi -->
      <GMapPolyline
        v-if="routePath.length > 0 && selectedTransport !== 'airplane'"
        :path="routePath"
        :options="{
          strokeColor: '#A52A2A', // Màu đường
          strokeOpacity: 1.0,
          strokeWeight: 5
        }"
      />

        <!-- Hiển thị số km trên bản đồ -->
    <GMapMarker
      v-if="routeDistance && showDistance"
      :position="midPoint"
      label="📏"
       @click="showDistance = !showDistance"
    >
      <GMapInfoWindow>
        <div>
          <strong>Khoảng cách:</strong> {{ routeDistance.toFixed(2) }} km
        </div>
      </GMapInfoWindow>
    </GMapMarker>

     <!-- Nút trong bản đồ -->
     <div class="map-buttons">
      <button @click="searchLocation">📍 Tìm vị trí</button>
      <button @click="getDirections">🚗 Tìm đường</button>
    </div>
    </GMapMap>
  </div>
</template>

<script setup>
/* global google */
import { ref, onMounted, computed, onUnmounted } from "vue";
import axios from "axios";

// Vị trí trung tâm bản đồ (Hồ Chí Minh)
const mapCenter = ref({ lat: 10.762622, lng: 106.660172 });
const zoomLevel = ref(12);

// Vị trí hiện tại của người dùng
const currentLocation = ref({ lat: 10.762622, lng: 106.660172 });

// Danh sách địa chỉ và vị trí đã giải mã
const resolvedLocations = ref([]);
const searchAddress = ref("");
const selectedLocation = ref(null); // Địa điểm được chọn để tìm đường đi
const routePath = ref([]);
const routeDistance = ref(null); // Lưu khoảng cách quãng đường
// Khóa API của OpenRouteService
const apiKey = "5b3ce3597851110001cf6248bd48b134d5f8443fb2a538a1554ee87e";
const showDistance = ref(true);
const showDistanceList = ref(true);

// Danh sách địa điểm với thông tin chi tiết
const locations = ref([
{
  name: "Hà Nội",
  details: "Thủ đô của Việt Nam.",
  coordinates: { lat: 21.0285, lng: 105.8542 },
  status: 2,
  address: "Hà Nội"
},
{
  name: "Đà Nẵng",
  details: "Thành phố biển đẹp với nhiều cây cầu nổi tiếng.",
  coordinates: { lat: 16.0471, lng: 108.2062 },
  status: 1,
  address: "Đà Nẵng"
},
{
  name: "Hồ Chí Minh",
  details: "Thành phố sôi động nhất Việt Nam.",
  coordinates: { lat: 10.7769, lng: 106.7009 },
  status: 1,
  address: "Hồ Chí Minh"
},

{
  name: "luzhu",
  details: "Thành phố sôi động nhất Việt Nam.",
  coordinates: { lat: 25.04794556996055, lng: 121.30918812901263 },
  status: 3,
  address: "luzhu"
},
]);

// Lưu marker đang được chọn
const selectedMarker = ref(null);

const selectedTransport = ref("driving-car");

const intervalId = ref(null)
// Danh sách ảnh
const images = ref([
"https://png.pngtree.com/png-clipart/20230417/original/pngtree-return-of-investment-flat-icon-png-image_9064391.png",
"https://tse1.mm.bing.net/th?id=OIP.hJVb5niyA8--b88zKGj5zwHaHa&pid=Api&P=0&h=220",
"https://tse4.mm.bing.net/th?id=OIP.cdbGAINaMlm8uBalZf3QgAHaHa&pid=Api&P=0&h=220",
"https://png.pngtree.com/png-clipart/20230508/original/pngtree-megaphone-icon-png-image_9150343.png",
"https://img.lovepik.com/free-png/20211108/lovepik-sunlight-png-image_400507026_wh1200.png",
"https://cdn-icons-png.flaticon.com/512/25/25694.png"
]);

const marker1 = ref({
  url: images.value[0],
  scaledSize: { width: 40, height: 40 }
});

// Hàm đổi ảnh mỗi giây
const startImageRotation = () => {
let index = 0;
intervalId.value = setInterval(() => {
  index = (index + 1) % images.value.length; // Chuyển ảnh tiếp theo
  marker1.value.url = images.value[index];
}, 100);
};

// const midPoint = ref(null)
// Công thức tính khoảng cách đường chim bay (Haversine)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
const R = 6371; // Bán kính Trái Đất (km)
const dLat = (lat2 - lat1) * (Math.PI / 180);
const dLon = (lon2 - lon1) * (Math.PI / 180);
const a =
  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
return R * c;
};
// Khi click vào marker, hiển thị thông tin
const showInfo = (index) => {
selectedMarker.value = index;
};

const clickDataLocation = (location) => {
  selectedLocation.value = location
  getDirections()
}
// Chuyển địa chỉ thành tọa độ
const geocodeAddress = async (address) => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results.length > 0) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        console.error(`Không tìm thấy địa chỉ: ${address}`);
        reject(status);
      }
    });
  });
};

// Tìm kiếm địa chỉ mới
const searchLocation = async () => {
  if (!searchAddress.value) {
    alert("Vui lòng nhập địa chỉ!");
    return;
  }

  try {
    const coordinates = await geocodeAddress(searchAddress.value);

    // Thêm địa chỉ mới vào danh sách
    resolvedLocations.value.push({
      address: searchAddress.value,
      coordinates,
    });

    // Cập nhật bản đồ
    mapCenter.value = coordinates;
    zoomLevel.value = 15;

    // Xóa ô input
    searchAddress.value = "";
  } catch (error) {
    alert("Không tìm thấy địa chỉ, vui lòng thử lại!");
  }
};

// Tìm đường đến vị trí đã chọn
const getDirections = async () => {
  if (!selectedLocation.value) {
    alert("Vui lòng chọn một địa điểm!");
    return;
  }

  const start = currentLocation.value; // Bắt đầu từ vị trí hiện tại
  const end = selectedLocation.value.coordinates; // Điểm đến đã chọn

  if (selectedTransport.value === "airplane") {
  // Tính khoảng cách đường bay
  const distanceKm = haversineDistance(start.lat, start.lng, end.lat, end.lng);
  routeDistance.value = distanceKm

  // midPoint.value = {
  //   lat: (start.lat + end.lat) / 2,
  //   lng: (start.lng + end.lng) / 2,
  // };
  return
  }
  const url = `https://api.openrouteservice.org/v2/directions/${selectedTransport.value}?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

  try {
    const response = await axios.get(url);
    console.log("Dữ liệu API trả về:", response.data);
    if (response.data.features && response.data.features.length > 0) {
      const route = response.data.features[0];
       const coordinates  = response.data.features[0].geometry.coordinates.map(coord => ({
        lat: coord[1],
        lng: coord[0]
      }));

      routePath.value = coordinates
      // Lấy khoảng cách (mét) và đổi sang km
    routeDistance.value = route.properties.segments[0].distance / 1000;

  //   const midIndex = Math.floor(coordinates.length / 2);
  //   midPoint.value = coordinates[midIndex];
    } else {
      console.error("Không tìm thấy tuyến đường nào!");
      routePath.value = []
      routeDistance.value = null
    }
  } catch (error) {
    console.error("Lỗi khi lấy đường đi:", error);
    routePath.value = []
    routeDistance.value = null
  }
};

// Lấy vị trí hiện tại của người dùng
const getCurrentLocation = () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        currentLocation.value = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        mapCenter.value = currentLocation.value;
      },
      (error) => {
        console.error("Lỗi khi lấy vị trí:", error);
      }
    );
  }
};

// Tính điểm giữa tuyến đường để hiển thị số km
const midPoint = computed(() => {
if (!routePath.value.length) return null;

const midIndex = Math.floor(routePath.value.length / 2);
return routePath.value[midIndex];
});

onMounted(() => {
  getCurrentLocation(); // Lấy vị trí hiện tại khi tải trang
  startImageRotation()
});

onUnmounted(() => {
  // clearInterval(intervalId.value)
  console.log("Hello World")
})
</script>


<style scoped>

/* CSS để hiển thị 2 nút trên bản đồ */
.map-buttons {
position: absolute;
top: 300px;
left: 10px;
z-index: 1000;
display: flex;
flex-direction: column;
}

.map-buttons button {
background-color: white;
border: 1px solid #ccc;
padding: 10px;
margin-bottom: 5px;
cursor: pointer;
font-weight: bold;
border-radius: 5px;
}

.map-buttons button:hover {
background-color: #f0f0f0;
}
</style>

