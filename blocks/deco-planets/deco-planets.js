function getRandomArrayElement(array) {
  return array[Math.floor((Math.random() * array.length))];
}

function addVariaten(block) {
  const variant = getRandomArrayElement([
    '',
    'deco-planets-v1',
    'deco-planets-v2',
    'deco-planets-v3',
    'deco-planets-v4',
  ]);
  const moreSpace = getRandomArrayElement([
    '',
    'deco-planets-more-space',
  ]);
  if (variant !== '') {
    block.classList.add(variant);
  }
  if (moreSpace !== '') {
    block.classList.add(moreSpace);
  }
}

export default function decorate(block) {
  const planetOne = document.createElement('div');
  planetOne.classList.add('planet-one');
  const planetTwo = document.createElement('div');
  planetTwo.classList.add('planet-two');
  block.appendChild(planetOne);
  block.appendChild(planetTwo);
  addVariaten(block);
}
