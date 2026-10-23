import { academyAdditionalFees } from '../data/content.js'

export const feesForCourse = (course) => academyAdditionalFees.filter(
  (fee) => !fee.courseSlugs || fee.courseSlugs.includes(course.slug)
)

export const feeTotalForCourse = (course) => feesForCourse(course).reduce(
  (total, fee) => total + fee.amount, 0
)

export const totalForCourse = (course) => Number(course.course_fee || 0) + feeTotalForCourse(course)
