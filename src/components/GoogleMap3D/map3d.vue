<template>
<GoogleMap
       ref="mapRefs"
  :center="mapCenter"
  :zoom="zoomLevel"
  :disable-default-ui="{
    mapTypeControl: false, // Ẩn nút chuyển Satellite
  fullscreenControl: false,
  streetViewControl: false,
  zoomControl: true
  }"
  style="height: 100vh; width: 100vw;"
  map-type-id="roadmap"
  map-id="c538a4b0749ed9e7c5ccc7e5"
  @load="handleMapLoad"
  @idle="onIdle"
    >

    <TrafficLayer  />
    <!-- "@zoom_changed" là bắt sự kiện khi người dùng phóng to, thu nhỏ bản đồ -->
    <div v-if="checkData">
  <Polygon
    v-for="(island, index) in boundaryCoordinates"
    :key="index"
    
    :options="{
      paths: island,
      fillColor: '#FF0000',
      fillOpacity: 0.3,
      strokeColor: '#FF0000',
      strokeWeight: 2,
    }"
  />
</div>
<div v-else>
  <Polygon 
  v-if="boundaryCoordinates.length > 0"
  :options="{ 
    paths: boundaryCoordinates,
    fillColor: '#FF0000',
    fillOpacity: 0,
    strokeColor: '#FF0000',
    strokeWeight: 2,
  }"
