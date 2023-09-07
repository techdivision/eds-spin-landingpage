export const VIEWPORT_TOP = 'top';
export const VIEWPORT_BOTTOM = 'bottom';

/**
 * List of all elements that are tracked for the scroll distance
 * @type {*[]}
 */
let scrollLinkedElements = [];

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

function getScrollFrameOffsets(viewportStartTrigger, viewportEndTrigger) {
  const allowedViewportTriggerKeywords = [VIEWPORT_TOP, VIEWPORT_BOTTOM];
  if (!allowedViewportTriggerKeywords.includes(viewportStartTrigger)
    || !allowedViewportTriggerKeywords.includes(viewportEndTrigger)) {
    throw new Error('Invalid keyword for allowedViewportTriggerKeywords');
  }
  let scrollFrameOffsetTop = 0;
  let scrollFrameOffsetBottom = 0;
  const windowHeight = window.innerHeight;

  if (viewportStartTrigger === VIEWPORT_TOP && viewportEndTrigger === VIEWPORT_BOTTOM) {
    scrollFrameOffsetBottom = -1 * windowHeight;
  } else if (viewportStartTrigger === VIEWPORT_BOTTOM && viewportEndTrigger === VIEWPORT_BOTTOM) {
    scrollFrameOffsetTop = windowHeight;
  } else if (viewportStartTrigger === VIEWPORT_BOTTOM && viewportEndTrigger === VIEWPORT_TOP) {
    scrollFrameOffsetTop = windowHeight;
    scrollFrameOffsetBottom = windowHeight;
  }

  return { scrollFrameOffsetTop, scrollFrameOffsetBottom };
}

/**
 * Register a HTMLElement to get an inline css variable which contains the distance in percent on
 * how far the user scrolled in this element
 *
 * You can customize the trigger, when the change should start and stop.
 *
 *
 * @example
 *
 * // If you want the variable to change, as soon as the element is visible use viewportStartTrigger = 'bottom'
 * registerScrollLinkedVariable(element, VIEWPORT_BOTTOM)
 *
 * // If you want the variable to change if the element is at the top of the viewport use viewportStartTrigger = 'top'
 * registerScrollLinkedVariable(element, VIEWPORT_TOP) //this is the default behaviour
 *
 * // If you want the variable to change as long as the element is fully visible, use viewportEndTrigger = 'bottom'
 * registerScrollLinkedVariable(element, VIEWPORT_TOP, VIEWPORT_BOTTOM) //this is the default behaviour
 *
 * // If you want the variable to change as long as the element is partially visible, use viewportEndTrigger = 'top'
 * registerScrollLinkedVariable(element, VIEWPORT_TOP, VIEWPORT_TOP)
 *
 * @param {HTMLElement} element
 * @param {string=} viewportStartTrigger Define the trigger, if the variable changes starting from the top
 * or the bottom of the viewport, VIEWPORT_TOP means the element needs to intersect with the top of the viewport,
 * bottom means the element needs to intersect with the bottom of the viewport
 * @param {string=} viewportEndTrigger Define the trigger, if the variable changes end with the top
 * or the bottom of the viewport, VIEWPORT_TOP means the element needs to intersect with the top of the viewport,
 * bottom means the element needs to intersect with the bottom of the viewport
 */
export default function registerScrollLinkedVariable(
  element,
  viewportStartTrigger = VIEWPORT_TOP,
  viewportEndTrigger = VIEWPORT_BOTTOM,
) {
  const {
    scrollFrameOffsetTop,
    scrollFrameOffsetBottom,
  } = getScrollFrameOffsets(viewportStartTrigger, viewportEndTrigger);

  // wait for the element to be painted on the screen
  window.requestAnimationFrame(() => {
    const elementRect = element.getBoundingClientRect();
    element.style.setProperty('--container-height', `${elementRect.height}px`);
    element.style.setProperty('--container-width', `${elementRect.width}px`);

    // calculate the offset for the top of the element, relative to the window: how far "down" is the element.
    const elementDistanceToWindowTop = elementRect.top + window.scrollY;
    // scrollFrame is the virtual size of where the scrolling has effect on the variable
    const scrollFrameTop = elementDistanceToWindowTop - scrollFrameOffsetTop;
    const scrollFrameBottom = elementDistanceToWindowTop + elementRect.height + scrollFrameOffsetBottom;
    const scrollFrameHeight = scrollFrameBottom - scrollFrameTop;

    const scrollLinkedElement = {
      element,
      viewportStartTrigger,
      viewportEndTrigger,
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

const updateScrollElementsResizeObserver = new ResizeObserver(() => {
  const scrollLinkedElementsCopy = scrollLinkedElements;
  scrollLinkedElements = [];
  scrollLinkedElementsCopy.forEach((scrollLinkedElement) => {
    registerScrollLinkedVariable(
      scrollLinkedElement.element,
      scrollLinkedElement.viewportStartTrigger,
      scrollLinkedElement.viewportEndTrigger,
    );
  });
});

updateScrollElementsResizeObserver.observe(document.documentElement);
