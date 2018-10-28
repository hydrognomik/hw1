# Архитектура

"Фреймворк" находится в `src/client/scripts/create-store.ts`

## API (как у Redux)
`createStore` - создаёт стор и возвращает объект с его методами;
`reducer` - определяет как будет изменяться стор;
`action` - объект описывающий изменения стора;

### `createStore()`

```js
createStore(reducer: () => {}) => { getState, dispatch, subscribe }
```

#### `getState()`

Возвращает текущее состояние.

#### `dispatch()`

Диспатчит экшн, который изменит состояние.

```js
dispatch(action: object) => void
```

#### `subscribe()`

Подписывает функцию на изменение состояния (и возвращает функцию, которая отписывает).

```js
subscribe(listener: () => void) => () => void
```

## Запуск

```
npm i

npm run start-dev
```

## Сборка

```
npm run duild
```

### Ссылка

[Тык](https://hydrognomik.github.io/)
