import plugin from 'tailwindcss/plugin';
/**
 * Utility to set the thumb and track styles for a range input
 *
 * e.g.
 *
 * <input type="range" class="thumb:bg-red thumb:size-3 track:bg-green">
 */
export default plugin(function ({ addVariant }) {
    addVariant('thumb', ['&::-ms-thumb', '&::-moz-range-thumb', '&::-webkit-slider-thumb']);
    addVariant('track', ['&::-ms-track', '&::-moz-range-track', '&::-webkit-slider-runnable-track']);
});
