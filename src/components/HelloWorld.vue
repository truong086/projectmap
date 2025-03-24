<template>
  <div class="hello">
    <input
      type="text"
      v-model="searchQuery"
      placeholder="Nhập vị trí"
      @keyup.enter="searchLocation"
    />
    <GMapMap
      ref="mapRef"
      :center="center"
      :zoom="zoom"
      style="height: 500px; width: 100%;"
    >
      <GMapMarker :position="center" />
    </GMapMap>
  </div>
</template>

<script setup>
/* global google */
import {ref} from 'vue'

const searchQuery = ref('');
const center = ref({ lat: 10.762622, lng: 106.660172 })
const zoom = ref(12);
const mapRef = ref(null);

const searchLocation = () => {
      const geocoder = new google.maps.Geocoder();
      geocoder.geocode({ address: searchQuery.value }, (results, status) => {
        if (status === 'OK') {
          center.value = {
            lat: results[0].geometry.location.lat(),
            lng: results[0].geometry.location.lng(),
          };
          if (mapRef.value) {
            mapRef.value.panTo(center.value);
          }
        } else {
          alert('Không tìm thấy vị trí: ' + status);
        }
      });
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
