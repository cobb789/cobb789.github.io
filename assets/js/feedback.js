/**
 * Article Feedback Widget
 * Randomly shows either Updown (👍/👎) or Star Rating (⭐) mode
 * Sends events to GA4 via gtag
 */
(function () {
  'use strict';

  // Only run on post pages
  const article = document.querySelector('article');
  if (!article) return;

  const slug = window.location.pathname.replace(/^\/posts\//, '').replace(/\/$/, '');
  const storageKey = 'feedback_' + slug;

  // Check if already voted
  if (localStorage.getItem(storageKey)) {
    renderThankYou(article);
    return;
  }

  // Randomly pick mode: 0 = updown, 1 = stars
  const mode = Math.random() < 0.5 ? 'updown' : 'stars';

  const container = document.createElement('div');
  container.className = 'feedback-widget';
  container.innerHTML = mode === 'updown' ? renderUpdown() : renderStars();

  // Insert before related posts or at end of article content
  const content = article.querySelector('.post-content') || article;
  content.parentNode.insertBefore(container, content.nextSibling);

  // Bind events
  if (mode === 'updown') {
    bindUpdown(container, slug, storageKey);
  } else {
    bindStars(container, slug, storageKey);
  }

  function renderUpdown() {
    return `
      <div class="feedback-inner">
        <p class="feedback-title">这篇文章对你有帮助吗？</p>
        <div class="feedback-buttons">
          <button class="fb-btn fb-up" data-value="up" aria-label="有帮助">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"/>
            </svg>
            <span class="fb-label">有帮助</span>
          </button>
          <button class="fb-btn fb-down" data-value="down" aria-label="没帮助">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10zM17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3"/>
            </svg>
            <span class="fb-label">没帮助</span>
          </button>
        </div>
      </div>`;
  }

  function renderStars() {
    let starsHtml = '';
    for (let i = 1; i <= 5; i++) {
      starsHtml += `<button class="fb-star" data-value="${i}" aria-label="${i}星">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </button>`;
    }
    return `
      <div class="feedback-inner">
        <p class="feedback-title">为这篇文章打个分吧</p>
        <div class="feedback-stars">${starsHtml}</div>
      </div>`;
  }

  function bindUpdown(container, slug, key) {
    container.querySelectorAll('.fb-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const value = this.dataset.value;
        sendEvent(slug, 'updown', value);
        localStorage.setItem(key, value);
        animateAndReplace(container, value === 'up' ? '👍' : '👎');
      });
      // Hover effect
      btn.addEventListener('mouseenter', function () { this.classList.add('active'); });
      btn.addEventListener('mouseleave', function () { this.classList.remove('active'); });
    });
  }

  function bindStars(container, slug, key) {
    const stars = container.querySelectorAll('.fb-star');
    stars.forEach(function (star, idx) {
      star.addEventListener('mouseenter', function () {
        stars.forEach(function (s, i) {
          s.classList.toggle('hover', i <= idx);
        });
      });
      star.addEventListener('mouseleave', function () {
        stars.forEach(function (s) { s.classList.remove('hover'); });
      });
      star.addEventListener('click', function () {
        const value = this.dataset.value;
        var rating = parseInt(value);
        var sentiment = rating >= 3 ? 'good' : 'bad';
        sendEvent(slug, 'stars', value, sentiment);
        localStorage.setItem(key, value);
        // Fill selected stars
        stars.forEach(function (s, i) {
          s.classList.toggle('selected', i < rating);
          s.style.pointerEvents = 'none';
        });
        setTimeout(function () {
          var emoji = rating >= 3 ? '😊' : '🙏';
          var msg = rating >= 3 ? '感谢你的认可！' : '感谢反馈，我会继续改进！';
          animateAndReplace(container, emoji + ' ' + msg);
        }, 600);
      });
    });
  }

  function sendEvent(slug, mode, value, sentiment) {
    if (typeof gtag === 'function') {
      gtag('event', 'article_feedback', {
        article_slug: slug,
        feedback_mode: mode,
        feedback_value: value,
        feedback_sentiment: sentiment || (value === 'up' ? 'good' : 'bad')
      });
    }
  }

  function animateAndReplace(container, emoji) {
    const inner = container.querySelector('.feedback-inner');
    inner.style.opacity = '0';
    inner.style.transform = 'scale(0.95)';
    setTimeout(function () {
      inner.innerHTML = '<p class="feedback-thanks">' + emoji + ' 感谢你的反馈！</p>';
      inner.style.opacity = '1';
      inner.style.transform = 'scale(1)';
    }, 300);
  }

  function renderThankYou(article) {
    const container = document.createElement('div');
    container.className = 'feedback-widget';
    container.innerHTML = '<div class="feedback-inner"><p class="feedback-thanks">✅ 你已为这篇文章提供了反馈，感谢！</p></div>';
    const tail = article.querySelector('.post-tail-wrapper') || article.querySelector('.content');
    if (tail) {
      tail.parentNode.insertBefore(container, tail);
    } else {
      article.appendChild(container);
    }
  }
})();
