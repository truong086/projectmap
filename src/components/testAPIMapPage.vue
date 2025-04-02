<template>
  <GMapMap
    ref="mapRef"
    :center="mapCenter"
    :zoom="zoomLevel"
    map-type-id="roadmap"
    style="width: 100%; height: 500px"
  ></GMapMap>
</template>

<script setup>
 /* global google */
import { ref, onMounted } from "vue";

const mapRef = ref(null);
const mapCenter = ref({ lat: 34.04924594193164, lng: -118.24104309082031 });
const zoomLevel = ref(13);

onMounted(() => {
  const checkMapLoaded = setInterval(() => {
    if (mapRef.value?.$mapObject) {
      clearInterval(checkMapLoaded);
      const trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(mapRef.value.$mapObject);
    }
  }, 500);
});
</script>

<style scoped>
/* Style cho bản đồ nếu cần */
</style>
