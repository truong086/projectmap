<template>
    <input type="text" v-model="Users.username">
    <input type="text" v-model="Users.password">
    <button @click="loginAPI">Gửi</button>
    <input type="file" accept="image/*" @change="handleImageUpload">
    <div class="preview-container" id="image-preview"></div>
    <img src="https://res.cloudinary.com/duzvgvsj5/image/upload/a597637a-3843-4fdd-a3da-c1d44cf274c0_BTThu4.jpg" alt="">
    <button @click="loadFile">Gửi</button>
</template>

<script setup>
import {ref} from 'vue'
import axios from 'axios'

const token = ref('')
const Users = ref({
    username: "",
    password: ""
})

const fileImage = ref(null)
const base64 = ref("")

const loginAPI = async () => {
    console.log(Users.value)
    const res = await axios.post("http://localhost:8081/login", Users.value)
    token.value = res.data
    console.log(res.data)
}
const loadFile = async () => {
    console.log("Token:  " + token.value)
    const file = new FormData()
    file.append("file", fileImage.value)
    // const res = await axios.post("http://localhost:8081/cloud/Add", file, {
    //     headers:{
    //         'Authorization': `Bearer ${token.value}`
    //     },
    // })

    // const res = await axios.get("http://localhost:8081/Student", {
    //     headers:{
    //         'Authorization': `Bearer ${token.value}`
    //     },
    //     withCredentials: true
    // })

    const res = await axios.post("http://localhost:8081/cloud/AddBase64", base64.value, {
      headers: {
        'Content-Type': 'application/json'  // Đảm bảo Content-Type là 'application/json'
      }
  })

    console.log(res)
}
// const previewImage = (event)  =>{
//             const file = event.target.files[0];
            
//             if (file) {
//                 fileImage.value = event.target.files[0]
//                 const reader = new FileReader();
//                 reader.onload = function(e) {
//                     const preview = document.getElementById('image-preview');
//                     preview.innerHTML = `<img src="${e.target.result}" alt="Profile Picture Preview">`;
//                     base64.value = e.target.result.split(",")[1] // Lấy ra chuỗi Base64 loại bỏ "data:image/...;base64,"
//                 };
//                 reader.readAsDataURL(file);
//             }
//         }

const handleImageUpload = (event) => {
    const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();

        reader.onloadend = () => {
            base64.value = reader.result.split(',')[1]; // Chỉ lấy phần sau dấu phẩy của chuỗi Base64
            console.log(base64.value)
        };

        reader.readAsDataURL(file);
      }

      
  }
</script>