<template>
    <div class="container-scroller">
        <!-- <div class="row p-0 m-0 proBanner" id="proBanner">
        <div class="col-md-12 p-0 m-0">
          <div class="card-body card-body-padding d-flex align-items-center justify-content-between">
            <div class="ps-lg-1">
              <div class="d-flex align-items-center justify-content-between">
                <p class="mb-0 font-weight-medium me-3 buy-now-text">Free 24/7 customer support, updates, and more with this template!</p>
                <a href="https://www.bootstrapdash.com/product/corona-free/?utm_source=organic&utm_medium=banner&utm_campaign=buynow_demo" target="_blank" class="btn me-2 buy-now-btn border-0">Get Pro</a>
              </div>
            </div>
            <div class="d-flex align-items-center justify-content-between">
              <a href="https://www.bootstrapdash.com/product/corona-free/"><i class="mdi mdi-home me-3 text-white"></i></a>
              <button id="bannerClose" class="btn border-0 p-0">
                <i class="mdi mdi-close text-white me-0"></i>
              </button>
            </div>
          </div>
        </div>
      </div> -->
      <navPages></navPages>
      <div class="container-fluid page-body-wrapper">
        <headerPages></headerPages>
        <div class="main-panel" style="background-color: #e6ffff;">
            <div class="content-wrapper" style="background-color: #e6ffff;">
                <router-view></router-view>
                <!-- <dashboardPages></dashboardPages> -->
            </div>
            <foodterPagesd></foodterPagesd>
        </div>
      </div>
    </div>
</template>

<script setup>
// import dashboardPages from './dashboardPage.vue';
import foodterPagesd from './foodterPages.vue';
import headerPages from './headerPage.vue';
import navPages from './navPage.vue';
</script>