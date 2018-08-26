Vue.prototype.$http = axios;

var imageManagerApp = new Vue({
    el: '#imageManagerApp',
    data: {
        imagesFromUpload: [],
        imagesFromBlog: []
    },
    created: function() {
        var imagesFromBlogUrl = 'sample/imagesFromBlog.json';
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
                imagesFromBlogUrl = getVars['iib_u'];
            }
        }
        var vm = this;
        this.$http.get(imagesFromBlogUrl).then(function(response) {
            vm.imagesFromBlog = response.data;
        });
    },
    methods: {
        selectFile: function(event) {
            this.$el.querySelector('#select_file').click();
        },
        uploadFiles: function(event) {
            var imageFromUploadUrl = 'sample/imageFromUpload.json';
            var vm = this;
            for (var i = 0; i < event.target.files.length; i++) {
                var file = event.target.files[i];
                console.log(file);
                var reader = new FileReader();
                reader.onload = function(event) {
                    vm.imagesFromUpload.push({id: undefined, src: undefined, file: event.target.result, fid: uuidv4()});
                    // var formData = new FormData();
                    // formData.append('uploadFile', file);
                    // formData.append('filename', file.name);
                    // vm.$http.post('sample/imageFromUpload' + i + '.json', formData).then(function(response) {
                    //     image.id = response.data.id;
                    //     image.url = response.data.url;
                    //     image.file = undefined;
                    // });
                };
                reader.readAsDataURL(file);
            }
        }
    }
});