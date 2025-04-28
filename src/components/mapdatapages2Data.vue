<template>
 
  <div style="height: 100vh; width: 100vw; margin-top: -60px;">
    
  <div style="position: relative; height: 100vh; width: 100vw;">
<!-- Bản đồ 
const mapOptions = {
  mapTypeControl: false, // 👈 Tắt nút chọn loại bản đồ (Map/Satellite)
  streetViewControl: false, // (tuỳ chọn) tắt street view
  fullscreenControl: false, // (tuỳ chọn) tắt full screen
  zoomControl: true // (tuỳ chọn) vẫn giữ thanh zoom
} 
-->
<GMapMap
      ref="mapRefs"
      :center="mapCenter"
      :zoom="zoomLevel"
      :options="{ styles: mapStyles[selectedTheme],  mapTypeControl: false, fullscreenControl: false }"
      style="height: 100vh; width: 100vw;"
      map-type-id="roadmap"
      @zoom_changed="onZoomChanged"
      @center_changed="onCenterChanged"
      @idle="onIdle"
    >

    <GMapTrafficLayer />
    <!-- "@zoom_changed" là bắt sự kiện khi người dùng phóng to, thu nhỏ bản đồ -->
    <div v-if="checkData">
  <GMapPolygon
    v-for="(island, index) in boundaryCoordinates"
    :key="index"
    :paths="island"
    :options="{
      fillColor: '#FF0000',
      fillOpacity: 0.3,
      strokeColor: '#FF0000',
      strokeWeight: 2,
    }"
  />
</div>
<div v-else>
  <GMapPolygon
  v-if="boundaryCoordinates.length > 0"
  :paths="boundaryCoordinates"
  :options="{ 
    fillColor: '#FF0000',
    fillOpacity: 0,
    strokeColor: '#FF0000',
    strokeWeight: 2,
  }"
