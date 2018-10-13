setTimeout(() => {
  const pointerEvs = [];
  let prevDiff = -1;
  let curX;
  let curAngle = 0;
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

    if (pointerEvs.length === 2) {
      const dx = pointerEvs[1].x - pointerEvs[0].x;
      const dy = pointerEvs[1].y - pointerEvs[0].y;

      // Zoom
      handlePinch(dx, dy);

      // Brightness
      handleRotate(dx, dy);
    }
  };

  const handlePinch = (dx, dy) => {
    const curDiff = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));

    if (prevDiff > 0) {
      if (curDiff > prevDiff && curScale < 2) {
        // Zoom in
        curScale += 0.03;
      }

      if (curDiff < prevDiff && curScale > 1) {
        // Zoom out
        curScale -= 0.03;
      }
      el.style.transform = `scale(${curScale})`;
    }

    prevDiff = curDiff;
    document.querySelector('.camera__zoom-value').innerText = Math.floor((curScale - 1) * 100);
  };

  const handleRotate = (dx, dy) => {
    curAngle = Math.atan2(dy, dx) * 180 / Math.PI;

    if (Math.abs(curAngle) >= 0 && Math.abs(curAngle) <= 50) {
      el.style.filter = `brightness(${100 + curAngle}%)`;
      document.querySelector('.camera__brightness-value').innerText = Math.floor((curAngle));
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
