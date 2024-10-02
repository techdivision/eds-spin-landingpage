import { decorateIcons } from '../../scripts/lib-franklin.js';
import { getCurrentLanguage, toSlug } from '../../scripts/scripts.js';

// media query match that indicates mobile/tablet width
const MQ = window.matchMedia('(min-width: 900px)');

/**
 * Event handler to handle closing the menu on escape key
 * @param event
 */
function closeOnEscape(event) {
  if (event.code === 'Escape') {
    const nav = document.querySelector('nav');
    // eslint-disable-next-line no-use-before-define
    toggleMenu(nav, false);
  }
}

/**
 * Toggles the entire nav
 * @param {Element} nav The container element
 * @param {boolean} newOpenStateOverride if true it will be forced to be opened, if false it will be
 * forced to be closed
 */
function toggleMenu(nav, newOpenStateOverride = null) {
  const ariaExpandedAttribute = nav.getAttribute('aria-expanded');
  const isMenuCurrentlyClosed = ariaExpandedAttribute === 'false';
  // eslint-disable-next-line max-len
  const menuShouldOpen = newOpenStateOverride !== null ? newOpenStateOverride : isMenuCurrentlyClosed;
  const button = nav.querySelector('.nav-hamburger button');
  document.body.style.overflowY = (!menuShouldOpen || MQ.matches) ? '' : 'hidden';
  nav.setAttribute('aria-expanded', menuShouldOpen ? 'true' : 'false');
  // eslint-disable-next-line max-len
  button.setAttribute('aria-label', menuShouldOpen ? 'Close navigation' : 'Open navigation');

  // enable menu collapse on escape keypress
  if (menuShouldOpen) {
    // collapse menu on escape press
    window.addEventListener('keydown', closeOnEscape);
    window.scrollTo(0, 0);
  } else {
    window.removeEventListener('keydown', closeOnEscape);
  }
}

/**
 * Get all anchor titles of sections that should have an anchor
 * @returns {string[]} list of anchor titles
 */
function getOnPageNavigationItems() {
  const sectionsWithAnchor = document.querySelectorAll('div[data-anchor]');
  return Array.from(sectionsWithAnchor).map((item) => item.dataset.anchor);
}

function buildHamburgerNode() {
  const hamburger = document.createElement('div');
  hamburger.classList.add('nav-hamburger');
  hamburger.innerHTML = `<button type="button" aria-controls="nav" aria-label="Open navigation">
        <span class="nav-hamburger-icon"></span>
      </button>`;

  return hamburger;
}

function buildLogoNode() {
  const logoNode = document.createElement('a');
  logoNode.classList.add('logo');
  logoNode.href = getCurrentLanguage() === 'en' ? '/en/' : '/';
  logoNode.setAttribute('aria-label', 'SPIN Digital Experience Lab Landingpage');
  const logoNodeIcon = document.createElement('span');
  logoNodeIcon.classList.add('icon', 'icon-logo-white');
  logoNode.appendChild(logoNodeIcon);
  return logoNode;
}

function buildLanguageNavigation() {
  const languageNavigation = document.createElement('li');
  const svgChevron = '<svg class="language-navigation-symbol" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" fill="none">\n'
      + '<path d="M11 1.39856L6 6.39856L1 1.39856" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n'
      + '</svg>';
  languageNavigation.classList.add('language-navigation');
  languageNavigation.innerHTML = `
    <div class="language-navigation-button" >${getCurrentLanguage()} ${svgChevron}</div>
    <div class="language-navigation-selection">
        <a href="/" class="${getCurrentLanguage() === 'de' ? 'current-language' : ''} language-navigation-item">DE</a>
        <p class="language-navigation-separator"> / </p>
        <a href="/en/" class="${getCurrentLanguage() === 'en' ? 'current-language' : ''} language-navigation-item">EN</a>
    </div>
  `;
  return languageNavigation;
}

function buildNavigationWithNavigationItems() {
  const navNode = document.createElement('nav');
  const ulNode = document.createElement('ul');
  ulNode.classList.add('nav-list');
  const navigationItems = getOnPageNavigationItems();
  navigationItems.forEach((item) => {
    const liNode = document.createElement('li');
    const aNode = document.createElement('a');
    aNode.href = `#${toSlug(item)}`;
    aNode.textContent = item;
    liNode.classList.add('nav-list-item');
    liNode.appendChild(aNode);
    aNode.addEventListener('click', () => (!MQ.matches ? toggleMenu(navNode, false) : null));
    ulNode.appendChild(liNode);
    navNode.appendChild(ulNode);
  });
  navNode.setAttribute('aria-expanded', 'false');
  navNode.id = 'nav';
  // ulNode.appendChild(buildLanguageNavigation());
  return navNode;
}

/**
 * decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // clear this block
  block.textContent = '';

  // build
  const navNode = buildNavigationWithNavigationItems();
  const logoNode = buildLogoNode();
  const hamburger = buildHamburgerNode();

  block.appendChild(logoNode);
  block.appendChild(navNode);
  navNode.prepend(hamburger);

  // event listeners
  hamburger.addEventListener('click', () => toggleMenu(navNode));
  MQ.addEventListener('change', () => toggleMenu(navNode, false));

  // decorate icons, especially the logo
  decorateIcons(block);
}
