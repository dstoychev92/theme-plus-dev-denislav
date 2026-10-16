import Alpine from 'alpinejs';

import {themeEditor, gridInspector} from '@groupthought/tradecraft-ui/alpine';

document.addEventListener('alpine:init', () => {
  Alpine.plugin(themeEditor);
  Alpine.plugin(gridInspector);
});
