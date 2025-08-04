import type { Faker } from '@faker-js/faker';

export const REVIEWS_EN = [
  "A fascinating read from start to finish.",
  "Couldn't put it down!",
  "The characters were so vivid and real.",
  "A bit slow in the middle, but overall enjoyable.",
  "Highly recommended for all ages.",
  "An instant classic.",
  "The plot twists kept me guessing.",
  "I learned so much from this book.",
  "Beautifully written.",
  "I would read it again."
];

export const REVIEWS_TR = [
  "Baştan sona sürükleyici bir kitap.",
  "Elimden bırakamadım!",
  "Karakterler çok canlıydı.",
  "Ortası biraz yavaş ilerledi ama genel olarak keyifliydi.",
  "Her yaşa tavsiye edilir.",
  "Gerçek bir klasik.",
  "Olaylar beni sürekli şaşırttı.",
  "Bu kitaptan çok şey öğrendim.",
  "Harika bir üslup.",
  "Tekrar okumak isterim."
];

export const REVIEWS_ZH = [
  "从头到尾都很精彩。",
  "让我爱不释手！",
  "人物形象非常生动。",
  "中间有点慢，但整体很棒。",
  "强烈推荐给所有人。",
  "一本经典之作。",
  "情节跌宕起伏，令人意想不到。",
  "这本书让我受益匪浅。",
  "文笔优美。",
  "我还会再读一遍。"
];

export function getRandomReview(locale: string, fakerRU: Faker, randomFn: () => number): string {
  switch (locale) {
    case 'en':
      return REVIEWS_EN[Math.floor(randomFn() * REVIEWS_EN.length)];
    case 'tr':
      return REVIEWS_TR[Math.floor(randomFn() * REVIEWS_TR.length)];
    case 'zh':
      return REVIEWS_ZH[Math.floor(randomFn() * REVIEWS_ZH.length)];
    case 'ru':
      return fakerRU.lorem.sentence();
    default:
      return REVIEWS_EN[Math.floor(randomFn() * REVIEWS_EN.length)];
  }
}
