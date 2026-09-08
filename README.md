# SportsMap Краснодар

Публичная карта спортивных площадок Краснодара для GitHub Pages.

## Что опубликовано

GitHub Pages умеет отдавать только статические HTML/CSS/JS-файлы. Поэтому здесь
лежит публичная версия карты без Python-сервера, аккаунтов, встреч, чатов и
SQLite. Полная Flask-версия остается локально в рабочей папке проекта.

Статический сайт лежит в `docs/`:

- `docs/index.html` - страница карты
- `docs/assets/site.css` - стили
- `docs/assets/site.js` - фильтры, список площадок и Leaflet-карта
- `docs/manifest.webmanifest` - manifest для браузера

## Как включить сайт для всех

1. Откройте репозиторий: https://github.com/art0ffff/sport
2. Перейдите в `Settings` -> `Pages`.
3. В `Build and deployment` выберите `Source` -> `Deploy from a branch`.
4. Выберите `Branch` -> `main` и папку `/docs`.
5. Нажмите `Save`.

После публикации сайт будет здесь:

```text
https://art0ffff.github.io/sport/
```
