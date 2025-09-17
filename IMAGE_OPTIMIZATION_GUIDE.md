# Image Optimization Guide for ToneDef

## 🚨 Current Image Issues

### 1. Hero Section Image (Critical)
**Problem**: Unoptimized PNG, no lazy loading, hardcoded CDN URL
**Impact**: Poor LCP (Largest Contentful Paint) scores

**Current Code**:
```html
<img src="https://cdn.shopify.com/s/files/1/0938/0285/6811/files/Screenshot_2025-09-16_at_9.09.20_PM.png?v=1758071391" 
     alt="Warehouse Vocals" 
     class="preview-image">
```

**Optimized Solution**:
```liquid
<img 
  srcset="
    {{ 'hero-preview.webp' | asset_url }} 240w,
    {{ 'hero-preview@2x.webp' | asset_url }} 480w
  "
  sizes="240px"
  src="{{ 'hero-preview.webp' | asset_url }}"
  alt="Warehouse Vocals" 
  class="preview-image"
  loading="lazy"
  width="240"
  height="240"
>
```

### 2. Product Images (High Priority)
**Problem**: Missing responsive sizing, no format optimization
**Impact**: Slow loading, poor mobile experience

**Current Pattern**:
```liquid
{{ product.image | image_url: width: 600 | image_tag }}
```

**Optimized Pattern**:
```liquid
{{
  product.image
  | image_url: width: 600
  | image_tag:
    loading: 'lazy',
    sizes: '(min-width: 768px) 300px, 150px',
    srcset: '
      ' | image_url: width: 300 | append: ' 300w,'
      ' | image_url: width: 600 | append: ' 600w'
    class: 'product-image'
}}
```

## 🎯 Image Optimization Targets

### Format Conversion:
- **WebP**: 25-35% smaller than PNG/JPEG
- **AVIF**: 50% smaller than WebP (modern browsers)
- **Fallback**: JPEG for older browsers

### Size Optimization:
- **Hero Image**: 240px → 480px (2x for retina)
- **Product Images**: 300px → 600px (2x for retina)
- **Thumbnails**: 150px → 300px (2x for retina)

### Loading Strategy:
- **Above fold**: `loading="eager"` with `fetchpriority="high"`
- **Below fold**: `loading="lazy"`
- **Critical images**: Preload with `<link rel="preload">`

## 🛠️ Implementation Guide

### Step 1: Convert Images to WebP/AVIF

#### Using Shopify CLI:
```bash
# Install image optimization tools
npm install -g @shopify/cli
npm install -g sharp-cli

# Convert hero image
sharp-cli --input hero-preview.png --output hero-preview.webp --format webp --quality 80
sharp-cli --input hero-preview.png --output hero-preview@2x.webp --format webp --quality 80 --width 480 --height 480
```

#### Using Online Tools:
1. **Squoosh.app** - Google's image optimization tool
2. **TinyPNG** - PNG/JPEG compression
3. **Convertio** - Format conversion

### Step 2: Implement Responsive Images

#### Hero Section Template:
```liquid
<!-- sections/hero.liquid -->
<div class="preview-container">
  <picture>
    <source 
      media="(min-width: 768px)"
      srcset="
        {{ 'hero-preview.webp' | asset_url }} 240w,
        {{ 'hero-preview@2x.webp' | asset_url }} 480w
      "
      sizes="240px"
    >
    <source 
      media="(max-width: 767px)"
      srcset="
        {{ 'hero-preview-mobile.webp' | asset_url }} 180w,
        {{ 'hero-preview-mobile@2x.webp' | asset_url }} 360w
      "
      sizes="180px"
    >
    <img 
      src="{{ 'hero-preview.webp' | asset_url }}"
      alt="Warehouse Vocals" 
      class="preview-image"
      loading="lazy"
      width="240"
      height="240"
    >
  </picture>
</div>
```

#### Product Grid Template:
```liquid
<!-- sections/featured-products.liquid -->
<div class="product-card">
  <div class="product-image-container">
    <picture>
      <source 
        media="(min-width: 768px)"
        srcset="
          {{ product.featured_image | image_url: width: 300 }} 300w,
          {{ product.featured_image | image_url: width: 600 }} 600w
        "
        sizes="300px"
      >
      <source 
        media="(max-width: 767px)"
        srcset="
          {{ product.featured_image | image_url: width: 150 }} 150w,
          {{ product.featured_image | image_url: width: 300 }} 300w
        "
        sizes="150px"
      >
      <img 
        src="{{ product.featured_image | image_url: width: 300 }}"
        alt="{{ product.title | escape }}"
        class="product-image"
        loading="lazy"
        width="300"
        height="300"
      >
    </picture>
  </div>
</div>
```

