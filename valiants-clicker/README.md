# Valiants Clicker

- Este es un proyecto [Next.js](https://nextjs.org/) creado por Vortrius para el evento de [ETH Chile](https://x.com/ethereum_chile).

## Comenzando

Primero, instala las dependencias del proyecto:

`npm install`

Luego, inicia el servidor de desarrollo:

`npm run dev`

Abre [http://localhost:3000](http://localhost:3000) con tu navegador para ver el resultado.

## Configuración

Antes de poder ejecutar el proyecto, necesitarás configurar algunas variables de entorno:

- `CIRCLE_API_KEY`
- `CIRCLE_ENTITY_SECRET`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `WALLET_SET_ID`

Estas variables se pueden configurar en un archivo `.env` en la raíz del proyecto. Aquí tienes un ejemplo de cómo podría verse tu archivo `.env`:

- `CIRCLE_API_KEY='TEST_API_KEY:12`
- `CIRCLE_ENTITY_SECRET='bf2541131450966f`
- `NEXT_PUBLIC_SUPABASE_URL='https://wep.supabase.co`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY='JhbGciOiJIUzI1NiIsInR5cC`
- `WALLET_SET_ID='JhbGciO-iJI-UzI1Ni-IsInR5cC`

## Información Adicional

Para ejecutar esta aplicación, debes crear una cuenta en [Circle](https://console.circle.com/signup) y en supabase [Supabase](https://app.supabase.io/).

Además en supabase debes correr el siguiente script en la consola de SQL para crear la tabla de usuarios:

```sql
    CREATE TABLE IF NOT EXISTS "public"."user_wallet" (
        "id" bigint NOT NULL,
        "user_id" "uuid",
        "wallet_id" "text",
        "wallet_address" "text"
    );
```

## Contacto

Para más dudas o consultas, puedes unirte a nuestro servidor de Discord. Aquí está el enlace: [Nuestro Discord](https://discord.gg/vortrius).
