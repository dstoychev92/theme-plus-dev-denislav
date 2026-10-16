/**
 * This file contains critical code that must be loaded as soon as possible
 */

import {isSupported as isPopoverApiSupported} from '@oddbird/popover-polyfill/fn';

import './responsive-tables';

if (!isPopoverApiSupported()) {
  // @ts-ignore
  import('popover-polyfill');
}
