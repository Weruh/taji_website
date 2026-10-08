export const kenyanPhonePattern = '(?:0[17][0-9]{8}|254[17][0-9]{8})'

export const kenyanPhoneInputProps = {
  type: 'tel',
  inputMode: 'numeric',
  pattern: kenyanPhonePattern,
  maxLength: 12,
  placeholder: '0712345678',
  required: true,
  title: 'Enter a Kenyan mobile number: 0712345678, 0112345678, or 254712345678.',
  onInput: (event) => {
    const field = event.currentTarget
    field.value = field.value.replace(/\D/g, '')
    field.setCustomValidity(field.value && !new RegExp(`^${kenyanPhonePattern}$`).test(field.value)
      ? 'Enter a valid mobile number, for example 0712345678 or 254712345678.'
      : '')
  },
}
