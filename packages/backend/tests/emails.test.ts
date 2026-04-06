import { convexTest } from "convex-test";
import { describe, expect, it } from "vitest";

import { api } from "../convex/_generated/api";
import schema from "../convex/schema";

const modules = import.meta.glob("../convex/**/*.ts");

describe("emails", () => {
  it("should subscribe a new email", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(api.emails.subscribe, {
      email: "test@example.com",
      name: "Test User",
    });

    const emails = await t.query(api.emails.list, {});
    expect(emails).toHaveLength(1);
    expect(emails[0]?.email).toBe("test@example.com");
    expect(emails[0]?.name).toBe("Test User");
  });

  it("should not duplicate emails", async () => {
    const t = convexTest(schema, modules);

    await t.mutation(api.emails.subscribe, {
      email: "test@example.com",
    });

    await t.mutation(api.emails.subscribe, {
      email: "test@example.com",
    });

    const emails = await t.query(api.emails.list, {});
    expect(emails).toHaveLength(1);
  });
});
