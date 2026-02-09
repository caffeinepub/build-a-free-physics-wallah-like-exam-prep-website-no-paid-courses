import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Course, Lesson } from '../backend';

export function useGetAllCourses() {
  const { actor, isFetching } = useActor();

  return useQuery<Course[]>({
    queryKey: ['courses'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCourses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetCourseById(courseId: bigint | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Course | null>({
    queryKey: ['course', courseId?.toString()],
    queryFn: async () => {
      if (!actor || !courseId) return null;
      try {
        return await actor.getCourseById(courseId);
      } catch (error) {
        console.error('Error fetching course:', error);
        return null;
      }
    },
    enabled: !!actor && !isFetching && !!courseId,
  });
}

export function useSearchCoursesBySubject(subject: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Course[]>({
    queryKey: ['courses', 'subject', subject],
    queryFn: async () => {
      if (!actor || !subject) return [];
      return actor.searchCoursesBySubject(subject);
    },
    enabled: !!actor && !isFetching && !!subject,
  });
}

export function useSearchLessonsByKeyword(keyword: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery<Lesson[]>({
    queryKey: ['lessons', 'search', keyword],
    queryFn: async () => {
      if (!actor || !keyword) return [];
      return actor.searchLessonsByKeyword(keyword);
    },
    enabled: !!actor && !isFetching && !!keyword && keyword.length > 0,
  });
}

export function useInitializeBackend() {
  const { actor, isFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['initialize'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.initialize();
      } catch (error) {
        // Already initialized, that's fine
        return true;
      }
    },
    enabled: !!actor && !isFetching,
    retry: false,
    staleTime: Infinity,
  });
}
