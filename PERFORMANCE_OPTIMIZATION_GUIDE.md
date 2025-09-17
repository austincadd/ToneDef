# ToneDef Performance Optimization Guide

## 🚨 Critical Performance Issues Found

### 1. Hero Section Animation Problems

**Issue**: CPU-heavy text-shadow animations causing frame drops
**Impact**: Poor 60fps performance, especially on mobile devices

**Current Code** (Problematic):
```css
@keyframes titleGlow {
  0% {
    text-shadow: 
      0 0 15px rgba(255, 255, 255, 0.2),
      0 0 30px rgba(255, 255, 255, 0.1);
  }
  50% {
    text-shadow: 
      0 0 20px rgba(255, 255, 255, 0.3),
      0 0 40px rgba(255, 255, 255, 0.15);
  }
  100% {
    text-shadow: 
      0 0 15px rgba(255, 255, 255, 0.2),
      0 0 30px rgba(255, 255, 255, 0.1);
  }
}
```

**Optimized Solution**:
```css
/* GPU-accelerated glow using transform and opacity */
@keyframes titleGlow {
  0% {
    transform: scale(1);
    opacity: 0.8;
    filter: brightness(1) saturate(1);
  }
  50% {
    transform: scale(1.02);
    opacity: 1;
    filter: brightness(1.1) saturate(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 0.9;
    filter: brightness(1.05) saturate(1.1);
  }
}
```

### 2. Scan Line Animation Optimization

**Issue**: Using `left` property instead of GPU-accelerated `transform`
**Impact**: Layout thrashing and poor performance

**Current Code** (Problematic):
```css
@keyframes scanLine {
  0% {
    left: -100%;
    opacity: 0;
    transform: scaleY(0.8);
  }
  100% {
    left: 100%;
    opacity: 0;
    transform: scaleY(0.8);
  }
}
```

**Optimized Solution**:
```css
@keyframes scanLine {
  0% {
    transform: translateX(-100%) scaleY(0.8);
    opacity: 0;
  }
  100% {
    transform: translateX(100%) scaleY(0.8);
    opacity: 0;
  }
}
```

### 3. Image Optimization Issues

**Issue**: Hero preview image lacks optimization
**Impact**: Poor LCP (Largest Contentful Paint) scores

**Current Code** (Problematic):
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

### 4. Box Shadow Hover Effects

**Issue**: Heavy box-shadow animations on hover
**Impact**: Frame drops during hover interactions

**Current Code** (Problematic):
```css
.preview-container:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow: 
    0 24px 48px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.12),
    0 0 20px rgba(0, 191, 255, 0.1);
}
```

**Optimized Solution**:
```css
.preview-container {
  will-change: transform, opacity;
}

.preview-container:hover {
  transform: translateY(-4px) scale(1.02);
  opacity: 0.95;
  /* Use single box-shadow for better performance */
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.4);
}
```

## 🎯 Performance Targets

### Core Web Vitals Goals:
- **LCP (Largest Contentful Paint)**: < 2.5s
- **CLS (Cumulative Layout Shift)**: < 0.1
- **FID (First Input Delay)**: < 100ms
- **FPS**: Stable 60fps for all animations

### Current Estimated Scores:
- **LCP**: ~3.2s (needs optimization)
- **CLS**: ~0.15 (layout shifts from animations)
- **FID**: ~120ms (heavy animations)
- **FPS**: ~45fps (text-shadow animations)

## 🛠️ Implementation Steps

### Step 1: Optimize Hero Animations
1. Replace text-shadow animations with transform/opacity
2. Use `will-change` for animated elements
3. Add `prefers-reduced-motion` support

### Step 2: Image Optimization
1. Convert images to WebP/AVIF format
2. Implement responsive images with srcset
3. Add proper lazy loading
4. Use Shopify's image optimization API

### Step 3: JavaScript Optimization
1. Bundle GSAP instead of CDN loading
2. Implement code splitting for animations
3. Add performance monitoring

### Step 4: CSS Optimization
1. Remove unused CSS
2. Optimize selectors
3. Use CSS containment where appropriate

## 📊 Performance Monitoring

### Tools to Use:
1. **Lighthouse** - Core Web Vitals
2. **Chrome DevTools** - Performance profiling
3. **WebPageTest** - Real-world performance
4. **GTmetrix** - Detailed analysis

### Key Metrics to Track:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)

## 🚀 Quick Wins

### Immediate Actions (5 minutes):
1. Add `will-change: transform` to animated elements
2. Replace `left` with `transform: translateX()` in animations
3. Add `loading="lazy"` to non-critical images

### Medium-term (30 minutes):
1. Optimize hero section animations
2. Implement responsive images
3. Add performance monitoring

### Long-term (2 hours):
1. Complete image optimization
2. Bundle optimization
3. Advanced performance tuning

## 🔧 Code Examples

### Before (Performance Issues):
```css
.element {
  animation: heavyAnimation 2s infinite;
}

@keyframes heavyAnimation {
  0% { 
    background-position: 0% 50%;
    box-shadow: 0 0 20px rgba(0,0,0,0.5);
  }
  100% { 
    background-position: 100% 50%;
    box-shadow: 0 0 40px rgba(0,0,0,0.8);
  }
}
```

### After (Optimized):
```css
.element {
  will-change: transform, opacity;
  animation: optimizedAnimation 2s infinite;
}

@keyframes optimizedAnimation {
  0% { 
    transform: translateX(0) scale(1);
    opacity: 0.8;
  }
  100% { 
    transform: translateX(100px) scale(1.05);
    opacity: 1;
  }
}
```

## 📱 Mobile Performance

### Mobile-Specific Optimizations:
1. Reduce animation complexity on mobile
2. Use `transform3d()` to force GPU acceleration
3. Implement touch-friendly interactions
4. Optimize for slower devices

### Responsive Animation Strategy:
```css
@media (max-width: 768px) {
  .hero-title {
    animation: none; /* Disable heavy animations on mobile */
  }
  
  .preview-container:hover {
    transform: none; /* Disable hover effects on touch devices */
  }
}
```

Remember: Performance is not just about speed—it's about providing a smooth, responsive experience that keeps users engaged!
