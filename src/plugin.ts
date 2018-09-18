import * as kebabCase from 'lodash/kebabCase';
import settings from './api/settings';
import imgproxy from './api/imgproxy';

const plugin = (editor: any, url: String) => {
    const queryParamList = [];
    const baseUrlQuery = settings.getBaseUrlQuery(editor);
    const presignedPutUrlQuery = settings.getPresignedPutUrlQuery(editor);
    const imageFromUploadUrlQuery = settings.getImageFromUploadUrlQuery(editor);
    const imagesFromBlogUrlQuery = settings.getImagesFromBlogUrlQuery(editor);
    const token = settings.getToken(editor);
    if (baseUrlQuery !== undefined) queryParamList.push(baseUrlQuery);
    if (presignedPutUrlQuery !== undefined) queryParamList.push(presignedPutUrlQuery);
    if (imageFromUploadUrlQuery !== undefined) queryParamList.push(imageFromUploadUrlQuery);
    if (imagesFromBlogUrlQuery !== undefined) queryParamList.push(imagesFromBlogUrlQuery);
    if (token !== undefined) queryParamList.push(token);
    const appUrl = url + '/app/index.html?q=' + encodeURIComponent(btoa(queryParamList.join('&')));
    const imgproxySettings = {
        url: settings.getImgproxyUrl(editor),
        key: settings.getImgproxyKey(editor),
        salt: settings.getImgproxySalt(editor)
    }

    editor.addButton('cks_image', {
        icon: 'image',
        tooltip: 'Insert image',
        onclick: showDialog
    });

    function showDialog() {
        // Open window
        editor.windowManager.open({
            title: 'Insert image',
            html: '<iframe id="cks_image_iframe" src="' + appUrl + '" tabindex="-1"></iframe>',
            width : 750,
            height : 450,
            buttons: [
                {
                    text: 'Insert image',
                    subtype: 'primary',
                    onclick: function(e) {
                        const dom = editor.dom;
                        const iframeDoc = (<HTMLIFrameElement>document.getElementById('cks_image_iframe')).contentDocument;
                        const activeTabElmt = (<HTMLElement>iframeDoc.getElementsByClassName('cks-image-tab active')[0]);
                        const selectedItems = activeTabElmt.getElementsByClassName('img-container-item selected');
                        for (let i = 0; i < selectedItems.length; i++) {
                            const imgSrc = getImageUrl((<HTMLImageElement>selectedItems[i].getElementsByClassName('img-thumbnail')[0]).src);
                            const imgElmt = dom.createHTML('img', { src: imgSrc, border: '0' });
                            editor.insertContent(imgElmt);
                        }
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

    function getImageUrl(src) {
        let imageUrl = src;
        if (imgproxySettings.url !== undefined && imgproxySettings.key !== undefined && imgproxySettings.salt !== undefined) {
            imageUrl = imgproxy.createImgproxySignatureUrl('fit', 320, 320, 'ce', 0, src, 'png', imgproxySettings);
        }
        return imageUrl;
    }
};

export default plugin;
