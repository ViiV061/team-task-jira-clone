import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";

import { MemberRole } from "@/features/members/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInvaiteCode } from "@/lib/utils";
import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  MEMBERS_ID,
  WORKSPACE_ID,
} from "@/config";
import { ID, Query } from "node-appwrite";

import { createWorkspaceSchema } from "../schemnas";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const user = c.get("user"); // Show the user's workspaces
    const databases = c.get("databases");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    const workspaceIds = members.documents.map((member) => member.workspaceId);

    if (!members.documents.length) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACE_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspaceIds)]
    );

    return c.json({ data: workspaces });
  })
  .post(
    "/",
    zValidator("form", createWorkspaceSchema),
    sessionMiddleware,
    async (c) => {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      if (!user || !user.$id) {
        return c.json({ error: "User not found" }, 400);
      }
      if (!DATABASE_ID || !WORKSPACE_ID) {
        return c.json({ error: "Missing Database or Workspace ID" }, 500);
      }
      // console.log("DATABASE_ID:", DATABASE_ID);
      // console.log("WORKSPACE_ID:", WORKSPACE_ID);

      const { name, image } = c.req.valid("form");

      let uploadedImageUrl: string | undefined;

      if (image instanceof File) {
        const file = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          file.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      }

      try {
        const workspace = await databases.createDocument(
          DATABASE_ID,
          WORKSPACE_ID,
          ID.unique(),
          {
            name,
            userId: user.$id,
            imageUrl: uploadedImageUrl,
            inviteCode: generateInvaiteCode(6),
          }
        );

        await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
          userId: user.$id,
          workspaceId: workspace.$id,
          role: MemberRole.ADMIN,
        });

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
