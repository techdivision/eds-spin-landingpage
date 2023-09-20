import { registerScrollLinkedVariable, VIEWPORT_BOTTOM, VIEWPORT_TOP } from './scroll-linked-variable.js';

function getShootingStars() {
  const shootingStarsWrapper = document.createElement('div');
  shootingStarsWrapper.classList.add('shooting-stars-wrapper');
  for (let i = 0; i < 3; i += 1) {
    const shootingStar = document.createElement('div');
    shootingStar.classList.add('shooting-star');
    shootingStarsWrapper.appendChild(shootingStar);
  }
  return shootingStarsWrapper;
}

/**
 * Inject the star layer elements into the dom
 */
export default function injectStarsLayers() {
  registerScrollLinkedVariable(document.body, VIEWPORT_TOP, VIEWPORT_BOTTOM);

  const starsLayerConfigurations = [
    {
      animationDuration: '1s', // duration used for the parallax effect
      appearanceDelay: '5s', // the transition duration for the opacity
    },
    {
      animationDuration: '1.2s',
      appearanceDelay: '4s',
    },
    {
      animationDuration: '1.5s',
      appearanceDelay: '3s',
    },
    {
      animationDuration: '1.7s',
      appearanceDelay: '2s',
    },
    {
      animationDuration: '2s',
      appearanceDelay: '1s',
    },
  ];

  const wrapper = document.createElement('div');
  wrapper.classList.add('stars-wrapper');

  starsLayerConfigurations.forEach((starsLayerConfiguration, index) => {
    const starsLayer = document.createElement('div');
    starsLayer.classList.add('stars', `layer-${index}`);
    starsLayer.style.setProperty('--stars-animation-duration', starsLayerConfiguration.animationDuration);
    starsLayer.style.setProperty('--stars-appearance-delay', starsLayerConfiguration.appearanceDelay);
    starsLayer.style.setProperty('--stars-background-url', `url(/images/stars/layer${index}.svg)`);

    // wait for the stars to be painted before setting the opacity (and therefore starting the appearance transition)
    window.requestAnimationFrame(() => {
      starsLayer.style.setProperty('opacity', '1');
    });
    wrapper.appendChild(starsLayer);
  });

  // only run one insert due to performance reasons
  document.body.insertBefore(getShootingStars(), document.body.firstChild);
  document.body.insertBefore(wrapper, document.body.firstChild);
}
