# Shared Timer App

A real-time synchronized timer application with controller and viewer modes, perfect for presentations, events, and time-sensitive activities.

## Features

### 🎮 Controller Mode
- **Timer Controls**: Set, start, pause, and reset timer
- **Negative Timing**: Timer continues into overtime with visual indicators
- **Message Broadcasting**: Send messages to all connected viewers
- **Styling Controls**: Customize background color, text color, and font size
- **Flash Mode**: Toggle flashing animation for attention-grabbing effects
- **Share Functionality**: Copy viewer link or scan QR code for easy sharing

### 📺 Viewer Mode
- **Real-time Updates**: See timer changes instantly across all devices
- **Full-screen Display**: Clean, distraction-free timer view
- **Connection Status**: Visual indicator showing connection to controller
- **Message Display**: View broadcasted messages from controller
- **Responsive Design**: Works on desktop, tablet, and mobile devices

### 🔗 Sharing Features
- **Direct Link**: Copy and share the viewer URL
- **QR Code**: Scan QR code to open viewer on mobile devices
- **Real-time Sync**: All viewers see the same timer state simultaneously

### ⏰ Timer Features
- **Overtime Support**: Timer continues into negative time with red indicators
- **Flash Animation**: Toggle flashing effects for overtime or attention
- **Message Management**: Send and unsend messages to viewers
- **Custom Styling**: Full control over visual appearance

## Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Set Controller Password** (optional)
   ```bash
   export CONTROLLER_PASSWORD=your_password
   ```

3. **Start the Application**
   ```bash
   npm run dev
   ```

4. **Access the App**
   - **Controller**: Navigate to `/controller` and authenticate
   - **Viewer**: Navigate to `/viewer` or use the shared link
   - **Dashboard**: Navigate to `/dashboard` for combined view

## Usage

### For Presenters/Controllers
1. Go to the controller page and authenticate
2. Set your desired timer duration (MM:SS format)
3. Use the share section to get the viewer link or QR code
4. Share the link with your audience
5. Control the timer and send messages as needed

### For Viewers
1. Open the shared viewer link
2. Watch the timer in real-time
3. See messages and styling updates from the controller
4. The connection status indicator shows if you're connected

## Technical Details

- **Frontend**: Next.js with React
- **Real-time Communication**: Socket.IO
- **Styling**: Tailwind CSS with custom animations
- **QR Code Generation**: qrcode library
- **Responsive Design**: Mobile-first approach

## Environment Variables

- `CONTROLLER_PASSWORD`: Password for controller authentication (default: 'admin123')
- `PORT`: Server port (default: 3000)

## Features in Detail

### Negative Timing
When the timer reaches zero, it continues into overtime with:
- Red color indicators
- "OVERTIME" label
- Enhanced visual effects
- Optional flashing animation

### Flash Mode
Toggle flashing effects that:
- Change background color during flash
- Add pulsing animations
- Make overtime more prominent
- Can be controlled from the controller

### Message System
- Send messages to all connected viewers
- Unsend messages to clear the display
- Real-time message updates
- Styled message display

### Sharing System
- Direct URL copying with clipboard support
- QR code generation for mobile sharing
- One-click viewer opening
- Connection status indicators

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
