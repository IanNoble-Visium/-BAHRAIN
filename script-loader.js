// Script Loader with Error Handling
// Ensures scripts load correctly and provides better error messages

(function() {
  'use strict';

  function loadScript(src, onLoad, onError) {
    const script = document.createElement('script');
    script.src = src;
    script.onload = function() {
      console.log('✅ Loaded:', src);
      if (onLoad) onLoad();
    };
    script.onerror = function() {
      console.error('❌ Failed to load:', src);
      if (onError) onError();
    };
    document.head.appendChild(script);
  }

  function loadScriptsSequentially(scripts, callback) {
    let index = 0;
    
    function loadNext() {
      if (index >= scripts.length) {
        if (callback) callback();
        return;
      }
      
      const src = scripts[index];
      loadScript(src, () => {
        index++;
        loadNext();
      }, () => {
        // Continue even if one fails
        index++;
        loadNext();
      });
    }
    
    loadNext();
  }

  // Export for use
  window.ScriptLoader = {
    load: loadScript,
    loadSequentially: loadScriptsSequentially
  };

  console.log('✅ ScriptLoader initialized');
})();

