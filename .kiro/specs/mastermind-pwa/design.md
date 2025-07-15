# Design Document

## Overview

The Mastermind PWA will be built using SvelteKit for optimal performance and PWA capabilities. The application follows a mobile-first approach with a component-based architecture that separates game logic, UI components, and state management. The design emphasizes touch-friendly interactions, accessibility, and offline functionality.

## Architecture

### Technology Stack
- **Framework**: SvelteKit for SSG/SPA capabilities and built-in PWA support
- **Styling**: CSS with CSS Grid and Flexbox for responsive layouts
- **State Management**: Svelte stores for game state
- **PWA**: SvelteKit adapter with service worker for offline functionality
- **Build Tool**: Vite (included with SvelteKit)

### Application Structure
```
src/
├── lib/
│   ├── components/
│   │   ├── GameBoard.svelte
│   │   ├── GuessRow.svelte
│   │   ├── ColorPicker.svelte
│   │   ├── FeedbackPegs.svelte
│   │   ├── GameControls.svelte
│   │   └── Toast.svelte
│   ├── stores/
│   │   └── gameStore.js
│   ├── utils/
│   │   ├── gameLogic.js
│   │   └── colors.js
│   └── types/
│       └── game.js
├── routes/
│   ├── +layout.svelte
│   ├── +page.svelte
│   └── settings/
│       └── +page.svelte
├── app.html
└── service-worker.js
```

## Components and Interfaces

### Core Components

#### GameBoard.svelte
- **Purpose**: Main game container managing overall game state
- **Props**: None (uses global store)
- **Responsibilities**:
  - Renders guess rows and feedback
  - Manages game flow and win/lose conditions
  - Handles new game initialization

#### GuessRow.svelte
- **Purpose**: Individual row for player guesses
- **Props**: `rowIndex`, `isActive`, `guess`, `feedback`
- **Responsibilities**:
  - Displays 4 color peg slots
  - Handles color selection for active row
  - Shows feedback pegs for completed rows

#### ColorPicker.svelte
- **Purpose**: Touch-friendly color selection interface
- **Props**: `availableColors`, `onColorSelect`
- **Responsibilities**:
  - Displays color palette in grid layout
  - Provides haptic feedback on selection
  - Maintains accessibility standards

#### FeedbackPegs.svelte
- **Purpose**: Displays black/white peg feedback
- **Props**: `feedback` (array of peg types)
- **Responsibilities**:
  - Renders feedback pegs in consistent layout
  - Provides visual distinction between black/white pegs

#### Toast.svelte
- **Purpose**: Displays brief notification messages
- **Props**: `message`, `type`, `duration`
- **Responsibilities**:
  - Shows feedback for user actions
  - Auto-dismisses after specified duration
  - Provides visual styling based on message type (success, error, info)

### State Management

#### Game Store (gameStore.js)
```javascript
{
  secretCode: [Color, Color, Color, Color],
  guesses: Array<Guess>,
  currentGuess: [Color?, Color?, Color?, Color?],
  gameStatus: 'playing' | 'won' | 'lost',
  difficulty: 6 | 7 | 8, // number of available colors
  maxGuesses: 10
}
```

#### Game Logic (gameLogic.js)
- `generateSecretCode(difficulty)`: Creates random 4-color code
- `evaluateGuess(guess, secret)`: Returns feedback array
- `checkWinCondition(guess, secret)`: Boolean win check
- `isValidGuess(guess)`: Validates complete guess

## Data Models

### Color System

#### Color Themes
The game will offer multiple predefined color themes that players can choose from:

1. **Classic** - Traditional Mastermind colors
```javascript
const CLASSIC_THEME = {
  RED: { hex: '#FF4444', name: 'Red', accessible: true },
  BLUE: { hex: '#4444FF', name: 'Blue', accessible: true },
  GREEN: { hex: '#44FF44', name: 'Green', accessible: true },
  YELLOW: { hex: '#FFFF44', name: 'Yellow', accessible: true },
  PURPLE: { hex: '#FF44FF', name: 'Purple', accessible: true },
  ORANGE: { hex: '#FF8844', name: 'Orange', accessible: true },
  BROWN: { hex: '#8B4513', name: 'Brown', accessible: true },
  PINK: { hex: '#FFB6C1', name: 'Pink', accessible: true }
};
```

