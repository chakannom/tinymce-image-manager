var imageManagerApp = new Vue({
    el: '#imageManagerApp',
    data: {
        baseUrl: 'http://localhost:8080/app',
        presignedPutUrl: undefined,
        imageFromUploadUrl: '/sample/imageFromUpload.json',
        imagesFromUpload: [],
        imagesFromBlogUrl: '/sample/imagesFromBlog.json',
        imagesFromBlog: undefined,
        token: 'sampleAuthToken'
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
                    if (queryParamMap['tn'] !== undefined && queryParamMap['tn'] !== '') {
                        this.token = decodeURIComponent(queryParamMap['tn']);
                    }
                }
                axios.defaults.baseURL = this.baseUrl;
                if (typeof this.token === 'string') {
                    axios.defaults.headers.common['Authorization'] = 'Bearer ' + this.token;
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
            var files = event.target.files;
            for (var i = 0; i < files.length; i++) {
                var reader = new FileReader();
                reader.onload = (function(file) {
                    return function(e) {
                        var images = {url: e.target.result, fuid: uuidv4()};
                        vm.imagesFromUpload.push(images);
                        if (!vm.presignedPutUrl) {
                            vm.uploadFormData(file, images.fuid);
                        } else {
                            vm.uploadPresignedPutUrl(file, images.fuid);
                        }
                    };
                })(files[i]);
                reader.readAsDataURL(files[i]);
            }
        },
        uploadFormData: function(file, fuid) {
            var vm = this;
            var formData = new FormData();
            formData.append('uploadFile', file);
            formData.append('filename', file.name);
            axios.post(vm.imageFromUploadUrl, formData).then(function (response) {
                for (var j = 0; j < vm.imagesFromUpload.length; j++) {
                    if (vm.imagesFromUpload[j].fuid === fuid) {
                        vm.imagesFromUpload[j].url = response.data.url;
                        vm.imagesFromUpload[j].fuid = undefined;
                        break;
                    }
                }
            });
        },
        uploadPresignedPutUrl: function(file, fuid) {
            var vm = this;
            axios.get(vm.presignedPutUrl, { params: { filename: file.name } }).then(function (response) {
                axios.put(response.data.url, file).then(function (res) {
                    var imageUrl = res.config.url.split('?')[0];
                    for (var j = 0; j < vm.imagesFromUpload.length; j++) {
                        if (vm.imagesFromUpload[j].fuid === fuid) {
                            vm.imagesFromUpload[j].url = imageUrl;
                            vm.imagesFromUpload[j].fuid = undefined;
                            break;
                        }
                    }
                });
            });
        },
        getImagesFromBlog: function(event) {
            var vm = this;
            vm.imagesFromBlog = undefined;
            axios.get(vm.imagesFromBlogUrl).then(function(response) {
                vm.imagesFromBlog = response.data;
            });
        },
        clickItem: function (elmtId) {
            var elmt = this.$el.querySelector('#' + elmtId);
            var classList = elmt.className.split(' ');
            if (classList.indexOf('selected') < 0) {
                elmt.className += ' selected';
            } else {
                elmt.className = elmt.className.replace(/\b selected\b/g, '');
            }
        }
    }
});