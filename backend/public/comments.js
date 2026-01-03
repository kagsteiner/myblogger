/**
 * Blog Comment System - Embeddable Frontend
 * 
 * Usage: Add this to your HTML page:
 *   <div id="comments" data-api="https://your-server:3003"></div>
 *   <script src="comments.js"></script>
 * 
 * The blog entry ID is automatically derived from the page URL.
 * Expected URL pattern: <number>_title_[en|de].html -> <number>_en or <number>_de
 */

(function() {
  'use strict';

  // Configuration - can be overridden via data-api attribute on the comments div
  const DEFAULT_API_BASE = 'https://srv706843.hstgr.cloud';
  
  function getApiBase() {
    const container = document.getElementById('comments');
    if (container && container.dataset.api) {
      return container.dataset.api;
    }
    return DEFAULT_API_BASE;
  }
  
  const API_BASE = getApiBase();
  
  // Extract blog entry ID from URL
  function getBlogEntryId() {
    const path = window.location.pathname;
    const filename = path.split('/').pop();
    
    // Match pattern: 001_some_title_en.html or 001_some_title_de.html
    const match = filename.match(/^(\d+)_.*_(en|de)\.html$/);
    
    if (match) {
      return `${match[1]}_${match[2]}`;
    }
    
    // Fallback: use the filename without extension
    return filename.replace(/\.html$/, '');
  }

  // Escape HTML to prevent XSS
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Format date for display
  function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Main Comment System Class
  class CommentSystem {
    constructor(container) {
      this.container = container;
      this.blogEntryId = getBlogEntryId();
      this.comments = [];
      this.isFormVisible = false;
      
      this.init();
    }

    init() {
      this.injectStyles();
      this.render();
      this.loadComments();
    }

    injectStyles() {
      // Check if styles already injected
      if (document.getElementById('comment-system-styles')) return;

      const style = document.createElement('style');
      style.id = 'comment-system-styles';
      style.textContent = `
        .cs-container {
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #00ffff30;
        }

        .cs-container * {
          box-sizing: border-box;
        }

        .cs-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .cs-title {
          font-size: 1.25em;
          font-weight: bold;
          margin: 0;
          color: #00ffff;
        }

        .cs-btn {
          display: inline-block;
          padding: 0.5em 1em;
          border: 1px solid #00ffff30;
          background: transparent;
          color: #e0e0e0;
          font-family: inherit;
          font-size: 0.9em;
          cursor: pointer;
          border-radius: 4px;
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }

        .cs-btn:hover {
          background-color: #00ffff;
          color: #0a0f18;
          border-color: #00ffff;
        }

        .cs-btn:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .cs-btn-primary {
          background: #00ffff;
          color: #0a0f18;
          border-color: #00ffff;
          font-weight: bold;
        }

        .cs-btn-primary:hover {
          background: #60cfcf;
          border-color: #60cfcf;
        }

        .cs-form {
          margin-bottom: 2rem;
          padding: 1rem;
          border: 1px solid #00ffff30;
          border-radius: 8px;
          background: #141a2880;
        }

        .cs-form-group {
          margin-bottom: 1rem;
        }

        .cs-form-group label {
          display: block;
          margin-bottom: 0.25rem;
          font-size: 0.85em;
          opacity: 0.8;
        }

        .cs-input {
          width: 100%;
          padding: 0.5em;
          border: 1px solid #00ffff30;
          border-radius: 4px;
          background: #0a0f18;
          color: #e0e0e0;
          font-family: inherit;
          font-size: 1em;
        }

        .cs-input:focus {
          outline: none;
          border-color: #00ffff;
          box-shadow: 0 0 10px #00ffff1a;
        }

        .cs-textarea {
          min-height: 100px;
          resize: vertical;
        }

        .cs-form-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .cs-message {
          padding: 1rem;
          margin-bottom: 1rem;
          border-radius: 4px;
        }

        .cs-message-success {
          background: #00ffff15;
          border: 1px solid #00ffff50;
          color: #00ffff;
        }

        .cs-message-error {
          background: #ff555515;
          border: 1px solid #ff555550;
          color: #ff5555;
        }

        .cs-comment-list {
          display: flex;
          flex-direction: column;
        }

        .cs-comment {
          padding: 1rem 0;
          border-bottom: 1px solid #00ffff20;
        }

        .cs-comment:last-child {
          border-bottom: none;
        }

        .cs-comment-header {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-bottom: 0.5rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .cs-comment-author {
          font-weight: bold;
          color: #00ffff;
        }

        .cs-comment-date {
          font-size: 0.8em;
          opacity: 0.7;
        }

        .cs-comment-text {
          white-space: pre-wrap;
          word-break: break-word;
          line-height: 1.6;
        }

        .cs-no-comments {
          opacity: 0.6;
          font-style: italic;
        }

        .cs-loading {
          opacity: 0.5;
        }

        .cs-hidden {
          display: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    render() {
      this.container.innerHTML = `
        <div class="cs-container">
          <div class="cs-header">
            <h3 class="cs-title">Comments</h3>
            <button class="cs-btn" id="cs-add-btn">Add Comment</button>
          </div>
          
          <div id="cs-form-container" class="cs-hidden">
            <form class="cs-form" id="cs-form">
              <div class="cs-form-group">
                <label for="cs-name">Your Name</label>
                <input type="text" id="cs-name" class="cs-input" maxlength="100" required>
              </div>
              <div class="cs-form-group">
                <label for="cs-text">Your Comment</label>
                <textarea id="cs-text" class="cs-input cs-textarea" maxlength="5000" required></textarea>
              </div>
              <div class="cs-form-actions">
                <button type="submit" class="cs-btn cs-btn-primary" id="cs-submit-btn">Submit</button>
                <button type="button" class="cs-btn" id="cs-cancel-btn">Cancel</button>
              </div>
            </form>
          </div>

          <div id="cs-message-container"></div>

          <div id="cs-comments-container">
            <div class="cs-loading">Loading comments...</div>
          </div>
        </div>
      `;

      this.bindEvents();
    }

    bindEvents() {
      const addBtn = this.container.querySelector('#cs-add-btn');
      const cancelBtn = this.container.querySelector('#cs-cancel-btn');
      const form = this.container.querySelector('#cs-form');

      addBtn.addEventListener('click', () => this.showForm());
      cancelBtn.addEventListener('click', () => this.hideForm());
      form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    showForm() {
      const formContainer = this.container.querySelector('#cs-form-container');
      const addBtn = this.container.querySelector('#cs-add-btn');
      
      formContainer.classList.remove('cs-hidden');
      addBtn.classList.add('cs-hidden');
      this.isFormVisible = true;
      
      // Focus on name input
      this.container.querySelector('#cs-name').focus();
    }

    hideForm() {
      const formContainer = this.container.querySelector('#cs-form-container');
      const addBtn = this.container.querySelector('#cs-add-btn');
      
      formContainer.classList.add('cs-hidden');
      addBtn.classList.remove('cs-hidden');
      this.isFormVisible = false;
      
      // Clear form
      this.container.querySelector('#cs-name').value = '';
      this.container.querySelector('#cs-text').value = '';
    }

    showMessage(text, type) {
      const messageContainer = this.container.querySelector('#cs-message-container');
      messageContainer.innerHTML = `
        <div class="cs-message cs-message-${type}">
          ${escapeHtml(text)}
        </div>
      `;
    }

    clearMessage() {
      const messageContainer = this.container.querySelector('#cs-message-container');
      messageContainer.innerHTML = '';
    }

    async handleSubmit(e) {
      e.preventDefault();
      
      const nameInput = this.container.querySelector('#cs-name');
      const textInput = this.container.querySelector('#cs-text');
      const submitBtn = this.container.querySelector('#cs-submit-btn');
      
      const name = nameInput.value.trim();
      const text = textInput.value.trim();

      if (!name || !text) {
        this.showMessage('Please fill in all fields.', 'error');
        return;
      }

      // Disable form
      submitBtn.disabled = true;
      submitBtn.textContent = 'Submitting...';

      try {
        const response = await fetch(`${API_BASE}/api/comments`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            blogEntryId: this.blogEntryId,
            name: name,
            text: text
          })
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to submit comment');
        }

        // Hide form and show success message
        const formContainer = this.container.querySelector('#cs-form-container');
        const addBtn = this.container.querySelector('#cs-add-btn');
        
        formContainer.classList.add('cs-hidden');
        addBtn.classList.add('cs-hidden');
        
        this.showMessage(
          'Thank you! Your comment will be visible after moderation. This can take up to 7 days.',
          'success'
        );

        // Clear form
        nameInput.value = '';
        textInput.value = '';

      } catch (error) {
        this.showMessage(error.message, 'error');
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit';
      }
    }

    async loadComments() {
      const commentsContainer = this.container.querySelector('#cs-comments-container');

      try {
        const response = await fetch(
          `${API_BASE}/api/comments?blogEntryId=${encodeURIComponent(this.blogEntryId)}`
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to load comments');
        }

        this.comments = data.comments || [];
        this.renderComments();

      } catch (error) {
        commentsContainer.innerHTML = `
          <div class="cs-message cs-message-error">
            Failed to load comments. Please try refreshing the page.
          </div>
        `;
        console.error('Comment system error:', error);
      }
    }

    renderComments() {
      const commentsContainer = this.container.querySelector('#cs-comments-container');

      if (this.comments.length === 0) {
        commentsContainer.innerHTML = `
          <p class="cs-no-comments">No comments so far. Be the first to comment!</p>
        `;
        return;
      }

      commentsContainer.innerHTML = `
        <div class="cs-comment-list">
          ${this.comments.map(comment => `
            <div class="cs-comment">
              <div class="cs-comment-header">
                <span class="cs-comment-author">${escapeHtml(comment.name)}</span>
                <span class="cs-comment-date">${formatDate(comment.createdAt)}</span>
              </div>
              <div class="cs-comment-text">${escapeHtml(comment.text)}</div>
            </div>
          `).join('')}
        </div>
      `;
    }
  }

  // Initialize when DOM is ready
  function init() {
    const container = document.getElementById('comments');
    
    if (!container) {
      console.warn('Comment system: No element with id="comments" found.');
      return;
    }

    new CommentSystem(container);
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

