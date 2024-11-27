import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { sessionMiddleware } from "@/lib/session-middleware";
import { DATABASE_ID, WORKSPACE_ID } from "@/config";
import { ID } from "node-appwrite";

import { createWorkspaceSchema } from "../schemnas";

const app = new Hono().post(
  "/",
  zValidator("json", createWorkspaceSchema),
  sessionMiddleware,
  async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    if (!user || !user.$id) {
      return c.json({ error: "User not found" }, 400);
    }
    if (!DATABASE_ID || !WORKSPACE_ID) {
      return c.json({ error: "Missing Database or Workspace ID" }, 500);
    }
    // console.log("DATABASE_ID:", DATABASE_ID);
    // console.log("WORKSPACE_ID:", WORKSPACE_ID);

    const { name } = c.req.valid("json");

    try {
      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACE_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
        }
      );
      return c.json({ data: workspace });
    } catch (error) {
      console.error("Error creating workspace:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      return c.json(
        { error: "Failed to create workspace", details: errorMessage },
        500
      );
    }
  }
);

export default app;
