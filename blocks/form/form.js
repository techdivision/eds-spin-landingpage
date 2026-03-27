import { loadScript } from '../../scripts/lib-franklin.js';
import { debounce, initConsentGuard } from '../../scripts/utilities.js';

function rearrangeInputLabels() {
  const forms = document.querySelectorAll('form');
  forms.forEach((form) => {
    const inputWrappers = form.querySelectorAll('.hs-fieldtype-text, .hs-fieldtype-phonenumber, .hs-fieldtype-booleancheckbox');
    inputWrappers.forEach((input) => {
      const inputElement = input.querySelector('input');
      const inputLabel = input.querySelector('label');
      if (inputElement && inputLabel) {
        input.prepend(inputLabel);
        input.prepend(inputElement);
        input.querySelector('.input').remove();
      }
    });
  });
}

export default function decorate(block) {
  block.dataset.formId = block.children[0].children[0].innerHTML;
  block.innerHTML = 'loading';

  async function onConsent() {
    await loadScript('https://js.hsforms.net/forms/embed/v2.js');
    if (block.dataset.hubspotInitialized) return;
    block.dataset.hubspotInitialized = 'true';
    block.dataset.formIndex = '0';
    window.hbspt.forms.create({
      region: 'na1',
      portalId: '3458432',
      formId: block.dataset.formId,
      target: '[data-form-id][data-form-index=\'0\']',
    });

    const debouncedRearrangeInputLabels = debounce(() => rearrangeInputLabels());
    debouncedRearrangeInputLabels();
  }

  function onRevoke() {
    if (!block.dataset.hubspotInitialized) return;
    window.location.reload();
  }

  initConsentGuard(onConsent, 'marketing', block, onRevoke);
}
