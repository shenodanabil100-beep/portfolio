process.env.NODE_ENV = "test";
const request = require("supertest");
const createApp = require("../src/app");

const app = createApp();

describe("POST /api/cart/totals", () => {
  it("computes subtotal, shipping, tax, and total for a simple cart", async () => {
    // product 9: Classic Hard Candy Assortment, $5.49 x 2 = $10.98 (below free-shipping threshold)
    const res = await request(app)
      .post("/api/cart/totals")
      .send({ items: [{ id: 9, qty: 2 }] });

    expect(res.status).toBe(200);
    const { totals } = res.body.data;
    expect(totals.subtotal).toBeCloseTo(10.98, 2);
    expect(totals.shipping).toBeCloseTo(5.99, 2); // under $35 threshold
    expect(totals.tax).toBeCloseTo(10.98 * 0.065, 2);
    expect(totals.total).toBeCloseTo(10.98 + 5.99 + 10.98 * 0.065, 2);
  });

  it("gives free shipping once the subtotal crosses the threshold", async () => {
    // product 13: Deluxe Sweet Tooth Gift Box, $34.99 -> just under $35, add a $1 item to cross it
    const res = await request(app)
      .post("/api/cart/totals")
      .send({ items: [{ id: 13, qty: 1 }, { id: 9, qty: 1 }] }); // 34.99 + 5.49 = 40.48

    expect(res.status).toBe(200);
    expect(res.body.data.totals.shipping).toBe(0);
  });

  it("applies a valid promo code discount", async () => {
    const noPromo = await request(app)
      .post("/api/cart/totals")
      .send({ items: [{ id: 1, qty: 1 }] });
    const withPromo = await request(app)
      .post("/api/cart/totals")
      .send({ items: [{ id: 1, qty: 1 }], promoCode: "SWEET10" });

    expect(withPromo.body.data.totals.discount).toBeCloseTo(8.99 * 0.1, 2);
    expect(withPromo.body.data.totals.total).toBeLessThan(noPromo.body.data.totals.total);
  });

  it("rejects an invalid promo code", async () => {
    const res = await request(app)
      .post("/api/cart/totals")
      .send({ items: [{ id: 1, qty: 1 }], promoCode: "NOTREAL" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_promo_code");
  });

  it("drops unknown product ids and reports them, still pricing valid ones", async () => {
    const res = await request(app)
      .post("/api/cart/totals")
      .send({ items: [{ id: 1, qty: 1 }, { id: 99999, qty: 1 }] });

    expect(res.status).toBe(200);
    expect(res.body.data.invalidIds).toEqual([99999]);
    expect(res.body.data.lines.length).toBe(1);
  });

  it("defaults qty to 1 when omitted, and floors fractional/invalid qty to a positive int", async () => {
    const res = await request(app)
      .post("/api/cart/totals")
      .send({ items: [{ id: 1 }, { id: 2, qty: 2.9 }] });

    expect(res.status).toBe(200);
    const line1 = res.body.data.lines.find((l) => l.product.id === 1);
    const line2 = res.body.data.lines.find((l) => l.product.id === 2);
    expect(line1.qty).toBe(1);
    expect(line2.qty).toBe(2);
  });

  it("rejects a non-array items payload", async () => {
    const res = await request(app).post("/api/cart/totals").send({ items: "not-an-array" });
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_items");
  });

  it("rejects an empty items array", async () => {
    const res = await request(app).post("/api/cart/totals").send({ items: [] });
    expect(res.status).toBe(400);
  });

  it("rejects items missing an id", async () => {
    const res = await request(app).post("/api/cart/totals").send({ items: [{ qty: 2 }] });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/cart/promo/validate", () => {
  it("confirms a valid promo code", async () => {
    const res = await request(app).post("/api/cart/promo/validate").send({ code: "sodak15" });
    expect(res.status).toBe(200);
    expect(res.body.data.valid).toBe(true);
    expect(res.body.data.discountRate).toBeCloseTo(0.15);
  });

  it("flags an invalid promo code without erroring", async () => {
    const res = await request(app).post("/api/cart/promo/validate").send({ code: "NOPE" });
    expect(res.status).toBe(200);
    expect(res.body.data.valid).toBe(false);
  });

  it("400s when no code is provided", async () => {
    const res = await request(app).post("/api/cart/promo/validate").send({});
    expect(res.status).toBe(400);
  });
});
