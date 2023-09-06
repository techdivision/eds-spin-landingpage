// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import registerScrollLinkedAnimation from './scroll-linked-animations.js';
import addStarsInUniverse from './content-stars.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');
// add more delayed functionality here
registerScrollLinkedAnimation(document.body);
addStarsInUniverse();
