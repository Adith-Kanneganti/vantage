'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Atom,
  BookOpen,
  Calculator,
  CalendarDays,
  ClipboardList,
  ChevronDown,
  CircleHelp,
  Code2,
  Dumbbell,
  X,
  FlaskConical,
  Gauge,
  FileText,
  Globe,
  Landmark,
  LayoutDashboard,
  Leaf,
  LogOut,
  Music2,
  Mail,
  Menu,
  Microscope,
  Palette,
  Settings2,
  Shapes,
  Target,
  Zap,
} from 'lucide-react'

type CourseCategory = {
  name: string
  weight: number | null
  points: number
  pointsPossible: number
  percent: number | null
}

type DashboardPreferences = {
  displayName: string
  showStudentId: boolean
  compactSidebar: boolean
  reduceMotion: boolean
  darkMode: boolean
}

type GradebookCourse = {
  name: string
  code: string
  teacher: string | null
  grade: string
  score: number | null
  totalPoints: {
    earned: number
    possible: number
    percent: number | null
  }
  assignments: {
    name: string
    category: string
    score: string
    points: number | null
    pointsPossible: number | null
    categoryGradeImpact: number | null
    feedback: string | null
    dropped: boolean
    date: string | null
    dueDate: string | null
  }[]
  categories: CourseCategory[]
}

type ReportingPeriod = {
  id: string
  name: string
  start: string | null
  end: string | null
  progress: number | null
  courses: GradebookCourse[]
  error?: string
}

type StudentVueDashboard = {
  selectedPeriodId: string
  reportingPeriods: ReportingPeriod[]
  periodName: string
  periodStart: string | null
  periodEnd: string | null
  periodProgress: number | null
  courses: GradebookCourse[]
  attendance: AttendanceData
  schedule: PortalData['schedule']
  scheduleError?: string
  student: {
    name: string | null
    id: string | null
    photo: string | null
  }
  studentProfileError?: string
  gpa: {
    weighted: number | null
    unweighted: number | null
    cumulative: number | null
  }
}

type AssignmentOverride = {
  points: string
  pointsPossible: string
}

type HypotheticalAssignment = {
  id: number
  category: string
  points: number
  pointsPossible: number
}

type UcCourseOptions = {
  gradeLevel: '9' | '10' | '11' | '12' | ''
  aToG: boolean
  ucApprovedHonors: boolean
  semesters: 1 | 2
}

type AttendanceData = {
  records: {
    date: string
    course: string
    period: string
    status: string
  }[]
  error?: string
}

type PortalData = {
  schedule: {
    title: string
    date: string | null
    detail: string | null
    teacher?: string | null
    term?: string | null
  }[]
  calendar: {
    title: string
    date: string | null
    detail: string | null
  }[]
  mail: {
    subject: string
    sender: string | null
    date: string | null
    body: string | null
  }[]
  documents: {
    name: string
    type: string | null
    date: string | null
    id?: string
  }[]
}

const DEMO_USERNAME = 'demo'
const DEMO_PASSWORD = 'zenflow'

const demoCourses: GradebookCourse[] = [
  {
    name: 'Algebra II',
    code: 'MATH-201',
    teacher: 'Jordan Lee',
    grade: 'A-',
    score: 91.5,
    totalPoints: { earned: 183, possible: 200, percent: 91.5 },
    categories: [
      { name: 'Tests', weight: 60, points: 92, pointsPossible: 100, percent: 92 },
      { name: 'Assignments', weight: 40, points: 91, pointsPossible: 100, percent: 91 },
    ],
    assignments: [
      { name: 'Quadratic Functions Quiz', category: 'Tests', score: '18 / 20', points: 18, pointsPossible: 20, categoryGradeImpact: 0, feedback: 'Good work showing each step.', dropped: false, date: '2026-10-14', dueDate: '2026-10-14' },
      { name: 'Unit 2 Test', category: 'Tests', score: '74 / 80', points: 74, pointsPossible: 80, categoryGradeImpact: 0, feedback: null, dropped: false, date: '2026-10-21', dueDate: '2026-10-21' },
      { name: 'Problem Set 6', category: 'Assignments', score: '46 / 50', points: 46, pointsPossible: 50, categoryGradeImpact: 0, feedback: null, dropped: false, date: '2026-10-20', dueDate: '2026-10-20' },
      { name: 'Problem Set 7', category: 'Assignments', score: '—', points: null, pointsPossible: 50, categoryGradeImpact: null, feedback: null, dropped: false, date: null, dueDate: '2026-10-29' },
    ],
  },
  {
    name: 'Biology',
    code: 'SCI-110',
    teacher: 'Morgan Patel',
    grade: 'B+',
    score: 88.2,
    totalPoints: { earned: 220.5, possible: 250, percent: 88.2 },
    categories: [
      { name: 'Labs', weight: 45, points: 91, pointsPossible: 100, percent: 91 },
      { name: 'Assessments', weight: 55, points: 129.5, pointsPossible: 150, percent: 86.3 },
    ],
    assignments: [
      { name: 'Cell Structure Lab', category: 'Labs', score: '45 / 50', points: 45, pointsPossible: 50, categoryGradeImpact: 0, feedback: 'Clear observations and a thoughtful conclusion.', dropped: false, date: '2026-10-12', dueDate: '2026-10-12' },
      { name: 'Microscope Skills', category: 'Labs', score: '46 / 50', points: 46, pointsPossible: 50, categoryGradeImpact: 0, feedback: null, dropped: false, date: '2026-10-19', dueDate: '2026-10-19' },
      { name: 'Genetics Review', category: 'Assessments', score: '—', points: null, pointsPossible: 25, categoryGradeImpact: null, feedback: null, dropped: false, date: null, dueDate: '2026-10-30' },
    ],
  },
  {
    name: 'English 10',
    code: 'ENG-210',
    teacher: 'Taylor Nguyen',
    grade: 'A',
    score: 94,
    totalPoints: { earned: 235, possible: 250, percent: 94 },
    categories: [
      { name: 'Writing', weight: 65, points: 152, pointsPossible: 160, percent: 95 },
      { name: 'Reading', weight: 35, points: 83, pointsPossible: 90, percent: 92.2 },
    ],
    assignments: [
      { name: 'Personal Narrative', category: 'Writing', score: '95 / 100', points: 95, pointsPossible: 100, categoryGradeImpact: 0, feedback: 'A vivid and well-structured piece.', dropped: false, date: '2026-10-16', dueDate: '2026-10-16' },
      { name: 'Close Reading Notes', category: 'Reading', score: '28 / 30', points: 28, pointsPossible: 30, categoryGradeImpact: 0, feedback: null, dropped: false, date: '2026-10-22', dueDate: '2026-10-22' },
      { name: 'Literary Analysis', category: 'Writing', score: '—', points: null, pointsPossible: 40, categoryGradeImpact: null, feedback: null, dropped: false, date: null, dueDate: '2026-11-02' },
    ],
  },
  {
    name: 'US History',
    code: 'HIST-205',
    teacher: 'Casey Rivera',
    grade: 'B',
    score: 85.7,
    totalPoints: { earned: 180, possible: 210, percent: 85.7 },
    categories: [
      { name: 'Projects', weight: 50, points: 88, pointsPossible: 100, percent: 88 },
      { name: 'Quizzes', weight: 50, points: 92, pointsPossible: 110, percent: 83.6 },
    ],
    assignments: [
      { name: 'Primary Source Analysis', category: 'Projects', score: '44 / 50', points: 44, pointsPossible: 50, categoryGradeImpact: 0, feedback: null, dropped: false, date: '2026-10-13', dueDate: '2026-10-13' },
      { name: 'Constitution Quiz', category: 'Quizzes', score: '18 / 20', points: 18, pointsPossible: 20, categoryGradeImpact: 0, feedback: 'Review the distinction between the two chambers.', dropped: false, date: '2026-10-23', dueDate: '2026-10-23' },
      { name: 'Founding Documents Project', category: 'Projects', score: '—', points: null, pointsPossible: 30, categoryGradeImpact: null, feedback: null, dropped: false, date: null, dueDate: '2026-11-04' },
    ],
  },
]

const demoSchedule: PortalData['schedule'] = [
  { title: 'English 10', date: null, detail: 'Room 214 · 8:15 AM', teacher: 'Taylor Nguyen', term: 'First semester' },
  { title: 'Algebra II', date: null, detail: 'Room 108 · 9:05 AM', teacher: 'Jordan Lee', term: 'First semester' },
  { title: 'Biology', date: null, detail: 'Science Building · 10:30 AM', teacher: 'Morgan Patel', term: 'First semester' },
  { title: 'US History', date: null, detail: 'Room 302 · 1:10 PM', teacher: 'Casey Rivera', term: 'First semester' },
]

const DEMO_DASHBOARD: StudentVueDashboard = {
  selectedPeriodId: 'q1-2026',
  reportingPeriods: [
    { id: 'q1-2026', name: 'Quarter 1', start: '2026-08-12', end: '2026-10-30', progress: 100, courses: demoCourses },
  ],
  periodName: 'Quarter 1',
  periodStart: '2026-08-12',
  periodEnd: '2026-10-30',
  periodProgress: 100,
  courses: demoCourses,
  attendance: {
    records: [
      { date: '2026-10-06', course: 'Biology', period: '3', status: 'Absent' },
      { date: '2026-10-15', course: 'Algebra II', period: '2', status: 'Tardy' },
      { date: '2026-10-15', course: 'Biology', period: '3', status: 'Tardy' },
    ],
  },
  schedule: demoSchedule,
  student: { name: 'Alex Morgan', id: 'DEMO-2048', photo: null },
  gpa: { weighted: 3.62, unweighted: 3.45, cumulative: null },
}

const DEMO_PORTAL_DATA: Omit<PortalData, 'schedule'> = {
  calendar: [
    { title: 'Staff development day', date: '2026-11-06', detail: 'No classes' },
    { title: 'Thanksgiving break', date: '2026-11-23', detail: 'School closed' },
    { title: 'Thanksgiving break', date: '2026-11-24', detail: 'School closed' },
    { title: 'Thanksgiving break', date: '2026-11-25', detail: 'School closed' },
  ],
  mail: [
    { subject: 'Welcome to the new school year', sender: 'Foothill High School', date: '2026-08-12', body: 'We are excited to welcome everyone back. Check your schedule and have a great first week!' },
    { subject: 'Quarter 1 progress update', sender: 'Jordan Lee', date: '2026-10-20', body: 'You are making steady progress in Algebra II. Keep up the good work and bring any questions to class.' },
  ],
  documents: [
    { name: 'Quarter 1 Progress Report', type: 'Sample report', date: '2026-10-23', id: 'quarter-1-report' },
    { name: 'Class Schedule', type: 'Sample schedule', date: '2026-08-12', id: 'class-schedule' },
  ],
}

