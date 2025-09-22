import permission from '@/directive/permission.ts';

export function registerDirectives(app) {
  app.directive('permission', permission);
}
