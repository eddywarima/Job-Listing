# Testing Guide

This document provides comprehensive information about testing the Job Listing Platform.

## Table of Contents

- [Overview](#overview)
- [Backend Testing](#backend-testing)
- [Frontend Testing](#frontend-testing)
- [Running Tests](#running-tests)
- [Test Coverage](#test-coverage)
- [Writing New Tests](#writing-new-tests)
- [Best Practices](#best-practices)

## Overview

The project uses different testing frameworks for backend and frontend:

- **Backend**: Jest + Supertest + MongoDB Memory Server
- **Frontend**: Vitest + React Testing Library

## Backend Testing

### Setup

Backend tests use:
- **Jest**: Test runner and assertion library
- **Supertest**: HTTP assertion library for API testing
- **MongoDB Memory Server**: In-memory MongoDB for isolated tests

### Test Structure

```
backend/
├── tests/
│   ├── setup.js              # Test environment setup
│   ├── helpers/
│   │   └── testHelpers.js    # Test utilities and factories
│   ├── unit/                 # Unit tests
│   │   ├── authController.test.js
│   │   ├── jobController.test.js
│   │   ├── userController.test.js
│   │   ├── applicationController.test.js
│   │   └── authMiddleware.test.js
│   └── integration/          # Integration tests
│       └── workflows.test.js
```

### Running Backend Tests

```bash
# Run all tests
cd backend
npm test

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run with coverage
npm test -- --coverage
```

### Test Helpers

The `testHelpers.js` file provides utilities for creating test data:

```javascript
import { createTestUser, createTestEmployer, createTestJob, getAuthToken } from '../helpers/testHelpers';

// Create a test user
const user = await createTestUser();

// Create an employer
const employer = await createTestEmployer();

// Create a job
const job = await createTestJob({ employer: employer._id });

// Get auth token
const token = getAuthToken(user._id);
```

## Frontend Testing

### Setup

Frontend tests use:
- **Vitest**: Fast test runner (Vite-native)
- **React Testing Library**: Component testing utilities
- **jsdom**: DOM environment for testing

### Test Structure

```
frontend/src/
├── tests/
│   ├── setup.js              # Test environment setup
│   ├── helpers/
│   │   └── testHelpers.jsx   # Test utilities and mocks
│   ├── components/           # Component tests
│   │   ├── JobCard.test.jsx
│   │   └── ProtectedRoute.test.jsx
│   ├── pages/                # Page tests
│   │   └── Login.test.jsx
│   └── services/             # Service tests
│       ├── authService.test.js
│       └── jobService.test.js
```

### Running Frontend Tests

```bash
# Run all tests
cd frontend
npm test

# Run tests in watch mode (default)
npm test

# Run tests with UI
npm run test:ui

# Run tests once (CI mode)
npm run test:run

# Run with coverage
npm run test:coverage
```

### Test Helpers

The `testHelpers.jsx` file provides utilities for testing React components:

```javascript
import { renderWithProviders, mockUser, mockJob } from '../helpers/testHelpers';

// Render component with providers
renderWithProviders(<MyComponent />);

// Use mock data
const user = mockUser;
const job = mockJob;
```

## Running Tests

### Run All Tests

```bash
# Backend
cd backend && npm test

# Frontend
cd frontend && npm test

# Both (from root)
npm run test:all  # If configured in root package.json
```

### Watch Mode

Tests run in watch mode by default in development:

```bash
# Backend
npm run test:watch

# Frontend
npm test  # Watch mode is default
```

## Test Coverage

### Backend Coverage

Coverage reports are generated in `backend/coverage/`:

```bash
cd backend
npm test  # Generates coverage automatically
```

View HTML report:
```bash
open backend/coverage/lcov-report/index.html
```

### Frontend Coverage

Coverage reports are generated in `frontend/coverage/`:

```bash
cd frontend
npm run test:coverage
```

View HTML report:
```bash
open frontend/coverage/index.html
```

### Coverage Goals

- **Statements**: > 80%
- **Branches**: > 75%
- **Functions**: > 80%
- **Lines**: > 80%

## Writing New Tests

### Backend Test Example

```javascript
import request from 'supertest';
import app from '../../src/app.js';
import { createTestUser, getAuthToken } from '../helpers/testHelpers.js';

describe('My Controller', () => {
  it('should do something', async () => {
    const user = await createTestUser();
    const token = getAuthToken(user._id);

    const response = await request(app)
      .get('/api/endpoint')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);

    expect(response.body.success).toBe(true);
  });
});
```

### Frontend Test Example

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '../helpers/testHelpers';
import MyComponent from '../../components/MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

## Best Practices

### General

1. **Test Isolation**: Each test should be independent and not rely on other tests
2. **Clear Test Names**: Use descriptive test names that explain what is being tested
3. **Arrange-Act-Assert**: Structure tests with clear sections
4. **Mock External Dependencies**: Mock API calls, file system, etc.
5. **Test Edge Cases**: Include tests for error conditions and boundary cases

### Backend Specific

1. **Use Test Helpers**: Leverage `testHelpers.js` for creating test data
2. **Clean Database**: Tests automatically clean up after each test
3. **Test Authentication**: Always test both authenticated and unauthenticated scenarios
4. **Test Authorization**: Verify role-based access control
5. **Test Error Handling**: Include tests for error responses

### Frontend Specific

1. **Test User Interactions**: Use `@testing-library/user-event` for realistic interactions
2. **Test Accessibility**: Use queries that encourage accessible code
3. **Avoid Testing Implementation**: Test behavior, not implementation details
4. **Mock API Calls**: Use mocks for service layer tests
5. **Test Loading States**: Include tests for loading and error states

### Test Organization

1. **Group Related Tests**: Use `describe` blocks to group related tests
2. **One Assertion Per Test**: Keep tests focused on one behavior
3. **Use Setup/Teardown**: Use `beforeEach` and `afterEach` for common setup
4. **Test Files Co-location**: Keep test files close to source files when possible

## CI/CD Integration

Tests run automatically on:
- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

See `.github/workflows/test.yml` for CI configuration.

## Troubleshooting

### Backend Tests

**Issue**: Tests fail with MongoDB connection errors
- **Solution**: Ensure MongoDB Memory Server is properly configured in `tests/setup.js`

**Issue**: Tests are slow
- **Solution**: Check that database is being cleaned between tests

### Frontend Tests

**Issue**: Tests fail with "window is not defined"
- **Solution**: Ensure `jsdom` environment is configured in `vite.config.js`

**Issue**: Router errors in tests
- **Solution**: Wrap components with `BrowserRouter` or use `MemoryRouter` in tests

## Additional Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [Vitest Documentation](https://vitest.dev/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)



