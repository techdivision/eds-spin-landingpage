const fs = require('fs');

/**
 * Generate the SVGs used for the background images for the star layers
 * execute this generator with
 * node generate-star-svg.js
 */
function injectStarsLayers() {
  const starsLayerConfigurations = [
    {
      density: 0.3, // how dense / how many stars there are in this layer
      starSize: '1', // the size of a singe star
    },
    {
      density: 0.25,
      starSize: '1.5',
    },
    {
      density: 0.2,
      starSize: '2',
    },
    {
      density: 0.15,
      starSize: '2.5',
    },
    {
      density: 0.1,
      starSize: '3',
    },
  ];
  const offsetHeight = 500;
  const offsetWidth = 500;

  starsLayerConfigurations.forEach((starsLayerConfiguration, index) => {
    // calculate stars for each starsLayer based on content height

    const starsInLayer = Math.floor(offsetHeight * starsLayerConfiguration.density);
    let starSvg = '<svg viewBox="0 0 500 500" xmlns="http://www.w3.org/2000/svg">';

    // const { blur } = starsLayerConfiguration;

    for (let starCount = 0; starCount < starsInLayer; starCount += 1) {
      const xPosition = Math.floor(Math.random() * offsetWidth);
      const yPosition = Math.floor(Math.random() * offsetHeight);
      const opacity = Math.floor(Math.random() * 100);

      starSvg += `<circle cx="${xPosition}" fill="white" cy="${yPosition}" opacity="${opacity}%" r="${starsLayerConfiguration.starSize / 2}px" />`;
    }

    starSvg += '</svg>';
    fs.writeFileSync(`images/layer${index}.svg`, starSvg);
  });
}

injectStarsLayers();
