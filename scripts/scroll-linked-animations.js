const scrollLinkedElements = [];
const scrollPositions = {};
let animationStart;

function setScrollPositionsWithAnimation(timeStamp) {
  if (animationStart === undefined) {
    animationStart = timeStamp;
  }

  let done = true;

  Object.values(scrollPositions).forEach((elementData) => {
    if (elementData.currentScrollPosition === elementData.targetScrollPosition) {
      return;
    }
    let scrollPosition;
    if (Number.isNaN(elementData.currentScrollPosition) || elementData.currentScrollPosition === '') {
      scrollPosition = elementData.targetScrollPosition;
    } else if (elementData.currentScrollPosition < elementData.targetScrollPosition) {
      scrollPosition = Math.min(
        elementData.currentScrollPosition + elementData.scrollPositionDelta,
        elementData.targetScrollPosition,
      );
    } else {
      scrollPosition = Math.max(
        elementData.currentScrollPosition + elementData.scrollPositionDelta,
        elementData.targetScrollPosition,
      );
    }

    if (!Number.isNaN(scrollPosition)) {
      elementData.element.style.setProperty('--scroll', scrollPosition);
      elementData.currentScrollPosition = scrollPosition;
      if (scrollPosition !== elementData.targetScrollPosition) {
        done = false;
      }
    }
  });

  if (!done) {
    window.requestAnimationFrame(setScrollPositionsWithAnimation);
  }
}

function calculateScrollPositions() {
  scrollLinkedElements.forEach((elementData) => {
    const elementRect = elementData.element.getBoundingClientRect();
    const scrollPercent = Math.min(
      Math.max(
        (elementRect.height - (elementRect.height + elementRect.top - elementData.scrollStartOffset))
            / (elementRect.height + elementData.scrollEndOffset),
        0,
      ),
      1,
    );
    // elementData.element.style.setProperty('--scroll', scrollPercent);
    scrollPositions[elementData.element.classList] = {
      element: elementData.element,
      targetScrollPosition: scrollPercent,
      currentScrollPosition: parseFloat(elementData.element.style.getPropertyValue('--scroll')),
      scrollPositionDelta: (scrollPercent - parseFloat(elementData.element.style.getPropertyValue('--scroll'))) / 300,
    };
    window.requestAnimationFrame(setScrollPositionsWithAnimation);
    elementData.element.style.setProperty('--container-height', `${elementRect.height}px`);
    elementData.element.style.setProperty('--container-width', `${elementRect.width}px`);
  });
}

let isThrottled = false;
function scheduleCalculation() {
  if (isThrottled) return;
  isThrottled = true;

  calculateScrollPositions();
  setTimeout(() => {
    isThrottled = false;
    calculateScrollPositions();
  }, 300);
}

/**
 *
 * @param element
 * @param scrollStartPosition can be either top or bottom, top is the default
 * @param scrollEndPosition can be either top or bottom, bottom is the default
 */
export default function registerScrollLinkedAnimation(element, scrollStartPosition = 'top', scrollEndPosition = 'bottom') {
  const scrollPositions = ['top', 'bottom'];
  if (!scrollPositions.includes(scrollStartPosition)
        || !scrollPositions.includes(scrollEndPosition)) {
    return;
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
  const elementData = {
    element,
    scrollStartOffset,
    scrollEndOffset,
  };
  scrollLinkedElements.push(elementData);
  calculateScrollPositions();
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
  scheduleCalculation,
  supportsPassive ? { passive: true } : false,
);
