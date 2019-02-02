import { SET_EVENTS, SET_PAGE } from '../constants';
import { IAction } from '../create-store';

export interface ITrack {
  length: string;
  name: string;
}

export interface IEventData {
  temperature?: string;
  humidity?: string;
  albumcover: string;
  artist: string;
  track: ITrack;
  volume: string;
  buttons: string[];
  image: string;
}

export interface IEvent {
  type: string;
  title: string;
  source: string;
  time: string;
  icon: string;
  size: string;
  description?: string;
  data?: IEventData;
}

export interface IState {
  events?: IEvent[];
  page?: string;
}

export type IReducer = (state: any, action: IAction) => any;

const reducer: IReducer = (state: IState = {}, { type, data }: IAction): IState => {
  switch (type) {
    case SET_PAGE:
      window.localStorage.setItem('SH_Page', data.page);

      return { ...state, page: data.page };
    case SET_EVENTS:
      return { ...state, events: data.events };
    default:
      return state;
  }
};

export default reducer;
