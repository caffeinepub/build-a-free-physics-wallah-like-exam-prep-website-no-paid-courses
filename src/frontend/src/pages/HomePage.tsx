import { Link } from '@tanstack/react-router';
import { BookOpen, Video, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import { useGetAllCourses, useInitializeBackend } from '../hooks/useQueries';
import QueryState from '../components/QueryState';
import { useProgress } from '../hooks/useProgress';

const subjects = [
  { name: 'Physics', icon: '/assets/generated/icon-physics.dim_256x256.png', color: 'from-green-500 to-emerald-600' },
  { name: 'Chemistry', icon: '/assets/generated/icon-chemistry.dim_256x256.png', color: 'from-orange-500 to-amber-600' },
  { name: 'Mathematics', icon: '/assets/generated/icon-maths.dim_256x256.png', color: 'from-teal-500 to-cyan-600' },
  { name: 'Biology', icon: '/assets/generated/icon-biology.dim_256x256.png', color: 'from-lime-500 to-green-600' }
];

export default function HomePage() {
  useInitializeBackend();
  const { data: courses, isLoading, isError, error } = useGetAllCourses();
  const { getCompletionCount } = useProgress();

  const featuredCourses = courses?.slice(0, 4) || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-background">
        <div className="container-custom py-16 md:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                🎓 100% Free Education
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight">
                Master NEET & JEE
                <span className="block text-primary mt-2">Completely Free</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl">
                Access comprehensive courses in Physics, Chemistry, Mathematics, and Biology. 
                Video lectures, study materials, and practice questions - all at zero cost.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  to="/courses"
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors shadow-soft"
                >
                  Browse All Courses
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="/assets/generated/hero-banner.dim_1600x600.png" 
                alt="Exam Preparation" 
                className="w-full h-auto rounded-2xl shadow-medium"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Subjects Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Explore by Subject
            </h2>
            <p className="text-muted-foreground">
              Choose your subject and start learning today
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {subjects.map((subject) => (
              <Link
                key={subject.name}
                to="/courses"
                search={{ subject: subject.name }}
                className="group relative overflow-hidden rounded-xl bg-card border hover:border-primary/50 transition-all hover:shadow-soft p-6 text-center"
              >
                <div className="mb-4 flex justify-center">
                  <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${subject.color} p-1 group-hover:scale-110 transition-transform`}>
                    <div className="w-full h-full rounded-full bg-background flex items-center justify-center">
                      <img src={subject.icon} alt={subject.name} className="w-12 h-12" />
                    </div>
                  </div>
                </div>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {subject.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-16">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Featured Courses
            </h2>
            <p className="text-muted-foreground">
              Start with our most popular courses
            </p>
          </div>

          {isLoading || isError ? (
            <QueryState 
              isLoading={isLoading} 
              isError={isError} 
              error={error as Error}
              loadingMessage="Loading courses..."
            />
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredCourses.map((course) => {
                const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
                const lessonIds = course.chapters.flatMap(ch => ch.lessons.map(l => l.id.toString()));
                const completed = getCompletionCount(lessonIds);

                return (
                  <Link
                    key={course.id.toString()}
                    to="/courses/$courseId"
                    params={{ courseId: course.id.toString() }}
                    className="group bg-card border rounded-xl overflow-hidden hover:border-primary/50 hover:shadow-soft transition-all"
                  >
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {course.subject}
                        </span>
                        {completed > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {completed}/{totalLessons}
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                        {course.description}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3.5 w-3.5" />
                          {course.chapters.length} chapters
                        </span>
                        <span className="flex items-center gap-1">
                          <Video className="h-3.5 w-3.5" />
                          {totalLessons} lessons
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-muted/30">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Why Choose Us?
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Video Lectures</h3>
              <p className="text-sm text-muted-foreground">
                High-quality video content from expert educators
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary/10 text-secondary mb-4">
                <FileText className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Study Materials</h3>
              <p className="text-sm text-muted-foreground">
                Comprehensive notes and downloadable resources
              </p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <CheckCircle className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Track Progress</h3>
              <p className="text-sm text-muted-foreground">
                Monitor your learning journey with progress tracking
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
