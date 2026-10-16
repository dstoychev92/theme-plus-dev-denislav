import GlobalAlpine, { Alpine as AlpineType } from 'alpinejs';
import { yieldToMain } from '../utils/yield-to-main';
type LoadMagic = {
    script(url: string): Promise<string>;
};
type CookieMagic = {
    write(name: string, value: string): void;
    read(name: string): string | null;
    destroy(name: string): void;
};
declare module 'alpinejs' {
    interface Magics<T> {
        $debounce: typeof GlobalAlpine.debounce;
        $throttle: typeof GlobalAlpine.throttle;
        $yieldToMain: typeof yieldToMain;
        $load: LoadMagic;
        $cookie: CookieMagic;
    }
}
export default function (Alpine: AlpineType): void;
export {};
