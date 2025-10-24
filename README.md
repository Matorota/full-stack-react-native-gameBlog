# 📱 Skelbimai - Classified Ads Mobile App

A modern React Native classified ads mobile application built with Expo, featuring a beautiful UI, animations, and full CRUD functionality.

## 🌟 Features

### ✅ Required Features (6 points)

1. **📝 Add Listing** - Create new ads with title, description, price, images, and contact info
2. **✏️ Update Listing** - Edit existing listings
3. **🗑️ Delete Listing** - Remove listings with confirmation
4. **📋 Display All Listings** - Browse all available ads
5. **🏷️ Categories & Filtering** - Filter listings by categories (Electronics, Vehicles, etc.)
6. **✨ Animations & Custom UI** - Beautiful animations and modern UX design

### 🎁 Bonus Features

1. **💾 Data Persistence** - AsyncStorage for data persistence (0.5 points)
2. **🔐 Authentication** - Login/Registration system (1.5 points)
3. **💭 Remember Me** - Auto-login functionality (1 point)
4. **🔍 Search & Filter** - Advanced filtering and search capabilities (1 point)

## 🛠️ Tech Stack

- **Frontend**: React Native with Expo
- **Styling**: NativeWind (TailwindCSS for React Native)
- **State Management**: Context API with useReducer
- **Animations**: React Native Reanimated
- **Storage**: AsyncStorage for local persistence
- **Navigation**: Expo Router
- **UI Components**: Custom components with Ionicons

## 🏗️ Architecture

### Context API Structure

```
ListingContext
├── State Management (useReducer)
├── Local Data Persistence (AsyncStorage)
├── CRUD Operations
└── User Authentication
```

### Component Structure

```
components/
├── HomeScreen.tsx          # Main app screen
├── ListingCard.tsx         # Individual listing display
├── ListingDetail.tsx       # Detailed listing view
├── ListingForm.tsx         # Add/Edit listing form
├── SearchBar.tsx           # Search functionality
├── AuthScreen.tsx          # Login/Registration
├── UserMenu.tsx            # User profile & menu
└── FloatingActionButton.tsx # Animated FAB
```

## 🚀 Getting Started

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Start the development server**

   ```bash
   npm start
   ```

3. **Run on your device**
   - Scan the QR code with Expo Go (Android) or Camera app (iOS)
   - OR press `a` to open Android emulator
   - OR press `i` to open iOS simulator
   - OR press `w` to open in web browser

## 📱 App Features Detailed

### 🏠 Home Screen

- **Category filtering** with horizontal scroll
- **Search functionality** with real-time results
- **Animated listing cards** with press effects
- **User status indicator** in header
- **Floating action button** with rotation animation

### 📝 Listing Management

- **Form validation** with error messages
- **Category selection** with visual feedback
- **Contact information** management
- **Price formatting** and validation
- **Edit/Delete** functionality for owners

### 🔐 Authentication System

- **Login/Registration** forms
- **Form validation** with error handling
- **Remember me** functionality
- **User profile** display
- **Automatic login** persistence

### 🎨 UI/UX Features

- **Modern design** following mobile UX principles
- **Smooth animations** using Reanimated
- **Responsive layout** for different screen sizes
- **Loading states** and feedback
- **Error handling** with user-friendly messages

## 📊 Data Structure

### Listing Interface

```typescript
interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  category: Category;
  createdAt: Date;
  updatedAt: Date;
  userId?: string;
}
```

### Categories

- Electronics (Elektronika)
- Vehicles (Transportas)
- Real Estate (Nekilnojamas turtas)
- Clothing (Drabužiai)
- Furniture (Baldai)
- Sports (Sportas)
- Books (Knygos)
- Other (Kita)

## 🎯 UX Design Principles Applied

Following the [8 Rules of Mobile Design](https://uxdesign.cc/8-rules-of-mobile-design-1b8d9936c241):

1. **Thumb-friendly design** - Important actions within thumb reach
2. **Clear navigation** - Intuitive menu and back buttons
3. **Fast loading** - Optimized images and efficient state management
4. **Readable text** - Proper typography and contrast
5. **Touch targets** - Minimum 44px touch targets
6. **Visual hierarchy** - Clear information hierarchy
7. **Consistent patterns** - Uniform UI patterns throughout
8. **Feedback** - Visual feedback for all user actions

## 🔮 Future Enhancements

- **Image upload** functionality
- **Push notifications** for new listings
- **Chat system** between users
- **Map integration** for location-based listings
- **Favorites system** implementation
- **Social sharing** features
- **MongoDB integration** for backend
- **Real-time updates** with WebSockets

## 📄 License

This project is created for educational purposes as part of a mobile application development course.

## 👨‍💻 Development

Built with ❤️ using React Native and modern mobile development practices.
