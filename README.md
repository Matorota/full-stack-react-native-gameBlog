# GameBlog

## Features

### Required Features (6 points)

1. ** Add Listing** - Create new ads with title, description, price, images, and contact info
2. ** Update Listing** - Edit existing listings
3. ** Delete Listing** - Remove listings with confirmation
4. ** Display All Listings** - Browse all available ads
5. ** Categories & Filtering** - Filter listings by categories (Electronics, Vehicles, etc.)
6. ** Animations & Custom UI** - Beautiful animations and modern UX design

## Architecture

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

## Getting Started

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

## Data Structure

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

## Development

Built with using React Native
