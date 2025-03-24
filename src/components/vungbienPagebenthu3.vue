<template>
    <div>
      <input 
        v-model="districtQuery" 
        placeholder="Nhập tên quận..." 
        @keyup.enter="fetchOSMBoundary"
      />
      <GMapMap
    :center="center"
    :zoom="12"
    style="width: 100%; height: 500px"
  >

  <div v-if="checkData">
    <GMapPolygon
      v-for="(island, index) in boundaryCoordinates"
      :key="index"
      :paths="island"
      :options="{
        fillColor: '#FF0000',
        fillOpacity: 0.3,
        strokeColor: '#FF0000',
        strokeWeight: 2,
      }"
    />
  </div>
  <div v-else>
    <GMapPolygon
    v-if="boundaryCoordinates.length > 0"
    :paths="boundaryCoordinates"
    :options="{ 
      fillColor: '#FF0000',
      fillOpacity: 0.3,
      strokeColor: '#FF0000',
      strokeWeight: 2,
    }"
  />
  </div>
    
  </GMapMap>
    </div>
  </template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const districtQuery = ref('');
    const boundaryCoordinates = ref([]);
    const center = ref({ lat: 21.0285, lng: 105.8542 }); // Mặc định Hà Nội
    const mapRef = ref(null);

    const checkData = ref(false)
    // Tùy chọn style cho polygon
    const polygonOptions = {
      fillColor: '#FF0000',
      fillOpacity: 0.3,
      strokeColor: '#FF0000',
      strokeWeight: 2,
    };

    // Hàm lấy ranh giới từ tên quận
    const fetchOSMBoundary = async () => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(districtQuery.value)}&format=json&polygon_geojson=1`
    );
    const data = await response.json();
    console.log("Nominatim Data:", data);

//     if (data.length > 0 && data[0].geojson) {
//         // Kiểm tra từng cấp dữ liệu để tránh truy cập vào undefined
// const combinedCoordinates =
//   data && // Kiểm data tồn tại
//   data.length > 0 && // Kiểm data có phần tử
//   data[0].geojson && // Kiểm geojson tồn tại
//   data[0].geojson.coordinates // Kiểm coordinates tồn tại
//     ? data[0].geojson.coordinates.length > 1 // Kiểm tra số lượng lớp
//       ? data[0].geojson.coordinates
//           .flat(2)
//           .map(([lng, lat]) => ({
//             lat: parseFloat(lat),
//             lng: parseFloat(lng),
//           }))
//       : data[0].geojson.coordinates[0].map(([lng, lat]) => ({
//           lat: parseFloat(lat),
//           lng: parseFloat(lng),
//         }))
//     : []; // Trả về mảng rỗng nếu dữ liệu không hợp lệ

// // Gán vào boundaryCoordinates
// boundaryCoordinates.value = combinedCoordinates;
            

// //   console.log("Combined Coordinates:", combinedCoordinates);
  
// //   // Gán vào boundaryCoordinates
// //   boundaryCoordinates.value = combinedCoordinates;
// //     console.log("Processed coordinates:", boundaryCoordinates.value);
        
//       center.value = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
//     }

if (data.length > 0 && data[0].geojson) {

    // TEST
    // let dataTest;
    // let arrTest = [];
    // data.forEach(element => {
    //     dataTest = element.geojson.coordinates
    //       .map((islandLayer) => {
    //             return islandLayer[0].map(([lng, lat]) => (arrTest.push({
    //                 lat: parseFloat(lat),
    //                 lng: parseFloat(lng),
    //             })));
    //         })
    // });

    // console.log("DataMap", arrTest)
    // console.log("DataMap2", dataTest)


    const combinedCoordinates =
  data && // Kiểm data tồn tại
  data.length > 0 && // Kiểm data có phần tử
  data[0].geojson && // Kiểm geojson tồn tại
  data[0].geojson.coordinates // Kiểm coordinates tồn tại
    ? data[0].geojson.coordinates.length > 1 // Kiểm tra số lượng lớp
      ? data[0].geojson.coordinates
          .map((islandLayer) => {
                return islandLayer[0].map(([lng, lat]) => ({
                lat: parseFloat(lat),
                lng: parseFloat(lng),
                }));
            })
      : data[0].geojson.coordinates[0].map(([lng, lat]) => ({
          lat: parseFloat(lat),
          lng: parseFloat(lng),
        }))
    : []; // Trả về mảng rỗng nếu dữ liệu không hợp lệ

  // Lấy danh sách các lớp (bỏ qua lớp đầu tiên - đất liền)
//   const islands = data[0].geojson.coordinates; // 👈 Lấy từ lớp thứ 2

//   // Chuyển đổi tọa độ cho từng đảo
//   const islandBoundaries = islands.map((islandLayer) => {
//     return islandLayer[0].map(([lng, lat]) => ({
//       lat: parseFloat(lat),
//       lng: parseFloat(lng),
//     }));
//   });

//   console.log("Danh sách các đảo:", islandBoundaries);
  
//   // Gán vào biến để vẽ
//   boundaryCoordinates.value = islandBoundaries;

console.log("Danh sách các đảo:", combinedCoordinates);
  
  // Gán vào biến để vẽ
  boundaryCoordinates.value = combinedCoordinates;

  checkData.value = data[0].geojson.coordinates.length > 1 ? true : false
  // Cập nhật tâm bản đồ
  center.value = {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}
  } catch (error) {
    console.error("Lỗi:", error);
  }
};

    return {
      districtQuery,
      boundaryCoordinates,
      center,
      mapRef,
      polygonOptions,
      fetchOSMBoundary,
    };
  },
};
</script>