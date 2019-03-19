const getParams = function (editor) {
  return editor.getParam('cks_image_params', {});
};

const getAppBaseUrl = function (editor) {
  return getParams(editor).app_base_url;
};

const getDefaultToken = function (editor) {
  return getParams(editor).default_token;
};

const getPresignedPutUrl = function (editor) {
  return getParams(editor).presigned_put_url;
};

const getPresignedPutToken = function (editor) {
  const presignedPutToken = getParams(editor).presigned_put_token;
  return (typeof presignedPutToken !== 'undefined') ? presignedPutToken : getDefaultToken(editor);
};

const getImageFromUploadUrl = function (editor) {
  return getParams(editor).image_upload_url;
};

const getImageFromUploadToken = function (editor) {
  const imageUploadToken = getParams(editor).image_upload_token;
  return (typeof imageUploadToken !== 'undefined') ? imageUploadToken : getDefaultToken(editor);
};

const getImagesUrl = function (editor) {
  return getParams(editor).images_url;
};

const getImagesToken = function (editor) {
  const imagesToken = getParams(editor).images_token;
  return (typeof imagesToken !== 'undefined') ? imagesToken : getDefaultToken(editor);
};

const getImgproxyUrl = function (editor) {
  return getParams(editor).imgproxy_url;
};

const getImgproxyKey = function (editor) {
  return getParams(editor).imgproxy_key;
};

const getImgproxySalt = function (editor) {
  return getParams(editor).imgproxy_salt;
};

export default {
  getAppBaseUrl,
  getPresignedPutUrl,
  getPresignedPutToken,
  getImageFromUploadUrl,
  getImageFromUploadToken,
  getImagesUrl,
  getImagesToken,
  getDefaultToken,
  getImgproxyUrl,
  getImgproxyKey,
  getImgproxySalt
};