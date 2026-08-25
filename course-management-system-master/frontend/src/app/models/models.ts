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
  capacity?: number;
  room?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  category?: Category;
  cohort?: Cohort;
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

export interface ActiveCourseSummary {
  activeCourseId: number;
  courseId: number;
  code: string;
  title: string;
  credits: number;
  academicYear: number;
  semester: number;
  typology: string;
}

export interface SectionSummary {
  id: number;
  type: string;
  hours: number;
  courseCode: string;
  courseTitle: string;
  academicYear: number;
  semester: number;
  capacity?: number;
  room?: string;
  dayOfWeek?: string;
  startTime?: string;
  endTime?: string;
  lecturerId: number;
  lecturerName: string;
}

export interface LecturerSummary {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface StudyProgramDetail {
  id: number;
  name: string;
  level: string;
  departmentId: number;
  departmentName: string;
  facultyId: number;
  facultyName: string;
  activeCourses: ActiveCourseSummary[];
  sections: SectionSummary[];
  lecturers: LecturerSummary[];
}

export interface StatsFilter {
  academicYear?: number | null;
  semester?: number | null;
}

// ---- Auth / roles ----

export type Role = 'ADMIN' | 'LECTURER' | 'STUDENT';

export interface LoginResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  cohortId?: number;
  cohortName?: string;
}

// ---- Cohorts ----

export interface Cohort {
  id: number;
  name: string;
  studyProgram?: StudyProgram;
  academicYear: number;
}

export interface CohortSummary {
  id: number;
  name: string;
}

// ---- Appointments / schedule / attendance ----

export interface Appointment {
  id: number;
  section?: Section;
  date: string;
}

export interface ScheduleEntry {
  appointmentId: number;
  sectionId: number;
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  courseCode: string;
  courseTitle: string;
  sectionType: string;
  room?: string;
  lecturerName?: string;
  cohortNames?: string[];
}

export interface AppointmentDetail {
  id: number;
  date: string;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  room?: string;
  capacity?: number;
  sectionType: string;
  courseCode: string;
  courseTitle: string;
  lecturerId: number;
  lecturerName: string;
  cohorts: CohortSummary[];
  students: LecturerSummary[];
}

export type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

export interface AttendanceRecord {
  studentId: number;
  studentName: string;
  status: AttendanceStatus | null;
}

export interface AttendanceEntry {
  studentId: number;
  status: AttendanceStatus;
}
