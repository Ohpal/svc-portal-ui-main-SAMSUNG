# .

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Node Version Check

```sh
nvm -v
nvm install 20.18.3
nvm use 20.18.3
```

## Delete package-lock.json or node_modules

node_modules 폴더와 package-lock.json 파일을 삭제합니다. 이렇게 하면 재설치 시 손상된 버전을 사용하지 않게 됩니다.

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Type-Check, Compile and Minify for Production

```sh
npm run build
```

### Run Unit Tests with [Vitest](https://vitest.dev/)

```sh
npm run test:unit
```

### Run End-to-End Tests with [Cypress](https://www.cypress.io/)

```sh
npm run test:e2e:dev
```

This runs the end-to-end tests against the Vite development server.
It is much faster than the production build.

But it's still recommended to test the production build with `test:e2e` before deploying (e.g. in CI environments):

```sh
npm run build
npm run test:e2e
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

### 유엔젤 PC 접속

22번 포트:: ID : tapp | PW : (tapp.123)
106번 IP 접속 : ssh tapp@192.168.90.106 | PW : 위 동일
svcfw DB 접속 : 192.168.90.106:5432 / svcfw / ID : tapp | PW : 위 동일

### 서버 재실행

```sh
supervisorctl restart service:svc-portal-ui
supervisorctl status
```

### \ 문자 재구성

```sh
cd scripts
sed -i 's/\r$//' start.sh
```

### config.json

portal 쪽에 config가 이미 존재하므로
타 개발사는 직접 URL로 변경해야함
