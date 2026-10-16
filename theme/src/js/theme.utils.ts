import {ThemeEventPayload} from '@groupthought/tradecraft-ui/types';

export type ThemeEventCallbackMap = {
  [K in keyof ThemeEventPayload]?: (e: CustomEventInit<ThemeEventPayload[K]>) => void;
};

export {
  hasConnection,
  isSavingData,
  isSlowConnection,
  isProductForm,
  isInProductForm,
  isHiddenInput,
  isShopifyAppBlock,
  isShopifyElement,
  onDocumentReady,
  requestIdleCallback,
} from '@groupthought/tradecraft-ui/utils';
