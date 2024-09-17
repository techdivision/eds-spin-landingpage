import {
  sampleRUM,
  buildBlock,
  loadHeader,
  loadFooter,
  decorateButtons,
  decorateIcons,
  decorateSections,
  decorateBlocks,
  decorateTemplateAndTheme,
  waitForLCP,
  loadBlocks,
  loadCSS,
} from './lib-franklin.js';
import {
  registerCustomScrollLinkedVariable,
  registerScrollLinkedVariable,
} from './scroll-linked-variable.js';

const LCP_BLOCKS = []; // add your LCP blocks to the list

// ############## CUSTOM IMPLEMENTATIONS ##############

export function getCurrentLanguage() {
  let currentLanguage = 'de';
  const match = window.location.pathname.match(/^\/([a-z][a-z])\//);
  if (match) {
    // eslint-disable-next-line prefer-destructuring
    currentLanguage = match[1];
  }
  return currentLanguage;
}

export function toSlug(text) {
  return text.toLowerCase().replace(' ', '-').replace(/[^a-zA-Z0-9-]/g, '');
}

// ############## CUSTOM IMPLEMENTATIONS ##############

/**
 * Builds hero block and prepends to main in a new section.
 * @param {Element} main The container element
 */
function buildHeroBlock(main) {
  const h1 = main.querySelector('h1');
  const picture = main.querySelector('picture');
  // eslint-disable-next-line no-bitwise
  if (h1 && picture && (h1.compareDocumentPosition(picture) & Node.DOCUMENT_POSITION_PRECEDING)) {
    const section = document.createElement('div');
    section.append(buildBlock('hero', { elems: [picture, h1] }));
    main.prepend(section);
  }
}

/**
 * Builds all synthetic blocks in a container element.
 * @param {Element} main The container element
 */
function buildAutoBlocks(main) {
  try {
    buildHeroBlock(main);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Auto Blocking failed', error);
  }
}

function decorateSectionsWithIds(main) {
  main.querySelectorAll('.section').forEach((section) => {
    if (section.dataset.anchor) {
      section.id = toSlug(section.dataset.anchor);
    }
  });
}

function decorateSectionsWithPlanetToBackgroundAnimation(main) {
  // Fail early if IntersectionObserver is not supported. Backgrounds will be rendered without the planet animation then
  if (!('IntersectionObserver' in window)
      || !('IntersectionObserverEntry' in window)
      || !('isIntersecting' in window.IntersectionObserverEntry.prototype)) {
    return;
  }

  const planetAnimationRootMargin = 300;

  // Hides and shows section backgrounds and planets depending on the scroll position
  const planetSectionIntersectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const previousSection = entry.target.previousElementSibling;
      const nextSection = entry.target.nextElementSibling;
      if (entry.isIntersecting) {
        entry.target.classList.remove('background-hidden');
        // previousSection.querySelector('.section-planet').classList.add('hidden');
        // nextSection.querySelector('.section-planet').classList.add('hidden');
        previousSection.querySelectorAll('.section-planet').forEach((planet) => {
          planet.classList.add('hidden');
        });
        nextSection.querySelectorAll('.section-planet').forEach((planet) => {
          planet.classList.add('hidden');
        });
      } else if (entry.boundingClientRect.top > 0) {
        entry.target.classList.add('background-hidden');
        previousSection.querySelectorAll('.section-planet').forEach((planet) => {
          planet.classList.remove('hidden');
        });
      } else if (entry.boundingClientRect.top < 0) {
        entry.target.classList.add('background-hidden');
        nextSection.querySelector('.section-planet').classList.remove('hidden');
      }
    });
  }, { rootMargin: `-${planetAnimationRootMargin}px 0px` });

  main.querySelectorAll('.planet-to-background').forEach((section) => {
    section.classList.add('background-hidden');
    const previousSection = section.previousElementSibling;
    const nextSection = section.nextElementSibling;
    const classList = Array.from(section.classList);
    // Get the theme-class of the planet-to-background section
    const theme = classList.find((currentClass) => currentClass.includes('theme-'));

    const planet = document.createElement('div');
    planet.classList.add('section-planet');
    if (theme) {
      planet.classList.add(theme);
    } else {
      planet.classList.add('theme-default');
    }
    const previousPlanet = planet.cloneNode();
    previousPlanet.classList.add('section-planet-entering');
    previousSection.appendChild(previousPlanet);
    const nextPlanet = planet.cloneNode();
    nextPlanet.classList.add('section-planet-leaving');
    nextPlanet.classList.add('hidden');
    nextSection.appendChild(nextPlanet);
    registerCustomScrollLinkedVariable(
      previousSection,
      // eslint-disable-next-line max-len
      (elementDistanceToWindowTop, elementRect) => elementDistanceToWindowTop + elementRect.height / 2 - window.innerHeight / 2,
      // eslint-disable-next-line max-len
      (elementDistanceToWindowTop, elementRect) => elementDistanceToWindowTop + elementRect.height - window.innerHeight + planetAnimationRootMargin,
      '--scroll-planet',
    );
    registerCustomScrollLinkedVariable(
      nextSection,
      // eslint-disable-next-line max-len
      (elementDistanceToWindowTop) => elementDistanceToWindowTop - planetAnimationRootMargin,
      // eslint-disable-next-line max-len
      (elementDistanceToWindowTop, elementRect) => elementDistanceToWindowTop + elementRect.height / 2 - window.innerHeight / 2,
      '--scroll-planet',
    );
    planetSectionIntersectionObserver.observe(section);
  });
}

