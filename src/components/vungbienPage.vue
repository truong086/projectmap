<template>
  <div>
    <input 
      v-model="districtQuery" 
      placeholder="Nhập tên quận..." 
      @keyup.enter="fetchGoogleBoundary"
    />
    <GMapMap
      ref="mapRef"
      :center="center"
      :zoom="12"
      style="width: 100%; height: 500px"
    >
      <GMapPolygon
        v-if="boundaryCoordinates.length > 0"
        :paths="boundaryCoordinates"
        :options="polygonOptions"
      />
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

    // Tùy chọn style cho polygon
    const polygonOptions = {
      fillColor: '#FF0000',
      fillOpacity: 0.3,
      strokeColor: '#FF0000',
      strokeWeight: 2,
    };

    // Hàm lấy ranh giới từ tên quận
    const fetchGoogleBoundary = async () => {
  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ address: districtQuery.value }, (results, status) => {
    if (status === "OK" && results[0].geometry) {
      const bounds = results[0].geometry.viewport;
      const coordinates = [
        { lat: bounds.getNorthEast().lat(), lng: bounds.getSouthWest().lng() },
        { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
        { lat: bounds.getSouthWest().lat(), lng: bounds.getNorthEast().lng() },
        { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() },
      ];
      boundaryCoordinates.value = coordinates;
    }
  });
};

    return {
      districtQuery,
      boundaryCoordinates,
      center,
      mapRef,
      polygonOptions,
      fetchGoogleBoundary
    };
  },
};
</script>