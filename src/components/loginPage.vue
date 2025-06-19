<template>
    <body style="background-color: #666666; margin-top: -80px;">
	<div class="limiter">
		<div class="container-login100">
			<div class="wrap-login100">
				<form class="login100-form validate-form">
					<span class="login100-form-title p-b-43">
						請登入 交通號誌維修管理系統
					</span>
					
					
					<div class="wrap-input100 validate-input" data-validate = "Valid email is required: ex@abc.xyz">
						<input class="input100" type="text" v-model="LoginModel.name">
						<span class="focus-input100"></span>
						<span class="label-input100">帳號</span>
					</div>
					
					
					<div class="wrap-input100 validate-input" data-validate="Password is required">
						<input class="input100" type="password" v-model="LoginModel.password" name="pass">
						<span class="focus-input100"></span>
						<span class="label-input100">密碼</span>
					</div>

					<div class="flex-sb-m w-full p-t-3 p-b-32">
						<div class="contact100-form-checkbox">
							<input class="input-checkbox100" id="ckb1" type="checkbox" name="remember-me">
							<label class="label-checkbox100" for="ckb1">
								記住我的帳號
							</label>
						</div>

						<div>
							<a href="#" class="txt1">
								忘記密碼
							</a>
						</div>
					</div>
			

					<div class="container-login100-form-btn">
						<button class="login100-form-btn" type="button" v-on:click="login">
							登入
						</button>
					</div>
					
					<!-- <div class="text-center p-t-46 p-b-20">
						<span class="txt2">
							or sign up using
						</span>
					</div>

					<div class="login100-form-social flex-c-m">
						<a href="#" class="login100-form-social-item flex-c-m bg1 m-r-5">
							<i class="fa fa-facebook-f" aria-hidden="true"></i>
						</a>

						<a href="#" class="login100-form-social-item flex-c-m bg2 m-r-5">
							<i class="fa fa-twitter" aria-hidden="true"></i>
						</a>
					</div> -->
				</form>

				<div class="login100-more" >
				</div>
			</div>
		</div>
	</div>

	<div v-if="isLoading" class="loading-overlay">
      <div class="spinner"></div>
      <p>載入中......</p>
    </div>
</body>
</template>

<script setup>
import axios from 'axios';
  import {useRouter} from 'vue-router'
  import {useToast} from 'vue-toastification'
    import { useCounterStore } from "../store";
  import {ref, getCurrentInstance  } from 'vue'

  const LoginModel = ref({
    name: "",
    password: ""
  })

  const isLoading = ref(false)

  const router = useRouter()
  const Toast = useToast()

  const {proxy} = getCurrentInstance()
  const hostName = proxy?.hostname
  const login = async () => {
    isLoading.value = true;
  document.body.classList.add("loading"); // Add Lớp "loading"
  document.body.style.overflow = "hidden";

    const res = await axios.post(hostName  + "/api/User/Login", LoginModel.value)
    if(res.data.success){
      isLoading.value = false
      document.body.classList.remove('loading') // Xóa Lớp "loading"
      const DataToken = useCounterStore()
      DataToken.clearStore()
    //   Toast.success("Đăng nhập thành công")
      DataToken.setToken(res.data.content.token)
      DataToken.setRole(res.data.content.role)
      DataToken.setIdAccount(res.data.content.id)
      DataToken.setAccountImage(res.data.content.image)
      DataToken.setAccountName(res.data.content.username)
      router.push("/")
    }else{
      isLoading.value = false
      document.body.classList.remove('loading') // Xóa Lớp "loading"
      Toast.error("Tài khoản không chính xác", {
        timeout: 3000
      })
    }

	isLoading.value = false;
  document.body.classList.remove("loading");
  document.body.style.overflow = "auto";
  }
</script>

<style scoped>
.login100-more::before{
    position: absolute;
    width: 100%;
    height: 100%;
    background-image: url('../assets/LoginTemplate/images/Bg2.jpg');
    background-size: cover;
    background-repeat: no-repeat;
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
</style>