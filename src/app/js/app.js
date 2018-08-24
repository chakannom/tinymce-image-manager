Vue.prototype.$http = axios;

var imageManagerApp = new Vue({
    el: '#imageManagerApp',
    data: {
        imagesFromUpload: [],
        imagesFromBlog: []
    },
    created() {
        let imagesFromBlogUrl = 'sample/sample.json';
        const uri = window.location.href.split('?');
        if (uri.length > 1) {
            const vars = uri[1].split('&');
            const getVars = {};
            let tmp = '';
            vars.forEach(function(v){
                tmp = v.split('=');
                if(tmp.length == 2)
                    getVars[tmp[0]] = tmp[1];
            });
            if (getVars['iib_u'] !== undefined && getVars['iib_u'] !== '') {
                imagesFromBlogUrl = getVars['iib_u'];
            }
        }
        this.$http.get(imagesFromBlogUrl).then((response) => {
            this.imagesFromBlog = response.data;
        });
    },
    methods: {
        uploadFiles(event) {
            for (const file of event.target.files) {
            }
        }
    }
});