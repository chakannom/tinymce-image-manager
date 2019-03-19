import Dialog from '../ui/Dialog';

const register = function (editor, url) {
  editor.addCommand('cksShowImage', function () {
    Dialog.open(editor, url);
  });
};

export default {
  register
};