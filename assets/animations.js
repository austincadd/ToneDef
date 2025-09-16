// Def Audio Animations with GSAP and Swup.js
// Professional music production theme animations

// Initialize GSAP and Swup
import { gsap } from "https://cdn.skypack.dev/gsap";
import { ScrollTrigger } from "https://cdn.skypack.dev/gsap/ScrollTrigger";
import Swup from "https://cdn.skypack.dev/swup";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Initialize Swup for page transitions
const swup = new Swup({
  containers: ['#MainContent'],
  cache: true,
  animateHistoryBrowsing: true,
  plugins: [
    // Add any Swup plugins here if needed
  ]
});

// Def Audio Animation Classes
class Def AudioAnimations {
  constructor() {
    this.init();
  }

  init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
    } else {
      this.setupAnimations();
    }
  }

  setupAnimations() {
    this.initHeroAnimations();
    this.initScrollAnimations();
    this.initProductCardAnimations();
    this.initButtonAnimations();
    this.initParallaxEffects();
  }

  // Hero Section Animations
  initHeroAnimations() {
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCTA = document.querySelector('.hero-cta');

    if (heroTitle) {
      gsap.fromTo(heroTitle, 
        { 
          y: 100, 
          opacity: 0,
          scale: 0.8
        },
        { 
          y: 0, 
          opacity: 1,
          scale: 1,
          duration: 1.2,
          ease: "power3.out",
          delay: 0.2
        }
      );
    }

    if (heroSubtitle) {
      gsap.fromTo(heroSubtitle,
        {
          y: 50,
          opacity: 0
        },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          delay: 0.6
        }
      );
    }

    if (heroCTA) {
      gsap.fromTo(heroCTA,
        {
          y: 30,
          opacity: 0,
          scale: 0.9
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
          delay: 1
        }
      );
    }
  }

  // Scroll-triggered Animations
  initScrollAnimations() {
    // Reveal animations for elements with .reveal class
    gsap.utils.toArray('.reveal').forEach((element, index) => {
      gsap.fromTo(element,
        {
          y: 60,
          opacity: 0,
          scale: 0.95
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: element,
            start: "top 80%",
            end: "bottom 20%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });

    // Staggered animations for product cards
    gsap.utils.toArray('.product-card').forEach((card, index) => {
      gsap.fromTo(card,
        {
          y: 80,
          opacity: 0,
          rotationY: 15
        },
        {
          y: 0,
          opacity: 1,
          rotationY: 0,
          duration: 1.2,
          ease: "power3.out",
          delay: index * 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
  }

  // Product Card Hover Animations
  initProductCardAnimations() {
    gsap.utils.toArray('.product-card').forEach(card => {
      const cardInner = card.querySelector('.card__inner') || card;
      
      card.addEventListener('mouseenter', () => {
        gsap.to(cardInner, {
          y: -10,
          scale: 1.02,
          rotationY: 5,
          duration: 0.4,
          ease: "power2.out"
        });
      });

      card.addEventListener('mouseleave', () => {
        gsap.to(cardInner, {
          y: 0,
          scale: 1,
          rotationY: 0,
          duration: 0.4,
          ease: "power2.out"
        });
      });
    });
  }

  // Button Animations
  initButtonAnimations() {
    gsap.utils.toArray('.buy-button, .button').forEach(button => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, {
          scale: 1.05,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      button.addEventListener('mouseleave', () => {
        gsap.to(button, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      });

      button.addEventListener('click', () => {
        gsap.to(button, {
          scale: 0.95,
          duration: 0.1,
          ease: "power2.out",
          yoyo: true,
          repeat: 1
        });
      });
    });
  }

  // Parallax Effects
  initParallaxEffects() {
    gsap.utils.toArray('.parallax').forEach(element => {
      gsap.to(element, {
        yPercent: -50,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: true
        }
      });
    });
  }

  // Audio Player Animations
  initAudioPlayerAnimations() {
    const playButtons = document.querySelectorAll('.audio-play-button');
    
    playButtons.forEach(button => {
      button.addEventListener('click', () => {
        const isPlaying = button.classList.contains('playing');
        
        if (isPlaying) {
          gsap.to(button, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out"
          });
          button.classList.remove('playing');
        } else {
          gsap.to(button, {
            scale: 1.1,
            duration: 0.3,
            ease: "power2.out"
          });
          button.classList.add('playing');
        }
      });
    });
  }

  // Accordion Animations
  initAccordionAnimations() {
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    accordionItems.forEach(item => {
      const trigger = item.querySelector('.accordion-trigger');
      const content = item.querySelector('.accordion-content');
      
      if (trigger && content) {
        trigger.addEventListener('click', () => {
          const isOpen = item.classList.contains('active');
          
          if (isOpen) {
            gsap.to(content, {
              height: 0,
              opacity: 0,
              duration: 0.3,
              ease: "power2.inOut"
            });
            item.classList.remove('active');
          } else {
            gsap.to(content, {
              height: 'auto',
              opacity: 1,
              duration: 0.3,
              ease: "power2.inOut"
            });
            item.classList.add('active');
          }
        });
      }
    });
  }
}

// Initialize animations when page loads
new Def AudioAnimations();

// Re-initialize animations after Swup page transitions
swup.on('contentReplaced', () => {
  new Def AudioAnimations();
});

// Export for use in other scripts
window.Def AudioAnimations = Def AudioAnimations;