<template>
    <div>
      
    <div style="position: relative;">
      <button @click="logout" style="position: absolute; top: 45px; z-index: 1000; right: 80px; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: aqua; border-radius: 5px; margin: 10px 0;">
          登出
        </button>

        <!-- <button @click="offpoi" style="position: absolute; top: 45px; z-index: 1000; right: 160px; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: aqua; border-radius: 5px; margin: 10px 0;">
          Off Poi
        </button> -->

        <button @click="getCurrentLocation" style="position: absolute; top: 45px; z-index: 1000; right: 160px; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: aqua; border-radius: 5px; margin: 10px 0;">
          <i class="fa fa-street-view" aria-hidden="true"></i>
        </button>

        <!-- Nút trong bản đồ -->
       <div class="map-buttons" style="position: absolute; text-align: right; right: 100px; top: 10px; z-index: 1000;">
        <!-- <button @click="searchLocation">📍 Tìm vị trí</button> -->
        <!-- <button @click="getDirections">🚗 Tìm đường</button> -->

        <button @click="searchStatus1('b1s')" class="b1s"><i style="color: greenyellow;" class="fa fa-check" aria-hidden="true"></i> Search Data 1</button>
        <button @click="searchStatus2('b2s')" style="margin: 0 10px;" class="b2s"><i style="color: red;" class="fa fa-exclamation-triangle" aria-hidden="true"></i> Search Data 2</button>
        <button @click="searchStatus3('b3s')" class="b3s"><i style="color: yellow;" class="fa fa-handshake-o" aria-hidden="true"></i> Search Data 3</button>
        <button @click="searchStatus5('b5s')" class="b5s" style="margin: 0 10px;">💦💤 Search Data 5</button>
        <button @click="searchStatus4('b4s')" class="b4s">💌 Search Data 4</button>
        <button @click="AllData" style="margin: 0 10px;">📍 All Location</button>
      </div>
 <!-- Bản đồ -->
 <GMapMap
        ref="mapRefs"
        :center="mapCenter"
        :zoom="zoomLevel"
        :options="mapOptions"
        style="height: 100vh; width: 100%;"
        map-type-id="roadmap"
        @zoom_changed="onZoomChanged"
        @center_changed="onCenterChanged"
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
      <div style="position: absolute; right: 10px; top: 100px;">
      <div>
        <div>
        <input
        style="padding: 10px 5px; border-radius: 10px; border: 1px dashed greenyellow; outline: none;"
          v-model="searchAddress"
          type="text"
          placeholder="Address to Find..."
          @keyup.enter="searchLocation"
        />
        <button @click="searchLocation" style="padding: 10px 15px; border-radius: 10px; outline: none; cursor: pointer; border: 1px solid grey; background-color: transparent; margin: 0 10px;"><i class="fa fa-search" aria-hidden="true"></i></button>
      </div>

      <div style="margin: 10px 0;">
        <input
        style="padding: 10px 5px; border-radius: 10px; border: 1px dashed greenyellow; outline: none;"
          v-model="searchAddressHome"
          type="text"
          placeholder="Home Address..."
          @keyup.enter="searchHomeData"
        />
        <button @click="searchHomeData" style="padding: 10px 15px; border-radius: 10px; outline: none; cursor: pointer; border: 1px solid grey; background-color: transparent; margin: 0 10px;"><i class="fa fa-search" aria-hidden="true"></i></button>
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

    <button @click="toggleTraffic" style="margin-bottom: 10px; padding: 5px 10px; border: 3px dashed violet; background-color: transparent; outline: none; cursor: pointer;">
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
      <div v-if="zoomLevel >= 13">
      <div v-if="location.isError">
        <GMapMarker
        v-if="location.statusError == 0"
          :position="location.coordinates"
          :label="location.address"
          @click="showInfo(location.coordinates.lat)"
          :icon="{
            // url: marker1.url, // Đây là đổi ảnh liên tục
            url: imageStatus.status0,
            scaledSize: { width: 40, height: 40 },
            anchor: { x: 25, y: 25 }, // Căn giữa ảnh marker
          }"

          class="marker-icon"
        >
            <!-- Hiển thị thông tin khi bấm vào marker -->

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
                        <p v-if="location.account_user != null && location.account_user != ''">User Name: {{ location.account_user }}</p>
                        <p style="font-size: 20px; font-weight: bold;">Status: <i class="fa fa-window-close-o" style="animation: thei1 0.5s ease-in-out infinite;" aria-hidden="true"></i></p>
                        <!-- <div v-if="location.images.length > 0">
                          <img v-for="(item, index) in location.images" :key="index" @click="showImage(item)"  :src="item" style="width: 50px; height: 50px; border-radius: 50%;" alt="">
                        </div> -->
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
       
    </GMapMarker>
        <GMapMarker
        v-if="location.statusError == 1"
          :position="location.coordinates"
          :label="location.address"
          @click="showInfo(location.coordinates.lat)"
          :icon="{
            // url: marker1.url, // Đây là đổi ảnh liên tục
            url: imageStatus.status1s,
            scaledSize: { width: 40, height: 40 },
            anchor: { x: 25, y: 25 }, // Căn giữa ảnh marker
          }"

          class="marker-icon"
        >
            <!-- Hiển thị thông tin khi bấm vào marker -->

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
                        <!-- <div v-if="location.images.length > 0">
                          <img v-for="(item, index) in location.images" :key="index" @click="showImage(item)"  :src="item" style="width: 50px; height: 50px; border-radius: 50%;" alt="">
                        </div> -->
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
       
    </GMapMarker>
    <GMapMarker
        v-if="location.statusError == 2"
          :position="location.coordinates"
          :label="location.address"
          @click="showInfo(location.coordinates.lat)"
          :icon="{
            // url: marker1.url, // Đây là đổi ảnh liên tục
            url: imageStatus.status2,
            scaledSize: { width: 40, height: 40 },
            anchor: { x: 25, y: 25 }, // Căn giữa ảnh marker
          }"

          class="marker-icon"
        >
            <!-- Hiển thị thông tin khi bấm vào marker -->

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
                        <!-- <div v-if="location.images.length > 0">
                          <img v-for="(item, index) in location.images" :key="index" @click="showImage(item)"  :src="item" style="width: 50px; height: 50px; border-radius: 50%;" alt="">
                        </div> -->
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
       
    </GMapMarker>

    <GMapMarker
        v-if="location.statusError == 3"
          :position="location.coordinates"
          :label="location.address"
          @click="showInfo(location.coordinates.lat)"
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
                        <!-- <div v-if="location.images.length > 0">
                          <img v-for="(item, index) in location.images" :key="index" @click="showImage(item)"  :src="item" style="width: 50px; height: 50px; border-radius: 50%;" alt="">
                        </div> -->
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
       
    </GMapMarker>
      </div>
      <div v-else>
        <GMapMarker
          :position="location.coordinates"
          :label="location.managementUnit"
          @click="showInfo(location.coordinates.lat)"
          :icon="{
            // url: marker1.url, // Đây là đổi ảnh liên tục
            url: imageStatus.status1,
            scaledSize: { width: 40, height: 40 },
            anchor: { x: 25, y: 25 }, // Căn giữa ảnh marker
          }"

          class="marker-icon"
        >
            <!-- Hiển thị thông tin khi bấm vào marker -->

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
                        <!-- <div v-if="location.images.length > 0">
                          <img v-for="(item, index) in location.images" :key="index" @click="showImage(item)"  :src="item" style="width: 50px; height: 50px; border-radius: 50%;" alt="">
                        </div> -->
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
       
    </GMapMarker>
      </div>
        

      
     </div>
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
      <div style="position: absolute; top: 200px; left: 20px; border-radius: 10px; z-index: 1000; border: 1px solid black; width: 200px;">
        <div style="display: flex;">
          <button @click="chonAll" class="poi1" style="display: block; z-index: 1000; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: transparent; border-radius: 5px;">
             All 
          </button>
          <input type="checkbox" @change="chonAll" v-model="checkDataBoxAll">
        </div>
        <table>
          <thead>
            <tr>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <button @click="toggleSchool('attraction', 'FF4500', 'poi1')" class="poi1" style="display: block; z-index: 1000; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: transparent; border-radius: 5px;">
            <i class="fa fa-camera-retro" aria-hidden="true" ></i> attraction 
          </button>
              </td>
              <td>
                <input type="checkbox" @change="toggleSchool('attraction', 'FF4500', 'poi1')" v-model="checkDataBoxattraction">
                <!-- <input type="checkbox" @change="toggleSchool('attraction', 'FF4500', 'poi1')" @click="checkDataBoxattraction = !checkDataBoxattraction"> -->
              </td>
              </tr>
              
              <tr>
                <td>
                <button @click="toggleSchool('business', '191970', 'poi2')" class="poi2" style="display: block; padding: 10px 25px; z-index: 1000; outline: none; cursor: pointer; border: none; background-color: transparent; border-radius: 5px;">
            <i class="fa fa-building" aria-hidden="true"></i>  business 
          </button>
              </td>
              <td>
                <input type="checkbox" @change="toggleSchool('business', '191970', 'poi2')" v-model="checkDataBoxbusiness">
              </td>
              </tr>
              
              <tr>
                <td>
                <button @click="toggleSchool('government', 'FF8C00', 'poi3')" class="poi3" style="display: block; z-index: 1000; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: transparent; border-radius: 5px;">
            <i class="fa fa-university" aria-hidden="true"></i>  government 
          </button>
              </td>

              <td>
                <input type="checkbox" @change="toggleSchool('government', 'FF8C00', 'poi3')" v-model="checkDataBoxgovernment">
              </td>
              </tr>
              
              <tr>
                <td>
                <button @click="toggleSchool('medical', '000000', 'poi4')" class="poi4" style="display: block; z-index: 1000; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: transparent; border-radius: 5px;">
            <i class="fa fa-medkit" aria-hidden="true"></i>  medical 
          </button>
              </td>
                <td>
                <input type="checkbox" @change="toggleSchool('medical', '000000', 'poi4')" v-model="checkDataBoxmedical">
              </td>
              </tr>
              
              <tr>
                <td>
                <button @click="toggleSchool('park', '8B0000', 'poi5')" class="poi5" style="display: block; z-index: 1000; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: transparent; border-radius: 5px;">
            <i class="fa fa-pagelines" aria-hidden="true"></i> Park  
          </button>
              </td>
                <td>
                <input type="checkbox" @change="toggleSchool('park', '8B0000', 'poi5')" v-model="checkDataBoxpark">
              </td>
              </tr>
              
              <tr>
                <td>
                <button @click="toggleSchool('place_of_worship', 'DC143C', 'poi6')" class="poi6" style="display: block; z-index: 1000; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: transparent; border-radius: 5px;">
            <i class="fa fa-area-chart" aria-hidden="true"></i> Place of worship  
          </button>
              </td>
                <td>
                <input type="checkbox" @change="toggleSchool('place_of_worship', 'DC143C', 'poi6')" v-model="checkDataBoxplace_of_worship">
              </td>
              </tr>
              
              <tr>
                <td>
                <button @click="toggleSchool('school', '80bfff', 'poi7')" class="poi7" style="display: block; z-index: 1000; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: transparent; border-radius: 5px;">
            <i class="fa fa-graduation-cap" aria-hidden="true"></i> school  
          </button>
              </td>
                <td>
                <input type="checkbox" @change="toggleSchool('school', '80bfff', 'poi7')" v-model="checkDataBoxschool">
              </td>
              </tr>
              
              <tr>
              <td>
                <button @click="toggleSchool('sports_complex', '8A2BE2', 'poi8')" class="poi8" style="display: block; z-index: 1000; padding: 10px 25px; outline: none; cursor: pointer; border: none; background-color: transparent; border-radius: 5px;">
            <i class="fa fa-child" aria-hidden="true"></i> sports complex  
          </button>
              </td>

              <td>
                <input type="checkbox" @change="toggleSchool('sports_complex', '8A2BE2', 'poi8')" v-model="checkDataBoxsports_complex">
              </td>
            </tr>
          </tbody>
        </table>  
        </div>

       <div style="position: absolute; padding: 10px; width: 300px; height: 400px; overflow: auto; background-color: rgba(255, 255, 255, 0.8); border: 1px solid black; top: 250px; right: 10px; border-radius: 10px;">
        <div v-if="zoomLevel >= 13">
          <div v-for="(location, index) in locations" :key="index">
          <div v-if="location.isError">
            <div v-if="location.statusError == 0" @click="showDataMap(location.coordinates)" style="cursor: pointer; border: 1px dashed black; border-radius: 10px; padding: 10px; margin-bottom: 10px;">
              <h4>category Code: {{ location.categoryCode }}</h4>
              <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ location.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ location.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ location.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ location.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; font-weight: bold;">Status: <i class="fa fa-window-close-o" style="animation: thei1 0.5s ease-in-out infinite;" aria-hidden="true"></i></p>
            </div>
            </div>
             
            </div>
            
            <div v-if="location.statusError == 1" @click="showDataMap(location.coordinates)" style="cursor: pointer; border: 1px dashed black; border-radius: 10px; padding: 10px; margin-bottom: 10px;">
              <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ location.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ location.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ location.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ location.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; color: greenyellow;">Status: <i class="fa fa-check" aria-hidden="true"></i></p>
            </div>
            </div>
              
            </div>

            <div v-if="location.statusError == 2" @click="showDataMap(location.coordinates)" style="cursor: pointer; border: 1px dashed black; border-radius: 10px; padding: 10px; margin-bottom: 10px;">
              <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ location.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ location.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ location.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ location.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; color: greenyellow; animation: thei1 0.5s ease-in-out infinite;">Status: <i class="fa fa-exclamation-triangle" aria-hidden="true"></i></p>
            </div>
            </div>
              
            </div>

            <div v-if="location.statusError == 3" @click="showDataMap(location.coordinates)" style="cursor: pointer; border: 1px dashed black; border-radius: 10px; padding: 10px; margin-bottom: 10px;">
              <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ location.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ location.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ location.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ location.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; color: greenyellow; animation: thei2 0.5s ease-in-out infinite;">Status: <i class="fa fa-handshake-o" aria-hidden="true"></i></p>
            </div>
            </div>
              
            </div>
          </div>
          <div v-else style="cursor: pointer; border: 1px dashed black; border-radius: 10px; padding: 10px; margin-bottom: 10px;" @click="showDataMap(location.coordinates)">
            <h4>category Code: {{ location.categoryCode }}</h4>
            
            <div style="display: flex;">
              <div>
              <p style="font-size: 12px;">IdentificationCode: <strong>{{ location.identificationCode }}</strong></p>
              <p style="font-size: 12px;">Lat: <strong>{{ location.latitude }}</strong></p>
              <p style="font-size: 12px;">Lng: <strong>{{ location.longitude }}</strong></p>
            </div>
            <div>
              <p style="font-size: 12px;">signal Number: <strong>{{ location.signalNumber }}</strong></p>
              <p style="font-size: 12px;">Types Of Signal: <strong>{{ location.typesOfSignal }}</strong></p>
              <p style="font-size: 20px; color: greenyellow;"><i class="fa fa-check" aria-hidden="true"></i></p>
            </div>
            </div>
            
          </div>
        </div>
        </div>
        <PagesTotal v-if="isPhanTrang" :page="page" :totalPage="totalPage" :valueE="valueE" @pageChange="findAllDataMap" @pageSizeChange="changeReload"></PagesTotal>
       </div>
      </GMapMap>
    </div>
     
    <div v-if="selectedImage" class="image-modal" @click.self="closeImage">
      <img :src="selectedImage" class="image-full" alt="Full Image" />
    </div>
    </div>

    <div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>載入中......</p>
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

  // Vị trí trung tâm bản đồ (Hồ Chí Minh)
  const mapCenter = ref({ lat: 22.841228204468152, lng: 120.26414714944056 });
  const zoomLevel = ref(6);
  const valueE = ref("")
  const page = ref(1)
  const totalPage = ref(0)
  const pageSize = ref(5)
  const store = useCounterStore()
  const router = useRouter()
  // Vị trí hiện tại của người dùng
  const currentLocation = ref({ lat: 22.841228204468152, lng: 120.26414714944056 });
  
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

  // const intervalData = ref(null)
  const checkData = ref(false)
  const selectedImage = ref(null)
  const trafficLayer = ref(null)
  const trafficVisible = ref(false); // Trạng thái bật/tắt giao thông
  const TaiNanCenter = ref([{
    // 22.998670465166924, 120.22384000412357
    coordinates: { lat: 22.998670465166924, lng: 120.22384000412357 },
    status: 4
  }])

  const checkDataBoxattraction = ref(false)
  const checkDataBoxbusiness = ref(false)
  const checkDataBoxgovernment = ref(false)
  const checkDataBoxmedical = ref(false)
  const checkDataBoxpark = ref(false)
  const checkDataBoxplace_of_worship = ref(false)
  const checkDataBoxschool = ref(false)
  const checkDataBoxsports_complex = ref(false)
  const checkDataBoxAll = ref(false)

  const classPoi = ref(null)
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
  //     stylers: [{ visibility: "on" }]
  //     },
  //     {
  //       featureType: "poi.park", // Hiển thị công viên với màu xanh lá
  //       elementType: "labels",
  //       stylers: [{ color: "#a0e99b" }, { visibility: "on" }],
  //     },
  //     {
  //       featureType: "poi.business", // Làm mờ các khu vực kinh doanh
  //       elementType: "labels",
  //       stylers: [{ color: "#f5f5f5" }],
  //     },
  //     {
  //       featureType: "poi.attraction", // Tô màu nổi bật cho địa điểm du lịch
  //       elementType: "labels",
  //       stylers: [{ color: "#ffcc00" }],
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

