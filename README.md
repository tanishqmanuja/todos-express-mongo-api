# Todos API

A production ready Todos API server with JWT ( Access + Refresh ) token based User Authentication.

### Stack:

- Framework: [Express](https://expressjs.com/)
- Database: [MongoDB](https://www.mongodb.com/) (Primary) + [Redis](https://redis.io/) (Sessions)
- ODM: [Mongoose](https://mongoosejs.com/)
- Validation: [Zod](https://zod.dev/)
- Logging: [Morgan](https://expressjs.com/en/resources/middleware/morgan.html)
- Runtime: [NodeJS](https://nodejs.org/en)

### Tooling

- Builder: [ESBuild](https://esbuild.github.io/)
- Formatting: [Prettier](https://prettier.io/)
- Type-Cheking: [TSC](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- Package Manager: [pnpm](https://pnpm.io/)

## Installing Dependencies

```sh
pnpm install
```

## Starting the Server

```sh
pnpm start
```

## Building the Server

```sh
pnpm build # or pnpm build --production for minified output
```
