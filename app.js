/**
 * Sanjay's Portfolio - Script Core
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (typeof lucide !== 'undefined') {
    lucide.createIcons();
  }

  // --- Mobile Navbar Menu ---
  const navToggle = document.getElementById('nav-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      // Toggle menu icon between burger and X
      const icon = navToggle.querySelector('i');
      if (icon) {
        const isMenu = icon.getAttribute('data-lucide') === 'menu';
        icon.setAttribute('data-lucide', isMenu ? 'x' : 'menu');
        lucide.createIcons();
      }
    });
  }

  // Close mobile menu when clicking nav links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu && navMenu.classList.contains('open')) {
        navMenu.classList.remove('open');
        const icon = navToggle.querySelector('i');
        if (icon) {
          icon.setAttribute('data-lucide', 'menu');
          lucide.createIcons();
        }
      }
    });
  });

  // --- Scroll Header / Sticky Navbar ---
  const header = document.getElementById('header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --- Active Nav Link Highlights (Scroll Spy) ---
  const sections = document.querySelectorAll('section[id]');
  const scrollSpyOptions = {
    threshold: 0.3,
    rootMargin: '-80px 0px 0px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }, scrollSpyOptions);

  sections.forEach(section => observer.observe(section));

  // --- Project Category Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Set active button style
      filterBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const filterValue = e.currentTarget.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hide');
          // Simple entry transition trigger
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
            card.style.transition = 'var(--transition-smooth)';
          }, 50);
        } else {
          card.classList.add('hide');
        }
      });
    });
  });

  // --- Contact Form Handling ---
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Simulate API submission
      const submitBtn = contactForm.querySelector('.btn-submit');
      const submitBtnText = submitBtn.querySelector('span');
      const originalText = submitBtnText.textContent;
      
      submitBtn.disabled = true;
      submitBtnText.textContent = 'Sending...';

      setTimeout(() => {
        contactForm.style.opacity = '0';
        setTimeout(() => {
          contactForm.style.display = 'none';
          formSuccess.style.display = 'flex';
          
          // Animate success message appearance
          formSuccess.style.opacity = '0';
          formSuccess.style.transform = 'translateY(10px)';
          setTimeout(() => {
            formSuccess.style.opacity = '1';
            formSuccess.style.transform = 'translateY(0)';
            formSuccess.style.transition = 'var(--transition-smooth)';
          }, 50);
        }, 300);
      }, 1500);
    });
  }

  // --- Interactive Interactive Particle System (Canvas) ---
  const canvas = document.getElementById('particle-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    let animationId;
    
    const mouse = {
      x: null,
      y: null,
      radius: 130
    };

    window.addEventListener('mousemove', (e) => {
      mouse.x = e.x;
      mouse.y = e.y;
    });

    window.addEventListener('mouseleave', () => {
      mouse.x = null;
      mouse.y = null;
    });

    function setCanvasSize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    }

    class Particle {
      constructor(x, y, directionX, directionY, size, color) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
      }

      update() {
        // Wrap around boundaries
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

        // Particle repulsion from mouse
        if (mouse.x !== null && mouse.y !== null) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius + this.size) {
            if (mouse.x < this.x && this.x < canvas.width - this.size * 10) {
              this.x += 1.5;
            }
            if (mouse.x > this.x && this.x > this.size * 10) {
              this.x -= 1.5;
            }
            if (mouse.y < this.y && this.y < canvas.height - this.size * 10) {
              this.y += 1.5;
            }
            if (mouse.y > this.y && this.y > this.size * 10) {
              this.y -= 1.5;
            }
          }
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw();
      }
    }

    function initParticles() {
      particlesArray = [];
      // Dynamic density based on canvas size
      const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 16000), 75);
      
      const particleColors = [
        'rgba(0, 82, 255, 0.12)', // primary blue
        'rgba(0, 240, 255, 0.15)', // secondary cyan
        'rgba(255, 255, 255, 0.05)' // low-glow white
      ];

      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        let color = particleColors[Math.floor(Math.random() * particleColors.length)];

        particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
      }
    }

    function connectParticles() {
      let opacityValue = 1;
      const maxDistance = 150;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < maxDistance) {
            opacityValue = 1 - (distance / maxDistance);
            
            // Highlight connections closer to the mouse
            let isNearMouse = false;
            if (mouse.x !== null && mouse.y !== null) {
              let mAx = mouse.x - particlesArray[a].x;
              let mAy = mouse.y - particlesArray[a].y;
              let distA = Math.sqrt(mAx * mAx + mAy * mAy);
              if (distA < mouse.radius) {
                isNearMouse = true;
              }
            }

            ctx.strokeStyle = isNearMouse 
              ? `rgba(0, 240, 255, ${opacityValue * 0.18})` // Cyan-tint link near mouse
              : `rgba(0, 82, 255, ${opacityValue * 0.06})`; // Blue-tint link otherwise
              
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
      }
      connectParticles();
      animationId = requestAnimationFrame(animate);
    }

    // Set canvas sizes and hook listeners
    window.addEventListener('resize', () => {
      // Debounce resize events
      clearTimeout(window.resizedFinished);
      window.resizedFinished = setTimeout(() => {
        setCanvasSize();
      }, 150);
    });

    setCanvasSize();
    animate();
  }
});