/>
</div>
    
      <!-- Marker cho tất cả vị trí tìm kiếm được -->
      
      <GMapMarker
        v-for="(location, index) in resolvedLocations"
        :key="index"
        :position="location.coordinates"
        :label="location.address"
        @click="showInfo(location.coordinates + '' + index)"
        
      >
          <!-- Hiển thị thông tin khi bấm vào marker -->
      <GMapInfoWindow
        v-if="selectedMarker === location.coordinates + '' + index && showDistanceList"
        :options="{ maxWidth: 250 }"
        @closeclick="selectedMarker = null"
      >
        <div>
          <h4>{{ location.name }}</h4>
          <p>{{ location.details }}</p>

          <button :class="'s1d' + location.lat" @click="clickDataLocation(location, 'driving-car', 's1d' + location.lat)" style="margin-top: 20px; width: 30px; height: 30px; border-radius: 50%; border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;">🚗</button>
                      <button :class="'s12d' + location.lat" @click="clickDataLocation(location, 'cycling-regular', 's12d' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%; border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer; margin: 0 10px;"><i class="fa fa-bicycle" aria-hidden="true"></i></button>
                      <button :class="'s13d' + location.lat" @click="clickDataLocation(location, 'foot-walking', 's13d' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-blind" aria-hidden="true"></i></button>
                      <button :class="'s14d' + location.lat" @click="clickDataLocation(location, 'driving-hgv', 's14d' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer; margin: 0 10px;"><i class="fa fa-truck" aria-hidden="true"></i></button>
                      <button :class="'s15d' + location.lat" @click="clickDataLocation(location, 'driving-car', 's15d' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-motorcycle" aria-hidden="true"></i></button>

                      <button :class="'s16d' + location.lat" @click="clickDataLocation(location, 'wheelchair ', 's16d' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-wheelchair" aria-hidden="true"></i></button>
                      <button :class="'s17d' + location.lat" @click="clickDataLocation(location, 'foot-hiking', 's17d' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-map" aria-hidden="true"></i></button>
                      <button :class="'s18d' + location.lat" @click="clickDataLocation(location, 'cycling-electric', 's18d' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-battery-full" aria-hidden="true"></i></button>
        </div>
      </GMapInfoWindow>
  </GMapMarker>
  <!-- Marker cho tất cả vị trí tìm kiếm được -->
   <div v-for="(location, index) in locations" :key="index">
    <div v-if="zoomLevel >= 13 && showMarkers">
    <div v-if="location.isError">
      <GMapMarker
      v-if="location.statusError == 0 && showMarkers"
      :position="location.coordinates"
        @click="showInfo(location.coordinates.lat, location, 
        'status_' + location.id + '_' + index, 
        'div_' + location.id + '_' + index, 
        'divchu_' + location.id + '_' + index, 
        'details_' + location.id + '_' + index,
        location.id, index,
        location)"
        :icon="{
          // url: marker1.url, // Đây là đổi ảnh liên tục
          url: imageStatus.status0,
          scaledSize: { width: 40, height: 40 },
          anchor: { x: 25, y: 25 }, // Căn giữa ảnh marker
        }"

        class="marker-icon"
      >
          <!-- Hiển thị thông tin khi bấm vào marker 
            disableAutoPan: true: Là ngăn không cho di chuyển bản đồ
            -->
           <GMapInfoWindow
                  v-if="selectedMarker === location.coordinates.lat && showDistanceList"
                  :options="{ maxWidth: 250, disableAutoPan: true }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                    <p style="font-size: 12px;">Management Unit: <strong>{{ location.managementUnit }}</strong></p>
                      
                    </div>
                  </GMapInfoWindow>
  </GMapMarker>

      <GMapMarker
      v-if="location.statusError == 1 && showMarkers"
        :position="location.coordinates"
        @click="showInfo(location.coordinates.lat, location, 
        'status1_' + location.id + '_' + index, 
        'div1_' + location.id + '_' + index, 
        'divchu1_' + location.id + '_' + index, 
        'details1_' + location.id + '_' + index,
        location.id, index,
        location)"
        :icon="{
          // url: marker1.url, // Đây là đổi ảnh liên tục
          url: imageStatus.status1s,
          scaledSize: { width: 40, height: 40 },
          anchor: { x: 25, y: 25 }, // Căn giữa ảnh marker
        }"

        class="marker-icon"
      >
      <GMapInfoWindow
                  v-if="selectedMarker === location.coordinates.lat && showDistanceList"
                  :options="{ maxWidth: 250, disableAutoPan: true }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                    <p style="font-size: 12px;">Management Unit: <strong>{{ location.managementUnit }}</strong></p>
                      
                    </div>
                  </GMapInfoWindow>
          <!-- Hiển thị thông tin khi bấm vào marker -->
          <!--
           <GMapInfoWindow
                  v-if="selectedMarker === location.coordinates.lat && showDistanceList"
                  :options="{ maxWidth: 250 }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                    <h4>category Code: {{ location.categoryCode }}</h4>
                      <p>IdentificationCode: {{ location.identificationCode }}</p>
                      <p>Lat: {{ location.latitude }}</p>
                      <p>Lng: {{ location.longitude }}</p>
                      <p>signal Number: {{ location.signalNumber }}</p>
                      <p>Types Of Signal: {{ location.typesOfSignal }}</p>
                      <p style="font-size: 20px; color: greenyellow;">Status: <i class="fa fa-check" aria-hidden="true"></i></p>
                      <p v-if="location.account_user != null && location.account_user != ''">User Name: {{ location.account_user }}</p>
                      <div v-if="location.images.length > 0" style="display: flex; flex-wrap: wrap; justify-content: center;">
                        <div v-for="(image, index) in location.images" :key="index">
                          <img @click="showImage(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 50px; height: 50px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && getFileType(image) === 'video'" @click="showImage(image)">
                                  <video
                                @click="showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 50px; height: 50px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
                      <button :class="'s1' + location.lat" @click="clickDataLocation(location, 'driving-car', 's1' + location.lat)" style="margin-top: 20px; width: 30px; height: 30px; border-radius: 50%; border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;">🚗</button>
                      <button :class="'s12' + location.lat" @click="clickDataLocation(location, 'cycling-regular', 's12' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%; border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer; margin: 0 10px;"><i class="fa fa-bicycle" aria-hidden="true"></i></button>
                      <button :class="'s13' + location.lat" @click="clickDataLocation(location, 'foot-walking', 's13' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-blind" aria-hidden="true"></i></button>
                      <button :class="'s14' + location.lat" @click="clickDataLocation(location, 'driving-hgv', 's14' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer; margin: 0 10px;"><i class="fa fa-truck" aria-hidden="true"></i></button>
                      <button :class="'s15' + location.lat" @click="clickDataLocation(location, 'driving-car', 's15' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-motorcycle" aria-hidden="true"></i></button>

                      <button :class="'s16' + location.lat" @click="clickDataLocation(location, 'wheelchair', 's16' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-wheelchair" aria-hidden="true"></i></button>
                      <button :class="'s17' + location.lat" @click="clickDataLocation(location, 'foot-hiking', 's17' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-map" aria-hidden="true"></i></button>
                      <button :class="'s18' + location.lat" @click="clickDataLocation(location, 'cycling-electric', 's18' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-battery-full" aria-hidden="true"></i></button>
                      <button @click="clickDataUpdate(location.id)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;">💨💫</button>
                    </div>
                  </GMapInfoWindow>
                -->
  </GMapMarker>
  <GMapMarker
      v-if="location.statusError == 2 && showMarkers"
        :position="location.coordinates"
        @click="showInfo(location.coordinates.lat, location, 
        'status2_' + location.id + '_' + index, 
        'div2_' + location.id + '_' + index, 
        'divchu2_' + location.id + '_' + index, 
        'details2_' + location.id + '_' + index,
        location.id, index,
        location)"
        :icon="{
          // url: marker1.url, // Đây là đổi ảnh liên tục
          url: imageStatus.status2,
          scaledSize: { width: 40, height: 40 },
          anchor: { x: 25, y: 25 }, // Căn giữa ảnh marker
        }"

        class="marker-icon"
      >

      <GMapInfoWindow
                  v-if="selectedMarker === location.coordinates.lat && showDistanceList"
                  :options="{ maxWidth: 250, disableAutoPan: true }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                    <p style="font-size: 12px;">Management Unit: <strong>{{ location.managementUnit }}</strong></p>
                      
                    </div>
                  </GMapInfoWindow>
          <!-- Hiển thị thông tin khi bấm vào marker -->

          <!--
           <GMapInfoWindow
                  v-if="selectedMarker === location.coordinates.lat && showDistanceList"
                  :options="{ maxWidth: 250 }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                    <h4>category Code: {{ location.categoryCode }}</h4>
                      <p>IdentificationCode: {{ location.identificationCode }}</p>
                      <p>Lat: {{ location.latitude }}</p>
                      <p>Lng: {{ location.longitude }}</p>
                      <p>signal Number: {{ location.signalNumber }}</p>
                      <p>Types Of Signal: {{ location.typesOfSignal }}</p>

                      <p style="font-size: 20px; color: greenyellow; animation: thei1 0.5s ease-in-out infinite;">Status: <i class="fa fa-exclamation-triangle" aria-hidden="true"></i></p>
                      <p v-if="location.account_user != null && location.account_user != ''">User Name: {{ location.account_user }}</p>
                      <div v-if="location.images.length > 0" style="display: flex; flex-wrap: wrap; justify-content: center;">
                        <div v-for="(image, index) in location.images" :key="index">
                          <img @click="showImage(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 50px; height: 50px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && getFileType(image) === 'video'" @click="showImage(image)">
                                  <video
                                @click="showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 50px; height: 50px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
                      <button :class="'s2' + location.lat" @click="clickDataLocation(location, 'driving-car', 's2' + location.lat)" style="margin-top: 20px; width: 30px; height: 30px; border-radius: 50%; border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;">🚗</button>
                      <button :class="'s22' + location.lat" @click="clickDataLocation(location, 'cycling-regular', 's22' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%; border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer; margin: 0 10px;"><i class="fa fa-bicycle" aria-hidden="true"></i></button>
                      <button :class="'s23' + location.lat" @click="clickDataLocation(location, 'foot-walking', 's23' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-blind" aria-hidden="true"></i></button>
                      <button :class="'s24' + location.lat" @click="clickDataLocation(location, 'driving-hgv', 's24' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer; margin: 0 10px;"><i class="fa fa-truck" aria-hidden="true"></i></button>
                      <button :class="'s25' + location.lat" @click="clickDataLocation(location, 'driving-car', 's25' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-motorcycle" aria-hidden="true"></i></button>
                  
                      <button :class="'s26' + location.lat" @click="clickDataLocation(location, 'wheelchair ', 's26' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-wheelchair" aria-hidden="true"></i></button>
                      <button :class="'s27' + location.lat" @click="clickDataLocation(location, 'foot-hiking', 's27' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-map" aria-hidden="true"></i></button>
                      <button :class="'s28' + location.lat" @click="clickDataLocation(location, 'cycling-electric', 's28' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-battery-full" aria-hidden="true"></i></button>
                      <button @click="clickDataUpdate(location.id)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;">💨💫</button>
                    </div>
                  </GMapInfoWindow>
                -->
     
  </GMapMarker>

  <GMapMarker
      v-if="location.statusError == 3 && showMarkers"
        :position="location.coordinates"
        @click="showInfo(location.coordinates.lat, location, 
        'status3_' + location.id + '_' + index, 
        'div3_' + location.id + '_' + index, 
        'divchu3_' + location.id + '_' + index, 
        'details3_' + location.id + '_' + index,
        location.id, index,
        location)"
        :icon="{
          // url: marker1.url, // Đây là đổi ảnh liên tục
          url: imageStatus.status3,
          scaledSize: { width: 40, height: 40 },
          anchor: { x: 25, y: 25 }, // Căn giữa ảnh marker
        }"
        class="marker-icon"
      >
      <GMapInfoWindow
                  v-if="selectedMarker === location.coordinates.lat && showDistanceList"
                  :options="{ maxWidth: 250, disableAutoPan: true }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                    <p style="font-size: 12px;">Management Unit: <strong>{{ location.managementUnit }}</strong></p>
                      
                    </div>
                  </GMapInfoWindow>
      <!--
           <GMapInfoWindow
                  v-if="selectedMarker === location.coordinates.lat && showDistanceList"
                  :options="{ maxWidth: 250 }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                    <h4>category Code: {{ location.categoryCode }}</h4>
                      <p>IdentificationCode: {{ location.identificationCode }}</p>
                      <p>Lat: {{ location.latitude }}</p>
                      <p>Lng: {{ location.longitude }}</p>
                      <p>signal Number: {{ location.signalNumber }}</p>
                      <p>Types Of Signal: {{ location.typesOfSignal }}</p>

                      <p style="font-size: 20px; color: greenyellow; animation: thei2 0.5s ease-in-out infinite;">Status: <i class="fa fa-handshake-o" aria-hidden="true"></i></p>
                      <p v-if="location.account_user != null && location.account_user != ''">User Name: {{ location.account_user }}</p>
                      <div v-if="location.images.length > 0" style="display: flex; flex-wrap: wrap; justify-content: center;">
                        <div v-for="(image, index) in location.images" :key="index">
                          <img @click="showImage(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 50px; height: 50px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && getFileType(image) === 'video'" @click="showImage(image)">
                                  <video
                                @click="showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 50px; height: 50px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
                      <button :class="'s3' + location.lat" @click="clickDataLocation(location, 'driving-car', 's3' + location.lat)" style="margin-top: 20px; width: 30px; height: 30px; border-radius: 50%; border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;">🚗</button>
                      <button :class="'s32' + location.lat" @click="clickDataLocation(location, 'cycling-regular', 's32' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%; border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer; margin: 0 10px;"><i class="fa fa-bicycle" aria-hidden="true"></i></button>
                      <button :class="'s33' + location.lat" @click="clickDataLocation(location, 'foot-walking', 's33' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-blind" aria-hidden="true"></i></button>
                      <button :class="'s34' + location.lat" @click="clickDataLocation(location, 'driving-hgv', 's34' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer; margin: 0 10px;"><i class="fa fa-truck" aria-hidden="true"></i></button>
                      <button :class="'s35' + location.lat" @click="clickDataLocation(location, 'driving-car', 's35' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-motorcycle" aria-hidden="true"></i></button>
                      
                      <button :class="'s36' + location.lat" @click="clickDataLocation(location, 'wheelchair ', 's36' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-wheelchair" aria-hidden="true"></i></button>
                      <button :class="'s37' + location.lat" @click="clickDataLocation(location, 'foot-hiking', 's37' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-map" aria-hidden="true"></i></button>
                      <button :class="'s38' + location.lat" @click="clickDataLocation(location, 'cycling-electric', 's38' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-battery-full" aria-hidden="true"></i></button>
                      <button @click="clickDataUpdate(location.id)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;">💨💫</button>
                    </div>
                  </GMapInfoWindow>
                -->
     
  </GMapMarker>
    </div>
    <div v-else>
      <GMapMarker
        v-if="showMarkers"
        :position="location.coordinates"
        @click="showInfo(location.coordinates.lat, location, 
        'status4_' + location.id + '_' + index, 
        'div4_' + location.id + '_' + index, 
        'divchu4_' + location.id + '_' + index, 
        'details4_' + location.id + '_' + index,
        location.id, index,
        location)"
        :icon="{
          // url: marker1.url, // Đây là đổi ảnh liên tục
          url: imageStatus.status1,
          scaledSize: { width: 40, height: 40 },
          anchor: { x: 25, y: 25 }, // Căn giữa ảnh marker
        }"

        class="marker-icon"
      >
      <GMapInfoWindow
                  v-if="selectedMarker === location.coordinates.lat && showDistanceList"
                  :options="{ maxWidth: 250, disableAutoPan: true }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                    <p style="font-size: 12px;">Management Unit: <strong>{{ location.managementUnit }}</strong></p>
                      
                    </div>
                  </GMapInfoWindow>
          <!-- Hiển thị thông tin khi bấm vào marker -->

          <!--
           <GMapInfoWindow
                  v-if="selectedMarker === location.coordinates.lat && showDistanceList"
                  :options="{ maxWidth: 250 }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                      <h4>category Code: {{ location.categoryCode }}</h4>
                      <p>IdentificationCode: {{ location.identificationCode }}</p>
                      <p>Lat: {{ location.latitude }}</p>
                      <p>Lng: {{ location.longitude }}</p>
                      <p>signal Number: {{ location.signalNumber }}</p>
                      <p>Types Of Signal: {{ location.typesOfSignal }}</p>
                      <p style="font-size: 20px; color: greenyellow;"><i class="fa fa-check" aria-hidden="true"></i></p>
                      <div v-if="location.images.length > 0" style="display: flex; flex-wrap: wrap; justify-content: center;">
                        <div v-for="(image, index) in location.images" :key="index">
                          <img @click="showImage(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 50px; height: 50px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && getFileType(image) === 'video'" @click="showImage(image)">
                                  <video
                                @click="showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 50px; height: 50px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
                      <button :class="'s1' + location.lat" @click="clickDataLocation(location, 'driving-car', 's1' + location.lat)" style="margin-top: 20px; width: 30px; height: 30px; border-radius: 50%; border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;">🚗</button>
                      <button :class="'s12' + location.lat" @click="clickDataLocation(location, 'cycling-regular', 's12' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%; border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer; margin: 0 10px;"><i class="fa fa-bicycle" aria-hidden="true"></i></button>
                      <button :class="'s13' + location.lat" @click="clickDataLocation(location, 'foot-walking', 's13' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-blind" aria-hidden="true"></i></button>
                      <button :class="'s14' + location.lat" @click="clickDataLocation(location, 'driving-hgv', 's14' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer; margin: 0 10px;"><i class="fa fa-truck" aria-hidden="true"></i></button>
                      <button :class="'s15' + location.lat" @click="clickDataLocation(location, 'driving-car', 's15' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-motorcycle" aria-hidden="true"></i></button>

                      <button :class="'s16' + location.lat" @click="clickDataLocation(location, 'wheelchair', 's16' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-wheelchair" aria-hidden="true"></i></button>
                      <button :class="'s17' + location.lat" @click="clickDataLocation(location, 'foot-hiking', 's17' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-map" aria-hidden="true"></i></button>
                      <button :class="'s18' + location.lat" @click="clickDataLocation(location, 'cycling-electric', 's18' + location.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-battery-full" aria-hidden="true"></i></button>
                      <button @click="clickDataUpdate(location.id)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;">💨💫</button>
                    </div>
                  </GMapInfoWindow>
                -->
     
  </GMapMarker>
    </div>
   </div>
   <!--
   <GMapMarker
        v-if="location.status == 4"
          :position="location.coordinates"
          :label="location.address"
          @click="zoomData(location.coordinates)"
          :icon="{
            // url: marker1.url, // Đây là đổi ảnh liên tục
            url: imageStatus.status0,
            scaledSize: { width: 40, height: 40 },
            anchor: { x: 25, y: 25 }, // Căn giữa ảnh marker
          }"

          class="marker-icon"
        >
      
    </GMapMarker>
  -->
  </div>
      <!-- Marker cho vị trí hiện tại -->
      <GMapMarker
        :position="currentLocation"
        label="Bạn"
        :icon="{
          url: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
          scaledSize: { width: 40, height: 40 }
        }"
      />
      <!-- Đường đi -->
      <GMapPolyline
        v-if="routePath.length > 0 && selectedTransport !== 'airplane'"
        :path="routePath"
        :options="{
          strokeColor: '#A52A2A', // Màu đường
          strokeOpacity: 1.0,
          strokeWeight: 5
        }"
      />

        <!-- Hiển thị số km trên bản đồ -->
    <GMapMarker
      v-if="routeDistance && showDistance"
      :position="midPoint"
      label="📏"
       @click="showDistance = !showDistance"
    >
      <GMapInfoWindow>
        <div>
          <p>Travel Distance: <strong>{{ routeDistance.toFixed(2) }} km</strong></p> 
          <p>Travel Time: <strong>{{ showTimeDiChuyen }}</strong></p> 
        </div>
      </GMapInfoWindow>
    </GMapMarker>
    
    <!--Poi-->
    <div style="display: flex; flex-direction: column; border-right: 1px solid rgba(0, 0, 0, 0.1); display: flex; position: absolute; overflow: auto; height: 100%; z-index: 1100; left: 0; top: 0; background-color: rgba(175, 238, 238, 0.9);">
        <div style="width: 80px; height: 100%; margin-top: 15px;">

          <div style="padding: 10px; margin-top: 15px; cursor: pointer;" @click="isShowHome = !isShowHome">
            <img v-if="!isShowHome" style="animation: thei3 0.5s ease-in-out infinite;" width="28px" src="../assets/Icon/Picture1.png" alt="">
            <img v-else width="28px" src="../assets/Icon/Picture1.png" alt="">
            </div>

            <div style="margin: 15px 0; cursor: pointer; padding: 10px;" class="i1" @click="checkDataClassI('i1', 1)">
            <img width="28px" src="../assets/Icon/Picture2.png" alt="">
            </div>

            <div style="cursor: pointer; padding: 10px;" class="i2" @click="checkDataClassI('i2', 1)">
            <img width="28px" src="../assets/Icon/Picture3.png" alt="">
            </div>

            <div style="margin: 15px 0; cursor: pointer; padding: 10px;" class="i3" @click="checkDataClassI('i3', 1)">
            <img width="28px" src="../assets/Icon/Picture4.png" alt="">
            </div>

            <div style="cursor: pointer; padding: 10px;" class="i4" @click="checkDataClassI('i4', 1)">
            <img width="28px" src="../assets/Icon/Picture5.png" alt="">
            </div>

            <router-link to="/admin">
              <div style="margin: 15px 0; padding: 10px; cursor: pointer;" class="i5" @click="checkDataClassI('i5', 5)">
            <img width="28px" src="../assets/Icon/Picture6.png" alt="">
            </div>
              </router-link>

            <div style="cursor: pointer; padding: 10px;" class="i6" @click="checkDataClassI('i6', 2)">
            <img width="28px" src="../assets/Icon/Picture7.png" alt="">
            </div>

            <div style="margin: 15px 0; cursor: pointer; padding: 10px;" class="i7" @click="checkDataClassI('i7', 3)">
            <img width="28px" src="../assets/Icon/Picture8.png" alt="">
            </div>

            <div style="cursor: pointer; padding: 10px;" class="i8" @click="checkDataClassI('i8', 8)">
            <img width="28px" src="../assets/Icon/Picture9.png" alt="">
            </div>

            <div style="margin: 15px 0; cursor: pointer; padding: 10px;" class="i9" @click="checkDataClassI('i9', 9)">
            <img width="28px" src="../assets/Icon/Picture10.png" alt="">
            </div>

          </div>
        </div>
    <div :style="{
      transform: isShowHome ? 'scale(1)' : 'scale(0)',
      transition: '0.4s ease-in-out',
    display: 'flex',
    position: 'absolute',
    overflow: 'auto',
    height: '100%',
    zIndex: 1000,
    left: '82px',
    top: '0',
    borderTopRightRadius: '10px',
    borderBottomRightRadius: '10px',
    width: isCheckShow === 1 ? '400px' : '380px',
    backgroundColor: isCheckShow === 1 ? '#F5F5F5' : '#F0F8FF'
  }">
      <div>
      <div v-if="isCheckShow == 1">
        <div style="text-align: left; margin: 0 auto; width: 80%; border-bottom: 3px solid black;">
          <div style="margin-top: 20px; display: flex; justify-content: space-between;">
            
          <select v-model="dataSelect" @change="searchDataSelect" style="background-color: #e8c264; padding: 10px 15px; margin: 15px 0; border-radius: 20px; border: 1px dashed turquoise; width: 180px;">
        <option value="null" selected disabled>Search data ...</option>
        <option value="b1s">
          ✔ Search Data 1
          </option>
          <option value="b2s">
            💦 Search Data 2
          </option>

          <option value="b3s">
             👌 Search Data 3
          </option>
          <option value="b4s">
             💌 Search Data 4
          </option>
          <option value="b5s">
            ❌ Search Data 5
          </option>
          <option value="all">
            📍 All Location
          </option>
        </select>

        <div style="text-align: center; margin-top: 20px; margin-right: 15px; cursor: pointer;" @click="showDetailsAll(isAction = !isAction)">
              <i :class="{ 'spin-icon': isAction }" class="fa fa-futbol-o" aria-hidden="true" style="font-size: 30px;"></i>
              </div>
            </div>
          </div>
        <!-- Nút trong bản đồ -->
     <div class="map-buttons" style="display: flex; flex-direction: column; z-index: 1000; margin: 10px 15px;">
      <!-- <button @click="searchLocation">📍 Tìm vị trí</button> -->
      <!-- <button @click="getDirections">🚗 Tìm đường</button> -->

      <div style="text-align: left; width: 100%; padding-left: 15px; margin-top: 20px;">
        <input v-model.trim="valueE" style="padding: 5px 10px; outline: none; border: 1px dashed grey; border-radius: 10px;" placeholder="Search..." type="text">
        <button @click="timkiemDataRoad" style="background-color: transparent; border: none; outline: none;"><i class="fa fa-search" aria-hidden="true"></i></button>
        </div>
      
        <div class="scroll-box" style="margin: 10px 0; padding: 10px; width: 350px; height: 550px; overflow: auto; background-color: #F5F5F5; top: 100px; right: 10px; border-radius: 10px;">
      <div v-if="zoomLevel >= 13">
        <div v-for="(location, index) in locations" :key="index" :ref="el => setItemRef(location.id, index, el)">
        <div v-if="location.isError">
          <div v-if="location.statusError == 0" :class="['div_' + location.id + '_' + index, ' div0']" @click="showDataMap(location.coordinates, location)" :style="{
            cursor: 'pointer',
             height: '60px',
            border: 'none',
             borderRadius: '10px',
              padding: '10px',
               marginBottom: '10px',
               backgroundColor: '#FFF8DC'
          }">
            <div :class="['divchu_' + location.id + '_' + index, ' divchu0']" style="margin-bottom: 15px; padding-top: 5px;">
            <div style="display: flex;">
              <div style="width: 80%; text-align: left;">
              <p style="font-size: 13px; font-weight: bold;">號誌編號: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 13px; font-weight: bold;">號誌類型: <strong>{{ location.typesOfSignal }}</strong></p>
              </div>
           
            <div style="width: 20%;">
              <button @click="showDataChon('status_' + location.id + '_' + index, 'div_' + location.id + '_' + index, 'divchu_' + location.id + '_' + index, 'details_' + location.id + '_' + index, location)" style="padding: 5px 10px; font-size: 10px; border-radius: 10px; background-color: red; color: white;">Not received</button>
              </div>
              </div>

              <div v-if="location.account_user == null" style="display: flex; transform: scale(0); z-index: 999;" :class="['status_' + location.id + '_' + index, ' status0']">
                <div>
                  <p style="font-size: 11px; margin-right: 8px; margin-top: 8px;">派遣工程師</p>
                  </div>

                  <div style="background-color: white; height: 25px; border: 1px solid grey; margin-top: 8px; position: relative; z-index: 999;">
                    <i style="font-size: 13px; color: grey; margin: 5px;" class="fa fa-search" aria-hidden="true"></i>
                    <input v-model="searchUserName" style="width: 80%; padding: 3px 5px; border: none; outline: none;" type="text">
                     <div 
      :class="['square', ' display_' + location.id + '_' + index]"
      style="padding: 5px;"
    >
    <div style="text-align: left;">
      <i @click="showBoxSearch('status_' + location.id + '_' + index, 'display_' + location.id + '_' + index, 'huy')" class="fa fa-window-close-o" aria-hidden="true"></i>
      </div>
    
      <div>
        <div v-for="(item, index) in dataSearchUserName" :key="index" style="margin: 10px 20px;">
          <div @click="updateUser(location.repaiDetail_id, item.id, 'status_' + location.id + '_' + index)" style="display: flex;">
            <p style="font-size: 12px; font-weight: bold;">Name: {{ item.name }}</p>
            <p style="font-size: 12px; margin: 0 15px; font-weight: bold;">Job: {{ item.total }}</p>
            </div>
          </div>
        </div>
    </div>
                    </div>
                    <div>
                      <button @click="showBoxSearch('status_' + location.id + '_' + index, 'display_' + location.id + '_' + index, 'on')" style="background-color: transparent; border: none; outline: none; font-size: 20px;"><i class="fa fa-check-square-o" aria-hidden="true"></i></button>
                      </div>
                </div>
            </div>

          <div :class="['status_' + location.id + '_' + index, ' status0']" style="transform: scale(0); text-align: left; z-index: 0">
            
            <div style="display: flex; justify-content: space-between; width: 100%; z-index: 0;">
              <div style="z-index: 0;">
                <p style="font-size: 12px; font-weight: bold; z-index: 0;">緯度: <strong>{{ location.latitude }}</strong></p>
                <p style="font-size: 12px; font-weight: bold; z-index: 0;">經度: <strong>{{ location.longitude }}</strong></p>
                <p style="font-size: 12px; font-weight: bold;">行政區: <strong>{{ location.districs }}</strong></p>
              <p style="font-size: 12px; font-weight: bold;">道路: <strong>{{ location.road1 }}, {{ location.road2 }}</strong></p>
              <p v-if="location.account_user != null" style="font-size: 12px; font-weight: bold;">Engineer: {{ location.account_user }}</p>
              <p style="font-size: 12px; font-weight: bold;">維修記錄: {{ location.totalUpdate == 0 ? "無" : location.totalUpdate }}</p>
                </div>

                <div v-if="location?.images.length > 0" style="display: flex; flex-wrap: wrap; justify-content: center; overflow: auto; margin-left: 20px;">
                        <div v-for="(image, index) in location?.images" :key="index">
                          <img @click="showImage(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && getFileType(image) === 'video'" @click="showImage(image)">
                                  <video
                                @click="showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
            <div>
              
              </div>
              </div>

              <div v-if="location.totalUpdate > 0" :class="['details_' + location.id + '_' + index, ' details0']" style="transform: scale(0); text-align: left; height: 0;">
            <div>
              <p style="font-size: 12px; font-weight: bold;">Last modified date: <strong>{{fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px; font-weight: bold;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px; font-weight: bold;">Account: {{ location.account_userUpdate }}</p>
              </div>
            </div>
              <div style="display: flex; border-top: 1px dashed grey; margin-top: 15px;">
                <div style="width: 33.33%;">
              <button :class="'s1' + location.id" @click="clickDataLocation(location, 'driving-car', 's1' + location.id)" style="outline: none; background: transparent; cursor: pointer; text-decoration: underline; border: none;">規劃路徑</button>
              </div>
              <div style="width: 33.33%;">
                <button @click="clickDataUpdate(location.id)" style="outline: none; background: transparent; cursor: pointer; border: none;">後台管理</button>
                </div>

                <div style="width: 33.33%;">
                  <button style="outline: none; background: transparent; cursor: pointer; border: none;"> <p v-if="location.totalUpdate > 0" style="text-decoration: underline; cursor: pointer;" @click="showDetailsDiv('details3_' + location.id + '_' + index, 'div3_' + location.id + '_' + index, location)">顯示詳細資料</p></button>
                </div>
                </div>
              
          </div>

          
          <div :class="'details_' + location.id + '_' + index" style="transform: scale(0); margin: 15px 0; text-align: left; padding: 0 6px;">
            <div>
              <p style="font-size: 12px;">Last modified date: <strong>{{fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px;">Account: {{ location.account_userUpdate }}</p>
              </div>

            
            </div>
          
          </div>
          
          <div v-if="location.statusError == 1"  :class="['div1_' + location.id + '_' + index, ' div1']" @click="showDataMap(location.coordinates, location)" :style="{
            cursor: 'pointer',
             height: '60px',
            border: 'none',
             borderRadius: '10px',
              padding: '10px',
               marginBottom: '10px',
               backgroundColor: '#FFF8DC'
          }">
            <div :class="['divchu1_' + location.id + '_' + index, ' divchu1']" style="display: flex; margin-bottom: 15px; padding: 5px 0;">
            <div style="width: 80%; text-align: left;">
              <p style="font-size: 13px; font-weight: bold;">號誌編號: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 13px; font-weight: bold;">號誌類型: <strong>{{ location.typesOfSignal }}</strong></p>
              </div>
           
            <div style="width: 20%;">
              <button @click="showDataChon('status1_' + location.id + '_' + index, 'div1_' + location.id + '_' + index, 'divchu1_' + location.id + '_' + index, 'details1_' + location.id + '_' + index, location)" style="padding: 5px 10px; font-size: 10px; border-radius: 10px; background-color: #6495ED; color: white;">Multiplied</button>
              </div>
            </div>

          <div :class="['status1_' + location.id + '_' + index, ' status1']" style="transform: scale(0); text-align: left;">
            
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <div>
                <p style="font-size: 12px; font-weight: bold;">緯度: <strong>{{ location.latitude }}</strong></p>
                <p style="font-size: 12px; font-weight: bold;">經度: <strong>{{ location.longitude }}</strong></p>
                <p style="font-size: 12px; font-weight: bold;">行政區: <strong>{{ location.districs }}</strong></p>
              <p style="font-size: 12px; font-weight: bold;">道路: <strong>{{ location.road1 }}, {{ location.road2 }}</strong></p>
              <p style="font-size: 12px; font-weight: bold; ">維修記錄: {{ location.totalUpdate == 0 ? "無" : location.totalUpdate }}</p>
                </div>

                <div v-if="location?.images.length > 0" style="display: flex; flex-wrap: wrap; justify-content: center; overflow: auto; margin-left: 20px;">
                        <div v-for="(image, index) in location?.images" :key="index">
                          <img @click="showImage(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && getFileType(image) === 'video'" @click="showImage(image)">
                                  <video
                                @click="showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
            <div>
              
              </div>
              </div>

              <div v-if="location.totalUpdate > 0" :class="['details1_' + location.id + '_' + index, ' details1']" style="transform: scale(0); text-align: left; height: 0;">
            <div>
              <p style="font-size: 12px; font-weight: bold;">Last modified date: <strong>{{fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px; font-weight: bold;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px; font-weight: bold;">Account: {{ location.account_userUpdate }}</p>
              </div>
            </div>
              <div style="display: flex; border-top: 1px dashed grey; margin-top: 15px;">
                <div style="width: 33.33%;">
              <button :class="'s1' + location.id" @click="clickDataLocation(location, 'driving-car', 's1' + location.id)" style="outline: none; background: transparent; cursor: pointer; text-decoration: underline; border: none;">規劃路徑</button>
              </div>
              <div style="width: 33.33%;">
                <button @click="clickDataUpdate(location.id)" style="outline: none; background: transparent; cursor: pointer; border: none;">後台管理</button>
                </div>

                <div style="width: 33.33%;">
                  <button style="outline: none; background: transparent; cursor: pointer; border: none;"> <p v-if="location.totalUpdate > 0" style="text-decoration: underline; cursor: pointer;" @click="showDetailsDiv('details3_' + location.id + '_' + index, 'div3_' + location.id + '_' + index, location)">顯示詳細資料</p></button>
                </div>
                </div>
              
          </div>
          
          <div :class="'details1_' + location.id + '_' + index" style="transform: scale(0); margin: 15px 0; text-align: left; padding: 0 6px;">
            <div>
              <p style="font-size: 12px;">Last modified date: <strong>{{fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px;">Account: {{ location.account_userUpdate }}</p>
              </div>

            
            </div>
          
          </div>

          <div v-if="location.statusError == 2" :class="['div2_' + location.id + '_' + index, ' div2']" @click="showDataMap(location.coordinates, location)" :style="{
            cursor: 'pointer',
             height: '60px',
            border: 'none',
             borderRadius: '10px',
              padding: '10px',
               marginBottom: '10px',
               backgroundColor: '#FFF8DC'
          }">
            <div :class="['divchu2_' + location.id + '_' + index, ' divchu2']" style="display: flex; margin-bottom: 15px; padding: 5px 0;">
            <div style="width: 80%; text-align: left;">
              <p style="font-size: 13px; font-weight: bold;">號誌編號: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 13px; font-weight: bold;">號誌類型: <strong>{{ location.typesOfSignal }}</strong></p>
              </div>
           
            <div style="width: 20%;">
              <button @click="showDataChon('status2_' + location.id + '_' + index, 'div2_' + location.id + '_' + index, 'divchu2_' + location.id + '_' + index, 'details2_' + location.id + '_' + index, location)" style="padding: 5px 10px; font-size: 10px; border-radius: 10px; background-color: yellow; color: black;">Under construction</button>
              </div>
            </div>

          <div :class="['status2_' + location.id + '_' + index, ' status2']" style="transform: scale(0); text-align: left;">
            
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <div>
                <p style="font-size: 12px; font-weight: bold;">緯度: <strong>{{ location.latitude }}</strong></p>
                <p style="font-size: 12px; font-weight: bold;">經度: <strong>{{ location.longitude }}</strong></p>
                <p style="font-size: 12px; font-weight: bold;">行政區: <strong>{{ location.districs }}</strong></p>
              <p style="font-size: 12px; font-weight: bold;">道路: <strong>{{ location.road1 }}, {{ location.road2 }}</strong></p>
              <p style="font-size: 12px; font-weight: bold; ">維修記錄: {{ location.totalUpdate == 0 ? "無" : location.totalUpdate }}</p>
                </div>

                <div v-if="location?.images.length > 0" style="display: flex; flex-wrap: wrap; justify-content: center; overflow: auto; margin-left: 20px;">
                        <div v-for="(image, index) in location?.images" :key="index">
                          <img @click="showImage(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && getFileType(image) === 'video'" @click="showImage(image)">
                                  <video
                                @click="showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
            <div>
              
              </div>
              </div>

              <div v-if="location.totalUpdate > 0" :class="['details2_' + location.id + '_' + index, ' details2']" style="transform: scale(0); text-align: left; height: 0;">
            <div>
              <p style="font-size: 12px; font-weight: bold;">Last modified date: <strong>{{fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px; font-weight: bold;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px; font-weight: bold;">Account: {{ location.account_userUpdate }}</p>
              </div>
            </div>
              <div style="display: flex; border-top: 1px dashed grey; margin-top: 15px;">
                <div style="width: 33.33%;">
              <button :class="'s1' + location.id" @click="clickDataLocation(location, 'driving-car', 's1' + location.id)" style="outline: none; background: transparent; cursor: pointer; text-decoration: underline; border: none;">規劃路徑</button>
              </div>
              <div style="width: 33.33%;">
                <button @click="clickDataUpdate(location.id)" style="outline: none; background: transparent; cursor: pointer; border: none;">後台管理</button>
                </div>

                <div style="width: 33.33%;">
                  <button style="outline: none; background: transparent; cursor: pointer; border: none;"> <p v-if="location.totalUpdate > 0" style="text-decoration: underline; cursor: pointer;" @click="showDetailsDiv('details3_' + location.id + '_' + index, 'div3_' + location.id + '_' + index, location)">顯示詳細資料</p></button>
                </div>
                </div>
              
          </div>
          
          <div :class="'details2_' + location.id + '_' + index" style="transform: scale(0); margin: 15px 0; text-align: left; padding: 0 6px;">
            <div>
              <p style="font-size: 12px;">Last modified date: <strong>{{fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px;">Account: {{ location.account_userUpdate }}</p>
              </div>

            
            </div>
          
          </div>

          <div v-if="location.statusError == 3" :class="['div3_' + location.id + '_' + index, ' div3']" @click="showDataMap(location.coordinates, location)" :style="{
            cursor: 'pointer',
             height: '60px',
            border: 'none',
             borderRadius: '10px',
              padding: '10px',
               marginBottom: '10px',
               backgroundColor: '#FFF8DC'
          }">
            <div :class="['divchu3_' + location.id + '_' + index, ' divchu3']" style="display: flex; margin-bottom: 15px; padding: 5px 0;">
            <div style="width: 80%; text-align: left;">
              <p style="font-size: 13px; font-weight: bold;">號誌編號: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 13px; font-weight: bold;">號誌類型: <strong>{{ location.typesOfSignal }}</strong></p>
              </div>
           
            <div style="width: 20%;">
              <button @click="showDataChon('status3_' + location.id + '_' + index, 'div3_' + location.id + '_' + index, 'divchu3_' + location.id + '_' + index, 'details3_' + location.id + '_' + index, location)" style="padding: 5px 10px; font-size: 10px; border-radius: 10px; background-color: #7FFF00; color: black;">Fixed</button>
              </div>
            </div>

          <div :class="['status3_' + location.id + '_' + index, ' status3']" style="transform: scale(0); text-align: left;">
            
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <div>
                <p style="font-size: 12px; font-weight: bold;">緯度: <strong>{{ location.latitude }}</strong></p>
                <p style="font-size: 12px; font-weight: bold;">經度: <strong>{{ location.longitude }}</strong></p>
                <p style="font-size: 12px; font-weight: bold;">行政區: <strong>{{ location.districs }}</strong></p>
              <p style="font-size: 12px; font-weight: bold;">道路: <strong>{{ location.road1 }}, {{ location.road2 }}</strong></p>
              <p style="font-size: 12px; font-weight: bold; ">維修記錄: {{ location.totalUpdate == 0 ? "無" : location.totalUpdate }}</p>
                </div>

                <div v-if="location?.images.length > 0" style="display: flex; flex-wrap: wrap; justify-content: center; overflow: auto; margin-left: 20px;">
                        <div v-for="(image, index) in location?.images" :key="index">
                          <img @click="showImage(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && getFileType(image) === 'video'" @click="showImage(image)">
                                  <video
                                @click="showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
            <div>
              
              </div>
              </div>

              <div v-if="location.totalUpdate > 0" :class="['details3_' + location.id + '_' + index, ' details3']" style="transform: scale(0); text-align: left; height: 0;">
            <div>
              <p style="font-size: 12px; font-weight: bold;">Last modified date: <strong>{{fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px; font-weight: bold;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px; font-weight: bold;">Account: {{ location.account_userUpdate }}</p>
              </div>
            </div>
              <div style="display: flex; border-top: 1px dashed grey; margin-top: 15px;">
                <div style="width: 33.33%;">
              <button :class="'s1' + location.id" @click="clickDataLocation(location, 'driving-car', 's1' + location.id)" style="outline: none; background: transparent; cursor: pointer; text-decoration: underline; border: none;">規劃路徑</button>
              </div>
              <div style="width: 33.33%;">
                <button @click="clickDataUpdate(location.id)" style="outline: none; background: transparent; cursor: pointer; border: none;">後台管理</button>
                </div>

                <div style="width: 33.33%;">
                  <button style="outline: none; background: transparent; cursor: pointer; border: none;"> <p v-if="location.totalUpdate > 0" style="text-decoration: underline; cursor: pointer;" @click="showDetailsDiv('details3_' + location.id + '_' + index, 'div3_' + location.id + '_' + index, location)">顯示詳細資料</p></button>
                </div>
                </div>
              
          </div>

          
          <div :class="'details3_' + location.id + '_' + index" style="transform: scale(0); margin: 15px 0; text-align: left; padding: 0 6px;">
            <div>
              <p style="font-size: 12px;">Last modified date: <strong>{{fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px;">Account: {{ location.account_userUpdate }}</p>
              </div>
            </div>
          
          </div>
        </div>
        <div v-else :class="['div4_' + location.id + '_' + index, ' div4']" @click="showDataMap(location.coordinates, location)" :style="{
            cursor: 'pointer',
             height: '60px',
            border: 'none',
             borderRadius: '10px',
              padding: '10px',
               marginBottom: '10px',
               backgroundColor: '#FFF8DC'
          }">
            <div :class="['divchu4_' + location.id + '_' + index, ' divchu4']" style="display: flex; margin-bottom: 15px; padding: 5px 0;">
            <div style="width: 80%; text-align: left;">
              <p style="font-size: 13px; font-weight: bold;">號誌編號: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 13px; font-weight: bold;">號誌類型: <strong>{{ location.typesOfSignal }}</strong></p>
              </div>
           
            <div style="width: 20%;">
              <button @click="showDataChon('status4_' + location.id + '_' + index, 'div4_' + location.id + '_' + index, 'divchu4_' + location.id + '_' + index, 'details4_' + location.id + '_' + index, location)" style="padding: 5px 10px; font-size: 10px; border-radius: 10px; background-color: #7FFF00; color: black;">not broken</button>
              </div>
            </div>

          <div :class="['status4_' + location.id + '_' + index, ' status4']" style="transform: scale(0); text-align: left;">
            
            <div style="display: flex; justify-content: space-between; width: 100%;">
              <div>
                <p style="font-size: 12px; font-weight: bold;">緯度: <strong>{{ location.latitude }}</strong></p>
                <p style="font-size: 12px; font-weight: bold;">經度: <strong>{{ location.longitude }}</strong></p>
                <p style="font-size: 12px; font-weight: bold;">行政區: <strong>{{ location.districs }}</strong></p>
              <p style="font-size: 12px; font-weight: bold;">道路: <strong>{{ location.road1 }}, {{ location.road2 }}</strong></p>
              <p style="font-size: 12px; font-weight: bold; ">維修記錄: {{ location.totalUpdate == 0 ? "無" : location.totalUpdate }}</p>
                </div>

                <div v-if="location?.images.length > 0" style="display: flex; flex-wrap: wrap; justify-content: center; overflow: auto; margin-left: 20px;">
                        <div v-for="(image, index) in location?.images" :key="index">
                          <img @click="showImage(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && getFileType(image) === 'video'" @click="showImage(image)">
                                  <video
                                @click="showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
            <div>
              
              </div>
              </div>

              <div v-if="location.totalUpdate > 0" :class="['details4_' + location.id + '_' + index, ' details4']" style="transform: scale(0); text-align: left; height: 0;">
            <div>
              <p style="font-size: 12px; font-weight: bold;">Last modified date: <strong>{{fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px; font-weight: bold;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px; font-weight: bold;">Account: {{ location.account_userUpdate }}</p>
              </div>
            </div>
              <div style="display: flex; border-top: 1px dashed grey; margin-top: 15px;">
                <div style="width: 33.33%;">
              <button :class="'s1' + location.id" @click="clickDataLocation(location, 'driving-car', 's1' + location.id)" style="outline: none; background: transparent; cursor: pointer; text-decoration: underline; border: none;">規劃路徑</button>
              </div>
              <div style="width: 33.33%;">
                <button @click="clickDataUpdate(location.id)" style="outline: none; background: transparent; cursor: pointer; border: none;">後台管理</button>
                </div>

                <div style="width: 33.33%;">
                  <button style="outline: none; background: transparent; cursor: pointer; border: none;"> <p v-if="location.totalUpdate > 0" style="text-decoration: underline; cursor: pointer;" @click="showDetailsDiv('details3_' + location.id + '_' + index, 'div3_' + location.id + '_' + index, location)">顯示詳細資料</p></button>
                </div>
                </div>
              
          </div>

          
          <div :class="'details4_' + location.id + '_' + index" style="transform: scale(0); margin: 15px 0; text-align: left; padding: 0 6px;">
            <div>
              <p style="font-size: 12px;">Last modified date: <strong>{{fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px;">Account: {{ location.account_userUpdate }}</p>
              </div>

            
            </div>
          
          </div>
      </div>
      </div>
      <PagesTotal v-if="isPhanTrang" :page="page" :totalPage="totalPage" :valueE="valueE" @pageChange="findAllDataMap" @pageSizeChange="changeReload"></PagesTotal>
     </div>
    </div>

    
        </div>

      <div v-if="isCheckShow == 2" style="width: 350px;">
      
      <div>
      <div class="range-container">
        <div style="text-align: left;">
          <i class="fa fa-linode" aria-hidden="true" style="font-size: 35px;"></i>
          <p style="font-weight: bold; opacity: 0.8;">Adjust density of features</p>
          </div>
    <div
      v-for="(value, index) in ranges"
      :key="index"
      class="range-wrapper"
    >
      <label v-if="index == 0" style="color: grey; opacity: 0.8;">Roads</label>
      <label v-if="index == 1" style="color: grey; opacity: 0.8;">Landmarks</label>
      <label v-if="index == 2" style="color: grey; opacity: 0.8;">Labels</label>
      <div class="range-track">
        <input
          type="range"
          min="0"
          max="4"
          value="4"
          step="1"
          v-model="ranges[index]"
          @input="updatePoiStyle(ranges[index], index)"
          class="styled-range"
        />
      </div>
    </div>
  </div>
      </div>
      <div class="theme-selector">
        <div style="text-align: left; padding-left: 55px; margin: 15px 0;">
          <i class="fa fa-snowflake-o" aria-hidden="true" style="font-size: 35px;"></i>
          <p style="font-weight: bold; opacity: 0.8;">Select theme</p>
          </div>
        <table style="margin: 10px 0;">
          <tbody>
            <tr v-for="(style, name) in mapStyles" :key="name">
              <td style="width: 200px;">{{ name }}</td>
              <td>
                <input
        type="radio"
        name="mapTheme"
        :value="name"
        v-model="selectedTheme"
      />
                </td>
                <td>
                  <div style="margin-bottom: 50px;"></div>
                  </td>
              </tr>
            </tbody>
          </table>
   
    </div>

      </div>

      <div v-if="isCheckShow == 3" style="width: 400px;">
        <div>
      <div>
        <div style="text-align: left; padding-left: 55px; margin-top: 20px;">
            <i class="fa fa-space-shuttle" aria-hidden="true" style="font-size: 30px;"></i>
            <p style="font-weight: bold; opacity: 0.8;">Data Input</p>
            
            </div>
          <div style="display: flex; margin: 15px 10px;">
            <div>
              <GMapAutocomplete
              style="padding: 10px 5px; border-radius: 10px; width: 180px; border: 1px dashed greenyellow; outline: none;"
              v-model="searchAddress"
              type="text"
              placeholder="Address to Find..."
              @place_changed="searchLocation"
        />
          </div>
  
          <div style="margin: 0 10px;">
            <GMapAutocomplete
            style="padding: 10px 5px; border-radius: 10px; width: 180px; border: 1px dashed greenyellow; outline: none;"
              v-model="searchAddressHome"
              type="text"
              placeholder="Home Address..."
              @place_changed="searchHomeData"
        />
  
          </div>
          </div>
          <!-- Nút hiển thị lại số km -->
        <button v-if="routeDistance" @click="showDistance = !showDistance" style="padding: 5px 10px; border: 3px dashed violet; background-color: transparent; outline: none; cursor: pointer; margin: 0 10px;">
          <!-- {{ showDistance ? "Ẩn khoảng cách" : "Hiện khoảng cách" }} -->
  
          <span v-if="showDistance">
            <i class="fa fa-envelope-open-o" aria-hidden="true"></i>
          </span>
          <span v-else>
            <i class="fa fa-eye-slash" aria-hidden="true"></i>
          </span>
        </button>
  
        <button v-if="locations.length > 0" @click="showDistanceList = !showDistanceList" style="padding: 5px 10px; border: 3px dashed violet; background-color: transparent; outline: none; cursor: pointer;">
          <!-- {{ showDistanceList ? "Ẩn Data" : "Hiện Data" }} -->
          <span v-if="showDistanceList">
            <i class='fa fa-id-card-o' aria-hidden='true'></i>
          </span>
          <span v-else>
            <i class="fa fa-eye-slash" aria-hidden="true"></i>
          </span>
        </button>
  
        <button @click="toggleTraffic" style="margin-bottom: 10px; padding: 5px 10px; border: 3px dashed violet; background-color: transparent; outline: none; cursor: pointer; margin: 0 10px;">
          {{ trafficVisible ? "關閉交通" : "開放交通" }}
        </button>
  
        <div v-if="routeDistance">
          <p><strong>Travel Distance:</strong> {{ routeDistance.toFixed(2) }} km</p>
        </div>
  
        <div v-if="showTimeDiChuyen">
          <p><strong>Travel Time:</strong> {{ showTimeDiChuyen }} Time</p>
        </div>
  
  
        <div v-if="showTimeDiChuyenKm">
          <p><strong>Travel Distance KM:</strong> {{ showTimeDiChuyenKm }} km</p>
        </div>
    </div>  
  
    <div>
      <button @click="logout" style="z-index: 1000; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: aqua; border-radius: 5px; margin: 10px 0;">
          登出
        </button>
  
        <!-- <button @click="offpoi" style="position: absolute; top: 45px; z-index: 1000; right: 160px; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: aqua; border-radius: 5px; margin: 10px 0;">
          Off Poi
        </button> -->
  
        <button @click="getCurrentLocation" style="z-index: 1000; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: aqua; border-radius: 5px; margin: 10px 10px;">
          <i class="fa fa-street-view" aria-hidden="true"></i>
        </button>
      </div>
    </div>
        </div>

        <div v-if="isCheckShow == 9">
          <div style="text-align: left; margin-left: 30px; justify-content: space-between; margin-top: 20px; width: 330px; border-bottom: 3px solid black; display: flex;">
              <h3>Search User Job</h3>
              <i style="font-size: 20px; margin-right: 20px;" class="fa fa-eercast" aria-hidden="true"></i>
              </div>

              <div>
              <div v-for="(item, index) in dataUser" :key="index" style="text-align: center; align-items: center; display: flex; justify-content: center; margin: 15px 0;">
                  <div @click="searchDuongdi(item.id)" style="display: flex; text-align: center; justify-content: center; background-color: grey; width: 80%; line-height: 50px; border-radius: 15px; cursor: pointer;">
                    <p style="font-size: 15px; font-weight: bold; color: white;">Name: {{ item.name }}</p>
                  <p style="margin: 0 15px; font-size: 15px; font-weight: bold; color: white;">Job: {{ item.total }}</p>
                    </div>
                </div>
              <div>
                </div>
              </div>
            </div>

            
    </div>
    </div>

     <div v-if="showDetails" style="position: absolute; width: 60%; height: 250px; background-color: rgba(255, 255, 255, 0.6); bottom: 50px; right: 80px; border-radius: 10px;">

      <div style="display: flex; justify-content: space-between; border-bottom: 1px solid rgba(0, 0, 0, 0.2);">
        <div style="margin: 0 20px;">
          <p style="font-weight: 500; font-size: 28px;" v-if="dataLocation != null && dataLocation.statusError == 0 && dataLocation?.isError">Status: 
            <i class="fa fa-window-close-o" style="animation: thei1 0.5s ease-in-out infinite;" aria-hidden="true"></i>
            
            </p>
            <p v-else-if="dataLocation != null && dataLocation.statusError == 1 && dataLocation?.isError" style="font-size: 20px; color: greenyellow;">Status: <i class="fa fa-handshake-o" aria-hidden="true"></i></p>
            <p v-else-if="dataLocation != null && dataLocation.statusError == 2 && dataLocation?.isError" style="font-size: 20px; color: greenyellow; animation: thei1 0.5s ease-in-out infinite;">Status: <i class="fa fa-exclamation-triangle" aria-hidden="true"></i></p>
            <p v-else-if="dataLocation != null && dataLocation.statusError == 3 && dataLocation?.isError" style="font-size: 20px; color: greenyellow; animation: thei2 0.5s ease-in-out infinite;">Status: <i class="fa fa-check" aria-hidden="true"></i></p>
            <p v-else-if="dataLocation != null && !dataLocation?.isError" style="font-size: 20px; color: greenyellow;"><i class="fa fa-check" aria-hidden="true"></i></p>
            </div>
          <div style="margin: 10px 0;">
            <h2>Details</h2>
            </div>
        <div @click="showDetails = false" style="text-align: right; width: 10%; padding: 20px 25px;"><i style="font-size: 20px;" class="fa fa-window-close-o" aria-hidden="true"></i></div>
        </div>
        <div style="display: flex;">
          <div style="margin: 0 10px; text-align: left;">
            
            <p style="font-size: 16px; margin-top: 15px;">Lat: <strong>{{ dataLocation?.latitude }}</strong></p>
            <p style="font-size: 16px; margin: 15px 0;">Lng: <strong>{{ dataLocation?.longitude }}</strong></p>
            </div>
          <div style="text-align: left; margin: 0 15px;">
            <p style="font-size: 16px; margin-top: 15px;">category Code: {{ dataLocation?.categoryCode }}</p>
            <p style="font-size: 16px; margin: 15px 0;">signal Number: <strong>{{ dataLocation?.signalNumber }}</strong></p>
            
            </div>
          <div>
            <p style="font-size: 16px; margin-top: 15px;">IdentificationCode: <strong>{{ dataLocation?.identificationCode }}</strong></p>
            <p style="font-size: 16px; margin: 15px 0;">Types Of Signal: <strong>{{ dataLocation?.typesOfSignal }}</strong></p>
            <p style="font-size: 12px;">Management Unit: <strong>{{ dataLocation?.managementUnit }}</strong></p>
            </div>

            <div style="margin: 0 15px;">
              <div v-if="dataLocation?.images.length > 0" style="display: flex; flex-wrap: wrap; justify-content: center; overflow: auto;">
                        <div v-for="(image, index) in dataLocation?.images" :key="index">
                          <img @click="showImage(image)" v-if="image != null && getFileType(image) === 'image'" style="width: 50px; height: 50px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && getFileType(image) === 'video'" @click="showImage(image)">
                                  <video
                                @click="showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 50px; height: 50px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (getFileType(image) === 'word'  || getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
              </div>
          </div>
          <div v-if="dataLocation != null">
            <button :class="'s1' + dataLocation.lat" @click="clickDataLocation(dataLocation, 'driving-car', 's1' + dataLocation.lat)" style="margin-top: 20px; width: 30px; height: 30px; border-radius: 50%; border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;">🚗</button>
                      <button :class="'s12' + dataLocation.lat" @click="clickDataLocation(dataLocation, 'cycling-regular', 's12' + dataLocation.lat)" style="width: 30px; height: 30px; border-radius: 50%; border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer; margin: 0 10px;"><i class="fa fa-bicycle" aria-hidden="true"></i></button>
                      <button :class="'s13' + dataLocation.lat" @click="clickDataLocation(dataLocation, 'foot-walking', 's13' + dataLocation.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-blind" aria-hidden="true"></i></button>
                      <button :class="'s14' + dataLocation.lat" @click="clickDataLocation(dataLocation, 'driving-hgv', 's14' + dataLocation.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer; margin: 0 10px;"><i class="fa fa-truck" aria-hidden="true"></i></button>
                      <button :class="'s15' + dataLocation.lat" @click="clickDataLocation(dataLocation, 'driving-car', 's15' + dataLocation.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-motorcycle" aria-hidden="true"></i></button>

                      <button :class="'s16' + dataLocation.lat" @click="clickDataLocation(dataLocation, 'wheelchair', 's16' + dataLocation.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-wheelchair" aria-hidden="true"></i></button>
                      <button :class="'s17' + dataLocation.lat" @click="clickDataLocation(dataLocation, 'foot-hiking', 's17' + dataLocation.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-map" aria-hidden="true"></i></button>
                      <button :class="'s18' + dataLocation.lat" @click="clickDataLocation(dataLocation, 'cycling-electric', 's18' + dataLocation.lat)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;"><i class="fa fa-battery-full" aria-hidden="true"></i></button>
                      <button @click="clickDataUpdate(dataLocation.id)" style="width: 30px; height: 30px; border-radius: 50%;border: 1px dashed greenyellow; outline: none; background: transparent; cursor: pointer;">💨💫</button>
            </div>
      </div>

      <div v-if="!isShowHome" style="position: absolute; top: 20px; left: 100px;">
        <div>
            <GMapAutocomplete
            style="padding: 10px 5px; border-radius: 10px; border: 1px dashed greenyellow; outline: none; width: 250px;"
              v-model="searchAddress"
              type="text"
              placeholder="Address to Find..."
              @place_changed="searchLocation"
        />
  
          </div>
        </div>
    </GMapMap>
  </div>
   
  <div class="marquee-container" style="position: absolute; top: 60px; left: 50%; transform: translateX(-50%);" v-if="zoomLevel < 13">
    <!--
    <div :class="['marquee-text', { paused: isPaused }]" style="color: red; font-weight: bold; font-size: 18px;">
      此縮放等級無法顯示號誌
    </div>
  -->
    <div :class="['marquee-text']" style="color: red; font-weight: bold; font-size: 18px;">
      此縮放等級無法顯示號誌
    </div>
<!--
    <button style="outline: none; border: none; padding: 10px 25px; border-radius: 10px; cursor: pointer;" @click="togglePause">{{ isPaused ? 'Run' : 'Stop' }}</button>-->
  </div>
  <div v-if="selectedImage" class="image-modal" @click.self="closeImage">
    <div v-if="getFileType(selectedImage) === 'image'">
      <img width="800px" :src="selectedImage" class="image-full" alt="Full Image" />
      </div>
    
    <div v-else-if=" getFileType(selectedImage) === 'video'">
        <video
                                @click="showImage(selectedImage)"
                                style="width: 800px;"
                                controls
                                    :src="selectedImage"
                                  />
        </div>
    
  </div>
  </div>

  <div v-if="isLoading" class="loading-overlay">
    <div class="spinner"></div>
    <p>載入中......</p>
  </div>

  <!-- Overlay toàn màn hình -->
    <div v-if="showInput" class="overlay">
      <div class="input-container">
        <h3>輸入半徑 (Km)</h3>
        <input style="padding: 5px 5px; outline: none;" type="number" v-model.number="inputValue" min="0" placeholder="輸入半徑..." />
        <div style="display: flex;">
          <button style="padding: 5px 25px; margin: 0 10px; outline: none; border: none;" @click="submitInput">Send</button>
          <button style="padding: 5px 25px; outline: none; border: none;" @click="showInput = false">Canl</button>
          </div>
        
      </div>
    </div>
</template>

<script setup>
/* global google */
// eslint-disable-next-line vue/no-side-effects-in-computed-properties
import { ref, onMounted, computed, onUnmounted, getCurrentInstance, watch } from "vue";
import axios from "axios";
import PagesTotal from "./PageList/PagesTotal.vue";
import { GMapTrafficLayer } from "@fawmi/vue-google-maps";
import { useRouter } from "vue-router";
import {useCounterStore} from '../store'
import { useDebounceFn } from '@vueuse/core' // Giúp debounce dễ hơn
import haversine from 'haversine-distance'; // tính khoảng cách giữa 2 điểm
const showMarkers = ref(false)
// Vị trí trung tâm bản đồ (Hồ Chí Minh)
const mapCenter = ref({ lat: 22.99318457718073, lng: 120.20495235408347 });
const zoomLevel = ref(15);
const valueE = ref("")
const page = ref(1)
const totalPage = ref(0)
const pageSize = ref(5)
const store = useCounterStore()
const router = useRouter()
// const heighData = ref(130)
// Vị trí hiện tại của người dùng
const currentLocation = ref({ lat: 22.99318457718073, lng: 120.20495235408347 });
// Danh sách địa chỉ và vị trí đã giải mã
const resolvedLocations = ref([]);
const searchAddress = ref("");
const searchAddressHome = ref("");
const selectedLocation = ref(null); // Địa điểm được chọn để tìm đường đi
const routePath = ref([]);
const routeDistance = ref(null); // Lưu khoảng cách quãng đường
// Khóa API của OpenRouteService
const apiKey = "5b3ce3597851110001cf6248bd48b134d5f8443fb2a538a1554ee87e";
const showDistance = ref(true);
const showDistanceList = ref(true);
const showTimeDiChuyen = ref(null);
const showTimeDiChuyenKm = ref(null);
const boundaryCoordinates = ref([]);
const selectedTheme = ref('Standard')
// const intervalData = ref(null)
const checkData = ref(false)
const selectedImage = ref(null)
const trafficLayer = ref(null)
const sonumber = ref(4)
const trafficVisible = ref(false); // Trạng thái bật/tắt giao thông
const isAction = ref(false)
const dataLocation = ref(null)
const classI = ref(null)
const showInput = ref(false)
const inputValue = ref(0)
const dataSelect = ref(null)
const showDetails = ref(false)
const searchUserName = ref("")
const dataSearchUserName = ref([])
const dataUser = ref([])
const duongdi = ref([])
// const isPaused = ref(true)

// const togglePause = () => {
//   isPaused.value = !isPaused.value
// }

const itemRefs = ref({}) // lưu ref theo id_index

const sortPointsByNearest = (startPoint, points) => {
  const sortedPoints = [];
  let currentPoint = startPoint;
  let remainingPoints = [...points]; // copy để không ảnh hưởng dữ liệu gốc

  while (remainingPoints.length > 0) {
    // Tìm điểm gần nhất
    let nearestIndex = 0;
    let nearestDistance = haversine(
      { lat: currentPoint.lat, lng: currentPoint.lng },
      { lat: remainingPoints[0].lat, lng: remainingPoints[0].lng }
    );

    for (let i = 1; i < remainingPoints.length; i++) {
      const distance = haversine(
        { lat: currentPoint.lat, lng: currentPoint.lng },
        { lat: remainingPoints[i].lat, lng: remainingPoints[i].lng }
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestIndex = i;
      }
    }

    // Chọn điểm gần nhất
    const nextPoint = remainingPoints.splice(nearestIndex, 1)[0];
    sortedPoints.push(nextPoint);
    currentPoint = nextPoint; // cập nhật điểm hiện tại
  }

  return sortedPoints;
};
const searchDuongdi = async (id) => {
  const res = await axios.get(hostName + `/api/TrafficEquipment/FindAllErrorCode0ByAccount?id=${id}&page=1&pageSize=2000`, getToken())

  if(res.data.success){
    duongdi.value = res.data.content.data
    locations.value = res.data.content.data.map(m => ({
          ...m,
          coordinates: { lat: m.latitude, lng: m.longitude }
      }))

      console.log("Data log: ", locations.value)

      getDirectionsList()
  }

}

const getDirectionsList = async () => {

  const start = currentLocation.value; // Vị trí bắt đầu (bạn)
  const waypoints = duongdi.value.map(loc => ({
    lng: loc.longitude,
    lat: loc.latitude
  })); // Các điểm đi qua

  const sortData = sortPointsByNearest(start, waypoints)
  console.log("Data Sort: ", sortData)

  const allPoints = [start, ...sortData];
  console.log("Data No Sort : ", allPoints)

  isLoading.value = true;
  document.body.classList.add("loading");
  document.body.style.overflow = "hidden";

  try {
    // Với nhiều điểm, OpenRouteService yêu cầu POST JSON body
    const response = await axios.post(
      `https://api.openrouteservice.org/v2/directions/driving-car/geojson`,
      {
        coordinates: allPoints.map(p => [p.lng, p.lat]),
      },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.features && response.data.features.length > 0) {
      const route = response.data.features[0];
      const coordinates = route.geometry.coordinates.map(coord => ({
        lat: coord[1],
        lng: coord[0]
      }));

      routePath.value = coordinates;
      routeDistance.value = route.properties.segments.reduce((sum, seg) => sum + seg.distance, 0) / 1000; // tổng km
      showTimeDiChuyenKm.value = routeDistance.value;
      showTimeDiChuyen.value = formatTime(route.properties.segments.reduce((sum, seg) => sum + seg.duration, 0));
    } else {
      console.error("Không tìm thấy tuyến đường nào!");
      routePath.value = [];
      routeDistance.value = null;
    }
  } catch (error) {
    console.error("Lỗi khi lấy đường đi:", error);
    routePath.value = [];
    routeDistance.value = null;
  }

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
};

const updateUser = async (location, user, classData) => {
  if(confirm("Hello World, Are you sure you want to choose this person?")){
    const res = await axios.put(hostName + `/api/RepairDetails/UpdateConfimData`, {id: location, id_user: user}, getToken())
    if(res.data.success){
      alert("Success")
      searchDataSelect()

      const items = document.querySelectorAll('.' + classData)
      items.forEach((item, index) => {
        if(index == 1){
          item.style.transform = 'scale(1)'
        }
      })
    }
  }
}
const showBoxSearch = async (classData, classShow, type) =>{
  const myDiv = document.querySelector('.' + classShow);
      
      
  const items = document.querySelectorAll('.' + classData)
  if(!items || !myDiv) return

  const res = await axios.get(hostName + `/api/User/searchName?name=${searchUserName.value.trim()}`, getToken())
if(res.data.success){
  dataSearchUserName.value = res.data.content.data
}
      const displayStyle = window.getComputedStyle(myDiv).display;
  items.forEach((item, index) => {
    if(index == 1){
      if (displayStyle === 'none') {
          item.style.transform = 'scale(0)'
          myDiv.style.display = 'block'
          console.log('Div đang ẩn (display: none)');
        } else if(displayStyle === 'block' && dataSearchUserName.value.length <= 0) {
          myDiv.style.display = 'none'
          item.style.transform = 'scale(1)'
          console.log('Div đang hiện (display khác none)');
        }else if(type === 'huy'){
          myDiv.style.display = 'none'
          item.style.transform = 'scale(1)'
          console.log('Div đang hiện (display khác none)');
        }
    }
    
  })


  

}
const showDetailsAll = (check) => {
if(dataSelect.value == 'b1s'){
  showdivAuto('div1', check)
   showdivChuAuto('divchu1', check)
   showdivStatusAuto('status1', check)
   showdivDetailsAuto('details1', check)
}
else if(dataSelect.value == 'b2s'){
  showdivAuto('div2', check)
   showdivChuAuto('divchu2', check)
   showdivStatusAuto('status2', check)
   showdivDetailsAuto('details2', check)
}

else if(dataSelect.value == 'b3s'){
  showdivAuto('div3', check)
   showdivChuAuto('divchu3', check)
   showdivStatusAuto('status3', check)
   showdivDetailsAuto('details3', check)
}

else if(dataSelect.value == 'b4s'){
  showdivAuto('div4', check)
   showdivChuAuto('divchu4', check)
   showdivStatusAuto('status4', check)
   showdivDetailsAuto('details4', check)
}

else if(dataSelect.value == 'b5s'){
  showdivAuto('div0', check)
   showdivChuAuto('divchu0', check)
   showdivStatusAuto('status0', check)
   showdivDetailsAuto('details0', check)
}

else if(dataSelect.value == 'all'){
  showdivAuto('div1', check)
  showdivChuAuto('divchu1', check)
   showdivStatusAuto('status1', check)
   showdivDetailsAuto('details1', check)

   showdivAuto('div2', check)
   showdivChuAuto('divchu2', check)
   showdivStatusAuto('status2', check)
   showdivDetailsAuto('details2', check)

  showdivAuto('div3', check)
   showdivChuAuto('divchu3', check)
   showdivStatusAuto('status3', check)
   showdivDetailsAuto('details3', check)

   showdivAuto('div4', check)
   showdivChuAuto('divchu4', check)
   showdivStatusAuto('status4', check)
   showdivDetailsAuto('details4', check)

   showdivAuto('div0', check)
   showdivChuAuto('divchu0', check)
   showdivStatusAuto('status0', check)
   showdivDetailsAuto('details0', check)
}
   
}

const showdivAuto = (divData, check) => {
  const items = document.querySelectorAll('.' + divData)
  items.forEach((item, index) => {
    if(check){
      if(locations.value[index].totalUpdate > 0 && locations.value[index].account_user == null && locations.value[index].isError == true){
        item.style.height = '320px'
      }
      else if((locations.value[index].totalUpdate > 0 && locations.value[index].account_user != null && locations.value[index].isError == true) || (locations.value[index].totalUpdate <= 0 && locations.value[index].account_user == null && locations.value[index].isError == true)){
        item.style.height = '270px'
      }
      else{
        console.log("Data Log: ", locations.value)
        item.style.height = '230px'
      }
    }else{
      item.style.height = '60px'
    }
    
    item.style.transition = '0.5s ease-in-out'
  })
}

const showdivChuAuto = (divData, check) => {
  const items = document.querySelectorAll('.' + divData)
  items.forEach(item => {
    item.style.borderBottom = check ? '1px dashed black' : 'none'
    item.style.transition = '0.5s ease-in-out'
  })
}

const showdivStatusAuto = (divData, check) => {
  const items = document.querySelectorAll('.' + divData)
  items.forEach(item => {
    item.style.transform = check ? 'scale(1)' : 'scale(0)'
    item.style.transition = '0.5s ease-in-out'
  })
}

const showdivDetailsAuto = (divData, check) => {
  const items = document.querySelectorAll('.' + divData)
  items.forEach(item => {
    item.style.transform = check ? 'scale(1)' : 'scale(0)'
    item.style.height = check ? '50px' : '0px'
    item.style.transition = '0.5s ease-in-out'
  })
}

const setItemRef = (id, index, el) =>{
  if (el) {
    itemRefs.value[`${id}_${index}`] = el
  }
}

const scrollToItem = (id, index) => {
  const key = `${id}_${index}`
  const el = itemRefs.value[key]
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const timkiemDataRoad = () => {
  if(!valueE.value){
    btnSearch.value = null
    pageSize.value = 22000
  }
    
  findAllDataMap(valueE.value, page.value)
  isPhanTrang.value = true
  dataSelect.value = 'all'
}

const fomatDate = (rawDate) => {
  const date = new Date(rawDate);

const formatted = new Intl.DateTimeFormat('vi-VN').format(date);
return formatted
}
const showDetailsDiv = (classData, classDiv, location) => {
  const element = document.querySelector('.' + classData);
  if (!element) return;
    // Kiểm tra xem đã là scaleX(1) hay chưa
  const isScaled = getScaleX(element)

  console.log("Data Check " , isScaled)
  element.style.transform = isScaled === 1 ? 'scale(0)' : 'scale(1)'
  element.style.transition = '0.4s ease'

  document.querySelector('.' + classDiv).style.transition = 'height 0.4s ease'
  if(isScaled === 1){
  document.querySelector('.' + classDiv).style.height = location.account_user == null && location.isError == true ? '270px' : '230px'
  document.querySelector('.' + classData).style.height = '0px'
  }else{
  document.querySelector('.' + classDiv).style.height = location.account_user == null && location.isError == true ?  '320px' : '270px'
  document.querySelector('.' + classData).style.height = '50px'
  }
}
const getFileType = (url) => {
  const extension = url.split('.').pop().toLowerCase()

  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) return 'image'
  if (['mp4', 'webm', 'ogg'].includes(extension)) return 'video'
  if (['pdf'].includes(extension)) return 'pdf'
  if (['doc', 'docx'].includes(extension)) return 'word'
  if (['xls', 'xlsx'].includes(extension)) return 'excel'

  return 'other'
}
const isCheckShow = ref(1)
const ranges = ref([0, 0, 0])

const isPhanTrang = ref(true)

// const mapOptions = ref({
//   /*
//     "labels.text": Chỉnh toàn bộ chữ trong nhãn.
//     "labels.text.fill": Chỉ chỉnh màu chữ.
//     "weight": "bold": Làm chữ đậm.
//   */
//   disableDefaultUI: true,
//   styles: [
//     {
//     featureType: "poi",
//     elementType: "labels", // Ẩn tất cả nhãn POI
//     stylers: [{ visibility: "off" }]
//     },
//     {
//       featureType: "poi.park", // Hiển thị công viên với màu xanh lá
//       elementType: "labels",
//       stylers: [{ color: "#a0e99b" }, { visibility: "on" }],
//     },
//     {
//       featureType: "poi.business", // Làm mờ các khu vực kinh doanh
//       elementType: "labels",
//       stylers: [{ color: "#f5f5f5" }, { visibility: "on" }],
//     },
//     {
//       featureType: "poi.attraction", // Tô màu nổi bật cho địa điểm du lịch
//       elementType: "labels",
//       stylers: [{ color: "#ffcc00" }, { visibility: "on" }],
//     },
//     {
//       featureType: "poi.school", // Hiển thị trường học với màu xanh dương
//       elementType: "labels.text", 
//       stylers: [{ color: "#80bfff" }, { visibility: "on" }, {weight: "normal"}], // Dùng "{gamma: 2}" để tăng độ tương phản, giúp chữ rõ hơn.
//     },
//   ],
// });
const mapOptions = ref({
styles: [], // Ban đầu không có style
});

const isShowHome = ref(false)
const mapStyles = ref({
    Standard: [
{
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative",
  elementType: "geometry",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.neighborhood",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.business",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.school",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.government",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.place_of_worship",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.sports_complex",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.medical",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels.icon",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.arterial",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "transit",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
],
    Retro: [
    {
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  elementType: "geometry",
  stylers: [
    {
      color: "#ebe3cd"
    }
  ]
},
{
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#523735"
    }
  ]
},
{
  elementType: "labels.text.stroke",
  stylers: [
    {
      color: "#f5f1e6"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative",
  elementType: "geometry.stroke",
  stylers: [
    {
      color: "#c9b2a6"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  elementType: "geometry.stroke",
  stylers: [
    {
      color: "#dcd2be"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#ae9e90"
    }
  ]
},
{
  featureType: "administrative.neighborhood",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "landscape.natural",
  elementType: "geometry",
  stylers: [
    {
      color: "#dfd2ae"
    }
  ]
},
{
  featureType: "poi",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "geometry",
  stylers: [
    {
      color: "#dfd2ae"
    }
  ]
},
{
  featureType: "poi",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#93817c"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "geometry.fill",
  stylers: [
    {
      color: "#a5b076"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#447530"
    }
  ]
},
{
  featureType: "poi.business",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "geometry",
  stylers: [
    {
      color: "#f5f1e6"
    }
  ]
},
{
  featureType: "road.arterial",
  stylers: [
    {
    }
  ]
},
{
  featureType: "road.arterial",
  elementType: "geometry",
  stylers: [
    {
      color: "#fdfcf8"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "geometry",
  stylers: [
    {
      color: "#f8c967"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "geometry.stroke",
  stylers: [
    {
      color: "#e9bc62"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway.controlled_access",
  elementType: "geometry",
  stylers: [
    {
      color: "#e98d58"
    }
  ]
},
{
  featureType: "road.highway",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway.controlled_access",
  elementType: "geometry.stroke",
  stylers: [
    {
      color: "#db8555"
    }
  ]
},
{
  featureType: "transit",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#806b63"
    }
  ]
},
{
  featureType: "transit.line",
  elementType: "geometry",
  stylers: [
    {
      color: "#dfd2ae"
    }
  ]
},
{
  featureType: "transit.line",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#8f7d77"
    }
  ]
},
{
  featureType: "transit.line",
  elementType: "labels.text.stroke",
  stylers: [
    {
      color: "#ebe3cd"
    }
  ]
},
{
  featureType: "transit.station",
  elementType: "geometry",
  stylers: [
    {
      color: "#dfd2ae"
    }
  ]
},
{
  featureType: "water",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "geometry.fill",
  stylers: [
    {
      color: "#b9d3c2"
    }
  ]
},
{
  featureType: "water",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#92998d"
    }
  ]
}
]
,
    Silver: [
{
  elementType: "geometry",
  stylers: [
    {
      color: "#f5f5f5"
    }
  ]
},
{
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  elementType: "labels.icon",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#616161"
    }
  ]
},
{
  elementType: "labels.text.stroke",
  stylers: [
    {
      color: "#f5f5f5"
    }
  ]
},
{
  featureType: "administrative",
  elementType: "geometry",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
featureType: "administrative.land_parcel",
stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.neighborhood",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#bdbdbd",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "geometry",
  stylers: [
    {
      color: "#eeeeee",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#757575",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "geometry",
  stylers: [
    {
      color: "#e5e5e5",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.business",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#9e9e9e",
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels.icon",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "geometry",
  stylers: [
    {
      color: "#ffffff",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.arterial",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.arterial",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.arterial",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#757575",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "geometry",
  stylers: [
    {
      color: "#dadada",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#616161",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#9e9e9e",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "transit",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "transit.line",
  elementType: "geometry",
  stylers: [
    {
      color: "#e5e5e5",
      visibility: "on"
    }
  ]
},
{
  featureType: "transit.station",
  elementType: "geometry",
  stylers: [
    {
      color: "#eeeeee",
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "geometry",
  stylers: [
    {
      color: "#c9c9c9",
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "labels.text.fill",
  
}
],
    Dark: [
{
  elementType: "geometry",
  stylers: [
    {
      color: "#212121"
    }
  ]
},
{
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  elementType: "labels.icon",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#757575"
    }
  ]
},
{
  elementType: "labels.text.stroke",
  stylers: [
    {
      color: "#212121"
    }
  ]
},
{
  featureType: "administrative",
  elementType: "geometry",
  stylers: [
    {
      color: "#757575",
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.neighborhood",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.country",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#9e9e9e",
      
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.locality",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#bdbdbd",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#757575",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "geometry",
  stylers: [
    {
      color: "#181818",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#616161",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "labels.text.stroke",
  stylers: [
    {
      color: "#1b1b1b",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.business",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "geometry.fill",
  stylers: [
    {
      color: "#2c2c2c",
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#8a8a8a",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.arterial",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.arterial",
  elementType: "geometry",
  stylers: [
    {
      color: "#373737",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "geometry",
  stylers: [
    {
      color: "#3c3c3c",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway.controlled_access",
  elementType: "geometry",
  stylers: [
    {
      color: "#4e4e4e",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#616161",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.arterial",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels.icon",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "transit",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "transit",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#757575",
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "geometry",
  stylers: [
    {
      color: "#000000",
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#3d3d3d",
      visibility: "on"
    }
  ]
}
],
    Night: [
{
  elementType: "geometry",
  stylers: [
    {
      color: "#242f3e"
    }
  ]
},
{
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#746855"
    }
  ]
},
{
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  elementType: "labels.text.stroke",
  stylers: [
    {
      color: "#242f3e"
    }
  ]
},
{
  featureType: "administrative.neighborhood",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative",
  elementType: "geometry",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.locality",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#d59563",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#d59563",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "geometry",
  stylers: [
    {
      color: "#263c3f",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.business",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#6b9a76",
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels.icon",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "geometry",
  stylers: [
    {
      color: "#38414e",
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "geometry.stroke",
  stylers: [
    {
      color: "#212a37",
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#9ca5b3",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "geometry",
  stylers: [
    {
      color: "#746855",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "geometry.stroke",
  stylers: [
    {
      color: "#1f2835",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#f3d19c",
      visibility: "on"
    }
  ]
},
{
  featureType: "transit",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "transit",
  elementType: "geometry",
  stylers: [
    {
      color: "#2f3948",
      visibility: "on"
    }
  ]
},
{
  featureType: "transit.station",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#d59563",
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "geometry",
  stylers: [
    {
      color: "#17263c",
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#515c6d",
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "labels.text.stroke",
  stylers: [
    {
      color: "#17263c",
      visibility: "on"
    }
  ]
}
],
Aubergine: [
{
  elementType: "geometry",
  stylers: [
    {
      color: "#1d2c4d"
    }
  ]
},
{
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  elementType: "labels.text.fill",
  stylers: [ 
    {
      color: "#8ec3b9"
    }
  ]
},
{
  elementType: "labels.text.stroke",
  stylers: [
    {
      color: "#1a3646"
    }
  ]
},

{
  featureType: "administrative",
  elementType: "geometry",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.neighborhood",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.country",
  elementType: "geometry.stroke",
  stylers: [
    {
      color: "#4b6878",
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.land_parcel",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#64779e",
      visibility: "on"
    }
  ]
},
{
  featureType: "administrative.province",
  elementType: "geometry.stroke",
  stylers: [
    {
      color: "#4b6878",
      visibility: "on"
    }
  ]
},
{
  featureType: "landscape.man_made",
  elementType: "geometry.stroke",
  stylers: [
    {
      color: "#334e87",
      visibility: "on"
    }
  ]
},
{
  featureType: "landscape.natural",
  elementType: "geometry",
  stylers: [
    {
      color: "#023e58",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "geometry",
  stylers: [
    {
      color: "#283d6a",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#6f9ba5",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi",
  elementType: "labels.text.stroke",
  stylers: [
    {
      color: "#1d2c4d",
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.business",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "geometry.fill",
  stylers: [
    {
      color: "#023e58",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels.icon",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "poi.park",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#3C7680",
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "geometry",
  stylers: [
    {
      color: "#304a7d",
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#98a5be",
      visibility: "on"
    }
  ]
},
{
  featureType: "road",
  elementType: "labels.text.stroke",
  stylers: [
    {
      color: "#1d2c4d",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "geometry",
  stylers: [
    {
      color: "#2c6675",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "geometry.stroke",
  stylers: [
    {
      color: "#255763",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#b0d5ce",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "labels.text.stroke",
  stylers: [
    {
      color: "#023e58",
      visibility: "on"
    }
  ]
},
{
  featureType: "road.local",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.highway",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.arterial",
  elementType: "labels",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "road.arterial",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "transit",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "transit",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#98a5be",
      visibility: "on"
    }
  ]
},
{
  featureType: "transit",
  elementType: "labels.text.stroke",
  stylers: [
    {
      color: "#1d2c4d",
      visibility: "on"
    }
  ]
},
{
  featureType: "transit.line",
  elementType: "geometry.fill",
  stylers: [
    {
      color: "#283d6a",
      visibility: "on"
    }
  ]
},
{
  featureType: "transit.station",
  elementType: "geometry",
  stylers: [
    {
      color: "#3a4762",
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "labels.text",
  stylers: [
    {
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "geometry",
  stylers: [
    {
      color: "#0e1626",
      visibility: "on"
    }
  ]
},
{
  featureType: "water",
  elementType: "labels.text.fill",
  stylers: [
    {
      color: "#4e6d70",
      visibility: "on"
    }
  ]
}
],
  })
const poiStart = () => {
mapOptions.value.styles = [{
    featureType: "poi",
    elementType: "labels", // Ẩn tất cả nhãn POI
    stylers: [{ visibility: "off" }]
  }]
}
const logout = async () => {
  isLoading.value = true;
document.body.classList.add("loading"); // Add Lớp "loading"
document.body.style.overflow = "hidden";
  const res = await axios.post(hostName + '/api/User/Logout', {}, getToken())
  store.clearStore()
  if(res.data.success){
    
    router.push("/login")
  }

  isLoading.value = false;
document.body.classList.remove("loading");
document.body.style.overflow = "auto";
}
// Danh sách địa điểm với thông tin chi tiết
const locations = ref([]);

const checkDataPoiOptions = (dataPoi, labels, status) => {
  const findOneData = mapStyles.value[selectedTheme.value]
  if(findOneData != null){
    findOneData.forEach(item => {
      if(item.featureType && item.featureType.includes(dataPoi)){
           findOneData.forEach(item =>{
            if(item.featureType && item.featureType.includes(dataPoi)){
              const dataAdds = item.stylers.some(styler => "visibility" in styler)
              if(Object.prototype.hasOwnProperty.call(item, "elementType")){
                if(item.elementType == labels){
                  if(!dataAdds){
                    item.stylers.push({visibility: `${status}`})
                    
                  }else{
                      item.stylers.forEach(items => {
                        items.visibility = `${status}`
                      })
                    }
                }
              }else if(!Object.prototype.hasOwnProperty.call(item, "elementType")){
                if(!dataAdds){
                    item.stylers.push({visibility: `${status}`})
                    
                  }else{
                      item.stylers.forEach(items => {
                        items.visibility = `${status}`
                      })
                    }
              }
            }
          });
        }


        else if(item.elementType && item.elementType.includes(labels)){
           findOneData.forEach(item =>{
            if(item.elementType && item.elementType.includes(labels)){
              const dataAdds = item.stylers.some(styler => "visibility" in styler)
              if(!Object.prototype.hasOwnProperty.call(item, "featureType")){
                if(item.elementType == labels){
                  if(!dataAdds){
                    item.stylers.push({visibility: `${status}`})
                    
                  }else{
                      item.stylers.forEach(items => {
                        items.visibility = `${status}`
                      })
                    }
                }
                
              }
            }
          });
        }
    })
    
  }

  
}
const updatePoiStyle = (data, index) => {
// const findOneData = mapStyles.value.find(element => 
//   Object.prototype.hasOwnProperty.call(element, selectedTheme.value)
// );

const findOneData = mapStyles.value[selectedTheme.value]

if(findOneData != null){
  findOneData.forEach(() => {
    if(selectedTheme.value == "Standard"){
    if(data == 4 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "on")
      checkDataPoiOptions("poi.school", "labels", "on")
      checkDataPoiOptions("road.arterial", "", "on")
      checkDataPoiOptions("road.highway", "labels", "on")
      checkDataPoiOptions("road.local", "", "on")
      checkDataPoiOptions("road", "", "on")

      checkDataPoiOptions("poi.government", "labels", "on")
      checkDataPoiOptions("poi.place_of_worship", "labels", "on")
      checkDataPoiOptions("road.sports_complex", "labels", "on")
      checkDataPoiOptions("road.medical", "labels", "on")

    }
    else if(sonumber.value > data && data !== 0 && data == 3 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "off")
      checkDataPoiOptions("poi.school", "labels", "off")
      checkDataPoiOptions("road.highway", "labels", "off")
      checkDataPoiOptions("road.local", "", "off")
        
    }else if(sonumber.value > data && data !== 0 && data == 2 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "off")
      checkDataPoiOptions("poi.school", "labels", "off")
      checkDataPoiOptions("poi.government", "labels", "off")
      checkDataPoiOptions("poi.place_of_worship", "labels", "off")
      checkDataPoiOptions("road.arterial", "", "off")
      checkDataPoiOptions("road.highway", "labels", "off")
      checkDataPoiOptions("road.local", "", "off")

    }else if(sonumber.value > data && data !== 0 && data == 1 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "off")
      checkDataPoiOptions("poi.school", "labels", "off")
      checkDataPoiOptions("poi.government", "labels", "off")
      checkDataPoiOptions("poi.place_of_worship", "labels", "off")
      checkDataPoiOptions("road.arterial", "", "off")
      checkDataPoiOptions("road.highway", "labels", "off")
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("road.sports_complex", "labels", "off")
      checkDataPoiOptions("road.medical", "labels", "off")
      checkDataPoiOptions("road", "", "off")

    }else if(data == 0 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "off")
      checkDataPoiOptions("poi.school", "labels", "off")
      checkDataPoiOptions("poi.government", "labels", "off")
      checkDataPoiOptions("poi.place_of_worship", "labels", "off")
      checkDataPoiOptions("road.arterial", "", "off")
      checkDataPoiOptions("road.highway", "labels", "off")
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("road.sports_complex", "labels", "off")
      checkDataPoiOptions("road.medical", "labels", "off")
      checkDataPoiOptions("road", "", "off")

    }else if(sonumber.value < data && data !== 0 && data == 3 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "off")
      checkDataPoiOptions("poi.school", "labels", "off")
      checkDataPoiOptions("road.arterial", "", "off")
      checkDataPoiOptions("road.highway", "labels", "off")
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("road", "", "off")
      
    }else if(sonumber.value < data && data !== 0 && data == 2 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "on")
      checkDataPoiOptions("poi.school", "labels", "on")
      checkDataPoiOptions("poi.government", "labels", "on")
      checkDataPoiOptions("poi.place_of_worship", "labels", "on")
      checkDataPoiOptions("road.arterial", "", "on")
      checkDataPoiOptions("road.highway", "labels", "on")
      checkDataPoiOptions("road.local", "", "on")
    }else if(sonumber.value < data && data !== 0 && data == 1 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "on")
      checkDataPoiOptions("poi.school", "labels", "on")
      checkDataPoiOptions("road.highway", "labels", "on")
      checkDataPoiOptions("road.local", "", "on")
    }

    else if(data == 4 && index == 1){
      checkDataPoiOptions("poi.business", "", "on")
      checkDataPoiOptions("poi.park", "labels.text", "on")
      checkDataPoiOptions("road", "labels.icon", "on")
      checkDataPoiOptions("transit", "", "on")
      checkDataPoiOptions("administrative", "geometry", "on")
      checkDataPoiOptions("poi", "", "on")
    }else if(sonumber.value > data && data !== 0 && data == 3 && index == 1){
      checkDataPoiOptions("poi.business", "", "off")
      checkDataPoiOptions("poi.park", "labels.text", "off")

    }else if(sonumber.value > data && data !== 0 && data == 2 && index == 1){
      // checkDataPoiOptions("road", "labels.icon", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("transit", "", "off")
      checkDataPoiOptions("poi.business", "", "off")
      checkDataPoiOptions("poi.park", "labels.text", "off")

    }else if(sonumber.value > data && data !== 0 && data == 1 && index == 1){
      // checkDataPoiOptions("road", "labels.icon", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("transit", "", "off")
      checkDataPoiOptions("poi.business", "", "off")
      checkDataPoiOptions("poi.park", "labels.text", "off")
      checkDataPoiOptions("poi", "", "off")

    }else if(data == 0 && index == 1){
      // checkDataPoiOptions("road", "labels.icon", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("transit", "", "off")
      checkDataPoiOptions("poi.business", "", "off")
      checkDataPoiOptions("poi.park", "labels.text", "off")
      checkDataPoiOptions("poi", "", "off")
    }else if(sonumber.value < data && data !== 0 && data == 1 && index == 1){
      // checkDataPoiOptions("road", "labels.icon", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("transit", "", "on")
      checkDataPoiOptions("poi.business", "", "on")
      checkDataPoiOptions("poi.park", "labels.text", "on")
      checkDataPoiOptions("poi", "", "on")
      checkDataPoiOptions("transit", "", "on")
    }else if(sonumber.value < data && data !== 0 && data == 2 && index == 1){
      // checkDataPoiOptions("road", "labels.icon", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("transit", "", "on")
      checkDataPoiOptions("poi.business", "", "on")
      checkDataPoiOptions("poi.park", "labels.text", "on")
      checkDataPoiOptions("transit", "", "on")


    }else if(sonumber.value < data && data !== 0 && data == 3 && index == 1){ 
      // checkDataPoiOptions("road", "labels.icon", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("transit", "", "on")
      checkDataPoiOptions("poi.business", "", "on")
      checkDataPoiOptions("poi.park", "labels.text", "on")
      checkDataPoiOptions("poi", "", "on")
      checkDataPoiOptions("administrative", "", "on")
    }else if(sonumber.value > data && data !== 0 && data == 3 && index == 2){
      checkDataPoiOptions("road.local", "labels", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("administrative.land_parcel", "labels", "off")
    }else if(sonumber.value > data && data !== 0 && data == 2 && index == 2){
      checkDataPoiOptions("road.local", "labels", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("administrative.land_parcel", "labels", "off")
      checkDataPoiOptions("road", "labels", "off")
      checkDataPoiOptions("water", "labels.text", "off")
      checkDataPoiOptions("administrative.neighborhood", "", "off")

    }else if(sonumber.value > data && data !== 0 && data == 1 && index == 2){
      checkDataPoiOptions("road.local", "labels", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("administrative.land_parcel", "labels", "off")
      checkDataPoiOptions("administrative.land_parcel", "", "off")
      checkDataPoiOptions("road", "labels", "off")
      checkDataPoiOptions("water", "labels.text", "off")
      checkDataPoiOptions("administrative.neighborhood", "", "off")
      checkDataPoiOptions("", "labels", "off")

    }else if(data == 0 && index == 2){
      checkDataPoiOptions("road.local", "labels", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("administrative.land_parcel", "labels", "off")
      checkDataPoiOptions("administrative.land_parcel", "", "off")
      checkDataPoiOptions("road", "labels", "off")
      checkDataPoiOptions("water", "labels.text", "off")
      checkDataPoiOptions("administrative.neighborhood", "", "off")
      checkDataPoiOptions("", "labels", "off")
    }else if(data == 4 && index == 2){
      checkDataPoiOptions("road.local", "labels", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("administrative.land_parcel", "labels", "on")
      checkDataPoiOptions("administrative.land_parcel", "", "on")
      checkDataPoiOptions("road", "labels", "on")
      checkDataPoiOptions("water", "labels.text", "on")
      checkDataPoiOptions("administrative.neighborhood", "", "on")
      checkDataPoiOptions("", "labels", "on")
    }else if(sonumber.value < data && data !== 0 && data == 3 && index == 2){
      checkDataPoiOptions("road.local", "labels", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("administrative.land_parcel", "labels", "on")
      checkDataPoiOptions("administrative.land_parcel", "", "on")
      checkDataPoiOptions("road", "labels", "on")
      checkDataPoiOptions("water", "labels.text", "on")
      checkDataPoiOptions("administrative.neighborhood", "", "on")
      checkDataPoiOptions("", "labels", "on")

    }else if(sonumber.value < data && data !== 0 && data == 2 && index == 2){
      checkDataPoiOptions("road.local", "labels", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("administrative.land_parcel", "labels", "on")
      checkDataPoiOptions("road", "labels", "on")
      checkDataPoiOptions("water", "labels.text", "on")
      checkDataPoiOptions("administrative.neighborhood", "", "on")

    }else if(sonumber.value < data && data !== 0 && data == 1 && index == 2){
      checkDataPoiOptions("road.local", "labels", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("administrative.land_parcel", "labels", "on")
    }
}
    
  else if(selectedTheme.value == "Retro"){
     if(sonumber.value > data && data !== 0 && data == 3 && index == 0){
      checkDataPoiOptions("road.highway", "", "off")
      checkDataPoiOptions("road.local", "", "off")
      
        
    }
    else if(sonumber.value > data && data !== 0 && data == 2 && index == 0){
      checkDataPoiOptions("road.highway", "", "off")
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("road.arterial", "", "off")
      
        
    }else if(sonumber.value > data && data !== 0 && data == 1 && index == 0){
      checkDataPoiOptions("road.highway", "", "off")
      checkDataPoiOptions("road.highway", "labels", "off")
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("road.arterial", "", "off")
      
        
    }else if(data == 0 && index == 0){
      checkDataPoiOptions("road.highway", "", "off")
      checkDataPoiOptions("road.highway", "labels", "off")
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("road.arterial", "", "off")
      checkDataPoiOptions("road", "", "off")

    }else if(data == 4 && index == 0){
      checkDataPoiOptions("road.highway", "", "on")
      checkDataPoiOptions("road.highway", "labels", "on")
      checkDataPoiOptions("road.local", "", "on")
      checkDataPoiOptions("road.arterial", "", "on")
      checkDataPoiOptions("road", "", "on")
    }else if(sonumber.value < data && data !== 0 && data == 1 && index == 0){
      checkDataPoiOptions("road.highway", "labels", "on")

    }else if(sonumber.value < data && data !== 0 && data == 2 && index == 0){
      checkDataPoiOptions("road.highway", "labels", "on")
      checkDataPoiOptions("road.arterial", "", "on")
    }else if(sonumber.value < data && data !== 0 && data == 3 && index == 0){
      checkDataPoiOptions("road.highway", "labels", "on")
      checkDataPoiOptions("road.arterial", "", "on")
      checkDataPoiOptions("road.highway", "", "on")
      checkDataPoiOptions("road.local", "", "on")
    }else if(sonumber.value > data && data !== 0 && data == 3 && index == 1){
      checkDataPoiOptions("poi.business", "labels", "off")
      checkDataPoiOptions("poi.park", "labels.text", "off")

    }else if(sonumber.value > data && data !== 0 && data == 2 && index == 1){
      checkDataPoiOptions("poi.business", "labels", "off")
      checkDataPoiOptions("poi.park", "labels.text", "off")
      checkDataPoiOptions("poi", "labels.text", "off")

    }else if(sonumber.value > data && data !== 0 && data == 1 && index == 1){
      checkDataPoiOptions("poi.business", "labels", "off")
      checkDataPoiOptions("poi.park", "labels.text", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("transit", "", "off")

    }else if(data == 0 && index == 1){
      checkDataPoiOptions("poi.business", "labels", "off")
      checkDataPoiOptions("poi.park", "labels.text", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("poi", "", "off")
      checkDataPoiOptions("transit", "", "off")
    }else if(data == 4 && index == 1){
      checkDataPoiOptions("poi.business", "labels", "on")
      checkDataPoiOptions("poi.park", "labels.text", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("poi", "", "on")
      checkDataPoiOptions("transit", "", "on")
    }else if(sonumber.value < data && data !== 0 && data == 3 && index == 1){
      checkDataPoiOptions("poi.business", "labels", "on")
      checkDataPoiOptions("poi.park", "labels.text", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("transit", "", "on")
    }else if(sonumber.value < data && data !== 0 && data == 2 && index == 1){
      checkDataPoiOptions("poi.business", "labels", "on")
      checkDataPoiOptions("poi.park", "labels.text", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
    }else if(sonumber.value < data && data !== 0 && data == 1 && index == 1){
      checkDataPoiOptions("poi.business", "labels", "on")
      checkDataPoiOptions("poi.park", "labels.text", "on")
    }else if(sonumber.value > data && data !== 0 && data == 3 && index == 2){
      checkDataPoiOptions("administrative.land_parcel", "labels", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("road.local", "labels", "off")
    }else if(sonumber.value > data && data !== 0 && data == 2 && index == 2){
      checkDataPoiOptions("administrative.land_parcel", "labels", "off")
      checkDataPoiOptions("administrative.land_parcel", "", "off")
      checkDataPoiOptions("administrative.neighborhood", "", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("road.local", "labels", "off")
      checkDataPoiOptions("water", "", "off")
      checkDataPoiOptions("road", "labels", "off")
      checkDataPoiOptions("", "labels", "off")

    }else if(sonumber.value > data && data !== 0 && data == 1 && index == 2){
      checkDataPoiOptions("administrative.land_parcel", "labels", "off")
      checkDataPoiOptions("administrative.land_parcel", "", "off")
      checkDataPoiOptions("administrative.neighborhood", "", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("road.local", "labels", "off")
      checkDataPoiOptions("water", "", "off")
      checkDataPoiOptions("road", "labels", "off")
      checkDataPoiOptions("", "labels", "off")
    }else if(data == 0 && index == 2){
      checkDataPoiOptions("administrative.land_parcel", "labels", "off")
      checkDataPoiOptions("administrative.land_parcel", "", "off")
      checkDataPoiOptions("administrative.neighborhood", "", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("road.local", "labels", "off")
      checkDataPoiOptions("water", "", "off")
      checkDataPoiOptions("road", "labels", "off")
      checkDataPoiOptions("", "labels", "off")
    }else if(data == 4 && index == 2){
      checkDataPoiOptions("administrative.land_parcel", "labels", "on")
      checkDataPoiOptions("administrative.land_parcel", "", "on")
      checkDataPoiOptions("administrative.neighborhood", "", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("road.local", "labels", "on")
      checkDataPoiOptions("water", "", "on")
      checkDataPoiOptions("road", "labels", "on")
      checkDataPoiOptions("", "labels", "on")
    }else if(sonumber.value < data && data !== 0 && data == 1 && index == 2){
      checkDataPoiOptions("administrative.land_parcel", "labels", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("road.local", "labels", "on")
    }else if(sonumber.value < data && data !== 0 && data == 2 && index == 2){
      checkDataPoiOptions("administrative.land_parcel", "labels", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("road.local", "labels", "on")
      checkDataPoiOptions("road", "labels", "on")
      checkDataPoiOptions("administrative.neighborhood", "labels.text", "on")
      checkDataPoiOptions("water", "labels.text", "on")
      checkDataPoiOptions("", "labels.text", "on")

    }else if(sonumber.value < data && data !== 0 && data == 3 && index == 2){
      checkDataPoiOptions("administrative.land_parcel", "labels", "on")
      checkDataPoiOptions("administrative.land_parcel", "", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("road.local", "labels", "on")
      checkDataPoiOptions("road", "labels", "on")
      checkDataPoiOptions("administrative.neighborhood", "labels.text", "on")
      checkDataPoiOptions("administrative.neighborhood", "", "on")
      checkDataPoiOptions("water", "labels.text", "on")
      checkDataPoiOptions("", "labels.text", "on")
      checkDataPoiOptions("", "labels", "on")
      checkDataPoiOptions("road.arterial", "labels", "on")
    }
}else if(selectedTheme.value == "Aubergine"){
  if(sonumber.value > data && data !== 0 && data == 3 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "off")
      checkDataPoiOptions("road.highway", "labels", "off")
      checkDataPoiOptions("road.local", "", "off")
    }
    else if(sonumber.value > data && data !== 0 && data == 2 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "off")
      checkDataPoiOptions("road.highway", "labels", "off")
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("road.arterial", "", "off")
    }
    else if(sonumber.value > data && data !== 0 && data == 1 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "off")
      checkDataPoiOptions("road.highway", "labels", "off")
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("road.arterial", "", "off")
      checkDataPoiOptions("road", "", "off")
    }
    else if(data == 0 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "off")
      checkDataPoiOptions("road.highway", "labels", "off")
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("road.arterial", "", "off")
      checkDataPoiOptions("road", "", "off")
    }
    else if(data == 4 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "on")
      checkDataPoiOptions("road.highway", "labels", "on")
      checkDataPoiOptions("road.local", "", "on")
      checkDataPoiOptions("road.arterial", "", "on")
      checkDataPoiOptions("road", "", "on")
    }
    else if(sonumber.value < data && data !== 0 && data == 1 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "on")
      checkDataPoiOptions("road.highway", "labels", "on")
      checkDataPoiOptions("road.local", "", "on")
    }
    else if(sonumber.value < data && data !== 0 && data == 2 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "on")
      checkDataPoiOptions("road.highway", "labels", "on")
      checkDataPoiOptions("road.local", "", "on")
      checkDataPoiOptions("road.arterial", "", "on")
    }
    else if(sonumber.value < data && data !== 0 && data == 3 && index == 0){
      checkDataPoiOptions("road.arterial", "labels", "on")
      checkDataPoiOptions("road.highway", "labels", "on")
      checkDataPoiOptions("road.local", "", "on")
      checkDataPoiOptions("road.arterial", "", "on")
      checkDataPoiOptions("road", "", "on")
    }
    else if(sonumber.value > data && data !== 0 && data == 3 && index == 1){
      checkDataPoiOptions("poi.business", "", "off")
      checkDataPoiOptions("poi.park", "labels.text", "off")
    }
    else if(sonumber.value > data && data !== 0 && data == 2 && index == 1){
      checkDataPoiOptions("poi.business", "", "off")
      checkDataPoiOptions("poi.park", "labels.text", "off")
      checkDataPoiOptions("transit", "labels.text", "off")
      checkDataPoiOptions("road", "labels.text", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
    }
    else if(sonumber.value > data && data !== 0 && data == 1 && index == 1){
      checkDataPoiOptions("poi.business", "", "off")
      checkDataPoiOptions("poi.park", "labels.text", "off")
      checkDataPoiOptions("transit", "labels.text", "off")
      checkDataPoiOptions("transit", "", "off")
      checkDataPoiOptions("road", "labels.text", "off")
      checkDataPoiOptions("road", "labels.icon", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("poi", "", "off")
      checkDataPoiOptions("administrative", "labels.text", "off")
    }
    else if(data == 0 && index == 1){
      checkDataPoiOptions("poi.business", "", "off")
      checkDataPoiOptions("poi.park", "labels.text", "off")
      checkDataPoiOptions("transit", "labels.text", "off")
      checkDataPoiOptions("transit", "", "off")
      checkDataPoiOptions("road", "labels.text", "off")
      checkDataPoiOptions("road", "labels.icon", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("poi", "", "off")
      checkDataPoiOptions("administrative", "labels.text", "off")
    }
    else if(data == 4 && index == 1){
      checkDataPoiOptions("poi.business", "", "on")
      checkDataPoiOptions("poi.park", "labels.text", "on")
      checkDataPoiOptions("transit", "labels.text", "on")
      checkDataPoiOptions("transit", "", "on")
      checkDataPoiOptions("road", "labels.text", "on")
      checkDataPoiOptions("road", "labels.icon", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("poi", "", "on")
      checkDataPoiOptions("administrative", "labels.text", "on")
    }else if(sonumber.value < data && data !== 0 && data == 1 && index == 1){
      checkDataPoiOptions("poi.business", "", "on")
      checkDataPoiOptions("poi.park", "labels.text", "on")
    }else if(sonumber.value < data && data !== 0 && data == 2 && index == 1){
      checkDataPoiOptions("poi.business", "", "on")
      checkDataPoiOptions("poi.park", "labels.text", "on")
      checkDataPoiOptions("transit", "labels.text", "on")
      checkDataPoiOptions("road", "labels.text", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
    }else if(sonumber.value < data && data !== 0 && data == 3 && index == 1){
      checkDataPoiOptions("poi.business", "", "on")
      checkDataPoiOptions("poi.park", "labels.text", "on")
      checkDataPoiOptions("transit", "labels.text", "on")
      checkDataPoiOptions("transit", "", "on")
      checkDataPoiOptions("road", "labels.text", "on")
      checkDataPoiOptions("road", "labels.icon", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("poi", "", "on")
      checkDataPoiOptions("administrative", "labels.text", "on")
    }else if(sonumber.value > data && data !== 0 && data == 3 && index == 2){
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("administrative.land_parcel", "labels", "off")
    }else if(sonumber.value > data && data !== 0 && data == 2 && index == 2){
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("administrative.land_parcel", "labels", "off")
      checkDataPoiOptions("administrative.land_parcel", "", "off")
      checkDataPoiOptions("administrative.neighborhood", "", "off")
      checkDataPoiOptions("road", "labels", "off")
      checkDataPoiOptions("water", "labels.text", "off")
    }else if(sonumber.value > data && data !== 0 && data == 1 && index == 2){
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("administrative.land_parcel", "labels", "off")
      checkDataPoiOptions("administrative.land_parcel", "", "off")
      checkDataPoiOptions("administrative.neighborhood", "", "off")
      checkDataPoiOptions("road", "labels", "off")
      checkDataPoiOptions("water", "labels.text", "off")
      checkDataPoiOptions("", "labels", "off")
    }else if( data == 0 && index == 2){
      checkDataPoiOptions("road.local", "", "off")
      checkDataPoiOptions("poi", "labels.text", "off")
      checkDataPoiOptions("administrative.land_parcel", "labels", "off")
      checkDataPoiOptions("administrative.land_parcel", "", "off")
      checkDataPoiOptions("administrative.neighborhood", "", "off")
      checkDataPoiOptions("road", "labels", "off")
      checkDataPoiOptions("water", "labels.text", "off")
      checkDataPoiOptions("", "labels", "off")
    }
    else if( data == 4 && index == 2){
      checkDataPoiOptions("road.local", "", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("administrative.land_parcel", "labels", "on")
      checkDataPoiOptions("administrative.land_parcel", "", "on")
      checkDataPoiOptions("administrative.neighborhood", "", "on")
      checkDataPoiOptions("road", "labels", "on")
      checkDataPoiOptions("water", "labels.text", "on")
      checkDataPoiOptions("", "labels", "on")
    }else if(sonumber.value < data && data !== 0 && data == 1 && index == 2){
      checkDataPoiOptions("road.local", "", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("administrative.land_parcel", "labels", "on")
    }else if(sonumber.value < data && data !== 0 && data == 2 && index == 2){
      checkDataPoiOptions("road.local", "", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("administrative.land_parcel", "labels", "on")
      checkDataPoiOptions("administrative.land_parcel", "", "on")
      checkDataPoiOptions("administrative.neighborhood", "", "on")
      checkDataPoiOptions("road", "labels", "on")
      checkDataPoiOptions("water", "labels.text", "on")
    }else if(sonumber.value < data && data !== 0 && data == 3 && index == 2){
      checkDataPoiOptions("road.local", "", "on")
      checkDataPoiOptions("poi", "labels.text", "on")
      checkDataPoiOptions("administrative.land_parcel", "labels", "on")
      checkDataPoiOptions("administrative.land_parcel", "", "on")
      checkDataPoiOptions("administrative.neighborhood", "", "on")
      checkDataPoiOptions("road", "labels", "on")
      checkDataPoiOptions("water", "labels.text", "on")
      checkDataPoiOptions("", "labels", "on")
    }
}

else{
  console.log("Select Name", selectedTheme.value)
  if(sonumber.value > data && data !== 0 && data == 3 && index == 0){
    checkDataPoiOptions("", "labels.icon", "off")
    checkDataPoiOptions("road.local", "", "off")
    checkDataPoiOptions("administrative.land_parcel", "", "off")
    checkDataPoiOptions("road.arterial", "labels", "off")
    checkDataPoiOptions("road.highway", "labels", "off")
    }
    else if(sonumber.value > data && data !== 0 && data == 2 && index == 0){
      checkDataPoiOptions("", "labels.icon", "off")
    checkDataPoiOptions("road.local", "", "off")
    checkDataPoiOptions("administrative.land_parcel", "", "off")
    checkDataPoiOptions("road.arterial", "labels", "off")
    checkDataPoiOptions("road.arterial", "", "off")
    checkDataPoiOptions("road.highway", "labels", "off")
      }
      else if(sonumber.value > data && data !== 0 && data == 1 && index == 0){
        checkDataPoiOptions("", "labels.icon", "off")
    checkDataPoiOptions("road.local", "", "off")
    checkDataPoiOptions("administrative.land_parcel", "", "off")
    checkDataPoiOptions("road.arterial", "labels", "off")
    checkDataPoiOptions("road.arterial", "", "off")
    checkDataPoiOptions("road.highway", "labels", "off")
    checkDataPoiOptions("road", "", "off")
      }else if(data == 0 && index == 0){
        checkDataPoiOptions("", "labels.icon", "off")
    checkDataPoiOptions("road.local", "", "off")
    checkDataPoiOptions("administrative.land_parcel", "", "off")
    checkDataPoiOptions("road.arterial", "labels", "off")
    checkDataPoiOptions("road.arterial", "", "off")
    checkDataPoiOptions("road.highway", "labels", "off")
    checkDataPoiOptions("road", "", "off")
      }else if(data == 4 && index == 0){
        checkDataPoiOptions("", "labels.icon", "on")
    checkDataPoiOptions("road.local", "", "on")
    checkDataPoiOptions("administrative.land_parcel", "", "on")
    checkDataPoiOptions("road.arterial", "labels", "on")
    checkDataPoiOptions("road.arterial", "", "on")
    checkDataPoiOptions("road.highway", "labels", "on")
    checkDataPoiOptions("road", "", "on")
      }else if(sonumber.value < data && data !== 0 && data == 1 && index == 0){
        checkDataPoiOptions("", "labels.icon", "on")
    checkDataPoiOptions("road.local", "", "on")
    checkDataPoiOptions("administrative.land_parcel", "", "on")
    checkDataPoiOptions("road.arterial", "labels", "on")
    checkDataPoiOptions("road.highway", "labels", "on")
      }else if(sonumber.value < data && data !== 0 && data == 2 && index == 0){
        checkDataPoiOptions("", "labels.icon", "on")
    checkDataPoiOptions("road.local", "", "on")
    checkDataPoiOptions("administrative.land_parcel", "", "on")
    checkDataPoiOptions("road.arterial", "labels", "on")
    checkDataPoiOptions("road.arterial", "", "on")
    checkDataPoiOptions("road.highway", "labels", "on")
      }else if(sonumber.value < data && data !== 0 && data == 3 && index == 0){
        checkDataPoiOptions("", "labels.icon", "on")
    checkDataPoiOptions("road.local", "", "on")
    checkDataPoiOptions("administrative.land_parcel", "", "on")
    checkDataPoiOptions("road.arterial", "labels", "on")
    checkDataPoiOptions("road.arterial", "", "on")
    checkDataPoiOptions("road.highway", "labels", "on")
    checkDataPoiOptions("road", "", "on")
      }else if(sonumber.value > data && data !== 0 && data == 3 && index == 1){
        checkDataPoiOptions("", "labels.icon", "off")
        checkDataPoiOptions("poi.park", "labels.text", "off")
        checkDataPoiOptions("poi.business", "", "off")

      }else if(sonumber.value > data && data !== 0 && data == 2 && index == 1){
        checkDataPoiOptions("", "labels.icon", "off")
        checkDataPoiOptions("poi.park", "labels.text", "off")
        checkDataPoiOptions("poi.business", "", "off")
        checkDataPoiOptions("poi", "labels.text", "off")
        checkDataPoiOptions("road", "labels.icon", "off")
        checkDataPoiOptions("transit", "", "off")
      }else if(sonumber.value > data && data !== 0 && data == 1 && index == 1){
        checkDataPoiOptions("", "labels.icon", "off")
        checkDataPoiOptions("poi.park", "labels.text", "off")
        checkDataPoiOptions("poi.business", "", "off")
        checkDataPoiOptions("poi", "labels.text", "off")
        checkDataPoiOptions("poi", "", "off")
        checkDataPoiOptions("road", "labels.icon", "off")
        checkDataPoiOptions("transit", "", "off")
        checkDataPoiOptions("administrative", "geometry", "off")
        checkDataPoiOptions("administrative.land_parcel", "", "off")
      }else if(data == 0 && index == 1){
        checkDataPoiOptions("", "labels.icon", "off")
        checkDataPoiOptions("poi.park", "labels.text", "off")
        checkDataPoiOptions("poi.business", "", "off")
        checkDataPoiOptions("poi", "labels.text", "off")
        checkDataPoiOptions("poi", "", "off")
        checkDataPoiOptions("road", "labels.icon", "off")
        checkDataPoiOptions("transit", "", "off")
        checkDataPoiOptions("administrative", "geometry", "off")
        checkDataPoiOptions("administrative.land_parcel", "", "off")
      }else if(data == 4 && index == 1){
        checkDataPoiOptions("", "labels.icon", "on")
        checkDataPoiOptions("poi.park", "labels.text", "on")
        checkDataPoiOptions("poi.business", "", "on")
        checkDataPoiOptions("poi", "labels.text", "on")
        checkDataPoiOptions("poi", "", "on")
        checkDataPoiOptions("road", "labels.icon", "on")
        checkDataPoiOptions("transit", "", "on")
        checkDataPoiOptions("administrative", "geometry", "on")
        checkDataPoiOptions("administrative.land_parcel", "", "on")
      }else if(sonumber.value < data && data !== 0 && data == 1 && index == 1){
        checkDataPoiOptions("", "labels.icon", "on")
        checkDataPoiOptions("poi.park", "labels.text", "on")
        checkDataPoiOptions("poi.business", "", "on")
      }else if(sonumber.value < data && data !== 0 && data == 2 && index == 1){
        checkDataPoiOptions("", "labels.icon", "on")
        checkDataPoiOptions("poi.park", "labels.text", "on")
        checkDataPoiOptions("poi.business", "", "on")
        checkDataPoiOptions("road", "labels.icon", "on")
        checkDataPoiOptions("transit", "", "on")
        checkDataPoiOptions("poi", "labels.text", "on")
      }else if(sonumber.value < data && data !== 0 && data == 3 && index == 1){
        checkDataPoiOptions("", "labels.icon", "on")
        checkDataPoiOptions("poi.park", "labels.text", "on")
        checkDataPoiOptions("poi.business", "", "on")
        checkDataPoiOptions("road", "labels.icon", "on")
        checkDataPoiOptions("transit", "", "on")
        checkDataPoiOptions("poi", "labels.text", "on")
        checkDataPoiOptions("poi", "", "on")
        checkDataPoiOptions("administrative", "geometry", "on")
        checkDataPoiOptions("administrative.land_parcel", "", "on")
      }else if(sonumber.value > data && data !== 0 && data == 3 && index == 2){
        checkDataPoiOptions("", "labels.icon", "off")
        checkDataPoiOptions("administrative.land_parcel", "labels", "off")
        checkDataPoiOptions("administrative.land_parcel", "", "off")
        checkDataPoiOptions("poi", "labels.text", "off")
        checkDataPoiOptions("road.local", "labels", "off")
      }else if(sonumber.value > data && data !== 0 && data == 2 && index == 2){
        checkDataPoiOptions("", "labels.icon", "off")
        checkDataPoiOptions("administrative.land_parcel", "labels", "off")
        checkDataPoiOptions("administrative.land_parcel", "", "off")
        checkDataPoiOptions("poi", "labels.text", "off")
        checkDataPoiOptions("road.local", "labels", "off")
        checkDataPoiOptions("road", "labels", "off")
        checkDataPoiOptions("water", "labels.text", "off")
        checkDataPoiOptions("administrative.neighborhood", "", "off")
      }else if(sonumber.value > data && data !== 0 && data == 1 && index == 2){
        checkDataPoiOptions("", "labels.icon", "off")
        checkDataPoiOptions("", "labels", "off")
        checkDataPoiOptions("administrative.land_parcel", "labels", "off")
        checkDataPoiOptions("administrative.land_parcel", "", "off")
        checkDataPoiOptions("poi", "labels.text", "off")
        checkDataPoiOptions("road.local", "labels", "off")
        checkDataPoiOptions("road", "labels", "off")
        checkDataPoiOptions("water", "labels.text", "off")
        checkDataPoiOptions("administrative.neighborhood", "", "off")
      }else if(data == 0 && index == 2){
        checkDataPoiOptions("", "labels.icon", "off")
        checkDataPoiOptions("", "labels", "off")
        checkDataPoiOptions("administrative.land_parcel", "labels", "off")
        checkDataPoiOptions("administrative.land_parcel", "", "off")
        checkDataPoiOptions("poi", "labels.text", "off")
        checkDataPoiOptions("road.local", "labels", "off")
        checkDataPoiOptions("road", "labels", "off")
        checkDataPoiOptions("water", "labels.text", "off")
        checkDataPoiOptions("administrative.neighborhood", "", "off")
      }else if(data == 4 && index == 2){
        checkDataPoiOptions("", "labels.icon", "on")
        checkDataPoiOptions("", "labels", "on")
        checkDataPoiOptions("administrative.land_parcel", "labels", "on")
        checkDataPoiOptions("administrative.land_parcel", "", "on")
        checkDataPoiOptions("poi", "labels.text", "on")
        checkDataPoiOptions("road.local", "labels", "on")
        checkDataPoiOptions("road", "labels", "on")
        checkDataPoiOptions("water", "labels.text", "on")
        checkDataPoiOptions("administrative.neighborhood", "", "on")
      }else if(sonumber.value < data && data !== 0 && data == 1 && index == 2){
        checkDataPoiOptions("", "labels.icon", "on")
        checkDataPoiOptions("administrative.land_parcel", "labels", "on")
        checkDataPoiOptions("administrative.land_parcel", "", "on")
        checkDataPoiOptions("poi", "labels.text", "on")
        checkDataPoiOptions("road.local", "labels", "on")
        
      }else if(sonumber.value < data && data !== 0 && data == 2 && index == 2){
        checkDataPoiOptions("", "labels.icon", "on")
        checkDataPoiOptions("administrative.land_parcel", "labels", "on")
        checkDataPoiOptions("administrative.land_parcel", "", "on")
        checkDataPoiOptions("poi", "labels.text", "on")
        checkDataPoiOptions("road.local", "labels", "on")
        checkDataPoiOptions("water", "labels.text", "on")
        checkDataPoiOptions("road", "labels", "on")
        checkDataPoiOptions("administrative.neighborhood", "", "on")
      }else if(sonumber.value < data && data !== 0 && data == 3 && index == 2){
        checkDataPoiOptions("", "labels.icon", "on")
        checkDataPoiOptions("", "labels", "on")
        checkDataPoiOptions("administrative.land_parcel", "labels", "on")
        checkDataPoiOptions("administrative.land_parcel", "", "on")
        checkDataPoiOptions("poi", "labels.text", "on")
        checkDataPoiOptions("road.local", "labels", "on")
        checkDataPoiOptions("water", "labels.text", "on")
        checkDataPoiOptions("road", "labels", "on")
        checkDataPoiOptions("administrative.neighborhood", "", "on")
        
      }
}
    
});

sonumber.value = data

}
}
const mapRefs = ref(null)
const dataLoadStart = ref([

])

const submitInput = () => {
  if(inputValue.value <= 0)
    return
  
    if(classI.value != null)
      document.querySelector("." + classI.value).style.boxShadow = "none"

  pageSize.value = 22000
  findAllDataMap(valueE.value, page.value)

  locations.value = dataLoadStart.value.filter((location) => {
        const distance = getDistance(
          mapCenter.value.lat,
          mapCenter.value.lng,
          location.coordinates.lat,
          location.coordinates.lng
        );
        console.log(distance)
        return distance <= inputValue.value; // Lấy các điểm trong bán kính 1km
      });

      if(classI.value != null)
          document.querySelector("." + classI.value).style.boxShadow = "none"

  zoomLevel.value = 13
  classI.value = null
  btnSearch.value = null
  showInput.value = false
}

const checkDataClassI = (classData, index) =>{
  isAction.value = false
  isCheckShow.value = index
  if(classI.value != null)
    document.querySelector("." + classI.value).style.boxShadow = "none"

    //  box-shadow: 6px 2px 6px grey;
  document.querySelector("." + classData).style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.6)"

  classI.value = classData

  switch(classData){
    case 'i2':
      valueE.value = ""
      mapCenter.value = {lat: 22.99318457718073, lng: 120.20495235408347}
      pageSize.value = 22000
      findAllDataMap(valueE.value, page.value)
      AllData()
      dataSelect.value = "all"
      break

    case 'i3':
      mapCenter.value = {lat: 22.99318457718073, lng: 120.20495235408347}
      dataSelect.value = "b5s"
      searchStatus5('b5s')
      break

    case 'i4':
      mapCenter.value = {lat: 22.99318457718073, lng: 120.20495235408347}
      dataSelect.value = "b3s"
      searchStatus3('b3s')
      break

    case 'i8':
      showInput.value = true
      break
    case 'i9':
      findAllUser()
      break
  }
}

const findAllUser = async () => {
  const res = await axios.get(hostName + `/api/User/searchName`, getToken())
  if(res.data.success){
    dataUser.value = res.data.content.data
  }

}
const searchDataSelect = () => {
  isAction.value = false
  switch(dataSelect.value){
    case 'b1s':
      searchStatus1('b1s')
      break
    case 'b2s':
      searchStatus2('b2s')
      break

    case 'b3s':
      searchStatus3('b3s')
      break
    case 'b4s':
      searchStatus4('b4s')
      break
    case 'b5s':
      searchStatus5('b5s')
      break
    case 'all':
      AllData()
      break
  }
}

// const statusGiaoThong = () => {
//   intervalData.value = setInterval(() => {
//       if (mapRefs.value?.$mapObject) {
//         clearInterval(intervalData.value);
//         const trafficLayer = new google.maps.TrafficLayer();
//         trafficLayer.setMap(mapRefs.value.$mapObject);
//       }
//     }, 500);
//   }

const statusGiaoThong = () => {
  const checkMapLoaded = setInterval(() => {
  if (mapRefs.value?.$mapObject) {
    clearInterval(checkMapLoaded);
    trafficLayer.value = new google.maps.TrafficLayer();
  }
}, 500);
}

const toggleTraffic = () => {
if (trafficLayer.value) {
  trafficVisible.value = !trafficVisible.value;
  trafficLayer.value.setMap(trafficVisible.value ? mapRefs.value.$mapObject : null);
}
};
const showDataMap = (location, data) => {
// mapCenter.value = location
  // mapCenter.value.lng = TaiNanCenter.value[0].coordinates.lng
  // mapCenter.value = location
  // zoomLevel.value = 15
  selectedMarker.value = location.lat
  showDistanceList.value = true

  dataLocation.value = data
  showDetails.value = true
}
const clickDataUpdate = (id) => {
router.push({path: "/admin/fromelementPages", query: {id: id}})
}

// Hàm tính khoảng cách giữa 2 điểm (Haversine Formula)
const getDistance = (lat1, lng1, lat2, lng2) => {
// alert("Đã vào")
    const R = 6371; // Bán kính Trái Đất (km)
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLng = (lng2 - lng1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    
    console.log("Km", R * c)
    return R * c; // Khoảng cách (km)
  };

  // Biến timeout để debounce
let centerChangeTimeout = null;

  const onCenterChanged = () => {
    if (centerChangeTimeout) clearTimeout(centerChangeTimeout);

centerChangeTimeout = setTimeout(() => {
showDistanceList.value = false
  if (mapRefs.value) {
    const center = mapRefs.value.$mapObject.getCenter();
    const newCenter = { lat: center.lat(), lng: center.lng() };

    // Kiểm tra nếu thay đổi vị trí trung tâm lớn hơn 0.001 độ (~100m) thì mới cập nhật
    if (
      Math.abs(newCenter.lat - mapCenter.value.lat) > 0.01 ||
      Math.abs(newCenter.lng - mapCenter.value.lng) > 0.01
    ) {
      // mapCenter.value = { lat: center.lat(), lng: center.lng() };
      onZoomChanged()
    }
  }
}, 500); // Chỉ cập nhật sau 300ms khi người dùng dừng di chuyển
  }
const onZoomChanged = () => {
zoomLevel.value = mapRefs.value.$mapObject.getZoom();
const center = mapRefs.value.$mapObject.getCenter();
const newCenter = { lat: center.lat(), lng: center.lng() };

    // Kiểm tra nếu thay đổi vị trí trung tâm lớn hơn 0.001 độ (~100m) thì mới cập nhật
    if (
      Math.abs(newCenter.lat - mapCenter.value.lat) > 0.01 ||
      Math.abs(newCenter.lng - mapCenter.value.lng) > 0.01
    ) {
      mapCenter.value = { lat: center.lat(), lng: center.lng() };

      if (zoomLevel.value >= 13) {
      if(btnSearch.value == null && duongdi.value.length <= 0){
      
      if(inputValue.value <= 0){
       // Khi phóng to -> hiển thị các địa điểm chi tiết trong quận
        locations.value = dataLoadStart.value.filter((location) => {
          const distance = getDistance(
            mapCenter.value.lat,
            mapCenter.value.lng,
            location.coordinates.lat,
            location.coordinates.lng
          );
          console.log(distance)
          return distance <= 1; // Lấy các điểm trong bán kính 1km
        });
      }else{
       // Khi phóng to -> hiển thị các địa điểm chi tiết trong quận
          locations.value = dataLoadStart.value.filter((location) => {
            const distance = getDistance(
              mapCenter.value.lat,
              mapCenter.value.lng,
              location.coordinates.lat,
              location.coordinates.lng
            );
            console.log(distance)
            return distance <= inputValue.value; // Lấy các điểm trong bán kính 1km
          });
      }
      
     }
      // else if(btnSearch.value != null && duongdi.value.length <= 0){
      //  if(dataSelect.value == 'b1s'){
      //    searchStatus1(dataSelect.value)
      //  }else if(dataSelect.value == 'b2s'){
      //    searchStatus2(dataSelect.value)
      //  }else if(dataSelect.value == 'b3s'){
      //    searchStatus3(dataSelect.value)
      //  }else if(dataSelect.value == 'b4s'){
      //    searchStatus4(dataSelect.value)
      //  }else if(dataSelect.value == 'b5s'){
      //    searchStatus5(dataSelect.value)
      //  }
      // }

    } 
    //   else {
    //   locations.value = []; // Nếu zoom < 18 thì ẩn hết điểm
    // }

  
        
  }

  showMarkers.value = false
  debounceZoomEnd() // Gọi debounce để chờ người dùng ngưng zoom
}

// Debounce khoảng 500ms
const debounceZoomEnd = useDebounceFn(() => {
  showMarkers.value = true
}, 500)

// Hoặc bạn có thể dùng event `idle` nếu bạn chỉ muốn hiển thị data khi map dừng di chuyển/zoom hẳn:
const onIdle = () => {
  showMarkers.value = true
}

// const zoomData = (data) => {
//   mapCenter.value = data
//   // mapCenter.value.lng = TaiNanCenter.value[0].coordinates.lng
//   zoomLevel.value = 13
// }
const imageStatus = ref({
status0: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
status1: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
status1s: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
status2: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',
status3: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',

})
// Lưu marker đang được chọn
const selectedMarker = ref(null);

const selectedTransport = ref("driving-car");

const intervalId = ref(null)
const classBtnOld = ref(null)
const btnSearch = ref(null)

const isLoading = ref(false)
const { proxy } = getCurrentInstance();
const hostName = proxy?.hostname;

const getScaleX = (element) => {
  const style = window.getComputedStyle(element);
  const transform = style.transform;

  if (transform === 'none') return 1; // mặc định là scaleX(1)

  // matrix(a, b, c, d, e, f) → a là scaleX
  const matrix = transform.match(/^matrix\((.+)\)$/);
  if (matrix) {
    const values = matrix[1].split(', ');
    const scaleX = parseFloat(values[0]); // scaleY nằm ở vị trí thứ 0 (1) (Dùng cho ScaleX)
    const scaleY = parseFloat(values[3]); // scaleY nằm ở vị trí thứ 4 (d) (Dùng cho ScaleY)
    // return scaleX;
     // Nếu scaleX và scaleY bằng nhau, thì dùng chung scale
    if (scaleX === scaleY) return scaleX;
  }

  return 1; // fallback
}
const showDataChon = (classData, classDiv, classChu, divcon, location) => {
 const element = document.querySelectorAll('.' + classData);
 const elementCon = document.querySelector('.' + divcon);
  if (!element) return;

  
  if(elementCon){
    const isScaledcon = getScaleX(elementCon)
    if(isScaledcon === 1){
    elementCon.style.transform ='scale(0)'
  elementCon.style.transition = '0.4s ease'
  elementCon.style.height = '0px'
    }
  
  
  }
  let datacheck = null
  let datacount = 0
  element.forEach(item => {
    datacount++
    const check1 = getScaleX(item)
    if(datacount == 1){
      
      datacheck = item
    }
    
    if(datacount == 2){
      const check2 = getScaleX(datacheck)
      if(check1 === 0 && check2 === 1){
        console.log("Đã vào", datacheck)
        datacheck.style.transform = 'scale(0)'
      }
    }
  })
 
  

  element.forEach(item => {
    // Kiểm tra xem đã là scaleX(1) hay chưa
  const isScaled = getScaleX(item)

  item.style.transform = isScaled === 1 ? 'scale(0)' : 'scale(1)'
  item.style.transition = 'transform 0.4s ease'

  document.querySelector('.' + classDiv).style.transition = 'height 0.4s ease'
  if(isScaled === 1){
  document.querySelector('.' + classDiv).style.height = '60px'
    document.querySelector('.' + classChu).style.borderBottom = 'none'
    
  }else{
    if(location.isError == false || (location.isError == true && location.statusError == 3) || (location.isError == true && location.statusError != 3 && location.account_user != null)){
      document.querySelector('.' + classDiv).style.height = '230px'
    }else{
      document.querySelector('.' + classDiv).style.height = '270px'
    }
 
  
document.querySelector('.' + classChu).style.borderBottom = '1px dashed black'
  }

})
}
// Danh sách ảnh
const images = ref([
"https://png.pngtree.com/png-clipart/20230417/original/pngtree-return-of-investment-flat-icon-png-image_9064391.png",
"https://tse1.mm.bing.net/th?id=OIP.hJVb5niyA8--b88zKGj5zwHaHa&pid=Api&P=0&h=220",
"https://tse4.mm.bing.net/th?id=OIP.cdbGAINaMlm8uBalZf3QgAHaHa&pid=Api&P=0&h=220",
"https://png.pngtree.com/png-clipart/20230508/original/pngtree-megaphone-icon-png-image_9150343.png",
"https://img.lovepik.com/free-png/20211108/lovepik-sunlight-png-image_400507026_wh1200.png",
"https://cdn-icons-png.flaticon.com/512/25/25694.png"
]);

watch(page.value, (newPage) => {
findAllDataMap(valueE.value, newPage)
})

const changeReload = (event) =>{
  pageSize.value = event
  findAllDataMap(valueE.value, page.value)
}
const getToken = () => {

var result = {
  headers: { Authorization: `Bearer ${store.getToken}` },
};
return result;
};
const findAllDataMap = async (searchData, pageData) => {
  isLoading.value = true;
document.body.classList.add("loading"); // Add Lớp "loading"
document.body.style.overflow = "hidden";
  const res = searchData === "" ? await axios.get(hostName + `/api/TrafficEquipment/FindAll?page=${pageData}&pageSize=${pageSize.value}`, getToken())
  : await axios.get(hostName + `/api/TrafficEquipment/FindAll?name=${searchData}&page=${pageData}&pageSize=${pageSize.value}`, getToken())

  if(res.data.success){
      dataLoadStart.value = res.data.content.data.map(m => ({
          ...m,
          coordinates: { lat: m.latitude, lng: m.longitude }
      }))

      mapCenter.value = {lat: mapRefs.value.$mapObject.getCenter().lat(), lng: mapRefs.value.$mapObject.getCenter().lng()}
      
      if(searchData === ""){
      if(inputValue.value <= 0){
        locations.value = dataLoadStart.value.filter((location) => {
          const distance = getDistance(
            mapCenter.value.lat,
            mapCenter.value.lng,
            location.coordinates.lat,
            location.coordinates.lng
          );
          console.log(distance)
          return distance <= 1; // Lấy các điểm trong bán kính 1km
        });
      }else{
          locations.value = dataLoadStart.value.filter((location) => {
            const distance = getDistance(
              mapCenter.value.lat,
              mapCenter.value.lng,
              location.coordinates.lat,
              location.coordinates.lng
            );
            console.log(distance)
            return distance <= inputValue.value; // Lấy các điểm trong bán kính 1km
        });
      }
      }else{
        locations.value = dataLoadStart.value
      }
      
      

      // console.log(dataLoadStart.value)
      // locations.value = dataLoadStart.value
      page.value = res.data.content.page;
      totalPage.value = res.data.content.totalPages;
  }
  console.log(res)
  isLoading.value = false;
document.body.classList.remove("loading");
document.body.style.overflow = "auto";
}
// Hàm lấy ranh giới từ tên quận
const fetchOSMBoundary = async () => {
isLoading.value = true;
document.body.classList.add("loading"); // Add Lớp "loading"
document.body.style.overflow = "hidden";

try {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchAddress.value)}&format=json&polygon_geojson=1`
  );
  const data = await response.json();
  console.log("Nominatim Data:", data);

if (data.length > 0 && data[0].geojson) {
  const combinedCoordinates =
data && // Kiểm data tồn tại
data.length > 0 && // Kiểm data có phần tử
data[0].geojson && // Kiểm geojson tồn tại
data[0].geojson.coordinates // Kiểm coordinates tồn tại
  ? data[0].geojson.coordinates.length > 1 // Kiểm tra số lượng lớp
    ? data[0].geojson.coordinates
        .map((islandLayer) => {
              return islandLayer[0].map(([lng, lat]) => ({
              lat: parseFloat(lat),
              lng: parseFloat(lng),
              }));
          })
    : data[0].geojson.coordinates[0].map(([lng, lat]) => ({
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      }))
  : []; 
console.log("Danh sách các đảo:", combinedCoordinates);

// Gán vào biến để vẽ
boundaryCoordinates.value = combinedCoordinates;

checkData.value = data[0].geojson.coordinates.length > 1 ? true : false
// Cập nhật tâm bản đồ
mapCenter.value = {
  lat: parseFloat(data[0].lat),
  lng: parseFloat(data[0].lon),
};
}
} catch (error) {
  console.error("Lỗi:", error);
}

isLoading.value = false;
document.body.classList.remove("loading");
document.body.style.overflow = "auto";
};
const loadData = () => {
locations.value = dataLoadStart.value
}
const showImage = (image) => {
  selectedImage.value = image; // Hiển thị ảnh khi click
};
const closeImage = () => {
selectedImage.value = null; // Đóng popup khi click ngoài
};
const marker1 = ref({
  url: images.value[0],
  scaledSize: { width: 40, height: 40 }
});

const searchStatus1 = async (classData) => {

// if(btnSearch.value != null)
//   document.querySelector("." + btnSearch.value).style.backgroundColor = 'white'
  
// document.querySelector("." + classData).style.backgroundColor = '#FF8C00'

btnSearch.value = classData

duongdi.value = []
const res = await axios.get(hostName + '/api/TrafficEquipment/FindAllErrorCode1?page=1&pageSize=20000', getToken())
if(res.data.success){
  locations.value = res.data.content.data.map(m => ({
          ...m,
          coordinates: { lat: m.latitude, lng: m.longitude }
      }))

      // if(zoomLevel.value < 13)
      //     zoomLevel.value = 13
      isPhanTrang.value = false
}

// routePath.value = []
// routeDistance.value = null

return locations.value
}

const searchStatus2 = async (classData) => {
// if(btnSearch.value != null)
//   document.querySelector("." + btnSearch.value).style.backgroundColor = 'white'
  
// document.querySelector("." + classData).style.backgroundColor = '#FF8C00'

btnSearch.value = classData

duongdi.value = []
const res = await axios.get(hostName + '/api/TrafficEquipment/FindAllErrorCode2?page=1&pageSize=20000', getToken())
if(res.data.success){
  locations.value = res.data.content.data.map(m => ({
          ...m,
          coordinates: { lat: m.latitude, lng: m.longitude }
      }))

      // if(zoomLevel.value < 13)
      //     zoomLevel.value = 13
      isPhanTrang.value = false
}
// routePath.value = []
// routeDistance.value = null
return locations.value
}

const searchStatus3 = async (classData) => {
// if(btnSearch.value != null)
//   document.querySelector("." + btnSearch.value).style.backgroundColor = 'white'
  
// document.querySelector("." + classData).style.backgroundColor = '#FF8C00'

btnSearch.value = classData

duongdi.value = []
const res = await axios.get(hostName + '/api/TrafficEquipment/FindAllErrorCode3?page=1&pageSize=20000', getToken())
if(res.data.success){
  locations.value = res.data.content.data.map(m => ({
          ...m,
          coordinates: { lat: m.latitude, lng: m.longitude }
      }))

      // if(zoomLevel.value < 13)
      //     zoomLevel.value = 13
      isPhanTrang.value = false
}
// routePath.value = []
// routeDistance.value = null
return locations.value
}

const searchStatus5 = async (classData) => {
// if(btnSearch.value != null)
//   document.querySelector("." + btnSearch.value).style.backgroundColor = 'white'
  
// document.querySelector("." + classData).style.backgroundColor = '#FF8C00'

btnSearch.value = classData

duongdi.value = []
const res = await axios.get(hostName + '/api/TrafficEquipment/FindAllErrorCode0?page=1&pageSize=20000', getToken())
if(res.data.success){
  locations.value = res.data.content.data.map(m => ({
          ...m,
          coordinates: { lat: m.latitude, lng: m.longitude }
      }))

      // if(zoomLevel.value < 13)
      //     zoomLevel.value = 13
      isPhanTrang.value = false
}

// routePath.value = []
// routeDistance.value = null

return locations.value
}

const searchStatus4 = (classData) => {
// if(btnSearch.value != null)
//   document.querySelector("." + btnSearch.value).style.backgroundColor = 'white'
  
// document.querySelector("." + classData).style.backgroundColor = '#FF8C00'

btnSearch.value = classData

duongdi.value = []
if(pageSize.value >= 500){
  mapCenter.value = {lat: mapRefs.value.$mapObject.getCenter().lat(), lng: mapRefs.value.$mapObject.getCenter().lng()}
      if(inputValue.value <= 0){
locations.value = dataLoadStart.value.filter((location) => {
        const distance = getDistance(
          mapCenter.value.lat,
          mapCenter.value.lng,
          location.coordinates.lat,
          location.coordinates.lng
        );
        return distance <= 1 && location.isError === false; // Lấy các điểm trong bán kính 1km
      });
}else{
locations.value = dataLoadStart.value.filter((location) => {
        const distance = getDistance(
          mapCenter.value.lat,
          mapCenter.value.lng,
          location.coordinates.lat,
          location.coordinates.lng
        );
        return distance <= inputValue.value && location.isError === false; // Lấy các điểm trong bán kính 1km
      });
}
}else{
  
      locations.value = dataLoadStart.value.filter((location) => location.isError === false);
}

isPhanTrang.value = false

// routePath.value = []
// routeDistance.value = null
return locations.value
}

const AllData = () => {
  duongdi.value = []
mapCenter.value = {lat: mapRefs.value.$mapObject.getCenter().lat(), lng: mapRefs.value.$mapObject.getCenter().lng()}
pageSize.value = 22000
findAllDataMap(valueE.value, page.value)
      
// if(btnSearch.value != null)
//   document.querySelector("." + btnSearch.value).style.backgroundColor = 'white'

isPhanTrang.value = true
btnSearch.value = null
return locations.value
}
// Hàm đổi ảnh mỗi giây
const startImageRotation = () => {
let index = 0;
intervalId.value = setInterval(() => {
  index = (index + 1) % images.value.length; // Chuyển ảnh tiếp theo
  marker1.value.url = images.value[index];
}, 100);
};

// const midPoint = ref(null)
// Công thức tính khoảng cách đường chim bay (Haversine)
const haversineDistance = (lat1, lon1, lat2, lon2) => {
const R = 6371; // Bán kính Trái Đất (km)
const dLat = (lat2 - lat1) * (Math.PI / 180);
const dLon = (lon2 - lon1) * (Math.PI / 180);
const a =
  Math.sin(dLat / 2) * Math.sin(dLat / 2) +
  Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
return R * c;
};
// Khi click vào marker, hiển thị thông tin
const showInfo = (index, data, classData, classDiv, classChu, divcon, locationId, indexId, location) => {
classBtnOld.value = null
selectedMarker.value = index;
dataLocation.value = data
  showDetails.value = true
  showDistanceList.value = true
  // mapCenter.value = data.coordinates
  // zoomLevel.value = 18
  
  scrollToItem(locationId, indexId)
  showDataChon(classData, classDiv, classChu, divcon, location)
  
};

const clickDataLocation = (location, type, classData) => {
  selectedLocation.value = location
  selectedTransport.value = type

  // if(classBtnOld.value != null)
  //     document.querySelector("." + classBtnOld.value).style.backgroundColor = 'white'
  
  // document.querySelector("." + classData).style.backgroundColor = 'yellow'

  classBtnOld.value = classData
  getDirections()
  
}
// Chuyển địa chỉ thành tọa độ
const geocodeAddress = async (address) => {
  return new Promise((resolve, reject) => {
    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results.length > 0) {
        const location = results[0].geometry.location;
        resolve({ lat: location.lat(), lng: location.lng() });
      } else {
        console.error(`Không tìm thấy địa chỉ: ${address}`);
        reject(status);
      }
    });
  });
};

const searchHomeData = async (dataSearch) => {

  searchAddressHome.value = dataSearch.name

  if (!searchAddressHome.value) {
    alert("Vui lòng nhập địa chỉ!");
    return;
  }

  routePath.value = []
      routeDistance.value = null

  try {
    const coordinates = await geocodeAddress(searchAddressHome.value);

    // Cập nhật bản đồ
    mapCenter.value = coordinates;
    currentLocation.value = coordinates
    zoomLevel.value = 15;

    // Xóa ô input
    searchAddressHome.value = "";
  } catch (error) {
    alert("Không tìm thấy địa chỉ, vui lòng thử lại!");
  }
}
// Tìm kiếm địa chỉ mới
const searchLocation = async (dataSearch) => {
  searchAddress.value = dataSearch.name
  console.log("Data Name ", dataSearch)
  if (!searchAddress.value) {
    alert("Vui lòng nhập địa chỉ!");
    return;
  }

  try {
    const coordinates = await geocodeAddress(searchAddress.value);

    // Thêm địa chỉ mới vào danh sách
    resolvedLocations.value.push({
      address: searchAddress.value,
      coordinates,
    });

    fetchOSMBoundary()
    // Cập nhật bản đồ
    mapCenter.value = coordinates;
    zoomLevel.value = 15;

    // Xóa ô input
    searchAddress.value = "";
    
  } catch (error) {
    alert("Không tìm thấy địa chỉ, vui lòng thử lại!");
  }
};

// Tìm đường đến vị trí đã chọn
const getDirections = async () => {
  if (!selectedLocation.value) {
    alert("Vui lòng chọn một địa điểm!");
    return;
  }

  const start = currentLocation.value; // Bắt đầu từ vị trí hiện tại
  const end = selectedLocation.value.coordinates; // Điểm đến đã chọn

  if (selectedTransport.value === "airplane") {
  // Tính khoảng cách đường bay
  const distanceKm = haversineDistance(start.lat, start.lng, end.lat, end.lng);
  routeDistance.value = distanceKm

  // midPoint.value = {
  //   lat: (start.lat + end.lat) / 2,
  //   lng: (start.lng + end.lng) / 2,
  // };

  showTimeDiChuyen.value = calculateFlightTime(start, end)
  return
  }

  isLoading.value = true;
document.body.classList.add("loading"); // Add Lớp "loading"
document.body.style.overflow = "hidden";
  const url = `https://api.openrouteservice.org/v2/directions/${selectedTransport.value}?api_key=${apiKey}&start=${start.lng},${start.lat}&end=${end.lng},${end.lat}`;

  try {
    const response = await axios.get(url);
    if (response.data.features && response.data.features.length > 0) {
      const route = response.data.features[0];
       const coordinates  = response.data.features[0].geometry.coordinates.map(coord => ({
        lat: coord[1],
        lng: coord[0]
      }));

      routePath.value = coordinates
      // Lấy khoảng cách (mét) và đổi sang km
    routeDistance.value = route.properties.segments[0].distance / 1000;
    showTimeDiChuyenKm.value = route.properties.segments[0].distance / 1000
    showTimeDiChuyen.value = formatTime(route.properties.segments[0].duration)

  //   const midIndex = Math.floor(coordinates.length / 2);
  //   midPoint.value = coordinates[midIndex];
    } else {
      console.error("Không tìm thấy tuyến đường nào!");
      routePath.value = []
      routeDistance.value = null
    }
  } catch (error) {
    console.error("Lỗi khi lấy đường đi:", error);
    routePath.value = []
    routeDistance.value = null
  }

  isLoading.value = false;
document.body.classList.remove("loading");
document.body.style.overflow = "auto";
};

const calculateFlightTime = (start, end) => {
const radius = 6371; // Bán kính trái đất (km)
const lat1 = start.lat * (Math.PI / 180); // Chuyển đổi độ sang radian
const lat2 = end.lat * (Math.PI / 180); // Chuyển đổi độ sang radian
const deltaLat = (end.lat - start.lat) * (Math.PI / 180);
const deltaLon = (end.lng - start.lng) * (Math.PI / 180);

const a =
  Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
  Math.cos(lat1) * Math.cos(lat2) *
  Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

const distance = radius * c; // Khoảng cách giữa hai điểm (km)
const flightSpeed = 900; // Tốc độ máy bay trung bình (km/h)
const flightTime = distance / flightSpeed; // Thời gian bay (giờ)

console.log(`Thời gian bay ước tính: ${flightTime.toFixed(2)} giờ`);

return flightTime.toFixed(2)
};

const formatTime = (seconds) => {
// Làm tròn giây để bỏ phần thập phân
const roundedSeconds = Math.floor(seconds); // Chỉ lấy phần nguyên của giây

// Tính toán giờ, phút, giây
const hours = Math.floor(roundedSeconds / 3600); // Lấy phần nguyên của số giờ
const minutes = Math.floor((roundedSeconds % 3600) / 60); // Lấy phần nguyên của phút
const remainingSeconds = roundedSeconds % 60; // Lấy phần dư còn lại là giây

// Đảm bảo hiển thị 2 chữ số cho giờ, phút, giây
return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// Lấy vị trí hiện tại của người dùng (Không tự động cập nhật lại vị trí khi người dùng di chuyển) có thể sử dụng "SetInterval" để kiểm tra liên tục vị trí hiện tại của người dùng
const getCurrentLocation = () => {
isLoading.value = true;
document.body.classList.add("loading"); // Add Lớp "loading"
document.body.style.overflow = "hidden";

if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      currentLocation.value = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      mapCenter.value = currentLocation.value;
    },
    (error) => {
      console.error("Lỗi khi lấy vị trí:", error);
    }
  );
}

isLoading.value = false;
document.body.classList.remove("loading");
document.body.style.overflow = "auto";
};

// Lấy vị trí hiện tại của người dùng (Tự động cập nhật lại vị trí khi người dùng di chuyển)
// const getCurrentLocation = () => {
//   if (navigator.geolocation) {
//     navigator.geolocation.watchPosition(
//       (position) => {
//         currentLocation.value = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         mapCenter.value = currentLocation.value;
//       },
//       (error) => {
//         console.error("Lỗi khi lấy vị trí:", error);
//       },
//       {
//         enableHighAccuracy: true,
//         timeout: 1000,   // Tăng thời gian timeout lên 10 giây
//         maximumAge: 0     // Luôn cập nhật vị trí mới nhất
//       }
//     );
//   }

  
// };

// Tính điểm giữa tuyến đường để hiển thị số km
const midPoint = computed(() => {
if (!routePath.value.length) return null;

const midIndex = Math.floor(routePath.value.length / 2);
return routePath.value[midIndex];
});

onMounted(() => {
  findAllDataMap(valueE.value, page.value)
  // getCurrentLocation(); // Lấy vị trí hiện tại khi tải trang
  startImageRotation()
  loadData()
  statusGiaoThong()
  poiStart()
  // checkDataClassI('i1', 1)
});

onUnmounted(() => {
  // clearInterval(intervalId.value)
  console.log("Hello World")
})
</script>


<style>
/* Định nghĩa animation quay */
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}
@keyframes thei1 {
  0%{
    transform: scale(1.1);
    color: red;
  }

  50%{
    transform: scale(1.2);
    color: yellow;
  }

  100%{
    transform: scale(1);
    color: yellowgreen;
  }
}

@keyframes thei2 {
  0%{
    transform: scale(1.1);
    color: blue;
  }

  50%{
    transform: scale(1.2);
    color: greenyellow;
  }

  100%{
    transform: scale(1);
    color: violet;
  }
}

@keyframes thei3 {
  0%{
    transform: scale(1.2);
  }

  50%{
    transform: scale(1.3);
  }

  75%{
    transform: scale(1.1);
  }

  100%{
    transform: scale(1);
  }
}
</style>

<style scoped>
.spin-icon {
  animation: spin 0.5s linear infinite;
  display: inline-block;
}

.square {
  width: 200px;
  height: 100px;
  background-color: white;
  border: 1px solid black;
  display: none;
  position: sticky;
  top: 80px; /* khoảng cách từ trên trình duyệt xuống */
  z-index: 1000;
  margin-top: 10px;
  overflow: auto;
}

.status3.active {
  transform: scale(1);
  height: 230px;
}

/* Áp dụng cho container có scroll (ví dụ class là .scroll-box) */
.scroll-box::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.scroll-box::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 10px;
  margin-top: 15px; /**Điều chỉnh vị trí của Scroll */
}

.scroll-box::-webkit-scrollbar-thumb {
  background-color: #888;
  border-radius: 10px;
  border: 2px solid #f0f0f0; /* tạo hiệu ứng rãnh đẹp */
}

.scroll-box::-webkit-scrollbar-thumb:hover {
  background: #555;
}
.marquee-container {
  width: 20%;
  overflow: hidden;
  background: white;
  border: 1px solid black;
  border-radius: 10px;
  padding: 10px;
}

.marquee-text {
  display: inline-block;
  white-space: nowrap;
  /*padding-left: 100%;
   animation: marquee 10s linear infinite; */
}

.paused {
  animation-play-state: paused;
}

@keyframes marquee {
  0% {
    transform: translateX(0%);
  }
  100% {
    transform: translateX(-100%);
  }
}
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* nền mờ */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999; /* để nổi lên trên cùng */
}

.input-container {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0px 0px 10px #00000077;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.theme-selector label {
margin-right: 10px;
}
.range-container {
  max-width: 600px;
  margin: auto;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  background: #f9f9f9;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.range-wrapper label {
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #333;
}

.range-track {
  position: relative;
}

.styled-range {
  width: 100%;
  height: 8px;
  appearance: none;
  background: transparent;
  position: relative;
  z-index: 2;
}

/* Custom track */
.styled-range::-webkit-slider-runnable-track {
  width: 100%;
  height: 8px;
  background: #ddd;
  border-radius: 4px;
  position: relative;
}

.styled-range::-moz-range-track {
  height: 8px;
  background: #ddd;
  border-radius: 4px;
}

/* Custom thumb */
.styled-range::-webkit-slider-thumb {
  appearance: none;
  height: 20px;
  width: 20px;
  background: #4caf50;
  border-radius: 50%;
  border: 2px solid #fff;
  margin-top: -6px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  position: relative;
  z-index: 3;
}

.styled-range::-moz-range-thumb {
  height: 20px;
  width: 20px;
  background: #4caf50;
  border: 2px solid white;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  z-index: 3;
}

/* Tick marks – simulate inside input */
.range-track::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 8px;
  transform: translateY(-50%);
  background-image: linear-gradient(to right,
    transparent 0%,
    transparent 24.5%,
    #999 25%,
    transparent 25.5%,
    transparent 49.5%,
    #999 50%,
    transparent 50.5%,
    transparent 74.5%,
    #999 75%,
    transparent 75.5%,
    transparent 100%);
  background-repeat: no-repeat;
  z-index: 1000;
  pointer-events: none;
  border-radius: 4px;
}
/* Màn hình chờ */
.loading-overlay {
position: fixed;
top: 0;
left: 0;
width: 100%;
height: 100%;
background-color: rgba(0, 0, 0, 0.5);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
pointer-events: all; /* Kích hoạt lớp phủ ngăn tương tác */
}

/* Biểu tượng spinner */
.spinner {
border: 4px solid #f3f3f3; /* Light grey */
border-top: 4px solid #3498db; /* Blue */
border-radius: 50%;
width: 40px;
height: 40px;
animation: spin 1s linear infinite;
}

/* Hiệu ứng xoay */
@keyframes spin {
0% {
  transform: rotate(0deg);
}
100% {
  transform: rotate(360deg);
}
}

/* Ngăn người dùng thao tác khi đang load */
body.loading {
pointer-events: none; /* Ngăn tất cả tương tác */
user-select: none; /* Ngăn chọn văn bản */
}

.custom-marker {
position: absolute;
left: 50%;
top: 50%;
transform: translate(-50%, -50%); /* Dịch chuyển tâm ảnh */
width: 40px;
height: 40px;
}

.custom-marker img {
width: 100%;
height: 100%;
border-radius: 50%; /* Bo tròn ảnh */
border: 2px solid white;
box-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
}

.marker-icon img {
border-radius: 50%;
border: 3px solid white;
box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
}
/* CSS để hiển thị 2 nút trên bản đồ */
.map-buttons {
z-index: 1000;
display: flex;
}

.map-buttons button {
background-color: white;
border: 1px solid #ccc;
padding: 10px;
margin-bottom: 5px;
cursor: pointer;
font-weight: bold;
border-radius: 5px;
}

.map-buttons button:hover {
background-color: #f0f0f0;
}

.image-modal {
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
background: rgba(0, 0, 0, 0.8);
display: flex;
justify-content: center;
align-items: center;
z-index: 1000;
}

.image-full {
max-width: 90%;
max-height: 90%;
border-radius: 8px;
box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
animation: fadeIn 0.3s ease;
}
</style>

