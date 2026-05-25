import './style.css'

// 1. Fallback do Indicador de Progresso de Scroll para Navegadores Antigos
const setupScrollProgress = () => {
  const progressBar = document.getElementById('scroll-progress');
  if (!progressBar) return;

  // Se o navegador já suportar CSS scroll-driven animations, não precisamos de JS
  if (CSS.supports('animation-timeline', 'scroll()')) {
    return;
  }

  const updateProgressBar = () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (docHeight <= 0) return;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.transform = `scaleX(${scrollPercent / 100})`;
  };

  window.addEventListener('scroll', updateProgressBar, { passive: true });
  window.addEventListener('resize', updateProgressBar);
  updateProgressBar();
};

// 2. Animação ao Rolar a Página (Scroll Reveal)
const setupScrollReveal = () => {
  const animatedElements = document.querySelectorAll('.animate-on-scroll');
  
  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null, // viewport
      rootMargin: '0px 0px -80px 0px', // Aciona um pouco antes do elemento entrar completamente
      threshold: 0.15 // 15% do elemento visível
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('appeared');
          // Uma vez animado, não precisamos mais observar
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    animatedElements.forEach(element => {
      observer.observe(element);
    });
  } else {
    // Fallback caso não haja suporte a IntersectionObserver
    const revealOnScrollFallback = () => {
      animatedElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const viewHeight = Math.max(document.documentElement.clientHeight, window.innerHeight);
        if (rect.top <= viewHeight * 0.85 && rect.bottom >= 0) {
          element.classList.add('appeared');
        }
      });
    };
    
    window.addEventListener('scroll', revealOnScrollFallback, { passive: true });
    revealOnScrollFallback();
  }
};

// 3. Efeito Dinâmico no Header ao Scrollar
const setupHeaderScrollEffect = () => {
  const header = document.getElementById('main-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 20) {
      header.style.padding = '10px 0';
      header.style.backgroundColor = 'rgba(10, 10, 14, 0.85)';
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.padding = '0';
      header.style.backgroundColor = 'var(--glass-bg)';
      header.style.boxShadow = 'var(--glass-shadow)';
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
};

// 4. Efeito de Faíscas Interativas (São João Style)
// Cria faíscas neon que voam de baixo para cima quando o mouse passa no Hero
const setupInteractiveSparks = () => {
  const hero = document.getElementById('hero');
  if (!hero) return;

  const createSpark = (x, y) => {
    const spark = document.createElement('div');
    spark.className = 'interactive-spark';
    
    const size = Math.random() * 4 + 2;
    const destinationX = (Math.random() - 0.5) * 160;
    const destinationY = -(Math.random() * 150 + 100);
    const duration = Math.random() * 1.5 + 0.8;
    
    // Cores quentes de fogueira
    const colors = ['#ff1f2d', '#ff7300', '#ffc400'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    spark.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: ${size}px;
      height: ${size}px;
      background-color: ${randomColor};
      border-radius: 50%;
      pointer-events: none;
      z-index: 5;
      box-shadow: 0 0 10px ${randomColor};
      transform: translate(0, 0);
      opacity: 1;
      transition: transform ${duration}s cubic-bezier(0.25, 1, 0.5, 1), opacity ${duration}s ease-out;
    `;

    hero.appendChild(spark);

    // Forçar reflow para ativar transição
    spark.getBoundingClientRect();

    spark.style.transform = `translate(${destinationX}px, ${destinationY}px)`;
    spark.style.opacity = '0';

    setTimeout(() => {
      spark.remove();
    }, duration * 1000);
  };

  // Gerar faíscas ao mover o mouse no topo da página
  let lastSparkTime = 0;
  hero.addEventListener('mousemove', (e) => {
    const now = Date.now();
    if (now - lastSparkTime < 80) return; // Limitar taxa de geração
    lastSparkTime = now;

    const rect = hero.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    createSpark(x, y);
  });

  // Toque mobile também gera faíscas
  hero.addEventListener('touchmove', (e) => {
    const now = Date.now();
    if (now - lastSparkTime < 100) return;
    lastSparkTime = now;

    if (e.touches.length > 0) {
      const rect = hero.getBoundingClientRect();
      const x = e.touches[0].clientX - rect.left;
      const y = e.touches[0].top - rect.top;
      createSpark(x, y);
    }
  }, { passive: true });
};

// Inicialização de todas as features
document.addEventListener('DOMContentLoaded', () => {
  setupScrollProgress();
  setupScrollReveal();
  setupHeaderScrollEffect();
  setupInteractiveSparks();
});
