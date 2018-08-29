const getPresignedUrl = function (editor) {
    const presignedUrl = editor.getParam('ckn_image_presigned_url');
    return presignedUrl ? presignedUrl : undefined;
};

const getImageFromUploadUrl = function (editor) {
    const imageFromUploadUrl = editor.getParam('ckn_image_image_upload_url', 'sample/imageFromUpload.json');
    return imageFromUploadUrl ? imageFromUploadUrl : undefined;
};

const getImagesFromBlogUrl = function (editor) {
    const imagesFromBlogUrl = editor.getParam('ckn_image_images_blog_url', 'sample/imagesFromBlog.json');
    return imagesFromBlogUrl ? imagesFromBlogUrl : undefined;
};

export default {
    getPresignedUrl,
    getImageFromUploadUrl,
    getImagesFromBlogUrl
};