# Портфолио онлайн + ссылка на Kwork

Живая витрина: **https://kirikos37.github.io/test/**

---

## Часть 1. Выложить портфолио на GitHub Pages

### Шаг 1. Отправить код на GitHub

В терминале из корня проекта:

```bash
cd D:/projects/test
git add portfolio/ .github/workflows/deploy-portfolio.yml
git commit -m "Add portfolio and GitHub Pages deploy"
git push origin main
```

### Шаг 2. Включить GitHub Pages (один раз)

1. Откройте репозиторий: https://github.com/kirikos37/test  
2. **Settings** → слева **Pages**  
3. В блоке **Build and deployment**:
   - **Source:** `GitHub Actions` (не «Deploy from branch»)
4. Сохраните — больше ничего не нужно.

### Шаг 3. Дождаться деплоя

1. Вкладка **Actions** → workflow **Deploy portfolio to GitHub Pages**  
2. Зелёная галочка = сайт опубликован (обычно 1–2 минуты)  
3. Откройте: **https://kirikos37.github.io/test/**

Если страница 404 — подождите 2–5 минут и обновите. Первый деплой иногда дольше.

### Шаг 4. Проверить демо

| Страница | Ссылка |
|----------|--------|
| Витрина | https://kirikos37.github.io/test/ |
| React-демо | https://kirikos37.github.io/test/projects/06-react-interactive.html |
| Доработка CMS (примеры) | https://kirikos37.github.io/test/projects/01-saas-landing.html |

---

## Часть 2. Добавить ссылку на Kwork

### A. В описании кворка

В текст описания (в конец) добавьте блок:

```
Живые демо моих работ (можно открыть в браузере):
https://kirikos37.github.io/test/

Примеры:
• React-интерфейс — https://kirikos37.github.io/test/projects/06-react-interactive.html
• Лендинг SaaS — https://kirikos37.github.io/test/projects/01-saas-landing.html
• Доработка под бизнес — https://kirikos37.github.io/test/projects/02-coffee-shop.html

Учебные demo-проекты — показывают уровень и стиль кода.
```

**Где вставить на Kwork:**  
Редактирование кворка → поле **«Описание»** → вставить перед блоком «Что нужно от покупателя».

---

### B. В портфолио Kwork (к каждой работе)

При загрузке скриншота из `portfolio/screenshots/kwork/`:

1. **Название работы** — из `portfolio/KWORK-PORTFOLIO.md`  
2. **Описание** — текст + в конце строка:

```
Живое демо: https://kirikos37.github.io/test/projects/06-react-interactive.html
```

Подставьте нужный файл для каждой работы:

| Скриншот | Ссылка на демо |
|----------|----------------|
| 01-react-interactive | `.../projects/06-react-interactive.html` |
| 02-developer-portfolio | `.../projects/03-developer-portfolio.html` |
| 03-saas-landing | `.../projects/01-saas-landing.html` |
| 04-coffee-shop | `.../projects/02-coffee-shop.html` |
| 05-fitness-app | `.../projects/04-fitness-app.html` |
| 06-online-course | `.../projects/05-online-course.html` |

3. **Видео или GIF (опционально)** — запишите 30 сек экрана с прокруткой демо (сильно повышает доверие).

---

### C. В профиле продавца

1. **Профиль** → **Редактировать**  
2. Поле **«О себе»** — добавьте:

```
Frontend и React-разработчик. Лендинги, доработка WordPress/Tilda/Bitrix.

Портфолио с живыми демо: https://kirikos37.github.io/test/
```

3. **Сайт / портфолио** (если есть поле) — та же ссылка.

---

## Готовые тексты для кворка «Доработка сайта»

Вставьте в описание (можно заменить текущий блок):

```
Доработаю ваш сайт на WordPress, Tilda или 1С‑Битрикс: исправлю ошибки, добавлю блоки, формы, интерактив на React.

Живые примеры моих работ:
https://kirikos37.github.io/test/

Что делаю:
• правки вёрстки и адаптива;
• новые блоки на Tilda / шаблоны WP / модули Битрикс;
• интерактив на JavaScript и React;
• работа с MySQL, формы, базовая SEO.

Честно: демо в портфолио — учебные проекты для показа уровня. Коммерческие задачи делаю по вашему ТЗ.

Напишите в сообщения — оценю срок и стоимость после уточнения задачи.
```

---

## Обновление сайта после правок

После изменений в папке `portfolio/`:

```bash
git add portfolio/
git commit -m "Update portfolio"
git push
```

GitHub Actions автоматически обновит сайт через 1–2 минуты.

---

## Частые проблемы

| Проблема | Решение |
|----------|---------|
| 404 на GitHub Pages | Settings → Pages → Source = **GitHub Actions** |
| Actions не запускается | Проверьте push в ветку `main` |
| Демо без стилей | Открывайте через `https://`, не `file://` |
| Kwork не кликает ссылку | Ссылка должна начинаться с `https://` |

---

## Ваш логин Kwork

Когда выберете логин (например `kirilldev`), замените в витрине ссылку «Написать на Kwork» в `portfolio/index.html`:

```html
<a href="https://kwork.ru/user/ВАШ_ЛОГИН" ...>
```

После правки — снова `git push`.
