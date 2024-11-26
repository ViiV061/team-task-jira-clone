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

    const { name } = c.req.valid("json");

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
  }
);

export default app;
