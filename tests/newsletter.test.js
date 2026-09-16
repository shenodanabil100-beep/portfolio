process.env.NODE_ENV = "test";
const request = require("supertest");
const createApp = require("../src/app");

const app = createApp();

describe("POST /api/newsletter", () => {
  it("subscribes a new email address", async () => {
    const res = await request(app).post("/api/newsletter").send({ email: "new-subscriber@example.com" });
    expect(res.status).toBe(201);
    expect(res.body.data.alreadySubscribed).toBe(false);
  });

  it("treats a repeat signup as idempotent (200, not an error)", async () => {
    const email = "repeat-subscriber@example.com";
    await request(app).post("/api/newsletter").send({ email });
    const res = await request(app).post("/api/newsletter").send({ email });
    expect(res.status).toBe(200);
    expect(res.body.data.alreadySubscribed).toBe(true);
  });

  it("normalizes email case when checking for duplicates", async () => {
    await request(app).post("/api/newsletter").send({ email: "CaseTest@Example.com" });
    const res = await request(app).post("/api/newsletter").send({ email: "casetest@example.com" });
    expect(res.body.data.alreadySubscribed).toBe(true);
  });

  it("rejects an invalid email address", async () => {
    const res = await request(app).post("/api/newsletter").send({ email: "not-an-email" });
    expect(res.status).toBe(400);
  });

  it("rejects a missing email", async () => {
    const res = await request(app).post("/api/newsletter").send({});
    expect(res.status).toBe(400);
  });
});
