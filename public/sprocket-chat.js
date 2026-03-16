(function () {
  if (window.__sprocketChatLoaded) {
    return;
  }
  window.__sprocketChatLoaded = true;

  var WIDGET_ID = 'sprocket-chat-widget';
  var STYLE_ID = 'sprocket-chat-style';
  var EVENT_ENDPOINT = (function () {
    if (typeof window !== 'undefined' && typeof window.SPROCKET_EVENT_ENDPOINT === 'string' && window.SPROCKET_EVENT_ENDPOINT.trim()) {
      return window.SPROCKET_EVENT_ENDPOINT.trim();
    }

    var isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      return 'http://localhost:3001/api/sprocket-event';
    }

    return '/api/sprocket-event';
  })();
  var API_ENDPOINT = (function () {
    if (typeof window !== 'undefined' && typeof window.SPROCKET_API_ENDPOINT === 'string' && window.SPROCKET_API_ENDPOINT.trim()) {
      return window.SPROCKET_API_ENDPOINT.trim();
    }

    var isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    if (isLocalhost) {
      return 'http://localhost:3001/api/sprocket-chat';
    }

    return '/api/sprocket-chat';
  })();
  var AVATAR_URL = '/gear-glasses-v2.png';
  var SESSION_STORAGE_KEY = 'sprocket_chat_session_id';

  function getOrCreateSessionId() {
    try {
      var existing = localStorage.getItem(SESSION_STORAGE_KEY);
      if (existing) {
        return existing;
      }

      var generated = 'spk_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 10);
      localStorage.setItem(SESSION_STORAGE_KEY, generated);
      return generated;
    } catch (error) {
      return 'spk_fallback_' + Date.now().toString(36);
    }
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"']/g, function (char) {
      var map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      };
      return map[char];
    });
  }

  function addStylesheet() {
    if (document.getElementById(STYLE_ID)) {
      return;
    }

    var link = document.createElement('link');
    link.id = STYLE_ID;
    link.rel = 'stylesheet';
    link.href = '/sprocket-chat.css';
    document.head.appendChild(link);
  }

  var conversationHistory = [];
  var sessionId = getOrCreateSessionId();
  var hasLoggedConversationStart = false;

  function postEvent(eventType, metadata) {
    if (!eventType) {
      return;
    }

    var payload = {
      sessionId: sessionId,
      eventType: eventType,
      pageUrl: window.location.href,
      metadata: metadata || {}
    };

    try {
      fetch(EVENT_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        keepalive: true
      }).catch(function () {
        // no-op for telemetry failures
      });
    } catch (error) {
      // no-op
    }
  }

  function addMessage(messagesEl, avatarUrl, role, text, ctas) {
    var row = document.createElement('div');
    row.className = 'sprocket-row ' + role;

    if (role === 'bot') {
      var avatar = document.createElement('img');
      avatar.className = 'sprocket-avatar';
      avatar.src = avatarUrl;
      avatar.alt = 'Sprocket avatar';
      row.appendChild(avatar);
    }

    var body = document.createElement('div');
    body.className = 'sprocket-msg-body';

    var bubble = document.createElement('div');
    bubble.className = 'sprocket-bubble';

    var formatted = escapeHtml(text)
      .replace(/\n/g, '<br />')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/(https?:\/\/[^\s<]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>');

    bubble.innerHTML = formatted;
    body.appendChild(bubble);

    if (role === 'bot' && Array.isArray(ctas) && ctas.length > 0) {
      var ctaWrap = document.createElement('div');
      ctaWrap.className = 'sprocket-ctas';

      ctas.forEach(function (cta) {
        if (!cta || typeof cta !== 'object') {
          return;
        }

        var btn = document.createElement('a');
        btn.className = 'sprocket-cta sprocket-cta-' + (cta.type || 'default');
        btn.textContent = cta.label || 'Continue';

        if (cta.url) {
          btn.href = cta.url;
          btn.target = '_blank';
          btn.rel = 'noopener noreferrer';
        } else {
          btn.href = '#';
        }

        if (cta.action === 'capture_email') {
          btn.addEventListener('click', function (event) {
            event.preventDefault();
            postEvent('email_followup_cta_shown', { clicked: true });
            var input = document.querySelector('#' + WIDGET_ID + ' .sprocket-input');
            if (input) {
              input.focus();
              input.placeholder = 'name@dealership.com';
            }
          });
        } else if (cta.type === 'schedule') {
          btn.addEventListener('click', function () {
            postEvent('schedule_call_clicked', { ctaLabel: cta.label || 'Schedule Implementation Call' });
          });
        } else if (cta.type === 'trial') {
          btn.addEventListener('click', function () {
            postEvent('start_trial_clicked', { ctaLabel: cta.label || 'Start Trial' });
          });
        }

        ctaWrap.appendChild(btn);
      });

      body.appendChild(ctaWrap);
    }

    row.appendChild(body);
    messagesEl.appendChild(row);
    messagesEl.scrollTop = messagesEl.scrollHeight;

    conversationHistory.push({ role: role, text: text });
    if (conversationHistory.length > 20) {
      conversationHistory.shift();
    }
  }

  function buildWidget() {
    if (document.getElementById(WIDGET_ID)) {
      return;
    }

    addStylesheet();

    var avatarUrl = AVATAR_URL;
    var widget = document.createElement('section');
    widget.id = WIDGET_ID;
    widget.setAttribute('aria-label', 'Sprocket chat widget');

    widget.innerHTML = [
      '<button type="button" class="sprocket-chat-button" aria-label="Open Sprocket chat">',
      '  <img src="' + avatarUrl + '" alt="Sprocket" />',
      '</button>',
      '<div class="sprocket-chat-window" role="dialog" aria-label="Sprocket chat" aria-modal="false">',
      '  <header class="sprocket-header">',
      '    <img src="' + avatarUrl + '" alt="Sprocket" />',
      '    <div>',
      '      <h2 class="sprocket-title">Sprocket</h2>',
      '      <p class="sprocket-subtitle">AutoDriveCX Assistant</p>',
      '    </div>',
      '    <button type="button" class="sprocket-close" aria-label="Close chat">&times;</button>',
      '  </header>',
      '  <div class="sprocket-messages" aria-live="polite"></div>',
      '  <div class="sprocket-input-wrap">',
      '    <form class="sprocket-form">',
      '      <input class="sprocket-input" type="text" placeholder="Ask Sprocket..." autocomplete="off" />',
      '      <button class="sprocket-send" type="submit">Send</button>',
      '    </form>',
      '  </div>',
      '</div>'
    ].join('');

    document.body.appendChild(widget);

    var openBtn = widget.querySelector('.sprocket-chat-button');
    var closeBtn = widget.querySelector('.sprocket-close');
    var form = widget.querySelector('.sprocket-form');
    var input = widget.querySelector('.sprocket-input');
    var sendBtn = widget.querySelector('.sprocket-send');
    var messagesEl = widget.querySelector('.sprocket-messages');

    var seededInitialMessage = false;

      function openChat() {
        widget.classList.add('is-open');
        if (!hasLoggedConversationStart) {
          postEvent('conversation_started', { source: 'chat_widget_open' });
          hasLoggedConversationStart = true;
        }
        if (!seededInitialMessage) {
        addMessage(
          messagesEl,
          avatarUrl,
          'bot',
          "Hi, I'm Sprocket.\n\nI help dealerships and individual operators improve execution consistency across sales, service, and BDC.\n\nAsk me anything about:\n• install speed\n• manager coaching visibility\n• sales or service consistency\n• personal performance growth"
        );
        seededInitialMessage = true;
      }
      window.setTimeout(function () {
        input.focus();
      }, 140);
    }

      function closeChat() {
        widget.classList.remove('is-open');
        postEvent('conversation_ended', { source: 'chat_widget_close' });
        openBtn.focus();
      }

    openBtn.addEventListener('click', function () {
      if (widget.classList.contains('is-open')) {
        closeChat();
      } else {
        openChat();
      }
    });

    closeBtn.addEventListener('click', closeChat);

    form.addEventListener('submit', async function (event) {
      event.preventDefault();

      var message = input.value.trim();
      if (!message) {
        return;
      }

      var historyCopy = JSON.parse(JSON.stringify(conversationHistory));

      addMessage(messagesEl, avatarUrl, 'user', message);
      input.value = '';
      input.focus();
      sendBtn.disabled = true;

      try {
        var response = await fetch(API_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            message: message,
            history: historyCopy,
            sessionId: sessionId,
            pageUrl: window.location.href
          })
        });

        var data = null;
        try {
          data = await response.json();
        } catch (parseError) {
          data = null;
        }

        if (data && typeof data.sessionId === 'string' && data.sessionId.trim()) {
          sessionId = data.sessionId.trim();
          try {
            localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
          } catch (storageError) {
            // no-op
          }
        }

        var reply = data && typeof data.reply === 'string' && data.reply.trim()
          ? data.reply
          : '';

        var ctas = data && Array.isArray(data.ctas) ? data.ctas : [];

        if (!response.ok) {
          addMessage(
            messagesEl,
            avatarUrl,
            'bot',
            reply || 'Sprocket had a gear slip. Try again in a moment.'
          );
          return;
        }

        addMessage(
          messagesEl,
          avatarUrl,
          'bot',
          reply || 'I received your message but did not get a usable reply yet.',
          ctas
        );
      } catch (error) {
        addMessage(
          messagesEl,
          avatarUrl,
          'bot',
          'I could not reach the server just now. Please try again in a moment.'
        );
      } finally {
        sendBtn.disabled = false;
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', buildWidget, { once: true });
  } else {
    buildWidget();
  }
})();