function parseSchoolCalendarDate(value: string | null) {
  if (!value) return null
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  const date = dateOnly
    ? new Date(Number(dateOnly[1]), Number(dateOnly[2]) - 1, Number(dateOnly[3]))
    : new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

function isSchoolCalendarHoliday(title: string, detail: string | null) {
  return /\b(holiday|closed|no school|break)\b/i.test(`${title} ${detail ?? ''}`)
}

function gradePoints(grade: string) {
  const normalized = grade.trim().toUpperCase().replace(/[+-]$/, '')
  return ({ A: 4, B: 3, C: 2, D: 1, F: 0 } as Record<string, number>)[normalized] ?? null
}

function calculateCourseGpa(grades: string[]) {
  const included = grades.flatMap(grade => {
    const points = gradePoints(grade)
    return points === null ? [] : [points]
  })
  return {
    gpa: included.length
      ? included.reduce((total, points) => total + points, 0) / included.length
      : null,
    includedCourses: included.length,
    totalCourses: grades.length,
  }
}

function calculateUcGpa(
  courses: {
    grade: string
    gradeLevel: '9' | '10' | '11' | '12' | ''
    aToG: boolean
    ucApprovedHonors: boolean
    semesters: 1 | 2
  }[]
) {
  let points = 0
  let includedSemesters = 0
  let honorsSemesters = 0
  const honorsByGradeLevel: Record<'10' | '11', number> = { '10': 0, '11': 0 }
  let includedCourses = 0
  for (const course of courses) {
    const gradeValue = gradePoints(course.grade)
    if (!course.aToG || !['10', '11'].includes(course.gradeLevel) || gradeValue === null) continue
    includedCourses += 1
    includedSemesters += course.semesters
    points += gradeValue * course.semesters
    if (course.ucApprovedHonors && (course.gradeLevel === '10' || course.gradeLevel === '11')) {
      const available = Math.min(
        course.semesters,
        4 - honorsByGradeLevel[course.gradeLevel],
        8 - honorsSemesters
      )
      if (available > 0) {
        points += available
        honorsSemesters += available
        honorsByGradeLevel[course.gradeLevel] += available
      }
    }
  }
  return {
    unweighted: includedSemesters ? points / includedSemesters - honorsSemesters / includedSemesters : null,
    weighted: includedSemesters ? points / includedSemesters : null,
    honorsSemesters,
    includedCourses,
    includedSemesters,
  }
}

function projectCourseGrade(
  currentScore: number | null,
  categories: CourseCategory[],
  projectedCategories: CourseCategory[]
) {
  if (projectedCategories.length === 0) return currentScore
  const allWeighted = categories.length > 0 && categories.every(category => category.weight !== null)
  if (allWeighted) {
    const weightTotal = projectedCategories.reduce((total, category) => total + (category.weight ?? 0), 0)
    return weightTotal > 0
      ? projectedCategories.reduce(
          (total, category) => total + (category.percent ?? 0) * (category.weight ?? 0),
          0
        ) / weightTotal
      : currentScore
  }
  const points = projectedCategories.reduce((total, category) => total + category.points, 0)
  const possible = projectedCategories.reduce((total, category) => total + category.pointsPossible, 0)
  return possible > 0 ? (points / possible) * 100 : currentScore
}

function calculateFinalGradeProjection(
  currentGrade: number,
  finalWeight: number,
  finalScore: number,
  targetGrade?: number
) {
  const weight = finalWeight / 100
  const projectedGrade = currentGrade * (1 - weight) + finalScore * weight
  const targetScore =
    targetGrade === undefined || weight === 0
      ? null
      : (targetGrade - currentGrade * (1 - weight)) / weight
  return { projectedGrade, targetScore }
}

function comparePointsEstimateToOfficial(
  pointsEstimate: number | null,
  officialScore: number | null
) {
  if (pointsEstimate === null || officialScore === null) return null
  const difference = pointsEstimate - officialScore
  return { difference, discrepant: Math.abs(difference) > 1 }
}

type UnavailableFeature = 'mail'
type CachedUnavailableFeature = {
  code: string
  message: string
  expiresAt: number
}
type UnavailableFeatures = Partial<
  Record<UnavailableFeature, CachedUnavailableFeature>
>
type StudentVueUnavailableCode =
  | 'D5518-00'
  | '67139'
  | 'SCHOOL_ATTENDANCE_UNAVAILABLE'

const UNAVAILABLE_FEATURES_STORAGE_KEY = 'zenflow.unavailable-features'
const UNAVAILABLE_FEATURES_TTL_MS = 24 * 60 * 60 * 1000

function isUnavailableResponse(
  value: unknown
): value is { status: 'unavailable'; code: StudentVueUnavailableCode; message: string } {
  return (
    typeof value === 'object' &&
    value !== null &&
    'status' in value &&
    value.status === 'unavailable' &&
    'code' in value &&
    (value.code === 'D5518-00' ||
      value.code === '67139' ||
      value.code === 'SCHOOL_ATTENDANCE_UNAVAILABLE') &&
    'message' in value &&
    typeof value.message === 'string'
  )
}

function isSchoolRecord(
  value: unknown
): value is PortalData['schedule'][number] {
  return (
    typeof value === 'object' &&
    value !== null &&
    'title' in value &&
    typeof value.title === 'string' &&
    'date' in value &&
    (typeof value.date === 'string' || value.date === null) &&
    'detail' in value &&
    (typeof value.detail === 'string' || value.detail === null) &&
    (!('teacher' in value) ||
      typeof value.teacher === 'string' ||
      value.teacher === null) &&
    (!('term' in value) || typeof value.term === 'string' || value.term === null)
  )
}

function isMailMessage(value: unknown): value is PortalData['mail'][number] {
  return (
    typeof value === 'object' &&
    value !== null &&
    'subject' in value &&
    typeof value.subject === 'string' &&
    'sender' in value &&
    (typeof value.sender === 'string' || value.sender === null) &&
    'date' in value &&
    (typeof value.date === 'string' || value.date === null) &&
    'body' in value &&
    (typeof value.body === 'string' || value.body === null)
  )
}

function isStudentDocument(
  value: unknown
): value is PortalData['documents'][number] {
  return (
    typeof value === 'object' &&
    value !== null &&
    'name' in value &&
    typeof value.name === 'string' &&
    'type' in value &&
    (typeof value.type === 'string' || value.type === null) &&
    'date' in value &&
    (typeof value.date === 'string' || value.date === null) &&
    (!('id' in value) || typeof value.id === 'string')
  )
}

function isAttendanceData(value: unknown): value is AttendanceData {
  return (
    typeof value === 'object' &&
    value !== null &&
    'records' in value &&
    Array.isArray(value.records) &&
    value.records.every(
      record =>
        typeof record === 'object' &&
        record !== null &&
        'date' in record &&
        typeof record.date === 'string' &&
        'course' in record &&
        typeof record.course === 'string' &&
        'period' in record &&
        typeof record.period === 'string' &&
        'status' in record &&
        typeof record.status === 'string'
    ) &&
    (!('error' in value) || typeof value.error === 'string')
  )
}

const courseColors = ['#b8ff5c', '#a9d8ff', '#ff9e7a', '#d3b5ff']

function isStudentVueDashboard(value: unknown): value is StudentVueDashboard {
  if (
    typeof value !== 'object' ||
    value === null ||
    !('periodName' in value) ||
    typeof value.periodName !== 'string' ||
    !('selectedPeriodId' in value) ||
    typeof value.selectedPeriodId !== 'string' ||
    !('reportingPeriods' in value) ||
    !Array.isArray(value.reportingPeriods) ||
    !value.reportingPeriods.every((period: unknown) =>
      typeof period === 'object' &&
      period !== null &&
      'id' in period &&
      typeof period.id === 'string' &&
      'name' in period &&
      typeof period.name === 'string' &&
      'start' in period &&
      (typeof period.start === 'string' || period.start === null) &&
      'end' in period &&
      (typeof period.end === 'string' || period.end === null) &&
      'progress' in period &&
      (typeof period.progress === 'number' || period.progress === null) &&
      'courses' in period &&
      Array.isArray(period.courses) &&
      (!('error' in period) || typeof period.error === 'string')
    ) ||
    !('courses' in value) ||
    !Array.isArray(value.courses) ||
    value.courses.length === 0
  ) {
    return false
  }
  return value.courses.every((course: unknown) =>
    typeof course === 'object' &&
    course !== null &&
    'name' in course &&
    typeof course.name === 'string' &&
    'code' in course &&
    typeof course.code === 'string' &&
    'teacher' in course &&
    (typeof course.teacher === 'string' || course.teacher === null) &&
    'grade' in course &&
    typeof course.grade === 'string' &&
    'score' in course &&
    (typeof course.score === 'number' || course.score === null) &&
    'totalPoints' in course &&
    typeof course.totalPoints === 'object' &&
    course.totalPoints !== null &&
    'earned' in course.totalPoints &&
    typeof course.totalPoints.earned === 'number' &&
    'possible' in course.totalPoints &&
    typeof course.totalPoints.possible === 'number' &&
    'percent' in course.totalPoints &&
    (typeof course.totalPoints.percent === 'number' || course.totalPoints.percent === null) &&
    'assignments' in course &&
    Array.isArray(course.assignments) &&
    course.assignments.every((assignment: unknown) =>
      typeof assignment === 'object' &&
      assignment !== null &&
      'name' in assignment &&
      typeof assignment.name === 'string' &&
      'category' in assignment &&
      typeof assignment.category === 'string' &&
      'score' in assignment &&
      typeof assignment.score === 'string' &&
      'points' in assignment &&
      (typeof assignment.points === 'number' || assignment.points === null) &&
      'pointsPossible' in assignment &&
      (typeof assignment.pointsPossible === 'number' || assignment.pointsPossible === null) &&
      'categoryGradeImpact' in assignment &&
      (typeof assignment.categoryGradeImpact === 'number' || assignment.categoryGradeImpact === null) &&
      'feedback' in assignment &&
      (typeof assignment.feedback === 'string' || assignment.feedback === null) &&
      'dropped' in assignment &&
      typeof assignment.dropped === 'boolean' &&
      'date' in assignment &&
      (typeof assignment.date === 'string' || assignment.date === null) &&
      'dueDate' in assignment &&
      (typeof assignment.dueDate === 'string' || assignment.dueDate === null)
    ) &&
    'categories' in course &&
    Array.isArray(course.categories) &&
    course.categories.every((category: unknown) =>
      typeof category === 'object' &&
      category !== null &&
      'name' in category &&
      typeof category.name === 'string' &&
      'weight' in category &&
      (typeof category.weight === 'number' || category.weight === null) &&
      'points' in category &&
      typeof category.points === 'number' &&
      'pointsPossible' in category &&
      typeof category.pointsPossible === 'number' &&
      'percent' in category &&
      (typeof category.percent === 'number' || category.percent === null)
    )
  ) &&
  'attendance' in value &&
  typeof value.attendance === 'object' &&
  value.attendance !== null &&
  'records' in value.attendance &&
  Array.isArray(value.attendance.records) &&
  value.attendance.records.every((record: unknown) =>
    typeof record === 'object' &&
    record !== null &&
    'date' in record &&
    typeof record.date === 'string' &&
    'course' in record &&
    typeof record.course === 'string' &&
    'period' in record &&
    typeof record.period === 'string' &&
    'status' in record &&
    typeof record.status === 'string'
  ) &&
  (!('error' in value.attendance) || typeof value.attendance.error === 'string') &&
  'schedule' in value &&
  Array.isArray(value.schedule) &&
  value.schedule.every(isSchoolRecord) &&
  (!('scheduleError' in value) || typeof value.scheduleError === 'string') &&
  'student' in value &&
  typeof value.student === 'object' &&
  value.student !== null &&
  'name' in value.student &&
  (typeof value.student.name === 'string' || value.student.name === null) &&
  'id' in value.student &&
  (typeof value.student.id === 'string' || value.student.id === null) &&
  'photo' in value.student &&
  (typeof value.student.photo === 'string' || value.student.photo === null) &&
  (!('studentProfileError' in value) || typeof value.studentProfileError === 'string') &&
  'gpa' in value &&
  typeof value.gpa === 'object' &&
  value.gpa !== null &&
  'weighted' in value.gpa &&
  (typeof value.gpa.weighted === 'number' || value.gpa.weighted === null) &&
  'unweighted' in value.gpa &&
  (typeof value.gpa.unweighted === 'number' || value.gpa.unweighted === null) &&
  'cumulative' in value.gpa &&
  (typeof value.gpa.cumulative === 'number' || value.gpa.cumulative === null) &&
  'periodStart' in value &&
  (typeof value.periodStart === 'string' || value.periodStart === null) &&
  'periodEnd' in value &&
  (typeof value.periodEnd === 'string' || value.periodEnd === null) &&
  'periodProgress' in value &&
  (typeof value.periodProgress === 'number' || value.periodProgress === null)
}

function Mark({ children, tone = 'lime' }: { children: React.ReactNode; tone?: string }) {
  return <span className={`mark mark-${tone}`}>{children}</span>
}

function GradeOrb({ score }: { score: number | null }) {
  const percent = score === null ? 0 : Math.max(0, Math.min(score, 100))
  return (
    <div className="orb-wrap" aria-label={score === null ? 'Average unavailable' : `${score.toFixed(1)} percent average`}>
      <div
        className="orb"
        style={{ '--score-angle': `${percent * 3.6}deg` } as React.CSSProperties}
      >
        <span className="orb-label">AVERAGE</span>
        <strong>{score === null ? '—' : score.toFixed(1)}</strong>
        <span className="orb-sub">PERCENT</span>
      </div>
    </div>
  )
}

function CourseArtwork({ courseName }: { courseName: string }) {
  const subject = courseName.toLocaleLowerCase()
  const artwork = /\b(math|algebra|geometry|calculus|statistics|trigonometry)\b/.test(subject)
    ? { name: 'math', title: 'Mathematics', icon: Calculator, accent: 'sage', marks: ['x² + y² = r²', 'π', '∑', 'f(x) = mx + b', 'A = πr²', '√49 = 7', 'E = mc²', 'sin²θ + cos²θ = 1', '∫ x² dx', 'a² + b² = c²', 'θ', 'y = x²'] }
    : /\b(band\s*strings|strings|orchestra|band|choir|music)\b/.test(subject)
      ? { name: 'music', title: 'Band & Strings', icon: Music2, accent: 'lavender', marks: ['♪', '♫', '♩', '𝄞', '♬', '♭', '♮', '♯', '𝄢', 'allegro', 'do · re · mi', 'crescendo'] }
      : /\b(visual.*performing|performing.*arts|visual arts|theater|theatre|dance|drama|art|design)\b/.test(subject)
        ? { name: 'art', title: 'Visual & Performing Arts', icon: Palette, accent: 'lavender', marks: ['✳', '◌', '△', 'stage / light', '色', '✦', 'gesture', 'composition', '1 · 2 · 3', '✧', 'form / space', 'curtain up'] }
        : /\b(english|literature|writing|language arts|ela|reading)\b/.test(subject)
          ? { name: 'literature', title: 'English & Literature', icon: BookOpen, accent: 'rose', marks: ['“Once upon…”', 'Aa', '¶', 'metaphor', '✍', 'chapter 01', 'theme →', 'simile', '✒', '— dialogue —', 'write / revise', 'the quiet narrator'] }
          : /\b(history|government|civics|economics|social studies)\b/.test(subject)
            ? { name: 'history', title: 'History & Society', icon: Landmark, accent: 'sand', marks: ['1776', '◎', '✳', 'primary source', '◆', 'timeline →', 'cause → effect', 'BC · AD', 'archive', '◇', 'whose story?', 'then / now'] }
            : /\b(chem|biology|physics|science|anatomy|environment)\b/.test(subject)
              ? { name: 'science', title: 'Science', icon: Atom, accent: 'mint', marks: ['H₂O', '⚛', 'CO₂', 'E = mc²', 'NaCl', 'cell →', 'observe · test', 'O₂', '→ hypothesis', '✳', 'energy ↔ matter', 'specimen 04'] }
              : /\b(computer|coding|programming|technology|robotics)\b/.test(subject)
                ? { name: 'technology', title: 'Technology', icon: Code2, accent: 'blue', marks: ['{ }', '</>', '01', 'if (curious)', '0101', 'build();'] }
                : /\b(physical education|p\.e\.|fitness|health)\b/.test(subject)
                  ? { name: 'movement', title: 'Movement & Health', icon: Dumbbell, accent: 'sage', marks: ['breathe in', '↗', '○', 'move / rest', '✳', 'one more'] }
                  : /\b(spanish|french|mandarin|chinese|language)\b/.test(subject)
                    ? { name: 'language', title: 'World Languages', icon: Globe, accent: 'blue', marks: ['hola', 'bonjour', '你好', 'ciao', 'あ', '¡vamos!'] }
                    : /\b(agriculture|garden|plant|ecology)\b/.test(subject)
                      ? { name: 'nature', title: 'Nature Studies', icon: Leaf, accent: 'mint', marks: ['芽', '✿', '葉', 'grow slowly', '☼', 'soil → seed'] }
                      : { name: 'learning', title: 'A Curious Mind', icon: BookOpen, accent: 'sage', marks: ['✳', '◌', '△', 'keep wondering', '✦', 'one idea at a time'] }
  const Icon = artwork.icon
  const detailIcons = artwork.name === 'math'
    ? [Shapes, Calculator]
    : artwork.name === 'science'
      ? [FlaskConical, Microscope]
      : artwork.name === 'art'
        ? [Shapes, Palette]
        : [BookOpen, Icon]

  return (
    <div className={`course-art course-art-${artwork.accent}`} aria-hidden="true">
      <div className="course-art-copy">
        <span className="course-art-kicker">TODAY'S STUDY FIELD</span>
        <strong>{artwork.title}</strong>
        <span className="course-art-caption">Follow a thought. See where it goes.</span>
      </div>
      <div className={`course-art-scene course-art-scene-${artwork.name}`}>
        <div className="course-art-orbit course-art-orbit-one" />
        <div className="course-art-orbit course-art-orbit-two" />
        {artwork.marks.map((mark, index) => (
          <span
            className={`course-art-mark course-art-mark-${(index % 12) + 1}`}
            key={mark}
            style={{ animationDelay: `${index * -0.7}s` }}
          >
            {mark}
          </span>
        ))}
        <div className="course-art-icon course-art-icon-main course-art-drift"><Icon strokeWidth={1.35} /></div>
        {detailIcons.map((DetailIcon, index) => (
          <div className={`course-art-icon course-art-icon-${index + 1} course-art-drift`} key={index} style={{ animationDelay: `${index * -1.4}s` }}>
            <DetailIcon strokeWidth={1.35} />
          </div>
        ))}
        <i className="course-art-dot course-art-dot-one" />
        <i className="course-art-dot course-art-dot-two" />
        <i className="course-art-dot course-art-dot-three" />
      </div>
    </div>
  )
}

function SchoolCalendar({
  records,
}: {
  records: PortalData['calendar']
}) {
  const [month, setMonth] = useState(
    () => new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  )
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const eventsByDay = new Map<number, PortalData['calendar']>()
  records.forEach(record => {
    const date = parseSchoolCalendarDate(record.date)
    if (!date || date.getFullYear() !== year || date.getMonth() !== monthIndex) return
    const events = eventsByDay.get(date.getDate()) ?? []
    events.push(record)
    eventsByDay.set(date.getDate(), events)
  })
  const calendarCells = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
  while (calendarCells.length % 7 !== 0) calendarCells.push(null)
  const monthEvents = records
    .map(record => ({ record, date: parseSchoolCalendarDate(record.date) }))
    .filter(
      item =>
        item.date !== null &&
        item.date.getFullYear() === year &&
        item.date.getMonth() === monthIndex
    )
    .sort((left, right) => left.date!.getDate() - right.date!.getDate())

  return <div className="panel attendance-panel school-calendar">
    <div className="panel-heading">
      <div><span className="eyebrow">STUDENTVUE SCHOOL DATES</span><h2>School <em>calendar</em></h2></div>
      <CalendarDays />
    </div>
    <div className="calendar-month-header">
      <button type="button" aria-label="Previous month" onClick={() => setMonth(new Date(year, monthIndex - 1, 1))}><ArrowLeft /></button>
      <strong>{new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(month)}</strong>
      <button type="button" aria-label="Next month" onClick={() => setMonth(new Date(year, monthIndex + 1, 1))}><ArrowRight /></button>
    </div>
    <div className="calendar-grid" role="grid" aria-label={`${new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(month)} school calendar`}>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <span className="calendar-weekday" role="columnheader" key={day}>{day}</span>
      ))}
      {calendarCells.map((day, index) => {
        if (day === null) return <span className="calendar-day calendar-day-empty" role="gridcell" key={`empty-${index}`} />
        const date = new Date(year, monthIndex, day)
        const events = eventsByDay.get(day) ?? []
        const holiday = events.some(event =>
          isSchoolCalendarHoliday(event.title, event.detail)
        )
        const schoolDay = date.getDay() !== 0 && date.getDay() !== 6 && !holiday
        return <div
          className={`calendar-day${schoolDay ? ' calendar-day-school' : ''}${holiday ? ' calendar-day-holiday' : ''}${events.length ? ' calendar-day-event' : ''}`}
          role="gridcell"
          aria-label={`${new Intl.DateTimeFormat(undefined, { weekday: 'long', month: 'long', day: 'numeric' }).format(date)}${holiday ? ', holiday or no-school event' : schoolDay ? ', expected school day' : ', weekend'}`}
          key={day}
        >
          <span className="calendar-day-number">{day}</span>
          {schoolDay && <i className="calendar-school-mark" aria-hidden="true" />}
          {holiday && <span className="calendar-day-label">No school</span>}
          {!holiday && events.length > 0 && <span className="calendar-day-label">Event</span>}
        </div>
      })}
    </div>
    <div className="calendar-legend">
      <span><i className="calendar-legend-school" /> Expected school day</span>
      <span><i className="calendar-legend-holiday" /> Holiday / no-school event</span>
    </div>
    <p className="calendar-guidance">Weekdays are marked as expected school days. Holidays and special events appear only when StudentVUE provides them; confirm closures with your district calendar.</p>
    <div className="calendar-events">
      <h3>{monthEvents.length ? 'Dates from StudentVUE' : 'No listed events this month'}</h3>
      {monthEvents.map(({ record, date }, index) => (
        <article className="calendar-event" key={`${record.title}-${record.date}-${index}`}>
          <time dateTime={`${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(date!.getDate()).padStart(2, '0')}`}>
            <strong>{date!.getDate()}</strong>
            <span>{new Intl.DateTimeFormat(undefined, { weekday: 'short' }).format(date!)}</span>
          </time>
          <div><strong>{record.title}</strong><span>{record.detail ?? (isSchoolCalendarHoliday(record.title, record.detail) ? 'Holiday / no-school event' : 'School event')}</span></div>
        </article>
      ))}
    </div>
  </div>
}

