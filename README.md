# Flex Living - Reviews Dashboard

A comprehensive reviews management system for Flex Living properties, featuring a manager dashboard for curating reviews and a public-facing property display page.

## 🚀 Features

- **Hostaway API Integration**: Fetches and normalizes review data from Hostaway API
- **Manager Dashboard**: 
  - View all reviews across properties
  - Filter and sort reviews by property, rating, channel, and date
  - Select which reviews to display on the public website
  - Real-time statistics and property performance metrics
- **Public Property Pages**: 
  - Modern, Airbnb-inspired design
  - Display selected reviews only
  - Property details with image gallery
  - Category rating breakdowns
- **Review Management**: Toggle visibility of reviews with persistent storage

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Data Storage**: JSON file-based storage
- **API Integration**: Hostaway Reviews API

## 📋 Prerequisites

- Node.js 18+ 
- npm or yarn

## ⚙️ Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd flex
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory:
```
HOSTAWAY_ACCOUNT_ID=61148
HOSTAWAY_API_KEY=f94377ebbbb479490bb3ec364649168dc443dda2e4830facaf5de2e74ccc9152
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
flex/
├── app/
│   ├── api/
│   │   ├── reviews/
│   │   │   ├── hostaway/       # Main reviews API endpoint
│   │   │   └── toggle-selection/ # Toggle review visibility
│   │   ├── properties/         # Properties list endpoint
│   │   └── property/[id]/      # Property details endpoint
│   ├── dashboard/              # Manager dashboard page
│   ├── property/[id]/          # Public property pages
│   └── page.tsx                # Home page
├── components/
│   ├── StarRating.tsx          # Star rating display
│   ├── ReviewCard.tsx          # Review card component
│   ├── PropertyCard.tsx        # Property stats card
│   └── FilterBar.tsx           # Filtering controls
├── lib/
│   ├── hostaway.ts             # Hostaway API client
│   ├── reviews.ts              # Review normalization logic
│   ├── properties.ts           # Property data utilities
│   └── storage.ts              # JSON file storage utilities
├── types/
│   └── review.ts               # TypeScript interfaces
└── data/
    ├── mock-reviews.json       # Mock review data
    ├── mock-properties.json    # Mock property data
    └── review-selections.json  # Selected review IDs
```

## 🔑 Key API Routes

### GET `/api/reviews/hostaway`
Fetches and normalizes all reviews from Hostaway API merged with mock data.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1001,
      "propertyId": "1",
      "propertyName": "2B N1 A - 29 Shoreditch Heights",
      "guestName": "Sarah J.",
      "rating": 9,
      "reviewText": "Amazing stay!",
      "categories": [...],
      "date": "2024-11-01 14:30:00",
      "dateFormatted": "November 1, 2024",
      "channel": "Airbnb",
      "isSelected": true
    }
  ]
}
```

### POST `/api/reviews/toggle-selection`
Toggles whether a review should be displayed on the public website.

**Request:**
```json
{
  "reviewId": 1001
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "reviewId": 1001,
    "isSelected": true
  }
}
```

### GET `/api/properties`
Returns all properties.

### GET `/api/property/[id]`
Returns property details with selected reviews.

## 🎨 Pages

### Home (`/`)
Landing page with navigation to dashboard and property pages.

### Manager Dashboard (`/dashboard`)
- Overview statistics (total reviews, average rating, selected count)
- Property performance cards
- Comprehensive review table with filters
- Toggle review visibility

### Property Page (`/property/[id]`)
- Property details and image gallery
- Amenities list
- Reviews section (selected reviews only)
- Category rating breakdowns
- Booking card (UI only)

## 📊 Data Flow

1. **API Route** (`/api/reviews/hostaway`) fetches reviews from Hostaway API
2. Mock data is merged (since sandbox API is empty)
3. Reviews are normalized with consistent structure
4. Selected review IDs are loaded from `data/review-selections.json`
5. Dashboard displays all reviews with selection state
6. Manager toggles selection via `/api/reviews/toggle-selection`
7. Property page displays only selected reviews

## 🔍 Review Normalization

The system normalizes reviews from Hostaway format to a consistent structure:

- Extracts property ID from listing name
- Calculates average rating from category ratings
- Formats guest names (First Name + Last Initial)
- Standardizes date formats
- Adds channel information
- Includes selection status

## 🧪 Testing

Test the main API endpoint:
```bash
curl http://localhost:3000/api/reviews/hostaway
```

## 📝 Notes

- The Hostaway sandbox API contains no reviews, so mock data is used
- Review selections persist in `data/review-selections.json`
- Property images use placeholder URLs from Unsplash
- No authentication is implemented (would be required in production)

## 🚧 Future Enhancements

- Database integration (PostgreSQL/MongoDB)
- User authentication for dashboard
- Real-time updates with WebSockets
- Advanced analytics and insights
- Sentiment analysis on reviews
- Multi-language support
- Export functionality for reports


