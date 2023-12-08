import { loadScript } from '../../scripts/lib-franklin.js';

export default async function decorate() {
  await loadScript('https://js.hsforms.net/forms/embed/v2.js');

  window.hbspt.forms.create({
    region: 'na1',
    portalId: '3458432',
    formId: 'a9f10e4b-6c50-442b-ae10-df1b06d21e6f',
    target: '.form',
  });
}
