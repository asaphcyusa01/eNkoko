import React from 'react';
import { useParams } from 'react-router-dom';
import { Play, Clock, Award, Download } from 'lucide-react';
import CourseProgress from '../components/CourseProgress';
import CourseModule from '../components/CourseModule';
import CourseInstructor from '../components/CourseInstructor';

const courseData = {
  id: '1',
  title: 'Gukumira Indwara z\'Inkoko',
  description: 'Menya uko wakumira no kuvura indwara z\'inkoko. Iga ibijyanye n\'indwara zose zifata inkoko, uburyo bwo kuzirinda n\'ubwo kuzivura.',
  thumbnail: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80',
  duration: 'Amasaha 2',
  modules: [
    {
      id: 'm1',
      title: 'Intangiriro ku Ndwara z\'Inkoko',
      duration: 'Iminota 15',
      type: 'video' as const,
      completed: true,
      locked: false
    },
    {
      id: 'm2',
      title: 'Indwara Ziterwa na Bakteriya',
      duration: 'Iminota 25',
      type: 'video' as const,
      completed: true,
      locked: false
    },
    {
      id: 'm3',
      title: 'Indwara Ziterwa na Virusi',
      duration: 'Iminota 20',
      type: 'reading' as const,
      completed: false,
      locked: false
    },
    {
      id: 'm4',
      title: 'Uburyo bwo Kurinda Indwara',
      duration: 'Iminota 30',
      type: 'video' as const,
      completed: false,
      locked: true
    }
  ],
  instructor: {
    name: 'Dr. Uwase Sarah',
    title: 'Inzobere mu Buzima bw\'Inkoko',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80',
    bio: 'Dr. Uwase afite uburambe bw\'imyaka 15 mu bijyanye n\'ubuzima bw\'inkoko no gukumira indwara.'
  },
  resources: [
    {
      id: 'r1',
      title: 'Urutonde rwo Gukumira Indwara',
      type: 'PDF',
      size: '2.4 MB'
    },
    {
      id: 'r2',
      title: 'Gahunda y\'Inkingo',
      type: 'Excel',
      size: '1.8 MB'
    }
  ]
};

export default function CourseDetail() {
  const { courseId } = useParams();
  const [activeModule, setActiveModule] = React.useState<string | null>(null);

  const handleModuleClick = (moduleId: string) => {
    setActiveModule(moduleId);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <img
                src={courseData.thumbnail}
                alt={courseData.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <h1 className="text-3xl font-bold mb-4">{courseData.title}</h1>
                <p className="text-gray-600 mb-6">{courseData.description}</p>
                <div className="flex items-center gap-6 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-green-600" />
                    {courseData.duration}
                  </span>
                  <span className="flex items-center gap-2">
                    <Play className="h-5 w-5 text-green-600" />
                    Amasomo {courseData.modules.length}
                  </span>
                  <span className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-600" />
                    Icyemezo
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Ibikubiye mu Isomo</h2>
              <div className="space-y-2">
                {courseData.modules.map((module) => (
                  <CourseModule
                    key={module.id}
                    module={module}
                    onModuleClick={handleModuleClick}
                  />
                ))}
              </div>
            </div>

            <CourseInstructor {...courseData.instructor} />
          </div>

          <div className="space-y-6">
            <CourseProgress
              totalModules={courseData.modules.length}
              completedModules={courseData.modules.filter(m => m.completed).length}
            />

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Ibikoresho by\'Isomo</h3>
              <div className="space-y-3">
                {courseData.resources.map((resource) => (
                  <div
                    key={resource.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div>
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-gray-600">{resource.type} • {resource.size}</p>
                    </div>
                    <button className="text-orange-600 hover:text-orange-700">
                      <Download className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}