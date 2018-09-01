Vue.prototype.$http = axios;

var imageManagerApp = new Vue({
    el: '#imageManagerApp',
    data: {
        baseUrl: 'http://localhost:8080/app',
        presignedPutUrl: undefined,
        imageFromUploadUrl: '/sample/imageFromUpload.json',
        imagesFromUpload: [],
        imagesFromBlogUrl: '/sample/imagesFromBlog.json',
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
                    if (queryParamMap['bs_u'] !== undefined && queryParamMap['bs_u'] !== '') {
                        this.baseUrl = decodeURIComponent(queryParamMap['bs_u']);
                    }
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
                this.$http.defaults.baseURL = this.baseUrl;
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
            var files = event.target.files;
            var vm = this;
            for (var i = 0; i < files.length; i++) {
                var reader = new FileReader();
                reader.onload = (function(file) {
                    return function(e) {
                        var images = {id: undefined, url: e.target.result, fid: uuidv4()};
                        vm.imagesFromUpload.push(images);
                        if (!vm.presignedPutUrl) {
                            vm.uploadFormData(file, images.fid);
                        } else {
                            vm.uploadPresignedPutUrl(file, images.fid);
                        }
                    };
                })(files[i]);
                reader.readAsDataURL(files[i]);
            }

            console.log(vm.imagesFromUpload);
        },
        uploadFormData: function(file, fid) {
            var formData = new FormData();
            formData.append('uploadFile', file);
            formData.append('filename', file.name);
            formData.append('fid', fid);
            this.$http.post(this.imageFromUploadUrl, formData).then(function (response) {
                for (var j = 0; j < this.imagesFromUpload.length; j++) {
                    if (this.imagesFromUpload[j].fid === response.config.data.get('fid')) {
                        this.imagesFromUpload[j].id = response.data.id;
                        this.imagesFromUpload[j].url = response.data.url;
                        this.imagesFromUpload[j].fid = undefined;
                        break;
                    }
                }
            });
        },
        uploadPresignedPutUrl: function(file, fid) {
            this.$http.get(this.presignedPutUrl, { params: { filename: file.name } }).then(function (response) {
                this.$http.put(response.body.url, file).then(function (res) {
                    console.log(res.url.split('?')[0]);
                    for (var j = 0; j < this.imagesFromUpload.length; j++) {
                        if (this.imagesFromUpload[j].fid === res.config.data.get('fid')) {
                            this.imagesFromUpload[j].id = res.data.id;
                            this.imagesFromUpload[j].url = res.data.url;
                            this.imagesFromUpload[j].fid = undefined;
                            break;
                        }
                    }
                });
            });
        },
        getImagesFromBlog: function(event) {
            var vm = this;
            this.$http.get(this.imagesFromBlogUrl).then(function(response) {
                vm.imagesFromBlog = response.data;
            });
        }
    }
});