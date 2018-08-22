var imageManagerApp = new Vue({
    el: '#imageManagerApp',
    data: {
        currentPage: 1
    },
    created() {
        let uri = window.location.href.split('?');
        if (uri.length == 2) {
            let vars = uri[1].split('&');
            let getVars = {};
            let tmp = '';
            vars.forEach(function(v){
                tmp = v.split('=');
                if(tmp.length == 2)
                    getVars[tmp[0]] = tmp[1];
            });
            console.log(getVars);
            // do
        }
    }
});