/>
</div>
    
      <!-- Marker cho tất cả vị trí tìm kiếm được -->
      
      <Marker
        v-for="(location, index) in resolvedLocations"
        :key="index"
        :options="{position: location.coordinates, label: location.address}"
        @click="showInfo(location.coordinates + '' + index)"
        
      >
          <!-- Hiển thị thông tin khi bấm vào marker -->
      <InfoWindow 
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
      </InfoWindow>
  </Marker>
  <!-- Marker cho tất cả vị trí tìm kiếm được -->
   <div v-for="(location, index) in locations" :key="index">
    <div v-if="zoomLevel >= 13 && showMarkers">
    <div v-if="location.isError">
      <Marker
      v-if="location.statusError == 1 && showMarkers"
      :options="{
        position: location.coordinates,
        icon: {
          // url: marker1.url, // Đây là đổi ảnh liên tục
          url: imageStatus.status1s,
          scaledSize: idClick == location.id ? bigIcon : smallIcon,
          anchor: idClick == location.id ? {x: 35, y: 45} : { x: 25, y: 25 }, // Căn giữa ảnh marker
        }
      }"
        @click="showInfo(location.coordinates.lat, location, 
        'status_' + location.id + '_' + index, 
        'div_' + location.id + '_' + index, 
        'divchu_' + location.id + '_' + index, 
        'details_' + location.id + '_' + index,
        location.id, index,
        location)"


        class="marker-icon"
      >
          <!-- Hiển thị thông tin khi bấm vào marker 
            disableAutoPan: true: Là ngăn không cho di chuyển bản đồ
            
           <GMapInfoWindow
                  v-if="selectedMarker === location.coordinates.lat && showDistanceList"
                  :options="{ maxWidth: 250, disableAutoPan: true }"
                  @closeclick="selectedMarker = null"
                  >
                  <div>
                    <p style="font-size: 12px;">Management Unit: <strong>{{ location.managementUnit }}</strong></p>
                      
                    </div>
                  </GMapInfoWindow>

                -->
  </Marker>

      <Marker
      v-if="location.statusError == 2 && showMarkers"
        :options="{
          position: location.coordinates,
          icon: {
            // url: marker1.url, // Đây là đổi ảnh liên tục
            url: imageStatus.status0,
            scaledSize: idClick == location.id ? bigIcon : smallIcon,
            anchor: idClick == location.id ? {x: 35, y: 45} : { x: 25, y: 25 }, // Căn giữa ảnh marker
          }
        }"
        @click="showInfo(location.coordinates.lat, location, 
        'status1_' + location.id + '_' + index, 
        'div1_' + location.id + '_' + index, 
        'divchu1_' + location.id + '_' + index, 
        'details1_' + location.id + '_' + index,
        location.id, index,
        location)"
        

        class="marker-icon"
      >
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
  </Marker>
  <Marker
      v-if="location.statusError == 3 && showMarkers"
        :options="{
          position: location.coordinates,
          icon: {
            // url: marker1.url, // Đây là đổi ảnh liên tục
            url: imageStatus.status2,
            scaledSize: idClick == location.id ? bigIcon : smallIcon,
            anchor: idClick == location.id ? {x: 35, y: 45} : { x: 25, y: 25 }, // Căn giữa ảnh marker
          }
        }"
        @click="showInfo(location.coordinates.lat, location, 
        'status2_' + location.id + '_' + index, 
        'div2_' + location.id + '_' + index, 
        'divchu2_' + location.id + '_' + index, 
        'details2_' + location.id + '_' + index,
        location.id, index,
        location)"
       

        class="marker-icon"
      >
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
     
  </Marker>

  <Marker
      v-if="location.statusError == 4 && showMarkers"
        :options="{
          position: location.coordinates,
          icon: {
            // url: marker1.url, // Đây là đổi ảnh liên tục
            url: imageStatus.status3,
            scaledSize: idClick == location.id ? bigIcon : smallIcon,
            anchor: idClick == location.id ? {x: 35, y: 45} : { x: 25, y: 25 }, // Căn giữa ảnh marker
          }
        }"
        @click="showInfo(location.coordinates.lat, location, 
        'status3_' + location.id + '_' + index, 
        'div3_' + location.id + '_' + index, 
        'divchu3_' + location.id + '_' + index, 
        'details3_' + location.id + '_' + index,
        location.id, index,
        location)"
        
        class="marker-icon"
      >
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
     
  </Marker>
    </div>
    <div v-else>
      <Marker
        v-if="showMarkers"
        :options="{
          position: location.coordinates,
          icon: {
            // url: marker1.url, // Đây là đổi ảnh liên tục
            url: imageStatus.status1,
            scaledSize: idClick == location.id ? bigIcon : smallIcon,
            anchor: idClick == location.id ? {x: 35, y: 45} : { x: 25, y: 25 }, // Căn giữa ảnh marker
          }
        }"
        @click="showInfo(location.coordinates.lat, location, 
        'status4_' + location.id + '_' + index, 
        'div4_' + location.id + '_' + index, 
        'divchu4_' + location.id + '_' + index, 
        'details4_' + location.id + '_' + index,
        location.id, index,
        location)"
        

        class="marker-icon"
      >
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
     
  </Marker>
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
            anchor: idClick == location.id ? {x: 35, y: 45} : { x: 25, y: 25 }, // Căn giữa ảnh marker
          }"

          class="marker-icon"
        >
      
    </GMapMarker>
  -->
  </div>
      <!-- Marker cho vị trí hiện tại -->
      <Marker
        :options="{position: currentLocation, icon: {
          url: 'https://cdn-icons-png.flaticon.com/512/25/25694.png',
          scaledSize: { width: 40, height: 40 }
        },
        label: 'Bạn'
      }"
        
        
      />
      <!-- Đường đi -->
      <Polyline 
        v-if="routePath.length > 0 && selectedTransport !== 'airplane'"
        :options="{
          path: routePath,
          strokeColor: '#A52A2A', // Màu đường
          strokeOpacity: 1,
          strokeWeight: 5,
          fillOpacity: 0,
        }"
      />

        <!-- Hiển thị số km trên bản đồ -->
    <Marker
      v-if="routeDistance && showDistance"
      :options="{position: midPoint}"
      label="📏"
       @click="showDistance = !showDistance"
    >
      <InfoWindow >
        <div>
          <p>Travel Distance: <strong>{{ routeDistance.toFixed(2) }} km</strong></p> 
          <p>Travel Time: <strong>{{ showTimeDiChuyen }}</strong></p> 
        </div>
      </InfoWindow>
    </Marker>
    
    <!--Poi-->
    <div class="scroll-boxs" style="display: flex; flex-direction: column; border-right: 1px solid rgba(0, 0, 0, 0.1); display: flex; position: absolute; overflow: auto; height: 100%; z-index: 1100; left: 0; top: 0; background-color: #e6ffff;">
        <div style="width: 100px; height: 100%; margin-top: 15px;">

          <div style="padding: 10px; margin-top: 15px; cursor: pointer;">
            <img v-if="!isShowHome" style="animation: thei3 0.5s ease-in-out infinite;" width="28px" src="../assets/Icon/Picture1.png" alt="">
            <img v-else width="28px" src="../assets/Icon/Picture1.png" alt="">
            <p style="font-size: 12px;">首頁</p>
            
            </div>

            <div style="margin: 15px 0; cursor: pointer; padding: 10px;" class="i1" @click="checkDataClassI('i1', 10)">
            <img width="28px" src="../assets/Icon/Picture2.png" alt="">
            <p style="font-size: 12px;">調整視野</p>
            <div style="width: 100%; text-align: center; align-items: center; display: flex; justify-content: center;"><div style="border-bottom: 5px solid grey; width: 50%; margin-top: 10px; border-radius: 10px;"></div></div>
            </div>

            <div style="cursor: pointer; padding: 10px;" class="i2" @click="checkDataClassI('i2', 1)">
            <img width="28px" src="../assets/Icon/Picture3.png" alt="">
            <p style="font-size: 12px;">所有號誌清單</p>
            </div>

            <div v-if="store.getRole(0) == 1" style="margin: 15px 0; cursor: pointer; padding: 10px;" class="i3" @click="checkDataClassI('i3', 1)">
            <img width="28px" src="../assets/Icon/Picture4.png" alt="">
            <p style="font-size: 12px;">故障號誌清單</p>
            </div>

            <div  v-if="store.getRole(0) == 1" style="cursor: pointer; padding: 10px;" class="i4" @click="checkDataClassI('i4', 1)">
            <img width="28px" src="../assets/Icon/Picture5.png" alt="">
            <p style="font-size: 12px;">維修中號誌</p>
            <div style="width: 100%; text-align: center; align-items: center; display: flex; justify-content: center;"><div style="border-bottom: 5px solid grey; width: 50%; margin-top: 10px; border-radius: 10px;"></div></div>
            </div>

            <router-link v-if="store.getRole(0) == 1" to="/admin">
              <div style="margin: 15px 0; padding: 10px; cursor: pointer;" class="i5" @click="checkDataClassI('i5', 5)">
            <img width="28px" src="../assets/Icon/Picture6.png" alt="">
            <p style="font-size: 12px;">統計圖表</p>
            <div style="width: 100%; text-align: center; align-items: center; display: flex; justify-content: center;"><div style="border-bottom: 5px solid grey; width: 50%; margin-top: 10px; border-radius: 10px;"></div></div>
            </div>
              </router-link>

              <div v-else-if="store.getRole(0) == 2" style="cursor: pointer; padding: 10px;" class="i12" @click="checkDataClassI('i12', 12)">
            <img width="38px" src="https://img.lovepik.com/free-png/20220125/lovepik-construction-engineer-png-image_401727229_wh860.png" alt="">
            <p style="font-size: 12px;">工程師</p>
            </div>
            <div style="cursor: pointer; padding: 10px;" class="i6" @click="checkDataClassI('i6', 2)">
            <img width="28px" src="../assets/Icon/Picture7.png" alt="">
            <p style="font-size: 12px;">地圖設定</p>
            </div>

            <div style="margin: 15px 0; cursor: pointer; padding: 10px;" class="i7" @click="checkDataClassI('i7', 3)">
            <img width="28px" src="../assets/Icon/Picture8.png" alt="">
            <p style="font-size: 12px;">道路設定</p>
            </div>

            <div style="cursor: pointer; padding: 10px;" class="i8" @click="checkDataClassI('i8', 8)">
            <img width="28px" src="../assets/Icon/Picture9.png" alt="">
            <p style="font-size: 12px;">網站設定</p>
            </div>

            <div v-if="store.getRole(0) == 1 || store.getRole(0) == 2" style="margin: 15px 0; cursor: pointer; padding: 10px;" class="i9" @click="checkDataClassI('i9', 9)">
            <img width="28px" src="../assets/Icon/Picture10.png" alt="">
            <p style="font-size: 12px;">關於</p>
            <div style="width: 100%; text-align: center; align-items: center; display: flex; justify-content: center;"><div style="border-bottom: 5px solid grey; width: 50%; margin-top: 10px; border-radius: 10px;"></div></div>
            </div>

          </div>
        </div>
        <div v-if="isCheckShow != 10 && isCheckShow != 8" >
          
          <div
  ref="scrollContainer"
  class="scroll-box"
  @wheel="handleScroll"
  :class="{ 'show-scroll': showScroll }"
  :style="{
    transform: isShowHome ? 'translateX(0%)' : 'translateX(-100%)',
    transition: '0.4s ease-in-out',
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    height: '100%',
    zIndex: 1000,
    left: '82px',
    top: '0',
    textAlign: 'center',
    padding: '20px',
    borderTopRightRadius: '10px',
    borderBottomRightRadius: '10px',
    width: isCheckShow === 1 || isCheckShow === 12 ? '420px' : '400px',
    backgroundColor: isCheckShow === 1 || isCheckShow === 12 ? '#e6f3ff' : '#F0F8FF',
    overflow: 'auto'
  }"
