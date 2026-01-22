# First - Brand Identity Guide

## Brand Overview

**First** is an enterprise risk intelligence platform that transforms security chaos into actionable insights. The brand represents innovation, trust, and leadership in the cybersecurity space.

---

## Logo

### Logo Concept
The First logo features a modern hexagonal shape with an integrated "F" lettermark, symbolizing:
- **Hexagon**: Structure, security, and interconnectedness
- **Gradient**: Innovation and forward-thinking approach
- **Letter "F"**: Bold, confident, and memorable
- **Accent Line**: Precision and attention to detail

### Logo Variants

#### 1. Full Logo (with text)
- **Use**: Primary usage for marketing materials, website header, presentations
- **Components**: Icon + "First" text + "Risk Intelligence" tagline
- **Sizes**: Small, Medium, Large, XLarge

#### 2. Icon Only
- **Use**: Favicon, app icons, social media avatars, compact spaces
- **Components**: Hexagon with "F" lettermark only

#### 3. With Text (no tagline)
- **Use**: Navigation bars, compact headers
- **Components**: Icon + "First" text

### Logo Usage

```jsx
// Full logo with tagline
<Logo size="large" variant="full" />

// Logo with text only
<Logo size="medium" variant="with-text" />

// Icon only
<Logo size="small" variant="icon" />
```

### Logo Specifications

**Icon Dimensions**: 100x100px viewBox
**Hexagon Points**: 50,5 90,27.5 90,72.5 50,95 10,72.5 10,27.5
**Letter "F" Path**: Custom designed for optimal balance

### Clear Space
Maintain a minimum clear space around the logo equal to the height of the hexagon icon.

### Don'ts
- ❌ Don't stretch or distort the logo
- ❌ Don't change the colors outside the approved palette
- ❌ Don't add effects (shadows, outlines) unless specified
- ❌ Don't place on busy backgrounds without proper contrast
- ❌ Don't recreate or modify the logo design

---

## Color Palette

### Primary Colors (ServiceNow Inspired)

#### Primary Green
- **Hex**: `#81B5A1`
- **RGB**: 129, 181, 161
- **Use**: Primary buttons, CTAs, highlights, success states
- **Represents**: Growth, trust, innovation

#### Primary Dark
- **Hex**: `#044E54`
- **RGB**: 4, 78, 84
- **Use**: Headers, text, dark backgrounds, hover states
- **Represents**: Stability, professionalism, depth

#### Primary Teal
- **Hex**: `#62D0CA`
- **RGB**: 98, 208, 202
- **Use**: Accents, gradients, highlights
- **Represents**: Clarity, freshness, technology

#### Primary Navy
- **Hex**: `#1C3F53`
- **RGB**: 28, 63, 83
- **Use**: Secondary backgrounds, text, borders
- **Represents**: Authority, security, confidence

### Secondary Colors

#### Secondary Blue
- **Hex**: `#0F6CBD`
- **Use**: Info states, links, interactive elements

#### Secondary Purple
- **Hex**: `#6B4FBB`
- **Use**: Premium features, special highlights

#### Secondary Orange
- **Hex**: `#FF6F47`
- **Use**: Warnings, important alerts

#### Secondary Yellow
- **Hex**: `#FFB81C`
- **Use**: Caution, pending states

### Neutral Colors

#### Grays
- **Gray 100**: `#F4F5F7` - Lightest backgrounds
- **Gray 200**: `#E8EBED` - Borders, dividers
- **Gray 300**: `#D5D9DD` - Disabled states
- **Gray 400**: `#B8BFC6` - Placeholder text
- **Gray 500**: `#8B95A0` - Secondary text
- **Gray 600**: `#6B7785` - Body text
- **Gray 700**: `#4A5564` - Headings
- **Gray 800**: `#2E3842` - Dark text
- **Gray 900**: `#1C2126` - Darkest text

#### White & Black
- **White**: `#FFFFFF`
- **Black**: `#000000`

### Semantic Colors

#### Success
- **Hex**: `#2CA01C`
- **Use**: Success messages, completed states

#### Warning
- **Hex**: `#FFB81C`
- **Use**: Warning messages, caution states

#### Error
- **Hex**: `#E74C3C`
- **Use**: Error messages, critical alerts

#### Info
- **Hex**: `#0F6CBD`
- **Use**: Informational messages, tips

### Gradients

#### Primary Gradient
```css
background: linear-gradient(135deg, #81B5A1 0%, #044E54 100%);
```
**Use**: Buttons, cards, feature highlights

#### Teal Gradient
```css
background: linear-gradient(135deg, #62D0CA 0%, #1C3F53 100%);
```
**Use**: Secondary elements, backgrounds

#### Hero Gradient
```css
background: linear-gradient(135deg, #044E54 0%, #1C3F53 50%, #81B5A1 100%);
```
**Use**: Hero sections, large backgrounds

---

## Typography

### Primary Font: Inter

**Family**: Inter
**Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semi-Bold), 700 (Bold), 800 (Extra-Bold)
**Source**: Google Fonts

