import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, LayoutDashboard } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { sections, categories } from "@/data/sections";

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const [filter, setFilter] = useState("");

  const filteredSections = filter
    ? sections.filter(
        (s) =>
          s.title.toLowerCase().includes(filter.toLowerCase()) ||
          s.shortTitle.toLowerCase().includes(filter.toLowerCase()) ||
          s.category.toLowerCase().includes(filter.toLowerCase())
      )
    : sections;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="px-3 py-5">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-sidebar-primary to-blue-400 text-sidebar-primary-foreground text-sm font-bold shadow-sm">
            N
          </div>
          {!collapsed && (
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-sidebar-foreground">
                NDG Resource Hub
              </span>
              <span className="text-[11px] text-sidebar-foreground/60">
                Neuroinclusive Performance
              </span>
            </div>
          )}
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {!collapsed && (
          <div className="px-3 pb-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-sidebar-foreground/40" />
              <Input
                placeholder="Filter sections..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="h-8 bg-sidebar-accent border-sidebar-border text-sidebar-foreground placeholder:text-sidebar-foreground/40 pl-8 text-xs"
              />
            </div>
          </div>
        )}

        {/* Dashboard link */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    end
                    className="hover:bg-sidebar-accent"
                    activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                  >
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    {!collapsed && <span>Dashboard</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Grouped sections */}
        {categories.map((category) => {
          const catSections = filteredSections.filter(
            (s) => s.category === category
          );
          if (catSections.length === 0) return null;

          return (
            <SidebarGroup key={category}>
              <SidebarGroupLabel className="text-sidebar-foreground/50 text-[10px] uppercase tracking-widest">
                {category}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {catSections.map((section) => (
                    <SidebarMenuItem key={section.id}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={`/section/${section.id}`}
                          className="hover:bg-sidebar-accent"
                          activeClassName="bg-sidebar-accent text-sidebar-primary font-medium"
                        >
                          <section.icon className="mr-2 h-4 w-4 shrink-0" />
                          {!collapsed && (
                            <span className="truncate text-xs">
                              {section.shortTitle}
                            </span>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>

      <SidebarFooter className="px-3 py-3">
        {!collapsed && (
          <p className="text-[10px] text-sidebar-foreground/40 leading-relaxed">
            &copy; 2026 Neurodiversity Global
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
