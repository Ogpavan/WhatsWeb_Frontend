"use client"

import * as React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faComments,
  faUserGroup,
  faFileLines,
  faKey,
  faChartColumn,
  faCreditCard,
  faGear,
  faCirclePlus,
  faChain
} from "@fortawesome/free-solid-svg-icons"
import { Link, useLocation } from "react-router-dom";

import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Pawan Pal",
    email: "pawan@whatsaas.io",
    avatar: "/avatars/shadcn.jpg",
  },
 navMain: [
    {
      title: "Connect",
      url: "/connect", // <-- use route path
      icon: faChain,
      isActive: false,
    },
    {
      title: "Campaigns",
      url: "/campaigns", // <-- use route path
      icon: faComments,
      isActive: true,
    },
    {
      title: "Contacts",
      url: "/contacts", // <-- use route path
      icon: faUserGroup,
      isActive: false,
    },
    {
      title: "Templates",
      url: "/templates", // <-- use route path
      icon: faFileLines,
      isActive: false,
    },
    {
      title: "API Access",
      url: "/api-access", // <-- use route path
      icon: faKey,
      isActive: false,
    },
    {
      title: "Analytics",
      url: "/analytics", // <-- use route path
      icon: faChartColumn,
      isActive: false,
    },
    {
      title: "Billing",
      url: "/billing", // <-- use route path
      icon: faCreditCard,
      isActive: false,
    },
    {
      title: "Settings",
      url: "/settings", // <-- use route path
      icon: faGear,
      isActive: false,
    },
 
  ],
  campaigns: [
    {
      name: "Diwali Offer Blast",
      date: "10 Oct 2025",
      status: "Completed",
      messages: "2,400 sent",
      preview: "Happy Diwali! 🎉 Check out our festive offers today!",
    },
    {
      name: "New Product Launch",
      date: "15 Oct 2025",
      status: "Scheduled",
      messages: "3,200 queued",
      preview: "Introducing our new eco-friendly product line 🌱",
    },
    {
      name: "Feedback Campaign",
      date: "18 Oct 2025",
      status: "Running",
      messages: "1,800 sent",
      preview: "We’d love your feedback on our latest features 💬",
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const [activeItem, setActiveItem] = React.useState(data.navMain[0])
  const [items, setItems] = React.useState(data.campaigns)
  const { setOpen } = useSidebar()

  return (
    <Sidebar
      collapsible="icon"
      className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
      {...props}
    >
      {/* Primary Sidebar (Icon Strip) */}
      <Sidebar collapsible="none" className="md:w-12 flex-shrink-0 max-w-sm border-r !bg-[#022e20]  ">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem className="flex justify-center">
              <SidebarMenuButton size="lg" asChild>
                <Link to="/connect" className="flex justify-center items-center">
                  <div className="flex aspect-square size-6 items-center justify-center rounded-lg bg-[#064731]">
                    <FontAwesomeIcon icon={faCirclePlus} className="size-4 text-white" />
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupContent className="px-1.5 md:px-0">
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      tooltip={{ children: item.title, hidden: false }}
                      asChild
                      isActive={location.pathname === item.url}
                      className="px-2.5 md:px-2"
                    >
                      <Link to={item.url}>
                        <FontAwesomeIcon
                          icon={item.icon}
                          className={`rounded-full ${location.pathname === item.url ? "text-[#064731]" : "text-white"}`}
                        />
                        <span className="hidden md:inline">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <NavUser user={data.user} />
        </SidebarFooter>
      </Sidebar>

      {/* Secondary Sidebar (Expanded Section) */}
      <Sidebar collapsible="none" className="hidden flex-1 md:flex   bg-white/80    ">
       <SidebarHeader className="border-b ">
          <span className="  font-semibold  ">
            Whatsappweb
          </span>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup className="px-0">
            <SidebarGroupContent>
              {activeItem.title === "Connect" && (
              <aside className="      p-3 flex flex-col justify-between">
  <div>
    <h2 className="text-lg font-semibold text-emerald-700 dark:text-emerald-400 mb-4 leading-tight">
      How to Connect WhatsApp Web
    </h2>

    <ol className="space-y-3 text-sm text-slate-700 dark:text-slate-300 list-decimal list-inside">
      <li>
        Open <span className="font-semibold">WhatsApp</span> on your mobile.
      </li>
      <li>
        Tap the <span className="font-semibold">three dots</span> (Android) or go to <span className="font-semibold">Settings</span> (iPhone).
      </li>
      <li>Select <span className="font-semibold">Linked Devices</span>.</li>
      <li>Tap <span className="font-semibold">Link a Device</span>.</li>
      <li>Click <span className="font-semibold">Connect</span> here to show the QR.</li>
      <li>Scan the QR with your phone.</li>
      <li>Your WhatsApp account will connect securely.</li>
    </ol>
  </div>

  <div className="bg-emerald-100 dark:bg-slate-700/50 text-sm text-emerald-900 dark:text-emerald-300 rounded-md p-3 mt-6">
    💡 <span className="font-semibold">Tip:</span> Keep your phone connected to the internet while linking WhatsApp Web.
  </div>
</aside>

              )}
              {activeItem.title === "Campaigns" &&
                items.map((campaign) => (
                  <a
                    href="#"
                    key={campaign.name}
                    className="flex flex-col items-start gap-2 border-b p-4 text-sm leading-tight hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                  >
                    <div className="flex w-full items-center gap-2">
                      <span className="font-medium">{campaign.name}</span>
                      <span className="ml-auto text-xs">{campaign.status}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {campaign.date} • {campaign.messages}
                    </span>
                    <span className="line-clamp-2 w-[260px] whitespace-break-spaces text-xs">
                      {campaign.preview}
                    </span>
                  </a>
                ))}

              {activeItem.title === "API Access" && (
                <div className="p-4 text-sm text-muted-foreground">
                  <p className="mb-2 font-medium text-foreground">Public REST API</p>
                  <p>
                    Use our REST API to send messages programmatically.
                    <br />
                    Example endpoint:
                  </p>
                  <code className="block rounded bg-gray-100 p-2 mt-2 text-xs">
                    POST https://api.whatsaas.io/v1/send-message
                  </code>
                  <p className="mt-2">
                    <span className="font-semibold">API Key:</span> sk_live_************
                  </p>
                </div>
              )}

              {activeItem.title === "Billing" && (
                <div className="p-4 text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-2">Current Plan</p>
                  <p>Pro Plan — ₹1499/month</p>
                  <p className="mt-2 text-xs">Next billing: 01 Nov 2025</p>
                </div>
              )}
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
    </Sidebar>
  )
}