function AttendanceCalendar({
  records,
}: {
  records: AttendanceData['records']
}) {
  const datedRecords = records.flatMap(record => {
    const date = parseSchoolCalendarDate(record.date)
    return date ? [{ record, date }] : []
  })
  const firstDate = datedRecords[0]?.date ?? new Date()
  const [month, setMonth] = useState(
    () => new Date(firstDate.getFullYear(), firstDate.getMonth(), 1)
  )
  const [selectedDate, setSelectedDate] = useState(() =>
    `${firstDate.getFullYear()}-${String(firstDate.getMonth() + 1).padStart(2, '0')}-${String(firstDate.getDate()).padStart(2, '0')}`
  )
  const year = month.getFullYear()
  const monthIndex = month.getMonth()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const recordsByDate = new Map<string, typeof datedRecords>()
  for (const item of datedRecords) {
    const key = `${item.date.getFullYear()}-${String(item.date.getMonth() + 1).padStart(2, '0')}-${String(item.date.getDate()).padStart(2, '0')}`
    const items = recordsByDate.get(key) ?? []
    items.push(item)
    recordsByDate.set(key, items)
  }
  const cells: (number | null)[] = [
    ...Array.from({ length: firstDay }, () => null),
    ...Array.from({ length: daysInMonth }, (_, index) => index + 1),
  ]
  while (cells.length % 7) cells.push(null)
  const selectedRecords = recordsByDate.get(selectedDate) ?? []
  const formatMonth = new Intl.DateTimeFormat(undefined, {
    month: 'long',
    year: 'numeric',
  }).format(month)
  const formatSelectedDate = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const absenceCount = datedRecords.filter(
    ({ record }) => !/\b(tardy|late|present|attended)\b/i.test(record.status)
  ).length
  const changeMonth = (offset: number) => {
    const nextMonth = new Date(year, monthIndex + offset, 1)
    setMonth(nextMonth)
    setSelectedDate(
      `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, '0')}-01`
    )
  }

  return <div className="panel attendance-panel school-calendar attendance-calendar">
    <div className="panel-heading">
      <div>
        <span className="eyebrow">LIVE STUDENTVUE RECORDS · {records.length}</span>
        <h2>Attendance <em>calendar</em></h2>
      </div>
      <CalendarDays />
    </div>
    <div className="calendar-month-header">
      <button type="button" aria-label="Previous month" onClick={() => changeMonth(-1)}><ArrowLeft /></button>
      <strong>{formatMonth}</strong>
      <button type="button" aria-label="Next month" onClick={() => changeMonth(1)}><ArrowRight /></button>
    </div>
    <div className="calendar-grid" role="grid" aria-label={`${formatMonth} attendance calendar`}>
      {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
        <span className="calendar-weekday" role="columnheader" key={day}>{day}</span>
      ))}
      {cells.map((day, index) => {
        if (day === null) {
          return <span className="calendar-day calendar-day-empty" role="gridcell" key={`empty-${index}`} />
        }
        const date = new Date(year, monthIndex, day)
        const key = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
        const dayRecords = recordsByDate.get(key) ?? []
        const hasTardy = dayRecords.some(({ record }) =>
          /\b(tardy|late)\b/i.test(record.status) || /^T$/i.test(record.status.trim())
        )
        const hasAbsence = dayRecords.some(({ record }) =>
          !/\b(tardy|late|present|attended)\b/i.test(record.status) &&
          !/^T$/i.test(record.status.trim())
        )
        const marker = hasAbsence ? 'Absent' : hasTardy ? 'Tardy' : ''
        const isSelected = selectedDate === key
        return <button
          className={`calendar-day attendance-calendar-day${hasAbsence ? ' calendar-day-absent' : ''}${hasTardy && !hasAbsence ? ' calendar-day-tardy' : ''}${isSelected ? ' calendar-day-selected' : ''}`}
          type="button"
          role="gridcell"
          aria-pressed={isSelected}
          aria-label={`${formatSelectedDate.format(date)}${marker ? `, ${marker.toLocaleLowerCase()}` : ''}${dayRecords.length ? `, ${dayRecords.length} attendance record${dayRecords.length === 1 ? '' : 's'}` : ''}`}
          key={day}
          onClick={() => setSelectedDate(key)}
        >
          <span className="calendar-day-number">{day}</span>
          {marker && <span className="attendance-day-marker">{marker}</span>}
        </button>
      })}
    </div>
    <div className="calendar-legend attendance-calendar-legend">
      <span><i className="attendance-legend-absent" /> Absent</span>
      <span><i className="attendance-legend-tardy" /> Tardy</span>
    </div>
    <div className="calendar-events attendance-calendar-events">
      <h3>{selectedRecords.length ? `Records for ${formatSelectedDate.format(parseSchoolCalendarDate(selectedDate) ?? new Date())}` : 'No attendance records for this day'}</h3>
      {selectedRecords.map(({ record }, index) => (
        <article className="calendar-event" key={`${record.course}-${record.period}-${record.status}-${index}`}>
          <time><strong>{record.period || '—'}</strong><span>Period</span></time>
          <div>
            <strong>{record.course || (/\b(tardy|late)\b/i.test(record.status) ? 'Tardy' : 'Absence')}</strong>
            <span>{record.status || 'Absence recorded'}{record.period && record.course ? ` · Period ${record.period}` : ''}</span>
          </div>
          <span className={`attendance-status-badge${/\b(tardy|late)\b/i.test(record.status) ? ' attendance-status-tardy' : ''}`}>
            {/\b(tardy|late)\b/i.test(record.status) ? 'TARDY' : 'ABSENT'}
          </span>
        </article>
      ))}
    </div>
    <p className="calendar-guidance">{absenceCount} absence{absenceCount === 1 ? '' : 's'} shown in the attendance records returned by StudentVUE. Select a marked day to see class details.</p>
  </div>
}

function formatCategoryImpact(impact: number | null) {
  if (impact === null) {
    return 'Impact unavailable';
  }
  if (impact === 0) {
    return 'No change to category average';
  }
  const direction = impact > 0 ? 'raises' : 'lowers';
  const amount = `${impact > 0 ? '+' : ''}${impact.toFixed(2)} pp`
  return `${direction} category average ${amount}`;
}

function categoryKey(value: string) {
  return value.trim().replace(/\s+/g, ' ').toLocaleLowerCase()
}

function parseUcGradeLevel(value: string): UcCourseOptions['gradeLevel'] {
  switch (value) {
    case '9':
    case '10':
    case '11':
    case '12':
      return value
    default:
      return ''
  }
}

function getAssignmentPercent(
  points: number | null,
  pointsPossible: number | null,
  score: string,
) {
  if (
    points !== null &&
    pointsPossible !== null &&
    Number.isFinite(points) &&
    Number.isFinite(pointsPossible) &&
    pointsPossible > 0
  ) {
    return (points / pointsPossible) * 100
  }
  const percentage = score.match(/^\s*(\d+(?:\.\d+)?)\s*%\s*$/)
  if (percentage) return Number(percentage[1])
  const fraction = score.match(/^\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)\s*$/)
  if (!fraction || Number(fraction[2]) <= 0) return null
  return (Number(fraction[1]) / Number(fraction[2])) * 100
}

function classifyScheduleSemester(term: string | null | undefined) {
  const normalized = term?.trim().toLocaleLowerCase() ?? ''
  if (/\b(first|1st|one)\s+semester\b|\bsemester\s*(1|one|i)\b|\bs1\b|\bfall\b/.test(normalized)) {
    return 'first'
  }
  if (/\b(second|2nd|two)\s+semester\b|\bsemester\s*(2|two|ii)\b|\bs2\b|\bspring\b/.test(normalized)) {
    return 'second'
  }
  return 'other'
}

