import { Alpine as AlpineType } from 'alpinejs';
/**
 * Adds a keyboard submit shortcut to a textarea.
 *
 * - x-submittable-textarea - Applied to a <textarea>. Cmd+Enter on Mac, or Ctrl+Enter
 *   elsewhere, calls requestSubmit() on the closest <form>, so validation and submit
 *   handlers run the same as a click on the submit button.
 *
 * @example
 * <form method="post">
 *   <textarea name="comment[body]" x-submittable-textarea></textarea>
 *   <button type="submit">Post comment</button>
 * </form>
 */
export default function (Alpine: AlpineType): void;
