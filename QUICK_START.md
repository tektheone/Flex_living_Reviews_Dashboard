# Quick Start Guide - Flex Living Reviews Dashboard

## 🚀 Get Started in 3 Steps

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Start the Server
```bash
npm run dev
```

### Step 3: Open Your Browser
- **Home Page**: http://localhost:3000
- **Manager Dashboard**: http://localhost:3000/dashboard
- **Property Examples**:
  - http://localhost:3000/property/1 (Shoreditch Heights)
  - http://localhost:3000/property/2 (Canary Wharf Tower)
  - http://localhost:3000/property/3 (Westminster Gardens)
  - http://localhost:3000/property/4 (Mayfair Residence)

## 📝 What to Test

### Manager Dashboard Features
1. **Overview Cards** - See total reviews, average rating, and selected count
2. **Property Cards** - Click to view individual property performance
3. **Filter Reviews**:
   - Select a property from dropdown
   - Set minimum rating (9+, 8+, etc.)
   - Filter by channel (Airbnb, Booking.com)
   - Search for specific guests or keywords
   - Sort by date or rating
4. **Toggle Visibility** - Click "Show on Website" / "Hide on Website" buttons
5. **See Updates** - Visit property pages to see only selected reviews

### Property Page Features
1. **Image Gallery** - Click smaller images to change main view
2. **Property Details** - See bedrooms, bathrooms, amenities
3. **Reviews Section** - Only approved reviews are shown
4. **Category Ratings** - See breakdown by cleanliness, communication, etc.
5. **Guest Privacy** - Names are anonymized (e.g., "Sarah J.")

## 🔍 Test the API

### Get All Reviews (Normalized)
```bash
curl http://localhost:3000/api/reviews/hostaway
```

### Get All Properties
```bash
curl http://localhost:3000/api/properties
```

### Get Property with Selected Reviews
```bash
curl http://localhost:3000/api/property/1
```

### Toggle Review Selection
```bash
curl -X POST http://localhost:3000/api/reviews/toggle-selection \
  -H "Content-Type: application/json" \
  -d "{\"reviewId\": 1001}"
```

## 📚 Documentation

- **README.md** - Full setup instructions and feature list
- **DOCUMENTATION.md** - Technical details, architecture, Google Reviews findings
- **PROJECT_SUMMARY.md** - Complete implementation overview

## 🎯 Key Features to Explore

1. **Real-time Selection** - Toggle reviews and see changes persist
2. **Smart Filtering** - Combine multiple filters for precise results
3. **Rating Visualization** - Color-coded badges and star ratings
4. **Responsive Design** - Resize browser to see mobile/tablet views
5. **Error Handling** - Try invalid URLs to see error states

## ✅ Expected Behavior

- Dashboard shows **20 total reviews** across **4 properties**
- Average rating around **8.3**
- **7 reviews pre-selected** for display
- Filtering updates results instantly
- Toggling selection updates both dashboard and property pages
- Property pages only show selected reviews

## 🎨 Demo Flow

1. Start at **Home** → Click "Manager Dashboard"
2. Review **statistics** at the top
3. **Filter** reviews by property "Shoreditch Heights"
4. **Toggle** a review's visibility
5. Click a **property card** to go to its page
6. Verify **only selected reviews** are shown
7. Return to dashboard and **search** for a guest name
8. **Sort** reviews by rating to find best/worst

## 🐛 Troubleshooting

**Port already in use?**
```bash
# Kill process on port 3000
npx kill-port 3000
# Then restart
npm run dev
```

**Changes not showing?**
- Hard refresh: Ctrl+F5 (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache
- Restart dev server

**API not working?**
- Check server is running: http://localhost:3000
- Check console for errors: `npm run dev` output
- Verify file permissions for `data/` directory

## 💡 Tips

- Use browser DevTools (F12) to see network requests
- Check console logs for API responses
- Use React DevTools to inspect component state
- Try different browser window sizes for responsive testing

## 📊 Sample Data Overview

**Properties:**
- 2B Shoreditch Heights (£185/night) - 8 reviews
- Studio Canary Wharf (£145/night) - 5 reviews
- 1B Westminster Gardens (£165/night) - 4 reviews
- 3B Mayfair Residence (£325/night) - 4 reviews

**Review Ratings:**
- Range: 6.0 to 10.0
- Average: ~8.3
- Channels: Airbnb (majority), Booking.com
- Date range: Aug 2024 - Nov 2024

## 🎉 You're Ready!

Everything is set up and ready to demo. Have fun exploring the dashboard!

For questions or issues, check the documentation files or examine the code structure.

