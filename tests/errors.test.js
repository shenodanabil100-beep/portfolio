process.env.NODE_ENV = "test";
const request = require("supertest");
const createApp = require("../src/app");

const app = createApp();

describe("Error handling", () => {
  it("returns 404 JSON for an unknown route", async () => {
    const res = await request(app).get("/api/does-not-exist");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("not_found");
  });

  it("returns 400 JSON for malformed request bodies", async () => {
    const res = await request(app)
      .post("/api/contact")
      .set("Content-Type", "application/json")
      .send("{not valid json");
    expect(res.status).toBe(400);
    expect(res.body.error).toBe("invalid_json");
  });
});

describe("Static frontend + SPA-style fallback", () => {
  it("serves the storefront's index.html at the root", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/html/);
    expect(res.text).toMatch(/SoDak Sweet Tooth/);
  });

  it("serves a named page (shop.html) directly", async () => {
    const res = await request(app).get("/shop.html");
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/Shop All Sweets/);
  });

  it("serves static CSS and JS assets", async () => {
    const css = await request(app).get("/css/style.css");
    const js = await request(app).get("/js/main.js");
    expect(css.status).toBe(200);
    expect(js.status).toBe(200);
  });

  it("falls back to index.html for an unknown GET path (not a JSON 404)", async () => {
    const res = await request(app).get("/some-random-page");
    expect(res.status).toBe(200);
    expect(res.text).toMatch(/SoDak Sweet Tooth/);
  });

  it("still returns a JSON 404 for a non-GET request to an unknown path", async () => {
    const res = await request(app).post("/some-random-page");
    expect(res.status).toBe(404);
    expect(res.body.error).toBe("not_found");
  });
});
