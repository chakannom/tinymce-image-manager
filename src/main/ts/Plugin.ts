import Buttons from './ui/Buttons';
import Commands from './api/Commands';

declare const tinymce: any;

const setup = (editor, url) => {
  Commands.register(editor, url);
  Buttons.register(editor);
};

tinymce.PluginManager.add('cks_image', setup);

// tslint:disable-next-line:no-empty
export default () => {};
