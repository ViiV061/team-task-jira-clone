import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/actions";
import { getWorkspaces } from "@/features/workspaces/actions";

export default async function Home() {
  const user = await getCurrent();
  if (!user) redirect("/sign-in");

  const workspaces = await getWorkspaces();
  console.log("User:", user);
  // console.log("Workspaces:", workspaces);
  if (workspaces.total === 0) {
    redirect("/workspaces/create");
  } else {
    redirect(`/workspace/${workspaces.documents[0].$id}`);
  }

  // return <div className="bg-blue-400 p-5 h-full">Home page</div>;
}
