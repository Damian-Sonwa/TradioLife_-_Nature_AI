import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, Target, Shield, Flame, Award, ChefHat, TrendingUp, Star, Users, Crown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import Navbar from "@/components/Navbar";

interface Challenge {
  id: string;
  title: string;
  description: string;
  challenge_type: string;
  goal_count: number;
  points_reward: number;
  icon: string;
  is_active: boolean;
}

interface ChallengeProgress {
  challenge_id: string;
  current_count: number;
  completed: boolean;
}

interface LeaderboardEntry {
  user_id: string;
  total_points: number;
  level: number;
  reports_count: number;
  identifications_count: number;
  achievement_count: number;
  rank: number;
}

const Challenges = () => {
  const [user, setUser] = useState<any>(null);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [progress, setProgress] = useState<Map<string, ChallengeProgress>>(new Map());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userStats, setUserStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
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
  }, [navigate]);

  const loadAllData = async (userId: string) => {
    try {
      const [challengesData, progressData, leaderboardData, statsData] = await Promise.all([
        supabase.from("challenges").select("*").eq("is_active", true).order("points_reward", { ascending: false }),
        supabase.from("user_challenge_progress").select("*").eq("user_id", userId),
        supabase.from("leaderboard").select("*").limit(10),
        supabase.from("user_stats").select("*").eq("user_id", userId).maybeSingle(),
      ]);

      if (challengesData.error) throw challengesData.error;
      setChallenges(challengesData.data || []);

      if (!progressData.error && progressData.data) {
        const progressMap = new Map();
        progressData.data.forEach((p: any) => {
          progressMap.set(p.challenge_id, p);
        });
        setProgress(progressMap);
      }

      if (!leaderboardData.error) {
        setLeaderboard(leaderboardData.data || []);
      }

      if (statsData.data) {
        setUserStats(statsData.data);
      }
    } catch (error) {
      console.error("Error loading challenges:", error);
      toast.error("Failed to load challenges");
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      Trophy, Target, Shield, Flame, Award, ChefHat, TrendingUp, Star, Crown
    };
    return icons[iconName] || Trophy;
  };

  const getChallengeProgress = (challengeId: string) => {
    return progress.get(challengeId) || { current_count: 0, completed: false };
  };

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  const ChallengeCard = ({ challenge }: { challenge: Challenge }) => {
    const Icon = getIcon(challenge.icon);
    const challengeProgress = getChallengeProgress(challenge.id);
    const progressPercent = getProgressPercentage(challengeProgress.current_count, challenge.goal_count);

    return (
      <Card className={`overflow-hidden hover:shadow-lg transition-shadow ${challengeProgress.completed ? 'border-primary bg-primary/5' : ''}`}>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`p-2 rounded-lg ${challengeProgress.completed ? 'bg-primary' : 'bg-primary/10'}`}>
                  <Icon className={`h-5 w-5 ${challengeProgress.completed ? 'text-primary-foreground' : 'text-primary'}`} />
                </div>
                <CardTitle className="text-lg">{challenge.title}</CardTitle>
              </div>
              <CardDescription>{challenge.description}</CardDescription>
            </div>
            <Badge variant={challengeProgress.completed ? "default" : "secondary"} className="flex-shrink-0">
              {challengeProgress.completed ? 'Completed!' : `${challenge.points_reward} pts`}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">
                {challengeProgress.current_count} / {challenge.goal_count}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
          </div>

          {!challengeProgress.completed && (
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => {
                switch (challenge.challenge_type) {
                  case 'identification':
                    navigate('/identify');
                    break;
                  case 'reporting':
                    navigate('/map?report=true');
                    break;
                  case 'recipe':
                    navigate('/recipes');
                    break;
                  default:
                    navigate('/dashboard');
                }
              }}
            >
              Start Challenge
            </Button>
          )}

          {challengeProgress.completed && (
            <div className="bg-primary/10 p-3 rounded-lg text-center">
              <Trophy className="h-5 w-5 mx-auto mb-1 text-primary" />
              <p className="text-sm font-medium text-primary">Challenge Complete!</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-medium text-muted-foreground">#{rank}</span>;
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Challenges & Leaderboard</h1>
          <p className="text-muted-foreground">
            Complete challenges to earn points and climb the leaderboard
          </p>
        </div>

        {/* User Stats Overview */}
        {userStats && (
          <div className="grid md:grid-cols-4 gap-4 mb-8">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Star className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="text-3xl font-bold text-foreground">{userStats.total_points}</p>
                  <p className="text-sm text-muted-foreground">Total Points</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
                  <p className="text-3xl font-bold text-foreground">Level {userStats.level}</p>
                  <p className="text-sm text-muted-foreground">Current Level</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Target className="h-8 w-8 mx-auto mb-2 text-blue-500" />
                  <p className="text-3xl font-bold text-foreground">{userStats.identifications_count}</p>
                  <p className="text-sm text-muted-foreground">Identifications</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
                  <p className="text-3xl font-bold text-foreground">{userStats.streak_days}</p>
                  <p className="text-sm text-muted-foreground">Day Streak</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        <Tabs defaultValue="challenges" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="challenges">Active Challenges</TabsTrigger>
            <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
          </TabsList>

          <TabsContent value="challenges">
            {loading ? (
              <div className="text-center py-12">Loading challenges...</div>
            ) : challenges.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-semibold mb-2">No active challenges</h3>
                  <p className="text-muted-foreground">Check back later for new challenges</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {challenges.map(challenge => (
                  <ChallengeCard key={challenge.id} challenge={challenge} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="leaderboard">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Top Conservationists
                </CardTitle>
                <CardDescription>
                  The most active members in our community
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      No rankings yet. Be the first!
                    </p>
                  ) : (
                    leaderboard.map((entry, index) => (
                      <div
                        key={entry.user_id}
                        className={`flex items-center gap-4 p-4 rounded-lg ${
                          entry.user_id === user.id
                            ? 'bg-primary/10 border border-primary'
                            : 'bg-secondary/50'
                        }`}
                      >
                        <div className="flex items-center justify-center w-10">
                          {getRankBadge(entry.rank)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold text-foreground">
                              {entry.user_id === user.id ? 'You' : `User ${entry.user_id.slice(0, 8)}`}
                            </p>
                            <Badge variant="outline" className="text-xs">
                              Level {entry.level}
                            </Badge>
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>{entry.identifications_count} IDs</span>
                            <span>{entry.reports_count} Reports</span>
                            <span>{entry.achievement_count} Achievements</span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-2xl font-bold text-primary">{entry.total_points}</p>
                          <p className="text-xs text-muted-foreground">points</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Challenges;

