(function () {
  if (window.__sprocketChatLoaded) {
    return;
  }
  window.__sprocketChatLoaded = true;

  var WIDGET_ID = 'sprocket-chat-widget';
  var STYLE_ID = 'sprocket-chat-style';
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

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, function (char) {
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

    function addMessage(messagesEl, avatarUrl, role, text) {
      var row = document.createElement('div');
      row.className = 'sprocket-row ' + role;

      if (role === 'bot') {
        var avatar = document.createElement('img');
        avatar.className = 'sprocket-avatar';
        avatar.src = avatarUrl;
        avatar.alt = 'Sprocket avatar';
        row.appendChild(avatar);
      }

      var bubble = document.createElement('div');
      bubble.className = 'sprocket-bubble';
      
      // Basic formatting for better readability
      var formatted = escapeHtml(text)
        .replace(/\n/g, '<br />')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Simple list support
        .replace(/^[•\-\*]\s(.*?)$/gm, '• $1');

      bubble.innerHTML = formatted;
      row.appendChild(bubble);

      messagesEl.appendChild(row);
      messagesEl.scrollTop = messagesEl.scrollHeight;

      // Update history (limited to last 10 messages for token efficiency)
      conversationHistory.push({ role: role, text: text });
      if (conversationHistory.length > 10) {
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
        if (!seededInitialMessage) {
          addMessage(
            messagesEl,
            avatarUrl,
            'bot',
            "Hi, I'm Sprocket.\n\nI help dealerships understand how AutoDriveCX stabilizes execution across sales, service, and BDC teams.\n\nAsk me anything about:\n• execution consistency\n• manager coaching loops\n• how the system installs."
          );
          seededInitialMessage = true;
        }
        window.setTimeout(function () {
          input.focus();
        }, 140);
      }

      function closeChat() {
        widget.classList.remove('is-open');
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

        // Capture history BEFORE adding the current message to display
        // Only if we want the AI to see the history up to now. 
        // Actually, the addMessage tool updates the variable, so we can use a copy.
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
              history: historyCopy 
            })
          });
          var data = null;
          try {
            data = await response.json();
          } catch (parseError) {
            data = null;
          }

          var reply = data && typeof data.reply === 'string' && data.reply.trim()
            ? data.reply
            : '';

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
            reply || 'I received your message but did not get a usable reply yet.'
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
