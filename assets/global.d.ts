import Alpine from 'alpinejs';
// The plugins augment Alpine's Magics with $cache, $section and friends. The
// deleted cypress support file used to pull them in; name them here instead.
import '@groupthought/tradecraft-ui/alpine';
import {ThemeEvent as BaseThemeEvent, ThemeEventPayload} from '@groupthought/tradecraft-ui/types';
import type {actions as StandardActions} from '@shopify/events/actions';
import {HeaderMenu} from 'src/js/plugins/header-menu';
import ThemeEventHandler from 'src/js/theme.events';
import {DrawerStore} from 'src/js/stores/drawer';
import YouTubePlayer from 'youtube-player';

export {};
declare module 'alpinejs' {
  export interface Stores {
    headerMenu: HeaderMenu;
    themeEventHandler: ThemeEventHandler;
    drawer: DrawerStore;
    page: typeof pageStore;
  }

  interface Magics<T> {}
}

declare module '@groupthought/tradecraft-ui/types' {
  export enum ThemeEvent {
    'theme:pickup:open',
    'theme:pickup:close',
    'theme:quickview:open',
    'theme:quickview:close',
    'theme:cart-notification:show',
    'theme:cart-drawer:open',
    'theme:cart-drawer:close',
    'theme:menu-drawer:open',
    'theme:menu-drawer:close',
  }

  export interface ThemeEventPayload {
    'theme:pickup:open': {
      url: string;
    };
    'theme:pickup:close': null;

    'theme:quickview:open': {
      url: string;
    };
    'theme:quickview:close': null;

    'theme:cart-notification:show': {
      url: string;
    };

    'theme:cart-drawer:open': {};
    'theme:cart-drawer:close': {};

    'theme:menu-drawer:open': {};
    'theme:menu-drawer:close': null;
  }
}

type LoadCallback = (error?: Error | undefined) => void;

export interface ModelViewer {
  new (
    element: Element,
    options?: {
      focusOnPlay?: boolean;
    },
  ): ModelViewer;
  play(): void;
  pause(): void;
  toggleFullscreen(): void;
  zoom(amount: number): void;
  destroy(): void;
}

// Vimeo Player interface
export interface VimeoPlayer {
  play(): Promise<void>;
  pause(): Promise<void>;
  getPaused(): Promise<boolean>;
  setCurrentTime(time: number): Promise<void>;
  unload(): Promise<void>;
  destroy(): Promise<void>;
  on(event: string, callback: () => void): void;
}

interface Shopify {
  designMode?: boolean;
  loadFeatures?: (features: ShopifyFeature[], callback?: LoadCallback) => void;
  ModelViewerUI?: ModelViewer;
  customerPrivacy?: {
    userCanBeTracked: () => boolean;
    getTrackingConsent: () => string;
    shouldShowBanner: () => boolean;
  };
  /** The standard storefront actions bundle, injected through content_for_header. */
  actions?: typeof StandardActions;
}

declare global {
  interface Window {
    Alpine: typeof Alpine;
    Shopify: Shopify;
    Vimeo: {
      Player: new (element: Element, options: any) => VimeoPlayer;
    };
    YT: {
      Player: YouTubePlayer;
      PlayerState: typeof YouTubePlayer.PlayerState;
      loaded: boolean;
    };
    onYouTubeIframeAPIReady: () => void;
    theme: {
      shop: {
        permanentDomain: string;
      };
      routes: {
        root: string;
        cart: string;
        cartAdd: string;
        cartChange: string;
        cartClear: string;
        cartUpdate: string;
        predictiveSearch: string;
        productRecommendations: string;
      };
      cart: {
        action: string;
        buttonAction: string;
      };
      screen: {
        sm: number;
        md: number;
        lg: number;
        xl: number;
        '2xl': number;
      };
      translations: Record<string, any>;
    };
  }

  interface Node {
    _x_youtubePlayer?: YouTubePlayer;
    _x_vimeoPlayer?: VimeoPlayer;
    _x_modelViewer?: ModelViewer;
  }
}
