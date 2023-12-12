// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import injectStarsLayers from './inject-stars-layers.js';
import { initializeHubspot } from '../blocks/form/form.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');
injectStarsLayers();
setTimeout(() => {
  initializeHubspot();
}, 2000);

/* IMPORTANT: this is just for fun and not actually used. Please ignore this :) */
let lastKeys = '';
const requiredCombination = 'spin';
document.addEventListener('keydown', (e) => {
  if (!lastKeys.includes(e.key)) {
    lastKeys += e.key;
  }

  if (lastKeys === requiredCombination) {
    const heroHeadline = document.querySelector('.hero h1');
    if (!heroHeadline) {
      return;
    }
    document.body.classList.add('i-spin');
    heroHeadline.textContent = 'I glab i SPIN';
  }
});

document.addEventListener('keyup', () => {
  lastKeys = '';
});

/* </FUN> */
