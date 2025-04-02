import { createRouter, createWebHistory } from "vue-router";

import LoginPage from "./components/loginPage.vue";
import mapdataPages from "./components/mapdataPage.vue";
import testAPIMapPages from "./components/testAPIMapPage.vue";
import AdminPage from "./components/AdminPage/indexPage.vue";
import dashboardPages from "./components/AdminPage/dashboardPage.vue";
import tablePages from "./components/AdminPage/tablePage.vue";
import fromelementPages from "./components/AdminPage/fromelementPage.vue";

import { useCounterStore } from "./store";
// import { path } from "ramda";
// import { compose } from "ramda";

const routes = [
  {
    path: "/login",
    name: "Login",
    component: LoginPage, // Đăng ký trang đăng nhập
    meta: {
      css: [
        "/LoginTemplate/images/icons/favicon.ico",
        "/LoginTemplate/vendor/bootstrap/css/bootstrap.min.css",
        "/LoginTemplate/fonts/font-awesome-4.7.0/css/font-awesome.min.css",
        "/LoginTemplate/fonts/Linearicons-Free-v1.0.0/icon-font.min.css",
        "/LoginTemplate/vendor/animate/animate.css",
        "/LoginTemplate/vendor/css-hamburgers/hamburgers.min.css",
        "/LoginTemplate/vendor/animsition/css/animsition.min.css",
        "/LoginTemplate/vendor/select2/select2.min.css",
        "/LoginTemplate/vendor/daterangepicker/daterangepicker.css",
        "/LoginTemplate/css/util.css",
        "/LoginTemplate/css/main.css"
      ],
      js: [
        "/LoginTemplate/vendor/jquery/jquery-3.2.1.min.js",
        "/LoginTemplate/vendor/animsition/js/animsition.min.js",
        "/LoginTemplate/vendor/bootstrap/js/popper.js",
        "/LoginTemplate/vendor/bootstrap/js/bootstrap.min.js",
        "/LoginTemplate/vendor/select2/select2.min.js",
        "/LoginTemplate/vendor/daterangepicker/moment.min.js",
        "/LoginTemplate/vendor/daterangepicker/daterangepicker.js",
        "/LoginTemplate/vendor/countdowntime/countdowntime.js",
        "/LoginTemplate/js/main.js"
      ],
    },
  },

  {
    path: "/Admin",
    name: "admin",
    component: AdminPage,
    meta: {
      css: [
        "/AdminTemplate/assets/vendors/mdi/css/materialdesignicons.min.css",
        "/AdminTemplate/assets/vendors/css/vendor.bundle.base.css",
        "/AdminTemplate/assets/vendors/jvectormap/jquery-jvectormap.css",
        "/AdminTemplate/assets/vendors/flag-icon-css/css/flag-icon.min.css",
        "/AdminTemplate/assets/vendors/owl-carousel-2/owl.carousel.min.css",
        "/AdminTemplate/assets/vendors/owl-carousel-2/owl.theme.default.min.css",
        "/AdminTemplate/assets/css/style.css",
        "/AdminTemplate/assets/images/favicon.png"
      ],
      js: [
        "/AdminTemplate/assets/vendors/js/vendor.bundle.base.js",
        "/AdminTemplate/assets/vendors/chart.js/Chart.min.js",
        "/AdminTemplate/assets/vendors/progressbar.js/progressbar.min.js",
        "/AdminTemplate/assets/vendors/jvectormap/jquery-jvectormap.min.js",
        "/AdminTemplate/assets/vendors/jvectormap/jquery-jvectormap-world-mill-en.js",
        "/AdminTemplate/assets/vendors/owl-carousel-2/owl.carousel.min.js",
        "/AdminTemplate/assets/js/jquery.cookie.js",
        "/AdminTemplate/assets/js/off-canvas.js",
        "/AdminTemplate/assets/js/hoverable-collapse.js",
        "/AdminTemplate/assets/js/misc.js",
        "/AdminTemplate/assets/js/settings.js",
        "/AdminTemplate/assets/js/todolist.js",
        "/AdminTemplate/assets/js/dashboard.js"
      ],
      requiresAuth: true, roleAdmin: ['Admin']
    },
    children: [
      {
        path: "dashboardPages",
        name: "DashboardPages",
        component: dashboardPages,
      },
      {
        path: "tablePages",
        name: "TablePages",
        component: tablePages,
      },
      {
        path: "fromelementPages",
        name: "FromelementPages",
        component: fromelementPages,
      }
    ],
  },

  {
    path: "/",
    alias: ["/home"],
    name: "home",
    component: mapdataPages, // Đăng ký trang đăng nhập
    meta: {
        requiresAuth: true, roleAdmin: ['Admin']
      }
  },
  {
    path: "/test",
    name: "Test",
    component: testAPIMapPages // Đăng ký trang đăng nhập
  }
  
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

function loadBootstrap(to) {
  // Load CSS
  const cssFiles = to.meta.css || [];
  cssFiles.forEach((css) => {
    if (!document.querySelector(`link[href="${css}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = css;
      document.head.appendChild(link);
    }
  });

  // Load JS
  const jsFiles = to.meta.js || [];
  jsFiles.forEach((js) => {
    if (!document.querySelector(`script[src="${js}"]`)) {
      const script = document.createElement("script");
      script.src = js;
      script.async = false;
      document.body.appendChild(script);
    }
  });
}

router.afterEach((to) => {
  loadBootstrap(to);
});

router.beforeEach((to, from, next) => {
  loadBootstrap(to);
  const counter = useCounterStore();
  const paths = ["/login"];

  const checkPaths = !paths.includes(to.path);

  const auth = to.meta.requiresAuth;
  const roles = to.meta.roleAdmin;
  const token = counter.getToken;
  const role = counter.getRole(0) || '';

  if (checkPaths && token) {
    next();
  }
  if (auth && !token) {
    next("/login");
  } else if (auth && token) {
    if (!roles || roles.includes(role)) {
      next();
    } else {
      next("/login");
    }
  } else {
    next();
  }
  if (paths) {
    next("/login");
  } else {
    next();
  }
});

export default router;
