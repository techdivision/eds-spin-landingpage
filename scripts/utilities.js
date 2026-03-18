/**
 * Clamp a number between a min and max value.
 * @param {number} value
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * If a function is called multiple times within the given timeout only the last call will be executed.
 * @param func
 * @param timeout
 * @returns {(function(...[*]): void)|*}
 */
export function debounce(func, timeout = 300) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

/**
 * Erstellt rein das DOM-Element für den Consent-Platzhalter.
 * @returns {HTMLElement} Der fertige Platzhalter-Knoten
 */
function renderNoConsent(block) {
  const placeholder = document.createElement('div');
  placeholder.classList.add('consent-placeholder');

  const inner = document.createElement('div');
  inner.classList.add('consent-placeholder-inner');

  const message = document.createElement('p');
  message.textContent = 'This content is blocked because you have not given cookie consent.';
  inner.append(message);

  const button = document.createElement('button');
  button.classList.add('button', 'primary');
  button.textContent = 'Change cookie settings';
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const consentBtn = document.querySelector('.cc-revoke, .dr-webcare-revoke');
    if (consentBtn) consentBtn.click();
  });

  inner.append(button);
  placeholder.append(inner);
  block.append(placeholder);
}

/**
 * Prüft den Consent-Status und führt die entsprechende Funktion aus.
 * @param {Function} onConsent - Wird ausgeführt, wenn Consent vorhanden ist.
 * @param {string} consentName - Der Name/Key des benötigten Consents (z.B. 'marketing').
 * @param {HTMLElement} block - Das DOM-Element, in dem der Platzhalter eingefügt werden soll.
 */
export async function handleConsentAction(onConsent, consentName, block) {
  const waitForLibrary = () => new Promise((resolve) => {
    if (window.cookieconsent) {
      resolve(window.cookieconsent);
      return;
    }
    const interval = setInterval(() => {
      if (window.cookieconsent) {
        clearInterval(interval);
        resolve(window.cookieconsent);
      }
    }, 100);
  });

  const cc = await waitForLibrary();
  const currentStatus = cc.currentConsentStatus();

  if (currentStatus[consentName]) onConsent();
  else renderNoConsent(block, 'bert');
}

// /**
//  * Execute a callback when cookie consent status changes.
//  * @param {Function} callback
//  */
// export function onCookieConsentChange(callback) {
//   document.addEventListener('click', (e) => {
//     if (!e.target.closest('.cc-btn')) return;
//     callback(hasCookieConsent());
//   });
// }
//
// /**
//  * Decorates a consent wrapper for an element.
//  * @param {Element} element The element to wrap
//  * @param {string} type The type of the element (e.g. 'vimeo', 'google-maps')
//  */
// export function decorateConsentWrapper(element, type = 'video') {
//   if (hasCookieConsent()) return;
//
//   const placeholder = document.createElement('div');
//   placeholder.classList.add('consent-placeholder', `consent-placeholder-${type}`);
//
//   const inner = document.createElement('div');
//   inner.classList.add('consent-placeholder-inner');
//
//   const message = document.createElement('p');
//   message.textContent = 'This content is blocked because you have not given cookie consent.';
//   inner.append(message);
//
//   const button = document.createElement('button');
//   button.classList.add('button', 'primary');
//   button.textContent = 'Change cookie settings';
//   button.addEventListener('click', (e) => {
//     e.preventDefault();
//     if (window.cookieconsent) {
//       window.cookieconsent.show();
//     }
//   });
//   inner.append(button);
//
//   placeholder.append(inner);
//
//   const originalDisplay = element.style.display;
//   element.style.display = 'none';
//   element.before(placeholder);
//
//   onCookieConsentChange((hasConsent) => {
//     if (hasConsent) {
//       placeholder.remove();
//       element.style.display = originalDisplay;
//     }
//   });
// }
