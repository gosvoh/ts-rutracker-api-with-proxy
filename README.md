# ts-rutracker-api-with-proxy

- [English](https://github-com.translate.goog/fertkir/rutracker-api/blob/master/README.md?_x_tr_sl=ru&_x_tr_tl=en&_x_tr_hl=en&_x_tr_pto=wapp)

Позволяет искать по раздачам трекера Rutracker.org. Поскольку поиск запрещён для незарегистрированных пользователей, также поддерживаетcя и авторизация.

Данная библиотека - форк [rutracker-api-with-proxy](https://www.npmjs.com/package/rutracker-api-with-proxy), в котором:

1. Обновлены зависимости до последних версий (частично).
2. Добавлена поддержка TypeScript.
3. Добавлена возможность получать постер раздачи, если он существует (по-умолчанию false).

## Установка

Запусти `npm install ts-rutracker-api-with-proxy` (предполагается, что Node.js и пакетный менеждер npm у вас уже установлены). Для работы требуется версия Node.js >= 18.16.0.

## API

### RutrackerApi#login({ username, password }), RutrackerApi#login(username, password),

Возвращает Promise<>. Promise упадет, если были введены неправильные `username` или `password`.

```ts
import RutrackerApi from "ts-rutracker-api-with-proxy";
const rutracker = new RutrackerApi();

rutracker
  .login({ username: "", password: "" })
  .then(() => {
    console.log("Authorized");
  })
  .catch((err) => console.error(err));
```

### RutrackerApi#search({ query, sort, order, fetchPosters }), ### RutrackerApi#search(query, sort, order, fetchPosters)

Возвращает Promise<[Torrent](#torrent)[]>. Параметр `sort` может принимать одно из следующих значений: [`"registered"`](#registered), [`"title"`](#title), [`"downloads"`](#downloads), [`"size"`](#size), `"lastMessage"`, [`"seeds"`](#seeds) или [`"leeches"`](#leeches). Параметр `order` может принимать значение `desc` или `asc`. Когда указан параметр `order`, `sort` также должен быть указан.

```ts
import RutrackerApi from "ts-rutracker-api-with-proxy";
const rutracker = new RutrackerApi();

rutracker
  .login({ username: "", password: "" })
  .then(() =>
    rutracker.search({ query: "your query", sort: "size", fetchPosters: true })
  )
  .then((torrents) => console.log(torrents));
```

### RutrackerApi#download(torrentId)

Возвращает Promise<[fs.ReadableStream](https://nodejs.org/api/stream.html#stream_readable_streams)>.

```ts
import * as fs from "fs";
import RutrackerApi from "ts-rutracker-api-with-proxy";
const rutracker = new RutrackerApi();

rutracker
  .login({ username: "", password: "" })
  .then(() => rutracker.download("id"))
  .then((stream) => stream.pipe(fs.createWriteStream("filename.torrent")));
```

### RutrackerApi#getMagnetLink(torrentId)

Возвращает Promise<string>.

```ts
import RutrackerApi from "ts-rutracker-api-with-proxy";
const rutracker = new RutrackerApi();

rutracker
  .login({ username: "", password: "" })
  .then(() => rutracker.getMagnetLink("id"))
  .then((uri) => console.log(uri));
```

<a name="proxy"/>

### Работа через HTTP(S)-proxy

```ts
import RutrackerApi from "ts-rutracker-api-with-proxy";
const rutracker = new RutrackerApi("https://rutracker.org", {
  proxy: {
    protocol: "http",
    // protocol: "https",
    host: "127.0.0.1",
    port: "1080",
    // auth: {
    //   username: "user",
    //   password: "password"
    // }
  },
});
```

### Работа через SOCKS-proxy

```ts
import { SocksProxyAgent } from "socks-proxy-agent";
import RutrackerApi from "ts-rutracker-api-with-proxy";
const rutracker = new RutrackerApi("https://rutracker.org", {
  httpsAgent: new SocksProxyAgent({
    protocol: "socks5",
    hostname: "127.0.0.1",
    port: "1080",
    // username: "user",
    // password: "password"
  }),
});
```

## Типы

### Torrent

#### Свойства

##### id

Тип: `string`. Уникальный идентификатор раздачи. Используйте это свойство в методах [`RutrackerApi#download`](#rutrackerapidownloadtorrentid) и [`RutrackerApi#getMagnetLink`](#rutrackerapigetmagnetlinktorrentid).

##### title

Тип: `string`. Заголовок раздачи.

##### author

Тип: `string`. Имя пользователя, который создал раздачу.

##### category

Тип: `string`. Имя категории.

##### size

Тип: `number`. Размер раздачи в байтах.

##### formattedSize

Тип: `string`. Форматированный размер раздачи, похожий на тот, что выводит сам RuTracker. Например, `"3.03 GB"`.

##### seeds

Тип: `number`. Количество активных сидеров.

##### leeches

Тип: `number`. Количество активных личеров.

##### state

Тип: `string`. Текущий статус раздачи. Для сравнения используйте статические свойства объекта Torrent.

```ts
const approvedTorrents = torrents.filter(
  (torrent) => torrent.state === Torrent.APPROVED
);
```

##### downloads

Тип: `number`. Количество скачиваний торрент-файла.

##### registered

Тип: `Date`. Дата, когда торрент был зарегистрирован.

##### imageUri

Тип: `string`. Ссылка на постер раздачи.

##### url

Тип: `string`. Ссылка на страницу раздачи.

#### Статические свойства

##### Torrent.APPROVED

Константа для статуса `проверено`.

##### Torrent.NOT_APPROVED

Константа для статуса `не проверено`.

##### Torrent.NEED_EDIT

Константа для статуса `недооформлено`.

##### Torrent.DUBIOUSLY

Константа для статуса `сомнительно`.

##### Torrent.CONSUMED

Константа для статуса `поглощена`.

##### Torrent.TEMPORARY

Константа для статуса `временная`.