```html
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

### Font Sizes

- **Display**: 3rem (48px) - Hero headlines
- **H1**: 2.5rem (40px) - Page titles
- **H2**: 2rem (32px) - Section headers
- **H3**: 1.5rem (24px) - Subsection headers
- **H4**: 1.25rem (20px) - Card titles
- **Body Large**: 1.125rem (18px) - Lead paragraphs
- **Body**: 1rem (16px) - Default text
- **Small**: 0.875rem (14px) - Captions, labels
- **XSmall**: 0.75rem (12px) - Fine print

### Font Weights Usage

- **800 (Extra-Bold)**: Logo text, major headlines
- **700 (Bold)**: Headers, emphasis
- **600 (Semi-Bold)**: Subheaders, buttons
- **500 (Medium)**: Navigation, labels
- **400 (Regular)**: Body text
- **300 (Light)**: Subtle text, quotes

### Line Height

- **Headings**: 1.2
- **Body Text**: 1.6
- **Compact**: 1.4

### Letter Spacing

- **Headings**: -0.5px to -1px (tighter)
- **Body**: 0 (default)
- **Uppercase Labels**: 0.5px to 1px (wider)

---

## UI Components

### Buttons

#### Primary Button
```css
background: #81B5A1;
color: #FFFFFF;
border-radius: 8px;
padding: 12px 32px;
font-weight: 600;
box-shadow: 0 4px 12px rgba(129, 181, 161, 0.3);
```

**Hover State**:
```css
background: #044E54;
transform: translateY(-2px);
box-shadow: 0 10px 25px rgba(129, 181, 161, 0.5);
```

#### Secondary Button
```css
background: #1C3F53;
color: #FFFFFF;
border-radius: 8px;
padding: 12px 32px;
font-weight: 600;
```

#### Outline Button
```css
background: transparent;
color: #81B5A1;
border: 2px solid #81B5A1;
border-radius: 8px;
padding: 12px 32px;
font-weight: 600;
```

### Cards

```css
background: #FFFFFF;
border-radius: 12px;
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
padding: 24px;
transition: all 0.3s ease;
```

**Hover State**:
```css
transform: translateY(-4px);
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
```

### Input Fields

```css
border: 2px solid #E8EBED;
border-radius: 8px;
padding: 12px 16px;
font-size: 1rem;
transition: all 0.3s ease;
```

**Focus State**:
```css
border-color: #81B5A1;
box-shadow: 0 0 0 3px rgba(129, 181, 161, 0.25);
```

---

## Design Principles

### 1. Clean & Modern
- Ample white space
- Clear hierarchy
- Minimal clutter
- Focus on content

### 2. Professional & Trustworthy
- Consistent color usage
- High-quality imagery
- Attention to detail
- Polished interactions

### 3. User-Centric
- Clear navigation
- Intuitive interactions
- Accessible design
- Responsive layouts

### 4. Data-Driven
- Clear visualizations
- Meaningful metrics
- Actionable insights
- Progressive disclosure

---

## Spacing System

### Base Unit: 4px

- **XS**: 4px (0.25rem)
- **SM**: 8px (0.5rem)
- **MD**: 16px (1rem)
- **LG**: 24px (1.5rem)
- **XL**: 32px (2rem)
- **2XL**: 48px (3rem)
- **3XL**: 64px (4rem)

### Grid System
- **Container Max Width**: 1200px
- **Gutter**: 24px
- **Columns**: 12

---

## Border Radius

- **SM**: 4px - Small elements, tags
- **MD**: 8px - Buttons, inputs, cards
- **LG**: 12px - Large cards, modals
- **XL**: 16px - Hero sections
- **Full**: 9999px - Pills, avatars

---

## Shadows

### Elevation Levels

#### Level 1 (Subtle)
```css
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
```

#### Level 2 (Default)
```css
box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
```

#### Level 3 (Elevated)
```css
box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
```

#### Level 4 (Floating)
```css
box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
```

---

## Animations & Transitions

### Timing Functions
- **Fast**: 150ms ease-in-out
- **Base**: 250ms ease-in-out
- **Slow**: 350ms ease-in-out

### Common Transitions
```css
transition: all 0.25s ease-in-out;
```

### Hover Effects
- **Lift**: `transform: translateY(-4px);`
- **Scale**: `transform: scale(1.05);`
- **Glow**: Increase box-shadow opacity

---

## Accessibility

### Color Contrast
- **Text on White**: Minimum AA (4.5:1)
- **Large Text**: Minimum AA (3:1)
- **Interactive Elements**: Clear focus states

### Focus States
```css
outline: 2px solid #81B5A1;
outline-offset: 2px;
```

### Alt Text
- All images must have descriptive alt text
- Decorative images: `alt=""`

---

## Brand Voice

### Tone
- **Professional** yet approachable
- **Confident** but not arrogant
- **Clear** and concise
- **Helpful** and supportive

### Language
- Use active voice
- Avoid jargon when possible
- Be specific and actionable
- Focus on benefits, not just features

### Example Phrases
- ✅ "Transform security chaos into actionable insights"
- ✅ "Discover, prioritize, and remediate vulnerabilities"
- ✅ "Built on the CTEM framework"
- ❌ "Revolutionary paradigm-shifting solution"
- ❌ "Best-in-class enterprise-grade platform"

---

## Usage Examples

### Marketing Materials
- Use full logo with tagline
- Primary gradient backgrounds
- Hero images with overlay
- Clear CTAs with primary button style

### Product Interface
- Logo with text (no tagline) in header
- Neutral backgrounds (#F7F9FA)
- Primary green for actions
- Consistent spacing and typography

### Documentation
- Simple logo (icon + text)
- Clean, readable layouts
- Code blocks with syntax highlighting
- Clear section hierarchy

---

## File Formats

### Logo Files
- **SVG**: Primary format for web
- **PNG**: Transparent background, various sizes
- **PDF**: Print materials

### Color Profiles
- **Web**: sRGB
- **Print**: CMYK conversion available

---

## Contact

For brand guidelines questions or asset requests:
- **Email**: brand@first.com
- **Design Team**: design@first.com

---

**Last Updated**: December 2024
**Version**: 1.0.0
