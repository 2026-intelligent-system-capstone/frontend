import type { StudentExam, StudentExamPayload } from '../model/types';

export const toStudentExam = (payload: StudentExamPayload): StudentExam => payload;

export const toStudentExams = (payloads: StudentExamPayload[]): StudentExam[] => payloads.map(toStudentExam);
