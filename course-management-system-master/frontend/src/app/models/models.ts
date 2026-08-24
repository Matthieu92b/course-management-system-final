export interface Category {
  id: number;
  name: string;
}

export interface Faculty {
  id: number;
  name: string;
}

export interface Department {
  id: number;
  name: string;
  faculty?: Faculty;
}

export interface StudyProgram {
  id: number;
  name: string;
  level: string;
  department?: Department;
}

export interface Course {
  id: number;
  code: string;
  title: string;
  credits: number;
}

export interface ActiveCourse {
  id: number;
  studyProgram?: StudyProgram;
  course?: Course;
  academicYear: number;
  semester: number;
  typology: 'A' | 'B' | 'C' | 'D' | 'E';
}

export interface Section {
  id: number;
  type: 'THEORY' | 'LAB' | 'SEMINAR';
  hours: number;
  activeCourse?: ActiveCourse;
  lecturer?: User;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  category?: Category;
}

export interface TeachingLoad {
  lecturerId: number;
  firstName: string;
  lastName: string;
  sectionsCount: number;
  totalHours: number;
}

export interface ProgramCourseCount {
  studyProgramId: number;
  studyProgramName: string;
  activeCourseCount: number;
}

export interface SectionTypeCount {
  type: string;
  count: number;
}
