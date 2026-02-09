import { useSearch, Link } from '@tanstack/react-router';
import { Search, BookOpen, FileText } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchLessonsByKeyword, useGetAllCourses } from '../hooks/useQueries';
import QueryState from '../components/QueryState';

export default function SearchPage() {
  const searchParams = useSearch({ from: '/search' }) as { q?: string };
  const [query, setQuery] = useState(searchParams.q || '');
  const [searchTerm, setSearchTerm] = useState(searchParams.q || '');

  const { data: lessons, isLoading: loadingLessons, isError: errorLessons, error: errorObjLessons } = useSearchLessonsByKeyword(searchTerm);
  const { data: allCourses } = useGetAllCourses();

  useEffect(() => {
    if (searchParams.q) {
      setQuery(searchParams.q);
      setSearchTerm(searchParams.q);
    }
  }, [searchParams.q]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchTerm(query.trim());
    }
  };

  // Filter courses by title/description
  const matchingCourses = allCourses?.filter(course => 
    query && (
      course.title.toLowerCase().includes(query.toLowerCase()) ||
      course.description.toLowerCase().includes(query.toLowerCase()) ||
      course.subject.toLowerCase().includes(query.toLowerCase())
    )
  ) || [];

  // Find which course each lesson belongs to
  const lessonsWithCourse = lessons?.map(lesson => {
    const course = allCourses?.find(c => 
      c.chapters.some(ch => ch.lessons.some(l => l.id === lesson.id))
    );
    return { lesson, course };
  }) || [];

  const hasResults = matchingCourses.length > 0 || lessonsWithCourse.length > 0;
  const showResults = searchTerm.length > 0;

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom max-w-4xl">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-6">
            Search Courses & Lessons
          </h1>
          
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search for courses, chapters, or lessons..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full rounded-xl border border-input bg-background pl-12 pr-4 py-4 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              autoFocus
            />
          </form>
        </div>

        {/* Results */}
        {!showResults ? (
          <div className="text-center py-12">
            <Search className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-muted-foreground">
              Enter a search term to find courses and lessons
            </p>
          </div>
        ) : loadingLessons ? (
          <QueryState isLoading={true} loadingMessage="Searching..." />
        ) : errorLessons ? (
          <QueryState isError={true} error={errorObjLessons as Error} />
        ) : !hasResults ? (
          <QueryState isEmpty={true} emptyMessage={`No results found for "${searchTerm}"`} />
        ) : (
          <div className="space-y-8">
            {/* Courses Results */}
            {matchingCourses.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Courses ({matchingCourses.length})
                </h2>
                <div className="space-y-3">
                  {matchingCourses.map((course) => (
                    <Link
                      key={course.id.toString()}
                      to="/courses/$courseId"
                      params={{ courseId: course.id.toString() }}
                      className="block p-4 rounded-lg border bg-card hover:border-primary/50 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary">
                              {course.subject}
                            </span>
                          </div>
                          <h3 className="font-semibold text-lg mb-1 hover:text-primary transition-colors">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Lessons Results */}
            {lessonsWithCourse.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-secondary" />
                  Lessons ({lessonsWithCourse.length})
                </h2>
                <div className="space-y-3">
                  {lessonsWithCourse.map(({ lesson, course }) => (
                    <Link
                      key={lesson.id.toString()}
                      to="/courses/$courseId/lessons/$lessonId"
                      params={{ 
                        courseId: course?.id.toString() || '0',
                        lessonId: lesson.id.toString()
                      }}
                      className="block p-4 rounded-lg border bg-card hover:border-primary/50 hover:shadow-soft transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {course && (
                            <div className="text-xs text-muted-foreground mb-1">
                              {course.title}
                            </div>
                          )}
                          <h3 className="font-semibold mb-1 hover:text-primary transition-colors">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {lesson.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
