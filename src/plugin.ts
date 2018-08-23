import * as kebabCase from 'lodash/kebabCase';

const plugin = (editor: any, url: String) => {
    editor.addButton('ckn_image', {
        icon: 'image',
        tooltip: 'Insert image',
        onclick: showDialog
    });

    function showDialog() {
        // Open window
        editor.windowManager.open({
            title: 'Insert image',
            url: url + '/app/index.html',
            width : 750,
            height : 450,
            buttons: [
                {
                    text: 'Insert image',
                    subtype: 'primary',
                    onclick: function(e) {
                        this.parent().parent().close();
                    }
                },
                {
                    text: 'Cancel',
                    onclick: function() {
                        this.parent().parent().close();
                    }
                }
            ],
            onsubmit (e: any) {
                // Insert content when the window form is submitted
                const kebabbyString: String = kebabCase(e.data.title);
                editor.insertContent(kebabbyString);
            }
        });
    }
};

export default plugin;
