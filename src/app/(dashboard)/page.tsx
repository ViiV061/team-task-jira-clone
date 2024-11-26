import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

export default async function Home() {
  const user = await getCurrent();

  // console.log({ user });

  if (!user) redirect("/sign-in");
  return (
    <div className="bg-blue-400 p-5 h-full">
      <CreateWorkspaceForm />
    </div>
  );
}
