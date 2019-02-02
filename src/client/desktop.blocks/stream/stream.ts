import { qs } from '../../utils';

declare const Hls: any;

const initVideo = (video: HTMLVideoElement, url: string) => {
  if (Hls.isSupported()) {
    const hls = new Hls();

    hls.attachMedia(video);
    hls.on(Hls.Events.MEDIA_ATTACHED, () => {
      hls.loadSource(url);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play();
      });
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = url;
    video.addEventListener('loadedmetadata', () => {
      video.play();
    });
  }
};

const videos = document.querySelectorAll('video');
const urls = [
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fcat%2Fmaster.m3u8',
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fdog%2Fmaster.m3u8',
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fsosed%2Fmaster.m3u8',
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8',
];

videos.forEach((video: HTMLVideoElement, idx: number) => initVideo(video, urls[idx]));

const canvas = qs<HTMLCanvasElement>('.volume-analyser');
const streamUi = qs('.stream__ui');
const contrastInput = qs('.stream-contrast');
const brightnessInput = qs('.stream-brightness');
const allStreamsButton = qs('.all-streams');
const brightnessIndicator = qs('.brightness-indicator');

// @ts-ignore из-за webkitAudioContext
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const sources: { [index: string]: MediaElementAudioSourceNode } = {};
let analyserReqId: number;
let brightnessReqId: number;
let stream: HTMLVideoElement | null;
let source: MediaElementAudioSourceNode;
let zoomInAnim: Animation;

/**
 * Анимирует увеличение видео
 * @param video DOM нода с видео
 */
const animateExpansion = (video: HTMLVideoElement): Animation => {
  const keyframes = {
    transform: ['scale(0.5)', 'scale(1)'],
  };
  const options: KeyframeAnimationOptions = {
    delay: 0,
    duration: 100,
    easing: 'ease',
    iterations: 1,
  };

  return video.animate(keyframes as PropertyIndexedKeyframes, options);
};

/**
 * Навешивает классы развёрнутого видео
 * @param video  DOM нода с видео
 */
const expandStream = (video: HTMLVideoElement) => {
  video.classList.toggle('stream_expanded', true);
  streamUi.classList.toggle('stream__ui_hidden', false);
  brightnessIndicator.style.display = 'block';
  video.muted = false;
};

/**
 * Рисует столбчатую диаграмму анализатора звука
 * @param analyserNode Нода анализатора звука
 */
const drawVolumeAnalyser = (analyserNode: AnalyserNode) => {
  const HEIGHT = 120;
  const ctx = canvas.getContext('2d');

  analyserReqId = requestAnimationFrame(() => drawVolumeAnalyser(analyserNode));

  analyserNode.fftSize = 32;
  const bufferLength = analyserNode.frequencyBinCount;
  const data = new Uint8Array(bufferLength);

  analyserNode.getByteFrequencyData(data);

  const dataArray = Array.prototype.slice.call(data);
  const barHeight = Math.max(...dataArray);

  if (ctx) {
    ctx.fillStyle = '#fafafa';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ffd93e';
    ctx.fillRect(0, HEIGHT - barHeight / 4, canvas.width, barHeight);
  }
};

/**
 * Рисует индикатор освещённости
 */
const drawBrightnessIndicator = () => {
  const cnvs = document.createElement('canvas');

  cnvs.width = 1;
  cnvs.height = 1;
  const ctx = cnvs.getContext('2d');

  if (ctx) {
    ctx.drawImage(stream as CanvasImageSource, 0, 0, 1, 1);
  }
  const imageData = ctx && ctx.getImageData(0, 0, 1, 1);
  const data = imageData && imageData.data;
  const [ r, g, b ] = Array.prototype.slice.call(data);
  const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  brightnessIndicator.style.backgroundColor = `
    rgb(${brightness}, ${brightness}, ${brightness})
  `;
  brightnessReqId = requestAnimationFrame(drawBrightnessIndicator);
};

const onStreamClick = (event: Event) => {
  if (stream) {
    return;
  }

  event.preventDefault();
  stream = event.target as HTMLVideoElement;

  expandStream(stream);
  zoomInAnim = animateExpansion(stream);

  if (!Object.keys(sources).includes(stream.id)) {
    sources[stream.id] = audioCtx.createMediaElementSource(stream);
  }

  source = sources[stream.id];

  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  drawVolumeAnalyser(analyser);
  drawBrightnessIndicator();
};

videos.forEach((video: HTMLVideoElement) => {
  video.addEventListener('click', onStreamClick);
});

allStreamsButton.addEventListener('click', () => {
  zoomInAnim.reverse();
  zoomInAnim.onfinish = () => {
    if (stream) {
      stream.classList.toggle('stream_expanded', false);
      stream.muted = true;
      stream = null;
    }
  };
  streamUi.classList.toggle('stream__ui_hidden', true);
  brightnessIndicator.style.display = 'none';
  source.disconnect();
  cancelAnimationFrame(analyserReqId);
  cancelAnimationFrame(brightnessReqId);
});

brightnessInput.addEventListener('input', (event: Event) => {
  const target: HTMLInputElement = event.target as HTMLInputElement;

  if (stream) {
    stream.style.filter = `brightness(${1 + Number(target.value) / 100})`;
  }
});

contrastInput.addEventListener('input', (event: Event) => {
  const target: HTMLInputElement = event.target as HTMLInputElement;

  if (stream) {
    stream.style.filter = `contrast(${1 + Number(target.value) / 100})`;
  }
});
