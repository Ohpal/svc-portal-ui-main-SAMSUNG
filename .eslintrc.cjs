/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting'
  ],
  overrides: [
    {
      files: ['cypress/e2e/**/*.{cy,spec}.{js,ts,jsx,tsx}', 'cypress/support/**/*.{js,ts,jsx,tsx}'],
      extends: ['plugin:cypress/recommended']
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    // 사용자 정의 규칙 설정
    'import/extensions': 'off', // 파일 확장자를 명시적으로 지정하지 않아도 되도록 함
    'import/no-unresolved': 'off', // 해결할 수 없는 import 경로에 대한 경고 무시
    'import/no-extraneous-dependencies': 'off', // package.json 에 없는 패키지를 import 할 때 에러 무시
    'import/prefer-default-export': 'off', // 단일 export 가 아니어도 되도록 함
    'vue/multi-word-component-names': 'off', // Vue 컴포넌트 이름에 대한 규칙 완화
    'no-shadow': 0, // 변수명 중복 사용을 허용
    '@typescript-eslint/no-shadow': 'error', // TypeScript에서 변수명 중복 사용 에러
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 프로덕션 환경에서 콘솔 사용 금지
    'no-debug': process.env.NODE_ENV === 'production' ? 'error' : 'off', // 프로덕션 환경에서 디버그 관련 문제 발생 시 에러
    'no-unused-vars': 'error', // 사용되지 않는 변수에 대한 경고 무시
    'vue/no-multiple-template-root': 'off', // vue2에서는 root 태그가 필요했으나 vue3부터는 불필요해짐
    'no-param-reassign': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // 파라미터로 넘어온 값 재할당 허용 개발자에게 주의를 주기위해 warn 으로 설정
    'no-alert': process.env.NODE_ENV === 'production' ? 'warn' : 'off', // alert 은 사용에서 사용하지 않는것으로 한다.
    // attribute가 한 줄에 몇개씩 표시될지 설정
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: {
          max: 1
        },
        multiline: {
          max: 1
        }
      }
    ],
    'vue/first-attribute-linebreak': [
      'error',
      {
        singleline: 'ignore',
        multiline: 'below'
      }
    ]
  }
}