function decorateHeroSection(main) {
  const heroSection = main.querySelector('.section.hero');
  registerScrollLinkedVariable(heroSection);
}

function decorateH4(main) {
  const h4s = main.querySelectorAll('h4');
  h4s.forEach((h4) => {
    const words = h4.innerHTML.split(' ');
    words[0] = `<span class="text-white">${words[0]}</span>`;
    h4.innerHTML = words.join(' ');
  });
}

/**
 * Decorates the main element.
 * @param {Element} main The main element
 */
// eslint-disable-next-line import/prefer-default-export
export function decorateMain(main) {
  // hopefully forward compatible button decoration
  decorateButtons(main);
  decorateIcons(main);
  buildAutoBlocks(main);
  decorateSections(main);
  decorateHeroSection(main);
  decorateSectionsWithIds(main);
  decorateBlocks(main);
  decorateSectionsWithPlanetToBackgroundAnimation(main);
  decorateH4(main);
}

/**
 * Loads everything needed to get to LCP.
 * @param {Element} doc The container element
 */
async function loadEager(doc) {
  document.documentElement.lang = 'en';
  decorateTemplateAndTheme();
  const main = doc.querySelector('main');
  if (main) {
    decorateMain(main);
    document.body.classList.add('appear');
    await waitForLCP(LCP_BLOCKS);
  }

  try {
    /* if desktop (proxy for fast connection) or fonts already loaded, load fonts.css */
    if (window.innerWidth >= 900 || sessionStorage.getItem('fonts-loaded')) {
      // loadFonts();
    }
  } catch (e) {
    // do nothing
  }
}

/**
 * Loads everything that doesn't need to be delayed.
 * @param {Element} doc The container element
 */
async function loadLazy(doc) {
  const main = doc.querySelector('main');
  await loadBlocks(main);

  const { hash } = window.location;
  const element = hash ? doc.getElementById(hash.substring(1)) : false;
  if (hash && element) element.scrollIntoView();

  loadHeader(doc.querySelector('header'));
  loadFooter(doc.querySelector('footer'));

  loadCSS(`${window.hlx.codeBasePath}/styles/lazy-styles.css`);
  sampleRUM('lazy');
  sampleRUM.observe(main.querySelectorAll('div[data-block-name]'));
  sampleRUM.observe(main.querySelectorAll('picture > img'));
}

/**
 * Loads everything that happens a lot later,
 * without impacting the user experience.
 */
function loadDelayed() {
  // eslint-disable-next-line import/no-cycle
  window.setTimeout(() => import('./delayed.js'), 2000);
  // load anything that can be postponed to the latest here
}

async function loadPage() {
  await loadEager(document);
  await loadLazy(document);
  loadDelayed();
}

loadPage();
