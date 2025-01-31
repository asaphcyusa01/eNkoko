import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  points: number;
  unlocked: boolean;
  unlocked_at: string | null;
}

export function useAchievements() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPoints, setTotalPoints] = useState(0);

  useEffect(() => {
    fetchAchievements();
  }, []);

  async function fetchAchievements() {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data: userAchievements, error: achievementsError } = await supabase
        .from('user_achievements')
        .select(`
          achievement_id,
          unlocked,
          unlocked_at,
          achievements (
            id,
            title,
            description,
            icon,
            points
          )
        `)
        .eq('user_id', user.id);

      if (achievementsError) throw achievementsError;

      const formattedAchievements = userAchievements.map(ua => ({
        id: ua.achievements.id,
        title: ua.achievements.title,
        description: ua.achievements.description,
        icon: ua.achievements.icon,
        points: ua.achievements.points,
        unlocked: ua.unlocked,
        unlocked_at: ua.unlocked_at
      }));

      setAchievements(formattedAchievements);
      setTotalPoints(
        formattedAchievements
          .filter(a => a.unlocked)
          .reduce((sum, a) => sum + a.points, 0)
      );
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  async function unlockAchievement(achievementId: string) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('user_achievements')
        .update({
          unlocked: true,
          unlocked_at: new Date().toISOString()
        })
        .eq('user_id', user.id)
        .eq('achievement_id', achievementId)
        .select()
        .single();

      if (error) throw error;

      setAchievements(prev => prev.map(achievement =>
        achievement.id === achievementId
          ? { ...achievement, unlocked: true, unlocked_at: data.unlocked_at }
          : achievement
      ));

      const achievement = achievements.find(a => a.id === achievementId);
      if (achievement) {
        setTotalPoints(prev => prev + achievement.points);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  return {
    achievements,
    loading,
    error,
    totalPoints,
    unlockAchievement,
    refreshAchievements: fetchAchievements
  };
}