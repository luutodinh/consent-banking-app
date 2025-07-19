# Banking Consent App - React Native Expo

## Overview

Ứng dụng React Native Expo với Tailwind CSS cho hệ thống banking consent management, bao gồm authentication và consent approval flow cho Third Party Providers (TPP).

## Features

### 🔐 Authentication
- **Login Screen**: Professional banking UI với form validation
- **Secure Input**: Password field với show/hide toggle
- **Real-time Validation**: Client-side validation với error messages
- **Demo Credentials**: admin / password

### 📋 Consent Management
- **TPP Information**: Hiển thị thông tin Third Party Provider
- **Granular Permissions**: Toggle individual permissions
- **Required vs Optional**: Visual indicators cho permissions bắt buộc
- **Security Notices**: Compliance và privacy information
- **Professional UI**: Banking-grade design với trust indicators

### 🎨 UI Components
- **Button**: Multiple variants (primary, secondary, outline, ghost, danger)
- **Input**: Validation, icons, password toggle
- **Logo**: Flexible variants (horizontal, vertical, icon-only)
- **Card**: Different styles (default, elevated, outlined, ghost)
- **Checkbox**: Sizes, variants, disabled states
- **Loading**: Customizable loading indicators

## Tech Stack

- **React Native**: Cross-platform mobile development
- **Expo**: Development platform và tooling
- **TypeScript**: Type safety
- **Tailwind CSS**: Utility-first CSS framework
- **React Hook Form**: Advanced form handling
- **Zod**: Schema validation
- **Expo Router**: File-based routing

## Project Structure

```
app/
  (auth)/
    _layout.tsx          # Auth group layout
    login.tsx           # Login screen
  consent.tsx           # Consent screen (full screen)
  index.tsx            # Auto-redirect to login
  _layout.tsx          # Root layout với navigation

components/
  ui/
    Button.tsx          # Reusable button component
    Input.tsx           # Input với validation
    Logo.tsx            # Flexible logo component
    Card.tsx            # Card container
    Checkbox.tsx        # Checkbox với labels
    Loading.tsx         # Loading indicators
    index.ts            # Export all components
  forms/
    LoginForm.tsx       # Advanced form với react-hook-form
  ErrorBoundary.tsx     # Error handling component

utils/
  cn.ts               # Utility cho className management
  local-storage.ts    # Local storage utilities
```

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm hoặc yarn
- Expo CLI
- iOS Simulator hoặc Android Emulator (optional)

### Installation

1. **Clone và install dependencies:**
   ```bash
   cd consent-banking
   npm install
   ```

2. **Start development server:**
   ```bash
   npm start
   ```

3. **Run on device/simulator:**
   - Press `a` for Android
   - Press `i` for iOS
   - Press `w` for Web
   - Scan QR code với Expo Go app

## Usage

### Login Flow
1. App tự động redirect đến login screen
2. Nhập credentials:
   - Username: `admin`
   - Password: `password`
3. Form validation sẽ hiển thị errors nếu có
4. Sau khi login thành công → redirect đến consent screen

### Consent Flow
1. Xem thông tin TPP (FinTech Solutions Ltd.)
2. Review danh sách permissions:
   - **Required**: Account Info, Balance (không thể uncheck)
   - **Optional**: Transactions, Standing Orders, Direct Debits, Beneficiaries
3. Toggle permissions theo nhu cầu
4. Click "Allow Access" để grant permissions
5. Click "Deny Access" để từ chối

## UI Components Usage

### Button
```tsx
import { Button } from '@/components/ui';

<Button
  title="Sign In"
  variant="primary"
  size="lg"
  isLoading={loading}
  onPress={handlePress}
/>
```

### Input
```tsx
import { Input } from '@/components/ui';

<Input
  label="Username"
  placeholder="Enter username"
  value={value}
  onChangeText={setValue}
  error={error}
  required
  leftIcon={<Icon />}
/>
```

### Checkbox
```tsx
import { Checkbox } from '@/components/ui';

<Checkbox
  checked={checked}
  onPress={toggle}
  label="Permission Title"
  description="Permission description"
  variant="primary"
/>
```

## Styling

### Tailwind CSS
App sử dụng Tailwind CSS cho styling:
- **Responsive**: Mobile-first approach
- **Consistent**: Design system với predefined classes
- **Customizable**: Easy to modify và extend

### Color Scheme
- **Primary**: Blue (#2563eb)
- **Success**: Green (#059669)
- **Warning**: Yellow (#d97706)
- **Danger**: Red (#dc2626)
- **Gray Scale**: Various shades for text và backgrounds

## Accessibility

- **Screen Reader Support**: Proper labels và roles
- **Keyboard Navigation**: Tab order và focus management
- **High Contrast**: WCAG compliant color ratios
- **Touch Targets**: Minimum 44px touch targets
- **Semantic HTML**: Proper heading hierarchy

## Error Handling

- **Error Boundary**: Catches và handles React errors
- **Form Validation**: Real-time validation với user feedback
- **Network Errors**: Proper error messages cho API calls
- **Loading States**: Visual feedback during async operations

## Development

### Adding New Components
1. Tạo component trong `components/ui/`
2. Export trong `components/ui/index.ts`
3. Follow TypeScript conventions
4. Include accessibility props
5. Add Tailwind CSS classes

### Adding New Screens
1. Tạo file trong `app/` directory
2. Follow Expo Router conventions
3. Add proper navigation options
4. Include error handling
5. Test trên multiple screen sizes

## Testing

### Manual Testing
1. **Login Flow**: Test với valid/invalid credentials
2. **Consent Flow**: Test permission toggles
3. **Navigation**: Test screen transitions
4. **Responsive**: Test trên different screen sizes
5. **Accessibility**: Test với screen reader

### Debug Tools
- **Expo DevTools**: Press `j` trong terminal
- **React DevTools**: Available trong development
- **Network Inspector**: Monitor API calls
- **Console Logs**: Check terminal output

## Deployment

### Build for Production
```bash
# iOS
expo build:ios

# Android
expo build:android

# Web
expo build:web
```

### Environment Variables
Tạo `.env` file cho production settings:
```
EXPO_PUBLIC_API_URL=https://api.example.com
EXPO_PUBLIC_APP_ENV=production
```

## Troubleshooting

### Common Issues

1. **Navigation Error**: Ensure Root Layout is properly mounted
2. **Font Loading**: Check font files trong assets/fonts
3. **Tailwind Classes**: Verify global.css import
4. **TypeScript Errors**: Check type definitions
5. **Metro Bundler**: Clear cache với `expo start -c`

### Debug Commands
```bash
# Clear cache
expo start -c

# Reset project
expo install --fix

# Check dependencies
npm audit

# Update Expo SDK
expo upgrade
```

## Contributing

1. Follow TypeScript conventions
2. Use Tailwind CSS cho styling
3. Include accessibility features
4. Add proper error handling
5. Test trên multiple platforms
6. Document new features

## License

MIT License - See LICENSE file for details.

## Support

For issues hoặc questions:
- Check troubleshooting section
- Review Expo documentation
- Check React Native documentation
- Contact development team
