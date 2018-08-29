Vue.prototype.$http = axios;

var imageManagerApp = new Vue({
    el: '#imageManagerApp',
    data: {
        presignedUrl: undefined,
        imageFromUploadUrl: 'sample/imageFromUpload.json',
        imagesFromUpload: [],
        imagesFromBlogUrl: 'sample/imagesFromBlog.json',
        imagesFromBlog: []
    },
    created: function() {
        var uri = window.location.href.split('?');
        if (uri.length > 1) {
            var queryParamMap = {};
            uri[1].split('&').forEach(function(queryParam) {
                var tmp = queryParam.split('=');
                if(tmp.length === 2) {
                    queryParamMap[tmp[0]] = tmp[1];
                }
            });
            if (queryParamMap['ps_u'] !== undefined && queryParamMap['ps_u'] !== '') {
                this.presignedUrl = decodeURIComponent(queryParamMap['ps_u']);
            }
            if (queryParamMap['ifu_u'] !== undefined && queryParamMap['ifu_u'] !== '') {
                this.imageFromUploadUrl = decodeURIComponent(queryParamMap['ifu_u']);
            }
            if (queryParamMap['ifb_u'] !== undefined && queryParamMap['ifb_u'] !== '') {
                this.imagesFromBlogUrl = decodeURIComponent(queryParamMap['ifb_u']);
            }
        }
    },
    methods: {
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
                    var formData = new FormData();
                    formData.append('uploadFile', file);
                    formData.append('filename', file.name);
                    formData.append('fileuuid', fileuuid);
                    vm.$http.post(vm.imageFromUploadUrl, formData).then(function(response) {
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