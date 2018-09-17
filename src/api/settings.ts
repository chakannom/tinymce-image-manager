const getParams = function (editor) {
    const params = editor.getParam('cks_image_params', {});
    return params ? params : undefined;
};

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
    return getParams(editor)['imgproxy_url'];
};

const getImgproxyKey = function (editor) {
    return getParams(editor)['imgproxy_key'];
};

const getImgproxySalt = function (editor) {
    return getParams(editor)['imgproxy_salt'];
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