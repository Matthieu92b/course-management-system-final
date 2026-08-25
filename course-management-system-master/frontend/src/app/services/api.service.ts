import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ActiveCourse, ActiveCourseSummary, AppointmentDetail, Appointment, AttendanceEntry, AttendanceRecord,
  Category, Cohort, CohortSummary, Course, Department, Faculty, LoginResponse, ProgramCourseCount,
  ScheduleEntry, Section, SectionTypeCount, StatsFilter, StudyProgram, StudyProgramDetail, TeachingLoad, User
} from '../models/models';

const BASE = 'http://localhost:8080';

function termParams(filter?: StatsFilter): HttpParams {
  let params = new HttpParams();
  if (filter?.academicYear != null) params = params.set('academicYear', filter.academicYear);
  if (filter?.semester != null) params = params.set('semester', filter.semester);
  return params;
}

@Injectable({ providedIn: 'root' })
export class ApiService {
  constructor(private http: HttpClient) {}

  // ---- Categories
  getCategories(): Observable<Category[]> { return this.http.get<Category[]>(`${BASE}/categories`); }
  createCategory(body: { name: string }): Observable<Category> { return this.http.post<Category>(`${BASE}/categories`, body); }
  deleteCategory(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/categories/${id}`); }

  // ---- Faculties
  getFaculties(): Observable<Faculty[]> { return this.http.get<Faculty[]>(`${BASE}/faculties`); }
  createFaculty(body: { name: string }): Observable<Faculty> { return this.http.post<Faculty>(`${BASE}/faculties`, body); }
  updateFaculty(id: number, body: { name: string }): Observable<Faculty> { return this.http.put<Faculty>(`${BASE}/faculties/${id}`, body); }
  deleteFaculty(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/faculties/${id}`); }

  // ---- Departments
  getDepartments(): Observable<Department[]> { return this.http.get<Department[]>(`${BASE}/departments`); }
  createDepartment(body: { name: string; facultyId: number }): Observable<Department> { return this.http.post<Department>(`${BASE}/departments`, body); }
  updateDepartment(id: number, body: { name: string; facultyId: number }): Observable<Department> { return this.http.put<Department>(`${BASE}/departments/${id}`, body); }
  deleteDepartment(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/departments/${id}`); }

  // ---- Study programs
  getStudyPrograms(): Observable<StudyProgram[]> { return this.http.get<StudyProgram[]>(`${BASE}/study-programs`); }
  createStudyProgram(body: { name: string; level: string; departmentId: number }): Observable<StudyProgram> { return this.http.post<StudyProgram>(`${BASE}/study-programs`, body); }
  updateStudyProgram(id: number, body: { name: string; level: string; departmentId: number }): Observable<StudyProgram> { return this.http.put<StudyProgram>(`${BASE}/study-programs/${id}`, body); }
  deleteStudyProgram(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/study-programs/${id}`); }
  getCoursesForProgram(id: number): Observable<ActiveCourseSummary[]> { return this.http.get<ActiveCourseSummary[]>(`${BASE}/study-programs/${id}/courses`); }
  getStudyProgramDetail(id: number): Observable<StudyProgramDetail> { return this.http.get<StudyProgramDetail>(`${BASE}/study-programs/${id}/detail`); }

  // ---- Courses
  getCourses(): Observable<Course[]> { return this.http.get<Course[]>(`${BASE}/courses`); }
  createCourse(body: { code: string; title: string; credits: number }): Observable<Course> { return this.http.post<Course>(`${BASE}/courses`, body); }
  updateCourse(id: number, body: { code: string; title: string; credits: number }): Observable<Course> { return this.http.put<Course>(`${BASE}/courses/${id}`, body); }
  deleteCourse(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/courses/${id}`); }
  getSectionsForCourse(id: number): Observable<Section[]> { return this.http.get<Section[]>(`${BASE}/courses/${id}/sections`); }

  // ---- Active courses
  getActiveCourses(): Observable<ActiveCourse[]> { return this.http.get<ActiveCourse[]>(`${BASE}/active-courses`); }
  createActiveCourse(body: { studyProgramId: number; courseId: number; academicYear: number; semester: number; typology: string }): Observable<ActiveCourse> {
    return this.http.post<ActiveCourse>(`${BASE}/active-courses`, body);
  }
  updateActiveCourse(id: number, body: { studyProgramId: number; courseId: number; academicYear: number; semester: number; typology: string }): Observable<ActiveCourse> {
    return this.http.put<ActiveCourse>(`${BASE}/active-courses/${id}`, body);
  }
  deleteActiveCourse(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/active-courses/${id}`); }

  // ---- Sections
  getSections(): Observable<Section[]> { return this.http.get<Section[]>(`${BASE}/sections`); }
  createSection(body: {
    type: string; hours: number; activeCourseId: number; lecturerId: number;
    capacity: number; room: string; dayOfWeek: string; startTime: string; endTime: string;
  }): Observable<Section> {
    return this.http.post<Section>(`${BASE}/sections`, body);
  }
  updateSection(id: number, body: {
    type: string; hours: number; activeCourseId: number; lecturerId: number;
    capacity: number; room: string; dayOfWeek: string; startTime: string; endTime: string;
  }): Observable<Section> {
    return this.http.put<Section>(`${BASE}/sections/${id}`, body);
  }
  deleteSection(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/sections/${id}`); }

  // ---- Users
  getUsers(): Observable<User[]> { return this.http.get<User[]>(`${BASE}/users`); }
  createUser(body: { firstName: string; lastName: string; email: string; password: string; categoryId: number; cohortId?: number | null }): Observable<User> {
    return this.http.post<User>(`${BASE}/users`, body);
  }
  updateUser(id: number, body: { firstName: string; lastName: string; email: string; password: string; categoryId: number; cohortId?: number | null }): Observable<User> {
    return this.http.put<User>(`${BASE}/users/${id}`, body);
  }
  deleteUser(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/users/${id}`); }
  getTeachingLoad(id: number): Observable<TeachingLoad> { return this.http.get<TeachingLoad>(`${BASE}/users/${id}/teaching-load`); }

  // ---- Auth
  login(email: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${BASE}/auth/login`, { email, password });
  }

  // ---- Cohorts
  getCohorts(): Observable<Cohort[]> { return this.http.get<Cohort[]>(`${BASE}/cohorts`); }
  createCohort(body: { name: string; studyProgramId: number; academicYear: number }): Observable<Cohort> {
    return this.http.post<Cohort>(`${BASE}/cohorts`, body);
  }
  updateCohort(id: number, body: { name: string; studyProgramId: number; academicYear: number }): Observable<Cohort> {
    return this.http.put<Cohort>(`${BASE}/cohorts/${id}`, body);
  }
  deleteCohort(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/cohorts/${id}`); }

  // ---- Section <-> Cohort assignment
  getCohortsForSection(sectionId: number): Observable<CohortSummary[]> {
    return this.http.get<CohortSummary[]>(`${BASE}/sections/${sectionId}/cohorts`);
  }
  assignCohortToSection(sectionId: number, cohortId: number): Observable<void> {
    return this.http.post<void>(`${BASE}/sections/${sectionId}/cohorts`, { cohortId });
  }
  unassignCohortFromSection(sectionId: number, cohortId: number): Observable<void> {
    return this.http.delete<void>(`${BASE}/sections/${sectionId}/cohorts/${cohortId}`);
  }

  // ---- Appointments
  getAppointments(): Observable<Appointment[]> { return this.http.get<Appointment[]>(`${BASE}/appointments`); }
  createAppointment(body: { sectionId: number; date: string }): Observable<Appointment> {
    return this.http.post<Appointment>(`${BASE}/appointments`, body);
  }
  updateAppointment(id: number, body: { sectionId: number; date: string }): Observable<Appointment> {
    return this.http.put<Appointment>(`${BASE}/appointments/${id}`, body);
  }
  deleteAppointment(id: number): Observable<void> { return this.http.delete<void>(`${BASE}/appointments/${id}`); }
  getAppointmentDetail(id: number): Observable<AppointmentDetail> {
    return this.http.get<AppointmentDetail>(`${BASE}/appointments/${id}/detail`);
  }
  getLecturerSchedule(lecturerId: number): Observable<ScheduleEntry[]> {
    return this.http.get<ScheduleEntry[]>(`${BASE}/appointments/lecturer/${lecturerId}`);
  }
  getStudentSchedule(studentId: number): Observable<ScheduleEntry[]> {
    return this.http.get<ScheduleEntry[]>(`${BASE}/appointments/student/${studentId}`);
  }

  // ---- Attendance
  getAttendance(appointmentId: number): Observable<AttendanceRecord[]> {
    return this.http.get<AttendanceRecord[]>(`${BASE}/appointments/${appointmentId}/attendance`);
  }
  saveAttendance(appointmentId: number, entries: AttendanceEntry[]): Observable<AttendanceRecord[]> {
    return this.http.post<AttendanceRecord[]>(`${BASE}/appointments/${appointmentId}/attendance`, { entries });
  }

  // ---- Stats
  getTeachingLoadStats(filter?: StatsFilter): Observable<TeachingLoad[]> {
    return this.http.get<TeachingLoad[]>(`${BASE}/stats/teaching-load`, { params: termParams(filter) });
  }
  getCoursesPerProgram(filter?: StatsFilter): Observable<ProgramCourseCount[]> {
    return this.http.get<ProgramCourseCount[]>(`${BASE}/stats/courses-per-program`, { params: termParams(filter) });
  }
  getSectionsPerType(filter?: StatsFilter): Observable<SectionTypeCount[]> {
    return this.http.get<SectionTypeCount[]>(`${BASE}/stats/sections-per-type`, { params: termParams(filter) });
  }
  getAcademicYears(): Observable<number[]> { return this.http.get<number[]>(`${BASE}/stats/academic-years`); }

  exportTeachingLoadCsv(filter?: StatsFilter): Observable<Blob> {
    return this.http.get(`${BASE}/stats/teaching-load/export`, { params: termParams(filter), responseType: 'blob' });
  }
  exportCoursesPerProgramCsv(filter?: StatsFilter): Observable<Blob> {
    return this.http.get(`${BASE}/stats/courses-per-program/export`, { params: termParams(filter), responseType: 'blob' });
  }
}
