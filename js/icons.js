// js/icons.js
// Small helper utilities for icons, avatars and small UI bits.
// Depends on lucide being loaded (optional) but works without it.

(function () {
  // safe create icons (lucide optional)
  function tryCreateLucide() {
    try {
      if (window.lucide && typeof window.lucide.createIcons === "function") {
        window.lucide.createIcons();
      }
    } catch (e) {
      // ignore
    }
  }

  // Create a lucide inline svg element by name, or fallback to a simple <i> placeholder.
  function createIcon(name, attrs = {}) {
    // prefer lucide if available
    if (window.lucide && typeof window.lucide.icons !== "undefined") {
      try {
        // lucide.createIcon returns an SVG element in some builds; else build manually
        const svg = window.lucide.createIcon(name);
        Object.keys(attrs).forEach(k => svg.setAttribute(k, attrs[k]));
        return svg;
      } catch (e) {
        // fallback below
      }
    }

    const el = document.createElement('i');
    el.className = `icon icon-${name}`;
    el.textContent = ''; // empty, visual via css if needed
    Object.keys(attrs).forEach(k => el.setAttribute(k, attrs[k]));
    return el;
  }

  // Create an avatar element (img wrapped) with optional size and fallback
  function createAvatar(url, opts = {}) {
    const size = opts.size || 40;
    const wrapper = document.createElement('div');
    wrapper.className = 'avatar';
    wrapper.style.width = `${size}px`;
    wrapper.style.height = `${size}px`;
    wrapper.style.minWidth = `${size}px`;
    wrapper.style.borderRadius = '999px';
    wrapper.style.overflow = 'hidden';
    wrapper.style.display = 'inline-block';
    wrapper.style.background = 'linear-gradient(180deg,#0b1220,#071226)';
    wrapper.style.boxShadow = '0 1px 2px rgba(0,0,0,0.4)';
    wrapper.style.verticalAlign = 'middle';

    if (!url) {
      // blank placeholder
      const placeholder = document.createElement('div');
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      placeholder.style.display = 'flex';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      placeholder.style.color = '#9aa4b2';
      placeholder.style.fontSize = `${Math.max(10, Math.floor(size/3))}px`;
      placeholder.textContent = '👤';
      wrapper.appendChild(placeholder);
      return wrapper;
    }

    const img = document.createElement('img');
    img.src = url;
    img.alt = 'avatar';
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    img.onerror = function () {
      // replace with placeholder emoji on error
      wrapper.innerHTML = '';
      const placeholder = document.createElement('div');
      placeholder.style.width = '100%';
      placeholder.style.height = '100%';
      placeholder.style.display = 'flex';
      placeholder.style.alignItems = 'center';
      placeholder.style.justifyContent = 'center';
      placeholder.style.color = '#9aa4b2';
      placeholder.style.fontSize = `${Math.max(10, Math.floor(size/3))}px`;
      placeholder.textContent = '👤';
      wrapper.appendChild(placeholder);
    };
    wrapper.appendChild(img);

    // optional badge (small verified dot)
    if (opts.verified) {
      const badge = document.createElement('span');
      badge.className = 'avatar-badge verified';
      badge.style.position = 'absolute';
      badge.style.transform = 'translate(30%, 30%)';
      badge.style.right = '-6px';
      badge.style.bottom = '-6px';
      badge.style.background = '#10b981';
      badge.style.width = `${Math.max(8, Math.floor(size/5))}px`;
      badge.style.height = `${Math.max(8, Math.floor(size/5))}px`;
      badge.style.borderRadius = '999px';
      badge.style.border = '2px solid rgba(8,10,12,0.6)';
      badge.title = 'Verified';
      // position wrapper relatively so badge can absolute-position
      wrapper.style.position = 'relative';
      wrapper.appendChild(badge);
    }

    // online indicator
    if (opts.status) {
      const status = document.createElement('span');
      status.className = 'avatar-status';
      status.style.position = 'absolute';
      status.style.left = '6px';
      status.style.bottom = '-4px';
      status.style.width = `${Math.max(8, Math.floor(size/5))}px`;
      status.style.height = `${Math.max(8, Math.floor(size/5))}px`;
      status.style.borderRadius = '999px';
      status.style.border = '2px solid rgba(8,10,12,0.6)';
      status.title = opts.status;
      if (opts.status === 'online') status.style.background = '#34d399';
      else if (opts.status === 'idle') status.style.background = '#f59e0b';
      else status.style.background = '#9aa4b2'; // offline / unknown
      wrapper.style.position = 'relative';
      wrapper.appendChild(status);
    }

    return wrapper;
  }

  // Small helper to create a verified badge element (SVG or span)
  function createVerifiedBadge() {
    const span = document.createElement('span');
    span.className = 'verified-badge';
    span.style.display = 'inline-flex';
    span.style.alignItems = 'center';
    span.style.gap = '6px';
    span.style.color = '#a7f3d0';
    span.style.fontSize = '12px';

    const dot = document.createElement('span');
    dot.style.width = '8px';
    dot.style.height = '8px';
    dot.style.borderRadius = '999px';
    dot.style.background = '#10b981';
    dot.style.display = 'inline-block';
    dot.style.boxShadow = '0 0 6px rgba(16,185,129,0.3)';

    const text = document.createElement('span');
    text.textContent = 'Verified';

    span.appendChild(dot);
    span.appendChild(text);
    return span;
  }

  // Format timestamp to Telegram-like compact date/time string
  function formatTimestamp(ts) {
    const d = (ts instanceof Date) ? ts : new Date(ts);
    if (isNaN(d.getTime())) return '';
    // e.g. "12:43 • Feb 12"
    const pad = n => (n < 10 ? '0' + n : n);
    const hh = pad(d.getHours());
    const mm = pad(d.getMinutes());
    const mon = d.toLocaleString(undefined, { month: 'short' });
    const day = d.getDate();
    return `${hh}:${mm} • ${mon} ${day}`;
  }

  // Expose utilities
  window.Icons = {
    init: tryCreateLucide,
    createIcon,
    createAvatar,
    createVerifiedBadge,
    formatTimestamp
  };

  // initialize if lucide present
  tryCreateLucide();

})();
