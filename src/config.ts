export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
export const WORKSPACE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID || "";
export const MEMBERS_ID = process.env.NEXT_PUBLIC_APPWRITE_MEMBERS_ID || "";
export const IMAGES_BUCKET_ID =
  process.env.NEXT_PUBLIC_APPWRITE_IMAGES_BUCKET_ID || "";

if (!DATABASE_ID || !WORKSPACE_ID) {
  console.error(
    "Environment variables DATABASE_ID or WORKSPACE_ID are missing."
  );
}
