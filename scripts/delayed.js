// eslint-disable-next-line import/no-cycle
import { sampleRUM } from './lib-franklin.js';
import registerScrollLinkedAnimation from './scroll-linked-animations.js';

function addStarsInUniverse() {
  const starsCount = [0.32, 0.13, 0.16];
  for (let galaxyId = 0; galaxyId < 3; galaxyId += 1) {
    const galaxy = document.createElement('div');
    galaxy.classList.add('universe', `galaxy-${galaxyId + 1}`);
    document.body.insertBefore(galaxy, document.body.firstChild);

    // calculate stars for each galaxy based on content height
    const starsInGalaxy = Math.floor(document.body.offsetHeight * starsCount[galaxyId]);
    let starBoxShadow = '';
    for (let starCount = 0; starCount < starsInGalaxy; starCount += 1) {
      starBoxShadow += `${Math.floor(Math.random() * document.body.offsetWidth)}px ${Math.floor(Math.random() * document.body.offsetHeight)}px #fff,`;
    }

    galaxy.style.setProperty('--star-box-shadow', starBoxShadow.slice(0, -1));
    galaxy.style.opacity = '1';
  }
}

// Core Web Vitals RUM collection
sampleRUM('cwv');
// add more delayed functionality here
registerScrollLinkedAnimation(document.body);
addStarsInUniverse();
