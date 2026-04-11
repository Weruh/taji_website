export const formatKES = (value) =>
  new Intl.NumberFormat('en-KE', {
    maximumFractionDigits: 0,
  }).format(Number(value || 0))
