<!-- components/AutoCompletePlace.vue -->
<template>
  <div>
    <GMapAutocomplete
      placeholder="Nhập địa điểm..."
      @place_changed="handlePlaceChanged"
      class="input"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'

const selectedPlace = ref(null)

const handlePlaceChanged = (place) => {
  selectedPlace.value = place
  console.log('Địa điểm được chọn:', place)
}
</script>

<style scoped>
.input {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
}
</style>
