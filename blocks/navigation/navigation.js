function getLogoNode() {
  const logo = document.createElement('img');
  logo.classList.add('logo');
  logo.src = `${window.hlx.codeBasePath}/icons/logo.svg`;
  logo.textContent = 'test';
  return logo;
}

export default function decorate(block) {
  block.prepend(getLogoNode());
}
