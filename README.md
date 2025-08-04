# Book Store Data Generator Web App

A web app for generating realistic, locale-specific fake book data for bookstore application testing.  
Built with **Next.js** (React) and **Faker** for server-side random data generation, supporting infinite scrolling, CSV export, and dynamic views.

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
  - Loads the first 20 records, then dynamically loads 10 more as you scroll down (no paging!).
- **Deterministic Results:**  
  - The same settings (seed, locale, likes/reviews) always produce the same data, even across sessions.
- **Realistic Data:**  
  - Titles, authors, publishers, ISBNs, and reviews are generated using [Faker](https://fakerjs.dev/) with language-specific data for authenticity.
- **Table View (Required):**  
  - Shows:
    - Index (1, 2, 3, ...)
    - ISBN
    - Book Title
    - Author(s)
    - Publisher
  - Each row is **expandable** to show book cover (with title/author rendered), reviews and review authors.
- **Gallery View (Optional):**  
  - Switch to a tile-based layout for visual browsing.
- **CSV Export:**  
  - Exports all currently loaded books to CSV with proper escaping (using a ready-made library).

---

## 🖼️ Screenshots

> _Add screenshots here of the main page, language selection, infinite scroll, accordion expansion, and CSV export!_

---

## 🛠️ Tech Stack

- **Next.js** (React)
- **Faker.js** (for seeded, locale-specific fake data)
- **Material UI** (for UI components)
- **CSV Export:** [PapaParse](https://www.papaparse.com/) (never handcrafted)

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

- [x] **Multiple locale support (at least 3, must include English/USA)**
- [x] **Seed input/randomization, deterministic results for same seed**
- [x] **Average likes & reviews sliders (supporting fractional values)**
- [x] **Dynamic, instant update on any parameter change**
- [x] **Infinite scroll (20 initial, +10 on each scroll-down)**
- [x] **All data generated on the server (no DB, no browser-side random)**
- [x] **Table view with index, ISBN, title, author(s), publisher**
- [x] **Titles/authors/publishers/reviews in correct locale/language**
- [x] **Likes and reviews deterministic, with fractional probability**
- [x] **Expandable rows: show cover, reviews, etc.**
- [x] **Optional: gallery view, CSV export (using a library, not manual string building)**
- [x] **No authentication needed**

---

## 🚀 Getting Started

### 1. Clone & Install

```bash
git clone https://github.com/<your-username>/<your-repo>.git
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

## ⚙️ Configuration

No special configuration is needed.  
All data is generated on-demand; no DB or authentication required.

---

## 📦 Deployment

- Can be deployed to Vercel, Netlify, or any Node.js-compatible platform.
- No database or persistent storage required.

---

## 📄 License

MIT

---

## 🙋 FAQ

### Does it store any data?
> **No.** All data is generated on-demand on the server using seeded random, and is not persisted.

### Is the data the same if I use the same seed tomorrow?
> **Yes**, as long as the locale and other parameters are the same.

### Can I use this for other kinds of fake data?
> Yes, just adjust the generator logic/server route as needed!

---

## 👤 Submission Checklist

1. Full name.
2. Link to deployed project.
3. Link to source code.
4. Recorded video demonstration (showing locale switching, infinite scroll, likes/reviews edge cases, seed determinism, etc).

---

## 💡 Implementation Notes

- Uses [@faker-js/faker](https://fakerjs.dev/) and its `seed()` API so that all random data (including reviews) is deterministic for the same seed, locale, and batch/offset.
- Book cover images are generated on the server, with title and author drawn programmatically.
- All review text is selected from language-appropriate lists or generated using Faker.
- No hardcoded arrays for book data – always use the library for names, titles, etc (except for a small fixed list of reviews per language, which are randomly picked in a seeded way).
