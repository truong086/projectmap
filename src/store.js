import { defineStore } from 'pinia';

// Định nghĩa store "counter"
export const useCounterStore = defineStore('counter', {
  // State lưu trữ dữ liệu
  state: () => ({
    count: 0,
    token: "",
    role: [],
    StatisticsList: [],
    id_category: null,
    emailotp: "",
    floorId: {},
    id_account: 0,
    account_name: '',
    account_image: '',
    typeData: '',
    checkStatictisData: [],
    checkStatictisAccount: [],
    dataAccountByProduct: [],
    checkStatictisTotalProduct: [],
    dataTotalProduct: [],

    checkStatictisTotalProductByCustomer: [],
    dataTotalProductByCustomer: [],

    checkStatictisTotalProductDelivenote: [],
    dataTotalProductDelivenote: [],

    checkStatictisTotalProductSupplier: [],
    dataTotalProductSupplier: []
  }),

  // Getters (giống computed)
  getters: {
    doubleCount: (state) => state.count * 2,
    getToken: (state) => state.token,
    getRole: (state) => (index) => {
      return state.role[index]
    },
    getCategory: (state) => state.id_category,
    getEmailOtp: (state) => state.emailotp,
    getFloorId: (state) => state.floorId,
    getIdAccount: (state) => state.id_account,
    getIdAccountName: (state) => state.account_name,
    getIdAccountImage: (state) => state.account_image,
    getStatistic: (state) => state.StatisticsList,
    getCheck: (state) => state.checkStatictisData,
    getCheckStatictisAccount: (state) => state.checkStatictisAccount,
    getDataAccountByProduct: (state) => state.dataAccountByProduct,
    getCheckStatictisTotalProduct: (state) => state.checkStatictisTotalProduct,
    getDataTotalProduct: (state) => state.dataTotalProduct,

    getCheckStatictisTotalProductByCustomer: (state) => state.checkStatictisTotalProductByCustomer,
    getDataTotalProductByCustomer: (state) => state.dataTotalProductByCustomer,

    getcheckStatictisTotalProductDelivenote: (state) => state.checkStatictisTotalProductDelivenote,
    getdataTotalProductDelivenote: (state) => state.dataTotalProductDelivenote,

    getcheckStatictisTotalProductSupplier: (state) => state.checkStatictisTotalProductSupplier,
    getdataTotalProductSupplier: (state) => state.dataTotalProductSupplier,
    getTypeData: (state) => state.typeData,
  },

  // Actions (giống methods)
  actions: {
    setDataAccountByProduct(item){
      this.dataAccountByProduct.push(item)
    },
    setTypeDatas(item){
      this.typeData = item
    },
    setCheckStatictisAccount(item){
      this.checkStatictisAccount.push(item)
    },
    setdataTotalProductSupplier(item){
      this.dataTotalProductSupplier.push(item)
    },
    setcheckStatictisTotalProductSupplier(item){
      this.checkStatictisTotalProductSupplier.push(item)
    },
    setdataTotalProductDelivenote(item){
      this.dataTotalProductDelivenote.push(item)
    },
    setcheckStatictisTotalProductDelivenote(item){
      this.checkStatictisTotalProductDelivenote.push(item)
    },
    setDataTotalProductByCustomer(item){
      this.dataTotalProductByCustomer.push(item)
    },
    setCheckStatictisTotalProductByCustomer(item){
      this.checkStatictisTotalProductByCustomer.push(item)
    },
    setDataTotalProduct(item){
      this.dataTotalProduct.push(item)
    },
    setCheckStatictisTotalProduct(item){
      this.checkStatictisTotalProduct.push(item)
    },
    clearcheckStatictisTotalProductSupplier(){
      this.checkStatictisTotalProductSupplier = []
    },
    cleardataTotalProductSupplier(){
      this.dataTotalProductSupplier = []
    },
    clearcheckStatictisTotalProductDelivenote(){
      this.checkStatictisTotalProductDelivenote = []
    },
    cleardataTotalProductDelivenote(){
      this.dataTotalProductDelivenote = []
    },
    clearCheckStatictisTotalProductByCustomer(){
      this.CheckStatictisTotalProductByCustomer = []
    },
    clearDataAccountByProductByCustomer(){
      this.dataAccountByProductByCustomer = []
    },
    clearDataTotalProduct(){
      this.dataTotalProduct = []
    },
    clearCheckStatictisTotalProduct(){
      this.CheckStatictisTotalProduct = []
    },
    clearDataAccountByProduct(){
      this.dataAccountByProduct = []
    },
    
    clearCheckStatictisAccount(){
      this.checkStatictisAccount = []
    },
    
    setAccountName(item){
      this.account_name = item
    },
    setCheck(item){
      this.checkStatictisData.push(item)
    },
    setStatistic(item){
      this.StatisticsList.push(item)
    },
    updateQuantity(id, quantity){
      const statistic = this.StatisticsList.find(x => x.month === id)
      if(statistic){
        statistic.sales = quantity
      }
    },
    clearStatistic(){
      this.StatisticsList = []
    },
    clearCheck(){
      this.checkStatictisData = []
    },
    setAccountImage(item){
      this.account_image = item
    },
    setIdAccount(item){
      this.id_account = item
    },
    increment() {
      this.count++;
    },
    decrement() {
      this.count--;
    },
    setToken(item){
      this.token = item
    },
    setRole(item){
      this.role.push(item)
    },
    setCategory(item){
      this.id_category = item
    },
    setEmailOtp(item){
      this.emailotp = item
    },
    setFloorId(item){
      this.floorId = item
    },
    clearStore(){
      this.role = []
      this.typeData = ""
      this.token = ""
      this.$reset
      localStorage.clear()
    }
  },
  
  persist: true,
  
});