function formatPeriodDate(value: string | null) {
  if (!value) return 'Date unavailable'
  const date = new Date(`${value.slice(0, 10)}T00:00:00Z`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(date)
}

function QuarterProgress({
  period,
  reportingPeriods,
  onSelect,
}: {
  period: ReportingPeriod
  reportingPeriods: ReportingPeriod[]
  onSelect: (id: string) => void
}) {
  const progress = period.progress
  return (
    <div className="panel quarter-progress">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">OFFICIAL STUDENTVUE REPORT</span>
          <h2>{period.name}</h2>
        </div>
        <label className="report-period-select">
          <span>VIEW REPORT</span>
          <select value={period.id} onChange={event => onSelect(event.target.value)}>
            {reportingPeriods.map(report => (
              <option key={report.id} value={report.id}>{report.name}</option>
            ))}
          </select>
        </label>
      </div>
      {period.error
        ? <p role="status">{period.error}</p>
        : progress === null
          ? <p>StudentVUE did not provide reporting-period dates.</p>
        : <>
            <progress className="quarter-progress-bar" max="100" value={progress} aria-label={`${progress}% of the reporting period elapsed`} />
            <div className="quarter-dates">
              <span><small>REPORT START</small>{formatPeriodDate(period.start)}</span>
              <span><small>REPORT END</small>{formatPeriodDate(period.end)}</span>
            </div>
            <p>{progress >= 100 ? 'This reporting period has ended. Grades shown are the official StudentVUE report.' : `${progress}% of this reporting period has elapsed.`}</p>
          </>}
    </div>
  )
}

function Login({
  onLogin,
}: {
  onLogin: (dashboard: StudentVueDashboard) => void
}) {
  const [studentId, setStudentId] = useState(DEMO_USERNAME)
  const [password, setPassword] = useState(DEMO_PASSWORD)
  const [error, setError] = useState('')

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (studentId.trim() !== DEMO_USERNAME || password !== DEMO_PASSWORD) {
      setError(`Use the demo ID "${DEMO_USERNAME}" and password "${DEMO_PASSWORD}".`)
      return
    }
    onLogin(DEMO_DASHBOARD)
  }

  return (
    <main className="login-page">
      <nav className="topbar login-nav"><div className="brand"><span className="brand-dot" />ZENFLOW</div><span className="nav-note">A CALMER WAY TO KEEP UP</span></nav>
      <section className="login-grid">
        <div className="login-copy">
          <div className="eyebrow"><span className="live-dot" /> BUILT FOR THE SCHOOL YEAR</div>
          <h1>Know where<br /><em>you stand.</em></h1>
          <p className="lede">ZenFlow turns a busy gradebook into a clear, encouraging plan. See what matters, celebrate progress, and walk into your next class prepared.</p>
          <div className="photo-frame"><div className="zen-scene" aria-hidden="true"><span className="zen-moon" /><span className="zen-hill hill-one" /><span className="zen-hill hill-two" /><span className="zen-stone stone-one" /><span className="zen-stone stone-two" /><span className="zen-stone stone-three" /><span className="zen-stem" /><span className="zen-leaf leaf-one" /><span className="zen-leaf leaf-two" /><span className="zen-water water-one" /><span className="zen-water water-two" /><span className="zen-branch" /><span className="blossom blossom-one" /><span className="blossom blossom-two" /><span className="blossom blossom-three" /><span className="blossom blossom-four" /></div><div className="photo-copy"><span>YOUR SPACE</span><strong>Your grades, thoughtfully<br />brought together.</strong></div><span className="photo-mark">ZF / 01</span></div>
          <div className="login-stat"><span>01</span><div><strong>FRONTEND DEMO</strong><p>Sample data stays in this page. Nothing is sent to StudentVUE or a server.</p></div></div>
        </div>
        <form className="login-card" onSubmit={submit}>
          <div className="card-kicker">WELCOME BACK <span>↗</span></div>
          <h2>Settle in to<br /><span>your ZenFlow.</span></h2>
          <label>DEMO ID<input required value={studentId} onChange={event => setStudentId(event.target.value)} autoComplete="username" /></label>
          <label>DEMO PASSWORD<div className="password-wrap"><input required type="password" value={password} onChange={event => setPassword(event.target.value)} autoComplete="current-password" /><CircleHelp /></div></label>
          <p className="terms">Demo credentials: <strong>{DEMO_USERNAME}</strong> / <strong>{DEMO_PASSWORD}</strong>. This frontend-only demo uses fictional sample data.</p>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-btn">OPEN ZENFLOW <ArrowRight /></button>
        </form>
      </section>
      <div className="login-footer"><span>© 2025 ZENFLOW</span><span>ONE CLEAR STEP AT A TIME <ArrowRight /></span></div>
    </main>
  )
}

function CourseCard({
  course,
  color,
  selected,
  onSelect,
}: {
  course: GradebookCourse
  color: string
  selected: boolean
  onSelect: () => void
}) {
  return <button className={`course-card${selected ? ' selected' : ''}`} onClick={onSelect} aria-pressed={selected} aria-label={`View assignments for ${course.name}`} style={{ '--course': color } as React.CSSProperties}>
    <div className="course-top"><span className="course-code">{course.code}</span><span className="trend">LIVE <Zap /></span></div>
    <div className="course-title"><div><h3>{course.name}</h3><span className="course-teacher">{course.teacher ?? 'Teacher not listed'}</span></div><span>{course.grade}</span></div>
    <div className="score-row"><strong>{course.score ?? '—'}</strong><span>{course.score === null ? '' : '%'}</span><div className="mini-bar"><i style={{ width: `${Math.max(0, Math.min(course.score ?? 0, 100))}%` }} /></div></div>
    <div className="course-bottom"><span>STUDENTVUE GRADE</span><span>VIEW ASSIGNMENTS <ArrowRight /></span></div>
  </button>
}

