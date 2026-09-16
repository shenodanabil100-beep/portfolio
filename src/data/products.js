/* ==========================================================================
   SoDak Sweet Tooth — Product Catalog (server-side source of truth)
   Mirrors the shape used by the frontend's products.js so the API can be
   swapped in as a drop-in replacement for the static array.
   ========================================================================== */

const PRODUCTS = [
  {
    id: 1,
    name: "Chocolate Fudge Bites",
    category: "chocolate",
    price: 8.99,
    oldPrice: 10.99,
    image:
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=900&h=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=500&h=500&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=700&h=700&q=80",
      "https://images.unsplash.com/photo-1534119139482-b530a7f9a98b?auto=format&fit=crop&w=700&h=700&q=80",
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=700&h=700&q=80",
    ],
    shortDescription: "Rich fudge squares dipped in dark chocolate and finished with sea salt.",
    description:
      "Our Chocolate Fudge Bites start with small-batch fudge, cut into bite-size squares, and hand-dipped in dark chocolate. Each piece is finished with a pinch of flaky sea salt to balance the sweetness. They're made in small trays a few times a week, so what you get is always fresh.",
    ingredients:
      "Sugar, cream, butter, cocoa mass, cocoa butter, milk powder, sea salt, natural vanilla flavoring. Contains milk. Made in a facility that also processes peanuts and tree nuts.",
    rating: 4.8,
    reviews: 96,
    stock: "in-stock",
    badge: "sale",
    dateAdded: "2026-01-15",
  },
  {
    id: 2,
    name: "Milk Chocolate Truffles",
    category: "chocolate",
    price: 14.99,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=900&h=1100&q=80&crop=top",
    thumb:
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=500&h=500&q=80&crop=top",
    gallery: [
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=700&h=700&q=80&crop=top",
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=700&h=700&q=80",
    ],
    shortDescription: "Smooth milk chocolate truffles rolled by hand in a light cocoa dusting.",
    description:
      "A silky ganache center made with real cream and milk chocolate, rolled by hand and dusted in cocoa. These truffles are soft at room temperature, so we recommend keeping them cool until you're ready to enjoy them. A best seller for gifting and for keeping on the counter.",
    ingredients:
      "Milk chocolate (sugar, cocoa butter, milk powder, cocoa mass, soy lecithin), heavy cream, unsalted butter, cocoa powder. Contains milk and soy.",
    rating: 4.9,
    reviews: 142,
    stock: "in-stock",
    badge: "bestseller",
    dateAdded: "2025-11-02",
  },
  {
    id: 3,
    name: "Chocolate Pretzel Bites",
    category: "chocolate",
    price: 9.49,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=900&h=900&q=80&crop=left",
    thumb:
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=500&h=500&q=80&crop=left",
    gallery: [
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=700&h=700&q=80&crop=left",
    ],
    shortDescription: "Crunchy pretzel twists coated in milk chocolate and a light drizzle.",
    description:
      "We coat mini pretzel twists in melted milk chocolate, then finish half the batch with a white chocolate drizzle. The result is a snack that's salty, sweet, and crunchy all at once — a favorite for movie nights and lunchbox treats.",
    ingredients:
      "Pretzels (wheat flour, salt, yeast), milk chocolate, white chocolate, vegetable oil. Contains wheat, milk, and soy. May contain traces of tree nuts.",
    rating: 4.6,
    reviews: 58,
    stock: "in-stock",
    badge: "",
    dateAdded: "2026-02-20",
  },
  {
    id: 4,
    name: "Peanut Butter Cups",
    category: "chocolate",
    price: 7.99,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=900&h=900&q=80&crop=right",
    thumb:
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=500&h=500&q=80&crop=right",
    gallery: [
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=700&h=700&q=80&crop=right",
    ],
    shortDescription: "Creamy peanut butter filling wrapped in a shell of milk chocolate.",
    description:
      "A South Dakota favorite: smooth, lightly salted peanut butter set inside a milk chocolate shell. We keep the filling soft and the shell snappy, so every cup has a little bit of contrast in each bite.",
    ingredients: "Milk chocolate, peanut butter, powdered sugar, palm oil, salt. Contains milk, peanuts, and soy.",
    rating: 4.7,
    reviews: 74,
    stock: "in-stock",
    badge: "",
    dateAdded: "2025-09-10",
  },
  {
    id: 5,
    name: "Rainbow Gummies",
    category: "gummies",
    price: 6.49,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1703319953569-72084ac406b6?auto=format&fit=crop&w=900&h=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1703319953569-72084ac406b6?auto=format&fit=crop&w=500&h=500&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1703319953569-72084ac406b6?auto=format&fit=crop&w=700&h=700&q=80",
      "https://images.unsplash.com/photo-1752622899062-f40b83158dae?auto=format&fit=crop&w=700&h=700&q=80",
    ],
    shortDescription: "Chewy fruit-flavored gummies in six colors and six flavors.",
    description:
      "Soft, chewy, and just firm enough to have a good bite, our Rainbow Gummies come in orange, cherry, lemon, green apple, blue raspberry, and grape. No two handfuls look the same, which is half the fun.",
    ingredients:
      "Corn syrup, sugar, gelatin, citric acid, natural and artificial flavors, fruit and vegetable juice for color. Contains gelatin (not vegetarian).",
    rating: 4.7,
    reviews: 121,
    stock: "in-stock",
    badge: "bestseller",
    dateAdded: "2025-10-05",
  },
  {
    id: 6,
    name: "Sour Candy Mix",
    category: "gummies",
    price: 6.99,
    oldPrice: 8.49,
    image:
      "https://images.unsplash.com/photo-1752622899062-f40b83158dae?auto=format&fit=crop&w=900&h=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1752622899062-f40b83158dae?auto=format&fit=crop&w=500&h=500&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1752622899062-f40b83158dae?auto=format&fit=crop&w=700&h=700&q=80",
      "https://images.unsplash.com/photo-1703319953569-72084ac406b6?auto=format&fit=crop&w=700&h=700&q=80",
    ],
    shortDescription: "A tangy blend of sour belts, bears, and bites rolled in sour sugar.",
    description:
      "For customers who like a pucker with their sweet, this mix combines sour belts, sour bears, and sour bites, each rolled in a fine sour sugar coating. The sourness fades into a regular fruity chew, so it's approachable even if you're new to sour candy.",
    ingredients:
      "Corn syrup, sugar, citric acid, malic acid, gelatin, natural and artificial flavors, colors. Contains gelatin (not vegetarian).",
    rating: 4.5,
    reviews: 67,
    stock: "in-stock",
    badge: "sale",
    dateAdded: "2026-03-01",
  },
  {
    id: 7,
    name: "Sour Watermelon Bites",
    category: "gummies",
    price: 6.99,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1752622899062-f40b83158dae?auto=format&fit=crop&w=900&h=900&q=80&crop=bottom",
    thumb:
      "https://images.unsplash.com/photo-1752622899062-f40b83158dae?auto=format&fit=crop&w=500&h=500&q=80&crop=bottom",
    gallery: [
      "https://images.unsplash.com/photo-1752622899062-f40b83158dae?auto=format&fit=crop&w=700&h=700&q=80&crop=bottom",
    ],
    shortDescription: "Watermelon-shaped chews with a sour green rind and sweet pink center.",
    description:
      "Two flavors in one bite: a tart green 'rind' gives way to a sweet watermelon center, just like the real fruit. These are a top seller with kids and adults who grew up on the original watermelon candy slices.",
    ingredients:
      "Corn syrup, sugar, gelatin, citric acid, natural and artificial flavors, colors. Contains gelatin (not vegetarian).",
    rating: 4.6,
    reviews: 45,
    stock: "in-stock",
    badge: "",
    dateAdded: "2025-10-28",
  },
  {
    id: 8,
    name: "Strawberries & Cream Chews",
    category: "gummies",
    price: 6.79,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1703319953569-72084ac406b6?auto=format&fit=crop&w=900&h=900&q=80&crop=bottom",
    thumb:
      "https://images.unsplash.com/photo-1703319953569-72084ac406b6?auto=format&fit=crop&w=500&h=500&q=80&crop=bottom",
    gallery: [
      "https://images.unsplash.com/photo-1703319953569-72084ac406b6?auto=format&fit=crop&w=700&h=700&q=80&crop=bottom",
    ],
    shortDescription: "Soft strawberry-flavored chews with a creamy filled center.",
    description:
      "A soft outer chew with a creamy strawberries-and-cream center. These are less sticky than a typical taffy, so they're a good option for anyone who wants a fruity chew without it pulling at fillings.",
    ingredients: "Sugar, corn syrup, palm oil, milk, natural and artificial strawberry flavor, citric acid. Contains milk.",
    rating: 4.4,
    reviews: 33,
    stock: "in-stock",
    badge: "",
    dateAdded: "2025-08-22",
  },
  {
    id: 9,
    name: "Classic Hard Candy Assortment",
    category: "hard-candy",
    price: 5.49,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1534119139482-b530a7f9a98b?auto=format&fit=crop&w=900&h=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1534119139482-b530a7f9a98b?auto=format&fit=crop&w=500&h=500&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1534119139482-b530a7f9a98b?auto=format&fit=crop&w=700&h=700&q=80",
    ],
    shortDescription: "Individually wrapped hard candies in six classic fruit flavors.",
    description:
      "A jar-fillable bag of individually wrapped hard candies — cherry, watermelon, green apple, orange, grape, and lemon. Slow-melting and long-lasting, these are the candies people keep in a bowl on the desk or in the glovebox.",
    ingredients: "Sugar, corn syrup, citric acid, natural and artificial flavors, colors. Contains no common allergens.",
    rating: 4.5,
    reviews: 52,
    stock: "in-stock",
    badge: "",
    dateAdded: "2025-07-14",
  },
  {
    id: 10,
    name: "Caramel Popcorn",
    category: "hard-candy",
    price: 7.49,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1771263392554-de255be45023?auto=format&fit=crop&w=900&h=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1771263392554-de255be45023?auto=format&fit=crop&w=500&h=500&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1771263392554-de255be45023?auto=format&fit=crop&w=700&h=700&q=80",
    ],
    shortDescription: "Kettle-popped popcorn tossed in a slow-cooked buttery caramel.",
    description:
      "We pop our corn in small batches and toss it while the caramel is still warm, so every kernel gets coated. It's baked briefly afterward to set the caramel and keep the popcorn crisp for weeks, not days.",
    ingredients:
      "Popcorn, brown sugar, butter, corn syrup, salt, baking soda, vanilla flavoring. Contains milk. Made in a facility that also processes peanuts and tree nuts.",
    rating: 4.6,
    reviews: 39,
    stock: "in-stock",
    badge: "new",
    dateAdded: "2026-05-02",
  },
  {
    id: 11,
    name: "Sour Straws Variety Pack",
    category: "hard-candy",
    price: 6.29,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1534119139482-b530a7f9a98b?auto=format&fit=crop&w=900&h=900&q=80&crop=left",
    thumb:
      "https://images.unsplash.com/photo-1534119139482-b530a7f9a98b?auto=format&fit=crop&w=500&h=500&q=80&crop=left",
    gallery: [
      "https://images.unsplash.com/photo-1534119139482-b530a7f9a98b?auto=format&fit=crop&w=700&h=700&q=80&crop=left",
    ],
    shortDescription: "Long twisted sour straws in strawberry, blue raspberry, and green apple.",
    description:
      "Twisted sour straws with a good chew and a strong fruit flavor upfront. Packed in a resealable bag so they stay soft, they're a popular pick for road trips and movie nights.",
    ingredients: "Sugar, corn syrup, citric acid, natural and artificial flavors, colors. Contains no common allergens.",
    rating: 4.3,
    reviews: 21,
    stock: "low-stock",
    badge: "",
    dateAdded: "2025-12-01",
  },
  {
    id: 12,
    name: "Candy Gift Box",
    category: "gift-box",
    price: 24.99,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&h=900&q=80",
    thumb:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=500&h=500&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=700&h=700&q=80",
      "https://images.unsplash.com/photo-1656821991453-c9b39bd205a4?auto=format&fit=crop&w=700&h=700&q=80",
    ],
    shortDescription: "A gift-ready box with a hand-picked mix of our most popular candy.",
    description:
      "Our Candy Gift Box pairs a few pieces from each best-selling line — chocolate, gummies, and hard candy — in a printed box with a ribbon tie. It's packed to order, so the mix stays fresh from our shop to your door.",
    ingredients:
      "Contains a mix of chocolate, gummy, and hard candy items. See individual product listings for full ingredients. Contains milk, soy, and gelatin.",
    rating: 4.9,
    reviews: 84,
    stock: "in-stock",
    badge: "bestseller",
    dateAdded: "2025-11-20",
  },
  {
    id: 13,
    name: "Deluxe Sweet Tooth Gift Box",
    category: "gift-box",
    price: 34.99,
    oldPrice: 39.99,
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&h=900&q=80&crop=top",
    thumb:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=500&h=500&q=80&crop=top",
    gallery: [
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=700&h=700&q=80&crop=top",
      "https://images.unsplash.com/photo-1771263392554-de255be45023?auto=format&fit=crop&w=700&h=700&q=80",
    ],
    shortDescription: "Our largest gift box with a full lineup of chocolate, gummies, and more.",
    description:
      "The Deluxe box is built for sharing — two full layers with truffles, fudge bites, gummies, caramel popcorn, and a handful of hard candy. It ships in a padded mailer so the box arrives looking as good as it did on our packing table.",
    ingredients:
      "Contains a mix of chocolate, gummy, hard candy, and popcorn items. See individual product listings for full ingredients. Contains milk, soy, and gelatin.",
    rating: 4.8,
    reviews: 47,
    stock: "in-stock",
    badge: "sale",
    dateAdded: "2026-01-30",
  },
  {
    id: 14,
    name: "Mini Gift Box Trio",
    category: "gift-box",
    price: 19.99,
    oldPrice: null,
    image:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=900&h=900&q=80&crop=right",
    thumb:
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=500&h=500&q=80&crop=right",
    gallery: [
      "https://images.unsplash.com/photo-1513201099705-a9746e1e201f?auto=format&fit=crop&w=700&h=700&q=80&crop=right",
    ],
    shortDescription: "Three small favor-sized boxes, perfect for party guests or coworkers.",
    description:
      "Three mini boxes in one order, each with a small mix of chocolate and gummy candy. A popular choice for teacher gifts, party favors, and thank-you notes that need a little something extra.",
    ingredients:
      "Contains a mix of chocolate and gummy candy items. See individual product listings for full ingredients. Contains milk, soy, and gelatin.",
    rating: 4.7,
    reviews: 18,
    stock: "in-stock",
    badge: "new",
    dateAdded: "2026-06-10",
  },
];

module.exports = PRODUCTS;
