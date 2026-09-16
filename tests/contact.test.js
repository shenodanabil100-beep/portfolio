process.env.NODE_ENV = "test";
const request = require("supertest");
const createApp = require("../src/app");

const app = createApp();

const validPayload = {
  name: "Jane Doe",
  email: "jane@example.com",
  subject: "Order inquiry",
  message: "Do you ship to Canada?",
};

describe("POST /api/contact", () => {
  it("accepts a fully filled-out form", async () => {
    const res = await request(app).post("/api/contact").send(validPayload);
    expect(res.status).toBe(201);
    expect(res.body.message).toMatch(/thank you/i);
    expect(res.body.data).toHaveProperty("id");
  });

  it("rejects a missing name", async () => {
    const res = await request(app).post("/api/contact").send({ ...validPayload, name: "" });
    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty("name");
  });

  it("rejects an invalid email", async () => {
    const res = await request(app).post("/api/contact").send({ ...validPayload, email: "nope" });
    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty("email");
  });

  it("rejects a missing subject", async () => {
    const res = await request(app).post("/api/contact").send({ ...validPayload, subject: "" });
    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty("subject");
  });

  it("rejects a missing message", async () => {
    const res = await request(app).post("/api/contact").send({ ...validPayload, message: "  " });
    expect(res.status).toBe(400);
    expect(res.body.fields).toHaveProperty("message");
  });

  it("reports all missing fields at once", async () => {
    const res = await request(app).post("/api/contact").send({});
    expect(res.status).toBe(400);
    expect(Object.keys(res.body.fields).sort()).toEqual(["email", "message", "name", "subject"]);
  });
});
