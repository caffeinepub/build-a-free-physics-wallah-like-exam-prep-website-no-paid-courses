import { useParams, Link, useNavigate } from '@tanstack/react-router';
import { ChevronLeft, ChevronRight, CheckCircle, Circle, Download, FileText, Video as VideoIcon } from 'lucide-react';
import { useGetCourseById } from '../hooks/useQueries';
import QueryState from '../components/QueryState';
import { useProgress } from '../hooks/useProgress';
import { staticResources } from '../content/staticResources';
import type { Lesson, Chapter } from '../backend';

export default function LessonViewerPage() {
  const { courseId, lessonId } = useParams({ from: '/courses/$courseId/lessons/$lessonId' });
  const navigate = useNavigate();
  const { data: course, isLoading, isError, error } = useGetCourseById(BigInt(courseId));
  const { isComplete, markComplete, markIncomplete } = useProgress();

  if (isLoading || isError || !course) {
    return (
      <div className="min-h-screen py-12">
        <div className="container-custom">
          <QueryState 
            isLoading={isLoading}
            isError={isError}
            isEmpty={!course}
            error={error as Error}
            loadingMessage="Loading lesson..."
            emptyMessage="Lesson not found"
          />
        </div>
      </div>
    );
  }

  // Find the lesson
  let currentLesson: Lesson | null = null;
  let currentChapter: Chapter | null = null;
  let lessonIndex = -1;
  let allLessons: Array<{ lesson: Lesson; chapterId: bigint }> = [];

  for (const chapter of course.chapters) {
    for (const lesson of chapter.lessons) {
      allLessons.push({ lesson, chapterId: chapter.id });
      if (lesson.id.toString() === lessonId) {
        currentLesson = lesson;
        currentChapter = chapter;
        lessonIndex = allLessons.length - 1;
      }
    }
  }

  if (!currentLesson || !currentChapter) {
    return (
      <div className="min-h-screen py-12">
        <div className="container-custom">
          <QueryState isEmpty={true} emptyMessage="Lesson not found" />
        </div>
      </div>
    );
  }

  const completed = isComplete(lessonId);
  const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;

  // Merge backend resources with static resources
  const staticResourcesForLesson = staticResources[lessonId] || [];
  const allResources = [...currentLesson.resources, ...staticResourcesForLesson];

  const videoResource = allResources.find(r => r.resourceType.toLowerCase() === 'video');

  const handleToggleComplete = () => {
    if (completed) {
      markIncomplete(lessonId);
    } else {
      markComplete(lessonId);
    }
  };

  const handleNavigation = (targetLessonId: string) => {
    navigate({ 
      to: '/courses/$courseId/lessons/$lessonId',
      params: { courseId, lessonId: targetLessonId }
    });
  };

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom max-w-5xl">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/courses" className="hover:text-primary">Courses</Link>
          <ChevronRight className="h-4 w-4" />
          <Link 
            to="/courses/$courseId" 
            params={{ courseId }}
            className="hover:text-primary"
          >
            {course.title}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span>{currentLesson.title}</span>
        </div>

        {/* Lesson Header */}
        <div className="bg-card border rounded-xl p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="text-sm text-muted-foreground mb-2">
                {currentChapter.title}
              </div>
              <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">
                {currentLesson.title}
              </h1>
              <p className="text-muted-foreground">
                {currentLesson.description}
              </p>
            </div>
            <button
              onClick={handleToggleComplete}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                completed
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {completed ? (
                <>
                  <CheckCircle className="h-4 w-4" />
                  Completed
                </>
              ) : (
                <>
                  <Circle className="h-4 w-4" />
                  Mark Complete
                </>
              )}
            </button>
          </div>
        </div>

        {/* Video Section */}
        {videoResource && (
          <div className="bg-card border rounded-xl overflow-hidden mb-6">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <div className="text-center p-8">
                <VideoIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">
                  Video lecture available
                </p>
                <a
                  href={videoResource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
                >
                  Watch Video
                  <ChevronRight className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Resources Section */}
        {allResources.length > 0 && (
          <div className="bg-card border rounded-xl p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Resources</h2>
            <div className="space-y-3">
              {allResources.map((resource, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-lg border hover:border-primary/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {resource.resourceType.toLowerCase() === 'video' ? (
                      <VideoIcon className="h-5 w-5 text-primary" />
                    ) : (
                      <FileText className="h-5 w-5 text-secondary" />
                    )}
                    <div>
                      <div className="font-medium">{resource.title}</div>
                      <div className="text-xs text-muted-foreground capitalize">
                        {resource.resourceType}
                      </div>
                    </div>
                  </div>
                  <a
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    download={resource.resourceType.toLowerCase() === 'pdf'}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted hover:bg-muted/80 text-sm font-medium transition-colors"
                  >
                    {resource.resourceType.toLowerCase() === 'pdf' ? (
                      <>
                        <Download className="h-4 w-4" />
                        Download
                      </>
                    ) : (
                      <>
                        Open
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4">
          {prevLesson ? (
            <button
              onClick={() => handleNavigation(prevLesson.lesson.id.toString())}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border hover:border-primary/50 hover:bg-muted/50 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Previous</div>
                <div className="text-sm font-medium line-clamp-1">
                  {prevLesson.lesson.title}
                </div>
              </div>
            </button>
          ) : (
            <div />
          )}

          {nextLesson ? (
            <button
              onClick={() => handleNavigation(nextLesson.lesson.id.toString())}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ml-auto"
            >
              <div className="text-right">
                <div className="text-xs opacity-90">Next</div>
                <div className="text-sm font-medium line-clamp-1">
                  {nextLesson.lesson.title}
                </div>
              </div>
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <Link
              to="/courses/$courseId"
              params={{ courseId }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors ml-auto"
            >
              Back to Course
              <ChevronRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
