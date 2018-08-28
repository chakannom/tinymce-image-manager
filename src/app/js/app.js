Vue.prototype.$http = axios;

var imageManagerApp = new Vue({
    el: '#imageManagerApp',
    data: {
        imageFromUploadUrl: 'sample/imageFromUpload.json',
        imagesFromUpload: [],
        imagesFromBlogUrl: 'sample/imagesFromBlog.json',
        imagesFromBlog: []
    },
    created: function() {
        var uri = window.location.href.split('?');
        if (uri.length > 1) {
            var vars = uri[1].split('&');
            var getVars = {};
            var tmp = '';
            vars.forEach(function(v) {
                tmp = v.split('=');
                if(tmp.length == 2)
                    getVars[tmp[0]] = tmp[1];
            });
            if (getVars['iib_u'] !== undefined && getVars['iib_u'] !== '') {
                this.imagesFromBlogUrl = getVars['iib_u'];
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