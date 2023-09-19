async function getVimeoApiInformation(videoLink) {
  const url = `https://vimeo.com/api/oembed.json?url=${videoLink}`;
  const apiData = await fetch(url);
  return apiData.json();
}

function getSrcsetFromApiData(vimeoApiData) {
  const srcsetArray = [];
  const imgWidths = ['1280', '960', '640'];
  imgWidths.forEach((width) => {
    let url = vimeoApiData.thumbnail_url_with_play_button.replaceAll(`${vimeoApiData.thumbnail_width}x${vimeoApiData.thumbnail_height}`, `${width}`);
    url += ` ${width}w`;
    srcsetArray.push(
      url,
    );
  });
  return srcsetArray.join(', ');
}

function getVideoUrlSuffixes(suffixes = []) {
  return `?${suffixes.join('&')}`;
}

function getThumbnailImage(vimeoApiData) {
  // construct source
  const source = document.createElement('source');
  source.setAttribute('srcset', getSrcsetFromApiData(vimeoApiData));
  // construct img
  const img = document.createElement('img');
  img.setAttribute('src', vimeoApiData.thumbnail_url_with_play_button);
  img.setAttribute('data-sizes', 'auto');
  img.setAttribute('loading', 'lazy');
  img.setAttribute('alt', vimeoApiData.title ? vimeoApiData.title : '');
  // construct picture
  const picture = document.createElement('picture');
  picture.appendChild(source);
  picture.appendChild(img);
  // return
  return picture;
}

function getIframeTag(vimeoApiData) {
  // prepare
  const suffixes = ['dnt=1', 'autoplay=true'];
  const vimeoEmbedUrl = `https://player.vimeo.com/video/${vimeoApiData.video_id}${getVideoUrlSuffixes(suffixes)}`;
  // construct iframe
  const iframe = document.createElement('iframe');
  iframe.setAttribute('frameborder', 0);
  iframe.setAttribute('data-src', vimeoEmbedUrl);
  iframe.setAttribute('data-video', 'embedVideo');
  iframe.setAttribute('src', '');
  iframe.setAttribute('webkitallowfullscreen', true);
  iframe.setAttribute('mozallowfullscreen', true);
  iframe.setAttribute('allowfullscreen', true);
  iframe.setAttribute('allow', 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture');
  iframe.setAttribute('title', vimeoApiData.title ? vimeoApiData.title : 'Vimeo Video');
  // return
  return iframe;
}

function registerClickEvent(wrapper) {
  const picture = wrapper.querySelector('picture');
  const iframe = wrapper.querySelector('iframe');
  picture.addEventListener('click', () => {
    picture.classList.add('vimeo-video-active');
    iframe.setAttribute('src', iframe.getAttribute('data-src'));
  });
}

export default function decorate(block) {
  // prepare
  const videoLink = block.querySelector('div').innerText.trim();
  if (!videoLink.length) {
    block.classList.add('hidden');
    return;
  }
  getVimeoApiInformation(videoLink).then((vimeoApiData) => {
    // construct wrapper
    const wrapper = document.createElement('div');
    wrapper.classList.add('vimeo-video-wrapper');
    wrapper.appendChild(getThumbnailImage(vimeoApiData));
    wrapper.appendChild(getIframeTag(vimeoApiData));
    // add click functionality
    registerClickEvent(wrapper);
    // fill block
    block.replaceChildren(wrapper);
  }).catch(() => {
    block.classList.add('hidden');
  });
}
