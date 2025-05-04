export const VALIDATION_CONTENT = {
  REQUIRED: (key: string) => `Please enter ${key}`,
  SELECT: (key: string) => `Please select ${key}`,
  POSITIVE: (key: string) => `${key} must be positive`,
  INTEGER: (key: string) => `${key} must be integer`,
  EMAIL_FORMAT: 'Email format is not correct',
  NOT_MATCH_PASSWORD: 'Confirm password not match with new password',
  OTP_AT_LEAST: 'OTP Code is required 6 digits',
  OTP_LENGTH: 'OTP code must not exceed 6 digits',
  OTP_ONLY_NUMBER: 'OTP must contain only numbers',
  CITIZEN_NUMBER_LENGTH: 'Citizen number must have 12 digits',
  OTP_EXPIRED: 'Your verification time has expired. Please try again.'
}
