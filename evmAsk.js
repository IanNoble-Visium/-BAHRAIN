// Safety shim: prevent redefining window.ethereum if some extension already injected it
(function(){
  try {
    if (Object.getOwnPropertyDescriptor(window, 'ethereum')) {
      // If already defined and not configurable, skip defining anything
      var desc = Object.getOwnPropertyDescriptor(window, 'ethereum');
      if (!desc.configurable) return;
    }
    // If this project ever needs to inject a provider, do it behind a guard key
    if (!window.__evmInjected) {
      Object.defineProperty(window, '__evmInjected', { value: true, configurable: false });
      // No-op: we do not inject ethereum provider in this demo
    }
  } catch (e) {
    // Swallow errors to avoid breaking the site locally when extensions are present
  }
})();

