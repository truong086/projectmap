<template>
  <div class="container">
    <div class="input-wrapper">
      <input v-model="inputText" type="text" placeholder="Nhập gì đó..." />
      <button @click="showSquare = true">Hiển thị ô vuông</button>

      <div v-if="showSquare" class="square"></div>
    </div>

    <!-- Các nội dung khác -->
    <div class="other-content">
      <p>Đây là các nội dung khác...</p>
      <p>Rất nhiều dòng dữ liệu...</p>
      <p>Tiếp tục kéo xuống...</p>
      <p>...</p>
      <p>...</p>
      <p>...</p>
      <p>...</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const inputText = ref('')
const showSquare = ref(false)
</script>

<style scoped>
.container {
  padding: 20px;
}

.input-wrapper {
  position: relative;
  margin-bottom: 2000px; /* giả sử có rất nhiều nội dung */
}

.square {
  width: 100px;
  height: 100px;
  background-color: white;
  border: 1px solid black;
  
  position: sticky;
  top: 80px; /* khoảng cách từ trên trình duyệt xuống */
  z-index: 100;
  margin-top: 10px;
}
</style>
