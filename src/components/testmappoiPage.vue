<template>
  <div class="map-container">
    <!-- Checkbox chọn School -->
    <label>
      <input type="checkbox" v-model="showSchool" @change="toggleSchool" />
      Hiển thị Trường học
    </label>

    <GMapMap
      ref="mapRef"
      :center="{ lat: 10.7769, lng: 106.7009 }"
      :zoom="14"
      :options="mapOptions"
      style="width: 100%; height: 500px"
    >
      <!-- Hiển thị marker đỏ nếu showSchool = true -->
      <GMapMarker
        v-for="(school, index) in schoolMarkers"
        :key="index"
        :position="school.position"
        :icon="schoolIcon"
      />
    </GMapMap>
  </div>
</template>

<script setup>
  /* global google */
import { ref } from "vue";

// Trạng thái chọn School
const showSchool = ref(false);
const mapOptions = ref({
  styles: [], // Ban đầu không có style
});
const schoolMarkers = ref([]);
const mapRef = ref(null);

// Icon màu đỏ cho trường học
const schoolIcon = {
  url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
  scaledSize: { width: 40, height: 40 }, // Điều chỉnh kích thước icon
};

// Hàm bật/tắt hiển thị School
const toggleSchool = () => {
  if (showSchool.value) {
    // Nếu bật, chỉ làm nổi bật trường học
    mapOptions.value.styles = [
      {
        featureType: "poi.school",
        elementType: "labels.text",
        stylers: [{ color: "#ff0000" }, { weight: "bold" }],
      },
    ];
    fetchSchools();
  } else {
    // Nếu tắt, xóa style và marker
    mapOptions.value.styles = [];
    schoolMarkers.value = [];
  }
};

// Tìm các trường học bằng Google Places API
const fetchSchools = () => {
  if (!mapRef.value ) return;

  const map = mapRef.value.$mapObject;
  const service = new google.maps.places.PlacesService(map);
  console.log("Map center:", map.getCenter());
  const request = {
    location: mapRef.value.$mapObject.getCenter(),
    radius: 5000, // Bán kính 5km
    type: ["school"], // Chỉ tìm trường học
  };

  console.log(service)
  service.nearbySearch(request, (results, status) => {
    console.log("Results:", results);
    console.log("Status:", status);

    if (status === google.maps.places.PlacesServiceStatus.OK) {
      schoolMarkers.value = results.map((place) => ({
        position: {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        },
      }));
    } else {
      console.error("Không tìm thấy trường học hoặc có lỗi với API", status);
    }
  });
};

</script>

<style scoped>
.map-container {
  width: 100%;
  height: 500px;
}
</style>
