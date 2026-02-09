import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Resource {
    url: string;
    title: string;
    resourceType: string;
}
export interface Lesson {
    id: bigint;
    title: string;
    resources: Array<Resource>;
    description: string;
}
export interface Chapter {
    id: bigint;
    title: string;
    description: string;
    lessons: Array<Lesson>;
}
export interface Course {
    id: bigint;
    title: string;
    subject: string;
    description: string;
    chapters: Array<Chapter>;
}
export interface backendInterface {
    getAllCourses(): Promise<Array<Course>>;
    getCourseById(courseId: bigint): Promise<Course>;
    initialize(): Promise<boolean>;
    searchCoursesBySubject(subject: string): Promise<Array<Course>>;
    searchLessonsByKeyword(keyword: string): Promise<Array<Lesson>>;
}
