const content = document.querySelector('.content');
const template = document.getElementById('cardTemplate');
const graphTemplate = document.getElementById('graphTemplate');
const thermalTemplate = document.getElementById('thermalTemplate');
const playerTemplate = document.getElementById('playerTemplate');
const buttonsTemplate = document.getElementById('buttonsTemplate');
const camTemplate = document.getElementById('camTemplate');

fetch('http://localhost:8000/api/events/')
  .then(res => res.json())
  .then(({ events }) => templateEngine(events))
  .catch(err => templateEngine([
    {
      description: err,
      size: 'm'
    }
  ]));

const templateEngine = events => {
  for (let event of events) {
    const {
      type,
      title,
      source,
      time,
      description,
      icon,
      size,
      data
    } = event;
    const clone = document.importNode(template.content, true);
    const image = new Image();
    const cardBody = clone.querySelector('.card__body');

    image.src = `./assets/${icon}.svg`;

    clone.querySelector('.card')
      .classList
      .add(`card_size_${size}`, `card_type_${type}`);
    clone.querySelector('.card__title-icon').appendChild(image);
    clone.querySelector('.card__title-text').textContent = title;
    clone.querySelector('.card__meta-source').textContent = source;
    clone.querySelector('.card__meta-time').textContent = time;

    if (description) {
      clone.querySelector('.card__description').textContent = description;
    } else {
      cardBody.style.display = 'none';
    }

    if (data) {
      switch (Object.keys(data)[0]) {
        case 'type': {
          graphTemplate.content.querySelector('.card__content-graph')
            .src = './assets/richdata.svg';
          const cloneGraph = document.importNode(graphTemplate.content, true);

          cardBody.appendChild(cloneGraph);
          break;
        }

        case 'temperature': {
          thermalTemplate.content.querySelector('.card__content-temp')
            .innerText += data.temperature + ' C';
          thermalTemplate.content.querySelector('.card__content-humi')
            .innerText += data.humidity + '%';
          const cloneThermal = document.importNode(thermalTemplate.content, true);

          cardBody.appendChild(cloneThermal);
          break;
        }

        case 'albumcover': {
          playerTemplate.content.querySelector('.player__albumcover')
            .src = data.albumcover;
          playerTemplate.content.querySelector('.player__artist')
            .innerText = data.artist;
          playerTemplate.content.querySelector('.player__track-name')
            .innerText = data.track.name;
          playerTemplate.content.querySelector('.player__track-length-value')
            .innerText = data.track.length;
          playerTemplate.content.querySelector('.player__volume-value')
            .innerText += data.volume + '%';
          const clonePlayer = document.importNode(playerTemplate.content, true);

          cardBody.appendChild(clonePlayer);
          break;
        }

        case 'buttons': {
          for (let button of data.buttons) {
            const newButton = document.createElement('div');
            const className = button === 'Да' ? ['button', 'button_theme_yellow'] : ['button'];

            newButton.innerText = button;
            newButton.classList.add(...className);
            buttonsTemplate.content.querySelector('.card__content-buttons')
              .appendChild(newButton);
          }
          const cloneButtons = document.importNode(buttonsTemplate.content, true);

          cardBody.appendChild(cloneButtons);
          break;
        }

        case 'image': {
          camTemplate.content.querySelector('.camera__image')
            .src = data.image;
          const cloneCam = document.importNode(camTemplate.content, true);

          cardBody.appendChild(cloneCam);
          break;
        }

        default: {
          cardBody.innerText += 'Нет данных';
        }
      }

    }

    content.appendChild(clone);
  }
};
