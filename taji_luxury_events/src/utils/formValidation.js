import { kenyanPhonePattern } from './phoneValidation.js'

export const localToday = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

export const validateField = (field) => {
  if (!field.matches('input, select, textarea')) return
  const value = field.value.trim()
  const name = field.name || field.id
  field.setCustomValidity('')
  if (!value) {
    if (field.required) field.setCustomValidity('Please complete this field.')
    return
  }
  if (name === 'phone') {
    if (!new RegExp(`^${kenyanPhonePattern}$`).test(value)) field.setCustomValidity('Enter a valid mobile number')
  } else if (name === 'name') {
    if (value.length < 2 || value.length > 100 || !/^[\p{L}\p{M}][\p{L}\p{M} ’'\-.]*[\p{L}\p{M}.]$/u.test(value) || (value.match(/\p{L}/gu) || []).length < 2) {
      field.setCustomValidity('Enter a valid name')
    }
  } else if (field.type === 'email') {
    if (value.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) field.setCustomValidity('Enter a valid email address.')
  } else if (field.type === 'date') {
    field.min = localToday()
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || value < field.min) field.setCustomValidity('Choose today or a future date.')
  } else if (name === 'guests') {
    if (!/^\d+$/.test(value) || !Number.isSafeInteger(Number(value)) || Number(value) < 1) field.setCustomValidity('Enter a whole number of guests, at least 1.')
  } else if (field.tagName === 'SELECT') {
    if (![...field.options].some(option => !option.disabled && option.value === value)) field.setCustomValidity('Choose an option from the list.')
  } else if (value.length < 2 || value.length > (name === 'message' ? 2000 : 200) || !/\p{L}/u.test(value)) {
    field.setCustomValidity(`Enter 2–${name === 'message' ? 2000 : 200} characters, including a letter.`)
  }
}

export const validateForm = (form) => {
  for (const field of form.querySelectorAll('input, select, textarea')) {
    if (['radio', 'checkbox', 'hidden', 'submit'].includes(field.type)) continue
    field.value = field.value.trim()
    validateField(field)
  }
  return form.reportValidity()
}

export const validateFormInput = (event) => validateField(event.target)
