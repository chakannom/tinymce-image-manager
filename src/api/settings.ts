const getParams = function (editor) {
    const params = editor.getParam('ckn_image_params', {});
    return params ? params : undefined
}

const getBaseUrlQuery = function (editor) {
    const baseUrl = getParams(editor)['base_url'];
    return baseUrl ? 'bs_u=' + encodeURIComponent(baseUrl) : undefined;
};

const getPresignedPutUrlQuery = function (editor) {
    const presignedPutUrl = getParams(editor)['presigned_put_url'];
    return presignedPutUrl ? 'psp_u=' + encodeURIComponent(presignedPutUrl) : undefined;
};

const getImageFromUploadUrlQuery = function (editor) {
    const imageFromUploadUrl = getParams(editor)['image_upload_url'];
    return imageFromUploadUrl ? 'ifu_u=' + encodeURIComponent(imageFromUploadUrl) : undefined;
};

const getImagesFromBlogUrlQuery = function (editor) {
    let imagesFromBlogUrl = getParams(editor)['images_blog_url'];
    if (imagesFromBlogUrl === undefined) {
        imagesFromBlogUrl = 'sample/imagesFromBlog.json';
    }
    return 'ifb_u=' + encodeURIComponent(imagesFromBlogUrl);
};

const getTokenName = function (editor) {
    let tokenName = getParams(editor)['token_name'];
    if (tokenName === undefined) {
        tokenName = 'sampleAuthToken';
    }
    return 'ws_tn=' + encodeURIComponent(tokenName);
};

const getImgproxyUrl = function (editor) {
    let imgproxyUrl = getParams(editor)['imgproxy_url'];
    if (imgproxyUrl === undefined) {
        imgproxyUrl = 'imgproxy_url';
    }
    return imgproxyUrl;
};

const getImgproxyKey = function (editor) {
    let imgproxyKey = getParams(editor)['imgproxy_key'];
    if (imgproxyKey === undefined) {
        imgproxyKey = 'imgproxy_key';
    }
    return imgproxyKey;
};

const getImgproxySalt = function (editor) {
    let imgproxySalt = getParams(editor)['imgproxy_salt'];
    if (imgproxySalt === undefined) {
        imgproxySalt = 'imgproxy_salt';
    }
    return imgproxySalt;
};

export default {
    getBaseUrlQuery,
    getPresignedPutUrlQuery,
    getImageFromUploadUrlQuery,
    getImagesFromBlogUrlQuery,
    getTokenName,
    getImgproxyUrl,
    getImgproxyKey,
    getImgproxySalt
};