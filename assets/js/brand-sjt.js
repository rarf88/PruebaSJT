
// v21: EXACT equality (bar == logo) with !important; top is double (92) then normal (46)
(function() {
  var H0 = 74;      // height at top (double of 46)
  var H1 = 46;      // normal height after small scroll
  var SEP0 = 200;   // separation when big
  var SEP1 = 172;   // separation when normal
  var GAP0 = 60;
  var GAP1 = 56;
  var SHRINK_AT = 120;  // scrollY at which header shrinks
  var EXPAND_AT = 60;   // scrollY at which header expands back
  var isSmall = false;  // current state

  function q(s){ return document.querySelector(s); }
  function qa(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); }

  function setImp(el, prop, val){
    if (!el) return;
    try { el.style.setProperty(prop, val, "important"); }
    catch(e){ el.style[prop.replace(/-([a-z])/g, (_,c)=>c.toUpperCase())] = val; }
  }

  function apply(h, sep, gap) {
    var header = q("header.site-header");
    if (!header) return;

    var nav = header.querySelector(".nav");
    var logo = header.querySelector(".logo");
    var img  = header.querySelector(".logo img.brand-sjt");
    var linksWrap = header.querySelector(".nav-links");
    var links = linksWrap ? linksWrap.querySelectorAll("a") : null;

    // Header (bar)
    setImp(header, "min-height", h + "px");
    setImp(header, "height", h + "px");
    setImp(header, "padding-top", "0px");
    setImp(header, "padding-bottom", "0px");
    setImp(header, "overflow", "hidden");
    setImp(header, "transition", "height 160ms ease, min-height 160ms ease");

    // Logo container
    if (logo) {
      setImp(logo, "height", h + "px");
      setImp(logo, "margin-right", sep + "px");
      setImp(logo, "display", "flex");
      setImp(logo, "align-items", "center");
      setImp(logo, "line-height", "0");
      setImp(logo, "overflow", "hidden");
      setImp(logo, "transition", "height 160ms ease, margin-right 160ms ease");
    }

    // Logo image (exactly equal to bar)
    if (img) {
      setImp(img, "height", h + "px");
      setImp(img, "max-height", "none");
      setImp(img, "width", "auto");
      setImp(img, "position", "static");
      setImp(img, "margin", "0");
      setImp(img, "top", "0");
      setImp(img, "z-index", "1");
      setImp(img, "transition", "height 160ms ease");
    }

    // Menu
    if (linksWrap) {
      setImp(linksWrap, "display", "flex");
      setImp(linksWrap, "align-items", "center");
      setImp(linksWrap, "gap", gap + "px");
      if (links) {
        links.forEach(function(a){
          setImp(a, "height", h + "px");
          setImp(a, "display", "inline-flex");
          setImp(a, "align-items", "center");
        });
      }
    }
  }

  function update() {
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    // Hysteresis to avoid thrashing: only toggle when we cross the far threshold
    if (!isSmall && y >= SHRINK_AT) {
      // go small
      apply(H1, SEP1, GAP1);
      document.body.classList.add("sjt-normal");
      document.body.classList.remove("sjt-top");
      isSmall = true;
    } else if (isSmall && y <= EXPAND_AT) {
      // go big
      apply(H0, SEP0, GAP0);
      document.body.classList.add("sjt-top");
      document.body.classList.remove("sjt-normal");
      isSmall = false;
    } else if (!isSmall && y < SHRINK_AT) {
      // ensure initial big state without reapplying continuously
      // (no-op to prevent reflow loops)
    } else if (isSmall && y > EXPAND_AT) {
      // keep small
    }
  }

  var ticking = false;
  function onScroll() {
    if (!ticking) {
      window.requestAnimationFrame(function(){
        update();
        ticking = false;
      });
      ticking = true;
    }
  }

  
  function applySmall(){
    apply(H1, SEP1, GAP1);
    document.body.classList.add("sjt-normal");
    document.body.classList.remove("sjt-top");
    isSmall = true;
  }
  function applyBig(){
    apply(H0, SEP0, GAP0);
    document.body.classList.add("sjt-top");
    document.body.classList.remove("sjt-normal");
    isSmall = false;
  }
  function initState(){
    var y = window.pageYOffset || document.documentElement.scrollTop || 0;
    if (y >= SHRINK_AT) { applySmall(); }
    else { applyBig(); }
  }
  // Initialize on common lifecycle events (handles back-forward cache too)
  document.addEventListener("DOMContentLoaded", initState);
  window.addEventListener("load", initState);
  window.addEventListener("pageshow", function(e){ initState(); });
window.addEventListener("scroll", onScroll, {passive:true});
  window.addEventListener("resize", onScroll, {passive:true});
  window.addEventListener("load", update);
})();