2. **Rainbow** - Vibrant rainbow colors
```javascript
const RAINBOW_THEME = {
  RED: { hex: '#FF0000', name: 'Red', accessible: true },
  ORANGE: { hex: '#FF7F00', name: 'Orange', accessible: true },
  YELLOW: { hex: '#FFFF00', name: 'Yellow', accessible: true },
  GREEN: { hex: '#00FF00', name: 'Green', accessible: true },
  BLUE: { hex: '#0000FF', name: 'Blue', accessible: true },
  INDIGO: { hex: '#4B0082', name: 'Indigo', accessible: true },
  VIOLET: { hex: '#9400D3', name: 'Violet', accessible: true },
  PINK: { hex: '#FF1493', name: 'Pink', accessible: true }
};
```

3. **Fire & Ice** - Gradient from cool blues to hot reds
```javascript
const FIRE_ICE_THEME = {
  ICE_BLUE: { hex: '#A5F2F3', name: 'Ice Blue', accessible: true },
  LIGHT_BLUE: { hex: '#00BFFF', name: 'Light Blue', accessible: true },
  BLUE: { hex: '#0000FF', name: 'Blue', accessible: true },
  PURPLE: { hex: '#800080', name: 'Purple', accessible: true },
  PINK: { hex: '#FF69B4', name: 'Pink', accessible: true },
  ORANGE: { hex: '#FF7F00', name: 'Orange', accessible: true },
  RED: { hex: '#FF0000', name: 'Red', accessible: true },
  DARK_RED: { hex: '#8B0000', name: 'Dark Red', accessible: true }
};
```

4. **Pastel** - Soft pastel colors
```javascript
const PASTEL_THEME = {
  PASTEL_PINK: { hex: '#FFD1DC', name: 'Pastel Pink', accessible: true },
  PASTEL_ORANGE: { hex: '#FFB347', name: 'Pastel Orange', accessible: true },
  PASTEL_YELLOW: { hex: '#FDFD96', name: 'Pastel Yellow', accessible: true },
  PASTEL_GREEN: { hex: '#77DD77', name: 'Pastel Green', accessible: true },
  PASTEL_BLUE: { hex: '#AEC6CF', name: 'Pastel Blue', accessible: true },
  PASTEL_PURPLE: { hex: '#B39EB5', name: 'Pastel Purple', accessible: true },
  PASTEL_MINT: { hex: '#99FFCC', name: 'Pastel Mint', accessible: true },
  PASTEL_LAVENDER: { hex: '#C8A2C8', name: 'Pastel Lavender', accessible: true }
};
```

5. **Monochrome** - Shades of gray
```javascript
const MONOCHROME_THEME = {
  WHITE: { hex: '#FFFFFF', name: 'White', accessible: true },
  LIGHT_GRAY: { hex: '#D3D3D3', name: 'Light Gray', accessible: true },
  SILVER: { hex: '#C0C0C0', name: 'Silver', accessible: true },
  GRAY: { hex: '#808080', name: 'Gray', accessible: true },
  DIM_GRAY: { hex: '#696969', name: 'Dim Gray', accessible: true },
  DARK_GRAY: { hex: '#404040', name: 'Dark Gray', accessible: true },
  CHARCOAL: { hex: '#2F4F4F', name: 'Charcoal', accessible: true },
  BLACK: { hex: '#000000', name: 'Black', accessible: true }
};
```

6. **Nature** - Colors inspired by nature
```javascript
const NATURE_THEME = {
  LEAF_GREEN: { hex: '#4F7942', name: 'Leaf Green', accessible: true },
  SKY_BLUE: { hex: '#87CEEB', name: 'Sky Blue', accessible: true },
  SANDY_BROWN: { hex: '#F4A460', name: 'Sandy Brown', accessible: true },
  OCEAN_BLUE: { hex: '#1E90FF', name: 'Ocean Blue', accessible: true },
  FOREST_GREEN: { hex: '#228B22', name: 'Forest Green', accessible: true },
  SUNSET_ORANGE: { hex: '#FD5E53', name: 'Sunset Orange', accessible: true },
  MOUNTAIN_PURPLE: { hex: '#9678B6', name: 'Mountain Purple', accessible: true },
  STONE_GRAY: { hex: '#8D8C8C', name: 'Stone Gray', accessible: true }
};
```

