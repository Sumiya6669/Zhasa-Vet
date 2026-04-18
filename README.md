# ZhasaVet

Продакшн-версия витрины и админ-панели для ветеринарной аптеки. Проект разворачивается как
статический Vite SPA на Vercel и работает напрямую с Supabase.

## Что уже настроено

- Каталог товаров читает данные из Supabase.
- Корзина и checkout создают заказы в таблице `orders`.
- Блог читает публикации из таблицы `blog_posts`.
- Админ-панель работает через обычный Supabase Auth и RLS-политики.
- Для Vercel добавлен SPA routing через `vercel.json`.

## Локальный запуск

1. Установите зависимости:
   `npm install`
2. Создайте `.env.local` по образцу `.env.example`.
3. Заполните локальные переменные:
   `VITE_SUPABASE_URL`
   `VITE_SUPABASE_ANON_KEY`
   `SUPABASE_SECRET_KEY` или `SUPABASE_SERVICE_ROLE_KEY`
   `ADMIN_EMAIL`
   `ADMIN_PASSWORD`
4. В Supabase SQL Editor выполните `DATABASE.sql`.
5. Создайте администратора:
   `npm run create-admin`
6. Заполните базу стартовыми товарами и статьями:
   `npm run seed`
7. Запустите проект:
   `npm run dev`

## Деплой на Vercel

На Vercel нужны только публичные переменные:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Build command:
`npm run build`

Output directory:
`dist`

## Админ-панель

Маршрут:
`/admin`

Логин:
- `admin@zhasavet.kz`
- или алиас `admin-zhasavet`

Пароль:
- значение `ADMIN_PASSWORD` из `.env.local`

## Полезные команды

- `npm run create-admin` — создать или обновить админ-аккаунт
- `npm run seed` — загрузить стартовые товары и статьи
- `npm run build` — продакшн-сборка
