Vue.prototype.$http = axios;

var imageManagerApp = new Vue({
    el: '#imageManagerApp',
    data: {
        presignedPutUrl: undefined,
        imageFromUploadUrl: 'sample/imageFromUpload.json',
        imagesFromUpload: [],
        imagesFromBlogUrl: 'sample/imagesFromBlog.json',
        imagesFromBlog: [],
        webStorageTokenName: 'sampleAuthToken'
    },
    created: function() {
        this.init();
    },
    methods: {
        init: function() {
            var uri = window.location.href.split('?');
            if (uri.length > 1) {
                var q = uri[1].split('=');
                if (q.length === 2) {
                    var queryParams = atob(decodeURIComponent(q[1]));
                    var queryParamMap = {};
                    queryParams.split('&').forEach(function(queryParam) {
                        var tmp = queryParam.split('=');
                        if(tmp.length === 2) {
                            queryParamMap[tmp[0]] = tmp[1];
                        }
                    });
                    if (queryParamMap['psp_u'] !== undefined && queryParamMap['psp_u'] !== '') {
                        this.presignedPutUrl = decodeURIComponent(queryParamMap['psp_u']);
                    }
                    if (queryParamMap['ifu_u'] !== undefined && queryParamMap['ifu_u'] !== '') {
                        this.imageFromUploadUrl = decodeURIComponent(queryParamMap['ifu_u']);
                    }
                    if (queryParamMap['ifb_u'] !== undefined && queryParamMap['ifb_u'] !== '') {
                        this.imagesFromBlogUrl = decodeURIComponent(queryParamMap['ifb_u']);
                    }
                    if (queryParamMap['ws_tn'] !== undefined && queryParamMap['ws_tn'] !== '') {
                        this.webStorageTokenName = decodeURIComponent(queryParamMap['ws_tn']);
                    }
                }
                var authenticationToken = this.getToken(this.webStorageTokenName);
                if (typeof authenticationToken === 'string') {
                    this.$http.defaults.headers.common['Authorization'] = 'Bearer ' + authenticationToken;
                }
            }
        },
        getToken: function(tokenName) {
            return localStorage.getItem(tokenName) || sessionStorage.getItem(tokenName);
        },
        selectFile: function(event) {
            this.$el.querySelector('#select_file').click();
        },
        uploadFiles: function(event) {
            var vm = this;
            for (var i = 0; i < event.target.files.length; i++) {
                var file = event.target.files[i];
                var reader = new FileReader();
                reader.onload = function(event) {
                    var fileuuid = uuidv4();
                    vm.imagesFromUpload.push({id: undefined, src: undefined, file: event.target.result, fid: fileuuid});
                    if (!this.presignedPutUrl) {
                        var formData = new FormData();
                        formData.append('uploadFile', file);
                        formData.append('filename', file.name);
                        formData.append('fileuuid', fileuuid);
                        vm.$http.post(vm.imageFromUploadUrl, formData).then(function (response) {
                            for (var j = 0; j < vm.imagesFromUpload.length; j++) {
                                if (vm.imagesFromUpload[j].fid === response.config.data.get('fileuuid')) {
                                    vm.imagesFromUpload[j].id = response.data.id;
                                    vm.imagesFromUpload[j].url = response.data.url;
                                    vm.imagesFromUpload[j].file = undefined;
                                    vm.imagesFromUpload[j].fid = undefined;
                                    break;
                                }
                            }
                        });
                    } else {
                        vm.$http.put('sample/imageFromUpload.json', file).then(function (response) {

                        });
                    }
                };
                reader.readAsDataURL(file);
            }
        },
        getImagesFromBlog: function(event) {
            var vm = this;
            this.$http.get(this.imagesFromBlogUrl).then(function(response) {
                vm.imagesFromBlog = response.data;
            });
        }
    }
});