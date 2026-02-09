import Text "mo:core/Text";
import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Nat "mo:core/Nat";

actor {
  type Resource = {
    title : Text;
    resourceType : Text;
    url : Text;
  };

  type Lesson = {
    id : Nat;
    title : Text;
    description : Text;
    resources : [Resource];
  };

  type Chapter = {
    id : Nat;
    title : Text;
    description : Text;
    lessons : [Lesson];
  };

  type Course = {
    id : Nat;
    title : Text;
    description : Text;
    subject : Text;
    chapters : [Chapter];
  };

  // Comparison modules for sorting/filtering
  module Course {
    public func compareById(course1 : Course, course2 : Course) : Order.Order {
      Nat.compare(course1.id, course2.id);
    };
    public func compareByTitle(course1 : Course, course2 : Course) : Order.Order {
      Text.compare(course1.title, course2.title);
    };
    public func compareBySubject(course1 : Course, course2 : Course) : Order.Order {
      Text.compare(course1.subject, course2.subject);
    };
  };

  var nextCourseId = 1;
  var nextChapterId = 1;
  var nextLessonId = 1;

  let coursesMap = Map.empty<Nat, Course>();

  let starterCourses = [
    {
      title = "Physics Foundations";
      description = "Comprehensive Physics course including Classical Mechanics, Thermodynamics, and more.";
      subject = "Physics";
      chapters = [
        {
          id = 1;
          title = "Classical Mechanics";
          description = "Study of motion and forces.";
          lessons = [
            {
              id = 1;
              title = "Kinematics";
              description = "Study of objects in motion.";
              resources = [
                { title = "Kinematics Video Lecture"; resourceType = "video"; url = "https://example.com/video/physics/kinematics" },
                { title = "Kinematics Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/physics/kinematics" },
              ];
            },
            {
              id = 2;
              title = "Dynamics";
              description = "Study of forces and motion.";
              resources = [
                { title = "Dynamics Video Lecture"; resourceType = "video"; url = "https://example.com/video/physics/dynamics" },
                { title = "Dynamics Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/physics/dynamics" },
              ];
            },
          ];
        },
        {
          id = 2;
          title = "Thermodynamics";
          description = "Study of heat, work, and energy.";
          lessons = [
            {
              id = 3;
              title = "Basic Concepts";
              description = "Introduction to Thermodynamics.";
              resources = [
                { title = "Thermodynamics Video Lecture"; resourceType = "video"; url = "https://example.com/video/physics/thermodynamics" },
                { title = "Thermodynamics Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/physics/thermodynamics" },
              ];
            },
            {
              id = 4;
              title = "Laws of Thermodynamics";
              description = "Understanding the laws of thermodynamics.";
              resources = [
                { title = "Laws of Thermodynamics Video Lecture"; resourceType = "video"; url = "https://example.com/video/physics/laws" },
                { title = "Laws of Thermodynamics Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/physics/laws" },
              ];
            },
          ];
        },
      ];
    },
    {
      title = "Organic Chemistry";
      description = "In-depth look into Organic Chemistry concepts.";
      subject = "Chemistry";
      chapters = [
        {
          id = 3;
          title = "Fundamentals";
          description = "Foundational concepts of Organic Chemistry.";
          lessons = [
            {
              id = 5;
              title = "Introduction";
              description = "Basics of Organic Chemistry.";
              resources = [
                { title = "Organic Chemistry Video Lecture"; resourceType = "video"; url = "https://example.com/video/chemistry/organic" },
                { title = "Organic Chemistry Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/chemistry/organic" },
              ];
            },
            {
              id = 6;
              title = "Hydrocarbons";
              description = "Understanding hydrocarbon compounds.";
              resources = [
                { title = "Hydrocarbons Video Lecture"; resourceType = "video"; url = "https://example.com/video/chemistry/hydrocarbons" },
                { title = "Hydrocarbons Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/chemistry/hydrocarbons" },
              ];
            },
          ];
        },
        {
          id = 4;
          title = "Reactions";
          description = "Chemical reactions and their mechanisms.";
          lessons = [
            {
              id = 7;
              title = "Addition Reactions";
              description = "Study of addition reaction mechanisms.";
              resources = [
                { title = "Addition Reactions Video Lecture"; resourceType = "video"; url = "https://example.com/video/chemistry/addition" },
                { title = "Addition Reactions Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/chemistry/addition" },
              ];
            },
            {
              id = 8;
              title = "Substitution Reactions";
              description = "Exploring substitution reaction types.";
              resources = [
                { title = "Substitution Reactions Video Lecture"; resourceType = "video"; url = "https://example.com/video/chemistry/substitution" },
                { title = "Substitution Reactions Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/chemistry/substitution" },
              ];
            },
          ];
        },
      ];
    },
    {
      title = "Calculus 101";
      description = "A comprehensive course in Calculus for Mathematics.";
      subject = "Mathematics";
      chapters = [
        {
          id = 5;
          title = "Limits and Continuity";
          description = "Study of mathematical limits and continuous functions.";
          lessons = [
            {
              id = 9;
              title = "Introduction to Limits";
              description = "Basics of limit concepts.";
              resources = [
                { title = "Limits Video Lecture"; resourceType = "video"; url = "https://example.com/video/math/limits" },
                { title = "Limits Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/math/limits" },
              ];
            },
            {
              id = 10;
              title = "Continuity";
              description = "Exploring continuous functions.";
              resources = [
                { title = "Continuity Video Lecture"; resourceType = "video"; url = "https://example.com/video/math/continuity" },
                { title = "Continuity Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/math/continuity" },
              ];
            },
          ];
        },
        {
          id = 6;
          title = "Differentiation";
          description = "Master the fundamentals of differentiation.";
          lessons = [
            {
              id = 11;
              title = "Derivative Basics";
              description = "Introduction to derivatives in calculus.";
              resources = [
                { title = "Derivatives Video Lecture"; resourceType = "video"; url = "https://example.com/video/math/derivatives" },
                { title = "Derivatives Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/math/derivatives" },
              ];
            },
            {
              id = 12;
              title = "Applications of Derivatives";
              description = "Applications in mathematical problem-solving.";
              resources = [
                { title = "Derivatives Applications Video"; resourceType = "video"; url = "https://example.com/video/math/applications/derivatives" },
                { title = "Derivatives Applications PDF"; resourceType = "pdf"; url = "https://example.com/pdf/math/applications" },
              ];
            },
          ];
        },
      ];
    },
    {
      title = "Fundamentals of Biology";
      description = "Explore the basic principles of Biology.";
      subject = "Biology";
      chapters = [
        {
          id = 7;
          title = "Cell Biology";
          description = " deep dive into cellular structure and functions.";
          lessons = [
            {
              id = 13;
              title = "Cell Structure";
              description = "Understanding components of cells.";
              resources = [
                { title = "Cell Structure Video Lecture"; resourceType = "video"; url = "https://example.com/video/biology/cell-structure" },
                { title = "Cell Structure Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/biology/cell-structure" },
              ];
            },
            {
              id = 14;
              title = "Cell Functions";
              description = "Study of cell functionalities.";
              resources = [
                { title = "Cell Functions Video Lecture"; resourceType = "video"; url = "https://example.com/video/biology/cell-functions" },
                { title = "Cell Functions Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/biology/cell-functions" },
              ];
            },
          ];
        },
        {
          id = 8;
          title = "Genetics";
          description = "Understanding genes and inheritance.";
          lessons = [
            {
              id = 15;
              title = "Introduction to Genetics";
              description = "Basics of genetic science.";
              resources = [
                { title = "Genetics Video Lecture"; resourceType = "video"; url = "https://example.com/video/biology/genetics" },
                { title = "Genetics Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/biology/genetics" },
              ];
            },
            {
              id = 16;
              title = "Mendelian Genetics";
              description = "Exploring patterns of inheritance.";
              resources = [
                { title = "Mendelian Genetics Video Lecture"; resourceType = "video"; url = "https://example.com/video/biology/mendelian" },
                { title = "Mendelian Genetics Notes PDF"; resourceType = "pdf"; url = "https://example.com/pdf/biology/mendelian" },
              ];
            },
          ];
        },
      ];
    },
  ];

  // Store initial data
  public shared ({ caller }) func initialize() : async Bool {
    if (coursesMap.size() > 0) { Runtime.trap("Already initialized") };
    for (course in starterCourses.values()) {
      let courseId = nextCourseId;
      let courseWithId = { course with id = courseId };
      coursesMap.add(courseId, courseWithId);
      nextCourseId += 1;
    };
    true;
  };

  // List all courses
  public query ({ caller }) func getAllCourses() : async [Course] {
    coursesMap.values().toArray().sort(Course.compareByTitle);
  };

  // Get Course by ID
  public query ({ caller }) func getCourseById(courseId : Nat) : async Course {
    switch (coursesMap.get(courseId)) {
      case (null) { Runtime.trap("Course not found") };
      case (?course) { course };
    };
  };

  // Search courses by subject
  public query ({ caller }) func searchCoursesBySubject(subject : Text) : async [Course] {
    coursesMap.values().toArray().filter(
      func(course) { Text.equal(course.subject, subject) }
    ).sort(Course.compareByTitle);
  };

  // Search lessons by keyword in all courses
  public query ({ caller }) func searchLessonsByKeyword(keyword : Text) : async [Lesson] {
    let courses = coursesMap.values().toArray().sort(Course.compareByTitle);
    let results = List.empty<Lesson>();

    for (course in courses.values()) {
      for (chapter in course.chapters.values()) {
        for (lesson in chapter.lessons.values()) {
          if (lesson.title.contains(#text(keyword)) or lesson.description.contains(#text(keyword))) {
            results.add(lesson);
          };
        };
      };
    };

    results.toArray();
  };
};
