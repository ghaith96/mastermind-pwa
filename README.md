# Mastermind PWA

![Mastermind Game](https://img.shields.io/badge/Game-Mastermind-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-brightgreen)
![SvelteKit](https://img.shields.io/badge/SvelteKit-5.0-orange)
![License](https://img.shields.io/badge/License-MIT-green)

A modern, mobile-first implementation of the classic Mastermind board game as a Progressive Web App. Play anywhere, anytime - even offline!

![Mastermind Game Screenshot](https://via.placeholder.com/800x400?text=Mastermind+Game+Screenshot)

## 🎮 Features

- **Progressive Web App**: Install on any device and play offline
- **Mobile-First Design**: Optimized for touch interactions and mobile screens
- **Accessibility**: Color-blind friendly mode with patterns and symbols
- **Customizable Difficulty**: Choose from 6, 7, or 8 colors
- **Responsive Design**: Adapts to any screen size and orientation
- **Game Statistics**: Track your performance over time
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🚀 Tech Stack

- **Framework**: [SvelteKit 2.x](https://kit.svelte.dev/)
- **UI**: [Svelte 5.x](https://svelte.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Testing**: [Vitest](https://vitest.dev/)
- **TypeScript**: For type safety and better developer experience
- **PWA**: Service worker for offline functionality and caching
- **CSS**: Custom CSS with responsive design principles

## 🏗️ Architecture

### Project Structure

```
src/
├── lib/
│   ├── components/       # UI components
│   ├── stores/           # Svelte stores for state management
│   ├── styles/           # Global styles and animations
│   ├── types/            # TypeScript type definitions
│   └── utils/            # Game logic and utility functions
├── routes/               # SvelteKit routes
│   ├── +layout.svelte    # Main layout
│   ├── +page.svelte      # Game page
│   └── settings/         # Settings page
└── app.html              # HTML template
```

### Core Components

- **GameBoard**: Main game container managing overall game state
- **GuessRow**: Individual row for player guesses
- **ColorPicker**: Touch-friendly color selection interface
- **FeedbackPegs**: Displays black/white peg feedback
- **GameControls**: Game control buttons and status display
- **HelpModal**: Instructions and game rules

### State Management

The game uses Svelte stores for state management:

- **gameStore**: Main store for game state
- **gameStatus**: Current game status (playing, won, lost)
- **currentGuess**: Current guess being built
- **secretCode**: The secret code to guess
- **availableColors**: Colors available based on difficulty

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/mastermind-pwa.git
   cd mastermind-pwa
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5173
   ```

### Building for Production

```bash
npm run build
```

The built application will be in the `build` directory.

### Preview Production Build

```bash
npm run preview
```

### Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages using GitHub Actions:

1. Push your changes to the `main` branch
2. GitHub Actions will automatically build and deploy the app
3. Your app will be available at `https://yourusername.github.io/mastermind-pwa`

You can also manually trigger a deployment from the Actions tab in your GitHub repository.

## 🧪 Testing

Run the test suite:

```bash
npm test
```

Run tests in watch mode:

```bash
npm run test:watch
```

## 📱 PWA Features

### Offline Support

The app works fully offline once loaded, using a service worker to cache assets and game state.

### Installation

Users can install the app on their devices:
- **Mobile**: Use "Add to Home Screen" from the browser menu
- **Desktop**: Click the install icon in the address bar

### Updates

The app checks for updates when online and notifies users when a new version is available.

## 🎨 Game Rules

1. The computer generates a secret code of 4 colors.
2. You have 10 attempts to guess the code.
3. After each guess, you receive feedback:
   - Black peg: Correct color in the correct position
   - White peg: Correct color but in the wrong position
4. Use logic and deduction to solve the code before running out of attempts!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PRs

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Original Mastermind board game by Mordecai Meirowitz
- [SvelteKit](https://kit.svelte.dev/) team for the amazing framework
- All contributors and open source projects that made this possible

## 📬 Contact

Project Link: [https://github.com/yourusername/mastermind-pwa](https://github.com/yourusername/mastermind-pwa)

---

Made with ❤️ and Svelte