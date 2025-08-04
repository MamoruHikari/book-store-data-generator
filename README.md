# Book Store Data Generator

A web app for generating realistic, locale-specific fake book data for bookstore application testing.  
Built with **Next.js** (React) and **Faker** for server-side random data generation, supporting infinite scrolling, CSV export, and dynamic views.

---

## 🚀 Live Demo

- [Application link](https://book-store-data-generator.onrender.com)

> **Note:** The app is hosted on Render’s free tier, so it might take up to 60 seconds to open due to cold launches.

---

## ✨ Features

- **Locale & Language Selection:** Choose from multiple languages/regions (English/USA, Turkish/Turkey, Russian/Russia, Chinese/China).
- **Seed Control:** Enter your own seed or generate a random one. Using the same seed always produces the same data (deterministic).
- **Likes & Reviews Control:**  
  - Specify average **likes per book** (slider, 0–10, fractional supported, e.g. 3.7).
  - Specify average **reviews per book** (number field, fractional supported, e.g. 4.7).
- **Dynamic Regeneration:**  
  - Changing any parameter (locale, seed, likes, reviews) instantly regenerates and updates the book list.
- **Infinite Scrolling:**  
  - Loads the first 20 records, then dynamically loads 10 more as you scroll down.
- **Deterministic Results:**  
  - The same settings (seed, locale, likes/reviews) always produce the same data, even across sessions.
- **Realistic Data:**  
  - Titles, authors, publishers, ISBNs, and reviews are generated using [Faker](https://fakerjs.dev/) with language-specific data for authenticity.
- **Table View:**  
  - Shows:
    - Index
    - ISBN
    - Book Title
    - Author(s)
    - Publisher
  - Each row is **expandable** to show book cover (with title/author rendered), reviews and review authors.
- **Gallery View:**  
  - Switch to a tile-based layout for visual browsing.
- **CSV Export:**  
  - Exports all currently loaded books to CSV with proper escaping (using a ready-made library).

---

## 🛠️ Tech Stack

- **Next.js** (React)
- **Faker.js** (for seeded, locale-specific fake data)
- **Material UI** (for UI components)
- **CSV Export:** [PapaParse](https://www.papaparse.com/)

---

## 🚦 How It Works

1. **User selects language/region, enters or randomizes seed, sets likes/reviews averages.**
2. **Frontend** sends these parameters to the server `/api/books` endpoint.
3. **Server** (API route) uses [Faker.js](https://fakerjs.dev/) with seeded random to generate "realistic" books on the fly, in the appropriate language.
4. **Books are never stored in a database.** All data is generated on-demand, deterministically, on the server.
5. **Infinite scroll**: When user scrolls down, new batches are requested with updated offset/batch, using a combination of seed and batch number to ensure deterministic results.
6. **Likes and reviews**: Fractional values are supported, so e.g. 4.7 reviews means each book gets 4 or 5 reviews, with the 5th added with 70% probability. Changing likes/reviews does not affect book identity, only the count/contents.
7. **Expanding a book row** shows a generated cover, reviews, etc.
8. **Switching locale or seed** instantly regenerates the books accordingly.

---

## 📋 Requirements Satisfaction

- [x] **Multiple locale support**
- [x] **Seed input/randomization, deterministic results for same seed**
- [x] **Average likes & reviews sliders (supporting fractional values)**
- [x] **Dynamic, instant update on any parameter change**
- [x] **Infinite scroll (20 initial, +10 on each scroll-down)**
- [x] **All data generated on the server (no DB, no browser-side random)**
- [x] **Table view with index, ISBN, title, author(s), publisher**
- [x] **Titles/authors/publishers/reviews in correct locale/language**
- [x] **Likes and reviews deterministic, with fractional probability**
- [x] **Expandable rows: show cover, reviews, etc.**
- [x] **Optional: gallery view, CSV export**
- [x] **No authentication needed**

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/MamoruHikari/book-store-data-generator.git
cd <your-repo>
npm install
```

### 2. Run the App

```bash
npm run dev
```

App will be available at `http://localhost:3000/`

### 3. Build for Production

```bash
npm run build
npm run start
```
---

## 📄 License

MIT
