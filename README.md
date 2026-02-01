# 🎓 CampusBuzz

CampusBuzz is a full-stack mobile application designed to streamline college event management and participation. The platform enables event organizers to post events and manage registrations, while participants can browse, view details, and register for events seamlessly — all from a single mobile app.

# 📱 Features
🔐 Authentication & Role Management

Secure user authentication with role-based access for Organizers and Participants, ensuring personalized dashboards and controlled permissions.

📅 Event Management

Organizers can create, edit, and manage technical and cultural events with complete details including date, venue, description, and poster upload.

📋 Event Browsing

Participants can browse categorized event lists, view event details, and stay informed about upcoming campus activities.

📝 Event Registration

Participants can register for events through a simple form and view their registration status directly from the app.

🔄 Real-Time Updates

Event lists refresh automatically after creation or updates, ensuring users always see the latest information.

🎨 App-Wide Theming

Consistent UI styling across all screens with centralized theme management for better maintainability.

📱 Mobile-First Design

Built with a responsive and intuitive interface optimized for Android devices.

# 🛠️ Tech Stack

Frontend

React Native (Expo)

JavaScript

React Navigation

Backend

Supabase (Authentication, Database, Storage)

PostgreSQL

Other Tools

Expo Image Picker

Expo File System

Git & GitHub

Visual Studio Code

# 🚀 Getting Started
1️⃣ Clone the Repository
git clone https://github.com/harshinimamidipalli/CampusBuzz.git
cd CampusBuzz

2️⃣ Install Dependencies
npm install

3️⃣ Run the App
npx expo start

Scan the QR code using Expo Go on your mobile device.

# 🔐 Environment Setup

Create a Supabase project and update the credentials in:

lib/supabase.js

const supabaseUrl = "YOUR_SUPABASE_URL";
const supabaseAnonKey = "YOUR_SUPABASE_ANON_KEY";

# 📦 Database Tables (Supabase)

profiles – stores user roles and details

events – stores event information

registrations – stores participant registrations

storage/event-posters – stores uploaded event posters

# 🧪 Future Enhancements

Push notifications for event updates

Event registration analytics for organizers

Participant registration history

Admin dashboard

Event reminders and calendar integration

# 👩‍💻 Author

Harshini M
