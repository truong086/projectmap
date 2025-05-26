// src/google-map.js
import { defineGoogleMapConfig } from 'vue3-google-map';

export default defineGoogleMapConfig({
    key: 'AIzaSyCNPqyJ8qQrE8OjuvpyU66bPrNe1Ej9MRU',
    // libraries: ['places', 'visualization'] // Để hỗ trợ tìm kiếm
    libraries: 'places',
    language: 'zh-TW',
    v: 'beta'
});

