import registerScrollLinkedVariable, { VIEWPORT_BOTTOM, VIEWPORT_TOP } from './scroll-linked-variable.js';

/**
 * Add star layer elements into the body.
 * Count of stars is based on the height of the content, which is calculated based on a density configuration
 * @return void
 */
export default function injectStarsLayers() {
  registerScrollLinkedVariable(document.body, VIEWPORT_TOP, VIEWPORT_BOTTOM);

  const starsLayerConfigurations = [
    {
      density: 0.3, // how dense / how many stars there are in this layer
      starSize: '1px', // the size of a singe star
      blur: '0', // how much the stars in this layer are blurred
      animationDuration: '1s', // duration used for the parallax effect
      appearanceDelay: '5s', // the transition duration for the opacity
    },
    {
      density: 0.25,
      starSize: '1.5px',
      blur: '.25px',
      animationDuration: '1.2s',
      appearanceDelay: '4s',
    },
    {
      density: 0.2,
      starSize: '2px',
      blur: '.5px',
      animationDuration: '1.5s',
      appearanceDelay: '3s',
    },
    {
      density: 0.15,
      starSize: '2.5px',
      blur: '.75px',
      animationDuration: '1.7s',
      appearanceDelay: '2s',
    },
    {
      density: 0.1,
      starSize: '3px',
      blur: '1px',
      animationDuration: '2s',
      appearanceDelay: '1s',
    },
  ];
  const { offsetHeight, offsetWidth } = document.body;

  const wrapper = document.createElement('div');
  wrapper.classList.add('stars-wrapper');

  starsLayerConfigurations.forEach((starsLayerConfiguration) => {
    // calculate stars for each starsLayer based on content height

    const starsInLayer = Math.floor(offsetHeight * starsLayerConfiguration.density);
    let starsBoxShadow = '';

    const { blur } = starsLayerConfiguration;

    for (let starCount = 0; starCount < starsInLayer; starCount += 1) {
      const xPosition = Math.floor(Math.random() * offsetWidth);
      const yPosition = Math.floor(Math.random() * offsetHeight);

      // random hex value between 8 and f
      const opacity = Math.floor(Math.random() * 8 + 8).toString(16);

      starsBoxShadow += `${xPosition}px ${yPosition}px ${blur} #fff${opacity},`;
    }

    const starsLayer = document.createElement('div');
    starsLayer.classList.add('stars');
    starsLayer.style.setProperty('--stars-box-shadow', starsBoxShadow.slice(0, -1));
    starsLayer.style.setProperty('--stars-density', starsLayerConfiguration.density);
    starsLayer.style.setProperty('--stars-star-size', starsLayerConfiguration.starSize);
    starsLayer.style.setProperty('--stars-animation-duration', starsLayerConfiguration.animationDuration);
    starsLayer.style.setProperty('--stars-appearance-delay', starsLayerConfiguration.appearanceDelay);

    // wait for the stars to be painted before setting the opacity (and therefore starting the appearance transition)
    window.requestAnimationFrame(() => {
      starsLayer.style.setProperty('opacity', '1');
    });
    wrapper.appendChild(starsLayer);
  });

  // only run one insert due to performance reasons
  document.body.insertBefore(wrapper, document.body.firstChild);
}
