/**
 * fetch async svgator svg and script
 * @param svgatorProjectName
 * @return {Promise<{svg: string, script: string}>}
 */
async function fetchSvgatorData(svgatorProjectName) {
  const svgFilePath = `/blocks/svgator/svgs/${svgatorProjectName}/animatable.svg`;
  const jsFilePath = `/blocks/svgator/svgs/${svgatorProjectName}/animation.js`;

  const [svgResponse, scriptResponse] = await Promise.all([
    fetch(svgFilePath),
    fetch(jsFilePath),
  ]);

  if (!svgResponse.ok) {
    const message = `An error occurred while fetching ${svgatorProjectName} svg data: ${svgResponse.status}.`;
    throw new Error(message);
  }

  if (!scriptResponse.ok) {
    const message = `An error occurred while fetching ${svgatorProjectName} script data: ${scriptResponse.status}.`;
    throw new Error(message);
  }

  const svg = await svgResponse.text();
  const script = await scriptResponse.text();

  return { svg, script };
}

/**
 * Load dynamically svg and the associated script for an animated SVG.
 * A svg from svgator contains a script tag, so please split it into two separate files
 * named animatable.svg and animation.js.
 * And stored them in '/blocks/svgator/svgs/${my-awesome-animated}'
 * Use the the identifier e.g. my-awesome-animated for the sub folder name
 * Documentation for svgator: https://www.svgator.com/help/getting-started/animate-programmatically
 * @param block
 */
export default function decorate(block) {
  const fileName = block.innerText.trim();
  block.innerText = '';
  if (!fileName.length) {
    // Remove class and thus also remove the skeleton styling
    block.classList.remove(...block.classList);
    // eslint-disable-next-line no-console
    console.warn('Missing svgator identifier!');
    return;
  }

  fetchSvgatorData(fileName).then((svgatorData) => {
    // Prepare and append content for svgator
    const container = document.createElement('div');
    const script = document.createElement('script');
    container.innerHTML = svgatorData.svg;
    script.innerHTML = svgatorData.script;
    block.append(container);
    block.append(script);
    block.classList.add('svg-loaded');

    // initialize svgator
    const identifier = container.querySelector('svg').getAttribute('id');
    const element = document.getElementById(identifier);
    const player = element ? element.svgatorPlayer : {};
    if (player.play) {
      player.play();
    }
  }).catch((error) => {
    // Remove class and thus also remove the skeleton styling
    block.classList.remove(...block.classList);
    // eslint-disable-next-line no-console
    console.log(`%c ${error}`, 'color: #ff0000;');
  });
}
