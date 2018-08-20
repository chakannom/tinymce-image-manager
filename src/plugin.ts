import * as kebabCase from 'lodash/kebabCase';

const plugin = (editor: any, url: String) => {
    editor.addButton('chakannom_img_manager', {
        icon: 'image',
        tooltip: 'Insert image',
        onclick: showDialog
    });

    function showDialog() {
        // Open window
        editor.windowManager.open({
            title: 'Insert image',
            url: url + '/app/index.html',
            width : 800,
            height : 300,
            onsubmit (e: any) {
                // Insert content when the window form is submitted
                const kebabbyString: String = kebabCase(e.data.title);
                editor.insertContent(kebabbyString);
            }
        });
    }
};

export default plugin;
