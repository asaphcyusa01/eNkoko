import React from 'react';
import { useAchievements } from '../hooks/useAchievements';
import { Trophy, Award, Star, Medal, Target, Zap } from 'lucide-react';

const achievementIcons = {
  trophy: Trophy,
  award: Award,
  star: Star,
  medal: Medal,
  target: Target,
  zap: Zap
};

export default function LearningProgress() {
  const { achievements, loading, totalPoints } = useAchievements();

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    );
  }

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const lockedAchievements = achievements.filter(a => !a.unlocked);

  return (
    <div className="space-y-6">
      {/* Points Overview */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-1">Amanota Yawe</h3>
            <p className="text-3xl font-bold">{totalPoints}</p>
          </div>
          <Trophy className="h-12 w-12 opacity-75" />
        </div>
        <div className="mt-4">
          <div className="flex justify-between text-sm">
            <span>Ibihembo Watsinze</span>
            <span>{unlockedAchievements.length} / {achievements.length}</span>
          </div>
          <div className="w-full bg-white/20 rounded-full h-2 mt-2">
            <div
              className="bg-white rounded-full h-2 transition-all duration-500"
              style={{
                width: `${(unlockedAchievements.length / achievements.length) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>

      {/* Unlocked Achievements */}
      {unlockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Ibihembo Watsinze</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {unlockedAchievements.map((achievement) => {
              const Icon = achievementIcons[achievement.icon as keyof typeof achievementIcons];
              return (
                <div
                  key={achievement.id}
                  className="bg-white p-4 rounded-lg border border-green-200 flex items-center gap-4"
                >
                  <div className="p-3 bg-green-100 rounded-lg">
                    <Icon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium">{achievement.points} amanota</span>
                      <span className="text-sm text-gray-500">
                        • {new Date(achievement.unlocked_at!).toLocaleDateString('rw-RW')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Locked Achievements */}
      {lockedAchievements.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Ibihembo Bitaratsinzwe</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lockedAchievements.map((achievement) => {
              const Icon = achievementIcons[achievement.icon as keyof typeof achievementIcons];
              return (
                <div
                  key={achievement.id}
                  className="bg-white p-4 rounded-lg border border-gray-200 flex items-center gap-4 opacity-75"
                >
                  <div className="p-3 bg-gray-100 rounded-lg">
                    <Icon className="h-6 w-6 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold">{achievement.title}</h4>
                    <p className="text-sm text-gray-600">{achievement.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Star className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-medium">{achievement.points} amanota</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}