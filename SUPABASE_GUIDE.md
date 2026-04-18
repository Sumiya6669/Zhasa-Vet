# Supabase Guide For ZhasaVet

## 1. Database

Откройте SQL Editor в Supabase и выполните весь файл `DATABASE.sql`.

Что создаётся:

- `products`
- `orders`
- `blog_posts`
- RLS-политики для публичного чтения витрины
- RLS-политики для админ-управления товарами, блогом и заказами

## 2. Authentication

В Supabase Auth:

- `Site URL`:
  адрес вашего сайта на Vercel, например `https://zhasavet.kz`
- `Redirect URLs`:
  `http://localhost:3000`
  `https://zhasavet.kz`
  при необходимости также временный домен вида `https://project-name.vercel.app`

Если включено подтверждение почты, новые обычные пользователи смогут войти только после
подтверждения e-mail. На админ-аккаунт это не влияет, потому что он создаётся через admin API.

## 3. Environment Variables

Локально:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_SECRET_KEY` или `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

На Vercel:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 4. Admin User

После заполнения `.env.local` выполните:

```bash
npm run create-admin
```

Вход в админку:

- e-mail: `admin@zhasavet.kz`
- или алиас: `admin-zhasavet`
- пароль: значение `ADMIN_PASSWORD`

## 5. Seed Data

Чтобы сразу получить рабочий каталог и блог:

```bash
npm run seed
```

Команда безопасно обновляет записи через `upsert`.
