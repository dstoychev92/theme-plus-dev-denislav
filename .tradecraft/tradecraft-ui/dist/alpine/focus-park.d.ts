import { Alpine as AlpineType } from 'alpinejs';
/**
 * Parks keyboard focus on the element when a focused descendant control becomes
 * disabled. The browser drops focus to `<body>` when it disables the focused
 * control, so the next Tab press restarts from the top of the document. Parking
 * keeps the tab position and the `:focus-within` state local while the control
 * is unavailable.
 *
 * An optional expression gates the park. It is evaluated in the element's scope
 * when focus drops.
 *
 * The element needs a markup `tabindex="-1"`, because a section morph strips a
 * runtime-added attribute. Without one the directive warns and stays inactive.
 *
 * Requires the keyboard-active plugin.
 *
 * @example
 * <div tabindex="-1" x-focus-park="$productForm?.state === 'pending'">
 *   <button :disabled="$productForm.state === 'pending'">Add to cart</button>
 * </div>
 */
export default function (Alpine: AlpineType): void;
