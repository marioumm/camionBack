# Google OAuth Setup - Configuration Guide

## Overview

This guide walks you through setting up Google OAuth 2.0 credentials in the Google Cloud Console. You'll create OAuth client IDs for web, iOS, and Android applications.

## Prerequisites

- Google account with access to [Google Cloud Console](https://console.cloud.google.com/)
- Admin access to create projects and credentials
- Your application's domain and redirect URIs

## Part 1: Create a Google Cloud Project

### Step 1: Access Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account

### Step 2: Create a New Project

1. Click the project dropdown at the top of the page
2. Click **"New Project"**
3. Enter project details:
   - **Project name**: `Camion OAuth` (or your preferred name)
   - **Organization**: Select if applicable
   - **Location**: Leave as default or select your organization
4. Click **"Create"**
5. Wait for the project to be created (you'll see a notification)
6. Select the newly created project from the dropdown

## Part 2: Configure OAuth Consent Screen

Before creating credentials, you must configure the OAuth consent screen.

### Step 1: Navigate to OAuth Consent Screen

1. In the left sidebar, go to **APIs & Services** → **OAuth consent screen**
2. Or use direct link: [OAuth consent screen](https://console.cloud.google.com/apis/credentials/consent)

### Step 2: Choose User Type

Select the user type based on your needs:

- **Internal**: Only for Google Workspace organization users (recommended for testing)
- **External**: For any Google account user (required for public apps)

For production apps that serve external users, select **External**, then click **Create**.

### Step 3: Configure App Information

Fill in the required fields:

**App information**:
- **App name**: `Camion` (your app name)
- **User support email**: Select your email from dropdown
- **App logo**: Upload your app logo (optional, 120x120 PNG/JPG)

**App domain**:
- **Application home page**: `https://app.your-domain.com`
- **Application privacy policy link**: `https://your-domain.com/privacy`
- **Application terms of service link**: `https://your-domain.com/terms`

**Authorized domains**:
- Add your domains (without http/https):
  - `your-domain.com`
  - `app.your-domain.com`
  - `api.your-domain.com`

**Developer contact information**:
- **Email addresses**: Enter contact email(s)

Click **"Save and Continue"**.

### Step 4: Add Scopes

1. Click **"Add or Remove Scopes"**
2. Select the following scopes:
   - `/.../auth/userinfo.email` - View your email address
   - `/.../auth/userinfo.profile` - View your basic profile info
   - `openid` - Associate you with your personal info on Google
3. Click **"Update"**
4. Click **"Save and Continue"**

### Step 5: Add Test Users (for External apps in testing)

If you selected "External" and your app is in testing mode:

1. Click **"Add Users"**
2. Enter email addresses of users who can test the app
3. Click **"Add"**
4. Click **"Save and Continue"**

### Step 6: Review Summary

Review your configuration and click **"Back to Dashboard"**.

## Part 3: Enable Required APIs

### Step 1: Navigate to API Library

1. Go to **APIs & Services** → **Library**
2. Or use direct link: [API Library](https://console.cloud.google.com/apis/library)

### Step 2: Enable Google+ API (if needed)

1. Search for "Google+ API" or "People API"
2. Click on the API
3. Click **"Enable"**

**Note**: For basic OAuth (email/profile), no additional APIs are required.

## Part 4: Create OAuth Credentials

You need to create **three separate credentials**:
1. Web Application (for backend)
2. iOS (for mobile app)
3. Android (for mobile app)

### 4.1: Create Web Application Credentials

#### Step 1: Navigate to Credentials

1. Go to **APIs & Services** → **Credentials**
2. Or use direct link: [Credentials](https://console.cloud.google.com/apis/credentials)

#### Step 2: Create Credentials

1. Click **"+ Create Credentials"** at the top
2. Select **"OAuth client ID"**

#### Step 3: Configure Web Application

1. **Application type**: Select **"Web application"**

2. **Name**: Enter a descriptive name
   - Example: `Camion Backend OAuth`

3. **Authorized JavaScript origins** (optional for backend):
   - Leave empty if only using server-side flow

4. **Authorized redirect URIs**:
   - Click **"+ Add URI"**
   - Add your callback URL:
     - Production: `https://api.your-domain.com/auth/google/callback`
     - Staging: `https://api-staging.your-domain.com/auth/google/callback`
     - Local testing: `http://localhost:5000/auth/google/callback`
   
   **Important**: 
   - URLs must match exactly (including trailing slashes)
   - Use HTTPS in production
   - Can add multiple redirect URIs for different environments

5. Click **"Create"**

#### Step 4: Save Credentials

A dialog will appear with your credentials:

- **Client ID**: `123456789-abc123def456.apps.googleusercontent.com`
- **Client Secret**: `GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ`

**Important**:
- Click **"Download JSON"** to save the credentials
- Copy **Client ID** and **Client Secret** to your backend `.env` file:
  ```bash
  GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
  GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
  GOOGLE_CALLBACK_URL=https://api.your-domain.com/auth/google/callback
  ```

### 4.2: Create iOS Credentials

#### Step 1: Get iOS Bundle ID

From your iOS project in Xcode:
- Bundle ID format: `com.yourcompany.appname`
- Example: `com.camion.app`

#### Step 2: Create iOS Client

1. Click **"+ Create Credentials"** → **"OAuth client ID"**
2. **Application type**: Select **"iOS"**
3. **Name**: `Camion iOS App`
4. **Bundle ID**: Enter your iOS app's bundle identifier
   - Example: `com.camion.app`
5. Click **"Create"**

#### Step 3: Download Configuration

1. Click **"Download plist"** to get `GoogleService-Info.plist`
2. Add this file to your iOS project in Xcode
3. **Important**: Don't add to version control (add to `.gitignore`)

### 4.3: Create Android Credentials

#### Step 1: Get Android Package Name

From your Android project:
- Package name format: `com.yourcompany.appname`
- Example: `com.camion.app`

#### Step 2: Get SHA-1 Fingerprint

**For Debug Keystore**:

```bash
# macOS/Linux
keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android

# Windows
keytool -list -v -keystore "%USERPROFILE%\.android\debug.keystore" -alias androiddebugkey -storepass android -keypass android
```

**For Production Keystore**:

```bash
keytool -list -v -keystore /path/to/your-release-key.keystore -alias your-key-alias
```

Copy the **SHA-1** fingerprint from the output:
```
SHA1: A1:B2:C3:D4:E5:F6:12:34:56:78:9A:BC:DE:F1:23:45:67:89:AB:CD
```

#### Step 3: Create Android Client

1. Click **"+ Create Credentials"** → **"OAuth client ID"**
2. **Application type**: Select **"Android"**
3. **Name**: `Camion Android App`
4. **Package name**: Enter your Android app's package name
   - Example: `com.camion.app`
5. **SHA-1 certificate fingerprint**: Paste the SHA-1 from above
6. Click **"Create"**

**Important**: Create separate credentials for debug and release builds:
- Debug: Use debug keystore SHA-1
- Release: Use production keystore SHA-1

#### Step 4: Download Configuration

1. Click **"Download JSON"** to get `google-services.json`
2. Place in your Android project's `app/` directory
3. Add to `.gitignore`

## Part 5: Configure Backend Environment

### Update .env File

Add the web credentials to your backend `.env`:

```bash
# Google OAuth Web Credentials
GOOGLE_CLIENT_ID=123456789-abc123def456.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ
GOOGLE_CALLBACK_URL=https://api.your-domain.com/auth/google/callback

# Frontend & Cookie Configuration
FRONTEND_ORIGIN=https://app.your-domain.com
FRONTEND_REDIRECT_URL=https://app.your-domain.com/auth/success
COOKIE_DOMAIN=.your-domain.com
COOKIE_SAMESITE=none
COOKIE_SECURE=true
```

### Environment-Specific Configuration

**Production**:
```bash
GOOGLE_CALLBACK_URL=https://api.your-domain.com/auth/google/callback
FRONTEND_REDIRECT_URL=https://app.your-domain.com/auth/success
COOKIE_SECURE=true
```

**Staging**:
```bash
GOOGLE_CALLBACK_URL=https://api-staging.your-domain.com/auth/google/callback
FRONTEND_REDIRECT_URL=https://app-staging.your-domain.com/auth/success
COOKIE_SECURE=true
```

**Local Development**:
```bash
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
FRONTEND_REDIRECT_URL=http://localhost:3000/auth/success
COOKIE_DOMAIN=localhost
COOKIE_SECURE=false
COOKIE_SAMESITE=lax
```

## Part 6: Verify Configuration

### Test Web OAuth Flow

1. Start your backend server
2. Navigate to: `http://localhost:5000/auth/google`
3. You should be redirected to Google's consent screen
4. After authorizing, you should be redirected back to your callback URL
5. Check that the cookie is set in your browser (DevTools → Application → Cookies)

### Test Mobile OAuth (iOS/Android)

1. Implement Google Sign-In SDK in your mobile app
2. Run the app on a device or emulator
3. Tap "Sign in with Google"
4. Verify that you receive an ID token
5. Send token to backend and verify JWT is returned

## Part 7: Publishing Your App (Production)

### Before Going Live

1. **Verify domain ownership** (required for external apps):
   - Go to [Google Search Console](https://search.google.com/search-console)
   - Add and verify your domain

2. **Complete OAuth consent screen**:
   - Ensure all required fields are filled
   - Add privacy policy and terms of service links
   - Add app logo and description

3. **Submit for verification** (if using sensitive scopes):
   - Go to OAuth consent screen
   - Click "Publish App"
   - Follow verification process if required

### App Verification

Google may require verification if:
- Your app is external (not internal to a Google Workspace)
- You request sensitive or restricted scopes
- You have more than 100 users

**Basic scopes** (email, profile) typically don't require verification.

## Security Best Practices

### 1. Protect Client Secrets

- **Never commit** client secrets to version control
- Use environment variables or secret management services
- Rotate secrets periodically
- Use different credentials for each environment

### 2. Restrict Authorized URIs

- Only add necessary redirect URIs
- Use HTTPS in production
- Don't use wildcards (not supported)

### 3. Monitor Usage

- Set up Google Cloud monitoring
- Enable logging for OAuth events
- Review OAuth consent logs regularly

### 4. Authorized Domains

- Only add domains you control
- Remove test domains before production
- Keep the list minimal

## Troubleshooting

### Error: redirect_uri_mismatch

**Cause**: Redirect URI in request doesn't match configured URIs

**Solution**:
1. Check exact URL in backend code
2. Verify it matches a configured redirect URI (including protocol, domain, port, path)
3. URIs are case-sensitive

### Error: access_denied

**Cause**: User denied permission or app is not verified

**Solution**:
- User must grant permissions
- For external apps, complete verification process
- Check that app is published (not in draft mode)

### Error: invalid_client

**Cause**: Client ID or secret is incorrect

**Solution**:
- Verify `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in `.env`
- Ensure you're using the correct credentials for the environment
- Check for extra spaces or quotes

### Error: org_internal

**Cause**: App is set to "Internal" but user is not in your organization

**Solution**:
- Change app to "External" in OAuth consent screen
- Or add user to your Google Workspace organization

## Credential Management

### Rotating Secrets

To rotate your client secret:

1. Go to **Credentials** page
2. Click on your OAuth client ID
3. Click **"Add Secret"** (allows multiple secrets)
4. Update your backend with new secret
5. Deploy and verify it works
6. Delete old secret

### Multiple Environments

Best practice: Create separate OAuth clients for each environment:
- Production
- Staging
- Development

This allows:
- Independent secret rotation
- Better monitoring and debugging
- Environment isolation

## Additional Resources

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/) - Test OAuth flows
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth App Verification FAQ](https://support.google.com/cloud/answer/9110914)
- [Backend Implementation Guide](./google-oauth-implementation.md)
- [Web Integration Guide](./web-oauth-integration.md)
- [Mobile Integration Guide](./mobile-oauth-integration.md)

## Support

For issues with:
- **Google Cloud Console**: [Google Cloud Support](https://cloud.google.com/support)
- **OAuth Implementation**: See backend implementation docs
- **App Verification**: [Submit verification request](https://support.google.com/code/contact/oauth_app_verification)

## Summary Checklist

- [ ] Google Cloud project created
- [ ] OAuth consent screen configured
- [ ] Web application credentials created
- [ ] iOS credentials created (if applicable)
- [ ] Android credentials created (if applicable)
- [ ] Credentials added to backend `.env`
- [ ] Redirect URIs configured correctly
- [ ] Authorized domains added
- [ ] Configuration files downloaded (`GoogleService-Info.plist`, `google-services.json`)
- [ ] Test OAuth flow works
- [ ] App published (for external users)
- [ ] Domain verified (if required)