const chonAll = ()=> {
  if(checkDataBoxAll.value){
    zoomLevel.value = 13
    checkDataBoxattraction.value = true
   checkDataBoxbusiness.value = true
   checkDataBoxgovernment.value = true
   checkDataBoxmedical.value = true
   checkDataBoxpark.value = true
   checkDataBoxplace_of_worship.value = true
   checkDataBoxschool.value = true
   checkDataBoxsports_complex.value = true

   mapOptions.value.styles.push({
        featureType: `poi.attraction`,
        elementType: "labels",
        stylers: [{ color: `#FF4500` }, { weight: "bold" }],
      },
      {
        featureType: `poi.business`,
        elementType: "labels",
        stylers: [{ color: `#191970` }, { weight: "bold" }],
      },
      {
        featureType: `poi.government`,
        elementType: "labels",
        stylers: [{ color: `#FF8C00` }, { weight: "bold" }],
      },
      {
        featureType: `poi.medical`,
        elementType: "labels",
        stylers: [{ color: `#000000` }, { weight: "bold" }],
      },
      {
        featureType: `poi.park`,
        elementType: "labels",
        stylers: [{ color: `#8B0000` }, { weight: "bold" }],
      },
      {
        featureType: `poi.place_of_worship`,
        elementType: "labels",
        stylers: [{ color: `#DC143C` }, { weight: "bold" }],
      },
      {
        featureType: `poi.school`,
        elementType: "labels",
        stylers: [{ color: `#80bfff` }, { weight: "bold" }],
      },
      {
        featureType: `poi.sports_complex`,
        elementType: "labels",
        stylers: [{ color: `#8A2BE2` }, { weight: "bold" }],
      }
    )
  }else{
    offpoi()
  }
}
const offpoi = () => {
  
  mapOptions.value.styles = []
  // if(classPoi.value != null)
  //   document.querySelector("." + classPoi.value).style.backgroundColor = "white"
  
  classPoi.value = null

   checkDataBoxattraction.value = false
   checkDataBoxbusiness.value = false
   checkDataBoxgovernment.value = false
   checkDataBoxmedical.value = false
   checkDataBoxpark.value = false
   checkDataBoxplace_of_worship.value = false
   checkDataBoxschool.value = false
   checkDataBoxsports_complex.value = false

   
}

  const toggleSchool = (poiData, colorData, classData) => {
    // if(classPoi.value != null)
    //   document.querySelector("." + classPoi.value).style.backgroundColor = "transparent"

    // document.querySelector("." + classData).style.backgroundColor = "yellow"

    classPoi.value = classData
    zoomLevel.value = 13
    
    const checkData = mapOptions.value.styles.find(x => x.featureType == `poi.${poiData}`)
    if(checkData == null){
      mapOptions.value.styles.push({
        featureType: `poi.${poiData}`,
        elementType: "labels",
        stylers: [{ color: `#${colorData}` }, { weight: "bold" }],
      })
    }

    if(!checkDataBoxattraction.value){
       // Tìm chỉ số của phần tử có giá trị 'poi.attraction'
      // const index = mapOptions.value.styles.findIndex(x => x.featureType == 'poi.attraction')
      // if(index !== -1) 
      //   mapOptions.value.styles.splice(index, 1) // Xóa 1 phần tử tại vị trí index

      mapOptions.value.styles = mapOptions.value.styles.filter(x => x.featureType !== 'poi.attraction')

    }

    if(!checkDataBoxbusiness.value){
       // Tìm chỉ số của phần tử có giá trị 'poi.attraction'
      // const index = mapOptions.value.styles.findIndex(x => x.featureType == 'poi.business')
      // if(index !== -1) 
      //   mapOptions.value.styles.splice(index, 1) // Xóa 1 phần tử tại vị trí index

      mapOptions.value.styles = mapOptions.value.styles.filter(x => x.featureType !== 'poi.business')
    }
    if(!checkDataBoxgovernment.value){
       // Tìm chỉ số của phần tử có giá trị 'poi.attraction'
      // const index = mapOptions.value.styles.findIndex(x => x.featureType == 'poi.government')
      // if(index !== -1) 
      //   mapOptions.value.styles.splice(index, 1) // Xóa 1 phần tử tại vị trí index

      mapOptions.value.styles = mapOptions.value.styles.filter(x => x.featureType !== 'poi.government')
    }
    
    if(!checkDataBoxmedical.value){
       // Tìm chỉ số của phần tử có giá trị 'poi.attraction'
      // const index = mapOptions.value.styles.findIndex(x => x.featureType == 'poi.medical')
      // if(index !== -1) 
      //   mapOptions.value.styles.splice(index, 1) // Xóa 1 phần tử tại vị trí index

      mapOptions.value.styles = mapOptions.value.styles.filter(x => x.featureType !== 'poi.medical')
      
    }

    if(!checkDataBoxpark.value){
       // Tìm chỉ số của phần tử có giá trị 'poi.attraction'
      // const index = mapOptions.value.styles.findIndex(x => x.featureType == 'poi.park')
      // if(index !== -1) 
      //   mapOptions.value.styles.splice(index, 1) // Xóa 1 phần tử tại vị trí index

      mapOptions.value.styles = mapOptions.value.styles.filter(x => x.featureType !== 'poi.park')
    }

    if(!checkDataBoxplace_of_worship.value){
       // Tìm chỉ số của phần tử có giá trị 'poi.attraction'
      // const index = mapOptions.value.styles.findIndex(x => x.featureType == 'poi.place_of_worship')
      // if(index !== -1) 
      //   mapOptions.value.styles.splice(index, 1) // Xóa 1 phần tử tại vị trí index

      mapOptions.value.styles = mapOptions.value.styles.filter(x => x.featureType !== 'poi.place_of_worship')
    }

    if(!checkDataBoxschool.value){
       // Tìm chỉ số của phần tử có giá trị 'poi.attraction'
      // const index = mapOptions.value.styles.findIndex(x => x.featureType == 'poi.school')
      // if(index !== -1) 
      //   mapOptions.value.styles.splice(index, 1) // Xóa 1 phần tử tại vị trí index

      mapOptions.value.styles = mapOptions.value.styles.filter(x => x.featureType !== 'poi.school')
    }

    if(!checkDataBoxsports_complex.value){
       // Tìm chỉ số của phần tử có giá trị 'poi.attraction'
      // const index = mapOptions.value.styles.findIndex(x => x.featureType == 'poi.sports_complex')
      // if(index !== -1) 
      //   mapOptions.value.styles.splice(index, 1) // Xóa 1 phần tử tại vị trí index

      mapOptions.value.styles = mapOptions.value.styles.filter(x => x.featureType !== 'poi.sports_complex')
    }
  
};
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

 
  const mapRefs = ref(null)
  const dataLoadStart = ref([
  {
    name: "Hà Nội",
    details: "Thủ đô của Việt Nam.",
    coordinates: { lat: 21.0285, lng: 105.8542 },
    status: 2,
    address: "Hà Nội",
    images: ['https://media.ohay.tv/v1/content/2015/08/den-giao-thong-ohay-tv-13480.jpg', 
      'https://png.pngtree.com/png-clipart/20201209/original/pngtree-cartoon-traffic-light-car-border-png-image_5636223.jpg',
      'https://info-imgs.vgcloud.vn/2020/09/30/15/su-that-it-nguoi-biet-ve-den-giao-thong-hinh-trai-tim-o-iceland-1.jpg',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },
  {
    name: "Đà Nẵng",
    details: "Thành phố biển đẹp với nhiều cây cầu nổi tiếng.",
    coordinates: { lat: 16.0471, lng: 108.2062 },
    status: 1,
    address: "Đà Nẵng",
    images: ['https://tse1.mm.bing.net/th?id=OIP.W6VXi6f4K3bb-vN4E74VLQHaHa&pid=Api&P=0&h=220', 
      'https://img.lovepik.com/free-png/20220125/lovepik-traffic-light-png-image_401723131_wh1200.png',
      'https://png.pngtree.com/png-clipart/20230526/original/pngtree-cartoon-traffic-lights-png-image_9170567.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },
  {
    name: "Hồ Chí Minh",
    details: "Thành phố sôi động nhất Việt Nam.",
    coordinates: { lat: 10.7769, lng: 106.7009 },
    status: 1,
    address: "Hồ Chí Minh",
    images: ['https://tse1.mm.bing.net/th?id=OIP.W6VXi6f4K3bb-vN4E74VLQHaHa&pid=Api&P=0&h=220', 
      'https://img.lovepik.com/free-png/20220125/lovepik-traffic-light-png-image_401723131_wh1200.png',
      'https://png.pngtree.com/png-clipart/20230526/original/pngtree-cartoon-traffic-lights-png-image_9170567.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "路竹",
    details: "高雄路竹、岡山景點推薦｜一日遊必玩景點",
    coordinates: { lat: 22.851249157002695, lng: 120.2621669869074 },
    status: 2,
    address: "路竹",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "22.801448638691898, 120.2961121829028",
    details: "紅綠燈",
    coordinates: { lat: 22.801448638691898, lng: 120.29611218290281 },
    status: 3,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "22.857972011810023, 120.26045037313789",
    details: "紅綠燈",
    coordinates: { lat: 22.857972011810023, lng: 120.26045037313789 },
    status: 2,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "22.841218316943582, 120.2638467420309",
    details: "紅綠燈",
    coordinates: { lat: 22.841218316943582, lng: 120.2638467420309 },
    status: 1,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "22.873253926259686, 120.2540388944345",
    details: "紅綠燈",
    coordinates: { lat: 22.873253926259686, lng: 120.2540388944345 },
    status: 3,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "22.906321950844895, 120.22908960641398",
    details: "紅綠燈",
    coordinates: { lat: 22.906321950844895, lng: 120.22908960641398 },
    status: 1,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "22.943262977635996, 120.250115887539",
    details: "紅綠燈",
    coordinates: { lat: 22.943262977635996, lng: 120.250115887539 },
    status: 3,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "24.112811586230016, 120.58253063390725",
    details: "紅綠燈",
    coordinates: { lat: 24.112811586230016, lng: 120.58253063390725 },
    status: 1,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "24.106301922209315, 120.61343510685045",
    details: "紅綠燈",
    coordinates: { lat: 24.106301922209315, lng: 120.61343510685045 },
    status: 2,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "24.27327749350728, 120.69243828856976",
    details: "紅綠燈",
    coordinates: { lat: 24.27327749350728, lng: 120.69243828856976 },
    status: 3,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "24.27130948400632, 120.69146736060371",
    details: "紅綠燈",
    coordinates: { lat: 24.27130948400632, lng: 120.69146736060371 },
    status: 1,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "25.06942443949689, 121.43945301652914",
    details: "紅綠燈",
    coordinates: { lat: 25.06942443949689, lng: 121.43945301652914 },
    status: 2,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "25.078230422267605, 121.51441084817357",
    details: "紅綠燈",
    coordinates: { lat: 25.078230422267605, lng: 121.51441084817357 },
    status: 3,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "24.99004589972378, 121.48184991803946",
    details: "紅綠燈",
    coordinates: { lat: 24.99004589972378, lng: 121.48184991803946 },
    status: 1,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },

  {
    name: "25.0060598361445, 121.58044374045782",
    details: "紅綠燈",
    coordinates: { lat: 25.0060598361445, lng: 121.58044374045782 },
    status: 2,
    address: "紅綠燈",
    images: ['https://www.danangbus.vn/UploadImages/111111(1).png', 
      'https://i.ytimg.com/vi/JPCY_27xSWo/hqdefault.jpg',
      'https://cdn.thuvienphapluat.vn/phap-luat/2022/6/10/HN/den-giao-thong.png',
      'https://img.lovepik.com/free-png/20211225/lovepik-traffic-light-display-device-png-image_400388819_wh860.png',
      'https://anphu-ict.vn/wp-content/uploads/2020/02/tru-thgt-don.jpg',
      'https://c.pxhere.com/photos/dd/8b/green_traffic_light_pass_free_symbol_metaphor-695049.jpg!s2',
      'https://png.pngtree.com/png-clipart/20190902/original/pngtree-cartoon-hand-drawn-traffic-lights-png-elements-png-image_4394426.jpg'
    ]
  },
])

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
const showDataMap = (location) => {
  mapCenter.value = location
    // mapCenter.value.lng = TaiNanCenter.value[0].coordinates.lng
    zoomLevel.value = 13
    selectedMarker.value = location.lat
    showDistanceList.value = !showDistanceList.value
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
    if (mapRefs.value) {
      const center = mapRefs.value.$mapObject.getCenter();
      const newCenter = { lat: center.lat(), lng: center.lng() };

      // Kiểm tra nếu thay đổi vị trí trung tâm lớn hơn 0.001 độ (~100m) thì mới cập nhật
      if (
        Math.abs(newCenter.lat - mapCenter.value.lat) > 0.001 ||
        Math.abs(newCenter.lng - mapCenter.value.lng) > 0.001
      ) {
        mapCenter.value = { lat: center.lat(), lng: center.lng() };
        onZoomChanged()
        console.log("Cập nhật vị trí:", mapCenter.value);
      }
    }
  }, 300); // Chỉ cập nhật sau 300ms khi người dùng dừng di chuyển
    }
const onZoomChanged = () => {
  zoomLevel.value = mapRefs.value.$mapObject.getZoom();
  mapCenter.value = {lat: mapRefs.value.$mapObject.getCenter().lat(), lng: mapRefs.value.$mapObject.getCenter().lng()}

    if (zoomLevel.value < 13) {
      // Khi thu nhỏ bản đồ -> chỉ hiển thị các Quận
      locations.value = TaiNanCenter.value;
    } else {
      // Nếu zoom >= 18 thì cập nhật danh sách điểm
      if (zoomLevel.value >= 13) {
        // mapCenter.value = {lat: mapRefs.value.$mapObject.getCenter().lat(), lng: mapRefs.value.$mapObject.getCenter().lng()}
        // locations.value = dataLoadStart.value.filter((location) => {
        //   const distance = getDistance(
        //     mapCenter.value.lat,
        //     mapCenter.value.lng,
        //     location.coordinates.lat,
        //     location.coordinates.lng
        //   );
        //   console.log(distance)
        //   return distance <= 1; // Lấy các điểm trong bán kính 1km
        // });

        // console.log(locations.value)
        if(btnSearch.value == null){
         // Khi phóng to -> hiển thị các địa điểm chi tiết trong quận
         mapCenter.value = {lat: mapRefs.value.$mapObject.getCenter().lat(), lng: mapRefs.value.$mapObject.getCenter().lng()}
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
       }

       else{
         if(btnSearch.value == 'b1s'){
           searchStatus1(btnSearch.value)
         }else if(btnSearch.value == 'b2s'){
           searchStatus2(btnSearch.value)
         }else if(btnSearch.value == 'b3s'){
           searchStatus3(btnSearch.value)
         }else if(btnSearch.value == 'b4s'){
           searchStatus4(btnSearch.value)
         }else if(btnSearch.value == 'b5s'){
           searchStatus5(btnSearch.value)
         }
        }
      } else {
        locations.value = []; // Nếu zoom < 18 thì ẩn hết điểm
      }
      //  if(btnSearch.value == null){
      //    // Khi phóng to -> hiển thị các địa điểm chi tiết trong quận
      //    mapCenter.value = {lat: mapRefs.value.$mapObject.getCenter().lat(), lng: mapRefs.value.$mapObject.getCenter().lng()}
      //   locations.value = dataLoadStart.value.filter((location) => {
      //     const distance = getDistance(
      //       mapCenter.value.lat,
      //       mapCenter.value.lng,
      //       location.coordinates.lat,
      //       location.coordinates.lng
      //     );
      //     console.log(distance)
      //     return distance <= 1; // Lấy các điểm trong bán kính 1km
      //   });
      //  }else{
      //    if(btnSearch.value == 'b1s'){
      //      searchStatus1(btnSearch.value)
      //    }else if(btnSearch.value == 'b2s'){
      //      searchStatus2(btnSearch.value)
      //    }else if(btnSearch.value == 'b3s'){
      //      searchStatus3(btnSearch.value)
      //    }else if(btnSearch.value == 'b4s'){
      //      searchStatus4(btnSearch.value)
      //    }else if(btnSearch.value == 'b5s'){
      //      searchStatus5(btnSearch.value)
      //    }
      //  }
          
    }
  }

  const zoomData = (data) => {
    mapCenter.value = data
    // mapCenter.value.lng = TaiNanCenter.value[0].coordinates.lng
    zoomLevel.value = 13
  }
const imageStatus = ref({
  status0: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
  status1: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  status1s: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
  status2: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
  status3: 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png',

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
    const res = searchData == "" ? await axios.get(hostName + `/api/TrafficEquipment/FindAll?page=${pageData}&pageSize=${pageSize.value}`, getToken())
    : await axios.get(hostName + `/api/TrafficEquipment/FindAll?name=${searchData}&page=${pageData}&pageSize=${pageSize.value}`, getToken())

    if(res.data.success){
        dataLoadStart.value = res.data.content.data.map(m => ({
            ...m,
            coordinates: { lat: m.latitude, lng: m.longitude }
        }))

        mapCenter.value = {lat: mapRefs.value.$mapObject.getCenter().lat(), lng: mapRefs.value.$mapObject.getCenter().lng()}
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
// const showImage = (image) => {
//   selectedImage.value = image; // Hiển thị ảnh khi click
// };
const closeImage = () => {
  selectedImage.value = null; // Đóng popup khi click ngoài
};
const marker1 = ref({
    url: images.value[0],
    scaledSize: { width: 40, height: 40 }
});

const searchStatus1 = async (classData) => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  if(btnSearch.value != null)
    document.querySelector("." + btnSearch.value).style.backgroundColor = 'white'
    
  document.querySelector("." + classData).style.backgroundColor = '#FF8C00'

  btnSearch.value = classData

  const res = await axios.get(hostName + '/api/TrafficEquipment/FindAllErrorCode1?page=1&pageSize=20000', getToken())
  if(res.data.success){
    locations.value = res.data.content.data.map(m => ({
            ...m,
            coordinates: { lat: m.latitude, lng: m.longitude }
        }))

        if(zoomLevel.value < 13)
            zoomLevel.value = 13
        isPhanTrang.value = false
  }
  
  // routePath.value = []
  // routeDistance.value = null
  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";

  return locations.value
}

const searchStatus2 = async (classData) => {
  if(btnSearch.value != null)
    document.querySelector("." + btnSearch.value).style.backgroundColor = 'white'
    
  document.querySelector("." + classData).style.backgroundColor = '#FF8C00'

  btnSearch.value = classData
  const res = await axios.get(hostName + '/api/TrafficEquipment/FindAllErrorCode2?page=1&pageSize=20000', getToken())
  if(res.data.success){
    locations.value = res.data.content.data.map(m => ({
            ...m,
            coordinates: { lat: m.latitude, lng: m.longitude }
        }))

        if(zoomLevel.value < 13)
            zoomLevel.value = 13
        isPhanTrang.value = false
  }
  // routePath.value = []
  // routeDistance.value = null
  return locations.value
}

const searchStatus3 = async (classData) => {
  if(btnSearch.value != null)
    document.querySelector("." + btnSearch.value).style.backgroundColor = 'white'
    
  document.querySelector("." + classData).style.backgroundColor = '#FF8C00'

  btnSearch.value = classData

  const res = await axios.get(hostName + '/api/TrafficEquipment/FindAllErrorCode3?page=1&pageSize=20000', getToken())
  if(res.data.success){
    locations.value = res.data.content.data.map(m => ({
            ...m,
            coordinates: { lat: m.latitude, lng: m.longitude }
        }))

        if(zoomLevel.value < 13)
            zoomLevel.value = 13
        isPhanTrang.value = false
  }
  // routePath.value = []
  // routeDistance.value = null
  return locations.value
}

const searchStatus5 = async (classData) => {
  isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

  if(btnSearch.value != null)
    document.querySelector("." + btnSearch.value).style.backgroundColor = 'white'
    
  document.querySelector("." + classData).style.backgroundColor = '#FF8C00'

  btnSearch.value = classData

  const res = await axios.get(hostName + '/api/TrafficEquipment/FindAllErrorCode0?page=1&pageSize=20000', getToken())
  if(res.data.success){
    locations.value = res.data.content.data.map(m => ({
            ...m,
            coordinates: { lat: m.latitude, lng: m.longitude }
        }))

        if(zoomLevel.value < 13)
            zoomLevel.value = 13
        isPhanTrang.value = false
  }
  
  // routePath.value = []
  // routeDistance.value = null

  isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
  return locations.value
}

const searchStatus4 = (classData) => {
  if(btnSearch.value != null)
    document.querySelector("." + btnSearch.value).style.backgroundColor = 'white'
    
  document.querySelector("." + classData).style.backgroundColor = '#FF8C00'

  btnSearch.value = classData

  if(pageSize.value >= 500){
    mapCenter.value = {lat: mapRefs.value.$mapObject.getCenter().lat(), lng: mapRefs.value.$mapObject.getCenter().lng()}
        locations.value = dataLoadStart.value.filter((location) => {
          const distance = getDistance(
            mapCenter.value.lat,
            mapCenter.value.lng,
            location.coordinates.lat,
            location.coordinates.lng
          );
          console.log(distance)
          return distance <= 1 && location.isError === false; // Lấy các điểm trong bán kính 1km
        });
  }else{
    
        locations.value = dataLoadStart.value.filter((location) => location.isError === false);
  }

  isPhanTrang.value = false
  
  // routePath.value = []
  // routeDistance.value = null
  return locations.value
}

const AllData = () => {
  mapCenter.value = {lat: mapRefs.value.$mapObject.getCenter().lat(), lng: mapRefs.value.$mapObject.getCenter().lng()}
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
  if(btnSearch.value != null)
    document.querySelector("." + btnSearch.value).style.backgroundColor = 'white'

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
const showInfo = (index) => {
  classBtnOld.value = null
  selectedMarker.value = index;
};

const clickDataLocation = (location, type, classData) => {
    selectedLocation.value = location
    selectedTransport.value = type

    if(classBtnOld.value != null)
        document.querySelector("." + classBtnOld.value).style.backgroundColor = 'white'
    
    document.querySelector("." + classData).style.backgroundColor = 'yellow'

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
  
  const searchHomeData = async () => {
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
  const searchLocation = async () => {
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
  
  });

  onUnmounted(() => {
    // clearInterval(intervalId.value)
    console.log("Hello World")
  })
  </script>


<style>
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
</style>

  <style scoped>

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
  position: absolute;
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

  