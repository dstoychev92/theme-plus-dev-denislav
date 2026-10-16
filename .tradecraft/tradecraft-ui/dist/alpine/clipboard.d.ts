import { Alpine as AlpineType, AlpineComponent } from 'alpinejs';
export type ClipboardComponent = AlpineComponent<{
    state: 'initial' | 'success' | 'denied';
    target: HTMLElement | undefined;
    content: string;
    timeoutDuration: number;
    isClipboardWriteAllowed: boolean | null;
    copyToClipboard(e: PointerEvent): void;
    selectText(): void;
    handleSuccess(): void;
}>;
/**
 * Copy a string to the clipboard
 *
 * - x-clipboard - The root element. Initializes the clipboard functionality
 * - x-clipboard:target - The element that has the copy
 * - x-clipboard:button - The button that executes the copy command
 *
 * e.g.
 *
 * <div x-clipboard>
 *   <span x-clipboard:target="Text to copy"></span>
 *   <button x-clipboard:button>Click to copy</button>
 * </div>
 *
 * or
 *
 * <div x-clipboard>
 *   <span x-clipboard:target="Text to copy"></span>
 *   <button x-clipboard:button>Click to copy</button>
 * </div>
 *
 * or
 *
 * <div x-clipboard>
 *   <input
 *     value="Text to copy"
 *     x-clipboard:target
 *   >
 *   <button x-clipboard:button>Click to copy</button>
 * </div>
 */
export type ClipboardMagic = {
    isClipboardWriteAllowed: boolean | null;
    save(text: string): void;
    get state(): string;
};
export default function (Alpine: AlpineType): void;
