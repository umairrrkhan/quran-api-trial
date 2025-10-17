# Quran Website Development Guide

## Commands
- **Start**: `npm start` - Runs development server
- **Build**: `npm run build` - Creates production build  
- **Test**: `npm test` - Runs test runner (watch mode)
- **Single Test**: `npm test -- --testNamePattern="testName"` - Run specific test
- **Coverage**: `npm test -- --coverage --watchAll=false` - Generate coverage report

## Code Style & Architecture

### TypeScript & React
- Use functional components with `React.FC` type annotation
- Strict TypeScript enabled - always type props and return values
- Import React at top of every .tsx file
- Use interfaces for component props
- Export components as default, keep named exports for utilities

### File Organization
```
src/
├── components/        # Reusable UI components
│   └── sections/     # Page section components
├── pages/           # Page-level components  
├── hooks/           # Custom React hooks
├── utils/           # Utility functions
└── styles/          # Global styles and CSS
```

### CSS & Styling
- Use CSS Modules pattern: ComponentName.css + ComponentName.tsx
- Global styles in src/styles/globals.css
- CSS custom properties (variables) for theming
- Tailwind-like utility classes for responsive design
- Glassmorphism effects using backdrop-filter

### Animation (Framer Motion)
- Centralize animation variants in hooks/useAnimations.ts
- Use consistent naming: containerVariants, itemVariants, fadeInUp
- Implement smooth transitions and micro-interactions
- Use stagger animations for lists and grids

### Import Conventions
```typescript
// React and libraries first
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Internal imports
import Navigation from './components/Navigation';
import { containerVariants } from '../hooks/useAnimations';
import './ComponentName.css';
```

### Error Handling
- Use try-catch for async operations
- Implement proper error boundaries for major sections
- Log errors appropriately without exposing sensitive data

### Naming Conventions
- Components: PascalCase (HeroSection, Navigation)
- Functions: camelCase (handleClick, toggleMenu)  
- Variables: camelCase (isMenuOpen, scrolled)
- CSS Classes: kebab-case (hero-section, mobile-menu)
- Files: PascalCase for components (HomePage.tsx)

### Performance
- Use React.memo for pure components
- Implement proper dependency arrays in useEffect
- Lazy load heavy components when needed
- Optimize animation performance with shouldComponentConsider

## Development Notes
- Project uses Create React App with TypeScript template
- React Router v7 for navigation
- RTL support for Arabic/Quranic text
- Mobile-first responsive design approach
- Accessibility: use semantic HTML5 elements and ARIA labels