>
      <div>
      <div v-if="isCheckShow == 1" style="width: 390px;">
        <div style="text-align: left; margin: 0 auto; width: 80%; border-bottom: 3px solid black;">
          <div style=" display: flex; justify-content: space-between;">
            
          <select v-model="dataSelect" @change="searchDataSelect" style="background-color: white; padding: 10px 15px; margin: 15px 0; border-radius: 20px; border: 1px dashed turquoise; width: 280px;">
        <option value="null" selected disabled>Search data ...</option>
        <option v-if="store.getRole(0) == 1" value="b1s">
          ✔ 故障確認
          </option>
          <option v-if="store.getRole(0) == 1" value="b2s">
            💦 維修中
          </option>

          <option v-if="store.getRole(0) == 1" value="b3s">
             👌 維修完成
          </option>
          <option v-if="store.getRole(0) == 1" value="b4s">
             💌 No Error
          </option>
          <option v-if="store.getRole(0) == 1" value="b5s">
            ❌ 故障通報
          </option>
          <option v-if="store.getRole(0) == 1" value="b6s">
            🧨 Total Error
          </option>
          <option value="all">
            📍 All Location
          </option>
        </select>

        
            </div>
          </div>
        <!-- Nút trong bản đồ -->
     <div class="map-buttons" style="display: flex; flex-direction: column; z-index: 1000; margin: 10px 15px;">
      <!-- <button @click="searchLocation">📍 Tìm vị trí</button> -->
      <!-- <button @click="getDirections">🚗 Tìm đường</button> -->

      <div style="display: flex;">
        
        
      <div style="text-align: left; width: 310px; padding-left: 15px; margin-top: 20px;">
      <select v-model.trim="valueE" @change="timkiemDataRoad" style="background-color: white; padding: 10px 15px; margin-bottom: 10px; border-radius: 20px; border: 1px dashed turquoise; width: 180px;">
     <option value="" selected disabled>🥽Search District ...</option>
      <option value="東區">東區</option>
      <option value="南區">南區</option>
      <option value="北區">北區</option>
      <option value="安南區">安南區</option>
      <option value="安平區">安平區</option>
      <option value="中西區">中西區</option>
      <option value="永康區">永康區</option>
      <option value="新營區">新營區</option>
      <option value="鹽水區">鹽水區</option>
      <option value="白河區">白河區</option>
      <option value="柳營區">柳營區</option>
      <option value="後壁區">後壁區</option>
      <option value="東山區">東山區</option>
      <option value="麻豆區">麻豆區</option>
      <option value="下營區">下營區</option>
      <option value="六甲區">六甲區</option>
      <option value="官田區">官田區</option>
      <option value="大內區">大內區</option>
      <option value="佳里區">佳里區</option>
      <option value="學甲區">學甲區</option>
      <option value="西港區">西港區</option>
      <option value="七股區">七股區</option>
      <option value="將軍區">將軍區</option>
      <option value="北門區">北門區</option>
      <option value="新化區">新化區</option>
      <option value="善化區">善化區</option>
      <option value="新市區">新市區</option>
      <option value="安定區">安定區</option>
      <option value="山上區">山上區</option>
      <option value="玉井區">玉井區</option>
      <option value="楠西區">楠西區</option>
      <option value="南化區">南化區</option>
      <option value="左鎮區">左鎮區</option>
      <option value="仁德區">仁德區</option>
      <option value="歸仁區">歸仁區</option>
      <option value="關廟區">關廟區</option>
      <option value="龍崎區">龍崎區</option>

      </select>
      <!--
        <input v-model.trim="valueE" style="padding: 5px 10px; outline: none; border: 1px dashed grey; border-radius: 10px;" placeholder="Search..." type="text">
        <button @click="timkiemDataRoad" style="background-color: transparent; border: none; outline: none;"><i class="fa fa-search" aria-hidden="true"></i></button>
        -->
        </div>

        <div style="text-align: center; margin-top: 20px; margin-right: 15px; cursor: pointer;" @click="showDetailsAll(isAction = !isAction)">
              <!--<i :class="{ 'spin-icon': isAction }" class="fa fa-futbol-o" aria-hidden="true" style="font-size: 30px;"></i>-->
                <img :src="isAction ? require('../assets/Icon/roomsmall.png') : require('../assets/Icon/roomlong.png')" style="width: 30px;">
              </div>
            </div>
        <div class="scroll-box">
          <ShowmapGmarket 
    :locations="locations"
    :zoomLevel="zoomLevel"
    :showDataChon="showDataChon"
    :clickDataLocation="clickDataLocation"
    :clickDataShowTable="clickDataShowTable"
    :updateUser="updateUser"
    :showBoxSearch="showBoxSearch"
    :showImage="showImage"
    :showDataMap="showDataMap"
    :clickDataUpdate="clickDataUpdate"
    :getFileType="getFileType"
    :setItemRef="setItemRef"
    :fomatDate="fomatDate"
    :showDetailsDiv="showDetailsDiv"
    :dataSearchUserName="dataSearchUserName"
    v-model:searchUserName="searchUserName"
  />
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

            <div v-if="isCheckShow == 12" style="width: 390px;">
        <!-- Nút trong bản đồ -->
     <div class="map-buttons" style="display: flex; flex-direction: column; z-index: 1000; margin: 10px 15px;">
      <!-- <button @click="searchLocation">📍 Tìm vị trí</button> -->
      <!-- <button @click="getDirections">🚗 Tìm đường</button> -->

      <div style="display: flex;">
        
      <div style="text-align: left; width: 310px; padding-left: 15px; margin-top: 20px;">
          <h3 style="margin-bottom: 20px;">Hello, {{ store.getIdAccountName }}</h3>
      <!--
        <input v-model.trim="valueE" style="padding: 5px 10px; outline: none; border: 1px dashed grey; border-radius: 10px;" placeholder="Search..." type="text">
        <button @click="timkiemDataRoad" style="background-color: transparent; border: none; outline: none;"><i class="fa fa-search" aria-hidden="true"></i></button>
        -->
        </div>

        <div style="text-align: center; margin-top: 20px; margin-right: 15px; cursor: pointer;" @click="showDetailsAll(isAction = !isAction)">
              <!--<i :class="{ 'spin-icon': isAction }" class="fa fa-futbol-o" aria-hidden="true" style="font-size: 30px;"></i>-->
                <img :src="isAction ? require('../assets/Icon/roomsmall.png') : require('../assets/Icon/roomlong.png')" style="width: 30px;">
              </div>
            </div>
        <div class="scroll-box">
          <ShowmapGmarket 
    :locations="locations"
    :zoomLevel="zoomLevel"
    :showDataChon="showDataChon"
    :clickDataLocation="clickDataLocation"
    :clickDataShowTable="clickDataShowTable"
    :updateUser="updateUser"
    :showBoxSearch="showBoxSearch"
    :showImage="showImage"
    :showDataMap="showDataMap"
    :clickDataUpdate="clickDataUpdate"
    :getFileType="getFileType"
    :setItemRef="setItemRef"
    :fomatDate="fomatDate"
    :showDetailsDiv="showDetailsDiv"
    :dataSearchUserName="dataSearchUserName"
    v-model:searchUserName="searchUserName"
  />
      <PagesTotal v-if="isPhanTrang" :page="page" :totalPage="totalPage" :valueE="valueE" @pageChange="findAllDataMap" @pageSizeChange="changeReload"></PagesTotal>
     </div>
    </div>

    
        </div>
    </div>
    
    </div>
          <div v-if="isCheckShow == 1 || isCheckShow == 12">
      <div :style="{
      transform: isShowHome && isCheckShow != 10 && isCheckShow != 8 ? 'translateX(790%)' : 'translateX(0%)',
      transition: '0.4s ease-in-out',
      left: '85px'
  }" style="position: absolute; top: 20%; height: 30px; cursor: pointer; text-align: right; width: 50px; background-color: white; border-top-right-radius: 20px; border-bottom-right-radius: 20px;">
        <i @click="showWindowDetaile" :style="{
      transform: isShowHome ? 'rotate(-180deg)' : 'rotate(0)',
      transition: '0.4s ease-in-out',
    
  }" style="font-size: 20px; margin-right: 10px; line-height: 30px;" class="fa fa-sign-in" aria-hidden="true"></i>
        
      </div>
      </div>

      <div v-if="isCheckShow == 2 || isCheckShow == 3 || isCheckShow == 9">
      <div :style="{
      transform: isShowHome && isCheckShow != 10 && isCheckShow != 8 ? 'translateX(760%)' : 'translateX(0%)',
      transition: '0.4s ease-in-out',
      left: '85px'
  }" style="position: absolute; top: 20%; height: 30px; cursor: pointer; text-align: right; width: 50px; background-color: white; border-top-right-radius: 20px; border-bottom-right-radius: 20px;">
        <i @click="showWindowDetaile" :style="{
      transform: isShowHome ? 'rotate(-180deg)' : 'rotate(0)',
      transition: '0.4s ease-in-out',
    
  }" style="font-size: 20px; margin-right: 10px; line-height: 30px;" class="fa fa-sign-in" aria-hidden="true"></i>
        
      </div>
      </div>
          </div>
      <div v-if="!isShowHome" style="position: absolute; top: 20px; left: 120px;">
        <div>
            <GMapAutocomplete
            style="padding: 10px 15px; border-radius: 20px; border: none; box-shadow: 3px 3px 3px grey; outline: none; width: 250px;"
              v-model="searchAddress"
              type="text"
              placeholder="Address to Find..."
              @place_changed="searchLocation"
        />
  
          </div>
        </div>
    </GoogleMap>
