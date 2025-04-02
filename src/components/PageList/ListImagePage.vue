<template>
    <div style="width: 500px; display: flex; flex-wrap: wrap">
        <div v-for="(imageData, index) in data" :key="index">
            <img :src="imageData" @click="RemoveImage(index)" style="max-width: 100px; margin-bottom: 10px" />
        </div>
    </div>
  
</template>

<script>
export default {
  props: {
    data: {
      type: Array,
      default: () => []
    },
  },
  methods:{
    RemoveImage(index){
      this.$emit('removeImage', index)
    }
  }
};
</script>