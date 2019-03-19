import Plugin from '../../main/ts/Plugin';

declare let tinymce: any;

Plugin();

tinymce.init({
  selector: 'textarea.tinymce',
  height: 500,
  plugins: 'cks_image code link preview',
  toolbar: 'cks_image code preview',
  object_resizing : 'table',
  cks_image_params: {
    app_base_url: '../..',
    default_token: 'default_token',
    /// for using presignedPutUrl
    // presigned_put_url: './sample/presignedPutUrl.json',
    // presigned_put_token: 'presigned_put_token',
    image_upload_url: './sample/imageFromUpload.json',
    image_upload_token: 'image_upload_token',
    images_url: './sample/images.json',
    images_token: 'images_token',
    // for using imgproxy
    // imgproxy_url: 'http://localhost:9001',
    // imgproxy_key: '3a8f347756fa5013430a1a3d0ebe2ad6',
    // imgproxy_salt: '19b63d683008e7b88bb4427d9c0b45b3'
  }
});