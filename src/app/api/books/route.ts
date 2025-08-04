import { fakerEN, fakerTR, fakerRU, fakerZH_CN } from '@faker-js/faker';
import { getRandomReview } from '@/lib/reviews';

const LOCALE_MAP = {
  en: fakerEN,
  tr: fakerTR,
  ru: fakerRU,
  zh: fakerZH_CN,
};

function fractionalAmount(avg: number, random: () => number) {
  const base = Math.floor(avg);
  return base + (random() < avg - base ? 1 : 0);
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const seed = searchParams.get('seed') || '42';
  const locale = searchParams.get('locale') || 'en';
  const likesAvg = parseFloat(searchParams.get('likesAvg') || '3.7');
  const reviewsAvg = parseFloat(searchParams.get('reviewsAvg') || '4.7');
  const offset = parseInt(searchParams.get('offset') || '0');
  const limit = parseInt(searchParams.get('limit') || '20');

  const faker = LOCALE_MAP[locale as keyof typeof LOCALE_MAP] || fakerEN;

  const books = [];

  for (let i = 0; i < limit; ++i) {
    const index = offset + i + 1;
    faker.seed(Number(seed) + index);

    const title =
      faker.commerce.productName() ||
      faker.lorem.words({ min: 2, max: 5 });

    const authors = [
      faker.person.fullName(),
      ...(faker.number.float() > 0.7 ? [faker.person.fullName()] : []),
    ];
    const publisher = faker.company.name();
    const uniqueId = `${seed}-${locale}-${index}`;
    const isbn = faker.string.numeric({ length: 13, allowLeadingZeros: true });

    const likes = fractionalAmount(likesAvg, faker.number.float.bind(faker.number));
    const numReviews = fractionalAmount(reviewsAvg, faker.number.float.bind(faker.number));

    const reviews = Array.from({ length: numReviews }).map((_, ri) => {
      faker.seed(Number(seed) + index * 1000 + ri);
      const randomFn = faker.number.float.bind(faker.number);
      return {
        text: getRandomReview(locale, fakerRU, randomFn),
        author: faker.person.fullName(),
      };
    });

    books.push({ uniqueId, index, isbn, title, authors, publisher, likes, reviews });
  }

  return Response.json({ books });
}