var init = function(vm) {
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
            if (typeof queryParamMap.ppu !== 'undefined' && queryParamMap.ppu.length > 0) {
                vm.presignedPutUrl = queryParamMap.ppu;
            }
            if (typeof queryParamMap.ppt !== 'undefined' && queryParamMap.ppt.length > 0) {
                vm.presignedPutToken = queryParamMap.ppt;
            }
            if (typeof queryParamMap.ifuu !== 'undefined' && queryParamMap.ifuu.length > 0) {
                vm.imageFromUploadUrl = queryParamMap.ifuu;
            }
            if (typeof queryParamMap.ifut !== 'undefined' && queryParamMap.ifut.length > 0) {
                vm.imageFromUploadToken = queryParamMap.ifut;
            }
            if (typeof queryParamMap.iu !== 'undefined' && queryParamMap.iu.length > 0) {
                vm.imagesUrl = queryParamMap.iu;
            }
            if (typeof queryParamMap.it !== 'undefined' && queryParamMap.it.length > 0) {
                vm.imagesToken = queryParamMap.it;
            }
        }
    }
};

var initImages = function(vm) {
    if (vm.isClickedImagesTab === false) {
        vm.images = undefined;
        axios.get(vm.imagesUrl, { 
            headers: { Authorization: 'Bearer ' + vm.imagesToken }
        }).then(function (response) {
            vm.images = response.data;
            vm.isClickedImagesTab = true;
        });
    }
};

var selectFile = function(vm) {
    vm.$el.querySelector('#select_file').click();
};

var uploadFormData = function (vm, file, fuid) {
    var formData = new FormData();
    formData.append('uploadFile', file);
    formData.append('filename', file.name);
    axios.post(vm.imageFromUploadUrl, formData, { 
        headers: { Authorization: 'Bearer ' + vm.imageFromUploadToken }
    }).then(function (response) {
        for (var j = 0; j < vm.imagesFromUpload.length; j++) {
            if (vm.imagesFromUpload[j].fuid === fuid) {
                vm.imagesFromUpload[j].url = response.data.url;
                vm.imagesFromUpload[j].fuid = undefined;
                break;
            }
        }
    });
};

var uploadPresignedPutUrl = function(vm, file, fuid) {
    axios.get(vm.presignedPutUrl, { 
        headers: { Authorization: 'Bearer ' + vm.presignedPutToken },
        params: { filename: file.name }
    }).then(function (response) {
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
}

var uploadFiles = function(vm) {
    var files = event.target.files;
    for (var i = 0; i < files.length; i++) {
        var reader = new FileReader();
        reader.onload = (function(file) {
            return function(e) {
                var images = {url: e.target.result, fuid: uuidv4()};
                vm.imagesFromUpload.push(images);
                if (!vm.presignedPutUrl) {
                    uploadFormData(vm, file, images.fuid);
                } else {
                    uploadPresignedPutUrl(vm, file, images.fuid);
                }
            };
        })(files[i]);
        reader.readAsDataURL(files[i]);
    }
};

var clickItem = function (vm, elmtId) {
    var elmt = vm.$el.querySelector('#' + elmtId);
    var classList = elmt.className.split(' ');
    if (classList.indexOf('selected') < 0) {
        elmt.className += ' selected';
    } else {
        elmt.className = elmt.className.replace(/\b selected\b/g, '');
    }
}

var imageManagerApp = new Vue({
    el: '#imageManagerApp',
    data: {
        presignedPutUrl: undefined,
        presignedPutToken: 'presigned_put_token',
        imageFromUploadUrl: './sample/imageFromUpload.json',
        imageFromUploadToken: 'image_from_upload_token',
        imagesFromUpload: [],
        imagesUrl: './sample/images.json',
        imagesToken: 'images_token',
        images: undefined,
        token: 'sampleAuthToken',
        isClickedImagesTab: false
    },
    created: function() {
        init(this);
        initImages(this);
    },
    methods: {
        selectFile: function(event) { selectFile(this); },
        uploadFiles: function(event) { uploadFiles(this); },
        clickItem: function (elmtId) { clickItem(this, elmtId); }
    }
});

// Event listener
var windowMessageEvent = function (e) {
    if (e.data.event === 'get-image-src-list') {
        var imageUrls = [];
        var activeTabElmt = document.getElementsByClassName('cks-image-tab active')[0];
        var selectedItems = activeTabElmt.getElementsByClassName('img-container-item selected');
        for (var i = 0; i < selectedItems.length; i++) {
            imageUrls.push(selectedItems[i].getElementsByClassName('img-thumbnail')[0].src);
        }
        parent.postMessage({ event: 'get-image-src-list', data: imageUrls }, e.origin);
    }
}

var windowUnloadEvent = function (e) {
    window.removeEventListener('mesaage', windowMessageEvent);
    window.removeEventListener('unload', windowUnloadEvent);
}

window.addEventListener('message', windowMessageEvent);
window.addEventListener('unload', windowUnloadEvent);