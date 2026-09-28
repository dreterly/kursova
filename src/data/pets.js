export const pets = [
  // =========================
  // ЗАГУБЛЕНІ ТВАРИНИ
  // =========================

  {
    id: 1,
    name: "Мурчик",
    type: "Кіт",
    breed: "Британський короткошерстий",
    age: 3,
    gender: "Самець",
    city: "Житомир",
    district: "Корольовський район",
    status: "lost",
    color: "Сірий",
    description:
      "Сірий британський кіт із жовтими очима. На шиї синій нашийник.",
    lostDate: "2026-09-15",
    image: "/images/pets/murchyk.jpg"
  },

  {
    id: 2,
    name: "Луна",
    type: "Кішка",
    breed: "Шотландська висловуха",
    age: 2,
    gender: "Самка",
    city: "Житомир",
    district: "Богунський район",
    status: "lost",
    color: "Біла з рудими плямами",
    description:
      "Невелика біло-руда кішка з характерними складеними вушками. Дуже лагідна.",
    lostDate: "2026-09-17",
    image: "/images/pets/luna.jpg"
  },

  {
    id: 3,
    name: "Барсик",
    type: "Кіт",
    breed: "Домашній",
    age: 5,
    gender: "Самець",
    city: "Житомир",
    district: "Промисловий район",
    status: "lost",
    color: "Чорно-білий",
    description:
      "Чорно-білий кіт середнього розміру. На передній лапі є маленька біла пляма.",
    lostDate: "2026-09-12",
    image: "/images/pets/barsyk.jpg"
  },

  {
    id: 4,
    name: "Сімба",
    type: "Кіт",
    breed: "Мейн-кун",
    age: 4,
    gender: "Самець",
    city: "Житомир",
    district: "Центр",
    status: "lost",
    color: "Рудий",
    description:
      "Великий рудий кіт із пухнастим хвостом. Має зелені очі та чорний нашийник.",
    lostDate: "2026-09-10",
    image: "/images/pets/simba.jpg"
  },

  {
    id: 5,
    name: "Мілка",
    type: "Кішка",
    breed: "Європейська короткошерста",
    age: 1,
    gender: "Самка",
    city: "Житомир",
    district: "Крошня",
    status: "lost",
    color: "Триколірна",
    description:
      "Молода триколірна кішка. На носику маленька чорна плямка.",
    lostDate: "2026-09-18",
    image: "/images/pets/milka.jpg"
  },

  // =========================
  // ЗНАЙДЕНІ ТВАРИНИ
  // =========================

  {
    id: 6,
    name: "Невідомий кіт",
    type: "Кіт",
    breed: "Домашній",
    age: 2,
    gender: "Самець",
    city: "Житомир",
    district: "Центр",
    status: "found",
    color: "Рудий",
    description:
      "Рудий кіт був знайдений біля центрального парку. На лапі невелика біла пляма.",
    foundDate: "2026-09-16",
    image: "/images/pets/found-cat-1.jpg"
  },

  {
    id: 7,
    name: "Невідома кішка",
    type: "Кішка",
    breed: "Шотландська",
    age: 3,
    gender: "Самка",
    city: "Житомир",
    district: "Богунський район",
    status: "found",
    color: "Сіра",
    description:
      "Сіра кішка була знайдена біля житлового будинку. Спокійна та контактна.",
    foundDate: "2026-09-14",
    image: "/images/pets/found-cat-2.jpg"
  },

  {
    id: 8,
    name: "Невідомий кіт",
    type: "Кіт",
    breed: "Британський",
    age: 4,
    gender: "Самець",
    city: "Житомир",
    district: "Корольовський район",
    status: "found",
    color: "Синьо-сірий",
    description:
      "Кіт знайдений біля магазину. Має жовті очі та зелений нашийник.",
    foundDate: "2026-09-11",
    image: "/images/pets/found-cat-3.jpg"
  },

  {
    id: 9,
    name: "Невідома кішка",
    type: "Кішка",
    breed: "Домашня",
    age: 1,
    gender: "Самка",
    city: "Житомир",
    district: "Малікова",
    status: "found",
    color: "Біла",
    description:
      "Молода біла кішка була знайдена біля під'їзду. На хвості є сіра пляма.",
    foundDate: "2026-09-13",
    image: "/images/pets/found-cat-4.jpg"
  },

  {
    id: 10,
    name: "Невідомий кіт",
    type: "Кіт",
    breed: "Домашній",
    age: 6,
    gender: "Самець",
    city: "Житомир",
    district: "Крошня",
    status: "found",
    color: "Чорно-білий",
    description:
      "Дорослий чорно-білий кіт знайдений неподалік автобусної зупинки.",
    foundDate: "2026-09-09",
    image: "/images/pets/found-cat-5.jpg"
  },

  // =========================
  // ВЛАСНІ ТВАРИНИ КОРИСТУВАЧА
  // =========================

  {
    id: 11,
    name: "Томас",
    type: "Кіт",
    breed: "Британський короткошерстий",
    age: 4,
    gender: "Самець",
    city: "Житомир",
    status: "owned",
    color: "Сірий",
    description:
      "Домашній британський кіт. Спокійний та дружелюбний.",
    chipNumber: "985141000123456",
    image: "/images/pets/thomas.jpg"
  },

  {
    id: 12,
    name: "Мія",
    type: "Кішка",
    breed: "Шотландська висловуха",
    age: 2,
    gender: "Самка",
    city: "Житомир",
    status: "owned",
    color: "Біла",
    description:
      "Домашня кішка білого кольору з блакитними очима.",
    chipNumber: "985141000123457",
    image: "/images/pets/mia.jpg"
  },

  {
    id: 13,
    name: "Рижик",
    type: "Кіт",
    breed: "Домашній",
    age: 3,
    gender: "Самець",
    city: "Житомир",
    status: "owned",
    color: "Рудий",
    description:
      "Активний рудий кіт. Любить гратися та гуляти на вулиці.",
    chipNumber: "985141000123458",
    image: "/images/pets/ryzhyk.jpg"
  }
];