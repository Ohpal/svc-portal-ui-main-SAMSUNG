// src/plugins/dash.directive.ts
import type { Directive } from 'vue';

type DashTarget = HTMLInputElement | HTMLTextAreaElement | null;

interface DashHostEl extends HTMLElement {
  __dash_cleanup__?: () => void;
  __dash_target__?: HTMLInputElement | HTMLTextAreaElement;
}

// 값이 비었는지 판단
function isBlank(v: unknown): boolean {
  if (v === null || v === undefined) return true;
  if (typeof v === 'string' && v.trim() === '') return true;
  return false;
}

// 텍스트 계열인지 판단
function isTextLikeEl(el: Element): boolean {
  const tag = (el.tagName || '').toUpperCase();
  if (tag === 'TEXTAREA') return true;
  if (tag !== 'INPUT') return false;
  const t = (el.getAttribute('type') || 'text').toLowerCase();
  return ['text', 'tel', 'search', 'password', 'email', 'url'].includes(t);
}

// v-text-field처럼 래퍼에 붙은 경우 내부 input/textarea를 찾아 반환
function resolveTarget(el: HTMLElement): DashTarget {
  if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement) {
    return el;
  }
  return el.querySelector('input, textarea');
}

// v-model 동기화
function sync(el: HTMLInputElement | HTMLTextAreaElement): void {
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

function isLocked(el: HTMLInputElement | HTMLTextAreaElement): boolean {
  return !!(el.disabled || el.hasAttribute('disabled') || el.readOnly || el.hasAttribute('readonly'));
}

// '-' 적용
function applyDash(target: DashTarget): void {
  if (!target) return;
  if (!isTextLikeEl(target)) return;

  const valueEmpty = target.value === '' || target.value === null || target.value === undefined;

  if (valueEmpty) {
    if (isLocked(target)) {
      // 읽기전용/비활성: 값 대신 placeholder로 '-' 표시 (Vuetify의 재렌더와 충돌 없음)
      target.setAttribute('placeholder', '-');
      return;
    }
    // 편집 가능: 실제 값에 '-' 넣고 v-model 동기화
    target.value = '-';
    target.dispatchEvent(new Event('input', { bubbles: true }));
  }
}

// 포커스/블러 바인딩
function bindHandlers(hostEl: DashHostEl, target: HTMLInputElement | HTMLTextAreaElement): void {
  const onFocus = (): void => {
    if (isLocked(target)) return;
    if (target.value === '-') {
      target.value = '';
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  const onBlur = (): void => {
    if (isLocked(target)) return;
    const empty = target.value === '' || target.value === null || target.value === undefined;
    if (empty) {
      target.value = '-';
      target.dispatchEvent(new Event('input', { bubbles: true }));
    }
  };

  target.addEventListener('focus', onFocus);
  target.addEventListener('blur', onBlur);

  hostEl.__dash_cleanup__ = () => {
    target.removeEventListener('focus', onFocus);
    target.removeEventListener('blur', onBlur);
  };
  hostEl.__dash_target__ = target;
}

const dashDirective: Directive<DashHostEl> = {
  mounted(el) {
    const target = resolveTarget(el);
    if (target) {
      applyDash(target);
      bindHandlers(el, target);
    }
  },
  updated(el) {
    const target = resolveTarget(el);
    const prev = el.__dash_target__;

    if (target && target !== prev) {
      if (typeof el.__dash_cleanup__ === 'function') el.__dash_cleanup__();
      // 새로운 타겟으로 재바인드 (null일 가능성 제외)
      if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
        bindHandlers(el, target);
      }
    }

    // 포커스 중이 아닐 때만 값 보정
    if (target && document.activeElement !== target) {
      applyDash(target);
    }
  },
  unmounted(el) {
    if (typeof el.__dash_cleanup__ === 'function') {
      el.__dash_cleanup__();
      delete el.__dash_cleanup__;
      delete el.__dash_target__;
    }
  }
};

export default dashDirective;