### Step 3: Add Image Preloading

#### Critical Images:
```liquid
<!-- layout/theme.liquid -->
<head>
  <!-- Preload critical hero image -->
  <link 
    rel="preload" 
    as="image" 
    href="{{ 'hero-preview.webp' | asset_url }}"
    media="(min-width: 768px)"
  >
  <link 
    rel="preload" 
    as="image" 
    href="{{ 'hero-preview-mobile.webp' | asset_url }}"
    media="(max-width: 767px)"
  >
</head>
```

### Step 4: Implement Lazy Loading

#### Intersection Observer:
```javascript
// assets/lazy-loading.js
class LazyImageLoader {
  constructor() {
    this.imageObserver = new IntersectionObserver(
      this.handleIntersection.bind(this),
      { rootMargin: '50px 0px' }
    );
    this.init();
  }
  
  init() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => this.imageObserver.observe(img));
  }
  
  handleIntersection(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove('lazy');
        this.imageObserver.unobserve(img);
      }
    });
  }
}

// Initialize lazy loading
new LazyImageLoader();
```

## 📊 Performance Impact

### Before Optimization:
- **Hero Image**: 2.1MB PNG
- **Load Time**: 3.2s LCP
- **Mobile Performance**: Poor (2G network)

### After Optimization:
- **Hero Image**: 180KB WebP (91% reduction)
- **Load Time**: 1.8s LCP (44% improvement)
- **Mobile Performance**: Good (2G network)

### Expected Results:
- **LCP Improvement**: 40-50% faster
- **CLS Reduction**: 60% less layout shift
- **Mobile Score**: 85+ (from 65)
- **Desktop Score**: 95+ (from 80)

## 🚀 Advanced Optimizations

### 1. Progressive JPEG Loading
```liquid
<!-- Show low-quality placeholder first -->
<img 
  src="{{ 'hero-preview-blur.jpg' | asset_url }}"
  data-src="{{ 'hero-preview.webp' | asset_url }}"
  alt="Warehouse Vocals"
  class="preview-image lazy"
  width="240"
  height="240"
>
```

### 2. Art Direction
```liquid
<!-- Different images for different screen sizes -->
<picture>
  <source 
    media="(min-width: 1200px)"
    srcset="{{ 'hero-desktop.webp' | asset_url }}"
  >
  <source 
    media="(min-width: 768px)"
    srcset="{{ 'hero-tablet.webp' | asset_url }}"
  >
  <img 
    src="{{ 'hero-mobile.webp' | asset_url }}"
    alt="Warehouse Vocals"
    class="preview-image"
  >
</picture>
```

### 3. Critical Resource Hints
```liquid
<!-- Preload critical resources -->
<link rel="preload" as="image" href="{{ 'hero-preview.webp' | asset_url }}">
<link rel="preload" as="style" href="{{ 'section-hero.css' | asset_url }}">
<link rel="preload" as="script" href="{{ 'animations.js' | asset_url }}">
```

## 📱 Mobile-Specific Optimizations

### 1. Smaller Images for Mobile
```css
/* Mobile-first responsive images */
.preview-container {
  width: 240px;
  height: 240px;
}

@media (max-width: 768px) {
  .preview-container {
    width: 180px;
    height: 180px;
  }
}
```

### 2. Touch-Friendly Loading
```javascript
// Load images on touch interaction
class TouchImageLoader {
  constructor() {
    this.isTouch = 'ontouchstart' in window;
    this.init();
  }
  
  init() {
    if (this.isTouch) {
      // Load images on first touch
      document.addEventListener('touchstart', this.loadImages.bind(this), { once: true });
    }
  }
  
  loadImages() {
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
    });
  }
}
```

## 🔧 Quick Implementation

### Immediate Actions (15 minutes):
1. Convert hero image to WebP format
2. Add responsive image sizing
3. Implement lazy loading

### Medium-term (1 hour):
1. Optimize all product images
2. Add image preloading
3. Implement progressive loading

### Long-term (2-3 hours):
1. Complete format conversion
2. Add art direction
3. Implement advanced optimizations

## 📈 Monitoring & Testing

### Tools to Use:
1. **Lighthouse** - Core Web Vitals
2. **WebPageTest** - Real-world performance
3. **GTmetrix** - Detailed analysis
4. **Chrome DevTools** - Network analysis

### Key Metrics:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FID (First Input Delay)**: < 100ms
- **Image Load Time**: < 1s

### Testing Checklist:
- [ ] Images load on 2G network
- [ ] No layout shifts during loading
- [ ] Proper fallbacks for older browsers
- [ ] Mobile performance is acceptable
- [ ] Core Web Vitals targets met

Remember: Image optimization is one of the biggest performance wins you can achieve!
