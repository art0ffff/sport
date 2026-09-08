# Chert

Flask app for a sports map with user meetings.

## Structure

- `backend/app.py` - Flask routes and API.
- `backend/db.py` - SQLite setup and data access helpers.
- `backend/templates/` - HTML templates.
- `backend/static/` - CSS and JavaScript assets.
- `backend/data/` - seed/import data used to initialize locations.
- `backend/instance/` - local runtime files: SQLite databases and secret key.
- `backend/scripts/` - maintenance and OSM import/export scripts.

## Run

```powershell
py run.py
```

The script creates `.venv` if it does not exist, installs dependencies, starts
the site at `http://127.0.0.1:5000`, and opens it in the browser.

## Public Site On GitHub Pages

GitHub Pages умеет публиковать только статические файлы, поэтому Flask-версия с
аккаунтами, встречами, чатами и SQLite остается для локального запуска. Публичная
версия для GitHub Pages лежит в `docs/` и показывает карту спортивных площадок
без Python-сервера.

Как опубликовать:

1. Загрузите репозиторий на GitHub.
2. Откройте `Settings` -> `Pages`.
3. В `Build and deployment` -> `Source` выберите `GitHub Actions`.
4. Сделайте push в `main` или `master`, либо вручную запустите workflow
   `Deploy GitHub Pages` во вкладке `Actions`.

Публичная ссылка появится в summary workflow после деплоя.
