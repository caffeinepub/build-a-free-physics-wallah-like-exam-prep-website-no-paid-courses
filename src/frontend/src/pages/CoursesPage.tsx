import { Link, useSearch } from '@tanstack/react-router';
import { BookOpen, Video, Filter } from 'lucide-react';
import { useState } from 'react';
import { useGetAllCourses, useSearchCoursesBySubject } from '../hooks/useQueries';
import QueryState from '../components/QueryState';
import { useProgress } from '../hooks/useProgress';

const subjects = ['All', 'Physics', 'Chemistry', 'Mathematics', 'Biology'];

export default function CoursesPage() {
  const searchParams = useSearch({ from: '/courses' }) as { subject?: string };
  const initialSubject = searchParams.subject || 'All';
  const [selectedSubject, setSelectedSubject] = useState(initialSubject);
  
  const { data: allCourses, isLoading: loadingAll, isError: errorAll, error: errorObjAll } = useGetAllCourses();
  const { data: filteredCourses, isLoading: loadingFiltered, isError: errorFiltered, error: errorObjFiltered } = useSearchCoursesBySubject(
    selectedSubject !== 'All' ? selectedSubject : undefined
  );
  
  const { getCompletionCount } = useProgress();

  const courses = selectedSubject === 'All' ? allCourses : filteredCourses;
  const isLoading = selectedSubject === 'All' ? loadingAll : loadingFiltered;
  const isError = selectedSubject === 'All' ? errorAll : errorFiltered;
  const error = selectedSubject === 'All' ? errorObjAll : errorObjFiltered;

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
            All Courses
          </h1>
          <p className="text-muted-foreground">
            Browse our complete collection of free NEET & JEE preparation courses
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filter by Subject:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {subjects.map((subject) => (
              <button
                key={subject}
                onClick={() => setSelectedSubject(subject)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedSubject === subject
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {isLoading || isError || !courses?.length ? (
          <QueryState 
            isLoading={isLoading}
            isError={isError}
            isEmpty={!courses?.length}
            error={error as Error}
            loadingMessage="Loading courses..."
            emptyMessage="No courses found for this subject"
          />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => {
              const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
              const lessonIds = course.chapters.flatMap(ch => ch.lessons.map(l => l.id.toString()));
              const completed = getCompletionCount(lessonIds);
              const progress = totalLessons > 0 ? (completed / totalLessons) * 100 : 0;

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
                        <span className="text-xs font-medium text-primary">
                          {Math.round(progress)}%
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                      {course.description}
                    </p>
                    <div className="space-y-3">
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
                      {completed > 0 && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground">Progress</span>
                            <span className="text-muted-foreground">{completed}/{totalLessons}</span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
