import { UserButton } from "@/features/auth/components/use-button";
import { MobileSidebar } from "./mobile-sidebar";

export const Navbar = () => {
  return (
    <nav className="flex pt-4 px-6  items-center justify-between">
      <div className=" flex-col hidden lg:flex">
        <h1 className="text-2xl font-semibold">Home</h1>
        <p className="text-muted-foreground">
          Monitor all of your projects and tasks here
        </p>
      </div>
      <MobileSidebar />
      <UserButton />
    </nav>
  );
};
