import * as kebabCase from 'lodash/kebabCase';
import settings from './api/settings';
import imgproxy from './api/imgproxy';

const plugin = (editor: any, url: String) => {
    const queryParamList = [];
    const baseUrlQuery = settings.getBaseUrlQuery(editor);
    const presignedPutUrlQuery = settings.getPresignedPutUrlQuery(editor);
    const imageFromUploadUrlQuery = settings.getImageFromUploadUrlQuery(editor);
    const imagesFromBlogUrlQuery = settings.getImagesFromBlogUrlQuery(editor);
    const tokenName = settings.getTokenName(editor);
    if (baseUrlQuery !== undefined) queryParamList.push(baseUrlQuery);
    if (presignedPutUrlQuery !== undefined) queryParamList.push(presignedPutUrlQuery);
    if (imageFromUploadUrlQuery !== undefined) queryParamList.push(imageFromUploadUrlQuery);
    if (imagesFromBlogUrlQuery !== undefined) queryParamList.push(imagesFromBlogUrlQuery);
    if (tokenName !== undefined) queryParamList.push(tokenName);
    const appUrl = url + '/app/index.html?q=' + encodeURIComponent(btoa(queryParamList.join('&')));
    const imgproxySettings = {
        key: settings.getImgproxyKey(editor),
        salt: settings.getImgproxySalt(editor),
        url: settings.getImgproxyUrl(editor)
    }

    editor.addButton('ckn_image', {
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
                            const imgSrc = (<HTMLImageElement>selectedItems[i].getElementsByClassName('img-thumbnail')[0]).src;
                            const imgProxySrc = imgproxy.createImgproxySignatureUrl('fit', 120, 120, 'ce', 0, imgSrc, 'png', imgproxySettings);
                            console.log(imgProxySrc);

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
};

export default plugin;
