import React from 'react';
import { useParams } from 'react-router-dom';
import { Play, Clock, Award, Star, Check, ChevronRight, AlertCircle, CheckCircle2, RefreshCcw } from 'lucide-react';
import CourseProgress from '../components/CourseProgress';
import CourseModule from '../components/CourseModule';
import CourseInstructor from '../components/CourseInstructor';
import { useModules } from '../hooks/useModules';
import { useProgress } from '../hooks/useProgress';
import { useCourses } from '../hooks/useCourses';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}

const quizQuestions: QuizQuestion[] = [
  {
    id: 1,
    question: "Ni iyihe mpamvu y'ingenzi ituma tugomba guha inkoko amazi meza?",
    options: [
      "Kugira ngo zikure vuba",
      "Kugira ngo zidacika",
      "Kugira ngo zitarwara",
      "Byose bivuzwe haruguru ni ukuri"
    ],
    correctAnswer: 3
  },
  {
    id: 2,
    question: "Ni kangahe ugomba guhindura amazi y'inkoko ku munsi?",
    options: [
      "Rimwe gusa",
      "Kabiri ku munsi",
      "Gatatu ku munsi",
      "Buri gihe iyo yanduye"
    ],
    correctAnswer: 3
  },
  {
    id: 3,
    question: "Ni ikihe gikoresho cyiza cyo guha inkoko amazi?",
    options: [
      "Ibidomoro",
      "Udusahani",
      "Ibikoresho byabugenewe",
      "Nta tandukaniro"
    ],
    correctAnswer: 2
  }
];

export default function CourseDetail() {
  const { courseId } = useParams();
  const { courses, loading: coursesLoading } = useCourses();
  const { modules, loading: modulesLoading } = useModules(courseId || '');
  const { progress, markAsCompleted } = useProgress();
  
  const [showQuiz, setShowQuiz] = React.useState(false);
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [selectedAnswer, setSelectedAnswer] = React.useState<number | null>(null);
  const [isCorrect, setIsCorrect] = React.useState<boolean | null>(null);
  const [quizCompleted, setQuizCompleted] = React.useState(false);
  const [score, setScore] = React.useState(0);

  const course = courses.find(c => c.id === courseId);

  if (coursesLoading || modulesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Tegereza gato...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600 mb-2">Isomo ntiribonetse</h2>
          <p className="text-gray-600">Isomo ushaka ntiribonetse. Gerageza indi nomero.</p>
        </div>
      </div>
    );
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setIsCorrect(null);
  };

  const handleAnswerSubmit = async () => {
    if (selectedAnswer === null) return;

    const correct = selectedAnswer === quizQuestions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    
    if (correct) {
      setScore(score + 1);
    }

    if (currentQuestion === quizQuestions.length - 1) {
      try {
        await markAsCompleted();
        setQuizCompleted(true);
      } catch (error) {
        console.error('Error marking module as completed:', error);
      }
    } else {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
      }, 1500);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setQuizCompleted(false);
    setScore(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Course Header */}
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-64 object-cover"
              />
              <div className="p-6">
                <div className="flex flex-wrap items-center gap-2 mb-4">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    {course.level}
                  </span>
                  <div className="flex items-center gap-1">
                    <Clock className="h-5 w-5 text-green-600" />
                    <span className="text-gray-600">{course.duration}</span>
                  </div>
                </div>
                <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
                <p className="text-gray-600 mb-6">{course.description}</p>
              </div>
            </div>

            {/* Modules List */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Inyigisho</h2>
              <div className="space-y-4">
                {modules.map((module) => (
                  <CourseModule
                    key={module.id}
                    module={{
                      id: module.id,
                      title: module.title,
                      duration: module.duration,
                      type: module.type,
                      completed: progress?.completed || false,
                      locked: false
                    }}
                    onModuleClick={() => {}}
                  />
                ))}
              </div>
            </div>

            {/* Quiz Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
              <h2 className="text-xl font-bold mb-4">Isuzuma Bumenyi</h2>
              {!showQuiz ? (
                <button
                  onClick={() => setShowQuiz(true)}
                  className="w-full bg-orange-600 text-white py-3 rounded-lg hover:bg-orange-700 transition duration-300"
                >
                  Tangira Isuzuma
                </button>
              ) : quizCompleted ? (
                <div className="text-center">
                  <h3 className="text-xl font-bold mb-4">
                    Warangije Isuzuma!
                  </h3>
                  <p className="text-lg mb-4">
                    Amanota yawe: {score}/{quizQuestions.length}
                  </p>
                  <button
                    onClick={restartQuiz}
                    className="flex items-center justify-center gap-2 mx-auto px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition duration-300"
                  >
                    <RefreshCcw className="h-5 w-5" />
                    Subiramo Isuzuma
                  </button>
                </div>
              ) : (
                <div>
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Ikibazo {currentQuestion + 1} kuri {quizQuestions.length}
                    </h3>
                    <p className="text-gray-800 mb-4">
                      {quizQuestions[currentQuestion].question}
                    </p>
                    <div className="space-y-3">
                      {quizQuestions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswerSelect(index)}
                          className={`w-full text-left p-4 rounded-lg border transition-all duration-200 ${
                            selectedAnswer === index
                              ? isCorrect === null
                                ? 'border-orange-500 bg-orange-50'
                                : isCorrect
                                ? 'border-green-500 bg-green-50'
                                : 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-orange-500 hover:bg-orange-50'
                          }`}
                          disabled={isCorrect !== null}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                  {isCorrect !== null && (
                    <div className={`p-4 rounded-lg mb-4 ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <CheckCircle2 className="h-5 w-5" />
                        ) : (
                          <AlertCircle className="h-5 w-5" />
                        )}
                        <p className="font-medium">
                          {isCorrect ? 'Ni byiza! Igisubizo ni cyo!' : 'Igisubizo si cyo. Gerageza nanone!'}
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={handleAnswerSubmit}
                    disabled={selectedAnswer === null || isCorrect !== null}
                    className={`w-full py-3 rounded-lg text-white transition duration-300 ${
                      selectedAnswer === null || isCorrect !== null
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-orange-600 hover:bg-orange-700'
                    }`}
                  >
                    Komeza
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <CourseProgress
              totalModules={modules.length}
              completedModules={modules.filter(m => progress?.completed).length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}