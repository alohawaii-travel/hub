import { redirect } from "next/navigation";

export default function RootPage() {
  // Redirect to signin page since this is a staff-only application
  redirect("/auth/signin");
}
