import { readBlockConfig, decorateIcons } from '../../scripts/lib-franklin.js';
import { getCurrentLanguage } from '../../scripts/scripts.js';

/**
 * loads and decorates the footer
 * @param {Element} block The header block element
 */

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  block.textContent = '';
  const footerPath = cfg.footer || `/${getCurrentLanguage()}/footer`;
  const resp = await fetch(`${footerPath}.plain.html`);
  const html = await resp.text();
  block.innerHTML = html;
  await decorateIcons(block);

  const icons = block.querySelectorAll('.icon');
  icons.forEach((icon) => {
    const iconLinkParent = icon.closest('a');
    if (iconLinkParent) {
      iconLinkParent.ariaLabel = 'social media icon';
    }
  });
}
