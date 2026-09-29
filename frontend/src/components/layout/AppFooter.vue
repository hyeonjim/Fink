<template>
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-brand">
          <span class="footer-logo">F!NK</span>
          <p class="footer-tagline">AI 기반 스마트 자산관리 플랫폼</p>
        </div>
        <div class="footer-links">
          <a href="#">이용약관</a>
          <a href="#">개인정보처리방침</a>
          <a href="#">고객센터</a>
        </div>
        <p class="footer-copyright">© 2025 F!NK. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background: var(--n-bg-subtle);
  border-top: 1px solid var(--n-border);
  padding: 40px 24px;
  margin-top: auto;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  text-align: center;
}

.footer-brand {
  margin-bottom: 20px;
}

.footer-logo {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--n-text);
  letter-spacing: -0.03em;
}

.footer-tagline {
  color: var(--n-text-muted);
  font-size: 0.8125rem;
  margin-top: 6px;
  letter-spacing: -0.01em;
}

.footer-links {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.footer-links a {
  color: var(--n-text-muted);
  font-size: 0.8125rem;
  transition: color 0.2s ease;
  padding: 3px 0;
}

.footer-links a:hover {
  color: var(--n-text);
}

.footer-copyright {
  color: var(--n-text-muted);
  font-size: 0.75rem;
  letter-spacing: -0.01em;
}

@media (max-width: 768px) {
  .footer {
    padding: 48px 16px 32px;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 20px;
  }
}
</style>
