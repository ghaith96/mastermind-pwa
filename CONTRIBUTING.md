# Contributing to Mastermind PWA

Thank you for considering contributing to Mastermind PWA! This document provides guidelines and instructions for contributing to this project.

## Code of Conduct

By participating in this project, you agree to abide by our Code of Conduct. Please be respectful and considerate of others.

## How Can I Contribute?

### Reporting Bugs

Before submitting a bug report:

1. Check the issue tracker to see if the bug has already been reported.
2. If you're unable to find an open issue addressing the problem, open a new one.

When submitting a bug report, include:

- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior
- Actual behavior
- Screenshots if applicable
- Device/browser information

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

1. Use a clear and descriptive title
2. Provide a detailed description of the suggested enhancement
3. Explain why this enhancement would be useful
4. Include any relevant mockups or examples

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Run tests to ensure they pass
5. Commit your changes (`git commit -m 'Add some amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## Development Setup

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

## Coding Guidelines

### JavaScript/TypeScript

- Use TypeScript for all new code
- Follow the existing code style
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused

### Svelte Components

- One component per file
- Use TypeScript for script sections
- Keep components focused on a single responsibility
- Use props for component configuration
- Document props with JSDoc comments

### CSS

- Use the existing CSS variables for colors, spacing, etc.
- Follow mobile-first approach
- Ensure accessibility (contrast, focus states, etc.)
- Test on multiple screen sizes

## Testing

- Write tests for new features
- Ensure all tests pass before submitting a PR
- Run tests with `npm test`

## Documentation

- Update documentation when adding or changing features
- Use clear and concise language
- Include code examples where appropriate

## Commit Messages

- Use clear and meaningful commit messages
- Start with a verb in the present tense (e.g., "Add", "Fix", "Update")
- Reference issue numbers when applicable

## Review Process

- All PRs will be reviewed by maintainers
- Address any requested changes
- Be responsive to feedback
- Be patient - reviews take time

Thank you for contributing to Mastermind PWA!