import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import CourseDetailPage from './pages/CourseDetailPage';
import LessonViewerPage from './pages/LessonViewerPage';
import SearchPage from './pages/SearchPage';

const rootRoute = createRootRoute({
  component: AppLayout
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage
});

const coursesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses',
  component: CoursesPage
});

const courseDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/$courseId',
  component: CourseDetailPage
});

const lessonViewerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/courses/$courseId/lessons/$lessonId',
  component: LessonViewerPage
});

const searchRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/search',
  component: SearchPage
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  coursesRoute,
  courseDetailRoute,
  lessonViewerRoute,
  searchRoute
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
