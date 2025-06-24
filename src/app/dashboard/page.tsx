"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { LoadingPage } from "@/components/LoadingSpinner";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart3, Calendar, MapPin, Users } from "lucide-react";

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const t = useTranslations();

  useEffect(() => {
    if (status === "loading") return; // Still loading

    if (!session) {
      router.push("/auth/signin");
    }
  }, [session, status, router]);

  if (status === "loading") {
    return <LoadingPage message="Loading dashboard..." />;
  }

  if (!session) {
    return null;
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            🌺 {t("dashboard.title")}
          </h1>
          <p className="text-muted-foreground">{t("dashboard.subtitle")}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("tours.total")}
              </CardTitle>
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                +2 from last month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("bookings.active")}
              </CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">45</div>
              <p className="text-xs text-muted-foreground">
                +12% from last week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t("customers.total")}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">234</div>
              <p className="text-xs text-muted-foreground">+18 new customers</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$12,345</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>{t("dashboard.recentBookings")}</CardTitle>
              <CardDescription>
                {t("dashboard.recentBookingsDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">
                      Pearl Harbor & Circle Island Tour
                    </p>
                    <p className="text-sm text-muted-foreground">
                      John Smith - 2 guests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$299</p>
                    <p className="text-sm text-muted-foreground">Tomorrow</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Hanauma Bay Snorkeling</p>
                    <p className="text-sm text-muted-foreground">
                      Jane Doe - 4 guests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$180</p>
                    <p className="text-sm text-muted-foreground">Dec 26</p>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Diamond Head Sunrise Hike</p>
                    <p className="text-sm text-muted-foreground">
                      Mike Johnson - 2 guests
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">$120</p>
                    <p className="text-sm text-muted-foreground">Dec 27</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>{t("dashboard.quickActions")}</CardTitle>
              <CardDescription>
                {t("dashboard.quickActionsDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full bg-blue-50 border border-blue-200 rounded-md p-3 text-left hover:bg-blue-100 transition-colors">
                <div className="text-blue-600 font-medium text-sm">
                  {t("tours.addNewTour")}
                </div>
              </button>
              <button className="w-full bg-green-50 border border-green-200 rounded-md p-3 text-left hover:bg-green-100 transition-colors">
                <div className="text-green-600 font-medium text-sm">
                  {t("bookings.viewBookings")}
                </div>
              </button>
              <button className="w-full bg-yellow-50 border border-yellow-200 rounded-md p-3 text-left hover:bg-yellow-100 transition-colors">
                <div className="text-yellow-600 font-medium text-sm">
                  {t("dashboard.userManagement")}
                </div>
              </button>
              <button className="w-full bg-purple-50 border border-purple-200 rounded-md p-3 text-left hover:bg-purple-100 transition-colors">
                <div className="text-purple-600 font-medium text-sm">
                  {t("dashboard.reports")}
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
