import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Map, BookOpen, AlertTriangle, Trophy, Star, Flame, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Dashboard = () => {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState({ reports: 0, species: 0, recipes: 0 });
  const [userStats, setUserStats] = useState<any>(null);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
        return;
      }
      setUser(session.user);
      loadAllData(session.user.id);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const loadAllData = async (userId: string) => {
    const [reportsData, speciesData, recipesData, userStatsData, achievementsData, recentReports] = await Promise.all([
      supabase.from("reports").select("*", { count: "exact", head: true }).eq("user_id", userId),
      supabase.from("species").select("*", { count: "exact", head: true }),
      supabase.from("recipes").select("*", { count: "exact", head: true }),
      supabase.from("user_stats").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("user_achievements")
        .select("*, achievements(*)")
        .eq("user_id", userId),
      supabase.from("reports")
        .select("*, species(name)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    setStats({
      reports: reportsData.count || 0,
      species: speciesData.count || 0,
      recipes: recipesData.count || 0,
    });

    if (!userStatsData.data) {
      const { data: newStats } = await supabase.from("user_stats").insert({
        user_id: userId,
        total_points: 0,
        level: 1,
        reports_count: reportsData.count || 0,
      }).select().single();
      setUserStats(newStats);
    } else {
      setUserStats(userStatsData.data);
    }

    setAchievements(achievementsData.data || []);
    setRecentActivity(recentReports.data || []);
  };

  const getIconForAchievement = (iconName: string) => {
    const icons: any = {
      Seedling: Star,
      Shield: AlertTriangle,
      Award: Trophy,
      ChefHat: BookOpen,
      Flame: Flame,
      Trophy: Trophy,
      Crown: Star,
    };
    return icons[iconName] || Star;
  };

  const chartData = [
    { name: "Mon", reports: 2 },
    { name: "Tue", reports: 3 },
    { name: "Wed", reports: 1 },
    { name: "Thu", reports: 4 },
    { name: "Fri", reports: 2 },
    { name: "Sat", reports: 5 },
    { name: "Sun", reports: 3 },
  ];

  const nextLevelPoints = userStats ? userStats.level * 100 : 100;
  const levelProgress = userStats ? (userStats.total_points % 100) : 0;

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Track your conservation journey.</p>
        </div>

        {/* Level & Progress Section */}
        <Card className="mb-8 bg-gradient-to-r from-primary/10 to-accent/10 border-2">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className="bg-primary rounded-full p-3">
                  <Trophy className="h-8 w-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Level {userStats?.level || 1}</h3>
                  <p className="text-sm text-muted-foreground">{userStats?.total_points || 0} total points</p>
                </div>
              </div>
              <div className="text-right">
                <Badge variant="secondary" className="mb-2">
                  <Flame className="h-3 w-3 mr-1" />
                  {userStats?.streak_days || 0} day streak
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress to Level {(userStats?.level || 1) + 1}</span>
                <span>{levelProgress}/{nextLevelPoints}</span>
              </div>
              <Progress value={(levelProgress / nextLevelPoints) * 100} className="h-3" />
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
                Reports
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.reports}</p>
              <p className="text-xs text-muted-foreground mt-1">Invasive species sightings</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Camera className="h-5 w-5 text-primary" />
                Species
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.species}</p>
              <p className="text-xs text-muted-foreground mt-1">In database</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-accent" />
                Recipes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{stats.recipes}</p>
              <p className="text-xs text-muted-foreground mt-1">Available recipes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Points
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-foreground">{userStats?.total_points || 0}</p>
              <p className="text-xs text-muted-foreground mt-1">Total earned</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Activity Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Weekly Activity
              </CardTitle>
              <CardDescription>Your reports over the past week</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="name" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line type="monotone" dataKey="reports" stroke="hsl(var(--primary))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest contributions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity: any) => (
                    <div key={activity.id} className="flex items-start gap-3 pb-3 border-b last:border-0">
                      <div className="bg-primary/10 rounded-full p-2">
                        <AlertTriangle className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          Reported {activity.species?.name || 'Unknown species'}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No recent activity</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5" />
              Achievements ({achievements.length}/7)
            </CardTitle>
            <CardDescription>Unlock achievements by contributing to conservation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">
              {achievements.map((achievement: any) => {
                const Icon = getIconForAchievement(achievement.achievements.icon);
                return (
                  <div
                    key={achievement.id}
                    className="flex flex-col items-center text-center p-4 rounded-lg bg-accent/10 border-2 border-primary"
                  >
                    <div className="bg-primary rounded-full p-3 mb-2">
                      <Icon className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <h4 className="font-semibold text-sm mb-1">{achievement.achievements.name}</h4>
                    <p className="text-xs text-muted-foreground mb-2">{achievement.achievements.description}</p>
                    <Badge variant="secondary" className="text-xs">
                      +{achievement.achievements.points} pts
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Button asChild className="w-full" size="lg">
                <Link to="/identify">
                  <Camera className="h-5 w-5 mr-2" />
                  Identify Plant
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Button asChild variant="secondary" className="w-full" size="lg">
                <Link to="/map">
                  <Map className="h-5 w-5 mr-2" />
                  View Map
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Button asChild variant="secondary" className="w-full" size="lg">
                <Link to="/recipes">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Browse Recipes
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link to="/identify">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  Report Sighting
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
