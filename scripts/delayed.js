// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import addStarsInUniverse from './content-stars.js';
import registerScrollLinkedVariable, { VIEWPORT_TOP, VIEWPORT_BOTTOM } from './scroll-linked-variable.js';

// Core Web Vitals RUM collection
sampleRUM('cwv');
// add more delayed functionality here
registerScrollLinkedVariable(document.body, VIEWPORT_TOP, VIEWPORT_BOTTOM);
addStarsInUniverse();
