import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Navbar from "@/components/navbar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex   w-full min-h-screen bg-background">
        <AppSidebar />
        <div className=" w-full flex flex-col min-h-screen  ">
          <Navbar />
          <main className="    p-3">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}