function Dashboard({
  dashboard,
  onLogout,
}: {
  dashboard: StudentVueDashboard
  onLogout: () => void
}) {
  const [selected, setSelected] = useState(0)
  const [selectedPeriodId, setSelectedPeriodId] = useState(dashboard.selectedPeriodId)
  const [coursePortalOpen, setCoursePortalOpen] = useState(false)
  const [attendancePortalOpen, setAttendancePortalOpen] = useState(false)
  const [planningOpen, setPlanningOpen] = useState(false)
  const [planningTipDismissed, setPlanningTipDismissed] = useState(false)
  const [preferencesOpen, setPreferencesOpen] = useState(false)
  const [preferencesLoaded, setPreferencesLoaded] = useState(false)
  const [preferences, setPreferences] = useState<DashboardPreferences>({
    displayName: '',
    showStudentId: true,
    compactSidebar: false,
    reduceMotion: false,
    darkMode: false,
  })
  const [studentPhotoFailed, setStudentPhotoFailed] = useState(false)
  const [attendanceData, setAttendanceData] = useState(dashboard.attendance)
  const [dataPortal, setDataPortal] = useState<
    'mail' | 'documents' | 'schedule' | 'calendar' | 'feedback' | null
  >(null)
  const [portalData, setPortalData] = useState<PortalData>({
    schedule: dashboard.schedule,
    ...DEMO_PORTAL_DATA,
  })
  const [documentDownloadId, setDocumentDownloadId] = useState('')
  const [hypotheticalMode, setHypotheticalMode] = useState(false)
  const [assignmentCategoryFilter, setAssignmentCategoryFilter] = useState('All')
  const [assignmentOverrides, setAssignmentOverrides] = useState<
    Record<number, AssignmentOverride>
  >({})
  const [hypotheticalAssignments, setHypotheticalAssignments] = useState<
    HypotheticalAssignment[]
  >([])
  const [newAssignmentPoints, setNewAssignmentPoints] = useState('')
  const [newAssignmentPossible, setNewAssignmentPossible] = useState('')
  const [newAssignmentError, setNewAssignmentError] = useState('')
  const [nextHypotheticalAssignmentId, setNextHypotheticalAssignmentId] = useState(0)
  const [finalWeight, setFinalWeight] = useState('')
  const [finalScore, setFinalScore] = useState('')
  const [targetGrade, setTargetGrade] = useState('')
  const [ucCourseOptions, setUcCourseOptions] = useState<
    Record<string, UcCourseOptions>
  >({})
  const [scheduleSemester, setScheduleSemester] = useState<
    'all' | 'first' | 'second'
  >('all')
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem('zenflow.preferences')
      if (saved) {
        const parsed: unknown = JSON.parse(saved)
        if (
          typeof parsed === 'object' &&
          parsed !== null &&
          'displayName' in parsed &&
          typeof parsed.displayName === 'string' &&
          'showStudentId' in parsed &&
          typeof parsed.showStudentId === 'boolean' &&
          'compactSidebar' in parsed &&
          typeof parsed.compactSidebar === 'boolean' &&
          'reduceMotion' in parsed &&
          typeof parsed.reduceMotion === 'boolean' &&
          (!('darkMode' in parsed) || typeof parsed.darkMode === 'boolean')
        ) {
          setPreferences({
            displayName: parsed.displayName,
            showStudentId: parsed.showStudentId,
            compactSidebar: parsed.compactSidebar,
            reduceMotion: parsed.reduceMotion,
            darkMode:
              'darkMode' in parsed && typeof parsed.darkMode === 'boolean'
                ? parsed.darkMode
                : false,
          })
        }
      }
    } catch (error) {
      console.error('Could not load ZenFlow preferences.', error)
    } finally {
      setPreferencesLoaded(true)
    }
  }, [])
  useEffect(() => {
    if (!preferencesLoaded) return
    try {
      window.localStorage.setItem('zenflow.preferences', JSON.stringify(preferences))
    } catch (error) {
      console.error('Could not save ZenFlow preferences.', error)
    }
  }, [preferences, preferencesLoaded])
  const period = dashboard.reportingPeriods.find(report => report.id === selectedPeriodId) ?? {
    id: dashboard.selectedPeriodId,
    name: dashboard.periodName,
    start: dashboard.periodStart,
    end: dashboard.periodEnd,
    progress: dashboard.periodProgress,
    courses: dashboard.courses,
  }
  const courses = period.courses.map(course => {
    const normalizedName = course.name.trim().replace(/\s+/g, ' ').toLocaleLowerCase()
    const scheduleCourse = portalData.schedule.find(
      record =>
        record.teacher &&
        record.title.trim().replace(/\s+/g, ' ').toLocaleLowerCase() ===
          normalizedName
    )
    return {
      ...course,
      teacher: course.teacher ?? scheduleCourse?.teacher ?? null,
    }
  })
  const active = courses[selected] ?? courses[0]
  const assignmentCategories = [
    ...new Set([
      ...(active?.assignments.map(assignment => assignment.category) ?? []),
      ...(active?.categories.map(category => category.name) ?? []),
    ]),
  ]
  const scores = useMemo(
    () => courses.flatMap(course => course.score === null ? [] : [course.score]),
    [courses]
  )
  const courseGpa = useMemo(
    () => calculateCourseGpa(courses.map(course => course.grade)),
    [courses]
  )
  const ucGpa = useMemo(
    () =>
      calculateUcGpa(
        courses.map((course, index) => {
          const options = ucCourseOptions[`${course.code}-${index}`] ?? {
            gradeLevel: '',
            aToG: false,
            ucApprovedHonors: false,
            semesters: 1 as const,
          }
          return { grade: course.grade, ...options }
        })
      ),
    [courses, ucCourseOptions]
  )
  const average = scores.length
    ? scores.reduce((total, score) => total + score, 0) / scores.length
    : 0
  const scheduleRecords = portalData.schedule.filter(record =>
    scheduleSemester === 'all' ||
    classifyScheduleSemester(record.term) === scheduleSemester
  )
  const firstSemesterCount = portalData.schedule.filter(
    record => classifyScheduleSemester(record.term) === 'first'
  ).length
  const secondSemesterCount = portalData.schedule.filter(
    record => classifyScheduleSemester(record.term) === 'second'
  ).length
  const today = new Intl.DateTimeFormat(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date())
  function openCourse(index: number) {
    setSelected(index)
    resetHypotheticalChanges()
    setCoursePortalOpen(true)
    setAttendancePortalOpen(false)
    setPlanningOpen(false)
    setDataPortal(null)
    setPreferencesOpen(false)
  }
  function downloadStudentDocument(studentDocument: PortalData['documents'][number]) {
    if (!studentDocument.id) return
    setDocumentDownloadId(studentDocument.id)
    const blob = new Blob(
      [`${studentDocument.name}\n\nSample document generated by the ZenFlow frontend demo.`],
      { type: 'text/plain' }
    )
    const url = URL.createObjectURL(blob)
    const link = window.document.createElement('a')
    link.href = url
    link.download = `${studentDocument.name.replace(/[\\/:*?"<>|]/g, '_')}.txt`
    window.document.body.append(link)
    link.click()
    link.remove()
    window.setTimeout(() => URL.revokeObjectURL(url), 60_000)
    setDocumentDownloadId('')
  }
  function openGradebook() {
    setCoursePortalOpen(false)
    setAttendancePortalOpen(false)
    setPlanningOpen(false)
    setDataPortal(null)
    setPreferencesOpen(false)
  }
  function openPlanning() {
    setCoursePortalOpen(false)
    setAttendancePortalOpen(false)
    setPlanningOpen(true)
    setPlanningTipDismissed(false)
    setDataPortal(null)
    setPreferencesOpen(false)
  }
  function openPreferences() {
    setCoursePortalOpen(false)
    setAttendancePortalOpen(false)
    setPlanningOpen(false)
    setDataPortal(null)
    setPreferencesOpen(true)
  }
  function resetHypotheticalChanges() {
    setHypotheticalMode(false)
    setAssignmentCategoryFilter('All')
    setAssignmentOverrides({})
    setHypotheticalAssignments([])
    setNewAssignmentPoints('')
    setNewAssignmentPossible('')
    setNewAssignmentError('')
    setNextHypotheticalAssignmentId(0)
    setFinalWeight('')
    setFinalScore('')
    setTargetGrade('')
  }
  function updateUcCourseOption(
    key: string,
    option: keyof UcCourseOptions,
    value: UcCourseOptions[keyof UcCourseOptions]
  ) {
    setUcCourseOptions(current => {
      const existing = current[key] ?? {
        gradeLevel: '',
        aToG: false,
        ucApprovedHonors: false,
        semesters: 1 as const,
      }
      return { ...current, [key]: { ...existing, [option]: value } }
    })
  }
  function assignmentCategoryAverage(
    categoryName: string,
    earnedDelta = 0,
    possibleDelta = 0,
  ) {
    const category = active?.categories.find(
      item => categoryKey(item.name) === categoryKey(categoryName)
    )
    if (!category) return null
    const points = category.points + earnedDelta
    const possible = category.pointsPossible + possibleDelta
    return possible > 0 ? (points / possible) * 100 : null
  }
  function addHypotheticalAssignment() {
    const points = Number(newAssignmentPoints)
    const pointsPossible = Number(newAssignmentPossible)
    const categoryName =
      assignmentCategoryFilter === 'All'
        ? active?.categories[0]?.name
        : assignmentCategoryFilter
    if (
      !categoryName ||
      newAssignmentPoints.trim() === '' ||
      newAssignmentPossible.trim() === '' ||
      !Number.isFinite(points) ||
      !Number.isFinite(pointsPossible) ||
      points < 0 ||
      pointsPossible <= 0
    ) {
      setNewAssignmentError(
        !categoryName
          ? 'A category is needed before adding a hypothetical assignment.'
          : 'Enter a non-negative score and points possible greater than zero.'
      )
      return
    }
    setHypotheticalAssignments(current => [
      ...current,
      {
        id: nextHypotheticalAssignmentId,
        category: categoryName,
        points,
        pointsPossible,
      },
    ])
    setNextHypotheticalAssignmentId(current => current + 1)
    setNewAssignmentPoints('')
    setNewAssignmentPossible('')
    setNewAssignmentError('')
  }
  function changeAssignmentOverride(
    index: number,
    field: keyof AssignmentOverride,
    value: string,
    original: GradebookCourse['assignments'][number],
  ) {
    setAssignmentOverrides(current => {
      const existing = current[index] ?? {
        points: original.points === null ? '' : String(original.points),
        pointsPossible:
          original.pointsPossible === null ? '' : String(original.pointsPossible),
      }
      return { ...current, [index]: { ...existing, [field]: value } }
    })
  }
  const projectedCategories = (active?.categories ?? []).map(category => {
    let points = category.points
    let pointsPossible = category.pointsPossible
    active?.assignments.forEach((assignment, index) => {
      if (
        assignment.dropped ||
        categoryKey(assignment.category) !== categoryKey(category.name)
      ) {
        return
      }
      const override = assignmentOverrides[index]
      if (!override) return
      const editedPoints =
        override.points.trim() === '' ? null : Number(override.points)
      const editedPossible =
        override.pointsPossible.trim() === ''
          ? null
          : Number(override.pointsPossible)
      if (
        editedPoints === null ||
        editedPossible === null ||
        !Number.isFinite(editedPoints) ||
        !Number.isFinite(editedPossible) ||
        editedPoints < 0 ||
        editedPossible <= 0
      ) {
        return
      }
      points += editedPoints - (assignment.points ?? 0)
      pointsPossible += editedPossible - (assignment.pointsPossible ?? 0)
    })
    hypotheticalAssignments.forEach(assignment => {
      if (categoryKey(assignment.category) === categoryKey(category.name)) {
        points += assignment.points
        pointsPossible += assignment.pointsPossible
      }
    })
    return {
      ...category,
      points,
      pointsPossible,
      percent: pointsPossible > 0 ? (points / pointsPossible) * 100 : null,
    }
  })
  const hypotheticalGrade = projectCourseGrade(
    active?.score ?? null,
    active?.categories ?? [],
    projectedCategories
  )
  const finalWeightValue = finalWeight.trim() === '' ? null : Number(finalWeight)
  const finalScoreValue = finalScore.trim() === '' ? null : Number(finalScore)
  const targetGradeValue = targetGrade.trim() === '' ? undefined : Number(targetGrade)
  const finalProjection =
    (hypotheticalGrade ?? active?.score ?? null) !== null &&
    finalWeightValue !== null &&
    finalScoreValue !== null
      ? calculateFinalGradeProjection(
          hypotheticalGrade ?? active?.score ?? 0,
          finalWeightValue,
          finalScoreValue,
          targetGradeValue
        )
      : null
  const listedFinal = active?.assignments.find(assignment =>
    /\bfinal(?:\s+exam)?\b|\bexam\s+final\b/i.test(assignment.name)
  )
  const pointsEstimateComparison = listedFinal
    ? comparePointsEstimateToOfficial(
        active?.totalPoints.percent ?? null,
        active?.score ?? null
      )
    : null
  function openAttendance() {
    setCoursePortalOpen(false)
    setAttendancePortalOpen(true)
    setPlanningOpen(false)
    setDataPortal(null)
    setPreferencesOpen(false)
    setAttendanceData(dashboard.attendance)
  }
  function openFeedback() {
    setCoursePortalOpen(false)
    setAttendancePortalOpen(false)
    setPlanningOpen(false)
    setDataPortal('feedback')
    setPreferencesOpen(false)
  }
  function openDataPortal(
    view: 'mail' | 'documents' | 'schedule' | 'calendar'
  ) {
    setCoursePortalOpen(false)
    setAttendancePortalOpen(false)
    setPlanningOpen(false)
    setDataPortal(view)
    setPreferencesOpen(false)
    setPortalData(current => ({
      ...current,
      [view]: view === 'schedule' ? dashboard.schedule : DEMO_PORTAL_DATA[view],
    }))
  }
  const feedbackItems = courses.flatMap(course =>
    course.assignments
      .filter(assignment => assignment.feedback)
      .map((assignment, index) => ({
        ...assignment,
        courseName: course.name,
        courseCode: course.code,
        key: `${course.code}-${assignment.name}-${index}`,
      }))
  )
  const planningAssignments = courses
    .flatMap((course, courseIndex) =>
      course.assignments.flatMap((assignment, assignmentIndex) => {
        const ungraded =
          assignment.points === null &&
          (assignment.score.trim() === '' ||
            /\b(not graded|ungraded|pending|not scored|awaiting)\b/i.test(
              assignment.score
            ) ||
            /^(?:--?|—|n\/a)$/i.test(assignment.score.trim()))
        if (assignment.dropped || !ungraded) return []
        const category = course.categories.find(
          item => categoryKey(item.name) === categoryKey(assignment.category)
        )
        const dueDate = parseSchoolCalendarDate(assignment.dueDate)
        const validDueDate =
          dueDate && !Number.isNaN(dueDate.getTime()) ? dueDate : null
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const daysUntilDue = validDueDate
          ? Math.ceil((validDueDate.getTime() - today.getTime()) / 86_400_000)
          : null
        const pointsPossible = assignment.pointsPossible
        const currentCategoryAverage =
          category && category.pointsPossible > 0
            ? (category.points / category.pointsPossible) * 100
            : null
        const projectedCategoryAverage =
          category &&
          pointsPossible !== null &&
          pointsPossible > 0 &&
          category.pointsPossible >= 0
            ? ((category.points + pointsPossible) /
                (category.pointsPossible + pointsPossible)) *
              100
            : null
        const categoryIncrease =
          currentCategoryAverage !== null && projectedCategoryAverage !== null
            ? projectedCategoryAverage - currentCategoryAverage
            : null
        const courseGradeIncrease =
          categoryIncrease !== null &&
          category?.weight !== null &&
          category?.weight !== undefined
            ? categoryIncrease * category.weight / 100
            : null
        const priorityImpact = courseGradeIncrease ?? categoryIncrease
        const priority =
          daysUntilDue !== null && daysUntilDue < 0
            ? 'High'
            : daysUntilDue !== null && daysUntilDue <= 2
              ? 'High'
              : daysUntilDue !== null && daysUntilDue <= 7
                ? 'Medium'
                : daysUntilDue !== null
                  ? (priorityImpact ?? 0) >= 1
                    ? 'Medium'
                    : 'Low'
                  : priorityImpact !== null
                    ? priorityImpact >= 5
                      ? 'High'
                      : priorityImpact >= 1
                        ? 'Medium'
                        : 'Low'
                    : 'Unrated'
        const urgency =
          daysUntilDue === null ? 0 : daysUntilDue < 0 ? 4 : daysUntilDue <= 2 ? 3 : daysUntilDue <= 7 ? 2 : 1
        const dueLabel =
          daysUntilDue === null
            ? 'Due date unavailable'
            : daysUntilDue < 0
              ? `${Math.abs(daysUntilDue)} day${daysUntilDue === -1 ? '' : 's'} overdue`
              : daysUntilDue === 0
                ? 'Due today'
                : daysUntilDue === 1
                  ? 'Due tomorrow'
                  : `Due in ${daysUntilDue} days`
        return [{
          assignment,
          courseIndex,
          courseName: course.name,
          key: `${course.code}-${assignment.name}-${assignmentIndex}`,
          currentCategoryAverage,
          categoryIncrease,
          projectedCategoryAverage,
          courseGradeIncrease,
          currentCourseGrade: course.score,
          projectedCourseGrade:
            course.score !== null && courseGradeIncrease !== null
              ? course.score + courseGradeIncrease
              : null,
          daysUntilDue,
          dueLabel,
          urgency,
          priorityImpact,
          priority,
        }]
      })
    )
    .sort((a, b) =>
      b.urgency - a.urgency ||
      (a.daysUntilDue ?? Number.MAX_SAFE_INTEGER) -
        (b.daysUntilDue ?? Number.MAX_SAFE_INTEGER) ||
      (b.priorityImpact ?? -1) - (a.priorityImpact ?? -1) ||
      a.courseName.localeCompare(b.courseName) ||
      a.assignment.name.localeCompare(b.assignment.name)
    )
  const highPriorityAssignments = planningAssignments.filter(
    assignment => assignment.priority === 'High'
  ).length
  const suggestedAssignment = planningAssignments[0]
  const suggestedPractice = suggestedAssignment
    ? /\b(test|exam|quiz)\b/i.test(
        `${suggestedAssignment.assignment.name} ${suggestedAssignment.assignment.category}`
      )
      ? `Practice a few questions for ${suggestedAssignment.assignment.name}.`
      : `Review your notes and try a practice problem for ${suggestedAssignment.assignment.name}.`
    : ''
  const displayName = preferences.displayName.trim() || dashboard.student.name || 'Student'
  const schoolName = 'Foothill High School'
  const profileId = dashboard.student.id ?? DEMO_USERNAME
  const profileIdLabel = dashboard.student.id ? 'Student ID' : 'Sign-in ID'
  const initials = displayName === 'Student'
    ? 'SV'
    : displayName.split(/\s+/).slice(0, 2).map(part => part[0]?.toLocaleUpperCase() ?? '').join('')
  const studentPhoto = dashboard.student.photo
  useEffect(() => {
    setStudentPhotoFailed(false)
  }, [studentPhoto])

  return <main className={`portal${planningOpen ? ' planning-open' : ''}${preferences.compactSidebar ? ' compact-sidebar' : ''}${preferences.reduceMotion ? ' reduce-motion' : ''}${preferences.darkMode ? ' dark-mode' : ''}`}>
    <div className="portal-garden" aria-hidden="true"><div className="portal-water water-one" /><div className="portal-water water-two" /><div className="portal-stone stone-one" /><div className="portal-stone stone-two" /><div className="blossom-branch"><i /><i /><i /><i /><i /><i /></div><div className="blossom-petal petal-one" /><div className="blossom-petal petal-two" /><div className="blossom-petal petal-three" /></div>
    <aside className="sidebar">
      <div className="brand"><span className="brand-dot" />ZENFLOW</div>
      <div className="side-label">DEMO MODE · FICTIONAL SAMPLE DATA</div>
      <div className="side-label">OVERVIEW</div>
      <nav className="sidebar-primary-nav" aria-label="Main navigation">
        <button className={`side-link${!coursePortalOpen && !attendancePortalOpen && !planningOpen && !preferencesOpen && !dataPortal ? ' active' : ''}`} onClick={openGradebook} aria-pressed={!coursePortalOpen && !attendancePortalOpen && !planningOpen && !preferencesOpen && !dataPortal}><LayoutDashboard /> Gradebook</button>
        <button className={`side-link${planningOpen ? ' active' : ''}`} onClick={openPlanning} aria-pressed={planningOpen}><ClipboardList /> Planning</button>
      </nav>
      <nav className="sidebar-mobile-tools" aria-label="Student information">
        <button className={`side-link${dataPortal === 'documents' ? ' active' : ''}`} onClick={() => openDataPortal('documents')} aria-pressed={dataPortal === 'documents'}><FileText /> Documents</button>
        <button className={`side-link${preferencesOpen ? ' active' : ''}`} onClick={openPreferences} aria-pressed={preferencesOpen}><Settings2 /> Profile</button>
      </nav>
      <div className="side-label">SCHOOL</div>
      <button className={`side-link${attendancePortalOpen ? ' active' : ''}`} onClick={openAttendance} aria-pressed={attendancePortalOpen}><CalendarDays /> Attendance</button>
      <button className={`side-link${dataPortal === 'schedule' ? ' active' : ''}`} onClick={() => openDataPortal('schedule')} aria-pressed={dataPortal === 'schedule'}><BookOpen /> Class schedule</button>
      <button className={`side-link${dataPortal === 'calendar' ? ' active' : ''}`} onClick={() => openDataPortal('calendar')} aria-pressed={dataPortal === 'calendar'}><CalendarDays /> Calendar</button>
      <button className={`side-link${dataPortal === 'documents' ? ' active' : ''}`} onClick={() => openDataPortal('documents')} aria-pressed={dataPortal === 'documents'}><FileText /> Documents</button>
      <button className={`side-link${dataPortal === 'mail' ? ' active' : ''}`} onClick={() => openDataPortal('mail')} aria-pressed={dataPortal === 'mail'}><Mail /> Mail</button>
      <button className={`side-link${dataPortal === 'feedback' ? ' active' : ''}`} onClick={openFeedback} aria-pressed={dataPortal === 'feedback'}><Gauge /> Assignment feedback</button>
      <section className="sidebar-uc-gpa" aria-labelledby="uc-gpa-title">
        <div className="sidebar-uc-gpa-heading">
          <span className="eyebrow">UC GPA ESTIMATE</span>
          <h2 id="uc-gpa-title">UC <em>calculator</em></h2>
        </div>
        <div className="sidebar-uc-gpa-results">
          <div>
            <strong>{ucGpa.unweighted === null ? '—' : ucGpa.unweighted.toFixed(2)}</strong>
            <span>UNWEIGHTED</span>
          </div>
          <div>
            <strong>{ucGpa.weighted === null ? '—' : ucGpa.weighted.toFixed(2)}</strong>
            <span>WEIGHTED · {ucGpa.honorsSemesters}/8</span>
          </div>
        </div>
        <p className="sidebar-uc-gpa-count">
          {ucGpa.includedCourses
            ? `${ucGpa.includedCourses} selected courses · ${ucGpa.includedSemesters} semesters counted`
            : 'Choose grade level and A–G eligibility to calculate'}
        </p>
        <details className="sidebar-uc-gpa-options">
          <summary>Edit course eligibility <ChevronDown aria-hidden="true" /></summary>
          <p>Select A–G courses from 10th or 11th grade. Count one semester by default; choose two only when this grade represents both semesters. Only mark honors for UC-approved courses.</p>
          <div className="uc-gpa-course-list">
            {courses.map((course, index) => {
              const key = `${course.code}-${index}`
              const options = ucCourseOptions[key] ?? {
                gradeLevel: '',
                aToG: false,
                ucApprovedHonors: false,
                semesters: 1 as const,
              }
              return <div className="uc-gpa-course sidebar-uc-gpa-course" key={key}>
                <div className="uc-gpa-course-name">
                  <strong>{course.name}</strong>
                  <span>Current grade: {course.grade}</span>
                </div>
                <div className="sidebar-uc-gpa-selects">
                  <label>
                    Grade level
                    <select
                      value={options.gradeLevel}
                      onChange={event =>
                        updateUcCourseOption(
                          key,
                          'gradeLevel',
                          parseUcGradeLevel(event.target.value)
                        )
                      }
                    >
                      <option value="">Choose</option>
                      <option value="9">9th</option>
                      <option value="10">10th</option>
                      <option value="11">11th</option>
                      <option value="12">12th</option>
                    </select>
                  </label>
                  <label>
                    Semesters
                    <select
                      value={options.semesters}
                      onChange={event => updateUcCourseOption(key, 'semesters', event.target.value === '1' ? 1 : 2)}
                    >
                      <option value={1}>1</option>
                      <option value={2}>2</option>
                    </select>
                  </label>
                </div>
                <div className="sidebar-uc-gpa-checks">
                  <label className="uc-gpa-check">
                    <input
                      type="checkbox"
                      checked={options.aToG}
                      onChange={event => updateUcCourseOption(key, 'aToG', event.target.checked)}
                    />
                    A–G course
                  </label>
                  <label className="uc-gpa-check">
                    <input
                      type="checkbox"
                      checked={options.ucApprovedHonors}
                      disabled={!options.aToG || (options.gradeLevel !== '10' && options.gradeLevel !== '11')}
                      onChange={event => updateUcCourseOption(key, 'ucApprovedHonors', event.target.checked)}
                    />
                    UC-approved honors
                  </label>
                </div>
              </div>
            })}
          </div>
          <p className="sidebar-uc-gpa-disclaimer">Uses the grade from this selected report, not a transcript. UC GPA ignores +/- and caps approved honors at 8 semesters (4 per grade).</p>
        </details>
      </section>
      <div className="side-label">CLASSES</div>
      {courses.map((course, index) => <button key={`${course.code}-${index}`} className={`side-link class-link${coursePortalOpen && selected === index ? ' active' : ''}`} onClick={() => openCourse(index)} aria-pressed={coursePortalOpen && selected === index}><i style={{ background: courseColors[index % courseColors.length] }} /> {course.name}</button>)}
      <div className="side-bottom">
        <button className={`side-link${preferencesOpen ? ' active' : ''}`} onClick={openPreferences} aria-pressed={preferencesOpen}><Settings2 /> Preferences</button>
        <button className="side-link" onClick={onLogout}><LogOut /> Sign out</button>
        <div className="profile">
          <div className="avatar">
            {studentPhoto && !studentPhotoFailed
              ? <img
                  src={studentPhoto}
                  alt={`${displayName} StudentVUE profile`}
                  referrerPolicy="no-referrer"
                  onError={() => setStudentPhotoFailed(true)}
                />
              : <span>{initials}</span>}
          </div>
          <div className="profile-details">
            <strong>{displayName}</strong>
            <span>{schoolName}</span>
            <span>{preferences.showStudentId ? `${profileIdLabel} · ${profileId}` : 'StudentVUE account'}</span>
          </div>
          <ChevronDown aria-hidden="true" />
        </div>
      </div>
    </aside>
    <section className="dashboard-content">
      {planningOpen ? <>
        <header className="dash-header course-portal-header">
          <div>
            <p className="eyebrow">YOUR NEXT BEST STEPS</p>
            <h1>Assignment <em>plan.</em></h1>
          </div>
          <Mark>GRADE IMPACT</Mark>
        </header>
        <p className="planning-intro">Only ungraded assignments are shown. Each estimate assumes a 100% score and shows how much the category average could rise. Upcoming due dates raise priority; overdue and soon-due work is listed first.</p>
        <div className="planning-summary" aria-label="Planning summary">
          <div className="planning-stat"><span>ASSIGNMENTS</span><strong>{planningAssignments.length}</strong></div>
          <div className="planning-stat"><span>HIGH PRIORITY</span><strong>{highPriorityAssignments}</strong></div>
          <div className="planning-stat"><span>COURSES</span><strong>{courses.length}</strong></div>
        </div>
        {planningAssignments.length ? <section className="panel planning-panel" aria-labelledby="planning-list-title">
          <div className="panel-heading">
            <div><span className="eyebrow">RANKED BY DUE DATE & 100% IMPACT</span><h2 id="planning-list-title">What to focus <em>on</em></h2></div>
            <ClipboardList aria-hidden="true" />
          </div>
          <div className="planning-list">
            {planningAssignments.map(item => <article className="planning-item" key={item.key}>
              <span className={`planning-priority priority-${item.priority.toLocaleLowerCase()}`}>{item.priority} priority</span>
              <div className="planning-item-main">
                <h3>{item.assignment.name}</h3>
                <p>{item.courseName} <span aria-hidden="true">·</span> {item.assignment.category}</p>
                <div className="planning-item-details">
                  <span>{item.assignment.points !== null && item.assignment.pointsPossible !== null
                    ? `${item.assignment.points} / ${item.assignment.pointsPossible} points`
                    : item.assignment.score || 'Score not provided'}</span>
                  <span>{item.dueLabel}{item.assignment.dueDate ? ` · ${item.assignment.dueDate}` : ''}</span>
                </div>
              </div>
              <div className="planning-impact">
                <strong>{item.categoryIncrease === null
                  ? item.projectedCategoryAverage === null
                    ? 'Impact unavailable'
                    : `New average ${item.projectedCategoryAverage.toFixed(1)}%`
                  : `${item.categoryIncrease >= 0 ? '+' : ''}${item.categoryIncrease.toFixed(2)} pp`}</strong>
                {item.currentCategoryAverage !== null && item.projectedCategoryAverage !== null
                  ? <span className="planning-simulation-change">100% simulation: {item.currentCategoryAverage.toFixed(1)}% → {item.projectedCategoryAverage.toFixed(1)}%</span>
                  : <span>category average with 100%</span>}
                {item.courseGradeIncrease !== null && <span className="planning-course-impact">
                  Overall grade: {item.currentCourseGrade === null || item.projectedCourseGrade === null
                    ? `${item.courseGradeIncrease >= 0 ? '+' : ''}${item.courseGradeIncrease.toFixed(2)} pp`
                    : `${item.currentCourseGrade.toFixed(1)}% → ${item.projectedCourseGrade.toFixed(1)}%`}
                  {' '}({item.courseGradeIncrease >= 0 ? '+' : ''}{item.courseGradeIncrease.toFixed(2)} pp)
                </span>}
                <button className="planning-course-link" type="button" onClick={() => openCourse(item.courseIndex)}>Open course</button>
              </div>
            </article>)}
          </div>
          <p className="planning-note">“pp” means percentage points. Category changes are calculated from the current category points plus a hypothetical full-credit score. Overall course-grade changes also use the category weight when StudentVUE provides it. Dates without a recognized due date are not used to rank urgency.</p>
        </section> : <div className="panel attendance-empty"><h2>No ungraded assignments to plan</h2><p>StudentVUE did not return any ungraded assignments with a recognized ungraded status for this reporting period.</p></div>}
        {suggestedAssignment && !planningTipDismissed && <aside className="planning-floater" aria-label="Suggested next step">
          <div className="planning-floater-top">
            <span className="planning-floater-label">A SMALL NEXT STEP</span>
            <button type="button" className="planning-floater-close" aria-label="Dismiss suggestion" onClick={() => setPlanningTipDismissed(true)}><X aria-hidden="true" /></button>
          </div>
          <strong>{suggestedPractice}</strong>
          <p>
            {suggestedAssignment.dueLabel}. A 100% could raise the {suggestedAssignment.assignment.category} average
            {suggestedAssignment.categoryIncrease === null
              ? '.'
              : ` by ${suggestedAssignment.categoryIncrease.toFixed(2)} percentage points.`}
          </p>
          <button type="button" className="planning-floater-link" onClick={() => openCourse(suggestedAssignment.courseIndex)}>View {suggestedAssignment.courseName}</button>
        </aside>}
      </> : preferencesOpen ? <>
        <header className="dash-header course-portal-header">
          <div>
            <button className="back-button" onClick={openGradebook}><ArrowLeft /> BACK TO GRADEBOOK</button>
            <p className="eyebrow">PERSONALIZE YOUR DASHBOARD</p>
            <h1>Your <em>preferences.</em></h1>
          </div>
          <Mark>ON THIS DEVICE</Mark>
        </header>
        <section className="panel preferences-panel" aria-labelledby="preferences-title">
          <div className="panel-heading">
            <div><span className="eyebrow">PROFILE & DISPLAY</span><h2 id="preferences-title">Make ZenFlow <em>yours</em></h2></div>
            <Settings2 aria-hidden="true" />
          </div>
          <p>These settings stay in this browser. This demo does not connect to or change a StudentVUE account.</p>
          <div className="preference-profile">
            <div className="avatar preference-avatar">
              {studentPhoto && !studentPhotoFailed
                ? <img
                    src={studentPhoto}
                    alt={`${displayName} StudentVUE profile`}
                    referrerPolicy="no-referrer"
                    onError={() => setStudentPhotoFailed(true)}
                  />
                : <span>{initials}</span>}
            </div>
            <div className="preference-profile-details">
              <strong>{displayName}</strong>
              <span>{schoolName}</span>
              <span>{dashboard.student.id ? `Student ID · ${dashboard.student.id}` : 'Permanent student ID not provided'}</span>
              {(!studentPhoto || studentPhotoFailed) && <small>{studentPhotoFailed ? 'StudentVUE profile picture could not be loaded.' : 'No profile picture provided by StudentVUE.'}</small>}
            </div>
          </div>
          <div className="preferences-list">
            <label className="preference-row">
              <span><strong>Display name</strong><small>Choose how your name appears in the sidebar.</small></span>
              <input
                className="preference-name-input"
                type="text"
                autoComplete="nickname"
                maxLength={48}
                value={preferences.displayName}
                placeholder={dashboard.student.name ?? 'Student'}
                onChange={event => setPreferences(current => ({ ...current, displayName: event.target.value }))}
              />
            </label>
            <label className="preference-row">
              <span><strong>Show StudentVUE ID</strong><small>Display the signed-in ID in your profile.</small></span>
              <input
                className="preference-toggle"
                type="checkbox"
                checked={preferences.showStudentId}
                onChange={event => setPreferences(current => ({ ...current, showStudentId: event.target.checked }))}
              />
            </label>
            <label className="preference-row">
              <span><strong>Compact sidebar</strong><small>Reduce the spacing in your class list.</small></span>
              <input
                className="preference-toggle"
                type="checkbox"
                checked={preferences.compactSidebar}
                onChange={event => setPreferences(current => ({ ...current, compactSidebar: event.target.checked }))}
              />
            </label>
            <label className="preference-row">
              <span><strong>Reduce motion</strong><small>Turn off decorative movement and transitions.</small></span>
              <input
                className="preference-toggle"
                type="checkbox"
                checked={preferences.reduceMotion}
                onChange={event => setPreferences(current => ({ ...current, reduceMotion: event.target.checked }))}
              />
            </label>
            <label className="preference-row">
              <span><strong>Dark mode</strong><small>Use a darker, higher-contrast dashboard theme.</small></span>
              <input
                className="preference-toggle"
                type="checkbox"
                checked={preferences.darkMode}
                onChange={event => setPreferences(current => ({ ...current, darkMode: event.target.checked }))}
              />
            </label>
          </div>
          <div className="preference-account">
            <span className="eyebrow">{profileIdLabel.toLocaleUpperCase()}</span>
            <strong>{profileId}</strong>
            <small>Fictional demo profile. No password is sent or stored.</small>
          </div>
        </section>
      </> : dataPortal ? <>
        <header className="dash-header course-portal-header">
          <div>
            <button className="back-button" onClick={openGradebook}><ArrowLeft /> BACK TO GRADEBOOK</button>
            <p className="eyebrow">STUDENTVUE · {dataPortal === 'feedback' ? 'ASSIGNMENT FEEDBACK' : dataPortal.toLocaleUpperCase()}</p>
            <h1>{dataPortal === 'mail'
              ? <>Your <em>messages.</em></>
              : dataPortal === 'documents'
                ? <>Your <em>documents.</em></>
                : dataPortal === 'schedule'
                  ? <>Class <em>schedule.</em></>
                  : dataPortal === 'calendar'
                    ? <>School <em>calendar.</em></>
                    : <>Teacher <em>feedback.</em></>}</h1>
          </div>
          <Mark>STUDENTVUE</Mark>
        </header>
        {dataPortal === 'feedback'
              ? feedbackItems.length > 0
                ? <div className="panel attendance-panel"><div className="panel-heading"><div><span className="eyebrow">COMMENTS ATTACHED TO STUDENTVUE ASSIGNMENTS · {feedbackItems.length}</span><h2>Teacher <em>feedback</em></h2></div><Gauge /></div><div className="assignment-list">{feedbackItems.map(assignment => <article className="assignment-row" key={assignment.key}><div className="assignment-info"><strong>{assignment.name}</strong><span>{assignment.courseName} · {assignment.category}</span><p>{assignment.feedback}</p></div><div className="assignment-score"><strong>{assignment.score}</strong><span>{assignment.points !== null && assignment.pointsPossible !== null ? `${assignment.points} / ${assignment.pointsPossible} pts` : 'Score'}</span></div></article>)}</div></div>
                : <div className="panel attendance-empty"><h2>No feedback returned</h2><p>StudentVUE did not include teacher comments with the assignments in this report.</p></div>
              : dataPortal === 'schedule'
              ? portalData.schedule.length
                ? <div className="panel attendance-panel"><div className="panel-heading"><div><span className="eyebrow">STUDENTVUE CLASS SCHEDULE · {portalData.schedule.length}</span><h2>Your class <em>schedule</em></h2></div><BookOpen /></div><div className="schedule-semester-tabs" role="group" aria-label="Filter schedule by semester"><button type="button" aria-pressed={scheduleSemester === 'all'} onClick={() => setScheduleSemester('all')}>All terms ({portalData.schedule.length})</button><button type="button" aria-pressed={scheduleSemester === 'first'} onClick={() => setScheduleSemester('first')}>First semester ({firstSemesterCount})</button><button type="button" aria-pressed={scheduleSemester === 'second'} onClick={() => setScheduleSemester('second')}>Second semester ({secondSemesterCount})</button></div>{!firstSemesterCount && !secondSemesterCount && <p className="attendance-source-note">StudentVUE did not label these classes with semester information, so they are shown under All terms.</p>}{scheduleRecords.length ? <div className="assignment-list">{scheduleRecords.map((record, index) => <article className="assignment-row" key={`${record.title}-${record.term ?? ''}-${record.date ?? index}`}><div className="assignment-info"><strong>{record.title}</strong><span>{[record.term, record.detail].filter(Boolean).join(' · ') || 'Schedule details not provided'}</span>{record.teacher && <small className="schedule-teacher">Teacher: {record.teacher}</small>}</div></article>)}</div> : <p className="attendance-source-note">No classes were returned for this semester by StudentVUE.</p>}</div>
                : <div className="panel attendance-empty"><h2>No classes returned</h2><p>StudentVUE did not provide class schedule records for this account.</p></div>
              : dataPortal === 'calendar'
              ? <SchoolCalendar records={portalData.calendar} />
              : dataPortal === 'mail'
              ? portalData.mail.length
                ? <div className="panel attendance-panel"><div className="panel-heading"><div><span className="eyebrow">STUDENTVUE MESSAGES · {portalData.mail.length}</span><h2>Inbox <em>and announcements</em></h2></div><Mail /></div><div className="assignment-list">{portalData.mail.map((message, index) => <article className="assignment-row" key={`${message.subject}-${message.date ?? index}`}><div className="assignment-info"><strong>{message.subject}</strong><span>{[message.sender, message.date].filter(Boolean).join(' · ')}</span>{message.body && <p>{message.body}</p>}</div></article>)}</div></div>
                : <div className="panel attendance-empty"><h2>No messages returned</h2><p>StudentVUE did not provide messages or announcements for this account.</p></div>
              : portalData.documents.length
                ? <div className="panel attendance-panel">
                    <div className="panel-heading">
                      <div><span className="eyebrow">AVAILABLE FILES · {portalData.documents.length}</span><h2>Reports <em>and documents</em></h2></div>
                      <FileText />
                    </div>
                    <p className="attendance-source-note">These fictional sample files are generated locally by the demo.</p>
                    <div className="assignment-list">{portalData.documents.map((document, index) => <article className="assignment-row" key={`${document.name}-${document.date ?? index}`}>
                      <div className="assignment-info">
                        <strong>{document.name}</strong>
                        <span>{[document.type, document.date].filter(Boolean).join(' · ') || 'Document'}</span>
                      </div>
                      {document.id && <button className="document-open-button" type="button" disabled={Boolean(documentDownloadId)} onClick={() => downloadStudentDocument(document)}>{documentDownloadId === document.id ? 'Preparing…' : 'Download sample'}</button>}
                    </article>)}</div>
                  </div>
                : <div className="panel attendance-empty"><h2>No sample documents</h2><p>This demo has no documents to show.</p></div>}
      </> : attendancePortalOpen ? <>
        <header className="dash-header course-portal-header">
          <div>
            <button className="back-button" onClick={openGradebook}><ArrowLeft /> BACK TO GRADEBOOK</button>
            <p className="eyebrow">{period.name} <span className="live-dot" /></p>
            <h1>Your <em>attendance.</em></h1>
          </div>
          <Mark>STUDENTVUE</Mark>
        </header>
        {attendanceData.records.length
            ? <AttendanceCalendar records={attendanceData.records} />
            : <div className="panel attendance-empty"><h2>No sample attendance</h2><p>This demo has no attendance records to show.</p></div>}
      </> : coursePortalOpen && period.error ? <>
        <header className="dash-header course-portal-header">
          <div>
            <button className="back-button" onClick={() => setCoursePortalOpen(false)}><ArrowLeft /> BACK TO GRADEBOOK</button>
            <p className="eyebrow">{period.name}</p>
            <h1>Report <em>unavailable.</em></h1>
          </div>
          <Mark>STUDENTVUE</Mark>
        </header>
        <div className="panel attendance-empty" role="status"><h2>Could not load this report</h2><p>{period.error}</p></div>
      </> : coursePortalOpen ? <>
        <header className="dash-header course-portal-header">
          <div>
            <button className="back-button" onClick={() => setCoursePortalOpen(false)}><ArrowLeft /> BACK TO GRADEBOOK</button>
            <p className="eyebrow">{period.name} <span className="live-dot" /></p>
            <h1>{active.name} <em>course portal.</em></h1>
          </div>
          <Mark>STUDENTVUE</Mark>
        </header>
        <div className="course-detail-grid">
          <div className="hero-score course-detail-grade">
            <div><span className="eyebrow">{hypotheticalMode ? 'HYPOTHETICAL COURSE GRADE' : 'OFFICIAL COURSE GRADE'}</span><h2>{hypotheticalMode && hypotheticalGrade !== null ? `${hypotheticalGrade.toFixed(1)}%` : active.grade}</h2><p>{hypotheticalMode ? 'Estimated from your hypothetical assignment changes. Turn off Hypothetical mode to return to the official grade.' : `Your grade for this course in ${period.name}.`}</p><div className="stats-line"><div><strong>{(hypotheticalMode ? hypotheticalGrade : active.score) === null ? '—' : `${(hypotheticalMode ? hypotheticalGrade : active.score)?.toFixed(1)}%`}</strong><span>{hypotheticalMode ? 'ESTIMATED SCORE' : 'NUMERIC SCORE'}</span></div><div><strong>{active.assignments.length}</strong><span>ASSIGNMENTS</span></div><div><strong>{active.teacher ?? 'Not listed'}</strong><span>TEACHER</span></div></div></div>
            {(hypotheticalMode ? hypotheticalGrade : active.score) !== null && <GradeOrb score={hypotheticalMode ? hypotheticalGrade : active.score} />}
            <CourseArtwork courseName={active.name} />
          </div>
          <div className="panel target">
            <div className="panel-heading"><div><span className="eyebrow">CATEGORY BREAKDOWN</span><h2>{active.name}</h2></div><BookOpen /></div>
            {(() => {
              const displayedCategories = hypotheticalMode ? projectedCategories : active.categories
              const earned = displayedCategories.reduce((total, category) => total + category.points, 0)
              const possible = displayedCategories.reduce((total, category) => total + category.pointsPossible, 0)
              return <div className="total-points-summary">
                <span>{hypotheticalMode ? 'HYPOTHETICAL POINTS' : 'TOTAL POINTS'}</span>
                <strong>{earned} / {possible}</strong>
                <b>{possible > 0 ? `${((earned / possible) * 100).toFixed(1)}%` : '—'}</b>
              </div>
            })()}
            {active.categories.length
              ? <div className="category-list">{active.categories.map(category => {
                  const displayedCategory = hypotheticalMode
                    ? projectedCategories.find(
                        item => categoryKey(item.name) === categoryKey(category.name)
                      ) ?? category
                    : category
                  const categoryAssignments = active.assignments.filter(
                    assignment =>
                      categoryKey(assignment.category) === categoryKey(category.name)
                  )
                  return <div className="category-row" key={category.name}>
                    <div className="category-label"><span>{category.name}</span><strong>{displayedCategory.percent === null ? '—' : `${displayedCategory.percent.toFixed(1)}%`}</strong></div>
                    <div className="mini-bar"><i style={{ width: `${Math.max(0, Math.min(displayedCategory.percent ?? 0, 100))}%` }} /></div>
                    <small>{displayedCategory.points} / {displayedCategory.pointsPossible} points · {category.weight === null ? 'weight unavailable' : `${category.weight}% weight`}</small>
                    {categoryAssignments.length > 0 && <div className="category-assignment-list">
                      <span className="category-assignment-heading">ASSIGNMENT EFFECT ON CATEGORY AVERAGE</span>
                      {categoryAssignments.map((assignment, assignmentIndex) => <div className="category-assignment" key={`${assignment.name}-${assignmentIndex}`}>
                        <span>{assignment.name}</span>
                        <strong>{assignment.dropped ? 'Dropped · excluded' : assignment.points !== null && assignment.pointsPossible !== null ? `${assignment.points} / ${assignment.pointsPossible} pts` : assignment.score}</strong>
                        <small>{assignment.dropped ? 'Not included in points total' : formatCategoryImpact(assignment.categoryGradeImpact)}</small>
                      </div>)}
                    </div>}
                  </div>
                })}</div>
              : <p>StudentVUE did not provide category totals or assignment categories for this course.</p>}
            {listedFinal && <section className="final-discrepancy" aria-label="Listed final grade comparison">
              <span className="eyebrow">FINAL FOUND IN STUDENTVUE</span>
              <strong>{listedFinal.name}</strong>
              <p>
                {listedFinal.points !== null && listedFinal.pointsPossible !== null
                  ? `Listed final score: ${listedFinal.points} / ${listedFinal.pointsPossible} points.`
                  : 'StudentVUE lists a final assignment, but its points are unavailable.'}
                {pointsEstimateComparison
                  ? pointsEstimateComparison.discrepant
                    ? ` The all-assignment points estimate differs from the official course score by ${Math.abs(pointsEstimateComparison.difference).toFixed(1)} percentage points; categories, weighting, or grade rules may explain the difference.`
                    : ` The all-assignment points estimate is within 1 percentage point of the official course score.`
                  : ' A points-based comparison is unavailable for this course.'}
              </p>
            </section>}
            <p className="category-impact-note">Assignment effects compare the points-based category average from graded assignments with and without each score. They are percentage-point changes, not changes to the overall course grade.</p>
          </div>
        </div>
        <QuarterProgress
          period={period}
          reportingPeriods={dashboard.reportingPeriods}
          onSelect={id => {
            setSelectedPeriodId(id)
            setSelected(0)
            resetHypotheticalChanges()
          }}
        />
        <div className="panel course-assignments">
          <div className="panel-heading"><div><span className="eyebrow">ASSIGNMENTS · {active.assignments.length}</span><h2>Course <em>work</em></h2></div><Target /></div>
          <div className="hypothetical-toolbar">
            <label className="hypothetical-toggle">
              <input
                type="checkbox"
                checked={hypotheticalMode}
                onChange={event => setHypotheticalMode(event.target.checked)}
              />
              Hypothetical mode
            </label>
            <button
              className="hypothetical-reset"
              type="button"
              onClick={resetHypotheticalChanges}
              disabled={!Object.keys(assignmentOverrides).length && !hypotheticalAssignments.length}
            >
              Reset changes
            </button>
          </div>
          {hypotheticalMode && <>
            <section className="final-calculator" aria-labelledby="final-calculator-title">
              <div>
                <span className="eyebrow">FINAL EXAM WHAT-IF</span>
                <h3 id="final-calculator-title">Explore a final score</h3>
                <p>Enter the final’s share of the course grade and a possible score. No final weight is assumed.</p>
              </div>
              <div className="final-calculator-fields">
                <label>
                  Final weight (%)
                  <input type="number" min="0.01" max="100" step="any" value={finalWeight} onChange={event => setFinalWeight(event.target.value)} placeholder="e.g. 20" />
                </label>
                <label>
                  Final score (%)
                  <input type="number" min="0" max="100" step="any" value={finalScore} onChange={event => setFinalScore(event.target.value)} placeholder="e.g. 85" />
                </label>
                <label>
                  Target grade (%)
                  <input type="number" min="0" max="100" step="any" value={targetGrade} onChange={event => setTargetGrade(event.target.value)} placeholder="e.g. 90" />
                </label>
              </div>
              {finalProjection
                ? <p className="final-calculator-result" role="status">
                    Projected course grade: <strong>{finalProjection.projectedGrade.toFixed(1)}%</strong>
                    {finalProjection.targetScore !== null && (
                      finalProjection.targetScore > 100
                        ? <span>A {targetGradeValue}% target would require {finalProjection.targetScore.toFixed(1)}% on the final.</span>
                        : finalProjection.targetScore < 0
                          ? <span>The current grade already exceeds that target, even with a 0% final.</span>
                          : <span>Score needed for {targetGradeValue}%: {finalProjection.targetScore.toFixed(1)}%.</span>
                    )}
                  </p>
                : finalWeight.trim() || finalScore.trim() || targetGrade.trim()
                  ? <p className="final-calculator-result" role="status">Enter a final weight above 0 and at most 100%, plus a final score from 0% to 100%. Targets must also be 0%–100%.</p>
                  : null}
            </section>
            <div className="assignment-category-tabs" role="group" aria-label="Filter assignments by category">
              {['All', ...assignmentCategories].map((category, index) => (
                <button
                  type="button"
                  key={category}
                  aria-pressed={assignmentCategoryFilter === category}
                  onClick={() => setAssignmentCategoryFilter(category)}
                >
                  {index > 0 && <i className={`category-dot category-dot-${(index - 1) % 5}`} aria-hidden="true" />}
                  {category}
                </button>
              ))}
            </div>
            <form
              className="hypothetical-add-row"
              onSubmit={event => {
                event.preventDefault()
                addHypotheticalAssignment()
              }}
            >
              <label className="visually-hidden" htmlFor="new-hypothetical-score">Hypothetical assignment score</label>
              <input
                id="new-hypothetical-score"
                aria-label="Hypothetical assignment score"
                type="number"
                min="0"
                step="any"
                placeholder="Score"
                value={newAssignmentPoints}
                onChange={event => {
                  setNewAssignmentPoints(event.target.value)
                  setNewAssignmentError('')
                }}
              />
              <span aria-hidden="true">/</span>
              <label className="visually-hidden" htmlFor="new-hypothetical-possible">Hypothetical assignment points possible</label>
              <input
                id="new-hypothetical-possible"
                aria-label="Hypothetical assignment points possible"
                type="number"
                min="0.01"
                step="any"
                placeholder="Out of"
                value={newAssignmentPossible}
                onChange={event => {
                  setNewAssignmentPossible(event.target.value)
                  setNewAssignmentError('')
                }}
              />
              <button type="submit" disabled={!active.categories.length}>Add</button>
            </form>
            {newAssignmentError && <p className="form-error hypothetical-error" role="alert">{newAssignmentError}</p>}
          </>}
          {active.assignments.length || hypotheticalAssignments.length
            ? <div className="assignment-list">
              {active.assignments.map((assignment, index) => {
                if (
                  hypotheticalMode &&
                  assignmentCategoryFilter !== 'All' &&
                  categoryKey(assignment.category) !== categoryKey(assignmentCategoryFilter)
                ) {
                  return null
                }
                const override = assignmentOverrides[index]
                const editedPoints = override
                  ? Number(override.points)
                  : assignment.points
                const editedPossible = override
                  ? Number(override.pointsPossible)
                  : assignment.pointsPossible
                const validOverride =
                  (!override ||
                    (override.points.trim() !== '' &&
                      override.pointsPossible.trim() !== '')) &&
                  editedPoints !== null &&
                  editedPossible !== null &&
                  Number.isFinite(editedPoints) &&
                  Number.isFinite(editedPossible) &&
                  editedPoints >= 0 &&
                  editedPossible > 0
                const originalAverage = assignmentCategoryAverage(assignment.category)
                const projectedAverage = validOverride
                  ? assignmentCategoryAverage(
                      assignment.category,
                      editedPoints - (assignment.points ?? 0),
                      editedPossible - (assignment.pointsPossible ?? 0),
                    )
                  : null
                const delta = originalAverage !== null && projectedAverage !== null
                  ? projectedAverage - originalAverage
                  : null
                const scorePercent = hypotheticalMode && validOverride
                  ? (editedPoints / editedPossible) * 100
                  : getAssignmentPercent(
                      assignment.points,
                      assignment.pointsPossible,
                      assignment.score,
                    )
                const meterPercent = scorePercent === null
                  ? null
                  : Math.max(0, Math.min(scorePercent, 100))
                return <article className="assignment-row" key={`${assignment.name}-${index}`}>
                  <div className="assignment-info">
                    <strong>{assignment.name}</strong>
                    <span>{assignment.category}{assignment.dropped ? ' · Dropped' : ''}</span>
                    {assignment.date && <small>{assignment.date}</small>}
                  </div>
                  <div className="assignment-score">
                    {hypotheticalMode && !assignment.dropped
                      ? <>
                        <div className="assignment-what-if-fields">
                          <div className="assignment-score-labels">
                            {scorePercent !== null && <strong className="assignment-percent">{scorePercent.toFixed(0)}%</strong>}
                            {delta !== null && <strong className={`assignment-impact${delta > 0 ? ' positive' : delta < 0 ? ' negative' : ''}`}>
                              {delta > 0 ? '+' : ''}{delta.toFixed(2)} pp
                            </strong>}
                          </div>
                          <label>
                            <span className="visually-hidden">{assignment.name} hypothetical score</span>
                            <input
                              type="number"
                              min="0"
                              step="any"
                              aria-label={`${assignment.name} hypothetical score`}
                              placeholder="Score"
                              value={override?.points ?? (assignment.points === null ? '' : String(assignment.points))}
                              onChange={event => changeAssignmentOverride(index, 'points', event.target.value, assignment)}
                            />
                          </label>
                          <span aria-hidden="true">/</span>
                          <label>
                            <span className="visually-hidden">{assignment.name} points possible</span>
                            <input
                              type="number"
                              min="0.01"
                              step="any"
                              aria-label={`${assignment.name} points possible`}
                              placeholder="Out of"
                              value={override?.pointsPossible ?? (assignment.pointsPossible === null ? '' : String(assignment.pointsPossible))}
                              onChange={event => changeAssignmentOverride(index, 'pointsPossible', event.target.value, assignment)}
                            />
                          </label>
                        </div>
                        {meterPercent !== null && <div className="assignment-progress" role="meter" aria-label={`${assignment.name} hypothetical score`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={meterPercent}>
                          <i
                            className={delta !== null && delta < 0 ? 'negative' : 'positive'}
                            style={{ width: `${meterPercent}%` }}
                          />
                        </div>}
                      </>
                      : <>
                          <strong>{assignment.dropped ? 'Dropped' : assignment.score}</strong>
                          <span>{assignment.points !== null && assignment.pointsPossible !== null ? `${assignment.points} / ${assignment.pointsPossible} pts` : 'Points unavailable'}</span>
                          {meterPercent !== null && !assignment.dropped && <div className="assignment-progress" role="meter" aria-label={`${assignment.name} score`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={meterPercent}>
                            <i style={{ width: `${meterPercent}%` }} />
                          </div>}
                        </>}
                  </div>
                </article>
              })}
              {(hypotheticalMode ? hypotheticalAssignments : [])
                .filter(assignment =>
                  assignmentCategoryFilter === 'All' ||
                  categoryKey(assignment.category) === categoryKey(assignmentCategoryFilter)
                )
                .map(assignment => {
                  const originalAverage = assignmentCategoryAverage(assignment.category)
                  const projectedAverage = assignmentCategoryAverage(
                    assignment.category,
                    assignment.points,
                    assignment.pointsPossible,
                  )
                  const delta = originalAverage !== null && projectedAverage !== null
                    ? projectedAverage - originalAverage
                    : null
                  const scorePercent =
                    (assignment.points / assignment.pointsPossible) * 100
                  const meterPercent = Math.max(0, Math.min(scorePercent, 100))
                  return <article className="assignment-row hypothetical-assignment-row" key={`hypothetical-${assignment.id}`}>
                    <div className="assignment-info">
                      <strong>Hypothetical assignment</strong>
                      <span>{assignment.category} · Local only</span>
                    </div>
                    <div className="assignment-score">
                      <div className="assignment-score-labels">
                        <strong className="assignment-percent">{scorePercent.toFixed(0)}%</strong>
                        {delta !== null && <strong className={`assignment-impact${delta > 0 ? ' positive' : delta < 0 ? ' negative' : ''}`}>
                          {delta > 0 ? '+' : ''}{delta.toFixed(2)} pp
                        </strong>}
                      </div>
                      <span>{assignment.points} / {assignment.pointsPossible} pts</span>
                      <div className="assignment-progress" role="meter" aria-label="Hypothetical assignment score" aria-valuemin={0} aria-valuemax={100} aria-valuenow={meterPercent}>
                        <i
                          className={delta !== null && delta < 0 ? 'negative' : 'positive'}
                          style={{ width: `${meterPercent}%` }}
                        />
                      </div>
                    </div>
                  </article>
                })}
              {hypotheticalMode && !active.assignments.some(assignment =>
                assignmentCategoryFilter === 'All' ||
                categoryKey(assignment.category) === categoryKey(assignmentCategoryFilter)
              ) && !hypotheticalAssignments.some(assignment =>
                assignmentCategoryFilter === 'All' ||
                categoryKey(assignment.category) === categoryKey(assignmentCategoryFilter)
              ) && <p className="attendance-source-note">No assignments were returned for this category.</p>}
            </div>
            : <p>No assignments were returned for this course.</p>}
          {hypotheticalMode && <p className="category-impact-note">Changes are local estimates based on category points; they do not alter or submit grades to StudentVUE.</p>}
        </div>
      </> : <>
        <header className="dash-header"><button className="mobile-menu" aria-label="Open menu"><Menu /></button><div><p className="eyebrow">{today} <span className="live-dot" /></p><h1>Your gradebook, <em>in focus.</em></h1></div><div className="header-actions"><button className="icon-btn" aria-label="Help"><CircleHelp /></button></div></header>
        <div className="overview-grid">
          <div className="hero-score"><div><span className="eyebrow">SAMPLE GRADEBOOK <Mark>DEMO</Mark></span><h2>{period.name}</h2><p>Fictional grades for exploring the ZenFlow dashboard.</p><div className="stats-line"><div><strong>{courses.length}</strong><span>COURSES</span></div><div><strong>{scores.length ? `${average.toFixed(1)}%` : '—'}</strong><span>AVERAGE</span></div><div><strong>{scores.length}</strong><span>GRADED</span></div></div></div><GradeOrb score={scores.length ? average : null} /></div>
          <div className="streak-card"><div className="card-kicker">GRADEBOOK <span>FROM STUDENTVUE</span></div><div className="streak-num">{courses.length}<span> courses</span></div><p>Course grades reflect the current reporting period selected by StudentVUE.</p><Mark tone="blue">SECURE SESSION</Mark></div>
        </div>
        <section className="panel gpa-card" aria-labelledby="student-gpa-title">
          <div>
            <span className="eyebrow">ESTIMATED FROM LISTED COURSE GRADES</span>
            <h2 id="student-gpa-title">Your <em>GPA</em></h2>
            <p>Unweighted 4.0 scale with +/- grades; each course counts equally.</p>
          </div>
          <div className="gpa-values">
            <div>
              <strong>{courseGpa.gpa === null ? '—' : courseGpa.gpa.toFixed(2)}</strong>
              <span>ESTIMATED GPA · {courseGpa.includedCourses}/{courseGpa.totalCourses} CLASSES</span>
            </div>
            {dashboard.gpa.cumulative !== null && <div className="official-gpa">
              <strong>{dashboard.gpa.cumulative.toFixed(2)}</strong>
              <span>OFFICIAL CUMULATIVE GPA</span>
            </div>}
          </div>
          <p className="gpa-disclaimer">This is an estimate for the selected reporting period, not an official or cumulative StudentVUE GPA.</p>
        </section>
        <QuarterProgress
          period={period}
          reportingPeriods={dashboard.reportingPeriods}
          onSelect={id => {
            setSelectedPeriodId(id)
            setSelected(0)
            setCoursePortalOpen(false)
            resetHypotheticalChanges()
          }}
        />
        {period.error
          ? <div className="panel attendance-empty" role="status"><h2>Report unavailable</h2><p>{period.error}</p></div>
          : <>
              <div className="section-heading"><div><span className="eyebrow">THE BIG PICTURE</span><h2>Course <em>pulse</em></h2></div><span className="muted">{period.name.toLocaleUpperCase()} / {String(courses.length).padStart(2, '0')} COURSES</span></div>
              <div className="course-grid">{courses.map((course, index) => <CourseCard key={`${course.code}-${index}`} course={course} color={courseColors[index % courseColors.length]} selected={selected === index} onSelect={() => openCourse(index)} />)}</div>
            </>}
      </>}
      <footer className="dash-footer"><span>ZENFLOW / ACADEMIC OS</span><span>FRONTEND DEMO · FICTIONAL DATA</span></footer>
    </section>
  </main>
}

export default function Page() {
  const [view, setView] = useState<'login' | 'dashboard'>('login')
  const [dashboard, setDashboard] = useState<StudentVueDashboard | null>(null)
  function handleLogin(result: StudentVueDashboard) {
    setDashboard(result)
    setView('dashboard')
  }

  if (view === 'dashboard' && dashboard) {
    return <Dashboard dashboard={dashboard} onLogout={() => {
      setDashboard(null)
      setView('login')
    }} />
  }
  return <Login onLogin={handleLogin} />
}
