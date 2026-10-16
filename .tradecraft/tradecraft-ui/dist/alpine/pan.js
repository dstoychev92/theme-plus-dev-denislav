import { PanGestureRecognizer } from '../utils/pan-gesture-recognizer';
/**
 * TODO docs
 */
export default function (Alpine) {
    Alpine.directive('pan', ($el, data, { cleanup }) => {
        const panGestureRecognizer = new PanGestureRecognizer($el);
        cleanup(() => {
            panGestureRecognizer.destroy();
        });
    }).before('bind');
}
