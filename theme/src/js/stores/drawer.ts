import Alpine, {AlpineComponent} from 'alpinejs';

export type Drawer = AlpineComponent<{
  isOpen: boolean;
  type: string | null;
  data: any | null;
  prevIsOpen: boolean;
  prevType: string | null;
  prevData: any | null;
}>;

/**
 * Store the state of the currently active drawer
 */
Alpine.store(
  'drawer',
  new Proxy(
    {
      isOpen: false,
      type: null,
      data: null,
      prevIsOpen: false,
      prevType: null,
      prevData: null,
    },
    {
      set(target, prop, value, receiver) {
        if (prop === 'isOpen' && value === false) {
          target.type = null;
          target.data = null;
        }

        if (prop === 'isOpen') {
          target.prevIsOpen = target.isOpen;
        }

        if (prop === 'type') {
          target.prevType = target.type;
        }

        if (prop === 'data') {
          target.prevData = target.data;
        }

        return Reflect.set(target, prop, value, receiver);
      },
    },
  ),
);
