/* ==========================================================================
   SoDak Sweet Tooth — Sample customer reviews, keyed by product id.
   Products without a specific entry fall back to a generated placeholder
   set (see reviews.controller.js) so every product id still returns data.
   ========================================================================== */

const REVIEWS = {
  1: [
    { id: 1, author: "Megan T.", rating: 5, date: "2026-06-02", title: "Better than the local candy shop!", body: "The sea salt on top makes these — rich fudge, snappy chocolate, perfectly balanced. Ordered a second bag within a week." },
    { id: 2, author: "Dave R.", rating: 5, date: "2026-05-14", title: "Fresh every time", body: "You can tell these are made in small batches. Texture is soft but holds together well for shipping." },
    { id: 3, author: "Priya S.", rating: 4, date: "2026-04-28", title: "Great gift, a little pricey", body: "Delicious and clearly high quality, just wish the bag was a bit bigger for the price." },
  ],
  2: [
    { id: 1, author: "Carlos M.", rating: 5, date: "2026-06-10", title: "Best truffles I've had", body: "Silky ganache, not overly sweet. These disappeared in one sitting at our office party." },
    { id: 2, author: "Anna L.", rating: 5, date: "2026-05-30", title: "Melt-in-your-mouth", body: "Kept them in the fridge like recommended and they were perfect. Will reorder for the holidays." },
  ],
  5: [
    { id: 1, author: "Jordan K.", rating: 5, date: "2026-06-01", title: "Kids and adults both love these", body: "Great chew, not too sticky, and the flavors actually taste different from each other." },
    { id: 2, author: "Sam W.", rating: 4, date: "2026-05-05", title: "Solid gummy candy", body: "Good flavor variety. A couple of the colors were a bit firmer than expected but still tasty." },
  ],
  12: [
    { id: 1, author: "Rachel P.", rating: 5, date: "2026-06-15", title: "Perfect hostess gift", body: "Beautifully packed and the mix of candy inside covered everyone's preferences at the party." },
    { id: 2, author: "Tom H.", rating: 5, date: "2026-05-22", title: "Shipped fast, arrived fresh", body: "Nothing was melted or crushed. Ribbon and box presentation was better than I expected for the price." },
  ],
};

const FALLBACK_REVIEWS = [
  { id: 1, author: "Verified Buyer", rating: 5, date: "2026-05-01", title: "Really good!", body: "Tastes fresh and arrived quickly. Would buy again." },
  { id: 2, author: "Verified Buyer", rating: 4, date: "2026-04-10", title: "Solid pick", body: "Good flavor, good packaging. Nothing bad to say." },
];

module.exports = { REVIEWS, FALLBACK_REVIEWS };
