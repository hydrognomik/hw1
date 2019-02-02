import { qs } from '../../utils';

const content = qs('.content');
const template = qs<HTMLTemplateElement>('#cardTemplate');
const graphTemplate = qs<HTMLTemplateElement>('#graphTemplate');
const thermalTemplate = qs<HTMLTemplateElement>('#thermalTemplate');
const playerTemplate = qs<HTMLTemplateElement>('#playerTemplate');
const buttonsTemplate = qs<HTMLTemplateElement>('#buttonsTemplate');
const camTemplate = qs<HTMLTemplateElement>('#camTemplate');

interface Track {
  length: string,
  name: string
}

interface SHEventData {
  temperature?: string,
  humidity?: string,
  albumcover: string,
  artist: string,
  track: Track,
  volume: string,
  buttons: string[],
  image: string
}

interface SHEvent {
  type: string
  title: string
  source: string
  time: string
  icon: string
  size: string
  description?: string
  data?: SHEventData
}

const templateEngine = (events: SHEvent[]) => {
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
    const clone = template && template.content && document.importNode(template.content, true);
    if (clone) {
      const cardBody = qs('.card__body', clone);
      const image = new Image();

      image.src = `./assets/${icon}.svg`;

      qs('.card', clone)
        .classList
        .add(`card_size_${size}`, `card_type_${type}`);
      qs('.card__title-icon', clone).appendChild(image);
      qs('.card__title-text', clone).textContent = title;
      qs('.card__meta-source', clone).textContent = source;
      qs('.card__meta-time', clone).textContent = time;

      if (description) {
        qs('.card__description', clone).textContent = description;
      } else {
        cardBody && (cardBody.style.display = 'none');
      }

      if (data) {
        switch (Object.keys(data)[0]) {
          case 'type': {
            if (graphTemplate) {
              qs<HTMLImageElement>('.card__content-graph', graphTemplate.content)
                .src = './assets/richdata.svg';

              const cloneGraph = document.importNode(graphTemplate.content, true);
              cardBody && cardBody.appendChild(cloneGraph);
            }

            break;
          }

          case 'temperature': {
            if (thermalTemplate) {
              qs('.card__content-temp', thermalTemplate.content)
                .innerText += data.temperature + ' C';
              qs('.card__content-humi', thermalTemplate.content)
                .innerText += data.humidity + '%';
              const cloneThermal = document.importNode(thermalTemplate.content, true);

              cardBody && cardBody.appendChild(cloneThermal);
            }
            break;
          }

          case 'albumcover': {
            if (playerTemplate) {
              qs<HTMLImageElement>('.player__albumcover', playerTemplate.content)
                .src = data.albumcover;
              qs('.player__artist', playerTemplate.content)
                .innerText = data.artist;
              qs('.player__track-name', playerTemplate.content)
                .innerText = data.track.name;
              qs('.player__track-length-value', playerTemplate.content)
                .innerText = data.track.length;
              qs('.player__volume-value', playerTemplate.content)
                .innerText += data.volume + '%';
              const clonePlayer = document.importNode(playerTemplate.content, true);

              cardBody && cardBody.appendChild(clonePlayer);
            }
            break;
          }

          case 'buttons': {
            if (buttonsTemplate) {
              for (let button of data.buttons) {
                const newButton = document.createElement('div');
                const className = button === 'Да' ? ['button', 'button_theme_yellow'] : ['button'];

                newButton.innerText = button;
                newButton.classList.add(...className);
                qs('.card__content-buttons', buttonsTemplate.content)
                  .appendChild(newButton);
              }
              const cloneButtons = document.importNode(buttonsTemplate.content, true);

              cardBody && cardBody.appendChild(cloneButtons);
            }
            break;
          }

          case 'image': {
            if (camTemplate) {
              qs<HTMLImageElement>('.camera__image', camTemplate.content)
                .src = data.image;
              const cloneCam = document.importNode(camTemplate.content, true);

              cardBody && cardBody.appendChild(cloneCam);
            }
            break;
          }

          default: {
            cardBody && (cardBody.innerText += 'Unexpected data');
          }
        }
      }

      content && content.appendChild(clone);
    }
  }
};

fetch('http://localhost:8000/api/events/')
  .then((res: Response) => res.json())
  .then(({ events }) => templateEngine(events))
  .catch((err: string) => templateEngine([{
    title: err,
    size: 'm',
    type: 'info',
    source: 'server',
    time: Date.now().toLocaleString('ru-Ru'),
    icon: 'stats'
  }]));
