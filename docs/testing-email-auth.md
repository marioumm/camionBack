# Testing Guide: Email-Only Authentication

This document describes the unit and integration tests for the email-only authentication implementation using Twilio SendGrid.

## Test Files

### 1. Unit Tests: `apps/users-service/src/users-service.service.spec.ts`

Comprehensive unit tests for the `UsersService` covering email-only login and verification flows.

#### Test Suites

- **login - Email-Only**
  - `should throw error if email is missing`
    - Validates that login requires an email address.
  - `should throw error if user not found by email`
    - Ensures proper error handling when user doesn't exist.
  - `should generate and send OTP for valid email`
    - Verifies OTP generation (6 digits) and email sending via `EmailService`.
  - `should use fixed OTP for special user email`
    - Tests special user override (env: `SPECIAL_USER_EMAIL`, `FIXED_OTP`).
  - `should not send SMS (commented out path)`
    - Confirms SMS path is not invoked (phone/SMS code is commented).
  - `should generate 6-digit OTP`
    - Validates OTP format and length.

- **verifyOTP - Email-Only**
  - `should throw error if email is missing`
    - Validates that verification requires an email.
  - `should throw error if user not found by email`
    - Ensures proper error handling for non-existent users.
  - `should throw error if OTP code is invalid`
    - Tests OTP mismatch error handling.
  - `should verify OTP and return access token`
    - Confirms successful verification returns JWT token and user data.
  - `should clear OTP code after verification`
    - Verifies that `user.code` is cleared post-verification.
  - `should set isFirstLogin to false on first verification`
    - Tests first-login flag update.
  - `should merge guest cart and wishlist if guestId provided`
    - Validates guest cart/wishlist merge on verification.
  - `should not require phone field for verification`
    - Confirms phone is not required or used in verification.

- **EmailService Integration**
  - `should call EmailService.sendOtp with correct parameters`
    - Verifies email service is called with correct email and OTP.
  - `should handle EmailService errors gracefully`
    - Tests error propagation from SendGrid failures.

### 2. Integration Tests: `apps/users-service/src/users-service.integration.spec.ts`

End-to-end tests simulating complete user flows with all dependencies mocked.

#### Test Suites

- **Complete Login Flow - Email Only**
  - `should complete full login -> OTP email -> verify flow`
    - Full user journey: login → OTP email → verify → token.
  - `should reject login with phone field (email-only enforcement)`
    - Validates that phone field is not used in queries.

- **Error Handling - Email-Only**
  - `should handle missing email in login`
  - `should handle non-existent email`
  - `should handle wrong OTP code`
  - `should handle email service failures`

- **Special User Flow - Email Only**
  - `should use fixed OTP for special user email`
    - Tests special user override with fixed OTP.

- **Guest Merge Flow - Email Only**
  - `should merge guest cart and wishlist on verify with guestId`
    - Validates guest data merge during verification.

- **First Login Flag - Email Only**
  - `should set isFirstLogin to false after first verification`
  - `should not update isFirstLogin if already false`

- **OTP Code Generation - Email Only**
  - `should generate unique OTP codes for multiple logins`
    - Ensures OTP randomness across multiple login attempts.

- **Email Service Integration - Email Only**
  - `should send OTP email with correct format`
    - Validates email service call parameters.
  - `should not call SMS service (phone path commented out)`
    - Confirms SMS is not invoked.

## Running Tests

### Run all tests
```bash
npm run test
```

### Run tests for users service only
```bash
npm run test -- apps/users-service
```

### Run unit tests only
```bash
npm run test -- users-service.service.spec
```

### Run integration tests only
```bash
npm run test -- users-service.integration.spec
```

### Run tests with coverage
```bash
npm run test:cov
```

### Run tests in watch mode (for development)
```bash
npm run test:watch
```

### Run a specific test suite
```bash
npm run test -- --testNamePattern="login - Email-Only"
```

## Test Setup & Mocks

### Mocked Dependencies

- **UserRepository**: Mocked to return test users and track save calls.
- **JwtService**: Returns a fixed token `mock-jwt-token` for testing.
- **EmailService**: Mocked to track `sendOtp` calls without sending real emails.
- **OTPService**: Mocked (SMS path is commented out in service).
- **Microservice Clients**: Mocked to return empty responses for cart/wishlist merge.

### Test User

```typescript
{
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'integration@example.com',
  phone: '+1234567890',
  fullName: 'Integration Test User',
  code: '123456',
  isFirstLogin: true,
  role: UserRole.USER,
}
```

## Key Test Scenarios

### 1. Email-Only Login
- User provides only email (no phone).
- Service looks up user by email only.
- OTP is generated and sent via email.
- Response includes success message with email address.

### 2. Email-Only Verification
- User provides email and OTP code.
- Service verifies code matches `user.code`.
- JWT token is issued.
- OTP code is cleared.
- First login flag is updated if needed.

### 3. Special User Override
- Environment variables: `SPECIAL_USER_EMAIL`, `FIXED_OTP`.
- When special email is used, fixed OTP is set (no email sent).
- Useful for QA/testing.

### 4. Guest Merge
- If `guestId` is provided during verification, guest cart and wishlist are merged.
- Microservice calls are made to cart and wishlist services.

### 5. Error Cases
- Missing email → 400 error.
- Non-existent email → 401 error.
- Wrong OTP → 401 error.
- Email service failure → error propagated.

## Assertions & Expectations

### Common Assertions

```typescript
// Verify email service was called
expect(emailService.sendOtp).toHaveBeenCalledWith(
  'test@example.com',
  expect.stringMatching(/^\d{6}$/),
);

// Verify JWT was issued
expect(jwtService.sign).toHaveBeenCalledWith(
  expect.objectContaining({
    sub: userId,
    email: userEmail,
    role: userRole,
  }),
);

// Verify user was found by email only
expect(userRepository.findOne).toHaveBeenCalledWith({
  where: { email: 'test@example.com' },
});

// Verify OTP was cleared
expect(userRepository.save).toHaveBeenCalledWith(
  expect.objectContaining({ code: '' }),
);
```

## Debugging Tests

### Enable verbose output
```bash
npm run test -- --verbose
```

### Run a single test
```bash
npm run test -- --testNamePattern="should verify OTP and return access token"
```

### Debug in Node Inspector
```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome DevTools.

## CI/CD Integration

These tests are designed to run in CI/CD pipelines:

```yaml
# Example GitHub Actions
- name: Run tests
  run: npm run test -- --coverage --ci

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./coverage/lcov.info
```

## Coverage Goals

- **Statements**: > 90%
- **Branches**: > 85%
- **Functions**: > 90%
- **Lines**: > 90%

Run `npm run test:cov` to check current coverage.

## Future Enhancements

- Add E2E tests with real database (testcontainers).
- Add performance tests for OTP generation and email sending.
- Add tests for concurrent login attempts.
- Add tests for rate limiting (if implemented).
- Add tests for OTP expiry (if implemented).

## Troubleshooting

### Tests fail with "Cannot find module"
- Run `npm install` to ensure all dependencies are installed.
- Check that `@sendgrid/mail` is installed.

### Tests timeout
- Increase Jest timeout: `jest.setTimeout(10000)` in test file.
- Check that mocks are properly configured.

### Mock not being called
- Verify mock is set up before the function is called.
- Use `jest.clearAllMocks()` in `afterEach` to reset mocks between tests.
- Check that the service is using the mocked dependency (check constructor injection).

### Type errors in tests
- Ensure all DTOs and entities are properly imported.
- Use `as any` or `as jest.Mock` for type casting when needed.
- Check that mock return types match expected types.
