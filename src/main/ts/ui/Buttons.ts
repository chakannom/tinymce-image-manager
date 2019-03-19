const register = (editor) => {
  editor.ui.registry.addToggleButton('cks_image', {
    icon: 'image',
    tooltip: 'Insert image',
    onAction: () => editor.execCommand('cksShowImage')
  });
};

export default {
  register
};