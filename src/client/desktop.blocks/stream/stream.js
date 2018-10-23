const initVideo = (video, url) => {
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
  'http://localhost:9191/master?url=http%3A%2F%2Flocalhost%3A3102%2Fstreams%2Fhall%2Fmaster.m3u8'
];

videos.forEach((video, idx) => initVideo(video, urls[idx]));

const streams = document.querySelectorAll('[id^="stream"]');
const allStreamsButton = document.getElementById('all-streams');
const canvas = document.querySelector('.volume-analyser');
const streamUi = document.querySelector('.stream__ui');
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioCtx.createAnalyser();
const brightnessInput = document.querySelector('.stream-brightness');
const contrastInput = document.querySelector('.stream-contrast');
const brightnessIndicator = document.getElementById('brightness-indicator');
const sources = {};
let analyserReqId;
let brightnessReqId;
let stream;
let curSource;
let zoomInAnim;

const drawVolumeAnalyser = analyser => {
  const HEIGHT = 120;
  const canvasCtx = canvas.getContext('2d');

  analyserReqId = requestAnimationFrame(() => drawVolumeAnalyser(analyser));

  analyser.fftSize = 32;
  const bufferLength = analyser.frequencyBinCount;
  const data = new Uint8Array(bufferLength);

  analyser.getByteFrequencyData(data);

  const dataArray = Array.prototype.slice.call(data);
  const barHeight = Math.max(...dataArray);

  canvasCtx.fillStyle = '#fafafa';
  canvasCtx.fillRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  canvasCtx.fillStyle = '#ffd93e';
  canvasCtx.fillRect(
    0,
    HEIGHT - barHeight / 4,
    canvas.width,
    barHeight
  );
};

const drawBrightnessIndicator = () => {
  const canvas = document.createElement('canvas');

  canvas.width = 1;
  canvas.height = 1;
  const canvasSize = [0, 0, 1, 1];
  const ctx = canvas.getContext('2d');

  ctx.drawImage(stream, ...canvasSize);
  const { data: [r, g, b] } = ctx.getImageData(...canvasSize);
  const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

  brightnessIndicator.style.backgroundColor = `
    rgb(${brightness}, ${brightness}, ${brightness})
  `;
  brightnessReqId = requestAnimationFrame(drawBrightnessIndicator);
};

const onStreamClickHandler = event => {
  if (stream) {
    return;
  }

  event.preventDefault();
  stream = event.target;

  stream.classList.toggle('stream_expanded', true);
  streamUi.classList.toggle('stream__ui_hidden', false);
  brightnessIndicator.style.display = 'block';
  stream.muted = false;
  zoomInAnim = stream.animate({
    transform: ['scale(0.5)', 'scale(1)']
  }, {
    duration: 100,
    iterations: 1,
    ease: 'ease',
    delay: 0
  });

  if (!Object.keys(sources).includes(stream.id)) {
    sources[stream.id] = audioCtx.createMediaElementSource(stream);
  }

  curSource = sources[stream.id];

  curSource.connect(analyser);
  analyser.connect(audioCtx.destination);

  drawVolumeAnalyser(analyser);
  drawBrightnessIndicator();
};

streams.forEach(stream => {
  stream.addEventListener('click', onStreamClickHandler);
});

allStreamsButton.onclick = () => {
  zoomInAnim.reverse();
  zoomInAnim.onfinish = () => {
    stream.classList.toggle('stream_expanded', false);
    stream.muted = true;
    stream = null;
  };
  streamUi.classList.toggle('stream__ui_hidden', true);
  brightnessIndicator.style.display = 'none';
  curSource.disconnect();
  cancelAnimationFrame(analyserReqId);
  cancelAnimationFrame(brightnessReqId);
};

brightnessInput.addEventListener('input', e => {
  stream.style.filter = `brightness(${1 + e.target.value / 100})`;
});

contrastInput.addEventListener('input', e => {
  stream.style.filter = `contrast(${1 + e.target.value / 100})`;
});