The color theme system will be implemented as a configurable option in the settings, with the selected theme persisted in localStorage.
```

### Guess Structure
```javascript
{
  colors: [Color, Color, Color, Color],
  feedback: [
    { type: 'black' | 'white' | 'none', position: number }
  ],
  timestamp: Date
}
```

## User Interface Design

### Mobile-First Layout
- **Viewport**: Optimized for 320px-768px widths
- **Touch Targets**: Minimum 44px tap targets
- **Spacing**: 16px base spacing unit
- **Typography**: System fonts with 16px base size

### Settings Interface
- **Integrated Panel**: Settings accessible via slide-out panel from main game interface
- **Panel Position**: Right side slide-out panel triggered by settings icon in top-right corner
- **Panel Layout**: Compact, button-based interface with each setting option as a distinct button
- **Auto-Save**: Settings are saved immediately upon change
- **Feedback**: Toast notifications appear briefly to confirm changes
- **Reactive UI**: Interface updates immediately to reflect changes
- **Debouncing**: Input changes are debounced to prevent excessive saves
- **Conflict Resolution**: When settings conflict (e.g., color theme change requires new game), changes are applied in logical order
- **Dismissal**: Panel can be dismissed by clicking outside or a close button

### Theme System
- **Light Theme**: Default theme with light background and dark text
- **Dark Theme**: Alternative theme with dark background and light text
- **Theme Detection**: Automatic detection of system preference using `prefers-color-scheme` media query
- **Theme Switching**: Manual override option in settings
- **Theme Persistence**: User preference stored in localStorage
- **CSS Variables**: Theme colors defined as CSS variables for easy switching

### Color Palette
#### Light Theme
- **Background**: #FFFFFF (White)
- **Surface**: #F5F5F5 (Light Gray)
- **Primary**: #4444FF (Blue)
- **Secondary**: #DDDDDD (Light Gray)
- **Text**: #333333 (Dark Gray)
- **Text Light**: #666666 (Medium Gray)
- **Success**: #4CAF50 (Green)
- **Error**: #F44336 (Red)

#### Dark Theme
- **Background**: #121212 (Very Dark Gray)
- **Surface**: #1E1E1E (Dark Gray)
- **Primary**: #6666FF (Light Blue)
- **Secondary**: #444444 (Medium Gray)
- **Text**: #EEEEEE (Off-White)
- **Text Light**: #AAAAAA (Light Gray)
- **Success**: #66BB6A (Light Green)
- **Error**: #EF5350 (Light Red)

### Toast Notifications
- **Position**: Bottom of the screen for easy visibility without disrupting content
- **Duration**: Short (2-3 seconds) for non-critical information
- **Animation**: Fade in/out with slight movement for subtle attention
- **Types**:
  - **Success**: Green background for successful actions
  - **Info**: Blue background for informational messages
  - **Warning**: Yellow/orange background for potential issues
  - **Error**: Red background for errors or failures
- **Stacking**: Multiple notifications stack with the newest at the bottom
- **Dismissal**: Auto-dismiss after duration or manual dismiss with swipe/tap

### Color Accessibility
- High contrast ratios (4.5:1 minimum) in both themes
- Pattern/texture alternatives for color-blind users
- ARIA labels for screen readers
- Focus indicators for keyboard navigation

### Responsive Breakpoints
- Mobile: 320px - 768px
- Tablet: 768px - 1024px
- Desktop: 1024px+

## PWA Implementation

### Service Worker Strategy
- **Cache First**: Static assets (CSS, JS, images)
- **Network First**: Game data and settings
- **Offline Fallback**: Complete offline gameplay

### Manifest Configuration
```json
{
  "name": "Mastermind Game",
  "short_name": "Mastermind",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4444ff",
  "orientation": "portrait-primary"
}
```

### Installation Prompts
- Custom install button when PWA criteria met
- Deferred prompt handling for better UX
- Install success feedback

## Error Handling

### Game Logic Errors
- Invalid guess validation with user feedback
- Graceful handling of corrupted game state
- Automatic game reset on critical errors

### Network Errors
- Offline mode detection and notification
- Graceful degradation of non-essential features
- Cache fallback strategies

### User Input Errors
- Touch event debouncing
- Accidental input prevention
- Clear error messaging

## Testing Strategy

### Unit Testing
- Game logic functions (Jest/Vitest)
- Color evaluation algorithms
- Win/lose condition detection
- State management operations

### Component Testing
- Svelte Testing Library for component behavior
- Touch interaction simulation
- Accessibility compliance testing
- Responsive layout validation

### Integration Testing
- Complete game flow testing
- PWA functionality verification
- Offline mode testing
- Cross-device compatibility

### Performance Testing
- Lighthouse PWA audits
- Touch response time measurement
- Memory usage monitoring
- Bundle size optimization

## Security Considerations

### Client-Side Security
- No sensitive data storage
- Secure random number generation for secret codes
- Input sanitization for settings
- CSP headers for XSS prevention

### PWA Security
- HTTPS requirement enforcement
- Service worker scope limitation
- Cache poisoning prevention
- Secure manifest configuration