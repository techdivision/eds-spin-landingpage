import { clamp, debounce } from './utilities.js';

export const VIEWPORT_TOP = 'top';
export const VIEWPORT_BOTTOM = 'bottom';

/**
 * List of all elements that are tracked for the scroll distance
 * @type {*[]}
 */
let scrollLinkedElements = [];

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
    scrollLinkedElement.element.style.setProperty(scrollLinkedElement.scrollVariableName, scrollPercent);
  }
  scrollLinkedElement.previousScrollPercent = scrollPercent;
}

function updateScrollVariables() {
  const windowScrollY = window.scrollY;

  scrollLinkedElements.forEach((scrollLinkedElement) => {
    if (!scrollLinkedElement.isJustElementHeight) {
      updateScrollVariable(scrollLinkedElement, windowScrollY);
    }
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
 * @param scrollVariableName the name of the inline css variable. The default is '--scroll'
 */
export function registerScrollLinkedVariable(
  element,
  viewportStartTrigger = VIEWPORT_TOP,
  viewportEndTrigger = VIEWPORT_BOTTOM,
  scrollVariableName = '--scroll',
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
      scrollVariableName,
      isCustom: false,
      scrollFrame: {
        top: scrollFrameTop,
        height: scrollFrameHeight,
      },
    };
    scrollLinkedElements.push(scrollLinkedElement);
    updateScrollVariable(scrollLinkedElement, window.scrollY);
  });
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
 * // Change the scroll variable, as soon as the elements center reaches the viewports center
 * registerCustomScrollLinkedVariable(
 *   element,
 *   (elementDistanceToWindowTop, elementRect) =>
 *     elementDistanceToWindowTop + elementRect.height / 2 - window.innerHeight / 2,
 * );
 *
 * // Change the scroll variable, until the elements bottom is 200px above the viewports bottom
 * registerCustomScrollLinkedVariable(
 *   element,
 *   scrollFrameTopCallback,
 *   (elementDistanceToWindowTop, elementRect) =>
 *     elementDistanceToWindowTop + elementRect.height - window.innerHeight + 200,
 * );
 *
 * // You can also change the name for the css scroll variable
 * registerCustomScrollLinkedVariable(
 *   element,
 *   scrollFrameTopCallback,
 *   scrollFrameBottomCallback,
 *   '--custom-scroll-name'
 * );
 *
 * @param {HTMLElement} element
 * @param scrollFrameTopCallback a callback function that calculates the scroll frames top position.
 * (elementDistanceToWindowTop, elementRect) will be injected into the function
 * @param scrollFrameBottomCallback a callback function that calculates the scroll frames bottom position.
 * (elementDistanceToWindowTop, elementRect) will be injected into the function
 * @param scrollVariableName the name of the inline css variable. The default is '--scroll'
 */
export function registerCustomScrollLinkedVariable(
  element,
  scrollFrameTopCallback,
  scrollFrameBottomCallback,
  scrollVariableName = '--scroll',
) {
  // wait for the element to be painted on the screen
  window.requestAnimationFrame(() => {
    const elementRect = element.getBoundingClientRect();
    element.style.setProperty('--container-height', `${elementRect.height}px`);
    element.style.setProperty('--container-width', `${elementRect.width}px`);

    // calculate the offset for the top of the element, relative to the window: how far "down" is the element.
    const elementDistanceToWindowTop = elementRect.top + window.scrollY;
    // scrollFrame is the virtual size of where the scrolling has effect on the variable
    const scrollFrameTop = scrollFrameTopCallback(elementDistanceToWindowTop, elementRect);
    const scrollFrameBottom = scrollFrameBottomCallback(elementDistanceToWindowTop, elementRect);
    const scrollFrameHeight = scrollFrameBottom - scrollFrameTop;
    const scrollLinkedElement = {
      element,
      scrollFrameTopCallback,
      scrollFrameBottomCallback,
      scrollVariableName,
      isCustom: true,
      scrollFrame: {
        top: scrollFrameTop,
        height: scrollFrameHeight,
      },
    };
    scrollLinkedElements.push(scrollLinkedElement);
    updateScrollVariable(scrollLinkedElement, window.scrollY);
  });
}

/**
 * Sets the elements height and width in the css variables `--element-height` and ´--element-width´
 *
 * @param {HTMLElement} element
 */
export function registerElementDimensionsVariables(element) {
  window.requestAnimationFrame(() => {
    const elementRect = element.getBoundingClientRect();
    element.style.setProperty('--element-height', `${elementRect.height}px`);
    element.style.setProperty('--element-width', `${elementRect.width}px`);
    const scrollLinkedElement = {
      element,
      isJustElementHeight: true,
    };
    scrollLinkedElements.push(scrollLinkedElement);
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

const updateScrollElementsResizeObserver = new ResizeObserver(
  debounce(() => {
    const scrollLinkedElementsCopy = scrollLinkedElements;
    scrollLinkedElements = [];
    scrollLinkedElementsCopy.forEach((scrollLinkedElement) => {
      if (scrollLinkedElement.isJustElementHeight) {
        registerElementDimensionsVariables(scrollLinkedElement.element);
      } else if (scrollLinkedElement.isCustom) {
        registerCustomScrollLinkedVariable(
          scrollLinkedElement.element,
          scrollLinkedElement.scrollFrameTopCallback,
          scrollLinkedElement.scrollFrameBottomCallback,
          scrollLinkedElement.scrollVariableName,
        );
      } else {
        registerScrollLinkedVariable(
          scrollLinkedElement.element,
          scrollLinkedElement.viewportStartTrigger,
          scrollLinkedElement.viewportEndTrigger,
          scrollLinkedElement.scrollVariableName,
        );
      }
    });
  }, 100),
);

updateScrollElementsResizeObserver.observe(document.documentElement);
