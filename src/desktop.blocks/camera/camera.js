setTimeout(() => {
  const pointerEvs = [];
  let prevDiff = -1;
  let curX;
  let curScale = 1;

  const el = document.querySelector('.camera__image');

  const onPointerDown = (event) => {
    el.setPointerCapture(event.pointerId);
    curX = event.x;
    pointerEvs.push(event);
  };

  const onPointerMove = (event) => {
    for (let i in pointerEvs) {
      if (event.pointerId === pointerEvs[i].pointerId) {
        pointerEvs[i] = event;
        break;
      }
    }

    // Move
    if (pointerEvs.length === 1) {
      const dx = curX - event.x;

      curX = event.x;
      document.querySelector('.camera__image-wrapper').scrollLeft += dx;
    }

    // Zoom
    if (pointerEvs.length === 2) {
      const curDiff = Math.sqrt(
        Math.pow((pointerEvs[1].x - pointerEvs[0].x), 2) +
        Math.pow((pointerEvs[1].y - pointerEvs[0].y), 2)
      );

      if (prevDiff > 0) {
        if (curDiff > prevDiff && curScale < 2) {
          // Zoom in
          el.style.transform = `scale(${curScale + 0.05})`;
          curScale = curScale + 0.05;
        }

        if (curDiff < prevDiff && curScale > 1) {
          // Zoom out
          el.style.transform = `scale(${curScale - 0.05})`;
          curScale = curScale - 0.05;
        }
      }

      prevDiff = curDiff;

      document.querySelector('.camera__zoom-value').innerText = Math.floor((curScale - 1) * 100);
    }
  };

  const onPointerUp = (event) => {
    for (let i in pointerEvs) {
      if (event.pointerId === pointerEvs[i].pointerId) {
        pointerEvs.splice(i, 1);
        break;
      }
    }

    if (pointerEvs.length < 2) prevDiff = -1;
  };

  el.addEventListener('pointerdown', onPointerDown);
  el.addEventListener('pointermove', onPointerMove);

  el.addEventListener('pointerup', onPointerUp);
  el.addEventListener('pointercancel', onPointerUp);
  el.addEventListener('pointerout', onPointerUp);
  el.addEventListener('pointerleave', onPointerUp);
}, 1000);
