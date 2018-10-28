import { qs } from '../../utils';

interface ImageState {
  leftMin: number;
  left: number;
  leftMax: number;
  zoomMin: number;
  zoom: number;
  zoomMax: number;
  brightnessMin: number;
  brightness: number;
  brightnessMax: number;
}

interface IGesture {
  startZoom?: number;
  startDistance?: number;
  startBrightness?: number;
  startAngle?: number;
  angleDiff?: number;
  type: string | null;
}

setTimeout(() => {
  const image = qs('.camera__image');
  const wrapper = qs('.camera__image-wrapper');
  const currentPointerEvents: { [index: string]: PointerEvent } = {};
  let imageState: ImageState;

  if (image) {
    imageState = {
      brightness: 1,
      brightnessMax: 4,
      brightnessMin: .2,
      left: 0,
      leftMax: 0,
      leftMin: -(image.offsetWidth - (image.parentNode as HTMLElement).offsetWidth),
      zoom: 100,
      zoomMax: 200,
      zoomMin: 100,
    };
  }

  type Gesture = IGesture | null;
  let gesture: Gesture = null;

  const onPointerDown = (event: PointerEvent) => {
    currentPointerEvents[event.pointerId] = event;

    if (!gesture) {
      gesture = { type: 'move' };
    }
  };

  const getDistance = (e1: PointerEvent, e2: PointerEvent): number => {
    const {clientX: x1, clientY: y1} = e1;
    const {clientX: x2, clientY: y2} = e2;

    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
  };

  const getAngle = (e1: PointerEvent, e2: PointerEvent): number => {
      const {clientX: x1, clientY: y1} = e1;
      const {clientX: x2, clientY: y2} = e2;
      const r = Math.atan2(x2 - x1, y2 - y1);

      return 360 - (180 + Math.round(r * 180 / Math.PI));
  };

  const feedbackNodes: {[key: string]: HTMLElement | null} = {
    brightness: qs('.camera__brightness-value'),
    zoom: qs('.camera__zoom-value'),
  };

  const setFeedback = (name: string, value: number) => {
    const node = feedbackNodes[name];

    if (node) {
      node.innerText = String(Math.round(value * 100) / 100);
    }
  };

  const setLeft = (dx: number) => {
    wrapper.scrollLeft += dx;
  };

  const onPointerMove = (event: PointerEvent) => {
    const pointersCount = Object.keys(currentPointerEvents).length;

    if (pointersCount === 0 || !gesture) {
      return;
    }

    if (pointersCount === 1 && gesture && gesture.type === 'move') {
      const previousEvent = currentPointerEvents[event.pointerId];
      const dx = previousEvent.clientX - event.clientX;

      setLeft(dx);
      currentPointerEvents[event.pointerId] = event;

    } else if (pointersCount === 2) {
      currentPointerEvents[event.pointerId] = event;
      const events = Object.keys(currentPointerEvents)
        .map((key) => currentPointerEvents[key]);
      const distance = getDistance(events[0], events[1]);
      const angle = getAngle(events[0], events[1]);

      if (gesture && !gesture.startDistance) {
        gesture.startZoom = imageState.zoom;
        gesture.startDistance = distance;
        gesture.startBrightness = imageState.brightness;
        gesture.startAngle = angle;
        gesture.angleDiff = 0;
        gesture.type = null;
      }

      const diff = distance - Number(gesture.startDistance);
      const angleDiff = angle - Number(gesture.startAngle);

      if (!gesture.type) {
        if (Math.abs(diff) < 32 && Math.abs(angleDiff) < 8) {
          return;
        } else if (Math.abs(diff) > 32) {
          gesture.type = 'zoom';
        } else {
          gesture.type = 'rotate';
        }
      }

      if (gesture.type === 'zoom') {
        const { zoomMin, zoomMax } = imageState;
        let zoom = Number(gesture.startZoom) + diff;
        zoom = diff < 0 ? Math.max(zoom, zoomMin) : Math.min(zoom, zoomMax);

        imageState.zoom = zoom;
        image.style.transform = `scale(${zoom / 100})`;
        setFeedback('zoom', zoom);
      }

      if (gesture.type === 'rotate') {
        const {brightnessMin, brightnessMax} = imageState;

        if (Math.abs(angleDiff - Number(gesture.angleDiff)) > 300) {
          gesture.startBrightness = imageState.brightness;
          gesture.startAngle = angle;
          gesture.angleDiff = 0;
          return;
        }
        gesture.angleDiff = angleDiff;
        let brightness = Number(gesture.startBrightness) + angleDiff / 50;
        brightness = angleDiff < 0
          ? Math.max(brightness, brightnessMin)
          : Math.min(brightness, brightnessMax);

        imageState.brightness = brightness;
        image.style.filter = `brightness(${brightness})`;
        setFeedback('brightness', brightness);
      }
    }
  };

  const onPointerUp = (event: PointerEvent) => {
    gesture = null;

    delete currentPointerEvents[event.pointerId];
  };

  if (image) {
    image.addEventListener('pointerdown', onPointerDown);
    image.addEventListener('pointermove', onPointerMove);

    image.addEventListener('pointerup', onPointerUp);
    image.addEventListener('pointercancel', onPointerUp);
    image.addEventListener('pointerleave', onPointerUp);
  }
}, 1000);
