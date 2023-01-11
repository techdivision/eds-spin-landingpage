import { decorateIcons, toSlug } from '../../scripts/lib-franklin.js';

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
  const isMenuCurrentlyOpen = ariaExpandedAttribute === 'false';
  // eslint-disable-next-line max-len
  const menuShouldOpen = newOpenStateOverride !== null ? newOpenStateOverride : !isMenuCurrentlyOpen;
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
  const logoNode = document.createElement('span');
  logoNode.classList.add('icon', 'icon-logo-white');

  return logoNode;
}

function buildNavigationWithNavigationItems() {
  const navNode = document.createElement('nav');
  const ulNode = document.createElement('ul');
  const navigationItems = getOnPageNavigationItems();
  navigationItems.forEach((item) => {
    const liNode = document.createElement('li');
    const aNode = document.createElement('a');
    aNode.href = `#${toSlug(item)}`;
    aNode.textContent = item;
    liNode.appendChild(aNode);
    ulNode.appendChild(liNode);
    navNode.appendChild(ulNode);
  });
  navNode.setAttribute('aria-expanded', 'false');

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

  // default should always be closed
  toggleMenu(navNode, false);

  // event listeners
  hamburger.addEventListener('click', () => toggleMenu(navNode));
  MQ.addEventListener('change', () => toggleMenu(navNode, false));

  // decorate icons, especially the logo
  decorateIcons(block);
}
