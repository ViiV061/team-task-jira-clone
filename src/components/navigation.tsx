import Link from "next/link";
import { SettingsIcon, UsersIcon } from "lucide-react";
import {
  GoCheckCircle,
  GoCheckCircleFill,
  GoHome,
  GoHomeFill,
} from "react-icons/go";
import { cn } from "@/lib/utils";

const routes = [
  {
    label: "Home",
    href: "/",
    icon: GoHome,
    activaIcon: GoHomeFill,
  },
  {
    label: "My Tasks",
    href: "/tasks",
    icon: GoCheckCircle,
    activaIcon: GoCheckCircleFill,
  },
  {
    label: "Settings",
    href: "/settings",
    icon: SettingsIcon,
    activaIcon: SettingsIcon,
  },
  {
    label: "Members",
    href: "/members",
    icon: UsersIcon,
    activaIcon: UsersIcon,
  },
];

export const Navigation = () => {
  return (
    <ul className="flex flex-col">
      {routes.map((item) => {
        const isActive = false;
        const Icon = isActive ? item.activaIcon : item.icon;

        return (
          <Link key={item.href} href={item.href}>
            <div
              className={cn(
                "flex items-center gap-2.5 p-2.5 font-medium hover:text-primary transition text-neutral-500 ",
                isActive && "bg-white shadow-sm hover:opacity-100 text-primary"
              )}
            >
              <Icon className="size-5 text-neutral-500" />
              <span>{item.label}</span>
            </div>
          </Link>
        );
      })}
    </ul>
  );
};
