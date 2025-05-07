<template>
     <div v-if="zoomLevel >= 13">
        <div v-for="(location, index) in props.locations" :key="index" :ref="el => props.setItemRef(location.id, index, el)">
        <div v-if="location.isError">
          <div v-if="location.statusError == 1" :class="['div_' + location.id + '_' + index, ' div0']" @click="props.showDataMap(location.coordinates, location)" :style="{
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
              <button @click="showDataChons('status_' + location.id + '_' + index, 'div_' + location.id + '_' + index, 'divchu_' + location.id + '_' + index, 'details_' + location.id + '_' + index, location)" style="padding: 5px 10px; font-size: 10px; border-radius: 10px; background-color: #d9d9d9; color: black;">故障通報</button>
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
      :class="['square', ' display_' + location.id + '_' + index, ' displaynone']"
      style="padding: 5px;"
    >
    <div style="text-align: left;">
      <i @click="props.showBoxSearch('status_' + location.id + '_' + index, 'display_' + location.id + '_' + index, 'huy')" class="fa fa-window-close-o" aria-hidden="true"></i>
      </div>
    
      <div>
        <div v-for="(item, index) in dataSearchUserName" :key="index" style="margin: 10px 20px;">
          <div @click="props.updateUser(location.repaiDetail_id, item.id, 'status_' + location.id + '_' + index, 'displaynone')" style="display: flex;">
            <p style="font-size: 12px; font-weight: bold;">Name: {{ item.name }}</p>
            <p style="font-size: 12px; margin: 0 15px; font-weight: bold;">Job: {{ item.total }}</p>
            </div>
          </div>
        </div>
    </div>
                    </div>
                    <div>
                      <button @click="props.showBoxSearch('status_' + location.id + '_' + index, 'display_' + location.id + '_' + index, 'on')" style="background-color: transparent; border: none; outline: none; font-size: 20px;"><i class="fa fa-check-square-o" aria-hidden="true"></i></button>
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
                          <img @click="props.showImage(image)" v-if="image != null && props.getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && props.getFileType(image) === 'video'" @click="props.showImage(image)">
                                  <video
                                @click="props.showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && props.getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (props.getFileType(image) === 'word'  || props.getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
            <div>
              
              </div>
              </div>

              <div v-if="location.totalUpdate > 0" :class="['details_' + location.id + '_' + index, ' details0']" style="transform: scale(0); text-align: left; height: 0;">
            <div>
              <p style="font-size: 12px; font-weight: bold;">Last modified date: <strong>{{props.fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px; font-weight: bold;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px; font-weight: bold;">Account: {{ location.account_userUpdate }}</p>
              </div>
            </div>
              <div style="display: flex; border-top: 1px dashed grey; margin-top: 15px;">
                <div style="width: 33.33%;">
              <button :class="'s1' + location.id" @click="props.clickDataLocation(location, 'driving-car', 's1' + location.id)" style="outline: none; background: transparent; cursor: pointer; text-decoration: underline; border: none;">規劃路徑</button>
              </div>
              <div style="width: 33.33%;">
                <button @click="props.clickDataShowTable(location.repaiDetail_id)" style="outline: none; background: transparent; cursor: pointer; border: none;">後台管理</button>
                </div>

                <div style="width: 33.33%;">
                  <button style="outline: none; background: transparent; cursor: pointer; border: none;"> <p v-if="location.totalUpdate > 0" style="text-decoration: underline; cursor: pointer;" @click="props.showDetailsDiv('details_' + location.id + '_' + index, 'div_' + location.id + '_' + index, location)">顯示詳細資料</p></button>
                </div>
                </div>
              
          </div>
          </div>
          
          <div v-if="location.statusError == 2"  :class="['div1_' + location.id + '_' + index, ' div1']" @click="props.showDataMap(location.coordinates, location)" :style="{
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
              <button @click="props.showDataChon('status1_' + location.id + '_' + index, 'div1_' + location.id + '_' + index, 'divchu1_' + location.id + '_' + index, 'details1_' + location.id + '_' + index, location)" style="padding: 5px 10px; font-size: 10px; border-radius: 10px; background-color: red; color: white;">故障確認</button>
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
                          <img @click="props.showImage(image)" v-if="image != null && props.getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && props.getFileType(image) === 'video'" @click="props.showImage(image)">
                                  <video
                                @click="props.showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && props.getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (props.getFileType(image) === 'word'  || props.getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
            <div>
              
              </div>
              </div>
              <div v-if="location.totalUpdate > 0" :class="['details1_' + location.id + '_' + index, ' details1']" style="transform: scale(0); text-align: left; height: 0;">
            <div>
              <p style="font-size: 12px; font-weight: bold;">Last modified date: <strong>{{props.fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px; font-weight: bold;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px; font-weight: bold;">Account: {{ location.account_userUpdate }}</p>
              </div>
            </div>
              <div style="display: flex; border-top: 1px dashed grey; margin-top: 15px;">
                <div style="width: 33.33%;">
              <button :class="'s1' + location.id" @click="props.clickDataLocation(location, 'driving-car', 's1' + location.id)" style="outline: none; background: transparent; cursor: pointer; text-decoration: underline; border: none;">規劃路徑</button>
              </div>
              <div style="width: 33.33%;">
                <button @click="props.clickDataShowTable(location.repaiDetail_id)" style="outline: none; background: transparent; cursor: pointer; border: none;">後台管理</button>
                </div>

                <div style="width: 33.33%;">
                  <button style="outline: none; background: transparent; cursor: pointer; border: none;"> <p v-if="location.totalUpdate > 0" style="text-decoration: underline; cursor: pointer;" @click="props.showDetailsDiv('details1_' + location.id + '_' + index, 'div1_' + location.id + '_' + index, location)">顯示詳細資料</p></button>
                </div>
                </div>
              
          </div>
          
          </div>

          <div v-if="location.statusError == 3" :class="['div2_' + location.id + '_' + index, ' div2']" @click="props.showDataMap(location.coordinates, location)" :style="{
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
              <button @click="props.showDataChon('status2_' + location.id + '_' + index, 'div2_' + location.id + '_' + index, 'divchu2_' + location.id + '_' + index, 'details2_' + location.id + '_' + index, location)" style="padding: 5px 10px; font-size: 10px; border-radius: 10px; background-color: yellow; color: black;">維修中</button>
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
                          <img @click="props.showImage(image)" v-if="image != null && props.getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && props.getFileType(image) === 'video'" @click="props.showImage(image)">
                                  <video
                                @click="props.showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && props.getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (props.getFileType(image) === 'word'  || props.getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
            <div>
              
              </div>
              </div>

              <div v-if="location.totalUpdate > 0" :class="['details2_' + location.id + '_' + index, ' details2']" style="transform: scale(0); text-align: left; height: 0;">
            <div>
              <p style="font-size: 12px; font-weight: bold;">Last modified date: <strong>{{props.fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px; font-weight: bold;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px; font-weight: bold;">Account: {{ location.account_userUpdate }}</p>
              </div>
            </div>
              <div style="display: flex; border-top: 1px dashed grey; margin-top: 15px;">
                <div style="width: 33.33%;">
              <button :class="'s1' + location.id" @click="props.clickDataLocation(location, 'driving-car', 's1' + location.id)" style="outline: none; background: transparent; cursor: pointer; text-decoration: underline; border: none;">規劃路徑</button>
              </div>
              <div style="width: 33.33%;">
                <button @click="props.clickDataShowTable(location.repaiDetail_id)" style="outline: none; background: transparent; cursor: pointer; border: none;">後台管理</button>
                </div>

                <div style="width: 33.33%;">
                  <button style="outline: none; background: transparent; cursor: pointer; border: none;"> <p v-if="location.totalUpdate > 0" style="text-decoration: underline; cursor: pointer;" @click="props.showDetailsDiv('details2_' + location.id + '_' + index, 'div2_' + location.id + '_' + index, location)">顯示詳細資料</p></button>
                </div>
                </div>
              
          </div>
          
          </div>

          <div v-if="location.statusError == 4" :class="['div3_' + location.id + '_' + index, ' div3']" @click="props.showDataMap(location.coordinates, location)" :style="{
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
              <button @click="props.showDataChon('status3_' + location.id + '_' + index, 'div3_' + location.id + '_' + index, 'divchu3_' + location.id + '_' + index, 'details3_' + location.id + '_' + index, location)" style="padding: 5px 10px; font-size: 10px; border-radius: 10px; background-color: #7FFF00; color: black;">維修完成</button>
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
                          <img @click="props.showImage(image)" v-if="image != null && props.getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && props.getFileType(image) === 'video'" @click="props.showImage(image)">
                                  <video
                                @click="props.showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && props.getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (props.getFileType(image) === 'word'  || props.getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
            <div>
              
              </div>
              </div>

              <div v-if="location.totalUpdate > 0" :class="['details3_' + location.id + '_' + index, ' details3']" style="transform: scale(0); text-align: left; height: 0;">
            <div>
              <p style="font-size: 12px; font-weight: bold;">Last modified date: <strong>{{props.fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px; font-weight: bold;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px; font-weight: bold;">Account: {{ location.account_userUpdate }}</p>
              </div>
            </div>
              <div style="display: flex; border-top: 1px dashed grey; margin-top: 15px;">
                <div style="width: 33.33%;">
              <button :class="'s1' + location.id" @click="props.clickDataLocation(location, 'driving-car', 's1' + location.id)" style="outline: none; background: transparent; cursor: pointer; text-decoration: underline; border: none;">規劃路徑</button>
              </div>
              <div style="width: 33.33%;">
                <button @click="props.clickDataUpdate(location.id)" style="outline: none; background: transparent; cursor: pointer; border: none;">後台管理</button>
                </div>

                <div style="width: 33.33%;">
                  <button style="outline: none; background: transparent; cursor: pointer; border: none;"> <p v-if="location.totalUpdate > 0" style="text-decoration: underline; cursor: pointer;" @click="props.showDetailsDiv('details3_' + location.id + '_' + index, 'div3_' + location.id + '_' + index, location)">顯示詳細資料</p></button>
                </div>
                </div>
              
          </div>
          
          </div>
        </div>
        <div v-else>
          <div :class="['div4_' + location.id + '_' + index, ' div4']" @click="props.showDataMap(location.coordinates, location)" :style="{
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
              <button @click="props.showDataChon('status4_' + location.id + '_' + index, 'div4_' + location.id + '_' + index, 'divchu4_' + location.id + '_' + index, 'details4_' + location.id + '_' + index, location)" style="padding: 5px 10px; font-size: 10px; border-radius: 10px; background-color: #7FFF00; color: black;">正常</button>
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
                          <img @click="props.showImage(image)" v-if="image != null && props.getFileType(image) === 'image'" style="width: 30px; height: 30px; border-radius: 50%;" :src="image" alt="">
                                <div v-if="image != null && props.getFileType(image) === 'video'" @click="props.showImage(image)">
                                  <video
                                @click="props.showImage(image)"
                                    autoplay
                                    muted
                                    loop
                                    style="width: 30px; height: 30px; border-radius: 50%; transition: all 0.3s ease;"
                                    :src="image"
                                  />
                                </div>
                                <iframe v-else-if="image != null && props.getFileType(image) === 'pdf'" :src="image" width="100%" height="300px"></iframe>
                                <a v-else-if="image != null && (props.getFileType(image) === 'word'  || props.getFileType(image) === 'excel') " :href="image" target="_blank">Tải xuống: {{ item }}</a>
                          </div>
                        
                      </div>
            <div>
              
              </div>
              </div>

              <div v-if="location.totalUpdate > 0" :class="['details4_' + location.id + '_' + index, ' details4']" style="transform: scale(0); text-align: left; height: 0;">
            <div>
              <p style="font-size: 12px; font-weight: bold;">Last modified date: <strong>{{props.fomatDate(location.dateUpdate) }}</strong></p>
            <p style="font-size: 12px; font-weight: bold;" v-if="location.statusErrorUpdate == 0">Code Error: 號誌正常</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 1">Code Error: 號誌設備故障</p>
            <p style="font-size: 12px; font-weight: bold;" v-else-if="location.statusErrorUpdate == 2">Code Error: 號誌停電</p>
            <p style="font-size: 12px; font-weight: bold;">Account: {{ location.account_userUpdate }}</p>
              </div>
            </div>
              <div style="display: flex; border-top: 1px dashed grey; margin-top: 15px;">
                <div style="width: 33.33%;">
              <button :class="'s1' + location.id" @click="props.clickDataLocation(location, 'driving-car', 's1' + location.id)" style="outline: none; background: transparent; cursor: pointer; text-decoration: underline; border: none;">規劃路徑</button>
              </div>
              <div style="width: 33.33%;">
                <button @click="clickDataUpdates(location.id)" style="outline: none; background: transparent; cursor: pointer; border: none;">後台管理</button>
                </div>

                <div style="width: 33.33%;">
                  <button style="outline: none; background: transparent; cursor: pointer; border: none;"> <p v-if="location.totalUpdate > 0" style="text-decoration: underline; cursor: pointer;" @click="props.showDetailsDiv('details3_' + location.id + '_' + index, 'div3_' + location.id + '_' + index, location)">顯示詳細資料</p></button>
                </div>
                </div>
              
          </div>
          </div>
          </div>
        
      </div>
      </div>

</template>

<script setup>
import {  defineProps } from 'vue';
const props = defineProps({
  locations: {
        type: Array,
        required: true
    },
    zoomLevel: {
        type: Boolean,
        required: true
    },
    getFileType: {
      type: Function,
      required: true
    },
    setItemRef:{
      type: Function,
      required: true
    },
    showDataChon: {
      type: Function,
      required: true
    },
    clickDataLocation: {
      type: Function,
      required: true
    },
    clickDataShowTable: {
      type: Function,
      required: true
    },
    updateUser: {
      type: Function,
      required: true
    },
    showBoxSearch: {
      type: Function,
      required: true
    },
    showImage: {
      type: Function,
      required: true
    },
    showDataMap: {
      type: Function,
      required: true
    },
    clickDataUpdate: {
      type: Function,
      required: true
    },
    fomatDate: {
      type: Function,
      required: true
    },
    showDetailsDiv: {
      type: Function,
      required: true
    }
})

const showDataChons = (classData, classDiv, classChu, divcon, location) => {
  props.showDataChon(classData, classDiv, classChu, divcon, location)
}
const clickDataUpdates = (id) => {
  props.showDataChon(id)
}
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

