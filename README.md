# SportsMap Краснодар

Публичная версия SportsMap для GitHub Pages.

## Что опубликовано

GitHub Pages умеет отдавать только статические HTML/CSS/JS-файлы. Поэтому на
адресе Pages опубликована статическая версия: главная страница повторяет стиль
исходного Flask-сайта, а карта вынесена в отдельную страницу.

Статический сайт лежит в `docs/`:

- `docs/index.html` - главная страница в стиле исходного сайта
- `docs/map.html` - публичная интерактивная карта
- `docs/assets/home.css` - стили главной страницы
- `docs/assets/site.css` - стили карты
- `docs/assets/site.js` - фильтры, список площадок и Leaflet-карта
- `docs/manifest.webmanifest` - manifest для браузера

## Важно

Полная Flask-версия с аккаунтами, встречами, чатами, модерацией и SQLite не
может работать на GitHub Pages, потому что GitHub Pages не запускает Python-
сервер. Для полной версии нужен backend-хостинг, например Render, Railway,
PythonAnywhere или VPS. GitHub в таком варианте остается репозиторием кода.

## Ссылка

```text
https://art0ffff.github.io/sport/
```
