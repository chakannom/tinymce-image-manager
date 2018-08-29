const getPresignedPutUrlQuery = function (editor) {
    const presignedPutUrl = editor.getParam('ckn_image_presigned_put_url');
    return presignedPutUrl ? 'psp_u=' + encodeURIComponent(presignedPutUrl) : undefined;
};

const getImageFromUploadUrlQuery = function (editor) {
    const imageFromUploadUrl = editor.getParam('ckn_image_image_upload_url');
    return imageFromUploadUrl ? 'ifu_u=' + encodeURIComponent(imageFromUploadUrl) : undefined;
};

const getImagesFromBlogUrlQuery = function (editor) {
    const imagesFromBlogUrl = editor.getParam('ckn_image_images_blog_url', 'sample/imagesFromBlog.json');
    return imagesFromBlogUrl ? 'ifb_u=' + encodeURIComponent(imagesFromBlogUrl) : '';
};

export default {
    getPresignedPutUrlQuery,
    getImageFromUploadUrlQuery,
    getImagesFromBlogUrlQuery
};