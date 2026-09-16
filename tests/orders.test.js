process.env.NODE_ENV = "test";
const request = require("supertest");
const createApp = require("../src/app");

const app = createApp();

const validCustomer = {
  fullName: "Jane Doe",
  email: "jane@example.com",
  phone: "605-555-0123",
  address: "123 Main St",
  city: "Sioux Falls",
  state: "SD",
  zip: "57104",
};

function orderPayload(overrides = {}) {
  return {
    customer: validCustomer,
    payment: { method: "card", cardNumber: "4242 4242 4242 4242", cardExpiry: "12/28", cardCvc: "123" },
    items: [{ id: 1, qty: 2 }],
    ...overrides,
  };
}

describe("POST /api/orders", () => {
  it("places a valid order and returns an order number", async () => {
    const res = await request(app).post("/api/orders").send(orderPayload());
    expect(res.status).toBe(201);
    expect(res.body.data.orderNumber).toMatch(/^SST-\d{6}$/);
    expect(res.body.data.customer.firstName).toBe("Jane");
    expect(res.body.data.totals.total).toBeGreaterThan(0);
  });

  it("never echoes back the full card number", async () => {
    const res = await request(app).post("/api/orders").send(orderPayload());
    const body = JSON.stringify(res.body);
    expect(body).not.toContain("4242 4242 4242 4242");
  });

  it("allows non-card payment methods without card fields", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(orderPayload({ payment: { method: "paypal" } }));
    expect(res.status).toBe(201);
  });

  it("rejects an order missing required customer fields", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(orderPayload({ customer: { ...validCustomer, email: "" } }));
    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty(["customer.email"]);
  });

  it("rejects an invalid email format", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(orderPayload({ customer: { ...validCustomer, email: "not-an-email" } }));
    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty(["customer.email"]);
  });

  it("rejects an invalid zip code", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(orderPayload({ customer: { ...validCustomer, zip: "abc" } }));
    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty(["customer.zip"]);
  });

  it("rejects a card payment missing card fields", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(orderPayload({ payment: { method: "card" } }));
    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty(["payment.cardNumber"]);
  });

  it("rejects an unknown payment method", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(orderPayload({ payment: { method: "bitcoin" } }));
    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty(["payment.method"]);
  });

  it("rejects an invalid promo code", async () => {
    const res = await request(app).post("/api/orders").send(orderPayload({ promoCode: "FAKECODE" }));
    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty("promoCode");
  });

  it("rejects an order with no items", async () => {
    const res = await request(app).post("/api/orders").send(orderPayload({ items: [] }));
    expect(res.status).toBe(400);
  });

  it("rejects an order where every item id is invalid", async () => {
    const res = await request(app)
      .post("/api/orders")
      .send(orderPayload({ items: [{ id: 999999, qty: 1 }] }));
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("empty_cart");
  });
});

describe("GET /api/orders/:orderNumber", () => {
  it("retrieves a previously placed order", async () => {
    const placed = await request(app).post("/api/orders").send(orderPayload());
    const orderNumber = placed.body.data.orderNumber;

    const res = await request(app).get(`/api/orders/${orderNumber}`);
    expect(res.status).toBe(200);
    expect(res.body.data.orderNumber).toBe(orderNumber);
    expect(res.body.data.customer.email).toBe("jane@example.com");
  });

  it("returns 404 for an unknown order number", async () => {
    const res = await request(app).get("/api/orders/SST-000000");
    expect(res.status).toBe(404);
  });
});
