import { Future } from '@ephox/katamari';
import { btoa } from '@ephox/dom-globals';
import { ImageDialogInfo } from './DialogTypes';
import Settings from '../api/Settings';
import Imgproxy from '../core/Imgproxy';

const collect = (editor, url): Future<ImageDialogInfo> => {
  const imgproxySettings = {
    url: Settings.getImgproxyUrl(editor),
    key: Settings.getImgproxyKey(editor),
    salt: Settings.getImgproxySalt(editor)
  };

  const getAppBaseUrl = () => {
    const appBaseUrl = Settings.getAppBaseUrl(editor);
    return (typeof appBaseUrl !== 'undefined') ? appBaseUrl : url;
  };
  const getQuery = () => {
    const query = {
      ppu: Settings.getPresignedPutUrl(editor),
      ppt: Settings.getPresignedPutToken(editor),
      ifuu: Settings.getImageFromUploadUrl(editor),
      ifut: Settings.getImageFromUploadToken(editor),
      iu: Settings.getImagesUrl(editor),
      it: Settings.getImagesToken(editor)
    };
    const queryString = Object.keys(query).map((key) => key + '=' + query[key]).join('&');
    return encodeURIComponent(btoa(queryString));
  };

  const getImageUrl = async function (src: string) {
    let imageUrl = src;
    if (imgproxySettings.url !== undefined && imgproxySettings.key !== undefined && imgproxySettings.salt !== undefined) {
        imageUrl = await Imgproxy.createImgproxySignatureUrl('fit', 320, 320, 'ce', 0, src, 'png', imgproxySettings);
    }
    return imageUrl;
  };

  const windowMessageEvent = async function (e) {
    if (e.data.event === 'get-image-src-list') {
      const dom = editor.dom;
      const items = e.data.data;
      const itemsLength = items.length;
      for (let i = 0; i < itemsLength; i++) {
        const imgSrc = await getImageUrl(items[i]);
        const imgElmt = dom.createHTML('img', { src: imgSrc, border: '0' });
        editor.insertContent(imgElmt);
      }
    }
    editor.windowManager.close();
  };

  return Future.pure<ImageDialogInfo>({
    baseUrl: url,
    appBaseUrl: getAppBaseUrl(),
    query: getQuery(),
    windowEvent: {
      message: windowMessageEvent
    }
  });
};

export {
  collect
};
