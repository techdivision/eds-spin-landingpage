import {
  registerCustomScrollLinkedVariable,
  registerElementDimensionsVariables,
} from '../../scripts/scroll-linked-variable.js';

export default function decorate(block) {
  registerCustomScrollLinkedVariable(
    block.parentElement,
    // eslint-disable-next-line max-len
    (elementDistanceToWindowTop) => elementDistanceToWindowTop - 300,
    // eslint-disable-next-line max-len
    (elementDistanceToWindowTop, elementRect) => elementDistanceToWindowTop + elementRect.height + -1 * window.innerHeight + 200,
  );
  registerElementDimensionsVariables(block);

  const wordPositions = [
    { x: 50, y: 50 },
    { x: 20, y: 69 },
    { x: 70, y: 40 },
    { x: 50, y: 31 },
    { x: 25, y: 45 },
    { x: 80, y: 65 },
  ];
  const wordCount = block.children.length;
  const overLappingAnimations = 4;
  const animationFrame = (1 / (wordCount + (overLappingAnimations - 1)));
  const animationDuration = animationFrame * overLappingAnimations;
  Array.from(block.children).forEach((word, index) => {
    word.style.setProperty('--position-top', `${wordPositions[index % 6].x}%`);
    word.style.setProperty('--position-left', `${wordPositions[index % 6].y}%`);
    word.style.setProperty('--animation-offset', `${animationFrame * index}s`);
    word.style.setProperty('--animation-duration', `${animationDuration}s`);
  });
}
