// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import injectStarsLayers from './inject-stars-layers.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');
injectStarsLayers();
