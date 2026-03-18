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

function getCurrentLanguage() {
  const pathName = window.location.pathname;
  return pathName.includes('/en/') ? 'en' : 'de';
}

/**
 * Erstellt rein das DOM-Element für den Consent-Platzhalter.
 * @returns {HTMLElement} Der fertige Platzhalter-Knoten
 */
function renderNoConsent(block) {
  const currentLanguage = getCurrentLanguage();

  const textEn = 'This content is blocked because you have not given cookie consent.';
  const textDe = 'Dieser Inhalt ist blockiert, weil Sie keine Einwilligung zu Cookies gegeben haben.';
  const text = currentLanguage === 'en' ? textEn : textDe;

  const buttonEn = 'Change cookie settings';
  const buttonDe = 'Cookie-Einstellungen ändern';
  const button = currentLanguage === 'en' ? buttonEn : buttonDe;

  const placeholder = document.createElement('div');
  placeholder.className = 'consent-placeholder';
  placeholder.innerHTML = `
    <div class="consent-placeholder-inner">
      <p>${text}</p>
      <button class="button primary">${button}</button>
    </div>`;

  placeholder.querySelector('button').onclick = (e) => {
    e.preventDefault();
    document.querySelector('.cc-revoke')?.click();
  };

  block.replaceChildren(placeholder);
}

function handleConsentAction(onConsent, consentName, block) {
  const currentStatus = window.cookieconsent.currentConsentStatus();
  if (currentStatus[consentName]) onConsent();
  else renderNoConsent(block);
}

/**
 * Prüft den Consent-Status und führt die entsprechende Funktion aus.
 * @param {Function} onConsent - Wird ausgeführt, wenn Consent vorhanden ist.
 * @param {string} consentName - Der Name/Key des benötigten Consents (z.B. 'marketing').
 * @param {HTMLElement} block - Das DOM-Element, in dem der Platzhalter eingefügt werden soll.
 */
export async function initConsentGuard(onConsent, consentName, block) {
  const waitForLibrary = () => new Promise((res) => {
    const i = setInterval(() => {
      if (window.cookieconsent) {
        clearInterval(i);
        res();
      }
    }, 100);
    if (window.cookieconsent) {
      clearInterval(i);
      res();
    }
  });
  await waitForLibrary();

  handleConsentAction(onConsent, consentName, block);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.cc-btn')) return;
    handleConsentAction(onConsent, consentName, block);
  });
}
