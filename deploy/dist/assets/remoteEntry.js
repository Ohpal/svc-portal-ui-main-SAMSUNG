const exportSet = /* @__PURE__ */ new Set(["Module", "__esModule", "default", "_export_sfc"]);
let moduleMap = {
  "./Axios": () => {
    dynamicLoadingCss([], false, "./Axios");
    return __federation_import("./../js/__federation_expose_Axios/__federation_expose_Axios-CPZuurz-.js").then((module) => Object.keys(module).every((item) => exportSet.has(item)) ? () => module.default : () => module);
  },
  "./SideNaviLayout": () => {
    dynamicLoadingCss(["__federation_expose_SideNaviLayout-B_eYDlgr.__federation_expose_SideNaviLayout.css","__federation_expose_SideMenuItem-4h_gnczk.__federation_expose_SideMenuItem.css"], false, "./SideNaviLayout");
    return __federation_import("./../js/__federation_expose_SideNaviLayout/__federation_expose_SideNaviLayout-OifX8_bZ.js").then((module) => Object.keys(module).every((item) => exportSet.has(item)) ? () => module.default : () => module);
  },
  "./SideMenuItem": () => {
    dynamicLoadingCss(["__federation_expose_SideMenuItem-4h_gnczk.__federation_expose_SideMenuItem.css"], false, "./SideMenuItem");
    return __federation_import("./../js/__federation_expose_SideMenuItem/__federation_expose_SideMenuItem-xRCesO4V.js").then((module) => Object.keys(module).every((item) => exportSet.has(item)) ? () => module.default : () => module);
  }
};
const seen = {};
const dynamicLoadingCss = (cssFilePaths, dontAppendStylesToHead, exposeItemName) => {
  const metaUrl = import.meta.url;
  if (typeof metaUrl == "undefined") {
    console.warn('The remote style takes effect only when the build.target option in the vite.config.ts file is higher than that of "es2020".');
    return;
  }
  const curUrl = metaUrl.substring(0, metaUrl.lastIndexOf("remoteEntry.js"));
  cssFilePaths.forEach((cssFilePath) => {
    const href = curUrl + cssFilePath;
    if (href in seen) return;
    seen[href] = true;
    if (dontAppendStylesToHead) {
      const key = "css__svc-portal__" + exposeItemName;
      if (window[key] == null) window[key] = [];
      window[key].push(href);
    } else {
      const element = document.head.appendChild(document.createElement("link"));
      element.href = href;
      element.rel = "stylesheet";
    }
  });
};
async function __federation_import(name) {
  return import(name);
}
const get = (module) => {
  if (!moduleMap[module]) throw new Error("Can not find remote module " + module);
  return moduleMap[module]();
};
const init = (shareScope) => {
  globalThis.__federation_shared__ = globalThis.__federation_shared__ || {};
  Object.entries(shareScope).forEach(([key, value]) => {
    const versionKey = Object.keys(value)[0];
    const versionValue = Object.values(value)[0];
    const scope = versionValue.scope || "default";
    globalThis.__federation_shared__[scope] = globalThis.__federation_shared__[scope] || {};
    const shared = globalThis.__federation_shared__[scope];
    (shared[key] = shared[key] || {})[versionKey] = versionValue;
  });
};
export {
  dynamicLoadingCss,
  get,
  init
};
