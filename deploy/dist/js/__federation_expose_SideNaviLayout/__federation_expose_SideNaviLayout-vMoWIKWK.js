import { importShared } from "../__federation_fn_import/__federation_fn_import-CyQYGTN2.js";
import axiosInstance, { k as useMessageStore, b as useAuthStore, d as useI18n, l as sessionLogout, g as getRefreshToken, M as Message, m as useLoadingStore, u as useNotificationStore, a as useProfileDialogStore, f as usePlatformStore, e as useMenuStore, c as getLogoutTime, n as getCommonIntervalTime } from "../__federation_expose_Axios/__federation_expose_Axios-BG-6nOb8.js";
import SideMenuItem, { a$ as templateRef, w as IN_BROWSER, p as propsFactory, at as convertToUnit, a7 as getCurrentInstance, bE as findChildrenWithProvide, bF as SUPPORTS_INTERSECTION, u as useRtl, bG as parseAnchor, g as genericComponent, E as useProxiedModel, a as provideTheme, Z as useTextColor, $ as useBackgroundColor, ah as useRounded, j as clamp, b as useRender, m as makeThemeProps, y as makeTagProps, K as makeRoundedProps, c as makeComponentProps, a6 as getCurrentInstanceName, bc as useScopeId, ak as useVariant, a8 as useToggleScope, r as refElement, au as forwardRefs, a1 as omit, H as makeVariantProps, bd as makeVOverlayProps, b2 as VOverlay, al as genOverlays, an as VDefaultsProvider, W as VIcon, ar as animate, bH as acceleratedEasing, as as standardEasing, bI as deceleratedEasing, bJ as getTargetBox, aq as nullifyTransforms, bK as createList, b9 as VListGroup, ay as VListItem, bL as isPrimitive, aw as getPropertyFromItem, aa as pick, U as deepEqual, af as useBorder, X as useDensity, a9 as useDimension, ag as useElevation, bM as useNested, G as provideDefaults, M as makeElevationProps, ab as makeDimensionProps, N as makeDensityProps, O as makeBorderProps, bN as makeNestedProps, S as EventProp, P as IconValue, bk as focusChild, Y as wrapInArray, k as consoleWarn, ai as useSize, J as makeSizeProps, aj as useLink, ap as makeRouterProps, R as Ripple, bO as VMenuSymbol, bP as isClickInsideElement, ae as focusableChildren, bQ as getNextElement, bt as VListItemTitle, _ as _export_sfc, aI as VImg, b5 as VExpandTransition, b7 as useSsrBoot, bR as breakpoints, bS as CircularBuffer, F as useDisplay, bT as useRouter$3, bU as toPhysical, bg as useDelay, ad as makeDisplayProps, b3 as makeDelayProps, aH as useCompanyStore, aG as useShipStore } from "../__federation_expose_SideMenuItem/__federation_expose_SideMenuItem-pJ3tjjBk.js";
const { onBeforeUnmount: onBeforeUnmount$7, readonly: readonly$1, ref: ref$e, watch: watch$b } = await importShared("vue");
function useResizeObserver(callback) {
  let box = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "content";
  const resizeRef = templateRef();
  const contentRect = ref$e();
  if (IN_BROWSER) {
    const observer = new ResizeObserver((entries) => {
      callback == null ? void 0 : callback(entries, observer);
      if (!entries.length) return;
      if (box === "content") {
        contentRect.value = entries[0].contentRect;
      } else {
        contentRect.value = entries[0].target.getBoundingClientRect();
      }
    });
    onBeforeUnmount$7(() => {
      observer.disconnect();
    });
    watch$b(() => resizeRef.el, (newValue, oldValue) => {
      if (oldValue) {
        observer.unobserve(oldValue);
        contentRect.value = void 0;
      }
      if (newValue) observer.observe(newValue);
    }, {
      flush: "post"
    });
  }
  return {
    resizeRef,
    contentRect: readonly$1(contentRect)
  };
}
const { computed: computed$l, inject: inject$3, onActivated, onBeforeUnmount: onBeforeUnmount$6, onDeactivated: onDeactivated$1, onMounted: onMounted$7, provide: provide$2, reactive: reactive$4, ref: ref$d, shallowRef: shallowRef$b, toRef: toRef$a, useId: useId$2 } = await importShared("vue");
const VuetifyLayoutKey = Symbol.for("vuetify:layout");
const VuetifyLayoutItemKey = Symbol.for("vuetify:layout-item");
const ROOT_ZINDEX = 1e3;
const makeLayoutProps = propsFactory({
  overlaps: {
    type: Array,
    default: () => []
  },
  fullHeight: Boolean
}, "layout");
const makeLayoutItemProps = propsFactory({
  name: {
    type: String
  },
  order: {
    type: [Number, String],
    default: 0
  },
  absolute: Boolean
}, "layout-item");
function useLayout() {
  const layout = inject$3(VuetifyLayoutKey);
  if (!layout) throw new Error("[Vuetify] Could not find injected layout");
  return {
    getLayoutItem: layout.getLayoutItem,
    mainRect: layout.mainRect,
    mainStyles: layout.mainStyles
  };
}
function useLayoutItem(options) {
  const layout = inject$3(VuetifyLayoutKey);
  if (!layout) throw new Error("[Vuetify] Could not find injected layout");
  const id = options.id ?? `layout-item-${useId$2()}`;
  const vm = getCurrentInstance("useLayoutItem");
  provide$2(VuetifyLayoutItemKey, {
    id
  });
  const isKeptAlive = shallowRef$b(false);
  onDeactivated$1(() => isKeptAlive.value = true);
  onActivated(() => isKeptAlive.value = false);
  const {
    layoutItemStyles,
    layoutItemScrimStyles
  } = layout.register(vm, {
    ...options,
    active: computed$l(() => isKeptAlive.value ? false : options.active.value),
    id
  });
  onBeforeUnmount$6(() => layout.unregister(id));
  return {
    layoutItemStyles,
    layoutRect: layout.layoutRect,
    layoutItemScrimStyles
  };
}
const generateLayers = (layout, positions, layoutSizes, activeItems) => {
  let previousLayer = {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  };
  const layers = [{
    id: "",
    layer: {
      ...previousLayer
    }
  }];
  for (const id of layout) {
    const position = positions.get(id);
    const amount = layoutSizes.get(id);
    const active = activeItems.get(id);
    if (!position || !amount || !active) continue;
    const layer = {
      ...previousLayer,
      [position.value]: parseInt(previousLayer[position.value], 10) + (active.value ? parseInt(amount.value, 10) : 0)
    };
    layers.push({
      id,
      layer
    });
    previousLayer = layer;
  }
  return layers;
};
function createLayout(props) {
  const parentLayout = inject$3(VuetifyLayoutKey, null);
  const rootZIndex = computed$l(() => parentLayout ? parentLayout.rootZIndex.value - 100 : ROOT_ZINDEX);
  const registered = ref$d([]);
  const positions = reactive$4(/* @__PURE__ */ new Map());
  const layoutSizes = reactive$4(/* @__PURE__ */ new Map());
  const priorities = reactive$4(/* @__PURE__ */ new Map());
  const activeItems = reactive$4(/* @__PURE__ */ new Map());
  const disabledTransitions = reactive$4(/* @__PURE__ */ new Map());
  const {
    resizeRef,
    contentRect: layoutRect
  } = useResizeObserver();
  const computedOverlaps = computed$l(() => {
    const map = /* @__PURE__ */ new Map();
    const overlaps = props.overlaps ?? [];
    for (const overlap of overlaps.filter((item) => item.includes(":"))) {
      const [top, bottom] = overlap.split(":");
      if (!registered.value.includes(top) || !registered.value.includes(bottom)) continue;
      const topPosition = positions.get(top);
      const bottomPosition = positions.get(bottom);
      const topAmount = layoutSizes.get(top);
      const bottomAmount = layoutSizes.get(bottom);
      if (!topPosition || !bottomPosition || !topAmount || !bottomAmount) continue;
      map.set(bottom, {
        position: topPosition.value,
        amount: parseInt(topAmount.value, 10)
      });
      map.set(top, {
        position: bottomPosition.value,
        amount: -parseInt(bottomAmount.value, 10)
      });
    }
    return map;
  });
  const layers = computed$l(() => {
    const uniquePriorities = [...new Set([...priorities.values()].map((p) => p.value))].sort((a, b) => a - b);
    const layout = [];
    for (const p of uniquePriorities) {
      const items2 = registered.value.filter((id) => {
        var _a;
        return ((_a = priorities.get(id)) == null ? void 0 : _a.value) === p;
      });
      layout.push(...items2);
    }
    return generateLayers(layout, positions, layoutSizes, activeItems);
  });
  const transitionsEnabled = computed$l(() => {
    return !Array.from(disabledTransitions.values()).some((ref2) => ref2.value);
  });
  const mainRect = computed$l(() => {
    return layers.value[layers.value.length - 1].layer;
  });
  const mainStyles = toRef$a(() => {
    return {
      "--v-layout-left": convertToUnit(mainRect.value.left),
      "--v-layout-right": convertToUnit(mainRect.value.right),
      "--v-layout-top": convertToUnit(mainRect.value.top),
      "--v-layout-bottom": convertToUnit(mainRect.value.bottom),
      ...transitionsEnabled.value ? void 0 : {
        transition: "none"
      }
    };
  });
  const items = computed$l(() => {
    return layers.value.slice(1).map((_ref, index) => {
      let {
        id
      } = _ref;
      const {
        layer
      } = layers.value[index];
      const size = layoutSizes.get(id);
      const position = positions.get(id);
      return {
        id,
        ...layer,
        size: Number(size.value),
        position: position.value
      };
    });
  });
  const getLayoutItem = (id) => {
    return items.value.find((item) => item.id === id);
  };
  const rootVm = getCurrentInstance("createLayout");
  const isMounted = shallowRef$b(false);
  onMounted$7(() => {
    isMounted.value = true;
  });
  provide$2(VuetifyLayoutKey, {
    register: (vm, _ref2) => {
      let {
        id,
        order,
        position,
        layoutSize,
        elementSize,
        active,
        disableTransitions,
        absolute
      } = _ref2;
      priorities.set(id, order);
      positions.set(id, position);
      layoutSizes.set(id, layoutSize);
      activeItems.set(id, active);
      disableTransitions && disabledTransitions.set(id, disableTransitions);
      const instances = findChildrenWithProvide(VuetifyLayoutItemKey, rootVm == null ? void 0 : rootVm.vnode);
      const instanceIndex = instances.indexOf(vm);
      if (instanceIndex > -1) registered.value.splice(instanceIndex, 0, id);
      else registered.value.push(id);
      const index = computed$l(() => items.value.findIndex((i) => i.id === id));
      const zIndex = computed$l(() => rootZIndex.value + layers.value.length * 2 - index.value * 2);
      const layoutItemStyles = computed$l(() => {
        const isHorizontal = position.value === "left" || position.value === "right";
        const isOppositeHorizontal = position.value === "right";
        const isOppositeVertical = position.value === "bottom";
        const size = elementSize.value ?? layoutSize.value;
        const unit = size === 0 ? "%" : "px";
        const styles = {
          [position.value]: 0,
          zIndex: zIndex.value,
          transform: `translate${isHorizontal ? "X" : "Y"}(${(active.value ? 0 : -(size === 0 ? 100 : size)) * (isOppositeHorizontal || isOppositeVertical ? -1 : 1)}${unit})`,
          position: absolute.value || rootZIndex.value !== ROOT_ZINDEX ? "absolute" : "fixed",
          ...transitionsEnabled.value ? void 0 : {
            transition: "none"
          }
        };
        if (!isMounted.value) return styles;
        const item = items.value[index.value];
        if (!item) throw new Error(`[Vuetify] Could not find layout item "${id}"`);
        const overlap = computedOverlaps.value.get(id);
        if (overlap) {
          item[overlap.position] += overlap.amount;
        }
        return {
          ...styles,
          height: isHorizontal ? `calc(100% - ${item.top}px - ${item.bottom}px)` : elementSize.value ? `${elementSize.value}px` : void 0,
          left: isOppositeHorizontal ? void 0 : `${item.left}px`,
          right: isOppositeHorizontal ? `${item.right}px` : void 0,
          top: position.value !== "bottom" ? `${item.top}px` : void 0,
          bottom: position.value !== "top" ? `${item.bottom}px` : void 0,
          width: !isHorizontal ? `calc(100% - ${item.left}px - ${item.right}px)` : elementSize.value ? `${elementSize.value}px` : void 0
        };
      });
      const layoutItemScrimStyles = computed$l(() => ({
        zIndex: zIndex.value - 1
      }));
      return {
        layoutItemStyles,
        layoutItemScrimStyles,
        zIndex
      };
    },
    unregister: (id) => {
      priorities.delete(id);
      positions.delete(id);
      layoutSizes.delete(id);
      activeItems.delete(id);
      disabledTransitions.delete(id);
      registered.value = registered.value.filter((v) => v !== id);
    },
    mainRect,
    mainStyles,
    getLayoutItem,
    items,
    layoutRect,
    rootZIndex
  });
  const layoutClasses = toRef$a(() => ["v-layout", {
    "v-layout--full-height": props.fullHeight
  }]);
  const layoutStyles = toRef$a(() => ({
    zIndex: parentLayout ? rootZIndex.value : void 0,
    position: parentLayout ? "relative" : void 0,
    overflow: parentLayout ? "hidden" : void 0
  }));
  return {
    layoutClasses,
    layoutStyles,
    getLayoutItem,
    items,
    layoutRect,
    layoutRef: resizeRef
  };
}
const { onScopeDispose: onScopeDispose$2, ref: ref$c, shallowRef: shallowRef$a, watch: watch$a } = await importShared("vue");
function useIntersectionObserver(callback, options) {
  const intersectionRef = ref$c();
  const isIntersecting = shallowRef$a(false);
  if (SUPPORTS_INTERSECTION) {
    const observer = new IntersectionObserver((entries) => {
      isIntersecting.value = !!entries.find((entry) => entry.isIntersecting);
    }, options);
    onScopeDispose$2(() => {
      observer.disconnect();
    });
    watch$a(intersectionRef, (newValue, oldValue) => {
      if (oldValue) {
        observer.unobserve(oldValue);
        isIntersecting.value = false;
      }
      if (newValue) observer.observe(newValue);
    }, {
      flush: "post"
    });
  }
  return {
    intersectionRef,
    isIntersecting
  };
}
const { computed: computed$k } = await importShared("vue");
const oppositeMap = {
  center: "center",
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left"
};
const makeLocationProps = propsFactory({
  location: String
}, "location");
function useLocation(props) {
  let opposite = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : false;
  let offset = arguments.length > 2 ? arguments[2] : void 0;
  const {
    isRtl
  } = useRtl();
  const locationStyles = computed$k(() => {
    if (!props.location) return {};
    const {
      side,
      align
    } = parseAnchor(props.location.split(" ").length > 1 ? props.location : `${props.location} center`, isRtl.value);
    function getOffset(side2) {
      return offset ? offset(side2) : 0;
    }
    const styles = {};
    if (side !== "center") {
      if (opposite) styles[oppositeMap[side]] = `calc(100% - ${getOffset(side)}px)`;
      else styles[side] = 0;
    }
    if (align !== "center") {
      if (opposite) styles[oppositeMap[align]] = `calc(100% - ${getOffset(align)}px)`;
      else styles[align] = 0;
    } else {
      if (side === "center") styles.top = styles.left = "50%";
      else {
        styles[{
          top: "left",
          bottom: "left",
          left: "top",
          right: "top"
        }[side]] = "50%";
      }
      styles.transform = {
        top: "translateX(-50%)",
        bottom: "translateX(-50%)",
        left: "translateY(-50%)",
        right: "translateY(-50%)",
        center: "translate(-50%, -50%)"
      }[side];
    }
    return styles;
  });
  return {
    locationStyles
  };
}
const { normalizeClass: _normalizeClass$c, createElementVNode: _createElementVNode$f, normalizeStyle: _normalizeStyle$a, createVNode: _createVNode$m } = await importShared("vue");
const { computed: computed$j, Transition: Transition$2 } = await importShared("vue");
const makeVProgressLinearProps = propsFactory({
  absolute: Boolean,
  active: {
    type: Boolean,
    default: true
  },
  bgColor: String,
  bgOpacity: [Number, String],
  bufferValue: {
    type: [Number, String],
    default: 0
  },
  bufferColor: String,
  bufferOpacity: [Number, String],
  clickable: Boolean,
  color: String,
  height: {
    type: [Number, String],
    default: 4
  },
  indeterminate: Boolean,
  max: {
    type: [Number, String],
    default: 100
  },
  modelValue: {
    type: [Number, String],
    default: 0
  },
  opacity: [Number, String],
  reverse: Boolean,
  stream: Boolean,
  striped: Boolean,
  roundedBar: Boolean,
  ...makeComponentProps(),
  ...makeLocationProps({
    location: "top"
  }),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps()
}, "VProgressLinear");
const VProgressLinear = genericComponent()({
  name: "VProgressLinear",
  props: makeVProgressLinearProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    var _a;
    let {
      slots
    } = _ref;
    const progress = useProxiedModel(props, "modelValue");
    const {
      isRtl,
      rtlClasses
    } = useRtl();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(() => props.color);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.bgColor || props.color);
    const {
      backgroundColorClasses: bufferColorClasses,
      backgroundColorStyles: bufferColorStyles
    } = useBackgroundColor(() => props.bufferColor || props.bgColor || props.color);
    const {
      backgroundColorClasses: barColorClasses,
      backgroundColorStyles: barColorStyles
    } = useBackgroundColor(() => props.color);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      intersectionRef,
      isIntersecting
    } = useIntersectionObserver();
    const max = computed$j(() => parseFloat(props.max));
    const height = computed$j(() => parseFloat(props.height));
    const normalizedBuffer = computed$j(() => clamp(parseFloat(props.bufferValue) / max.value * 100, 0, 100));
    const normalizedValue = computed$j(() => clamp(parseFloat(progress.value) / max.value * 100, 0, 100));
    const isReversed = computed$j(() => isRtl.value !== props.reverse);
    const transition = computed$j(() => props.indeterminate ? "fade-transition" : "slide-x-transition");
    const isForcedColorsModeActive = IN_BROWSER && ((_a = window.matchMedia) == null ? void 0 : _a.call(window, "(forced-colors: active)").matches);
    function handleClick(e) {
      if (!intersectionRef.value) return;
      const {
        left,
        right,
        width
      } = intersectionRef.value.getBoundingClientRect();
      const value = isReversed.value ? width - e.clientX + (right - width) : e.clientX - left;
      progress.value = Math.round(value / width * max.value);
    }
    useRender(() => _createVNode$m(props.tag, {
      "ref": intersectionRef,
      "class": _normalizeClass$c(["v-progress-linear", {
        "v-progress-linear--absolute": props.absolute,
        "v-progress-linear--active": props.active && isIntersecting.value,
        "v-progress-linear--reverse": isReversed.value,
        "v-progress-linear--rounded": props.rounded,
        "v-progress-linear--rounded-bar": props.roundedBar,
        "v-progress-linear--striped": props.striped
      }, roundedClasses.value, themeClasses.value, rtlClasses.value, props.class]),
      "style": _normalizeStyle$a([{
        bottom: props.location === "bottom" ? 0 : void 0,
        top: props.location === "top" ? 0 : void 0,
        height: props.active ? convertToUnit(height.value) : 0,
        "--v-progress-linear-height": convertToUnit(height.value),
        ...props.absolute ? locationStyles.value : {}
      }, props.style]),
      "role": "progressbar",
      "aria-hidden": props.active ? "false" : "true",
      "aria-valuemin": "0",
      "aria-valuemax": props.max,
      "aria-valuenow": props.indeterminate ? void 0 : Math.min(parseFloat(progress.value), max.value),
      "onClick": props.clickable && handleClick
    }, {
      default: () => [props.stream && _createElementVNode$f("div", {
        "key": "stream",
        "class": _normalizeClass$c(["v-progress-linear__stream", textColorClasses.value]),
        "style": {
          ...textColorStyles.value,
          [isReversed.value ? "left" : "right"]: convertToUnit(-height.value),
          borderTop: `${convertToUnit(height.value / 2)} dotted`,
          opacity: parseFloat(props.bufferOpacity),
          top: `calc(50% - ${convertToUnit(height.value / 4)})`,
          width: convertToUnit(100 - normalizedBuffer.value, "%"),
          "--v-progress-linear-stream-to": convertToUnit(height.value * (isReversed.value ? 1 : -1))
        }
      }, null), _createElementVNode$f("div", {
        "class": _normalizeClass$c(["v-progress-linear__background", !isForcedColorsModeActive ? backgroundColorClasses.value : void 0]),
        "style": _normalizeStyle$a([backgroundColorStyles.value, {
          opacity: parseFloat(props.bgOpacity),
          width: props.stream ? 0 : void 0
        }])
      }, null), _createElementVNode$f("div", {
        "class": _normalizeClass$c(["v-progress-linear__buffer", !isForcedColorsModeActive ? bufferColorClasses.value : void 0]),
        "style": _normalizeStyle$a([bufferColorStyles.value, {
          opacity: parseFloat(props.bufferOpacity),
          width: convertToUnit(normalizedBuffer.value, "%")
        }])
      }, null), _createVNode$m(Transition$2, {
        "name": transition.value
      }, {
        default: () => [!props.indeterminate ? _createElementVNode$f("div", {
          "class": _normalizeClass$c(["v-progress-linear__determinate", !isForcedColorsModeActive ? barColorClasses.value : void 0]),
          "style": _normalizeStyle$a([barColorStyles.value, {
            width: convertToUnit(normalizedValue.value, "%")
          }])
        }, null) : _createElementVNode$f("div", {
          "class": "v-progress-linear__indeterminate"
        }, [["long", "short"].map((bar) => _createElementVNode$f("div", {
          "key": bar,
          "class": _normalizeClass$c(["v-progress-linear__indeterminate", bar, !isForcedColorsModeActive ? barColorClasses.value : void 0]),
          "style": _normalizeStyle$a(barColorStyles.value)
        }, null))])]
      }), slots.default && _createElementVNode$f("div", {
        "class": "v-progress-linear__content"
      }, [slots.default({
        value: normalizedValue.value,
        buffer: normalizedBuffer.value
      })])]
    }));
    return {};
  }
});
const { toRef: toRef$9 } = await importShared("vue");
const positionValues = ["static", "relative", "fixed", "absolute", "sticky"];
const makePositionProps = propsFactory({
  position: {
    type: String,
    validator: (
      /* istanbul ignore next */
      (v) => positionValues.includes(v)
    )
  }
}, "position");
function usePosition(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  const positionClasses = toRef$9(() => {
    return props.position ? `${name}--${props.position}` : void 0;
  });
  return {
    positionClasses
  };
}
const { createVNode: _createVNode$l, createElementVNode: _createElementVNode$e, mergeProps: _mergeProps$8 } = await importShared("vue");
const { computed: computed$i, inject: inject$2, mergeProps: mergeProps$1, nextTick: nextTick$4, onMounted: onMounted$6, onScopeDispose: onScopeDispose$1, ref: ref$b, shallowRef: shallowRef$9, watch: watch$9, watchEffect: watchEffect$4 } = await importShared("vue");
function useCountdown(milliseconds) {
  const time = shallowRef$9(milliseconds());
  let timer = -1;
  function clear() {
    clearInterval(timer);
  }
  function reset() {
    clear();
    nextTick$4(() => time.value = milliseconds());
  }
  function start(el) {
    const style = el ? getComputedStyle(el) : {
      transitionDuration: 0.2
    };
    const interval = parseFloat(style.transitionDuration) * 1e3 || 200;
    clear();
    if (time.value <= 0) return;
    const startTime = performance.now();
    timer = window.setInterval(() => {
      const elapsed = performance.now() - startTime + interval;
      time.value = Math.max(milliseconds() - elapsed, 0);
      if (time.value <= 0) clear();
    }, interval);
  }
  onScopeDispose$1(clear);
  return {
    clear,
    time,
    start,
    reset
  };
}
const makeVSnackbarProps = propsFactory({
  multiLine: Boolean,
  text: String,
  timer: [Boolean, String],
  timeout: {
    type: [Number, String],
    default: 5e3
  },
  vertical: Boolean,
  ...makeLocationProps({
    location: "bottom"
  }),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeVariantProps(),
  ...makeThemeProps(),
  ...omit(makeVOverlayProps({
    transition: "v-snackbar-transition"
  }), ["persistent", "noClickAnimation", "scrim", "scrollStrategy"])
}, "VSnackbar");
const VSnackbar = genericComponent()({
  name: "VSnackbar",
  props: makeVSnackbarProps(),
  emits: {
    "update:modelValue": (v) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const isActive = useProxiedModel(props, "modelValue");
    const {
      positionClasses
    } = usePosition(props);
    const {
      scopeId
    } = useScopeId();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(props);
    const {
      roundedClasses
    } = useRounded(props);
    const countdown = useCountdown(() => Number(props.timeout));
    const overlay = ref$b();
    const timerRef = ref$b();
    const isHovering = shallowRef$9(false);
    const startY = shallowRef$9(0);
    const mainStyles = ref$b();
    const hasLayout = inject$2(VuetifyLayoutKey, void 0);
    useToggleScope(() => !!hasLayout, () => {
      const layout = useLayout();
      watchEffect$4(() => {
        mainStyles.value = layout.mainStyles.value;
      });
    });
    watch$9(isActive, startTimeout);
    watch$9(() => props.timeout, startTimeout);
    onMounted$6(() => {
      if (isActive.value) startTimeout();
    });
    let activeTimeout = -1;
    function startTimeout() {
      countdown.reset();
      window.clearTimeout(activeTimeout);
      const timeout = Number(props.timeout);
      if (!isActive.value || timeout === -1) return;
      const element = refElement(timerRef.value);
      countdown.start(element);
      activeTimeout = window.setTimeout(() => {
        isActive.value = false;
      }, timeout);
    }
    function clearTimeout2() {
      countdown.reset();
      window.clearTimeout(activeTimeout);
    }
    function onPointerenter() {
      isHovering.value = true;
      clearTimeout2();
    }
    function onPointerleave() {
      isHovering.value = false;
      startTimeout();
    }
    function onTouchstart(event) {
      startY.value = event.touches[0].clientY;
    }
    function onTouchend(event) {
      if (Math.abs(startY.value - event.changedTouches[0].clientY) > 50) {
        isActive.value = false;
      }
    }
    function onAfterLeave() {
      if (isHovering.value) onPointerleave();
    }
    const locationClasses = computed$i(() => {
      return props.location.split(" ").reduce((acc, loc) => {
        acc[`v-snackbar--${loc}`] = true;
        return acc;
      }, {});
    });
    useRender(() => {
      const overlayProps = VOverlay.filterProps(props);
      const hasContent = !!(slots.default || slots.text || props.text);
      return _createVNode$l(VOverlay, _mergeProps$8({
        "ref": overlay,
        "class": ["v-snackbar", {
          "v-snackbar--active": isActive.value,
          "v-snackbar--multi-line": props.multiLine && !props.vertical,
          "v-snackbar--timer": !!props.timer,
          "v-snackbar--vertical": props.vertical
        }, locationClasses.value, positionClasses.value, props.class],
        "style": [mainStyles.value, props.style]
      }, overlayProps, {
        "modelValue": isActive.value,
        "onUpdate:modelValue": ($event) => isActive.value = $event,
        "contentProps": mergeProps$1({
          class: ["v-snackbar__wrapper", themeClasses.value, colorClasses.value, roundedClasses.value, variantClasses.value],
          style: [colorStyles.value],
          onPointerenter,
          onPointerleave
        }, overlayProps.contentProps),
        "persistent": true,
        "noClickAnimation": true,
        "scrim": false,
        "scrollStrategy": "none",
        "_disableGlobalStack": true,
        "onTouchstartPassive": onTouchstart,
        "onTouchend": onTouchend,
        "onAfterLeave": onAfterLeave
      }, scopeId), {
        default: () => {
          var _a, _b;
          return [genOverlays(false, "v-snackbar"), props.timer && !isHovering.value && _createElementVNode$e("div", {
            "key": "timer",
            "class": "v-snackbar__timer"
          }, [_createVNode$l(VProgressLinear, {
            "ref": timerRef,
            "color": typeof props.timer === "string" ? props.timer : "info",
            "max": props.timeout,
            "model-value": countdown.time.value
          }, null)]), hasContent && _createElementVNode$e("div", {
            "key": "content",
            "class": "v-snackbar__content",
            "role": "status",
            "aria-live": "polite"
          }, [((_a = slots.text) == null ? void 0 : _a.call(slots)) ?? props.text, (_b = slots.default) == null ? void 0 : _b.call(slots)]), slots.actions && _createVNode$l(VDefaultsProvider, {
            "defaults": {
              VBtn: {
                variant: "text",
                ripple: false,
                slim: true
              }
            }
          }, {
            default: () => [_createElementVNode$e("div", {
              "class": "v-snackbar__actions"
            }, [slots.actions({
              isActive
            })])]
          })];
        },
        activator: slots.activator
      });
    });
    return forwardRefs({}, overlay);
  }
});
const { defineComponent: _defineComponent$4 } = await importShared("vue");
const { createTextVNode: _createTextVNode$3, Fragment: _Fragment$3, openBlock: _openBlock$4, createElementBlock: _createElementBlock$4, createCommentVNode: _createCommentVNode$2, withCtx: _withCtx$4, createVNode: _createVNode$k, toDisplayString: _toDisplayString$4, createElementVNode: _createElementVNode$d, unref: _unref$2, createBlock: _createBlock$2 } = await importShared("vue");
const _hoisted_1$3 = { class: "d-flex mr-8" };
const _hoisted_2$2 = { class: "contents" };
const { computed: computed$h, nextTick: nextTick$3, watch: watch$8 } = await importShared("vue");
const _sfc_main$3 = /* @__PURE__ */ _defineComponent$4({
  __name: "ToastMessage",
  setup(__props) {
    const messageStore = useMessageStore();
    const showMessage = computed$h({
      get() {
        return messageStore.getShowMessage();
      },
      set(v) {
        messageStore.SetShowMessage(v);
      }
    });
    const messageOption = computed$h(() => {
      return messageStore.getMessageOption();
    });
    watch$8(
      () => messageStore.getMessageOption,
      () => {
        messageStore.SetShowMessage(false);
        nextTick$3(() => messageStore.SetShowMessage(true));
      }
    );
    return (_ctx, _cache) => {
      return _openBlock$4(), _createBlock$2(VSnackbar, {
        modelValue: showMessage.value,
        "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => showMessage.value = $event),
        color: messageOption.value.color,
        timeout: 3e4,
        "content-class": "app-snackbar",
        location: "top",
        variant: "flat"
      }, {
        actions: _withCtx$4(() => [
          _createVNode$k(VIcon, {
            class: "close-icon",
            onClick: _cache[0] || (_cache[0] = ($event) => _unref$2(messageStore).SetShowMessage(false))
          }, {
            default: _withCtx$4(() => _cache[2] || (_cache[2] = [
              _createTextVNode$3(" mdi-close ")
            ])),
            _: 1,
            __: [2]
          })
        ]),
        default: _withCtx$4(() => [
          _createElementVNode$d("div", _hoisted_1$3, [
            _createVNode$k(VIcon, { class: "pre-icon mr-3" }, {
              default: _withCtx$4(() => [
                messageOption.value.color === "info" ? (_openBlock$4(), _createElementBlock$4(_Fragment$3, { key: 0 }, [
                  _createTextVNode$3(" mdi-alert-info")
                ], 64)) : messageOption.value.color === "success" ? (_openBlock$4(), _createElementBlock$4(_Fragment$3, { key: 1 }, [
                  _createTextVNode$3(" mdi-alert-ok")
                ], 64)) : messageOption.value.color === "warning" ? (_openBlock$4(), _createElementBlock$4(_Fragment$3, { key: 2 }, [
                  _createTextVNode$3(" mdi-alert-warning")
                ], 64)) : messageOption.value.color === "error" ? (_openBlock$4(), _createElementBlock$4(_Fragment$3, { key: 3 }, [
                  _createTextVNode$3(" mdi-alert-error")
                ], 64)) : (_openBlock$4(), _createElementBlock$4(_Fragment$3, { key: 4 }, [
                  _createTextVNode$3(" mdi-checkbox-marked-circle")
                ], 64))
              ]),
              _: 1
            }),
            _createElementVNode$d("div", _hoisted_2$2, _toDisplayString$4(messageOption.value.contents), 1)
          ])
        ]),
        _: 1
      }, 8, ["modelValue", "color"]);
    };
  }
});
const { Transition: Transition$1, mergeProps: _mergeProps$7, createVNode: _createVNode$j } = await importShared("vue");
const makeVDialogTransitionProps = propsFactory({
  target: [Object, Array]
}, "v-dialog-transition");
const saved = /* @__PURE__ */ new WeakMap();
const VDialogTransition = genericComponent()({
  name: "VDialogTransition",
  props: makeVDialogTransitionProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const functions = {
      onBeforeEnter(el) {
        el.style.pointerEvents = "none";
        el.style.visibility = "hidden";
      },
      async onEnter(el, done) {
        var _a;
        await new Promise((resolve) => requestAnimationFrame(resolve));
        await new Promise((resolve) => requestAnimationFrame(resolve));
        el.style.visibility = "";
        const dimensions = getDimensions(props.target, el);
        const {
          x,
          y,
          sx,
          sy,
          speed
        } = dimensions;
        saved.set(el, dimensions);
        const animation = animate(el, [{
          transform: `translate(${x}px, ${y}px) scale(${sx}, ${sy})`,
          opacity: 0
        }, {}], {
          duration: 225 * speed,
          easing: deceleratedEasing
        });
        (_a = getChildren(el)) == null ? void 0 : _a.forEach((el2) => {
          animate(el2, [{
            opacity: 0
          }, {
            opacity: 0,
            offset: 0.33
          }, {}], {
            duration: 225 * 2 * speed,
            easing: standardEasing
          });
        });
        animation.finished.then(() => done());
      },
      onAfterEnter(el) {
        el.style.removeProperty("pointer-events");
      },
      onBeforeLeave(el) {
        el.style.pointerEvents = "none";
      },
      async onLeave(el, done) {
        var _a;
        await new Promise((resolve) => requestAnimationFrame(resolve));
        let dimensions;
        if (!saved.has(el) || Array.isArray(props.target) || props.target.offsetParent || props.target.getClientRects().length) {
          dimensions = getDimensions(props.target, el);
        } else {
          dimensions = saved.get(el);
        }
        const {
          x,
          y,
          sx,
          sy,
          speed
        } = dimensions;
        const animation = animate(el, [{}, {
          transform: `translate(${x}px, ${y}px) scale(${sx}, ${sy})`,
          opacity: 0
        }], {
          duration: 125 * speed,
          easing: acceleratedEasing
        });
        animation.finished.then(() => done());
        (_a = getChildren(el)) == null ? void 0 : _a.forEach((el2) => {
          animate(el2, [{}, {
            opacity: 0,
            offset: 0.2
          }, {
            opacity: 0
          }], {
            duration: 125 * 2 * speed,
            easing: standardEasing
          });
        });
      },
      onAfterLeave(el) {
        el.style.removeProperty("pointer-events");
      }
    };
    return () => {
      return props.target ? _createVNode$j(Transition$1, _mergeProps$7({
        "name": "dialog-transition"
      }, functions, {
        "css": false
      }), slots) : _createVNode$j(Transition$1, {
        "name": "dialog-transition"
      }, slots);
    };
  }
});
function getChildren(el) {
  var _a;
  const els = (_a = el.querySelector(":scope > .v-card, :scope > .v-sheet, :scope > .v-list")) == null ? void 0 : _a.children;
  return els && [...els];
}
function getDimensions(target, el) {
  const targetBox = getTargetBox(target);
  const elBox = nullifyTransforms(el);
  const [originX, originY] = getComputedStyle(el).transformOrigin.split(" ").map((v) => parseFloat(v));
  const [anchorSide, anchorOffset] = getComputedStyle(el).getPropertyValue("--v-overlay-anchor-origin").split(" ");
  let offsetX = targetBox.left + targetBox.width / 2;
  if (anchorSide === "left" || anchorOffset === "left") {
    offsetX -= targetBox.width / 2;
  } else if (anchorSide === "right" || anchorOffset === "right") {
    offsetX += targetBox.width / 2;
  }
  let offsetY = targetBox.top + targetBox.height / 2;
  if (anchorSide === "top" || anchorOffset === "top") {
    offsetY -= targetBox.height / 2;
  } else if (anchorSide === "bottom" || anchorOffset === "bottom") {
    offsetY += targetBox.height / 2;
  }
  const tsx = targetBox.width / elBox.width;
  const tsy = targetBox.height / elBox.height;
  const maxs = Math.max(1, tsx, tsy);
  const sx = tsx / maxs || 0;
  const sy = tsy / maxs || 0;
  const asa = elBox.width * elBox.height / (window.innerWidth * window.innerHeight);
  const speed = asa > 0.12 ? Math.min(1.5, (asa - 0.12) * 10 + 1) : 1;
  return {
    x: offsetX - (originX + elBox.left),
    y: offsetY - (originY + elBox.top),
    sx,
    sy,
    speed
  };
}
const { createElementVNode: _createElementVNode$c, normalizeClass: _normalizeClass$b, normalizeStyle: _normalizeStyle$9, createVNode: _createVNode$i } = await importShared("vue");
const makeVListSubheaderProps = propsFactory({
  color: String,
  inset: Boolean,
  sticky: Boolean,
  title: String,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VListSubheader");
const VListSubheader = genericComponent()({
  name: "VListSubheader",
  props: makeVListSubheaderProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(() => props.color);
    useRender(() => {
      const hasText = !!(slots.default || props.title);
      return _createVNode$i(props.tag, {
        "class": _normalizeClass$b(["v-list-subheader", {
          "v-list-subheader--inset": props.inset,
          "v-list-subheader--sticky": props.sticky
        }, textColorClasses.value, props.class]),
        "style": _normalizeStyle$9([{
          textColorStyles
        }, props.style])
      }, {
        default: () => {
          var _a;
          return [hasText && _createElementVNode$c("div", {
            "class": "v-list-subheader__text"
          }, [((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? props.title])];
        }
      });
    });
    return {};
  }
});
const { normalizeClass: _normalizeClass$a, normalizeStyle: _normalizeStyle$8, createElementVNode: _createElementVNode$b } = await importShared("vue");
const { computed: computed$g } = await importShared("vue");
const makeVDividerProps = propsFactory({
  color: String,
  inset: Boolean,
  length: [Number, String],
  opacity: [Number, String],
  thickness: [Number, String],
  vertical: Boolean,
  ...makeComponentProps(),
  ...makeThemeProps()
}, "VDivider");
const VDivider = genericComponent()({
  name: "VDivider",
  props: makeVDividerProps(),
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(() => props.color);
    const dividerStyles = computed$g(() => {
      const styles = {};
      if (props.length) {
        styles[props.vertical ? "height" : "width"] = convertToUnit(props.length);
      }
      if (props.thickness) {
        styles[props.vertical ? "borderRightWidth" : "borderTopWidth"] = convertToUnit(props.thickness);
      }
      return styles;
    });
    useRender(() => {
      const divider = _createElementVNode$b("hr", {
        "class": _normalizeClass$a([{
          "v-divider": true,
          "v-divider--inset": props.inset,
          "v-divider--vertical": props.vertical
        }, themeClasses.value, textColorClasses.value, props.class]),
        "style": _normalizeStyle$8([dividerStyles.value, textColorStyles.value, {
          "--v-border-opacity": props.opacity
        }, props.style]),
        "aria-orientation": !attrs.role || attrs.role === "separator" ? props.vertical ? "vertical" : "horizontal" : void 0,
        "role": `${attrs.role || "separator"}`
      }, null);
      if (!slots.default) return divider;
      return _createElementVNode$b("div", {
        "class": _normalizeClass$a(["v-divider__wrapper", {
          "v-divider__wrapper--vertical": props.vertical,
          "v-divider__wrapper--inset": props.inset
        }])
      }, [divider, _createElementVNode$b("div", {
        "class": "v-divider__content"
      }, [slots.default()]), divider]);
    });
    return {};
  }
});
const { createVNode: _createVNode$h, mergeProps: _mergeProps$6 } = await importShared("vue");
const makeVListChildrenProps = propsFactory({
  items: Array,
  returnObject: Boolean
}, "VListChildren");
const VListChildren = genericComponent()({
  name: "VListChildren",
  props: makeVListChildrenProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    createList();
    return () => {
      var _a, _b;
      return ((_a = slots.default) == null ? void 0 : _a.call(slots)) ?? ((_b = props.items) == null ? void 0 : _b.map((_ref2) => {
        var _a2, _b2;
        let {
          children,
          props: itemProps,
          type,
          raw: item
        } = _ref2;
        if (type === "divider") {
          return ((_a2 = slots.divider) == null ? void 0 : _a2.call(slots, {
            props: itemProps
          })) ?? _createVNode$h(VDivider, itemProps, null);
        }
        if (type === "subheader") {
          return ((_b2 = slots.subheader) == null ? void 0 : _b2.call(slots, {
            props: itemProps
          })) ?? _createVNode$h(VListSubheader, itemProps, null);
        }
        const slotsWithItem = {
          subtitle: slots.subtitle ? (slotProps) => {
            var _a3;
            return (_a3 = slots.subtitle) == null ? void 0 : _a3.call(slots, {
              ...slotProps,
              item
            });
          } : void 0,
          prepend: slots.prepend ? (slotProps) => {
            var _a3;
            return (_a3 = slots.prepend) == null ? void 0 : _a3.call(slots, {
              ...slotProps,
              item
            });
          } : void 0,
          append: slots.append ? (slotProps) => {
            var _a3;
            return (_a3 = slots.append) == null ? void 0 : _a3.call(slots, {
              ...slotProps,
              item
            });
          } : void 0,
          title: slots.title ? (slotProps) => {
            var _a3;
            return (_a3 = slots.title) == null ? void 0 : _a3.call(slots, {
              ...slotProps,
              item
            });
          } : void 0
        };
        const listGroupProps = VListGroup.filterProps(itemProps);
        return children ? _createVNode$h(VListGroup, _mergeProps$6(listGroupProps, {
          "value": props.returnObject ? item : itemProps == null ? void 0 : itemProps.value,
          "rawId": itemProps == null ? void 0 : itemProps.value
        }), {
          activator: (_ref3) => {
            let {
              props: activatorProps
            } = _ref3;
            const listItemProps = {
              ...itemProps,
              ...activatorProps,
              value: props.returnObject ? item : itemProps.value
            };
            return slots.header ? slots.header({
              props: listItemProps
            }) : _createVNode$h(VListItem, listItemProps, slotsWithItem);
          },
          default: () => _createVNode$h(VListChildren, {
            "items": children,
            "returnObject": props.returnObject
          }, slots)
        }) : slots.item ? slots.item({
          props: itemProps
        }) : _createVNode$h(VListItem, _mergeProps$6(itemProps, {
          "value": props.returnObject ? item : itemProps.value
        }), slotsWithItem);
      }));
    };
  }
});
const { computed: computed$f, shallowRef: shallowRef$8, watchEffect: watchEffect$3 } = await importShared("vue");
const makeItemsProps = propsFactory({
  items: {
    type: Array,
    default: () => []
  },
  itemTitle: {
    type: [String, Array, Function],
    default: "title"
  },
  itemValue: {
    type: [String, Array, Function],
    default: "value"
  },
  itemChildren: {
    type: [Boolean, String, Array, Function],
    default: "children"
  },
  itemProps: {
    type: [Boolean, String, Array, Function],
    default: "props"
  },
  returnObject: Boolean,
  valueComparator: Function
}, "list-items");
function transformItem$1(props, item) {
  const title = getPropertyFromItem(item, props.itemTitle, item);
  const value = getPropertyFromItem(item, props.itemValue, title);
  const children = getPropertyFromItem(item, props.itemChildren);
  const itemProps = props.itemProps === true ? typeof item === "object" && item != null && !Array.isArray(item) ? "children" in item ? omit(item, ["children"]) : item : void 0 : getPropertyFromItem(item, props.itemProps);
  const _props = {
    title,
    value,
    ...itemProps
  };
  return {
    title: String(_props.title ?? ""),
    value: _props.value,
    props: _props,
    children: Array.isArray(children) ? transformItems$1(props, children) : void 0,
    raw: item
  };
}
function transformItems$1(props, items) {
  const _props = pick(props, ["itemTitle", "itemValue", "itemChildren", "itemProps", "returnObject", "valueComparator"]);
  const array = [];
  for (const item of items) {
    array.push(transformItem$1(_props, item));
  }
  return array;
}
function useItems(props) {
  const items = computed$f(() => transformItems$1(props, props.items));
  const hasNullItem = computed$f(() => items.value.some((item) => item.value === null));
  const itemsMap = shallowRef$8(/* @__PURE__ */ new Map());
  const keylessItems = shallowRef$8([]);
  watchEffect$3(() => {
    const _items = items.value;
    const map = /* @__PURE__ */ new Map();
    const keyless = [];
    for (let i = 0; i < _items.length; i++) {
      const item = _items[i];
      if (isPrimitive(item.value) || item.value === null) {
        let values = map.get(item.value);
        if (!values) {
          values = [];
          map.set(item.value, values);
        }
        values.push(item);
      } else {
        keyless.push(item);
      }
    }
    itemsMap.value = map;
    keylessItems.value = keyless;
  });
  function transformIn(value) {
    const _items = itemsMap.value;
    const _allItems = items.value;
    const _keylessItems = keylessItems.value;
    const _hasNullItem = hasNullItem.value;
    const _returnObject = props.returnObject;
    const hasValueComparator = !!props.valueComparator;
    const valueComparator = props.valueComparator || deepEqual;
    const _props = pick(props, ["itemTitle", "itemValue", "itemChildren", "itemProps", "returnObject", "valueComparator"]);
    const returnValue = [];
    main: for (const v of value) {
      if (!_hasNullItem && v === null) continue;
      if (_returnObject && typeof v === "string") {
        returnValue.push(transformItem$1(_props, v));
        continue;
      }
      const fastItems = _items.get(v);
      if (hasValueComparator || !fastItems) {
        for (const item of hasValueComparator ? _allItems : _keylessItems) {
          if (valueComparator(v, item.value)) {
            returnValue.push(item);
            continue main;
          }
        }
        returnValue.push(transformItem$1(_props, v));
        continue;
      }
      returnValue.push(...fastItems);
    }
    return returnValue;
  }
  function transformOut(value) {
    return props.returnObject ? value.map((_ref) => {
      let {
        raw
      } = _ref;
      return raw;
    }) : value.map((_ref2) => {
      let {
        value: value2
      } = _ref2;
      return value2;
    });
  }
  return {
    items,
    transformIn,
    transformOut
  };
}
const { createVNode: _createVNode$g, normalizeClass: _normalizeClass$9, normalizeStyle: _normalizeStyle$7 } = await importShared("vue");
const { computed: computed$e, ref: ref$a, shallowRef: shallowRef$7, toRef: toRef$8 } = await importShared("vue");
function transformItem(props, item) {
  const type = getPropertyFromItem(item, props.itemType, "item");
  const title = isPrimitive(item) ? item : getPropertyFromItem(item, props.itemTitle);
  const value = getPropertyFromItem(item, props.itemValue, void 0);
  const children = getPropertyFromItem(item, props.itemChildren);
  const itemProps = props.itemProps === true ? omit(item, ["children"]) : getPropertyFromItem(item, props.itemProps);
  const _props = {
    title,
    value,
    ...itemProps
  };
  return {
    type,
    title: _props.title,
    value: _props.value,
    props: _props,
    children: type === "item" && children ? transformItems(props, children) : void 0,
    raw: item
  };
}
function transformItems(props, items) {
  const array = [];
  for (const item of items) {
    array.push(transformItem(props, item));
  }
  return array;
}
function useListItems(props) {
  const items = computed$e(() => transformItems(props, props.items));
  return {
    items
  };
}
const makeVListProps = propsFactory({
  baseColor: String,
  /* @deprecated */
  activeColor: String,
  activeClass: String,
  bgColor: String,
  disabled: Boolean,
  expandIcon: IconValue,
  collapseIcon: IconValue,
  lines: {
    type: [Boolean, String],
    default: "one"
  },
  slim: Boolean,
  nav: Boolean,
  "onClick:open": EventProp(),
  "onClick:select": EventProp(),
  "onUpdate:opened": EventProp(),
  ...makeNestedProps({
    selectStrategy: "single-leaf",
    openStrategy: "list"
  }),
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  itemType: {
    type: String,
    default: "type"
  },
  ...makeItemsProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "text"
  })
}, "VList");
const VList = genericComponent()({
  name: "VList",
  props: makeVListProps(),
  emits: {
    "update:selected": (value) => true,
    "update:activated": (value) => true,
    "update:opened": (value) => true,
    "click:open": (value) => true,
    "click:activate": (value) => true,
    "click:select": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      items
    } = useListItems(props);
    const {
      themeClasses
    } = provideTheme(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.bgColor);
    const {
      borderClasses
    } = useBorder(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      children,
      open,
      parents,
      select,
      getPath
    } = useNested(props);
    const lineClasses = toRef$8(() => props.lines ? `v-list--${props.lines}-line` : void 0);
    const activeColor = toRef$8(() => props.activeColor);
    const baseColor = toRef$8(() => props.baseColor);
    const color = toRef$8(() => props.color);
    createList();
    provideDefaults({
      VListGroup: {
        activeColor,
        baseColor,
        color,
        expandIcon: toRef$8(() => props.expandIcon),
        collapseIcon: toRef$8(() => props.collapseIcon)
      },
      VListItem: {
        activeClass: toRef$8(() => props.activeClass),
        activeColor,
        baseColor,
        color,
        density: toRef$8(() => props.density),
        disabled: toRef$8(() => props.disabled),
        lines: toRef$8(() => props.lines),
        nav: toRef$8(() => props.nav),
        slim: toRef$8(() => props.slim),
        variant: toRef$8(() => props.variant)
      }
    });
    const isFocused = shallowRef$7(false);
    const contentRef = ref$a();
    function onFocusin(e) {
      isFocused.value = true;
    }
    function onFocusout(e) {
      isFocused.value = false;
    }
    function onFocus(e) {
      var _a;
      if (!isFocused.value && !(e.relatedTarget && ((_a = contentRef.value) == null ? void 0 : _a.contains(e.relatedTarget)))) focus();
    }
    function onKeydown(e) {
      const target = e.target;
      if (!contentRef.value || ["INPUT", "TEXTAREA"].includes(target.tagName)) return;
      if (e.key === "ArrowDown") {
        focus("next");
      } else if (e.key === "ArrowUp") {
        focus("prev");
      } else if (e.key === "Home") {
        focus("first");
      } else if (e.key === "End") {
        focus("last");
      } else {
        return;
      }
      e.preventDefault();
    }
    function onMousedown(e) {
      isFocused.value = true;
    }
    function focus(location) {
      if (contentRef.value) {
        return focusChild(contentRef.value, location);
      }
    }
    useRender(() => {
      return _createVNode$g(props.tag, {
        "ref": contentRef,
        "class": _normalizeClass$9(["v-list", {
          "v-list--disabled": props.disabled,
          "v-list--nav": props.nav,
          "v-list--slim": props.slim
        }, themeClasses.value, backgroundColorClasses.value, borderClasses.value, densityClasses.value, elevationClasses.value, lineClasses.value, roundedClasses.value, props.class]),
        "style": _normalizeStyle$7([backgroundColorStyles.value, dimensionStyles.value, props.style]),
        "tabindex": props.disabled ? -1 : 0,
        "role": "listbox",
        "aria-activedescendant": void 0,
        "onFocusin": onFocusin,
        "onFocusout": onFocusout,
        "onFocus": onFocus,
        "onKeydown": onKeydown,
        "onMousedown": onMousedown
      }, {
        default: () => [_createVNode$g(VListChildren, {
          "items": items.value,
          "returnObject": props.returnObject
        }, slots)]
      });
    });
    return {
      open,
      select,
      focus,
      children,
      parents,
      getPath
    };
  }
});
const { defineStore } = await importShared("pinia");
const { computed: computed$d, ref: ref$9 } = await importShared("vue");
const usePublishStore = defineStore("publish", () => {
  const publish = ref$9(false);
  const getValue = computed$d(() => publish.value);
  function toggle() {
    publish.value = !publish.value;
  }
  return { toggle, getValue };
});
const required = (value, text) => {
  return !!value || text;
};
const passwordRegExp = /^(?=.*[!@#$%^&*(),.?":{}|<>~_-])(?=.*[a-zA-Z])(?=.*[0-9])[a-zA-Z\d!@#$%^&*(),.?":{}|<>~_-]{8,}$/;
const passwordRule = (value, text) => {
  return passwordRegExp.test(value) || text;
};
const { defineComponent: _defineComponent$3 } = await importShared("vue");
const { resolveComponent: _resolveComponent$2, createVNode: _createVNode$f, createElementVNode: _createElementVNode$a, withCtx: _withCtx$3, toDisplayString: _toDisplayString$3, createTextVNode: _createTextVNode$2, Fragment: _Fragment$2, openBlock: _openBlock$3, createElementBlock: _createElementBlock$3 } = await importShared("vue");
const _hoisted_1$2 = { class: "dialog-body" };
const _hoisted_2$1 = { class: "form-section" };
const _hoisted_3$1 = { class: "form-section" };
const _hoisted_4 = { class: "input-section" };
const _hoisted_5 = { class: "input-section" };
const _hoisted_6 = { class: "input-section" };
const { reactive: reactive$3, ref: ref$8, watch: watch$7 } = await importShared("vue");
const _sfc_main$2 = /* @__PURE__ */ _defineComponent$3({
  __name: "ProfileDialog",
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const authStore = useAuthStore();
    const props = __props;
    watch$7(
      () => props.isOpen,
      () => {
        var _a;
        if (props.isOpen) {
          const user = JSON.parse((_a = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a.getItem("user_info"));
          data.value.infoCloseCheck = false;
          data.value.pwCloseCheck = false;
          data.value.newPassword = "";
          data.value.newPasswordCheck = "";
          axiosInstance.get(`/krakend/svcfw/api/users/${user.userId}`).then((res) => {
            userInfo.userId = res.data.userId;
            userInfo.name = res.data.name;
            userInfo.email = res.data.email;
            userInfo.phone = res.data.phone;
            userInfo.roleName = res.data.roleName;
          });
        }
      }
    );
    const { t } = useI18n();
    const confirm = reactive$3({
      message: "Please check password.",
      visible: false
    });
    const data = ref$8({
      infoCloseCheck: false,
      pwCloseCheck: false,
      password: "",
      newPassword: "",
      newPasswordCheck: "",
      rules: [(value) => passwordRule(value, t("rules.passwordRule"))]
    });
    watch$7(
      () => data.value.infoCloseCheck,
      () => {
        if (data.value.infoCloseCheck && data.value.pwCloseCheck) {
          close();
        }
      }
    );
    watch$7(
      () => data.value.pwCloseCheck,
      () => {
        if (data.value.infoCloseCheck && data.value.pwCloseCheck) {
          close();
        }
      }
    );
    const userInfo = reactive$3({
      userId: "",
      name: "",
      email: "",
      phone: "",
      roleName: ""
    });
    const emit = __emit;
    function onClickSave() {
      data.value.infoCloseCheck = false;
      data.value.pwCloseCheck = false;
      if (data.value.newPassword !== "") {
        if (!passwordRule(data.value.newPassword)) {
          confirm.message = "Please check password.";
          confirm.visible = true;
          return;
        }
        if (data.value.newPassword !== data.value.newPasswordCheck) {
          confirm.message = "Please check password.";
          confirm.visible = true;
          return;
        }
        axiosInstance.patch(`/krakend/svcfw/api/users/${userInfo.userId}/password/change`, { newPassword: data.value.newPassword }).then((res) => {
          authStore.logout(getRefreshToken());
          data.value.pwCloseCheck = true;
        }).catch((err) => {
          if (err.response.data.resultCode === "SFAP-APID-COMM-0107") {
            confirm.message = "You cannot change your password. You can change your password after one week from the time of changing the password.";
            confirm.visible = true;
          }
          if (err.response.data.resultCode === "SFAP-APID-COMM-0503" && err.response.data.resultMessage.includes("last 1 passwords")) {
            confirm.message = "Must not be equal to any of last 1 passwords.";
            confirm.visible = true;
          }
        });
      } else data.value.pwCloseCheck = true;
      axiosInstance.patch(`/krakend/svcfw/api/users/${userInfo.userId}`, { name: userInfo.name, email: userInfo.email, phone: userInfo.phone }).then(() => {
        data.value.infoCloseCheck = true;
      }).catch((err) => {
        Message().err(err.response.data.resultMessage);
      });
    }
    function onClickCloseConfirm() {
      var _a;
      const statusCheck = (_a = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a.getItem("status_check");
      if (statusCheck === "EXPIRED") {
        sessionLogout();
        window.location.reload();
      }
      confirm.visible = false;
    }
    const close = () => {
      var _a;
      const statusCheck = (_a = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _a.getItem("status_check");
      if (statusCheck === "EXPIRED") {
        sessionLogout();
        window.location.reload();
      }
      userInfo.userId = "";
      userInfo.name = "";
      userInfo.phone = "";
      userInfo.roleName = "", data.value.newPassword = "";
      data.value.newPasswordCheck = "";
      emit("close");
    };
    return (_ctx, _cache) => {
      const _component_BaseTextField = _resolveComponent$2("BaseTextField");
      const _component_BaseDialog = _resolveComponent$2("BaseDialog");
      const _component_ConfirmDialog = _resolveComponent$2("ConfirmDialog");
      return _openBlock$3(), _createElementBlock$3(_Fragment$2, null, [
        _createVNode$f(_component_BaseDialog, {
          "is-open": __props.isOpen,
          title: "User Profile",
          "confirm-title": "Save",
          "cancel-title": "Close",
          "onClick:cancel": close,
          "onClick:confirm": onClickSave,
          width: 540
        }, {
          body: _withCtx$3(() => [
            _createElementVNode$a("div", _hoisted_1$2, [
              _createElementVNode$a("div", _hoisted_2$1, [
                _createVNode$f(_component_BaseTextField, {
                  modelValue: userInfo.userId,
                  "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => userInfo.userId = $event),
                  label: "User ID",
                  placeholder: "Please enter your ID",
                  disabled: ""
                }, null, 8, ["modelValue"]),
                _createVNode$f(_component_BaseTextField, {
                  modelValue: userInfo.name,
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => userInfo.name = $event),
                  label: "User name",
                  placeholder: "Please enter your name"
                }, null, 8, ["modelValue"])
              ]),
              _createElementVNode$a("div", _hoisted_3$1, [
                _createVNode$f(_component_BaseTextField, {
                  modelValue: userInfo.email,
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => userInfo.email = $event),
                  label: "E-mail",
                  placeholder: "Please enter your email"
                }, null, 8, ["modelValue"]),
                _createVNode$f(_component_BaseTextField, {
                  modelValue: userInfo.phone,
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => userInfo.phone = $event),
                  label: "Contact",
                  placeholder: "Please enter your phone number"
                }, null, 8, ["modelValue"])
              ]),
              _createElementVNode$a("div", _hoisted_4, [
                _createVNode$f(_component_BaseTextField, {
                  modelValue: userInfo.roleName,
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => userInfo.roleName = $event),
                  label: "User Group",
                  placeholder: "Please enter your group",
                  disabled: ""
                }, null, 8, ["modelValue"])
              ]),
              _createElementVNode$a("div", _hoisted_5, [
                _createVNode$f(_component_BaseTextField, {
                  modelValue: data.value.newPassword,
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => data.value.newPassword = $event),
                  type: "password",
                  label: "New Password",
                  placeholder: _ctx.$t("change-pw.new"),
                  rules: data.value.rules,
                  hint: "Please set the password within 8 to 20 digits by combining numbers, English and special characters. 3 consecutive duplicates and spaces are not allowed."
                }, null, 8, ["modelValue", "placeholder", "rules"])
              ]),
              _createElementVNode$a("div", _hoisted_6, [
                _createVNode$f(_component_BaseTextField, {
                  modelValue: data.value.newPasswordCheck,
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => data.value.newPasswordCheck = $event),
                  type: "password",
                  label: "Confirm Password",
                  placeholder: _ctx.$t("change-pw.newRe"),
                  rules: [(value) => value === data.value.newPassword || "Passwords do not match. Please re-enter after confirmation."],
                  hint: "Please re-enter your password."
                }, null, 8, ["modelValue", "placeholder", "rules"])
              ])
            ])
          ]),
          _: 1
        }, 8, ["is-open"]),
        _createVNode$f(_component_ConfirmDialog, {
          "is-open": confirm.visible,
          "confirm-btn-text": "Ok",
          persistent: "",
          "onClick:confirm": onClickCloseConfirm,
          "onClick:cancel": onClickCloseConfirm
        }, {
          default: _withCtx$3(() => [
            _createTextVNode$2(_toDisplayString$3(confirm.message), 1)
          ]),
          _: 1
        }, 8, ["is-open"])
      ], 64);
    };
  }
});
const { normalizeClass: _normalizeClass$8, normalizeStyle: _normalizeStyle$6, createVNode: _createVNode$e } = await importShared("vue");
const { toRef: toRef$7 } = await importShared("vue");
const makeVBtnGroupProps = propsFactory({
  baseColor: String,
  divided: Boolean,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeTagProps(),
  ...makeThemeProps(),
  ...makeVariantProps()
}, "VBtnGroup");
const VBtnGroup = genericComponent()({
  name: "VBtnGroup",
  props: makeVBtnGroupProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    provideDefaults({
      VBtn: {
        height: "auto",
        baseColor: toRef$7(() => props.baseColor),
        color: toRef$7(() => props.color),
        density: toRef$7(() => props.density),
        flat: true,
        variant: toRef$7(() => props.variant)
      }
    });
    useRender(() => {
      return _createVNode$e(props.tag, {
        "class": _normalizeClass$8(["v-btn-group", {
          "v-btn-group--divided": props.divided
        }, themeClasses.value, borderClasses.value, densityClasses.value, elevationClasses.value, roundedClasses.value, props.class]),
        "style": _normalizeStyle$6(props.style)
      }, slots);
    });
  }
});
const { computed: computed$c, inject: inject$1, onBeforeUnmount: onBeforeUnmount$5, onMounted: onMounted$5, onUpdated, provide: provide$1, reactive: reactive$2, toRef: toRef$6, unref, useId: useId$1, watch: watch$6 } = await importShared("vue");
const makeGroupProps = propsFactory({
  modelValue: {
    type: null,
    default: void 0
  },
  multiple: Boolean,
  mandatory: [Boolean, String],
  max: Number,
  selectedClass: String,
  disabled: Boolean
}, "group");
const makeGroupItemProps = propsFactory({
  value: null,
  disabled: Boolean,
  selectedClass: String
}, "group-item");
function useGroupItem(props, injectKey) {
  let required2 = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : true;
  const vm = getCurrentInstance("useGroupItem");
  if (!vm) {
    throw new Error("[Vuetify] useGroupItem composable must be used inside a component setup function");
  }
  const id = useId$1();
  provide$1(Symbol.for(`${injectKey.description}:id`), id);
  const group = inject$1(injectKey, null);
  if (!group) {
    if (!required2) return group;
    throw new Error(`[Vuetify] Could not find useGroup injection with symbol ${injectKey.description}`);
  }
  const value = toRef$6(() => props.value);
  const disabled = computed$c(() => !!(group.disabled.value || props.disabled));
  group.register({
    id,
    value,
    disabled
  }, vm);
  onBeforeUnmount$5(() => {
    group.unregister(id);
  });
  const isSelected = computed$c(() => {
    return group.isSelected(id);
  });
  const isFirst = computed$c(() => {
    return group.items.value[0].id === id;
  });
  const isLast = computed$c(() => {
    return group.items.value[group.items.value.length - 1].id === id;
  });
  const selectedClass = computed$c(() => isSelected.value && [group.selectedClass.value, props.selectedClass]);
  watch$6(isSelected, (value2) => {
    vm.emit("group:selected", {
      value: value2
    });
  }, {
    flush: "sync"
  });
  return {
    id,
    isSelected,
    isFirst,
    isLast,
    toggle: () => group.select(id, !isSelected.value),
    select: (value2) => group.select(id, value2),
    selectedClass,
    value,
    disabled,
    group
  };
}
function useGroup(props, injectKey) {
  let isUnmounted = false;
  const items = reactive$2([]);
  const selected = useProxiedModel(props, "modelValue", [], (v) => {
    if (v == null) return [];
    return getIds(items, wrapInArray(v));
  }, (v) => {
    const arr = getValues(items, v);
    return props.multiple ? arr : arr[0];
  });
  const groupVm = getCurrentInstance("useGroup");
  function register(item, vm) {
    const unwrapped = item;
    const key = Symbol.for(`${injectKey.description}:id`);
    const children = findChildrenWithProvide(key, groupVm == null ? void 0 : groupVm.vnode);
    const index = children.indexOf(vm);
    if (unref(unwrapped.value) == null) {
      unwrapped.value = index;
      unwrapped.useIndexAsValue = true;
    }
    if (index > -1) {
      items.splice(index, 0, unwrapped);
    } else {
      items.push(unwrapped);
    }
  }
  function unregister(id) {
    if (isUnmounted) return;
    forceMandatoryValue();
    const index = items.findIndex((item) => item.id === id);
    items.splice(index, 1);
  }
  function forceMandatoryValue() {
    const item = items.find((item2) => !item2.disabled);
    if (item && props.mandatory === "force" && !selected.value.length) {
      selected.value = [item.id];
    }
  }
  onMounted$5(() => {
    forceMandatoryValue();
  });
  onBeforeUnmount$5(() => {
    isUnmounted = true;
  });
  onUpdated(() => {
    for (let i = 0; i < items.length; i++) {
      if (items[i].useIndexAsValue) {
        items[i].value = i;
      }
    }
  });
  function select(id, value) {
    const item = items.find((item2) => item2.id === id);
    if (value && (item == null ? void 0 : item.disabled)) return;
    if (props.multiple) {
      const internalValue = selected.value.slice();
      const index = internalValue.findIndex((v) => v === id);
      const isSelected = ~index;
      value = value ?? !isSelected;
      if (isSelected && props.mandatory && internalValue.length <= 1) return;
      if (!isSelected && props.max != null && internalValue.length + 1 > props.max) return;
      if (index < 0 && value) internalValue.push(id);
      else if (index >= 0 && !value) internalValue.splice(index, 1);
      selected.value = internalValue;
    } else {
      const isSelected = selected.value.includes(id);
      if (props.mandatory && isSelected) return;
      if (!isSelected && !value) return;
      selected.value = value ?? !isSelected ? [id] : [];
    }
  }
  function step(offset) {
    if (props.multiple) consoleWarn('This method is not supported when using "multiple" prop');
    if (!selected.value.length) {
      const item = items.find((item2) => !item2.disabled);
      item && (selected.value = [item.id]);
    } else {
      const currentId = selected.value[0];
      const currentIndex = items.findIndex((i) => i.id === currentId);
      let newIndex = (currentIndex + offset) % items.length;
      let newItem = items[newIndex];
      while (newItem.disabled && newIndex !== currentIndex) {
        newIndex = (newIndex + offset) % items.length;
        newItem = items[newIndex];
      }
      if (newItem.disabled) return;
      selected.value = [items[newIndex].id];
    }
  }
  const state = {
    register,
    unregister,
    selected,
    select,
    disabled: toRef$6(() => props.disabled),
    prev: () => step(items.length - 1),
    next: () => step(1),
    isSelected: (id) => selected.value.includes(id),
    selectedClass: toRef$6(() => props.selectedClass),
    items: toRef$6(() => items),
    getItemIndex: (value) => getItemIndex(items, value)
  };
  provide$1(injectKey, state);
  return state;
}
function getItemIndex(items, value) {
  const ids = getIds(items, [value]);
  if (!ids.length) return -1;
  return items.findIndex((item) => item.id === ids[0]);
}
function getIds(items, modelValue) {
  const ids = [];
  modelValue.forEach((value) => {
    const item = items.find((item2) => deepEqual(value, item2.value));
    const itemByIndex = items[value];
    if ((item == null ? void 0 : item.value) != null) {
      ids.push(item.id);
    } else if (itemByIndex != null) {
      ids.push(itemByIndex.id);
    }
  });
  return ids;
}
function getValues(items, ids) {
  const values = [];
  ids.forEach((id) => {
    const itemIndex = items.findIndex((item) => item.id === id);
    if (~itemIndex) {
      const item = items[itemIndex];
      values.push(item.value != null ? item.value : itemIndex);
    }
  });
  return values;
}
const { mergeProps: _mergeProps$5, createVNode: _createVNode$d } = await importShared("vue");
const VBtnToggleSymbol = Symbol.for("vuetify:v-btn-toggle");
const makeVBtnToggleProps = propsFactory({
  ...makeVBtnGroupProps(),
  ...makeGroupProps()
}, "VBtnToggle");
const VBtnToggle = genericComponent()({
  name: "VBtnToggle",
  props: makeVBtnToggleProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      isSelected,
      next,
      prev,
      select,
      selected
    } = useGroup(props, VBtnToggleSymbol);
    useRender(() => {
      const btnGroupProps = VBtnGroup.filterProps(props);
      return _createVNode$d(VBtnGroup, _mergeProps$5({
        "class": ["v-btn-toggle", props.class]
      }, btnGroupProps, {
        "style": props.style
      }), {
        default: () => {
          var _a;
          return [(_a = slots.default) == null ? void 0 : _a.call(slots, {
            isSelected,
            next,
            prev,
            select,
            selected
          })];
        }
      });
    });
    return {
      next,
      prev,
      select
    };
  }
});
const { normalizeClass: _normalizeClass$7, normalizeStyle: _normalizeStyle$5, createElementVNode: _createElementVNode$9, createVNode: _createVNode$c } = await importShared("vue");
const { ref: ref$7, toRef: toRef$5, watchEffect: watchEffect$2 } = await importShared("vue");
const makeVProgressCircularProps = propsFactory({
  bgColor: String,
  color: String,
  indeterminate: [Boolean, String],
  modelValue: {
    type: [Number, String],
    default: 0
  },
  rotate: {
    type: [Number, String],
    default: 0
  },
  width: {
    type: [Number, String],
    default: 4
  },
  ...makeComponentProps(),
  ...makeSizeProps(),
  ...makeTagProps({
    tag: "div"
  }),
  ...makeThemeProps()
}, "VProgressCircular");
const VProgressCircular = genericComponent()({
  name: "VProgressCircular",
  props: makeVProgressCircularProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const MAGIC_RADIUS_CONSTANT = 20;
    const CIRCUMFERENCE = 2 * Math.PI * MAGIC_RADIUS_CONSTANT;
    const root = ref$7();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      sizeClasses,
      sizeStyles
    } = useSize(props);
    const {
      textColorClasses,
      textColorStyles
    } = useTextColor(() => props.color);
    const {
      textColorClasses: underlayColorClasses,
      textColorStyles: underlayColorStyles
    } = useTextColor(() => props.bgColor);
    const {
      intersectionRef,
      isIntersecting
    } = useIntersectionObserver();
    const {
      resizeRef,
      contentRect
    } = useResizeObserver();
    const normalizedValue = toRef$5(() => clamp(parseFloat(props.modelValue), 0, 100));
    const width = toRef$5(() => Number(props.width));
    const size = toRef$5(() => {
      return sizeStyles.value ? Number(props.size) : contentRect.value ? contentRect.value.width : Math.max(width.value, 32);
    });
    const diameter = toRef$5(() => MAGIC_RADIUS_CONSTANT / (1 - width.value / size.value) * 2);
    const strokeWidth = toRef$5(() => width.value / size.value * diameter.value);
    const strokeDashOffset = toRef$5(() => convertToUnit((100 - normalizedValue.value) / 100 * CIRCUMFERENCE));
    watchEffect$2(() => {
      intersectionRef.value = root.value;
      resizeRef.value = root.value;
    });
    useRender(() => _createVNode$c(props.tag, {
      "ref": root,
      "class": _normalizeClass$7(["v-progress-circular", {
        "v-progress-circular--indeterminate": !!props.indeterminate,
        "v-progress-circular--visible": isIntersecting.value,
        "v-progress-circular--disable-shrink": props.indeterminate === "disable-shrink"
      }, themeClasses.value, sizeClasses.value, textColorClasses.value, props.class]),
      "style": _normalizeStyle$5([sizeStyles.value, textColorStyles.value, props.style]),
      "role": "progressbar",
      "aria-valuemin": "0",
      "aria-valuemax": "100",
      "aria-valuenow": props.indeterminate ? void 0 : normalizedValue.value
    }, {
      default: () => [_createElementVNode$9("svg", {
        "style": {
          transform: `rotate(calc(-90deg + ${Number(props.rotate)}deg))`
        },
        "xmlns": "http://www.w3.org/2000/svg",
        "viewBox": `0 0 ${diameter.value} ${diameter.value}`
      }, [_createElementVNode$9("circle", {
        "class": _normalizeClass$7(["v-progress-circular__underlay", underlayColorClasses.value]),
        "style": _normalizeStyle$5(underlayColorStyles.value),
        "fill": "transparent",
        "cx": "50%",
        "cy": "50%",
        "r": MAGIC_RADIUS_CONSTANT,
        "stroke-width": strokeWidth.value,
        "stroke-dasharray": CIRCUMFERENCE,
        "stroke-dashoffset": 0
      }, null), _createElementVNode$9("circle", {
        "class": "v-progress-circular__overlay",
        "fill": "transparent",
        "cx": "50%",
        "cy": "50%",
        "r": MAGIC_RADIUS_CONSTANT,
        "stroke-width": strokeWidth.value,
        "stroke-dasharray": CIRCUMFERENCE,
        "stroke-dashoffset": strokeDashOffset.value
      }, null)]), slots.default && _createElementVNode$9("div", {
        "class": "v-progress-circular__content"
      }, [slots.default({
        value: normalizedValue.value
      })])]
    }));
    return {};
  }
});
const { createVNode: _createVNode$b, normalizeClass: _normalizeClass$6, createElementVNode: _createElementVNode$8 } = await importShared("vue");
const { toRef: toRef$4 } = await importShared("vue");
const makeLoaderProps = propsFactory({
  loading: [Boolean, String]
}, "loader");
function useLoader(props) {
  let name = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : getCurrentInstanceName();
  const loaderClasses = toRef$4(() => ({
    [`${name}--loading`]: props.loading
  }));
  return {
    loaderClasses
  };
}
function LoaderSlot(props, _ref) {
  var _a;
  let {
    slots
  } = _ref;
  return _createElementVNode$8("div", {
    "class": _normalizeClass$6(`${props.name}__loader`)
  }, [((_a = slots.default) == null ? void 0 : _a.call(slots, {
    color: props.color,
    isActive: props.active
  })) || _createVNode$b(VProgressLinear, {
    "absolute": props.absolute,
    "active": props.active,
    "color": props.color,
    "height": "2",
    "indeterminate": true
  }, null)]);
}
const { nextTick: nextTick$2, watch: watch$5 } = await importShared("vue");
function useSelectLink(link, select) {
  watch$5(() => {
    var _a;
    return (_a = link.isActive) == null ? void 0 : _a.value;
  }, (isActive) => {
    if (link.isLink.value && isActive != null && select) {
      nextTick$2(() => {
        select(isActive);
      });
    }
  }, {
    immediate: true
  });
}
const { createVNode: _createVNode$a, createElementVNode: _createElementVNode$7, mergeProps: _mergeProps$4 } = await importShared("vue");
const { computed: computed$b, toDisplayString, toRef: toRef$3, withDirectives } = await importShared("vue");
const makeVBtnProps = propsFactory({
  active: {
    type: Boolean,
    default: void 0
  },
  activeColor: String,
  baseColor: String,
  symbol: {
    type: null,
    default: VBtnToggleSymbol
  },
  flat: Boolean,
  icon: [Boolean, String, Function, Object],
  prependIcon: IconValue,
  appendIcon: IconValue,
  block: Boolean,
  readonly: Boolean,
  slim: Boolean,
  stacked: Boolean,
  ripple: {
    type: [Boolean, Object],
    default: true
  },
  text: {
    type: [String, Number, Boolean],
    default: void 0
  },
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDensityProps(),
  ...makeDimensionProps(),
  ...makeElevationProps(),
  ...makeGroupItemProps(),
  ...makeLoaderProps(),
  ...makeLocationProps(),
  ...makePositionProps(),
  ...makeRoundedProps(),
  ...makeRouterProps(),
  ...makeSizeProps(),
  ...makeTagProps({
    tag: "button"
  }),
  ...makeThemeProps(),
  ...makeVariantProps({
    variant: "elevated"
  })
}, "VBtn");
const VBtn = genericComponent()({
  name: "VBtn",
  props: makeVBtnProps(),
  emits: {
    "group:selected": (val) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      slots
    } = _ref;
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      densityClasses
    } = useDensity(props);
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      loaderClasses
    } = useLoader(props);
    const {
      locationStyles
    } = useLocation(props);
    const {
      positionClasses
    } = usePosition(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      sizeClasses,
      sizeStyles
    } = useSize(props);
    const group = useGroupItem(props, props.symbol, false);
    const link = useLink(props, attrs);
    const isActive = computed$b(() => {
      var _a;
      if (props.active !== void 0) {
        return props.active;
      }
      if (link.isLink.value) {
        return (_a = link.isActive) == null ? void 0 : _a.value;
      }
      return group == null ? void 0 : group.isSelected.value;
    });
    const color = toRef$3(() => isActive.value ? props.activeColor ?? props.color : props.color);
    const variantProps = computed$b(() => {
      var _a, _b;
      const showColor = (group == null ? void 0 : group.isSelected.value) && (!link.isLink.value || ((_a = link.isActive) == null ? void 0 : _a.value)) || !group || ((_b = link.isActive) == null ? void 0 : _b.value);
      return {
        color: showColor ? color.value ?? props.baseColor : props.baseColor,
        variant: props.variant
      };
    });
    const {
      colorClasses,
      colorStyles,
      variantClasses
    } = useVariant(variantProps);
    const isDisabled = computed$b(() => (group == null ? void 0 : group.disabled.value) || props.disabled);
    const isElevated = toRef$3(() => {
      return props.variant === "elevated" && !(props.disabled || props.flat || props.border);
    });
    const valueAttr = computed$b(() => {
      if (props.value === void 0 || typeof props.value === "symbol") return void 0;
      return Object(props.value) === props.value ? JSON.stringify(props.value, null, 0) : props.value;
    });
    function onClick(e) {
      var _a;
      if (isDisabled.value || link.isLink.value && (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0 || attrs.target === "_blank")) return;
      (_a = link.navigate) == null ? void 0 : _a.call(link, e);
      group == null ? void 0 : group.toggle();
    }
    useSelectLink(link, group == null ? void 0 : group.select);
    useRender(() => {
      const Tag = link.isLink.value ? "a" : props.tag;
      const hasPrepend = !!(props.prependIcon || slots.prepend);
      const hasAppend = !!(props.appendIcon || slots.append);
      const hasIcon = !!(props.icon && props.icon !== true);
      return withDirectives(_createVNode$a(Tag, _mergeProps$4({
        "type": Tag === "a" ? void 0 : "button",
        "class": ["v-btn", group == null ? void 0 : group.selectedClass.value, {
          "v-btn--active": isActive.value,
          "v-btn--block": props.block,
          "v-btn--disabled": isDisabled.value,
          "v-btn--elevated": isElevated.value,
          "v-btn--flat": props.flat,
          "v-btn--icon": !!props.icon,
          "v-btn--loading": props.loading,
          "v-btn--readonly": props.readonly,
          "v-btn--slim": props.slim,
          "v-btn--stacked": props.stacked
        }, themeClasses.value, borderClasses.value, colorClasses.value, densityClasses.value, elevationClasses.value, loaderClasses.value, positionClasses.value, roundedClasses.value, sizeClasses.value, variantClasses.value, props.class],
        "style": [colorStyles.value, dimensionStyles.value, locationStyles.value, sizeStyles.value, props.style],
        "aria-busy": props.loading ? true : void 0,
        "disabled": isDisabled.value || void 0,
        "tabindex": props.loading || props.readonly ? -1 : void 0,
        "onClick": onClick,
        "value": valueAttr.value
      }, link.linkProps), {
        default: () => {
          var _a;
          return [genOverlays(true, "v-btn"), !props.icon && hasPrepend && _createElementVNode$7("span", {
            "key": "prepend",
            "class": "v-btn__prepend"
          }, [!slots.prepend ? _createVNode$a(VIcon, {
            "key": "prepend-icon",
            "icon": props.prependIcon
          }, null) : _createVNode$a(VDefaultsProvider, {
            "key": "prepend-defaults",
            "disabled": !props.prependIcon,
            "defaults": {
              VIcon: {
                icon: props.prependIcon
              }
            }
          }, slots.prepend)]), _createElementVNode$7("span", {
            "class": "v-btn__content",
            "data-no-activator": ""
          }, [!slots.default && hasIcon ? _createVNode$a(VIcon, {
            "key": "content-icon",
            "icon": props.icon
          }, null) : _createVNode$a(VDefaultsProvider, {
            "key": "content-defaults",
            "disabled": !hasIcon,
            "defaults": {
              VIcon: {
                icon: props.icon
              }
            }
          }, {
            default: () => {
              var _a2;
              return [((_a2 = slots.default) == null ? void 0 : _a2.call(slots)) ?? toDisplayString(props.text)];
            }
          })]), !props.icon && hasAppend && _createElementVNode$7("span", {
            "key": "append",
            "class": "v-btn__append"
          }, [!slots.append ? _createVNode$a(VIcon, {
            "key": "append-icon",
            "icon": props.appendIcon
          }, null) : _createVNode$a(VDefaultsProvider, {
            "key": "append-defaults",
            "disabled": !props.appendIcon,
            "defaults": {
              VIcon: {
                icon: props.appendIcon
              }
            }
          }, slots.append)]), !!props.loading && _createElementVNode$7("span", {
            "key": "loader",
            "class": "v-btn__loader"
          }, [((_a = slots.loader) == null ? void 0 : _a.call(slots)) ?? _createVNode$a(VProgressCircular, {
            "color": typeof props.loading === "boolean" ? void 0 : props.loading,
            "indeterminate": true,
            "width": "2"
          }, null)])];
        }
      }), [[Ripple, !isDisabled.value && props.ripple, "", {
        center: !!props.icon
      }]]);
    });
    return {
      group
    };
  }
});
const { createVNode: _createVNode$9, mergeProps: _mergeProps$3 } = await importShared("vue");
const { computed: computed$a, inject, mergeProps, nextTick: nextTick$1, onBeforeUnmount: onBeforeUnmount$4, onDeactivated, provide, ref: ref$6, shallowRef: shallowRef$6, toRef: toRef$2, useId, watch: watch$4 } = await importShared("vue");
const makeVMenuProps = propsFactory({
  // TODO
  // disableKeys: Boolean,
  id: String,
  submenu: Boolean,
  ...omit(makeVOverlayProps({
    closeDelay: 250,
    closeOnContentClick: true,
    locationStrategy: "connected",
    location: void 0,
    openDelay: 300,
    scrim: false,
    scrollStrategy: "reposition",
    transition: {
      component: VDialogTransition
    }
  }), ["absolute"])
}, "VMenu");
const VMenu = genericComponent()({
  name: "VMenu",
  props: makeVMenuProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const isActive = useProxiedModel(props, "modelValue");
    const {
      scopeId
    } = useScopeId();
    const {
      isRtl
    } = useRtl();
    const uid = useId();
    const id = toRef$2(() => props.id || `v-menu-${uid}`);
    const overlay = ref$6();
    const parent = inject(VMenuSymbol, null);
    const openChildren = shallowRef$6(/* @__PURE__ */ new Set());
    provide(VMenuSymbol, {
      register() {
        openChildren.value.add(uid);
      },
      unregister() {
        openChildren.value.delete(uid);
      },
      closeParents(e) {
        setTimeout(() => {
          var _a;
          if (!openChildren.value.size && !props.persistent && (e == null || ((_a = overlay.value) == null ? void 0 : _a.contentEl) && !isClickInsideElement(e, overlay.value.contentEl))) {
            isActive.value = false;
            parent == null ? void 0 : parent.closeParents();
          }
        }, 40);
      }
    });
    onBeforeUnmount$4(() => {
      parent == null ? void 0 : parent.unregister();
      document.removeEventListener("focusin", onFocusIn);
    });
    onDeactivated(() => isActive.value = false);
    async function onFocusIn(e) {
      var _a, _b, _c;
      const before = e.relatedTarget;
      const after = e.target;
      await nextTick$1();
      if (isActive.value && before !== after && ((_a = overlay.value) == null ? void 0 : _a.contentEl) && // We're the topmost menu
      ((_b = overlay.value) == null ? void 0 : _b.globalTop) && // It isn't the document or the menu body
      ![document, overlay.value.contentEl].includes(after) && // It isn't inside the menu body
      !overlay.value.contentEl.contains(after)) {
        const focusable = focusableChildren(overlay.value.contentEl);
        (_c = focusable[0]) == null ? void 0 : _c.focus();
      }
    }
    watch$4(isActive, (val) => {
      if (val) {
        parent == null ? void 0 : parent.register();
        if (IN_BROWSER) {
          document.addEventListener("focusin", onFocusIn, {
            once: true
          });
        }
      } else {
        parent == null ? void 0 : parent.unregister();
        if (IN_BROWSER) {
          document.removeEventListener("focusin", onFocusIn);
        }
      }
    }, {
      immediate: true
    });
    function onClickOutside(e) {
      parent == null ? void 0 : parent.closeParents(e);
    }
    function onKeydown(e) {
      var _a, _b, _c, _d, _e;
      if (props.disabled) return;
      if (e.key === "Tab" || e.key === "Enter" && !props.closeOnContentClick) {
        if (e.key === "Enter" && (e.target instanceof HTMLTextAreaElement || e.target instanceof HTMLInputElement && !!e.target.closest("form"))) return;
        if (e.key === "Enter") e.preventDefault();
        const nextElement = getNextElement(focusableChildren((_a = overlay.value) == null ? void 0 : _a.contentEl, false), e.shiftKey ? "prev" : "next", (el) => el.tabIndex >= 0);
        if (!nextElement) {
          isActive.value = false;
          (_c = (_b = overlay.value) == null ? void 0 : _b.activatorEl) == null ? void 0 : _c.focus();
        }
      } else if (props.submenu && e.key === (isRtl.value ? "ArrowRight" : "ArrowLeft")) {
        isActive.value = false;
        (_e = (_d = overlay.value) == null ? void 0 : _d.activatorEl) == null ? void 0 : _e.focus();
      }
    }
    function onActivatorKeydown(e) {
      var _a;
      if (props.disabled) return;
      const el = (_a = overlay.value) == null ? void 0 : _a.contentEl;
      if (el && isActive.value) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          e.stopImmediatePropagation();
          focusChild(el, "next");
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          e.stopImmediatePropagation();
          focusChild(el, "prev");
        } else if (props.submenu) {
          if (e.key === (isRtl.value ? "ArrowRight" : "ArrowLeft")) {
            isActive.value = false;
          } else if (e.key === (isRtl.value ? "ArrowLeft" : "ArrowRight")) {
            e.preventDefault();
            focusChild(el, "first");
          }
        }
      } else if (props.submenu ? e.key === (isRtl.value ? "ArrowLeft" : "ArrowRight") : ["ArrowDown", "ArrowUp"].includes(e.key)) {
        isActive.value = true;
        e.preventDefault();
        setTimeout(() => setTimeout(() => onActivatorKeydown(e)));
      }
    }
    const activatorProps = computed$a(() => mergeProps({
      "aria-haspopup": "menu",
      "aria-expanded": String(isActive.value),
      "aria-controls": id.value,
      onKeydown: onActivatorKeydown
    }, props.activatorProps));
    useRender(() => {
      const overlayProps = VOverlay.filterProps(props);
      return _createVNode$9(VOverlay, _mergeProps$3({
        "ref": overlay,
        "id": id.value,
        "class": ["v-menu", props.class],
        "style": props.style
      }, overlayProps, {
        "modelValue": isActive.value,
        "onUpdate:modelValue": ($event) => isActive.value = $event,
        "absolute": true,
        "activatorProps": activatorProps.value,
        "location": props.location ?? (props.submenu ? "end" : "bottom"),
        "onClick:outside": onClickOutside,
        "onKeydown": onKeydown
      }, scopeId), {
        activator: slots.activator,
        default: function() {
          for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
          }
          return _createVNode$9(VDefaultsProvider, {
            "root": "VMenu"
          }, {
            default: () => {
              var _a;
              return [(_a = slots.default) == null ? void 0 : _a.call(slots, ...args)];
            }
          });
        }
      });
    });
    return forwardRefs({
      id,
      ΨopenChildren: openChildren
    }, overlay);
  }
});
const { defineComponent: _defineComponent$2 } = await importShared("vue");
const { createElementVNode: _createElementVNode$6, resolveComponent: _resolveComponent$1, createVNode: _createVNode$8, normalizeClass: _normalizeClass$5, openBlock: _openBlock$2, createBlock: _createBlock$1, createCommentVNode: _createCommentVNode$1, createTextVNode: _createTextVNode$1, withCtx: _withCtx$2, toDisplayString: _toDisplayString$2, createElementBlock: _createElementBlock$2 } = await importShared("vue");
const { reactive: reactive$1, ref: ref$5, onMounted: onMounted$4 } = await importShared("vue");
await importShared("dayjs");
const { useRouter: useRouter$2 } = await importShared("vue-router");
const { defineComponent: _defineComponent$1 } = await importShared("vue");
const { createVNode: _createVNode$7, createTextVNode: _createTextVNode, withCtx: _withCtx$1, toDisplayString: _toDisplayString$1, unref: _unref$1, mergeProps: _mergeProps$2, openBlock: _openBlock$1, createElementBlock: _createElementBlock$1 } = await importShared("vue");
const _hoisted_1$1 = { class: "header-buttons-main" };
const { useRouter: useRouter$1 } = await importShared("vue-router");
const { computed: computed$9, ref: ref$4 } = await importShared("vue");
const { storeToRefs } = await importShared("pinia");
const _sfc_main$1 = /* @__PURE__ */ _defineComponent$1({
  __name: "HeaderButtons",
  setup(__props) {
    usePublishStore();
    const authStore = useAuthStore();
    useRouter$1();
    const { userSessionInfo } = authStore;
    const { t, locale } = useI18n();
    useLoadingStore();
    const isOpenedAdminMenu = ref$4(false);
    const isOpenedUserProfile = ref$4(false);
    ref$4(false);
    const roleName = computed$9(() => {
      return userSessionInfo == null ? void 0 : userSessionInfo.roleName;
    });
    const currentLanguage = computed$9(() => locale.value);
    function toggleLanguage() {
      locale.value = currentLanguage.value === "ko" ? "en" : "ko";
      localStorage.setItem("language", locale.value);
    }
    function initializeLanguage() {
      const savedLanguage = localStorage.getItem("language");
      if (savedLanguage && (savedLanguage === "ko" || savedLanguage === "en")) {
        locale.value = savedLanguage;
      }
    }
    initializeLanguage();
    function openUserProfile() {
      isOpenedUserProfile.value = true;
      isOpenedAdminMenu.value = false;
    }
    function logout() {
      authStore.logout(getRefreshToken());
    }
    return (_ctx, _cache) => {
      return _openBlock$1(), _createElementBlock$1("div", _hoisted_1$1, [
        _createVNode$7(VDivider, {
          class: "h-16",
          vertical: ""
        }),
        _createVNode$7(VBtn, {
          class: "language-btn",
          onClick: toggleLanguage,
          color: "secondary",
          variant: "text",
          size: "small"
        }, {
          default: _withCtx$1(() => [
            _createVNode$7(VIcon, { class: "mr-1" }, {
              default: _withCtx$1(() => _cache[2] || (_cache[2] = [
                _createTextVNode("mdi-translate")
              ])),
              _: 1,
              __: [2]
            }),
            _createTextVNode(" " + _toDisplayString$1(currentLanguage.value === "ko" ? "English" : "한국어"), 1)
          ]),
          _: 1
        }),
        _createVNode$7(VDivider, {
          class: "h-16",
          vertical: ""
        }),
        _createVNode$7(VMenu, {
          class: "admin-menu-wrapper",
          modelValue: isOpenedAdminMenu.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => isOpenedAdminMenu.value = $event),
          "close-on-content-click": false
        }, {
          activator: _withCtx$1(({ props }) => [
            _createVNode$7(VBtn, _mergeProps$2({ class: "account-btn" }, props, {
              color: "secondary",
              "prepend-icon": "mdi-account-outline"
            }), {
              default: _withCtx$1(() => {
                var _a;
                return [
                  _createTextVNode(_toDisplayString$1((_a = _unref$1(userSessionInfo)) == null ? void 0 : _a.userId), 1)
                ];
              }),
              _: 2
            }, 1040)
          ]),
          default: _withCtx$1(() => [
            _createVNode$7(VList, {
              class: "admin-menu-list",
              density: "comfortable"
            }, {
              default: _withCtx$1(() => [
                _createVNode$7(VListItem, { class: "admin-item" }, {
                  default: _withCtx$1(() => [
                    _createVNode$7(VListItemTitle, null, {
                      default: _withCtx$1(() => {
                        var _a;
                        return [
                          _createTextVNode(_toDisplayString$1(((_a = _unref$1(userSessionInfo)) == null ? void 0 : _a.userId) + " (" + roleName.value + ")"), 1)
                        ];
                      }),
                      _: 1
                    })
                  ]),
                  _: 1
                }),
                _createVNode$7(VListItem, {
                  "prepend-icon": "mdi-account-outline",
                  onClick: openUserProfile,
                  "close-on-content-click": false
                }, {
                  default: _withCtx$1(() => [
                    _createVNode$7(VListItemTitle, null, {
                      default: _withCtx$1(() => _cache[3] || (_cache[3] = [
                        _createTextVNode("User profile")
                      ])),
                      _: 1,
                      __: [3]
                    })
                  ]),
                  _: 1
                }),
                _createVNode$7(VListItem, {
                  "prepend-icon": "mdi-location-exit",
                  onClick: logout
                }, {
                  default: _withCtx$1(() => [
                    _createVNode$7(VListItemTitle, null, {
                      default: _withCtx$1(() => _cache[4] || (_cache[4] = [
                        _createTextVNode("Logout")
                      ])),
                      _: 1,
                      __: [4]
                    })
                  ]),
                  _: 1
                })
              ]),
              _: 1
            })
          ]),
          _: 1
        }, 8, ["modelValue"]),
        _createVNode$7(_sfc_main$2, {
          "is-open": isOpenedUserProfile.value,
          onClose: _cache[1] || (_cache[1] = ($event) => isOpenedUserProfile.value = false)
        }, null, 8, ["is-open"])
      ]);
    };
  }
});
const HeaderButtons = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-2f42532d"]]);
const { createElementVNode: _createElementVNode$5, normalizeClass: _normalizeClass$4, normalizeStyle: _normalizeStyle$4, createVNode: _createVNode$6 } = await importShared("vue");
const makeVToolbarTitleProps = propsFactory({
  text: String,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VToolbarTitle");
const VToolbarTitle = genericComponent()({
  name: "VToolbarTitle",
  props: makeVToolbarTitleProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    useRender(() => {
      const hasText = !!(slots.default || slots.text || props.text);
      return _createVNode$6(props.tag, {
        "class": _normalizeClass$4(["v-toolbar-title", props.class]),
        "style": _normalizeStyle$4(props.style)
      }, {
        default: () => {
          var _a;
          return [hasText && _createElementVNode$5("div", {
            "class": "v-toolbar-title__placeholder"
          }, [slots.text ? slots.text() : props.text, (_a = slots.default) == null ? void 0 : _a.call(slots)])];
        }
      });
    });
    return {};
  }
});
const { createVNode: _createVNode$5, createElementVNode: _createElementVNode$4, normalizeClass: _normalizeClass$3, normalizeStyle: _normalizeStyle$3 } = await importShared("vue");
const { computed: computed$8, shallowRef: shallowRef$5 } = await importShared("vue");
const allowedDensities = [null, "prominent", "default", "comfortable", "compact"];
const makeVToolbarProps = propsFactory({
  absolute: Boolean,
  collapse: Boolean,
  color: String,
  density: {
    type: String,
    default: "default",
    validator: (v) => allowedDensities.includes(v)
  },
  extended: Boolean,
  extensionHeight: {
    type: [Number, String],
    default: 48
  },
  flat: Boolean,
  floating: Boolean,
  height: {
    type: [Number, String],
    default: 64
  },
  image: String,
  title: String,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeElevationProps(),
  ...makeRoundedProps(),
  ...makeTagProps({
    tag: "header"
  }),
  ...makeThemeProps()
}, "VToolbar");
const VToolbar = genericComponent()({
  name: "VToolbar",
  props: makeVToolbarProps(),
  setup(props, _ref) {
    var _a;
    let {
      slots
    } = _ref;
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.color);
    const {
      borderClasses
    } = useBorder(props);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      roundedClasses
    } = useRounded(props);
    const {
      themeClasses
    } = provideTheme(props);
    const {
      rtlClasses
    } = useRtl();
    const isExtended = shallowRef$5(!!(props.extended || ((_a = slots.extension) == null ? void 0 : _a.call(slots))));
    const contentHeight = computed$8(() => parseInt(Number(props.height) + (props.density === "prominent" ? Number(props.height) : 0) - (props.density === "comfortable" ? 8 : 0) - (props.density === "compact" ? 16 : 0), 10));
    const extensionHeight = computed$8(() => isExtended.value ? parseInt(Number(props.extensionHeight) + (props.density === "prominent" ? Number(props.extensionHeight) : 0) - (props.density === "comfortable" ? 4 : 0) - (props.density === "compact" ? 8 : 0), 10) : 0);
    provideDefaults({
      VBtn: {
        variant: "text"
      }
    });
    useRender(() => {
      var _a2;
      const hasTitle = !!(props.title || slots.title);
      const hasImage = !!(slots.image || props.image);
      const extension = (_a2 = slots.extension) == null ? void 0 : _a2.call(slots);
      isExtended.value = !!(props.extended || extension);
      return _createVNode$5(props.tag, {
        "class": _normalizeClass$3(["v-toolbar", {
          "v-toolbar--absolute": props.absolute,
          "v-toolbar--collapse": props.collapse,
          "v-toolbar--flat": props.flat,
          "v-toolbar--floating": props.floating,
          [`v-toolbar--density-${props.density}`]: true
        }, backgroundColorClasses.value, borderClasses.value, elevationClasses.value, roundedClasses.value, themeClasses.value, rtlClasses.value, props.class]),
        "style": _normalizeStyle$3([backgroundColorStyles.value, props.style])
      }, {
        default: () => [hasImage && _createElementVNode$4("div", {
          "key": "image",
          "class": "v-toolbar__image"
        }, [!slots.image ? _createVNode$5(VImg, {
          "key": "image-img",
          "cover": true,
          "src": props.image
        }, null) : _createVNode$5(VDefaultsProvider, {
          "key": "image-defaults",
          "disabled": !props.image,
          "defaults": {
            VImg: {
              cover: true,
              src: props.image
            }
          }
        }, slots.image)]), _createVNode$5(VDefaultsProvider, {
          "defaults": {
            VTabs: {
              height: convertToUnit(contentHeight.value)
            }
          }
        }, {
          default: () => {
            var _a3, _b, _c;
            return [_createElementVNode$4("div", {
              "class": "v-toolbar__content",
              "style": {
                height: convertToUnit(contentHeight.value)
              }
            }, [slots.prepend && _createElementVNode$4("div", {
              "class": "v-toolbar__prepend"
            }, [(_a3 = slots.prepend) == null ? void 0 : _a3.call(slots)]), hasTitle && _createVNode$5(VToolbarTitle, {
              "key": "title",
              "text": props.title
            }, {
              text: slots.title
            }), (_b = slots.default) == null ? void 0 : _b.call(slots), slots.append && _createElementVNode$4("div", {
              "class": "v-toolbar__append"
            }, [(_c = slots.append) == null ? void 0 : _c.call(slots)])])];
          }
        }), _createVNode$5(VDefaultsProvider, {
          "defaults": {
            VTabs: {
              height: convertToUnit(extensionHeight.value)
            }
          }
        }, {
          default: () => [_createVNode$5(VExpandTransition, null, {
            default: () => [isExtended.value && _createElementVNode$4("div", {
              "class": "v-toolbar__extension",
              "style": {
                height: convertToUnit(extensionHeight.value)
              }
            }, [extension])]
          })]
        })]
      });
    });
    return {
      contentHeight,
      extensionHeight
    };
  }
});
const { computed: computed$7, onBeforeUnmount: onBeforeUnmount$3, onMounted: onMounted$3, ref: ref$3, shallowRef: shallowRef$4, watch: watch$3 } = await importShared("vue");
const makeScrollProps = propsFactory({
  scrollTarget: {
    type: String
  },
  scrollThreshold: {
    type: [String, Number],
    default: 300
  }
}, "scroll");
function useScroll(props) {
  let args = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
  const {
    canScroll
  } = args;
  let previousScroll = 0;
  let previousScrollHeight = 0;
  const target = ref$3(null);
  const currentScroll = shallowRef$4(0);
  const savedScroll = shallowRef$4(0);
  const currentThreshold = shallowRef$4(0);
  const isScrollActive = shallowRef$4(false);
  const isScrollingUp = shallowRef$4(false);
  const scrollThreshold = computed$7(() => {
    return Number(props.scrollThreshold);
  });
  const scrollRatio = computed$7(() => {
    return clamp((scrollThreshold.value - currentScroll.value) / scrollThreshold.value || 0);
  });
  const onScroll = () => {
    const targetEl = target.value;
    if (!targetEl || canScroll && !canScroll.value) return;
    previousScroll = currentScroll.value;
    currentScroll.value = "window" in targetEl ? targetEl.pageYOffset : targetEl.scrollTop;
    const currentScrollHeight = targetEl instanceof Window ? document.documentElement.scrollHeight : targetEl.scrollHeight;
    if (previousScrollHeight !== currentScrollHeight) {
      previousScrollHeight = currentScrollHeight;
      return;
    }
    isScrollingUp.value = currentScroll.value < previousScroll;
    currentThreshold.value = Math.abs(currentScroll.value - scrollThreshold.value);
  };
  watch$3(isScrollingUp, () => {
    savedScroll.value = savedScroll.value || currentScroll.value;
  });
  watch$3(isScrollActive, () => {
    savedScroll.value = 0;
  });
  onMounted$3(() => {
    watch$3(() => props.scrollTarget, (scrollTarget) => {
      var _a;
      const newTarget = scrollTarget ? document.querySelector(scrollTarget) : window;
      if (!newTarget) {
        consoleWarn(`Unable to locate element with identifier ${scrollTarget}`);
        return;
      }
      if (newTarget === target.value) return;
      (_a = target.value) == null ? void 0 : _a.removeEventListener("scroll", onScroll);
      target.value = newTarget;
      target.value.addEventListener("scroll", onScroll, {
        passive: true
      });
    }, {
      immediate: true
    });
  });
  onBeforeUnmount$3(() => {
    var _a;
    (_a = target.value) == null ? void 0 : _a.removeEventListener("scroll", onScroll);
  });
  canScroll && watch$3(canScroll, onScroll, {
    immediate: true
  });
  return {
    scrollThreshold,
    currentScroll,
    currentThreshold,
    isScrollActive,
    scrollRatio,
    // required only for testing
    // probably can be removed
    // later (2 chars chlng)
    isScrollingUp,
    savedScroll
  };
}
const { mergeProps: _mergeProps$1, createVNode: _createVNode$4 } = await importShared("vue");
const { computed: computed$6, ref: ref$2, shallowRef: shallowRef$3, toRef: toRef$1, watchEffect: watchEffect$1 } = await importShared("vue");
const makeVAppBarProps = propsFactory({
  scrollBehavior: String,
  modelValue: {
    type: Boolean,
    default: true
  },
  location: {
    type: String,
    default: "top",
    validator: (value) => ["top", "bottom"].includes(value)
  },
  ...makeVToolbarProps(),
  ...makeLayoutItemProps(),
  ...makeScrollProps(),
  height: {
    type: [Number, String],
    default: 64
  }
}, "VAppBar");
const VAppBar = genericComponent()({
  name: "VAppBar",
  props: makeVAppBarProps(),
  emits: {
    "update:modelValue": (value) => true
  },
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const vToolbarRef = ref$2();
    const isActive = useProxiedModel(props, "modelValue");
    const scrollBehavior = computed$6(() => {
      var _a;
      const behavior = new Set(((_a = props.scrollBehavior) == null ? void 0 : _a.split(" ")) ?? []);
      return {
        hide: behavior.has("hide"),
        fullyHide: behavior.has("fully-hide"),
        inverted: behavior.has("inverted"),
        collapse: behavior.has("collapse"),
        elevate: behavior.has("elevate"),
        fadeImage: behavior.has("fade-image")
        // shrink: behavior.has('shrink'),
      };
    });
    const canScroll = computed$6(() => {
      const behavior = scrollBehavior.value;
      return behavior.hide || behavior.fullyHide || behavior.inverted || behavior.collapse || behavior.elevate || behavior.fadeImage || // behavior.shrink ||
      !isActive.value;
    });
    const {
      currentScroll,
      scrollThreshold,
      isScrollingUp,
      scrollRatio
    } = useScroll(props, {
      canScroll
    });
    const canHide = toRef$1(() => scrollBehavior.value.hide || scrollBehavior.value.fullyHide);
    const isCollapsed = computed$6(() => props.collapse || scrollBehavior.value.collapse && (scrollBehavior.value.inverted ? scrollRatio.value > 0 : scrollRatio.value === 0));
    const isFlat = computed$6(() => props.flat || scrollBehavior.value.fullyHide && !isActive.value || scrollBehavior.value.elevate && (scrollBehavior.value.inverted ? currentScroll.value > 0 : currentScroll.value === 0));
    const opacity = computed$6(() => scrollBehavior.value.fadeImage ? scrollBehavior.value.inverted ? 1 - scrollRatio.value : scrollRatio.value : void 0);
    const height = computed$6(() => {
      var _a, _b;
      if (scrollBehavior.value.hide && scrollBehavior.value.inverted) return 0;
      const height2 = ((_a = vToolbarRef.value) == null ? void 0 : _a.contentHeight) ?? 0;
      const extensionHeight = ((_b = vToolbarRef.value) == null ? void 0 : _b.extensionHeight) ?? 0;
      if (!canHide.value) return height2 + extensionHeight;
      return currentScroll.value < scrollThreshold.value || scrollBehavior.value.fullyHide ? height2 + extensionHeight : height2;
    });
    useToggleScope(() => !!props.scrollBehavior, () => {
      watchEffect$1(() => {
        if (canHide.value) {
          if (scrollBehavior.value.inverted) {
            isActive.value = currentScroll.value > scrollThreshold.value;
          } else {
            isActive.value = isScrollingUp.value || currentScroll.value < scrollThreshold.value;
          }
        } else {
          isActive.value = true;
        }
      });
    });
    const {
      ssrBootStyles
    } = useSsrBoot();
    const {
      layoutItemStyles
    } = useLayoutItem({
      id: props.name,
      order: computed$6(() => parseInt(props.order, 10)),
      position: toRef$1(() => props.location),
      layoutSize: height,
      elementSize: shallowRef$3(void 0),
      active: isActive,
      absolute: toRef$1(() => props.absolute)
    });
    useRender(() => {
      const toolbarProps = VToolbar.filterProps(props);
      return _createVNode$4(VToolbar, _mergeProps$1({
        "ref": vToolbarRef,
        "class": ["v-app-bar", {
          "v-app-bar--bottom": props.location === "bottom"
        }, props.class],
        "style": [{
          ...layoutItemStyles.value,
          "--v-toolbar-image-opacity": opacity.value,
          height: void 0,
          ...ssrBootStyles.value
        }, props.style]
      }, toolbarProps, {
        "collapse": isCollapsed.value,
        "flat": isFlat.value
      }), slots);
    });
    return {};
  }
});
const { normalizeClass: _normalizeClass$2, normalizeStyle: _normalizeStyle$2, createVNode: _createVNode$3 } = await importShared("vue");
const makeVContainerProps = propsFactory({
  fluid: {
    type: Boolean,
    default: false
  },
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeTagProps()
}, "VContainer");
const VContainer = genericComponent()({
  name: "VContainer",
  props: makeVContainerProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      rtlClasses
    } = useRtl();
    const {
      dimensionStyles
    } = useDimension(props);
    useRender(() => _createVNode$3(props.tag, {
      "class": _normalizeClass$2(["v-container", {
        "v-container--fluid": props.fluid
      }, rtlClasses.value, props.class]),
      "style": _normalizeStyle$2([dimensionStyles.value, props.style])
    }, slots));
    return {};
  }
});
const { capitalize: capitalize$1, computed: computed$5, h: h$1 } = await importShared("vue");
const breakpointProps = (() => {
  return breakpoints.reduce((props, val) => {
    props[val] = {
      type: [Boolean, String, Number],
      default: false
    };
    return props;
  }, {});
})();
const offsetProps = (() => {
  return breakpoints.reduce((props, val) => {
    const offsetKey = "offset" + capitalize$1(val);
    props[offsetKey] = {
      type: [String, Number],
      default: null
    };
    return props;
  }, {});
})();
const orderProps = (() => {
  return breakpoints.reduce((props, val) => {
    const orderKey = "order" + capitalize$1(val);
    props[orderKey] = {
      type: [String, Number],
      default: null
    };
    return props;
  }, {});
})();
const propMap$1 = {
  col: Object.keys(breakpointProps),
  offset: Object.keys(offsetProps),
  order: Object.keys(orderProps)
};
function breakpointClass$1(type, prop, val) {
  let className = type;
  if (val == null || val === false) {
    return void 0;
  }
  if (prop) {
    const breakpoint = prop.replace(type, "");
    className += `-${breakpoint}`;
  }
  if (type === "col") {
    className = "v-" + className;
  }
  if (type === "col" && (val === "" || val === true)) {
    return className.toLowerCase();
  }
  className += `-${val}`;
  return className.toLowerCase();
}
const ALIGN_SELF_VALUES = ["auto", "start", "end", "center", "baseline", "stretch"];
const makeVColProps = propsFactory({
  cols: {
    type: [Boolean, String, Number],
    default: false
  },
  ...breakpointProps,
  offset: {
    type: [String, Number],
    default: null
  },
  ...offsetProps,
  order: {
    type: [String, Number],
    default: null
  },
  ...orderProps,
  alignSelf: {
    type: String,
    default: null,
    validator: (str) => ALIGN_SELF_VALUES.includes(str)
  },
  ...makeComponentProps(),
  ...makeTagProps()
}, "VCol");
const VCol = genericComponent()({
  name: "VCol",
  props: makeVColProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const classes = computed$5(() => {
      const classList = [];
      let type;
      for (type in propMap$1) {
        propMap$1[type].forEach((prop) => {
          const value = props[prop];
          const className = breakpointClass$1(type, prop, value);
          if (className) classList.push(className);
        });
      }
      const hasColClasses = classList.some((className) => className.startsWith("v-col-"));
      classList.push({
        // Default to .v-col if no other col-{bp}-* classes generated nor `cols` specified.
        "v-col": !hasColClasses || !props.cols,
        [`v-col-${props.cols}`]: props.cols,
        [`offset-${props.offset}`]: props.offset,
        [`order-${props.order}`]: props.order,
        [`align-self-${props.alignSelf}`]: props.alignSelf
      });
      return classList;
    });
    return () => {
      var _a;
      return h$1(props.tag, {
        class: [classes.value, props.class],
        style: props.style
      }, (_a = slots.default) == null ? void 0 : _a.call(slots));
    };
  }
});
const { capitalize, computed: computed$4, h } = await importShared("vue");
const ALIGNMENT = ["start", "end", "center"];
const SPACE = ["space-between", "space-around", "space-evenly"];
function makeRowProps(prefix, def) {
  return breakpoints.reduce((props, val) => {
    const prefixKey = prefix + capitalize(val);
    props[prefixKey] = def();
    return props;
  }, {});
}
const ALIGN_VALUES = [...ALIGNMENT, "baseline", "stretch"];
const alignValidator = (str) => ALIGN_VALUES.includes(str);
const alignProps = makeRowProps("align", () => ({
  type: String,
  default: null,
  validator: alignValidator
}));
const JUSTIFY_VALUES = [...ALIGNMENT, ...SPACE];
const justifyValidator = (str) => JUSTIFY_VALUES.includes(str);
const justifyProps = makeRowProps("justify", () => ({
  type: String,
  default: null,
  validator: justifyValidator
}));
const ALIGN_CONTENT_VALUES = [...ALIGNMENT, ...SPACE, "stretch"];
const alignContentValidator = (str) => ALIGN_CONTENT_VALUES.includes(str);
const alignContentProps = makeRowProps("alignContent", () => ({
  type: String,
  default: null,
  validator: alignContentValidator
}));
const propMap = {
  align: Object.keys(alignProps),
  justify: Object.keys(justifyProps),
  alignContent: Object.keys(alignContentProps)
};
const classMap = {
  align: "align",
  justify: "justify",
  alignContent: "align-content"
};
function breakpointClass(type, prop, val) {
  let className = classMap[type];
  if (val == null) {
    return void 0;
  }
  if (prop) {
    const breakpoint = prop.replace(type, "");
    className += `-${breakpoint}`;
  }
  className += `-${val}`;
  return className.toLowerCase();
}
const makeVRowProps = propsFactory({
  dense: Boolean,
  noGutters: Boolean,
  align: {
    type: String,
    default: null,
    validator: alignValidator
  },
  ...alignProps,
  justify: {
    type: String,
    default: null,
    validator: justifyValidator
  },
  ...justifyProps,
  alignContent: {
    type: String,
    default: null,
    validator: alignContentValidator
  },
  ...alignContentProps,
  ...makeComponentProps(),
  ...makeTagProps()
}, "VRow");
const VRow = genericComponent()({
  name: "VRow",
  props: makeVRowProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const classes = computed$4(() => {
      const classList = [];
      let type;
      for (type in propMap) {
        propMap[type].forEach((prop) => {
          const value = props[prop];
          const className = breakpointClass(type, prop, value);
          if (className) classList.push(className);
        });
      }
      classList.push({
        "v-row--no-gutters": props.noGutters,
        "v-row--dense": props.dense,
        [`align-${props.align}`]: props.align,
        [`justify-${props.justify}`]: props.justify,
        [`align-content-${props.alignContent}`]: props.alignContent
      });
      return classList;
    });
    return () => {
      var _a;
      return h(props.tag, {
        class: ["v-row", classes.value, props.class],
        style: props.style
      }, (_a = slots.default) == null ? void 0 : _a.call(slots));
    };
  }
});
const { normalizeClass: _normalizeClass$1, normalizeStyle: _normalizeStyle$1, createElementVNode: _createElementVNode$3 } = await importShared("vue");
const makeVLayoutProps = propsFactory({
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeLayoutProps()
}, "VLayout");
const VLayout = genericComponent()({
  name: "VLayout",
  props: makeVLayoutProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      layoutClasses,
      layoutStyles,
      getLayoutItem,
      items,
      layoutRef
    } = createLayout(props);
    const {
      dimensionStyles
    } = useDimension(props);
    useRender(() => {
      var _a;
      return _createElementVNode$3("div", {
        "ref": layoutRef,
        "class": _normalizeClass$1([layoutClasses.value, props.class]),
        "style": _normalizeStyle$1([dimensionStyles.value, layoutStyles.value, props.style])
      }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]);
    });
    return {
      getLayoutItem,
      items
    };
  }
});
const { createElementVNode: _createElementVNode$2, normalizeClass: _normalizeClass, normalizeStyle: _normalizeStyle, createVNode: _createVNode$2 } = await importShared("vue");
const makeVMainProps = propsFactory({
  scrollable: Boolean,
  ...makeComponentProps(),
  ...makeDimensionProps(),
  ...makeTagProps({
    tag: "main"
  })
}, "VMain");
const VMain = genericComponent()({
  name: "VMain",
  props: makeVMainProps(),
  setup(props, _ref) {
    let {
      slots
    } = _ref;
    const {
      dimensionStyles
    } = useDimension(props);
    const {
      mainStyles
    } = useLayout();
    const {
      ssrBootStyles
    } = useSsrBoot();
    useRender(() => _createVNode$2(props.tag, {
      "class": _normalizeClass(["v-main", {
        "v-main--scrollable": props.scrollable
      }, props.class]),
      "style": _normalizeStyle([mainStyles.value, ssrBootStyles.value, dimensionStyles.value, props.style])
    }, {
      default: () => {
        var _a, _b;
        return [props.scrollable ? _createElementVNode$2("div", {
          "class": "v-main__scroller"
        }, [(_a = slots.default) == null ? void 0 : _a.call(slots)]) : (_b = slots.default) == null ? void 0 : _b.call(slots)];
      }
    }));
    return {};
  }
});
const { computed: computed$3, onBeforeUnmount: onBeforeUnmount$2, onMounted: onMounted$2, shallowRef: shallowRef$2, watch: watch$2 } = await importShared("vue");
function useSticky(_ref) {
  let {
    rootEl,
    isSticky,
    layoutItemStyles
  } = _ref;
  const isStuck = shallowRef$2(false);
  const stuckPosition = shallowRef$2(0);
  const stickyStyles = computed$3(() => {
    const side = typeof isStuck.value === "boolean" ? "top" : isStuck.value;
    return [isSticky.value ? {
      top: "auto",
      bottom: "auto",
      height: void 0
    } : void 0, isStuck.value ? {
      [side]: convertToUnit(stuckPosition.value)
    } : {
      top: layoutItemStyles.value.top
    }];
  });
  onMounted$2(() => {
    watch$2(isSticky, (val) => {
      if (val) {
        window.addEventListener("scroll", onScroll, {
          passive: true
        });
      } else {
        window.removeEventListener("scroll", onScroll);
      }
    }, {
      immediate: true
    });
  });
  onBeforeUnmount$2(() => {
    window.removeEventListener("scroll", onScroll);
  });
  let lastScrollTop = 0;
  function onScroll() {
    const direction = lastScrollTop > window.scrollY ? "up" : "down";
    const rect = rootEl.value.getBoundingClientRect();
    const layoutTop = parseFloat(layoutItemStyles.value.top ?? 0);
    const top = window.scrollY - Math.max(0, stuckPosition.value - layoutTop);
    const bottom = rect.height + Math.max(stuckPosition.value, layoutTop) - window.scrollY - window.innerHeight;
    const bodyScroll = parseFloat(getComputedStyle(rootEl.value).getPropertyValue("--v-body-scroll-y")) || 0;
    if (rect.height < window.innerHeight - layoutTop) {
      isStuck.value = "top";
      stuckPosition.value = layoutTop;
    } else if (direction === "up" && isStuck.value === "bottom" || direction === "down" && isStuck.value === "top") {
      stuckPosition.value = window.scrollY + rect.top - bodyScroll;
      isStuck.value = true;
    } else if (direction === "down" && bottom <= 0) {
      stuckPosition.value = 0;
      isStuck.value = "bottom";
    } else if (direction === "up" && top <= 0) {
      if (!bodyScroll) {
        stuckPosition.value = rect.top + top;
        isStuck.value = "top";
      } else if (isStuck.value !== "top") {
        stuckPosition.value = -top + bodyScroll + layoutTop;
        isStuck.value = "top";
      }
    }
    lastScrollTop = window.scrollY;
  }
  return {
    isStuck,
    stickyStyles
  };
}
const HORIZON = 100;
const HISTORY = 20;
function kineticEnergyToVelocity(work) {
  const sqrt2 = 1.41421356237;
  return (work < 0 ? -1 : 1) * Math.sqrt(Math.abs(work)) * sqrt2;
}
function calculateImpulseVelocity(samples) {
  if (samples.length < 2) {
    return 0;
  }
  if (samples.length === 2) {
    if (samples[1].t === samples[0].t) {
      return 0;
    }
    return (samples[1].d - samples[0].d) / (samples[1].t - samples[0].t);
  }
  let work = 0;
  for (let i = samples.length - 1; i > 0; i--) {
    if (samples[i].t === samples[i - 1].t) {
      continue;
    }
    const vprev = kineticEnergyToVelocity(work);
    const vcurr = (samples[i].d - samples[i - 1].d) / (samples[i].t - samples[i - 1].t);
    work += (vcurr - vprev) * Math.abs(vcurr);
    if (i === samples.length - 1) {
      work *= 0.5;
    }
  }
  return kineticEnergyToVelocity(work) * 1e3;
}
function useVelocity() {
  const touches = {};
  function addMovement(e) {
    Array.from(e.changedTouches).forEach((touch) => {
      const samples = touches[touch.identifier] ?? (touches[touch.identifier] = new CircularBuffer(HISTORY));
      samples.push([e.timeStamp, touch]);
    });
  }
  function endTouch(e) {
    Array.from(e.changedTouches).forEach((touch) => {
      delete touches[touch.identifier];
    });
  }
  function getVelocity(id) {
    var _a;
    const samples = (_a = touches[id]) == null ? void 0 : _a.values().reverse();
    if (!samples) {
      throw new Error(`No samples for touch id ${id}`);
    }
    const newest = samples[0];
    const x = [];
    const y = [];
    for (const val of samples) {
      if (newest[0] - val[0] > HORIZON) break;
      x.push({
        t: val[0],
        d: val[1].clientX
      });
      y.push({
        t: val[0],
        d: val[1].clientY
      });
    }
    return {
      x: calculateImpulseVelocity(x),
      y: calculateImpulseVelocity(y),
      get direction() {
        const {
          x: x2,
          y: y2
        } = this;
        const [absX, absY] = [Math.abs(x2), Math.abs(y2)];
        return absX > absY && x2 >= 0 ? "right" : absX > absY && x2 <= 0 ? "left" : absY > absX && y2 >= 0 ? "down" : absY > absX && y2 <= 0 ? "up" : oops$1();
      }
    };
  }
  return {
    addMovement,
    endTouch,
    getVelocity
  };
}
function oops$1() {
  throw new Error();
}
const { computed: computed$2, onBeforeUnmount: onBeforeUnmount$1, onMounted: onMounted$1, onScopeDispose, shallowRef: shallowRef$1, watchEffect } = await importShared("vue");
function useTouch(_ref) {
  let {
    el,
    isActive,
    isTemporary,
    width,
    touchless,
    position
  } = _ref;
  onMounted$1(() => {
    window.addEventListener("touchstart", onTouchstart, {
      passive: true
    });
    window.addEventListener("touchmove", onTouchmove, {
      passive: false
    });
    window.addEventListener("touchend", onTouchend, {
      passive: true
    });
  });
  onBeforeUnmount$1(() => {
    window.removeEventListener("touchstart", onTouchstart);
    window.removeEventListener("touchmove", onTouchmove);
    window.removeEventListener("touchend", onTouchend);
  });
  const isHorizontal = computed$2(() => ["left", "right"].includes(position.value));
  const {
    addMovement,
    endTouch,
    getVelocity
  } = useVelocity();
  let maybeDragging = false;
  const isDragging = shallowRef$1(false);
  const dragProgress = shallowRef$1(0);
  const offset = shallowRef$1(0);
  let start;
  function getOffset(pos, active) {
    return (position.value === "left" ? pos : position.value === "right" ? document.documentElement.clientWidth - pos : position.value === "top" ? pos : position.value === "bottom" ? document.documentElement.clientHeight - pos : oops()) - (active ? width.value : 0);
  }
  function getProgress(pos) {
    let limit = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : true;
    const progress = position.value === "left" ? (pos - offset.value) / width.value : position.value === "right" ? (document.documentElement.clientWidth - pos - offset.value) / width.value : position.value === "top" ? (pos - offset.value) / width.value : position.value === "bottom" ? (document.documentElement.clientHeight - pos - offset.value) / width.value : oops();
    return limit ? clamp(progress) : progress;
  }
  function onTouchstart(e) {
    if (touchless.value) return;
    const touchX = e.changedTouches[0].clientX;
    const touchY = e.changedTouches[0].clientY;
    const touchZone = 25;
    const inTouchZone = position.value === "left" ? touchX < touchZone : position.value === "right" ? touchX > document.documentElement.clientWidth - touchZone : position.value === "top" ? touchY < touchZone : position.value === "bottom" ? touchY > document.documentElement.clientHeight - touchZone : oops();
    const inElement = isActive.value && (position.value === "left" ? touchX < width.value : position.value === "right" ? touchX > document.documentElement.clientWidth - width.value : position.value === "top" ? touchY < width.value : position.value === "bottom" ? touchY > document.documentElement.clientHeight - width.value : oops());
    if (inTouchZone || inElement || isActive.value && isTemporary.value) {
      start = [touchX, touchY];
      offset.value = getOffset(isHorizontal.value ? touchX : touchY, isActive.value);
      dragProgress.value = getProgress(isHorizontal.value ? touchX : touchY);
      maybeDragging = offset.value > -20 && offset.value < 80;
      endTouch(e);
      addMovement(e);
    }
  }
  function onTouchmove(e) {
    const touchX = e.changedTouches[0].clientX;
    const touchY = e.changedTouches[0].clientY;
    if (maybeDragging) {
      if (!e.cancelable) {
        maybeDragging = false;
        return;
      }
      const dx = Math.abs(touchX - start[0]);
      const dy = Math.abs(touchY - start[1]);
      const thresholdMet = isHorizontal.value ? dx > dy && dx > 3 : dy > dx && dy > 3;
      if (thresholdMet) {
        isDragging.value = true;
        maybeDragging = false;
      } else if ((isHorizontal.value ? dy : dx) > 3) {
        maybeDragging = false;
      }
    }
    if (!isDragging.value) return;
    e.preventDefault();
    addMovement(e);
    const progress = getProgress(isHorizontal.value ? touchX : touchY, false);
    dragProgress.value = Math.max(0, Math.min(1, progress));
    if (progress > 1) {
      offset.value = getOffset(isHorizontal.value ? touchX : touchY, true);
    } else if (progress < 0) {
      offset.value = getOffset(isHorizontal.value ? touchX : touchY, false);
    }
  }
  function onTouchend(e) {
    maybeDragging = false;
    if (!isDragging.value) return;
    addMovement(e);
    isDragging.value = false;
    const velocity = getVelocity(e.changedTouches[0].identifier);
    const vx = Math.abs(velocity.x);
    const vy = Math.abs(velocity.y);
    const thresholdMet = isHorizontal.value ? vx > vy && vx > 400 : vy > vx && vy > 3;
    if (thresholdMet) {
      isActive.value = velocity.direction === ({
        left: "right",
        right: "left",
        top: "down",
        bottom: "up"
      }[position.value] || oops());
    } else {
      isActive.value = dragProgress.value > 0.5;
    }
  }
  const dragStyles = computed$2(() => {
    return isDragging.value ? {
      transform: position.value === "left" ? `translateX(calc(-100% + ${dragProgress.value * width.value}px))` : position.value === "right" ? `translateX(calc(100% - ${dragProgress.value * width.value}px))` : position.value === "top" ? `translateY(calc(-100% + ${dragProgress.value * width.value}px))` : position.value === "bottom" ? `translateY(calc(100% - ${dragProgress.value * width.value}px))` : oops(),
      transition: "none"
    } : void 0;
  });
  useToggleScope(isDragging, () => {
    var _a, _b;
    const transform = ((_a = el.value) == null ? void 0 : _a.style.transform) ?? null;
    const transition = ((_b = el.value) == null ? void 0 : _b.style.transition) ?? null;
    watchEffect(() => {
      var _a2, _b2, _c, _d;
      (_b2 = el.value) == null ? void 0 : _b2.style.setProperty("transform", ((_a2 = dragStyles.value) == null ? void 0 : _a2.transform) || "none");
      (_d = el.value) == null ? void 0 : _d.style.setProperty("transition", ((_c = dragStyles.value) == null ? void 0 : _c.transition) || null);
    });
    onScopeDispose(() => {
      var _a2, _b2;
      (_a2 = el.value) == null ? void 0 : _a2.style.setProperty("transform", transform);
      (_b2 = el.value) == null ? void 0 : _b2.style.setProperty("transition", transition);
    });
  });
  return {
    isDragging,
    dragProgress,
    dragStyles
  };
}
function oops() {
  throw new Error();
}
const { Fragment: _Fragment$1, createVNode: _createVNode$1, createElementVNode: _createElementVNode$1, mergeProps: _mergeProps } = await importShared("vue");
const { computed: computed$1, nextTick, readonly, ref: ref$1, shallowRef, toRef, Transition, watch: watch$1 } = await importShared("vue");
const locations = ["start", "end", "left", "right", "top", "bottom"];
const makeVNavigationDrawerProps = propsFactory({
  color: String,
  disableResizeWatcher: Boolean,
  disableRouteWatcher: Boolean,
  expandOnHover: Boolean,
  floating: Boolean,
  modelValue: {
    type: Boolean,
    default: null
  },
  permanent: Boolean,
  rail: {
    type: Boolean,
    default: null
  },
  railWidth: {
    type: [Number, String],
    default: 56
  },
  scrim: {
    type: [Boolean, String],
    default: true
  },
  image: String,
  temporary: Boolean,
  persistent: Boolean,
  touchless: Boolean,
  width: {
    type: [Number, String],
    default: 256
  },
  location: {
    type: String,
    default: "start",
    validator: (value) => locations.includes(value)
  },
  sticky: Boolean,
  ...makeBorderProps(),
  ...makeComponentProps(),
  ...makeDelayProps(),
  ...makeDisplayProps({
    mobile: null
  }),
  ...makeElevationProps(),
  ...makeLayoutItemProps(),
  ...makeRoundedProps(),
  ...makeTagProps({
    tag: "nav"
  }),
  ...makeThemeProps()
}, "VNavigationDrawer");
const VNavigationDrawer = genericComponent()({
  name: "VNavigationDrawer",
  props: makeVNavigationDrawerProps(),
  emits: {
    "update:modelValue": (val) => true,
    "update:rail": (val) => true
  },
  setup(props, _ref) {
    let {
      attrs,
      emit,
      slots
    } = _ref;
    const {
      isRtl
    } = useRtl();
    const {
      themeClasses
    } = provideTheme(props);
    const {
      borderClasses
    } = useBorder(props);
    const {
      backgroundColorClasses,
      backgroundColorStyles
    } = useBackgroundColor(() => props.color);
    const {
      elevationClasses
    } = useElevation(props);
    const {
      displayClasses,
      mobile
    } = useDisplay(props);
    const {
      roundedClasses
    } = useRounded(props);
    const router = useRouter$3();
    const isActive = useProxiedModel(props, "modelValue", null, (v) => !!v);
    const {
      ssrBootStyles
    } = useSsrBoot();
    const {
      scopeId
    } = useScopeId();
    const rootEl = ref$1();
    const isHovering = shallowRef(false);
    const {
      runOpenDelay,
      runCloseDelay
    } = useDelay(props, (value) => {
      isHovering.value = value;
    });
    const width = computed$1(() => {
      return props.rail && props.expandOnHover && isHovering.value ? Number(props.width) : Number(props.rail ? props.railWidth : props.width);
    });
    const location = computed$1(() => {
      return toPhysical(props.location, isRtl.value);
    });
    const isPersistent = toRef(() => props.persistent);
    const isTemporary = computed$1(() => !props.permanent && (mobile.value || props.temporary));
    const isSticky = computed$1(() => props.sticky && !isTemporary.value && location.value !== "bottom");
    useToggleScope(() => props.expandOnHover && props.rail != null, () => {
      watch$1(isHovering, (val) => emit("update:rail", !val));
    });
    useToggleScope(() => !props.disableResizeWatcher, () => {
      watch$1(isTemporary, (val) => !props.permanent && nextTick(() => isActive.value = !val));
    });
    useToggleScope(() => !props.disableRouteWatcher && !!router, () => {
      watch$1(router.currentRoute, () => isTemporary.value && (isActive.value = false));
    });
    watch$1(() => props.permanent, (val) => {
      if (val) isActive.value = true;
    });
    if (props.modelValue == null && !isTemporary.value) {
      isActive.value = props.permanent || !mobile.value;
    }
    const {
      isDragging,
      dragProgress
    } = useTouch({
      el: rootEl,
      isActive,
      isTemporary,
      width,
      touchless: toRef(() => props.touchless),
      position: location
    });
    const layoutSize = computed$1(() => {
      const size = isTemporary.value ? 0 : props.rail && props.expandOnHover ? Number(props.railWidth) : width.value;
      return isDragging.value ? size * dragProgress.value : size;
    });
    const {
      layoutItemStyles,
      layoutItemScrimStyles
    } = useLayoutItem({
      id: props.name,
      order: computed$1(() => parseInt(props.order, 10)),
      position: location,
      layoutSize,
      elementSize: width,
      active: readonly(isActive),
      disableTransitions: toRef(() => isDragging.value),
      absolute: computed$1(() => (
        // eslint-disable-next-line @typescript-eslint/no-use-before-define
        props.absolute || isSticky.value && typeof isStuck.value !== "string"
      ))
    });
    const {
      isStuck,
      stickyStyles
    } = useSticky({
      rootEl,
      isSticky,
      layoutItemStyles
    });
    const scrimColor = useBackgroundColor(() => {
      return typeof props.scrim === "string" ? props.scrim : null;
    });
    const scrimStyles = computed$1(() => ({
      ...isDragging.value ? {
        opacity: dragProgress.value * 0.2,
        transition: "none"
      } : void 0,
      ...layoutItemScrimStyles.value
    }));
    provideDefaults({
      VList: {
        bgColor: "transparent"
      }
    });
    useRender(() => {
      const hasImage = slots.image || props.image;
      return _createElementVNode$1(_Fragment$1, null, [_createVNode$1(props.tag, _mergeProps({
        "ref": rootEl,
        "onMouseenter": runOpenDelay,
        "onMouseleave": runCloseDelay,
        "class": ["v-navigation-drawer", `v-navigation-drawer--${location.value}`, {
          "v-navigation-drawer--expand-on-hover": props.expandOnHover,
          "v-navigation-drawer--floating": props.floating,
          "v-navigation-drawer--is-hovering": isHovering.value,
          "v-navigation-drawer--rail": props.rail,
          "v-navigation-drawer--temporary": isTemporary.value,
          "v-navigation-drawer--persistent": isPersistent.value,
          "v-navigation-drawer--active": isActive.value,
          "v-navigation-drawer--sticky": isSticky.value
        }, themeClasses.value, backgroundColorClasses.value, borderClasses.value, displayClasses.value, elevationClasses.value, roundedClasses.value, props.class],
        "style": [backgroundColorStyles.value, layoutItemStyles.value, ssrBootStyles.value, stickyStyles.value, props.style]
      }, scopeId, attrs), {
        default: () => {
          var _a, _b, _c;
          return [hasImage && _createElementVNode$1("div", {
            "key": "image",
            "class": "v-navigation-drawer__img"
          }, [!slots.image ? _createVNode$1(VImg, {
            "key": "image-img",
            "alt": "",
            "cover": true,
            "height": "inherit",
            "src": props.image
          }, null) : _createVNode$1(VDefaultsProvider, {
            "key": "image-defaults",
            "disabled": !props.image,
            "defaults": {
              VImg: {
                alt: "",
                cover: true,
                height: "inherit",
                src: props.image
              }
            }
          }, slots.image)]), slots.prepend && _createElementVNode$1("div", {
            "class": "v-navigation-drawer__prepend"
          }, [(_a = slots.prepend) == null ? void 0 : _a.call(slots)]), _createElementVNode$1("div", {
            "class": "v-navigation-drawer__content"
          }, [(_b = slots.default) == null ? void 0 : _b.call(slots)]), slots.append && _createElementVNode$1("div", {
            "class": "v-navigation-drawer__append"
          }, [(_c = slots.append) == null ? void 0 : _c.call(slots)])];
        }
      }), _createVNode$1(Transition, {
        "name": "fade-transition"
      }, {
        default: () => [isTemporary.value && (isDragging.value || isActive.value) && !!props.scrim && _createElementVNode$1("div", _mergeProps({
          "class": ["v-navigation-drawer__scrim", scrimColor.backgroundColorClasses.value],
          "style": [scrimStyles.value, scrimColor.backgroundColorStyles.value],
          "onClick": () => {
            if (isPersistent.value) return;
            isActive.value = false;
          }
        }, scopeId), null)]
      })]);
    });
    return {
      isStuck
    };
  }
});
const { defineComponent: _defineComponent } = await importShared("vue");
const { resolveComponent: _resolveComponent, createVNode: _createVNode, createElementVNode: _createElementVNode, toDisplayString: _toDisplayString, withCtx: _withCtx, unref: _unref, renderSlot: _renderSlot, openBlock: _openBlock, createBlock: _createBlock, createCommentVNode: _createCommentVNode, Fragment: _Fragment, createElementBlock: _createElementBlock } = await importShared("vue");
const _hoisted_1 = { class: "time-wrap" };
const _hoisted_2 = { class: "dialog-body" };
const _hoisted_3 = { class: "dialog-body" };
const { computed, onMounted, reactive, ref, watch, onBeforeUnmount } = await importShared("vue");
const { useRouter } = await importShared("vue-router");
const dayjs = await importShared("dayjs");
const TIMER = 60;
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "SideNaviLayout",
  setup(__props) {
    const logoutDialog = ref({
      visible: false,
      title: "Logout",
      message: "log out after one minute of inactivity.",
      timer: TIMER,
      cancel: () => logout(),
      confirm: () => stayLoggedIn()
    });
    const notificationStore = useNotificationStore();
    const notification = computed(() => notificationStore.notification);
    const profileDialogStore = useProfileDialogStore();
    const profileDialog = computed(() => profileDialogStore.profileDialog);
    const companyStore = useCompanyStore();
    computed(() => companyStore.companyList);
    const company = computed(() => companyStore.company);
    const platformStore = usePlatformStore();
    const platform = computed(() => platformStore.platform);
    const shipStore = useShipStore();
    const LoadingStore = useLoadingStore();
    const ship = computed(() => shipStore.shipInfo);
    ref(null);
    computed(() => shipStore.shipList);
    const visible = computed({
      get() {
        return LoadingStore.getLoading();
      },
      set(v) {
        LoadingStore.setLoading(v);
      }
    });
    const authStore = useAuthStore();
    const userSessionInfo = computed(() => authStore.userSessionInfo);
    const menuStore = useMenuStore();
    const menuList = computed(() => {
      return menuStore.getValue;
    });
    const router = useRouter();
    const { lgAndUp } = useDisplay();
    const navidrawer = reactive({
      value: false,
      rail: false,
      // min nav toggle,
      selected: [-1],
      open: [-1],
      curMenu: [-1]
    });
    const fullScreen = ref(false);
    const updateTime = ref();
    const timeoutId = ref(0);
    const countdown = ref(0);
    const updateId = ref(0);
    function isFullScreenPath(path) {
      return path.includes("voyage-monitoring") || path.includes("voyage-planner") || path.includes("fleet-management");
    }
    computed(() => router.currentRoute.value.path === "/fleet-management");
    watch(
      () => userSessionInfo.value,
      () => {
        companyStore.getCompanyList(userSessionInfo.value);
      }
    );
    watch(
      () => router.currentRoute.value.path,
      (newPath) => {
        var _a, _b;
        fullScreen.value = isFullScreenPath(newPath);
        if (isFullScreenPath(newPath)) {
          document.documentElement.classList.add("overflow-y-hidden");
          (_a = document.querySelector(".v-main")) == null ? void 0 : _a.classList.remove("overflow-y-auto");
        } else {
          document.documentElement.classList.remove("overflow-y-hidden");
          (_b = document.querySelector(".v-main")) == null ? void 0 : _b.classList.add("overflow-y-auto");
        }
        setMenu();
        resetTimer();
      }
    );
    watch(
      () => company.value,
      (newCompany, oldCompany) => {
        var _a;
        if (company.value !== null) {
          shipStore.getShipList((_a = company.value) == null ? void 0 : _a.companyId);
          if ((newCompany == null ? void 0 : newCompany.companyId) !== (oldCompany == null ? void 0 : oldCompany.companyId)) {
            shipStore.setShipInfo(null);
          }
        }
      }
    );
    watch(
      () => ship.value,
      (newValue, oldValue) => {
        if (newValue && newValue !== null && JSON.stringify(newValue) !== JSON.stringify(oldValue)) {
          if (router.currentRoute.value.path !== "/fleet-management" && (newValue == null ? void 0 : newValue.shipId) !== (oldValue == null ? void 0 : oldValue.shipId)) {
            router.push("/voyage/voyage-monitoring");
          } else {
            if (ship.value !== newValue) {
              shipStore.setShipInfo(newValue);
            }
          }
        }
      }
    );
    watch(
      () => menuList,
      () => setMenu()
    );
    watch(
      () => lgAndUp.value,
      (v) => {
        if (v) {
          navidrawer.value = true;
        } else {
          navidrawer.value = false;
        }
      },
      {
        immediate: true
      }
    );
    watch(
      () => navidrawer.rail,
      () => {
      }
    );
    onMounted(() => {
      var _a, _b, _c, _d, _e;
      if (userSessionInfo.value) {
        companyStore.getCompanyList(userSessionInfo.value);
      }
      if (company.value) {
        shipStore.getShipList((_a = company.value) == null ? void 0 : _a.companyId);
      }
      if (window.location.hash === "#new") {
        const roleName = (_c = JSON.parse((_b = window == null ? void 0 : window.sessionStorage) == null ? void 0 : _b.getItem("user_info"))) == null ? void 0 : _c.roleName;
        console.log(`roleName`, roleName);
        if (roleName === "Master") {
          companyStore.setCompanyInfo(null);
        } else {
          shipStore.setShipInfo(null);
        }
        history.pushState("", document.title, window.location.pathname);
      }
      navidrawer.rail = false;
      fullScreen.value = isFullScreenPath(router.currentRoute.value.path);
      if (isFullScreenPath(router.currentRoute.value.path)) {
        document.documentElement.classList.add("overflow-y-hidden");
        (_d = document.querySelector(".v-main")) == null ? void 0 : _d.classList.remove("overflow-y-auto");
      } else {
        document.documentElement.classList.remove("overflow-y-hidden");
        (_e = document.querySelector(".v-main")) == null ? void 0 : _e.classList.add("overflow-y-auto");
      }
      setMenu();
      if (!platform.value) {
        platformStore.getPlatformInfo();
      }
      if (platform.value === "onboard") {
        getUpdateTime();
      }
      resetTimer();
    });
    const onClickMenu = () => {
      if (lgAndUp.value) {
        navidrawer.value ? navidrawer.rail = !navidrawer.rail : navidrawer.value = !navidrawer.value;
      } else {
        navidrawer.value = !navidrawer.value;
      }
    };
    const onClickHome = () => {
      router.push({ name: "home" });
    };
    const resetTimer = () => {
      clearTimeout(timeoutId.value);
      clearInterval(countdown.value);
      timeoutId.value = setTimeout(showLogoutWarning, getLogoutTime());
      logoutDialog.value.visible = false;
    };
    const showLogoutWarning = () => {
      logoutDialog.value.timer = TIMER;
      logoutDialog.value.visible = true;
      countdown.value = setInterval(() => {
        logoutDialog.value.timer--;
        if (logoutDialog.value.timer <= 0) {
          clearInterval(countdown.value);
          logout();
        }
      }, 1e3);
    };
    const stayLoggedIn = () => {
      resetTimer();
    };
    const logout = () => {
      logoutDialog.value.visible = false;
      authStore.logout(getRefreshToken());
    };
    function setMenu() {
      navidrawer.selected = [];
      navidrawer.open = [];
      findMenu(menuList.value);
      checkCurMenu(menuList.value);
    }
    function findMenu(menus) {
      if (menus === void 0) {
        return;
      }
      let currentPath;
      if (router.currentRoute.value.path.startsWith("/publish")) {
        currentPath = router.currentRoute.value.path.replace("/publish", "");
      } else {
        currentPath = router.currentRoute.value.path;
      }
      const findedMenu = menus.filter((menu) => currentPath.startsWith(menu.url))[0];
      if (findedMenu) {
        navidrawer.curMenu.push(findedMenu.menuId);
        if (findedMenu.children) {
          navidrawer.selected.pop();
          findMenu(findedMenu.children);
        }
      }
    }
    function checkCurMenu(menus) {
      if (menus === void 0) {
        return;
      }
      let currentPath = router.currentRoute.value.path;
      const curMenu = menus.filter((menu) => currentPath.startsWith(menu.url))[0];
      if (curMenu) {
        navidrawer.open.push(curMenu.menuId);
        if (curMenu.children) {
          navidrawer.selected.pop();
          checkCurMenu(curMenu.children);
        }
      }
    }
    const now = ref(dayjs().tz("Asia/Seoul"));
    const utcInterval = setInterval(() => {
      now.value = dayjs().tz("Asia/Seoul");
    });
    onBeforeUnmount(() => {
      clearInterval(utcInterval);
      clearTimeout(timeoutId.value);
      clearInterval(countdown.value);
      clearInterval(updateId.value);
    });
    function getUpdateTime() {
      let latestTime = null;
      axiosInstance.get(`/krakend/inbound-gateway/receiver/ships/${ship.value.shipId}/health/devices`, { headers: { "X-API-VERSION": "1.0.0" } }).then((res) => {
        res.data.collection.forEach((devices) => {
          if (updateTime.value) {
            if (new Date(latestTime).getTime() < new Date(devices.dataLatestTime).getTime()) {
              updateTime.value = dayjs(new Date(devices.dataLatestTime));
              latestTime = devices.dataLatestTime;
            }
          } else {
            updateTime.value = dayjs(new Date(devices.dataLatestTime));
            latestTime = devices.dataLatestTime;
          }
        });
      });
      updateId.value = setInterval(() => {
        axiosInstance.get(`/krakend/inbound-gateway/receiver/ships/${ship.value.shipId}/health/devices`, { headers: { "X-API-VERSION": "1.0.0" } }).then((res) => {
          res.data.collection.forEach((devices) => {
            if (updateTime.value) {
              if (new Date(latestTime).getTime() < new Date(devices.dataLatestTime).getTime()) {
                updateTime.value = dayjs(new Date(devices.dataLatestTime));
                latestTime = devices.dataLatestTime;
              }
            } else {
              updateTime.value = dayjs(new Date(devices.dataLatestTime));
              latestTime = devices.dataLatestTime;
            }
          });
        });
      }, getCommonIntervalTime());
    }
    return (_ctx, _cache) => {
      const _component_loading_dialog = _resolveComponent("loading-dialog");
      const _component_BaseBreadCrumb = _resolveComponent("BaseBreadCrumb");
      const _component_BaseDialog = _resolveComponent("BaseDialog");
      return _openBlock(), _createElementBlock(_Fragment, null, [
        _createVNode(_component_loading_dialog, {
          modelValue: visible.value,
          "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => visible.value = $event)
        }, null, 8, ["modelValue"]),
        _createVNode(VLayout, {
          class: "side-navi-layout-main",
          style: { zIndex: "none" }
        }, {
          default: _withCtx(() => [
            _createVNode(VAppBar, {
              class: "app-header",
              height: "64",
              flat: ""
            }, {
              prepend: _withCtx(() => [
                _createVNode(VBtn, {
                  class: "btn-menu",
                  onClick: onClickMenu,
                  icon: "mdi-menu",
                  color: "secondary"
                }),
                _createVNode(VBtn, {
                  class: "btn-menu",
                  onClick: onClickHome,
                  icon: "mdi-home-outline",
                  color: "secondary"
                })
              ]),
              append: _withCtx(() => [
                _createElementVNode("div", _hoisted_1, [
                  _cache[6] || (_cache[6] = _createElementVNode("i", { class: "mdi-clock-time-three-outline" }, null, -1)),
                  _createElementVNode("p", null, _toDisplayString(now.value.format("YYYY-MM-DD HH:mm:ss")), 1)
                ]),
                _createVNode(HeaderButtons)
              ]),
              _: 1
            }),
            _createVNode(VNavigationDrawer, {
              class: "app-side-nav",
              modelValue: navidrawer.value,
              "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => navidrawer.value = $event),
              rail: navidrawer.rail,
              order: "0",
              width: "240",
              "rail-width": 67.2,
              flat: "",
              "disable-resize-watcher": ""
            }, {
              default: _withCtx(() => [
                _createVNode(VList, {
                  class: "gnb",
                  selected: navidrawer.selected,
                  "onUpdate:selected": _cache[1] || (_cache[1] = ($event) => navidrawer.selected = $event),
                  opened: navidrawer.open,
                  "onUpdate:opened": _cache[2] || (_cache[2] = ($event) => navidrawer.open = $event),
                  onClick: _cache[3] || (_cache[3] = ($event) => navidrawer.rail = false),
                  "onClick:open": _cache[4] || (_cache[4] = ($event) => navidrawer.rail = false),
                  nav: "",
                  "open-strategy": "single"
                }, {
                  default: _withCtx(() => [
                    _createVNode(SideMenuItem, {
                      "menu-list": menuList.value,
                      "is-rail": navidrawer.rail,
                      selectedMenu: navidrawer.curMenu
                    }, null, 8, ["menu-list", "is-rail", "selectedMenu"])
                  ]),
                  _: 1
                }, 8, ["selected", "opened"]),
                _cache[7] || (_cache[7] = _createElementVNode("div", { class: "logo" }, null, -1))
              ]),
              _: 1,
              __: [7]
            }, 8, ["modelValue", "rail"]),
            _createVNode(VMain, null, {
              default: _withCtx(() => [
                fullScreen.value ? (_openBlock(), _createBlock(VContainer, {
                  key: 0,
                  fluid: "",
                  class: "full-screen-layout"
                }, {
                  default: _withCtx(() => [
                    _createVNode(_component_BaseBreadCrumb, {
                      router: _unref(router),
                      "menu-list": menuList.value,
                      class: "px-8"
                    }, null, 8, ["router", "menu-list"]),
                    _renderSlot(_ctx.$slots, "default", {}, void 0, true)
                  ]),
                  _: 3
                })) : (_openBlock(), _createBlock(VContainer, {
                  key: 1,
                  fluid: "",
                  class: "pa-4 pt-0 pa-md-8 pt-md-0"
                }, {
                  default: _withCtx(() => [
                    _createVNode(VRow, { "no-gutters": "" }, {
                      default: _withCtx(() => [
                        _createVNode(VCol, { cols: "12" }, {
                          default: _withCtx(() => [
                            _createVNode(_component_BaseBreadCrumb, {
                              router: _unref(router),
                              "menu-list": menuList.value
                            }, null, 8, ["router", "menu-list"]),
                            _renderSlot(_ctx.$slots, "default", {}, void 0, true)
                          ]),
                          _: 3
                        })
                      ]),
                      _: 3
                    })
                  ]),
                  _: 3
                }))
              ]),
              _: 3
            }),
            _createVNode(_sfc_main$3),
            _createVNode(_component_BaseDialog, {
              "is-open": logoutDialog.value.visible,
              title: logoutDialog.value.title,
              "confirm-title": "Stay",
              "cancel-title": "Lotout",
              "onClick:cancel": logoutDialog.value.cancel,
              "onClick:confirm": logoutDialog.value.confirm,
              width: 500
            }, {
              body: _withCtx(() => [
                _createElementVNode("div", _hoisted_2, _toDisplayString(logoutDialog.value.message) + "(" + _toDisplayString(logoutDialog.value.timer) + ")", 1)
              ]),
              _: 1
            }, 8, ["is-open", "title", "onClick:cancel", "onClick:confirm"]),
            _createVNode(_component_BaseDialog, {
              "is-open": notification.value.isOpen,
              title: notification.value.title,
              persistent: "",
              "confirm-title": "Ok",
              "cancel-title": "Cancel",
              "onClick:cancel": notification.value.cancel,
              "onClick:confirm": notification.value.confirm,
              width: 500
            }, {
              body: _withCtx(() => [
                _createElementVNode("div", _hoisted_3, _toDisplayString(notification.value.message), 1)
              ]),
              _: 1
            }, 8, ["is-open", "title", "onClick:cancel", "onClick:confirm"]),
            _createVNode(_sfc_main$2, {
              "is-open": profileDialog.value.isOpen,
              onClose: profileDialog.value.close
            }, null, 8, ["is-open", "onClose"])
          ]),
          _: 3
        })
      ], 64);
    };
  }
});
const SideNaviLayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c0882acd"]]);
export {
  makeLocationProps as A,
  required as B,
  passwordRule as C,
  VContainer as D,
  VRow as E,
  VCol as F,
  makeVDividerProps as G,
  VProgressCircular as H,
  useListItems as I,
  makeVListProps as J,
  VBtnToggleSymbol as K,
  LoaderSlot as L,
  VProgressLinear as M,
  transformItem$1 as N,
  useIntersectionObserver as O,
  VSnackbar as P,
  makeVSnackbarProps as Q,
  makeVMenuProps as R,
  VAppBar as S,
  VBtnGroup as T,
  VBtnToggle as U,
  VBtn as V,
  VListSubheader as W,
  VNavigationDrawer as X,
  VToolbar as Y,
  _sfc_main$3 as _,
  useGroup as a,
  makeGroupProps as b,
  createLayout as c,
  useGroupItem as d,
  SideNaviLayout as default,
  makeGroupItemProps as e,
  useLoader as f,
  makeLoaderProps as g,
  useItems as h,
  VMenu as i,
  VList as j,
  VDialogTransition as k,
  makeItemsProps as l,
  makeLayoutProps as m,
  VDivider as n,
  makeVBtnProps as o,
  makeVToolbarTitleProps as p,
  VToolbarTitle as q,
  useLayoutItem as r,
  makeLayoutItemProps as s,
  VLayout as t,
  useResizeObserver as u,
  VMain as v,
  _sfc_main$2 as w,
  useLocation as x,
  usePosition as y,
  makePositionProps as z
};