</template>

<script setup>
import {  ref, watch, defineProps, defineEmits } from 'vue';
const props = defineProps({
  mapCenter: {
        type: Object,
        required: true
    },
    zoomLevel: {
        type: Number,
        required: true
    },
    handleMapLoad: {
      type: Function,
      required: true
    },
    onIdle:{
      type: Function,
      required: true
    },
    checkData: {
      type: Boolean,
      required: true
    },
    boundaryCoordinates: {
      type: Array,
      required: true
    },
    resolvedLocations: {
      type: Array,
      required: true
    },
    showInfo: {
      type: Function,
      required: true
    },
    clickDataLocation: {
      type: Function,
      required: true
    },
    locations: {
      type: Array,
      required: true
    },
    showMarkers: {
      type: Boolean,
      required: true
    },
    currentLocation: {
      type: Object,
      required: true
    },
    routePath: {
      type: Array,
      required: true
    },
    selectedTransport: {
      type: String,
      required: true
    },
    routeDistance: {
      type: Object, // "ref(null)" là một reactive object
      required: true
    },
    showDistance: {
      type: Boolean, // "ref(null)" là một reactive object
      required: true
    },
    midPoint: {
      type: Boolean, // "ref(null)" là một reactive object
      required: true
    }
})
</script>

<style>

</style>