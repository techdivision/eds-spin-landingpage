import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';

  let prefix = '/de/';
  const match = window.location.pathname.match(/^\/[a-z][a-z]\//);
  if (match) {
    // eslint-disable-next-line prefer-destructuring
    prefix = match[0];
  }

  const footerPath = cfg.footer || `${prefix}footer`;
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  const footer = document.createElement('div');
  footer.innerHTML = html;
  await decorateIcons(footer);
  block.append(footer);
}
