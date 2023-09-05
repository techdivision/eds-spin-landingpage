/**
 * List of all elements that are tracked for the scroll distance
 * @type {*[]}
 */
const scrollLinkedElements = [];

/**
 * Clamp a number between a min and max value.
 *
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function updateScrollVariable(scrollLinkedElement, windowScrollY) {
  const scrolledDistanceInScrollingFrame = windowScrollY - scrollLinkedElement.scrollFrame.top;
  const scrollPercent = clamp(
    scrolledDistanceInScrollingFrame / scrollLinkedElement.scrollFrame.height,
    0,
    1,
  );

  // only update the variable if the value actually has changed,
  // because this operation is "expensive"
  if (scrollPercent !== scrollLinkedElement.previousScrollPercent) {
    scrollLinkedElement.element.style.setProperty('--scroll', scrollPercent);
  }
  scrollLinkedElement.previousScrollPercent = scrollPercent;
}

function updateScrollVariables() {
  const windowScrollY = window.scrollY;

  scrollLinkedElements.forEach((scrollLinkedElement) => {
    updateScrollVariable(scrollLinkedElement, windowScrollY);
  });
}

function getScrollOffset(scrollStartPosition, scrollEndPosition) {
  // @TODO refactor this, it is unclear, what "top" or "bottom" actually mean
  // Instead maybe use e.g. topOffset with values 100vh e.g.
  const allowedScrollPositionKeywords = ['top', 'bottom'];
  if (!allowedScrollPositionKeywords.includes(scrollStartPosition)
    || !allowedScrollPositionKeywords.includes(scrollEndPosition)) {
    throw new Error('Invalid keyword for registerScrollLinkedAnimation');
  }
  let scrollStartOffset = 0;
  let scrollEndOffset = 0;
  if (scrollStartPosition === 'top' && scrollEndPosition === 'bottom') {
    scrollEndOffset = -1 * window.innerHeight;
  } else if (scrollStartPosition === 'bottom' && scrollEndPosition === 'bottom') {
    scrollStartOffset = window.innerHeight;
  } else if (scrollStartPosition === 'bottom' && scrollEndPosition === 'top') {
    scrollStartOffset = window.innerHeight;
    scrollEndOffset = window.innerHeight;
  }

  return { scrollStartOffset, scrollEndOffset };
}

/**
 *
 * @param element
 * @param scrollStartPosition can be either top or bottom, top is the default
 * @param scrollEndPosition can be either top or bottom, bottom is the default
 */
export default function registerScrollLinkedVariable(element, scrollStartPosition = 'top', scrollEndPosition = 'bottom') {
  const {
    scrollStartOffset,
    scrollEndOffset,
  } = getScrollOffset(scrollStartPosition, scrollEndPosition);

  // wait for the element to be painted on the screen
  window.requestAnimationFrame(() => {
    const elementRect = element.getBoundingClientRect();
    element.style.setProperty('--container-height', `${elementRect.height}px`);
    element.style.setProperty('--container-width', `${elementRect.width}px`);

    const scrollFrameTop = element.offsetTop - scrollStartOffset;
    const scrollFrameBottom = element.offsetTop + elementRect.height + scrollEndOffset;
    const scrollFrameHeight = scrollFrameBottom - scrollFrameTop;

    const scrollLinkedElement = {
      element,
      scrollFrame: {
        top: scrollFrameTop,
        height: scrollFrameHeight,
      },
    };
    scrollLinkedElements.push(scrollLinkedElement);
    updateScrollVariable(scrollLinkedElement, window.scrollY);
  });
}

// Test via a getter in the options object to see if the passive property is accessed
let supportsPassive = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    // eslint-disable-next-line getter-return
    get() {
      supportsPassive = true;
    },
  });
  window.addEventListener('testPassive', null, opts);
  window.removeEventListener('testPassive', null, opts);
} catch (e) {
  // swallow
}

window.addEventListener(
  'scroll',
  updateScrollVariables,
  supportsPassive ? { passive: true } : false,
);
