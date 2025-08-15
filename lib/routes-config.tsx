type PageRoutesType = {
  title: string;
  items: PageRoutesItemType;
};

type PageRoutesItemType = {
  title: string;
  href: string;
  icon?: string;
  isComing?: boolean;
  items?: PageRoutesItemType;
}[];

export const page_routes: PageRoutesType[] = [
  {
    title: "",
    items: [
      {
        title: "Dashboard",
        href: "/dashboard/default",
        icon: "PieChart"
      },
      { title: "Missões", href: "/dashboard/pages/missions", icon: "Target" },
      { title: "Recompensas", href: "/dashboard/pages/rewards", icon: "Trophy" },
      { title: "Afiliados", href: "/dashboard/pages/influencer", icon: "Share2" },
      { title: "Cupons", href: "/dashboard/pages/coupons", icon: "Ticket" },
      { title: "Posts", href: "/dashboard/pages/posts", icon: "Newspaper" },
      { title: "Interações", href: "/dashboard/pages/interactions", icon: "MessageSquare" },
      { title: "Backoffice", href: "/dashboard/pages/backoffice", icon: "Users" },
      { title: "Níveis", href: "/dashboard/pages/levels", icon: "Layers" },
    ]
  }
];
  //
  // {
  //   title: "Settings",
  //   href: "/dashboard/pages/settings",
  //   icon: "Settings"
  // },
  // {
  //   title: "Authentication",
  //   href: "/",
  //   icon: "Fingerprint",

  //   items: [
  //     { title: "Login", href: "/login" },
  //     { title: "Register", href: "/register" }
  //   ]
  // },
  // {
  //   title: "Error Pages",
  //   href: "/",
  //   icon: "Fingerprint",
  //   items: [
  //     { title: "404", href: "/pages/error/404" },
  //     { title: "500", href: "/pages/error/500" }
  //   ]
  // }