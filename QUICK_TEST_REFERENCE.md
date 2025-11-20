# Quick Test Reference

Quick commands and examples for running tests.

## 🚀 Quick Commands

### Backend
```bash
cd backend
npm test              # Run all tests with coverage
npm run test:watch    # Watch mode
npm run test:unit     # Unit tests only
npm run test:integration  # Integration tests only
```

### Frontend
```bash
cd frontend
npm test              # Run tests (watch mode)
npm run test:run      # Run once (CI mode)
npm run test:ui       # Open test UI
npm run test:coverage # Generate coverage report
```

## 📝 Common Test Patterns

### Backend - Testing API Endpoint

```javascript
import request from 'supertest';
import app from '../../src/app.js';
import { createTestUser, getAuthToken } from '../helpers/testHelpers.js';

it('should get user profile', async () => {
  const user = await createTestUser();
  const token = getAuthToken(user._id);

  const response = await request(app)
    .get('/api/users/profile')
    .set('Authorization', `Bearer ${token}`)
    .expect(200);

  expect(response.body.success).toBe(true);
});
```

### Frontend - Testing Component

```javascript
import { render, screen } from '@testing-library/react';
import { renderWithProviders } from '../helpers/testHelpers';
import MyComponent from '../../components/MyComponent';

it('should render component', () => {
  renderWithProviders(<MyComponent />);
  expect(screen.getByText('Hello')).toBeInTheDocument();
});
```

### Frontend - Testing User Interaction

```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

it('should handle button click', async () => {
  const user = userEvent.setup();
  render(<MyComponent />);
  
  const button = screen.getByRole('button', { name: /submit/i });
  await user.click(button);
  
  expect(screen.getByText('Submitted')).toBeInTheDocument();
});
```

## 🎯 Test Helpers Quick Reference

### Backend Helpers
```javascript
// Create test data
const user = await createTestUser();
const employer = await createTestEmployer();
const job = await createTestJob();
const application = await createTestApplication();

// Get auth token
const token = getAuthToken(user._id);
```

### Frontend Helpers
```javascript
// Mock data
import { mockUser, mockJob, mockJobs } from '../helpers/testHelpers';

// Render with providers
renderWithProviders(<Component />, { initialAuth: mockUser });
```

## 🔍 Common Assertions

### Backend
```javascript
expect(response.status).toBe(200);
expect(response.body.success).toBe(true);
expect(response.body.data).toHaveProperty('_id');
```

### Frontend
```javascript
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent('Hello');
expect(button).toBeDisabled();
expect(input).toHaveValue('test@example.com');
```

## 🐛 Debugging Tests

### Backend
```javascript
// Log response for debugging
console.log(response.body);

// Check database state
const user = await User.findById(userId);
console.log(user);
```

### Frontend
```javascript
// Debug render output
screen.debug();

// Query by role
screen.getByRole('button', { name: /submit/i });

// Query by text
screen.getByText('Hello');
```

## 📊 Coverage Commands

```bash
# Backend
cd backend && npm test

# Frontend  
cd frontend && npm run test:coverage

# View reports
open backend/coverage/lcov-report/index.html
open frontend/coverage/index.html
```

## ⚡ Tips

1. **Watch Mode**: Use watch mode during development
2. **Test One Thing**: Each test should verify one behavior
3. **Descriptive Names**: Use clear test descriptions
4. **Mock External**: Always mock API calls and external services
5. **Clean State**: Tests should be independent and isolated

