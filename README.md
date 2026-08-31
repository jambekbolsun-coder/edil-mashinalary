# Edil Mashinalary

Коммерческий сайт-каталог спецтехники в Кыргызстане. Проект включает публичный каталог, карточки моделей, расчёт рассрочки, формы заявок, блог, квиз, чат-помощник и защищённую административную панель.

## Технологии

- Next.js 16, React 19, TypeScript
- Supabase Auth, Postgres и Storage
- Zod для серверной валидации
- Vitest для автоматических тестов
- Vercel для публикации

## Локальный запуск

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Откройте `http://localhost:3000`. Без переменных Supabase публичный каталог использует встроенные проверенные данные, а формы показывают резервный способ связи через WhatsApp.

## Переменные окружения

```env
NEXT_PUBLIC_SITE_URL=https://your-domain.example
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

Секреты и пароль администратора не должны попадать в `.env.example`, Git или клиентский код.

## База данных

Миграция находится в `supabase/migrations`. Она создаёт каталог, заявки, статьи, акции, аналитику, настройки, ответы чат-помощника, профили ролей, Storage bucket и RLS-политики.

```bash
npx supabase link --project-ref <project-ref>
npx supabase db push
```

После создания пользователя назначьте его профиль администратором только через защищённую панель проекта или SQL Editor:

```sql
update public.profiles set role = 'admin' where id = '<auth-user-id>';
```

## Проверка качества

```bash
npm run lint
npm test
npm run build
```

Дополнительно проект проверен в Chromium на desktop и mobile: навигация, поиск, фильтры, карточка товара, форма, квиз, чат и отсутствие горизонтального скролла.

## Административная панель

Маршрут: `/admin/login`. Сессия проверяется на сервере, а права подтверждаются ролью в таблице `profiles`. Администратор может добавлять и редактировать технику, публиковать и скрывать карточки, удалять позиции, обрабатывать заявки и управлять ответами чат-помощника.

## Публикация

1. Добавьте переменные окружения в Vercel.
2. Выполните `npm run build`.
3. Подключите репозиторий или выполните production deployment через Vercel CLI.
4. После публикации проверьте `/`, `/catalog`, `/admin/login`, `/robots.txt` и `/sitemap.xml`.
