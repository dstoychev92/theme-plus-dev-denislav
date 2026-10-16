import Alpine from 'alpinejs';
import {sliderReveal} from '@groupthought/tradecraft-ui/alpine';
import beforeAfterSliderReveal from './plugins/before-after-slider-reveal';

Alpine.plugin([sliderReveal, beforeAfterSliderReveal]);
