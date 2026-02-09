import { useParams, Link } from '@tanstack/react-router';
import { BookOpen, CheckCircle, Circle, ChevronRight } from 'lucide-react';
import { useGetCourseById } from '../hooks/useQueries';
import QueryState from '../components/QueryState';
import { useProgress } from '../hooks/useProgress';

export default function CourseDetailPage() {
  const { courseId } = useParams({ from: '/courses/$courseId' });
  const { data: course, isLoading, isError, error } = useGetCourseById(BigInt(courseId));
  const { isComplete, getCompletionCount } = useProgress();

  if (isLoading || isError || !course) {
    return (
      <div className="min-h-screen py-12">
        <div className="container-custom">
          <QueryState 
            isLoading={isLoading}
            isError={isError}
            isEmpty={!course}
            error={error as Error}
            loadingMessage="Loading course..."
            emptyMessage="Course not found"
          />
        </div>
      </div>
    );
  }

  const totalLessons = course.chapters.reduce((acc, ch) => acc + ch.lessons.length, 0);
  const lessonIds = course.chapters.flatMap(ch => ch.lessons.map(l => l.id.toString()));
  const completedCount = getCompletionCount(lessonIds);
  const progress = totalLessons > 0 ? (completedCount / totalLessons) * 100 : 0;

  return (
    <div className="min-h-screen py-12">
      <div className="container-custom">
        {/* Course Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Link to="/courses" className="hover:text-primary">Courses</Link>
            <ChevronRight className="h-4 w-4" />
            <span>{course.title}</span>
          </div>
          
          <div className="bg-card border rounded-xl p-8">
            <div className="flex items-start justify-between mb-4">
              <span className="inline-block px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {course.subject}
              </span>
              {completedCount > 0 && (
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">{Math.round(progress)}%</div>
                  <div className="text-xs text-muted-foreground">Complete</div>
                </div>
              )}
            </div>
            
            <h1 className="text-3xl md:text-4xl font-display font-bold mb-3">
              {course.title}
            </h1>
            <p className="text-muted-foreground mb-6">
              {course.description}
            </p>
            
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-muted-foreground" />
                <span>{course.chapters.length} Chapters</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
                <span>{totalLessons} Lessons</span>
              </div>
            </div>

            {completedCount > 0 && (
              <div className="mt-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Your Progress</span>
                  <span className="font-medium">{completedCount}/{totalLessons} lessons</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chapters & Lessons */}
        <div className="space-y-6">
          <h2 className="text-2xl font-display font-bold">Course Content</h2>
          
          {course.chapters.map((chapter, chapterIndex) => {
            const chapterLessonIds = chapter.lessons.map(l => l.id.toString());
            const chapterCompleted = getCompletionCount(chapterLessonIds);
            const chapterProgress = chapter.lessons.length > 0 
              ? (chapterCompleted / chapter.lessons.length) * 100 
              : 0;

            return (
              <div key={chapter.id.toString()} className="bg-card border rounded-xl overflow-hidden">
                <div className="p-6 border-b bg-muted/30">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                          {chapterIndex + 1}
                        </span>
                        <h3 className="text-xl font-semibold">{chapter.title}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground ml-11">
                        {chapter.description}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-sm font-medium text-primary">
                        {chapterCompleted}/{chapter.lessons.length}
                      </div>
                      <div className="text-xs text-muted-foreground">lessons</div>
                    </div>
                  </div>
                  {chapterCompleted > 0 && (
                    <div className="mt-4 ml-11">
                      <div className="h-1.5 bg-background rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary transition-all"
                          style={{ width: `${chapterProgress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="divide-y">
                  {chapter.lessons.map((lesson, lessonIndex) => {
                    const completed = isComplete(lesson.id.toString());
                    
                    return (
                      <Link
                        key={lesson.id.toString()}
                        to="/courses/$courseId/lessons/$lessonId"
                        params={{ courseId, lessonId: lesson.id.toString() }}
                        className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors group"
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {completed ? (
                            <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                          ) : (
                            <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="font-medium group-hover:text-primary transition-colors">
                              {lessonIndex + 1}. {lesson.title}
                            </div>
                            <div className="text-sm text-muted-foreground line-clamp-1">
                              {lesson.description}
                            </div>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
