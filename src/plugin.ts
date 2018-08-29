import * as kebabCase from 'lodash/kebabCase';
import settings from './api/settings';

const plugin = (editor: any, url: String) => {
    const presignedUrl = settings.getPresignedUrl(editor);
    const imageFromUploadUrl = settings.getImageFromUploadUrl(editor);
    const imagesFromBlogUrl = settings.getImagesFromBlogUrl(editor);
    const queryParamMap = { ps_u: presignedUrl, ifu_u: imageFromUploadUrl, ifb_u: imagesFromBlogUrl };
    const queryParams = Object.keys(queryParamMap).map(function (key) {
        return key + '=' + encodeURIComponent(queryParamMap[key]);
    }).join('&');
    const appUrl = url + '/app/index.html?' + queryParams;

    editor.addButton('ckn_image', {
        icon: 'image',
        tooltip: 'Insert image',
        onclick: showDialog
    });

    function showDialog() {
        // Open window
        editor.windowManager.open({
            title: 'Insert image',
            url: appUrl,
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
