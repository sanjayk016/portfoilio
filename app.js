/**
 * Sanjay's Portfolio - Script Core
 */

// --- Project Details Database ---
const projectsData = {
  smartgrid: {
    title: "SmartGrid IoT Dashboard",
    icon: "activity",
    role: "Full-Stack Developer & Firmware Designer",
    timeline: "3 Months (Spring 2024)",
    tech: ["React", "WebSockets", "Chart.js", "ESP32", "C++"],
    goal: "Build a robust telemetry dashboard capable of processing sub-second frequency packets from smart-meters, highlighting power surges and power factor drops instantly.",
    outcome: "Successfully deployed a prototype serving 5 telemetry nodes. Reduced connection dropouts by 28% using persistent WebSocket reconnection loops and custom buffer storage on ESP32.",
    github: "#",
    demo: "#"
  },
  robotics: {
    title: "RTOS Robotics Controller",
    icon: "cpu",
    role: "Firmware Engineer",
    timeline: "4 Months (Winter 2023)",
    tech: ["C / C++", "FreeRTOS", "STM32HAL", "SPI", "PWM"],
    goal: "Achieve low-latency control loops for a 6-Degree-of-Freedom robotic arm, guaranteeing real-time task preemptions and microsecond precision.",
    outcome: "Configured pre-emptive scheduler with isolated tasks for telemetry, safety boundaries, and motor steps. Inverse kinematics solved inside a 5ms interval window.",
    github: "#",
    demo: "#"
  },
  ecommerce: {
    title: "Helix E-Commerce Store",
    icon: "shopping-bag",
    role: "Frontend Engineer",
    timeline: "2 Months (Autumn 2023)",
    tech: ["HTML5", "CSS Grid", "ES6 JS", "Responsive Design"],
    goal: "Craft an image-heavy storefront boasting page speeds under 1.2 seconds, featuring custom animated interactions without external heavy JS libraries.",
    outcome: "Built purely with Vanilla JS and CSS variables. Page speed scored 99/100 on Lighthouse audits due to responsive image sizing and lazy loading layouts.",
    github: "#",
    demo: "#"
  },
  agnode: {
    title: "LoRaWAN Agricultural Node",
    icon: "radio",
    role: "Embedded Systems Developer",
    timeline: "5 Months (Summer 2023)",
    tech: ["C++", "LoRaWAN", "Deep Sleep", "Arduino API"],
    goal: "Design a solar-powered environmental monitor capable of running uninterrupted for 3+ years on a single LiFePO4 battery cell.",
    outcome: "Engineered ultra-low sleep circuits drawing only 15µA in standby. Transmitted hourly telemetry data successfully over a 4.5km range through dense foliage.",
    github: "#",
    demo: "#"
  },
  ide: {
    title: "Web-based IDE Terminal",
    icon: "terminal",
    role: "JavaScript Developer",
    timeline: "2 Months (Spring 2023)",
    tech: ["JavaScript", "HTML5 Canvas", "CSS Animations", "Regex"],
    goal: "Build an interactive, sandboxed terminal sandbox environment simulating command parsing, folder hierarchies, and mock scripting.",
    outcome: "Implemented virtual path parsing and interactive utilities like cat, cd, ls, and touch. Enjoyed 500+ active users in initial beta testing.",
    github: "#",
    demo: "#"
  },
  beacon: {
    title: "ESP32 BLE Beacon Network",
    icon: "home",
    role: "IoT Systems Engineer",
    timeline: "3 Months (Winter 2022)",
    tech: ["ESP32", "Bluetooth LE", "Trilateration", "Algorithms"],
    goal: "Achieve indoor localization within a 1.5-meter precision radius without relying on GPS signals.",
    outcome: "Implemented Kalman filters to smooth raw RSSI telemetry. Successfully computed coordinates of custom BLE tags in real-time.",
    github: "#",
    demo: "#"
  }
};

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
    threshold: 0.25,
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

  // --- Dynamic Stats Counter ---
  const statsElements = document.querySelectorAll('.stat-num');
  let statsTriggered = false;

  const animateStats = () => {
    statsElements.forEach(stat => {
      const target = parseInt(stat.getAttribute('data-target'), 10);
      const duration = 2000; // ms
      const startTime = performance.now();

      const updateCounter = (currentTime) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function for smoother counters
        const easeOutQuad = progress * (2 - progress);
        const currentValue = Math.floor(easeOutQuad * target);
        
        stat.textContent = currentValue;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          stat.textContent = target; // Ensure exact final value
        }
      };

      requestAnimationFrame(updateCounter);
    });
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !statsTriggered) {
        animateStats();
        statsTriggered = true;
      }
    });
  }, { threshold: 0.5 });

  const bioStats = document.querySelector('.bio-stats');
  if (bioStats) {
    statsObserver.observe(bioStats);
  }

  // --- Project Category Filtering ---
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');

      const filterValue = e.currentTarget.getAttribute('data-filter');

      projectCards.forEach(card => {
        const categories = card.getAttribute('data-category').split(' ');
        
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hide');
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

  // --- Project Details Modal Overlay ---
  const modal = document.getElementById('project-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalBody = document.getElementById('modal-body-content');
  const detailButtons = document.querySelectorAll('.btn-detail');

  const openModal = (projectId) => {
    const data = projectsData[projectId];
    if (!data) return;

    // Inject dynamic HTML into modal
    modalBody.innerHTML = `
      <div class="modal-project-icon">
        <i data-lucide="${data.icon}"></i>
      </div>
      
      <h3 class="modal-project-title">${data.title}</h3>
      
      <div class="modal-project-tags">
        ${data.tech.map(t => `<span>${t}</span>`).join('')}
      </div>

      <div class="modal-details-grid">
        <div class="modal-detail-item">
          <h5>Role</h5>
          <p>${data.role}</p>
        </div>
        <div class="modal-detail-item">
          <h5>Timeline</h5>
          <p>${data.timeline}</p>
        </div>
      </div>

      <div class="modal-divider"></div>

      <h4 class="modal-section-title">The Challenge & Goal</h4>
      <p class="modal-desc">${data.goal}</p>

      <h4 class="modal-section-title">Implementation & Outcome</h4>
      <p class="modal-desc">${data.outcome}</p>

      <div class="modal-actions">
        <a href="${data.github}" class="btn btn-primary" target="_blank" rel="noopener noreferrer">
          <i data-lucide="github"></i>
          <span>View Repository</span>
        </a>
        <a href="${data.demo}" class="btn btn-outline" target="_blank" rel="noopener noreferrer">
          <i data-lucide="external-link"></i>
          <span>Live Demo</span>
        </a>
      </div>
    `;

    // Initialize injected Lucide Icons
    if (typeof lucide !== 'undefined') {
      lucide.createIcons();
    }

    // Open Modal
    modal.classList.add('open');
    document.body.style.overflow = 'hidden'; // Stop background scrolling
  };

  const closeModal = () => {
    modal.classList.remove('open');
    document.body.style.overflow = 'auto'; // Restore background scrolling
  };

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const projectId = e.currentTarget.getAttribute('data-project');
      openModal(projectId);
    });
  });

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close modal on background clicks
  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // --- Testimonials Slide Carousel ---
  const slider = document.getElementById('testimonials-slider');
  const slides = document.querySelectorAll('.testimonial-slide');
  const dots = document.querySelectorAll('.slider-dot');
  const prevBtn = document.getElementById('prev-slide-btn');
  const nextBtn = document.getElementById('next-slide-btn');
  
  let currentSlide = 0;
  const totalSlides = slides.length;
  let slideInterval;

  const showSlide = (index) => {
    // Wrap index boundaries
    if (index >= totalSlides) currentSlide = 0;
    else if (index < 0) currentSlide = totalSlides - 1;
    else currentSlide = index;

    // Shift slider container
    if (slider) {
      slider.style.transform = `translateX(-${currentSlide * 50}%)`;
    }

    // Toggle active slide styles
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });

    // Toggle dot highlights
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  };

  const startAutoSlide = () => {
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      showSlide(currentSlide + 1);
    }, 6000);
  };

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      showSlide(currentSlide + 1);
      startAutoSlide();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      showSlide(currentSlide - 1);
      startAutoSlide();
    });
  }

  dots.forEach(dot => {
    dot.addEventListener('click', (e) => {
      const index = parseInt(e.currentTarget.getAttribute('data-index'), 10);
      showSlide(index);
      startAutoSlide();
    });
  });

  // Start slider
  if (totalSlides > 0) {
    startAutoSlide();
  }

  // --- Contact Form Handling ---
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('.btn-submit');
      const submitBtnText = submitBtn.querySelector('span');
      
      submitBtn.disabled = true;
      submitBtnText.textContent = 'Sending...';

      setTimeout(() => {
        contactForm.style.opacity = '0';
        setTimeout(() => {
          contactForm.style.display = 'none';
          formSuccess.style.display = 'flex';
          
          formSuccess.style.opacity = '0';
          formSuccess.style.transform = 'translateY(10px)';
          setTimeout(() => {
            formSuccess.style.opacity = '1';
            formSuccess.style.transform = 'translateY(0)';
            formSuccess.style.transition = 'var(--transition-smooth)';
          }, 50);
        }, 300);
      }, 1200);
    });
  }

  // --- Interactive Particle System (Canvas) ---
  const canvas = document.getElementById('particle-canvas');
  let particleColorSet = [
    'rgba(0, 82, 255, 0.12)', // Default primary blue
    'rgba(0, 240, 255, 0.15)', // Default secondary cyan
    'rgba(255, 255, 255, 0.05)'
  ];

  let connectLineColorNear = 'rgba(0, 240, 255, ';
  let connectLineColorFar = 'rgba(0, 82, 255, ';

  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
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
        if (this.x > canvas.width || this.x < 0) {
          this.directionX = -this.directionX;
        }
        if (this.y > canvas.height || this.y < 0) {
          this.directionY = -this.directionY;
        }

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
      const numberOfParticles = Math.min(Math.floor((canvas.width * canvas.height) / 16000), 75);

      for (let i = 0; i < numberOfParticles; i++) {
        let size = (Math.random() * 3) + 1;
        let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
        let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
        let directionX = (Math.random() * 0.4) - 0.2;
        let directionY = (Math.random() * 0.4) - 0.2;
        
        // Randomly assign one of the active theme colors
        let color = particleColorSet[Math.floor(Math.random() * particleColorSet.length)];

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
              ? `${connectLineColorNear}${opacityValue * 0.18})`
              : `${connectLineColorFar}${opacityValue * 0.06})`;
              
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
      requestAnimationFrame(animate);
    }

    window.addEventListener('resize', () => {
      clearTimeout(window.resizedFinished);
      window.resizedFinished = setTimeout(() => {
        setCanvasSize();
      }, 150);
    });

    setCanvasSize();
    animate();

    // Export function to re-initialize particle colors on theme swap
    window.updateParticleColors = (theme) => {
      if (theme === 'purple') {
        particleColorSet = [
          'rgba(168, 85, 247, 0.15)', // Purple
          'rgba(244, 63, 94, 0.18)',  // Rose
          'rgba(255, 255, 255, 0.05)'
        ];
        connectLineColorNear = 'rgba(244, 63, 94, ';
        connectLineColorFar = 'rgba(168, 85, 247, ';
      } else if (theme === 'emerald') {
        particleColorSet = [
          'rgba(16, 185, 129, 0.15)', // Emerald
          'rgba(6, 182, 212, 0.18)',  // Cyan
          'rgba(255, 255, 255, 0.05)'
        ];
        connectLineColorNear = 'rgba(6, 182, 212, ';
        connectLineColorFar = 'rgba(16, 185, 129, ';
      } else {
        // Default Blue
        particleColorSet = [
          'rgba(0, 82, 255, 0.12)',   // Blue
          'rgba(0, 240, 255, 0.15)',  // Cyan
          'rgba(255, 255, 255, 0.05)'
        ];
        connectLineColorNear = 'rgba(0, 240, 255, ';
        connectLineColorFar = 'rgba(0, 82, 255, ';
      }
      
      // Update color arrays for existing active particles
      particlesArray.forEach(p => {
        p.color = particleColorSet[Math.floor(Math.random() * particleColorSet.length)];
      });
    };
  }

  // --- Dynamic Color Theme Selector ---
  const themeToggle = document.getElementById('theme-toggle-btn');
  const themeSwitcher = document.getElementById('theme-switcher');
  const themeOptions = document.querySelectorAll('.theme-opt');

  if (themeToggle && themeSwitcher) {
    // Open/Close option tray
    themeToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      themeSwitcher.classList.toggle('open');
    });

    // Close option tray when clicking outside
    document.addEventListener('click', () => {
      themeSwitcher.classList.remove('open');
    });

    // Theme selector options clicked
    themeOptions.forEach(opt => {
      opt.addEventListener('click', (e) => {
        e.stopPropagation();
        
        // Remove active state
        themeOptions.forEach(o => o.classList.remove('active'));
        opt.classList.add('active');

        const selectedTheme = opt.getAttribute('data-theme');
        
        // Update document theme attribute
        document.documentElement.setAttribute('data-theme-choice', selectedTheme);
        
        // Update particle canvas styles
        if (window.updateParticleColors) {
          window.updateParticleColors(selectedTheme);
        }

        // Close tray
        themeSwitcher.classList.remove('open');
      });
    });
  }
});
