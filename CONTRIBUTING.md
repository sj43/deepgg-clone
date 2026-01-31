# Contributing to DeepGG Clone

Thank you for your interest in contributing to this project! This document provides guidelines and instructions for contributing.

## Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/deepgg-clone.git
   cd deepgg-clone
   ```

2. **Install dependencies**
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

4. **Start development servers**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run dev
   
   # Terminal 2 - Frontend
   cd frontend && npm run dev
   ```

## Project Structure

- `frontend/` - React + TypeScript frontend
- `backend/` - Node.js + Express backend
- `supabase/` - Database migrations
- `docker/` - Docker configurations

## Coding Guidelines

### TypeScript
- Use TypeScript for all new code
- Define proper types/interfaces for data structures
- Avoid using `any` type

### React
- Use functional components with hooks
- Keep components small and focused
- Use React Query for data fetching

### Backend
- Follow REST API conventions
- Add proper error handling
- Document API endpoints

### Git Workflow

1. Create a feature branch from `main`
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit with clear messages
   ```bash
   git commit -m "feat: add champion tier list API endpoint"
   ```

3. Push to your fork and create a Pull Request
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Use conventional commits:
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

## Testing

- Write unit tests for new features
- Ensure all tests pass before submitting PR
- Test manually in browser

## Pull Request Process

1. Update README.md with any new features or changes
2. Update the documentation if needed
3. Ensure code passes linting: `npm run lint`
4. Ensure all tests pass: `npm test`
5. Request review from maintainers

## Code Review

All submissions require code review. We'll review:
- Code quality and style
- Test coverage
- Documentation
- Performance implications

## Questions?

Feel free to open an issue for any questions or concerns!
