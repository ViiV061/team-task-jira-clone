export const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || "";
export const WORKSPACE_ID =
  process.env.NEXT_PUBLIC_APPWRITE_WORKSPACES_ID || "";

if (!DATABASE_ID || !WORKSPACE_ID) {
  console.error(
    "Environment variables DATABASE_ID or WORKSPACE_ID are missing."
  );
}
