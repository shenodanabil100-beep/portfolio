process.env.NODE_ENV = "test";
const request = require("supertest");
const createApp = require("../src/app");

const app = createApp();

describe("GET /api/health", () => {
  it("returns ok status", async () => {
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
});

describe("GET /api/categories", () => {
  it("returns the list of valid categories", async () => {
    const res = await request(app).get("/api/categories");
    expect(res.status).toBe(200);
    expect(res.body.data).toEqual(
      expect.arrayContaining(["chocolate", "gummies", "hard-candy", "gift-box"])
    );
  });
});

describe("GET /api/products", () => {
  it("returns a paginated list with default page size", async () => {
    const res = await request(app).get("/api/products");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeLessThanOrEqual(12);
    expect(res.body.pagination).toMatchObject({ page: 1, limit: 12 });
    expect(res.body.pagination.total).toBe(14);
  });

  it("filters by a single category", async () => {
    const res = await request(app).get("/api/products?category=chocolate");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((p) => expect(p.category).toBe("chocolate"));
  });

  it("filters by multiple comma-separated categories", async () => {
    const res = await request(app).get("/api/products?category=chocolate,gummies");
    expect(res.status).toBe(200);
    res.body.data.forEach((p) => expect(["chocolate", "gummies"]).toContain(p.category));
  });

  it("rejects an unknown category with 400", async () => {
    const res = await request(app).get("/api/products?category=unicorn-dust");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_category");
  });

  it("filters by maxPrice", async () => {
    const res = await request(app).get("/api/products?maxPrice=7&limit=48");
    expect(res.status).toBe(200);
    res.body.data.forEach((p) => expect(p.price).toBeLessThanOrEqual(7));
  });

  it("rejects a negative maxPrice", async () => {
    const res = await request(app).get("/api/products?maxPrice=-5");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_max_price");
  });

  it("searches by name (case-insensitive)", async () => {
    const res = await request(app).get("/api/products?search=TRUFFLE");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0].name).toMatch(/Truffle/i);
  });

  it("sorts by price ascending", async () => {
    const res = await request(app).get("/api/products?sort=price-low&limit=48");
    const prices = res.body.data.map((p) => p.price);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  it("sorts by price descending", async () => {
    const res = await request(app).get("/api/products?sort=price-high&limit=48");
    const prices = res.body.data.map((p) => p.price);
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  it("sorts by newest", async () => {
    const res = await request(app).get("/api/products?sort=newest&limit=48");
    const dates = res.body.data.map((p) => new Date(p.dateAdded).getTime());
    const sorted = [...dates].sort((a, b) => b - a);
    expect(dates).toEqual(sorted);
  });

  it("rejects an invalid sort value", async () => {
    const res = await request(app).get("/api/products?sort=random");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_sort");
  });

  it("paginates correctly across pages", async () => {
    const page1 = await request(app).get("/api/products?limit=5&page=1");
    const page2 = await request(app).get("/api/products?limit=5&page=2");
    expect(page1.body.data.length).toBe(5);
    expect(page2.body.data.length).toBe(5);
    const idsPage1 = page1.body.data.map((p) => p.id);
    const idsPage2 = page2.body.data.map((p) => p.id);
    expect(idsPage1).not.toEqual(idsPage2);
  });

  it("clamps an out-of-range page to the last page instead of erroring", async () => {
    const res = await request(app).get("/api/products?limit=5&page=999");
    expect(res.status).toBe(200);
    expect(res.body.pagination.page).toBe(res.body.pagination.totalPages);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

describe("GET /api/products/:id", () => {
  it("returns a single product", async () => {
    const res = await request(app).get("/api/products/1");
    expect(res.status).toBe(200);
    expect(res.body.data).toMatchObject({ id: 1, name: "Chocolate Fudge Bites" });
  });

  it("returns 404 for a missing product", async () => {
    const res = await request(app).get("/api/products/9999");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("not_found");
  });

  it("returns 404 for a non-numeric id", async () => {
    const res = await request(app).get("/api/products/not-a-number");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/products/:id/related", () => {
  it("returns related products in the same category, excluding itself", async () => {
    const res = await request(app).get("/api/products/1/related");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    res.body.data.forEach((p) => {
      expect(p.category).toBe("chocolate");
      expect(p.id).not.toBe(1);
    });
  });

  it("respects a custom limit", async () => {
    const res = await request(app).get("/api/products/1/related?limit=2");
    expect(res.body.data.length).toBeLessThanOrEqual(2);
  });

  it("404s for a missing product", async () => {
    const res = await request(app).get("/api/products/9999/related");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/products/:id/reviews", () => {
  it("returns curated reviews for a product that has them", async () => {
    const res = await request(app).get("/api/products/1/reviews");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.meta).toHaveProperty("averageRating");
  });

  it("falls back to generic reviews for a product without curated ones", async () => {
    const res = await request(app).get("/api/products/9/reviews");
    expect(res.status).toBe(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it("404s for a missing product", async () => {
    const res = await request(app).get("/api/products/9999/reviews");
    expect(res.status).toBe(404);
  });
});
