import Cookies from 'js-cookie'
// import qs from 'qs'
export default {
  data () {
    /* eslint-disable */
    return {
      // 设置属性
      mixinViewModuleOptions: {
        activatedIsNeed: true, // 此页面是否在激活（进入）时，调用查询数据列表接口？
        getDataListURL: '', // 数据列表接口，API地址
        addOrUpdateURL: '', // 添加或修改接口，API地址
        getDataInfoURL: '', // 数据详情，API地址
        deleteURL: '', // 删除接口，API地址
        deleteIsBatch: true, // 删除接口，是否需要批量？
        deleteIsBatchKey: 'id', // 删除接口，批量状态下由那个key进行标记操作？比如：pid，uid... 或者在拼接url参数时 比如：id=2&pid=3
        exportURL: '' // 导出接口，API地址
      },
      // 默认属性
      errorPromise: Promise.resolve({ // 前端默认错误信息返回
        code: -1
      }),
      dataForm: {}, // 查询条件
      Initialization: {},
      dataList: [], // 数据列表
      order: '', // 排序，asc／desc
      orderField: '', // 排序，字段
      page: 1, // 当前页码s
      pageSize: 10, // 每页数
      total: 0, // 总条数
      dataListLoading: false, // 数据列表，loading状态
      dataListSelections: [], // 数据列表，多选项
    }
    /* eslint-enable */
  },
  activated () {
    if (this.mixinViewModuleOptions.activatedIsNeed) {
      this.getDataList()
    }
  },
  methods: {
    // 查询后进行数据刷新
    async getPageInit (url) {
      url = url || ''
      this.page = 1
      const res = await this.getDataList({
        url
      })
      return res
    },
    /**
     * @method: getDataList
     * @desc: 获取数据列表
     * @param {String} url  自定义api参数
     * @param {Boolean} isLoading  是否显示loading  默认为true
     * @param {Object} paramData  自定义的params参数
     * @return: Promise函数
     */
    async getDataList ({
      url = '',
      isLoading = true,
      paramData = null
    } = {}) {
      // isLoading = isLoading || true
      let isError = false // 请求是否异常
      const apiURL = url || this.mixinViewModuleOptions.getDataListURL

      if (!apiURL && apiURL === '') {
        return this.errorPromise
      }

      let pageObj = {}

      if (paramData === null) {
        paramData = this.dataForm
        pageObj.page = this.page
        pageObj.pageSize = this.pageSize
      }
      this.dataListLoading = isLoading
      let obj = {}
      let order = this.order === 'desc' ? 'DESC' : 'ESC'
      if (this.orderField !== '') {
        obj[`OB_${this.orderField}`] = order
      }
      return
      const data = await this.$http.get(
        apiURL,
        {
          params:
          {
            ...obj,
            ...pageObj,
            ...paramData
          }
        }
      ).catch((e) => {
        isError = true
      })

      if (isLoading) {
        this.dataListLoading = false
      }
      // 后台不存在的api
      if (isError) {
        if (process.env.VUE_APP_NODE_ENV === 'dev') {
          this.$message.error('请检查你的URL是否正确，系统中没有可用于处理该URL的方法！')
        }
        return this.errorPromise
      }
      const res = data.data
      // this.total = 0
      if (res.code !== 0) {
        this.dataList = []
        if (res.code === 500) {
          this.$message.error('请求异常,请稍后再试')
          console.log(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        return this.errorPromise
      }
      // 2023年9月13日更新原始内容备份-----start
      // const list = res.data.data ? res.data.data : res.data
      // if (url === '') {
      //   this.total = res.data.total ? res.data.total : 0
      //   this.dataList = list
      // }
      // 2023年9月13日更新原始内容备份-----end

      // 2023年9月13日更新最新内容-----start
      setTimeout(() => {
        const list = res.data.data ? res.data.data : res.data
        if (url === '') {
          if (res.data.total) {
            this.total = res.data.total
            this.page = res.data.page
            this.pageSize = res.data.pageSize
            this.dataList = list
          } else {
            this.total = 0
            this.dataList = list
          }
        }
        return Promise.resolve(res)
      }, 150)
      return Promise.resolve(res)
      // 2023年9月13日更新最新内容-----end
    },

    /**
     * 将数据转为formData模式
     */
    addFormData (data) {
      const form = new FormData()
      for (const key in data) {
        if (Object.hasOwnProperty.call(data, key)) {
          form.append(key, data[key])
        }
      }
      return form
    },

    /**
     * @method: addOrUpdateItem
     * @desc: 添加或修改数据
     * @param {String} url  自定义api参数
     * @param {String} formName  自定义form实体(ref)参数
     * @param {Boolean} validate  是否进行参数校验
     * @param {Boolean} isJson  是否使用json传递
     * @param {Object} paramData  自定义的params参数
     * @return: Promise函数
     */
    async addOrUpdateItem ({
      url = '',
      paramData = null,
      isJson = true
    } = {}) {
      let isError = false // 请求是否异常
      isJson = !!isJson
      const formData = paramData || this.dataForm
      const apiURL = url || this.mixinViewModuleOptions.addOrUpdateURL

      if (!apiURL && apiURL === '') {
        return this.errorPromise
      }

      this.dataListLoading = true
      const id = formData.id
      const param = isJson ? formData : this.addFormData(formData)

      const data = await this.$http[!id ? 'post' : 'put'](apiURL, param).catch((e) => {
        isError = true
      })

      this.dataListLoading = false

      // 后台不存在的api
      if (isError) {
        if (process.env.VUE_APP_NODE_ENV === 'dev') {
          this.$message.error('请检查你的URL是否正确，系统中没有可用于处理该URL的方法！')
        }
        return this.errorPromise
      }

      const res = data.data
      if (res.code !== 0) {
        if (res.code === 500) {
          this.$message.error('请求异常,请稍后再试')
          console.log(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        return this.errorPromise
      }

      this.$message({
        message: this.$t('prompt.success'),
        type: 'success',
        duration: 500
      })

      return Promise.resolve(res)
    },
    /**
     * @method: getItemInfo
     * @desc: 获取数据详情
     * @param {String} url  自定义api参数
     * @param {Boolean} isLoading  是否显示loading  默认为true
     * @param {Object} paramData  自定义的params参数
     * @return: Promise函数
     */
    async getDataInfo ({
      url = '',
      isLoading = true,
      paramData = null
    } = {}) {
      // isLoading = isLoading || true
      let isError = false // 请求是否异常
      const isCustomize = paramData !== null
      const formData = paramData || this.dataForm
      const apiURL = url || this.mixinViewModuleOptions.getDataInfoURL
      let data = ''
      if (!apiURL && apiURL === '') {
        this.$message.warning('请填写请求详情信息的API')
        return this.errorPromise
      }
      formData.id = formData.id || ''
      this.dataListLoading = isLoading
      // 是否自定义传入的参数
      if (isCustomize) {
        data = await this.$http.get(apiURL, {
          params: {
            ...formData
          }
        }).catch(() => {
          formData.id = ''
          isError = true
        })
      } else {
        data = await this.$http.get(`${apiURL}${formData.id}`).catch(() => {
          formData.id = ''
          isError = true
        })
      }

      formData.id = ''

      setTimeout(() => {
        if (isLoading) {
          this.dataListLoading = false
        }
      }, 500)

      // 后台不存在的api
      if (isError) {
        if (process.env.VUE_APP_NODE_ENV === 'dev') {
          this.$message.error('请检查你的URL是否正确，系统中没有可用于处理该URL的方法！')
        }
        return this.errorPromise
      }

      const res = data.data
      if (res.code !== 0) {
        if (res.code === 500) {
          this.$message.error('请求异常,请稍后再试')
          console.log(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        return this.errorPromise
      }

      if (url === '') {
        let obj = {}
        if (res.data.length && typeof (res.data) !== 'string') {
          obj = res.data[0]
        } else {
          obj = res.data
        }
        this.dataForm = Object.assign({}, formData, obj)
      }
      return Promise.resolve(res)
    },
    /**
     * @method: dataListSelectionChangeHandle
     * @desc: table表进行多选操作将选中的项赋值给 dataListSelections 属性，一般配合批量删除功能使用
     * @param {Array} val  选中的值
     * @return: void
     */
    dataListSelectionChangeHandle (val) {
      this.dataListSelections = val
    },
    /**
     * @method: dataListSortChangeHandle
     * @desc: table表进行排序操作
     * @param {Object} data  选中的值
     * @param {String} url  自定义api参数
     * @return: void
     */
    dataListSortChangeHandle (data, url) {
      if (!data.order || !data.prop) {
        this.order = ''
        this.orderField = ''
        return false
      }
      this.order = data.order.replace(/ending$/, '')
      this.orderField = data.prop
      this.getDataList({
        url
      })
    },
    /**
     * @method: pageSizeChangeHandle
     * @desc: 修改当前页显示的数量
     * @param {Number} val  当前页显示的数量
     * @param {Function} fn 自定义实现函数
     * @return: void
     */
    pageSizeChangeHandle (val, fn) {
      this.pageSize = val
      if (fn) {
        fn()
      } else {
        this.getDataList()
      }
      return Promise.resolve()
    },
    /**
     * @method: pageCurrentChangeHandle
     * @desc: 分页进行页数跳转
     * @param {Number} val  跳转的页数（跳转到第几页）
     * @param {Function} fn 自定义实现函数
     * @return: void
     */
    pageCurrentChangeHandle (val, fn) {
      this.page = val
      if (fn) {
        fn()
      } else {
        this.getDataList()
      }
      return Promise.resolve()
    },
    /**
     * @method: addOrUpdateHandle
     * @desc: 打开新增 / 修改窗口
     * @param {String} id  修改项的id
     * @return: void
     */
    addOrUpdateHandle (id) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.dataForm.id = id
        this.$refs.addOrUpdate.init()
      })
    },
    /**
     * @method: openDialog
     * @desc: 打开弹窗  （一般用于需要传递参数时使用）
     * @param {String} name  弹窗实体（ref）的名字 （必填）
     * @param {Object} data  传入弹窗的数据
     * @return: void
     */
    openDialog (name, data, a, b) {
      if (!name) {
        return this.$message.warning('openDialog(name, data)函数的name为必传参数，详情请查看view-module.js')
      }
      this.$nextTick(() => {
        try {
          this.$refs[name].pageSize = 10
          this.$refs[name].init(data, a, b)
        } catch (error) {
          return this.$message.warning(error.message)
        }
      })
    },
    /**
     * @method: deleteHandle
     * @desc:   删除功能
     * @param {String} id  删除项的id
     * @param {String} msg  自定义弹窗的描述语
     * @param {String} type  自定义弹窗的消息主题
     * @return: Promise
     */
    async deleteHandle ({
      id = '',
      msg = '',
      type = 'warning',
      callBack = null
    } = {}) {
      let isError = false // 请求是否异常
      let isDelet = true // 是否确认删除
      let data = null
      let deleteParam = ''
      msg = msg || this.$t('prompt.info', {
        'handle': this.$t('delete')
      })
      if (this.mixinViewModuleOptions.deleteIsBatch && !id && this.dataListSelections.length <= 0) {
        this.$message({
          message: this.$t('prompt.deleteBatch'),
          type: 'warning',
          duration: 500
        })
        return this.errorPromise
      }
      await this.$confirm(msg, this.$t('prompt.title'), {
        confirmButtonText: this.$t('confirm'),
        cancelButtonText: this.$t('cancel'),
        type: type
      }).then(async () => {
        if (!this.mixinViewModuleOptions.deleteURL) {
          this.$message.warning('请填写请求的API')
          return this.errorPromise
        }
        this.dataListLoading = true

        const paramKeys = this.mixinViewModuleOptions.deleteIsBatchKey.split('&')

        if (paramKeys.length > 1) {
          deleteParam = `?${this.mixinViewModuleOptions.deleteIsBatchKey}`
        } else {
          deleteParam = `?${this.mixinViewModuleOptions.deleteIsBatchKey}=${id}`
        }

        data = await this.$http.delete(
          `${this.mixinViewModuleOptions.deleteURL}${this.mixinViewModuleOptions.deleteIsBatch ? '' : deleteParam}`,
          this.mixinViewModuleOptions.deleteIsBatch ? {
            'data': id ? [id] : this.dataListSelections.map(item => item[this.mixinViewModuleOptions.deleteIsBatchKey])
          } : {}
        ).catch(() => {
          isError = true
        })
      }).catch(() => {
        isDelet = false
      })

      if (!isDelet) {
        return this.errorPromise
      }

      this.dataListLoading = false
      // 后台不存在的api
      if (isError) {
        if (process.env.VUE_APP_NODE_ENV === 'dev') {
          this.$message.error('请检查你的URL是否正确，系统中没有可用于处理该URL的方法！')
        }
        return this.errorPromise
      }

      const res = data.data
      if (res.code !== 0) {
        if (res.code === 500) {
          this.$message.error('请求异常,请稍后再试')
          console.log(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        return this.errorPromise
      }

      this.$message({
        message: this.$t('prompt.success'),
        type: 'success',
        duration: 500,
        onClose: () => {
          this.page = 1
          callBack === null ? this.getDataList() : callBack()
        }
      })
      return Promise.resolve(res)
    },
    /**
     * @method: getData postData
     * @desc: 获取数据
     * @param {String} url  自定义api参数
     * @param {Boolean} isLoading  是否显示loading  默认为true
     * @param {Object} paramData  自定义的params参数
     * @return: Promise函数
     */
    async getData ({
      url = '',
      isLoading = true,
      paramData = null
    } = {}) {
      // isLoading = isLoading || true
      let isError = false // 请求是否异常
      const apiURL = url || this.mixinViewModuleOptions.getDataListURL

      if (!apiURL && apiURL === '') {
        return this.errorPromise
      }

      let pageObj = {}

      paramData = paramData || this.dataForm

      this.dataListLoading = isLoading
      const data = await this.$http.get(
        apiURL,
        {
          params: {
            ...pageObj,
            ...paramData
          }
        }
      ).catch((e) => {
        isError = true
      })

      if (isLoading) {
        this.dataListLoading = false
      }
      // 后台不存在的api
      if (isError) {
        if (process.env.VUE_APP_NODE_ENV === 'dev') {
          this.$message.error('请检查你的URL是否正确，系统中没有可用于处理该URL的方法！')
        }
        return this.errorPromise
      }
      const res = data.data
      if (res.code !== 0) {
        this.dataList = []
        if (res.code === 500) {
          this.$message.error('请求异常,请稍后再试')
          console.log(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        return this.errorPromise
      }

      return Promise.resolve(res)
    },
    /**
     * @method: putData
     * @desc: 修改数据
     * @param {String} url  自定义api参数
     * @param {String} formName  自定义form实体(ref)参数
     * @param {Boolean} validate  是否进行参数校验
     * @param {Boolean} isJson  是否使用json传递
     * @param {Object} paramData  自定义的params参数
     * @return: Promise函数
     */
    async putData ({
      url = '',
      paramData = null,
      isJson = true
    } = {}) {
      let isError = false // 请求是否异常
      isJson = !!isJson
      const formData = paramData || this.dataForm
      const apiURL = url || this.mixinViewModuleOptions.addOrUpdateURL

      if (!apiURL && apiURL === '') {
        return this.errorPromise
      }

      this.dataListLoading = true
      const param = isJson ? formData : this.addFormData(formData)
      const data = await this.$http.put(apiURL, param).catch((e) => {
        isError = true
      })

      this.dataListLoading = false

      // 后台不存在的api
      if (isError) {
        if (process.env.VUE_APP_NODE_ENV === 'dev') {
          this.$message.error('请检查你的URL是否正确，系统中没有可用于处理该URL的方法！')
        }
        return this.errorPromise
      }

      const res = data.data
      if (res.code !== 0) {
        if (res.code === 500) {
          this.$message.error('请求异常,请稍后再试')
          console.log(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        return res
      }

      return Promise.resolve(res)
    },
    /**
     * @method: postData
     * @desc: 修改数据
     * @param {String} url  自定义api参数
     * @param {String} formName  自定义form实体(ref)参数
     * @param {Boolean} validate  是否进行参数校验
     * @param {Boolean} isJson  是否使用json传递
     * @param {Object} paramData  自定义的params参数
     * @return: Promise函数
     */
    async postData ({
      url = '',
      paramData = null,
      isJson = true
    } = {}) {
      let isError = false // 请求是否异常
      isJson = !!isJson
      const formData = paramData || this.dataForm
      const apiURL = url || this.mixinViewModuleOptions.addOrUpdateURL

      if (!apiURL && apiURL === '') {
        return this.errorPromise
      }

      this.dataListLoading = true
      // console.log(this.addFormData(formData))
      // const param = isJson ? formData : this.addFormData(formData)
      const param = isJson ? formData : this.addFormData(formData)

      const data = await this.$http.post(apiURL, param).catch((e) => {
        isError = true
      })

      this.dataListLoading = false

      // 后台不存在的api
      if (isError) {
        if (process.env.VUE_APP_NODE_ENV === 'dev') {
          this.$message.error('请检查你的URL是否正确，系统中没有可用于处理该URL的方法！')
        }
        return this.errorPromise
      }

      const res = data.data
      if (res.code !== 0) {
        if (res.code === 500) {
          this.$message.error('请求异常,请稍后再试')
          console.log(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        return this.errorPromise
      }

      return Promise.resolve(res)
    },
    /**
    * @method: deleteData
    * @desc: 删除数据
    * @param {String} url  自定义api参数
    * @param {String} formName  自定义form实体(ref)参数
    * @param {Boolean} validate  是否进行参数校验
    * @param {Boolean} isJson  是否使用json传递
    * @param {Object} paramData  自定义的params参数
    * @return: Promise函数
    */
    async deleteData ({
      url = '',
      paramData = null,
      isJson = true
    } = {}) {
      let isError = false // 请求是否异常
      isJson = !!isJson
      const formData = paramData || this.dataForm
      const apiURL = url || this.mixinViewModuleOptions.addOrUpdateURL

      if (!apiURL && apiURL === '') {
        return this.errorPromise
      }

      this.dataListLoading = true
      // console.log(this.addFormData(formData))
      // const param = isJson ? formData : this.addFormData(formData)
      const param = isJson ? formData : this.addFormData(formData)

      const data = await this.$http.delete(apiURL, { params: param }).catch((e) => {
        isError = true
      })

      this.dataListLoading = false

      // 后台不存在的api
      if (isError) {
        if (process.env.VUE_APP_NODE_ENV === 'dev') {
          this.$message.error('请检查你的URL是否正确，系统中没有可用于处理该URL的方法！')
        }
        return this.errorPromise
      }

      const res = data.data
      if (res.code !== 0) {
        if (res.code === 500) {
          this.$message.error('请求异常,请稍后再试')
          console.log(res.msg)
        } else {
          this.$message.error(res.msg)
        }
        return this.errorPromise
      }

      return Promise.resolve(res)
    },
    /**
     * @method: exportHandle
     * @desc:   导出功能
     * @return: void
     */
    exportHandle (paramsDate = null) {
      const data = paramsDate || this.dataForm
      let params = this.addFormData({
        'token': Cookies.get(window.housekeeperToken),
        ...data
      })
      window.location.href = `${process.env.VUE_APP_API_URL}${this.mixinViewModuleOptions.exportURL}?${params}`
    },
    /**
     * @description: 深拷贝
     * @example: deepCopy(data) || this.deepCopy(data)
     * @param {object || array} obj
     * @return {object || array}
     */
    deepCopy (obj) {
      if (typeof obj !== 'object' || obj === null) {
        return obj
      }
      let copy = Array.isArray(obj) ? [] : {}
      for (let key in obj) {
        if (obj.hasOwnProperty(key)) {
          copy[key] = this.deepCopy(obj[key])
        }
      }
      return copy
    }
  }
}
