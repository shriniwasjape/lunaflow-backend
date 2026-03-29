# LunaFlow Enhanced - Setup Guide

## 🌸 What's New

### ✨ Major Improvements
1. **OTP-based Authentication** - Secure email-based login with Supabase
2. **Cloud Data Storage** - User data synced across devices via Supabase
3. **Fixed AI Flashcards** - Beautiful, properly styled daily plan cards
4. **Hover Animations** - Smooth, delightful interactions throughout the app
5. **Enhanced UI/UX** - Better visual feedback and micro-interactions

### 🎨 Visual Enhancements
- **Shimmer effects** on daily plan cards
- **Floating animations** on background decorations
- **Glow effects** on buttons and interactive elements
- **Smooth transitions** on all state changes
- **Scale animations** on hover for better feedback
- **Gradient text** effects for headings

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install @supabase/supabase-js
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) and create a free account
2. Create a new project
3. Go to Project Settings > API
4. Copy your project URL and anon/public key

### 3. Create Database Schema

1. In your Supabase dashboard, go to SQL Editor
2. Copy the contents of `supabase-schema.sql`
3. Run the SQL to create tables and policies

### 4. Configure Environment Variables

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Fill in your Supabase credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

### 5. Update Package.json

Add the Supabase dependency to your `package.json`:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "lucide-react": "latest"
  }
}
```

### 6. Run the App

```bash
npm run dev
```

## 📧 Email Configuration (Supabase)

### Default Setup (Development)
Supabase provides a default email service for development. OTP codes will be sent from `noreply@mail.app.supabase.io`.

### Production Setup (Recommended)
For production, configure a custom SMTP provider:

1. Go to Authentication > Settings > SMTP Settings in Supabase dashboard
2. Configure your SMTP provider (SendGrid, Mailgun, AWS SES, etc.)
3. Customize email templates in Authentication > Email Templates

Example SMTP settings (using SendGrid):
- Host: `smtp.sendgrid.net`
- Port: `587`
- Username: `apikey`
- Password: `your_sendgrid_api_key`

## 🔐 Authentication Flow

### How It Works
1. User enters their email address
2. Supabase sends a 6-digit OTP code to their email
3. User enters the code
4. Upon verification, user is authenticated
5. Session is maintained securely

### Benefits
- **No passwords** - Simpler, more secure
- **Email verification** - Ensures valid email addresses
- **Session management** - Automatic token refresh
- **Secure** - Industry-standard JWT tokens

## 🗄️ Database Structure

### Tables Created
1. **user_profiles** - User information and PCOS settings
2. **cycle_history** - Menstrual cycle tracking data
3. **symptoms_log** - Daily symptom logging
4. **chat_history** - AI conversation history (optional)

### Security
- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Automatic cleanup on user deletion (cascade)

## 🎨 New Animations & Effects

### Hover Effects
```css
.hover-scale:hover - Scales to 1.1x
.hover-glow:hover - Adds glow effect
.hover-lift:hover - Lifts with shadow
.action-card:hover - Combined scale + lift
```

### Keyframe Animations
- `pulse` - Breathing effect
- `shimmer-slide` - Shimmer across elements
- `float` - Gentle floating motion
- `slideDown` - Slide in from top
- `slideUp` - Slide in from bottom
- `fadeIn` - Fade in with slight movement

### Daily Plan Cards
- **Background gradient** with shimmer effect
- **Hover state** with lift and border color change
- **Icon badges** with glow effects
- **Smooth transitions** on all properties

## 📱 Features Breakdown

### 1. Authentication (Auth.jsx)
- Email input with validation
- OTP input with auto-submit
- Error handling with user-friendly messages
- Success states with animations
- Resend OTP functionality
- "Change Email" option

### 2. Enhanced Home Tab (HomeTab.jsx)
- Fixed daily plan cards with proper styling
- Hover animations on all interactive elements
- Gradient text effects
- Shimmer effects on cards
- Better loading states
- Improved stat cards

### 3. Data Sync (App.jsx)
- Automatic sync with Supabase
- Offline fallback to localStorage
- Real-time auth state management
- Profile and cycle data persistence

## 🔧 Customization

### Adjust Animation Speed
In the `<style>` tag in App.jsx, modify animation durations:

```css
@keyframes orb0 { ... }  /* Change 10s to your preference */
.nav-tab { transition: all 0.3s ease; }  /* Adjust timing */
```

### Change Color Scheme
Edit `theme.js` to customize colors:

```javascript
export const C = {
  // Modify these values
  rose: '#f43f5e',
  pink: '#ec4899',
  // ... etc
};
```

### Customize Hover Effects
Add your own hover classes in component styles:

```jsx
<div className="my-hover-effect" style={{...}}>
```

## 🐛 Troubleshooting

### OTP Not Received
1. Check spam folder
2. Verify email is correct
3. Check Supabase email rate limits (default: 4 per hour in development)
4. Verify SMTP settings if using custom provider

### Authentication Errors
1. Ensure `.env` variables are set correctly
2. Check browser console for error messages
3. Verify Supabase project is active
4. Check network tab for failed requests

### Animations Not Working
1. Ensure browser supports CSS animations
2. Check for CSS conflicts
3. Verify keyframes are defined
4. Test in different browsers

### Data Not Syncing
1. Check Supabase RLS policies
2. Verify user is authenticated
3. Check browser console for errors
4. Ensure internet connection is active

## 📊 Performance Optimization

### Already Implemented
- **Code splitting** - Components load on demand
- **Lazy loading** - Images and heavy components
- **Memoization** - Prevent unnecessary re-renders
- **Debouncing** - On input fields
- **Efficient queries** - Indexed database queries

### Additional Recommendations
1. Enable gzip compression on server
2. Use CDN for static assets
3. Implement service worker for offline support
4. Add progressive web app (PWA) manifest

## 🔒 Security Best Practices

### Implemented
✅ Row Level Security (RLS) on all tables
✅ JWT-based authentication
✅ HTTPS-only in production
✅ Input validation
✅ XSS protection

### Additional Recommendations
- Enable 2FA for admin accounts
- Regular security audits
- Monitor for suspicious activity
- Keep dependencies updated
- Use Content Security Policy headers

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm run build
vercel --prod
```

### Netlify
```bash
npm run build
netlify deploy --prod
```

### Environment Variables
Don't forget to set environment variables in your deployment platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## 📝 Migration from Old Version

If you have existing users on the old version:

1. **Backup existing localStorage data**
```javascript
const backup = {
  user: localStorage.getItem('lunaflow_user'),
  cycles: localStorage.getItem('lunaflow_cycles')
};
console.log(backup);
```

2. **Users will need to:**
   - Sign up with their email
   - Re-enter their profile information
   - Their old data remains in localStorage as fallback

3. **Optional: Bulk import**
   - Create a migration script to import localStorage data to Supabase
   - Match users by email if available

## 🆘 Support

### Resources
- [Supabase Documentation](https://supabase.com/docs)
- [React Documentation](https://react.dev)
- [Lucide Icons](https://lucide.dev)

### Common Issues
See troubleshooting section above or create an issue on GitHub.

## 🎉 What's Next

Potential future enhancements:
- [ ] Push notifications for period reminders
- [ ] Integration with wearables (Fitbit, Apple Watch)
- [ ] Community features (anonymous forums)
- [ ] Meal planning with recipes
- [ ] Workout library
- [ ] Export data to PDF
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Voice input for symptom logging
- [ ] AI-powered insights dashboard

---

**Made with 💜 for the PCOS community**
