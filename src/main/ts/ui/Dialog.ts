import { Types } from '@ephox/bridge';
import { document, HTMLIFrameElement, window } from '@ephox/dom-globals';
import { collect } from './DialogInfo';
import { API, ImageDialogInfo, ImageDialogData } from './DialogTypes';

const submitHandler = (info: ImageDialogInfo) => (api: API) => {
  const iframeWindow = (<HTMLIFrameElement> document.getElementById('cks_image_iframe')).contentWindow;
  iframeWindow.postMessage({ event: 'get-image-src-list' }, info.baseUrl);
};

const closeHandler = (info: ImageDialogInfo) => () => {
  window.removeEventListener('message', info.windowEvent.message);
};

const makeDialogBody = (info: ImageDialogInfo) => {
  const sandbox = 'allow-scripts allow-same-origin';
  const style = 'width:100%;height:450px;';
  const src =  `${info.appBaseUrl}/app/index.html?q=${info.query}`;

  const panel: Types.Dialog.PanelApi = {
    type: 'panel',
    items: [
      {
        type: 'htmlpanel',
        html: `<iframe id="cks_image_iframe" sandbox="${sandbox}" style="${style}" src="${src}">The "iframe" tag is not supported by your browser.</iframe>`
      }
    ]
  };
  return panel;
};

const makeDialog = () => (info: ImageDialogInfo): Types.Dialog.DialogApi<ImageDialogData> => {
  window.addEventListener('message', info.windowEvent.message);
  return {
    title: 'Insert Image',
    size: 'medium',
    body: makeDialogBody(info),
    buttons: [
      {
        type: 'cancel',
        name: 'cancel',
        text: 'Cancel'
      },
      {
        type: 'submit',
        name: 'save',
        text: 'Save',
        primary: true
      }
    ],
    onSubmit: submitHandler(info),
    onClose: closeHandler(info)
  };
};

const open = (editor, url) => collect(editor, url).map(makeDialog()).get((spec) => {
  editor.windowManager.open(spec);
});

export default {
  open
};
