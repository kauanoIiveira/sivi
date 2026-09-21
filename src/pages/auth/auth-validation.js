export function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function evaluatePassword(password) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-ZÀ-Ý]/.test(password),
    lowercase: /[a-zà-ÿ]/.test(password),
    number: /\d/.test(password),
  };

  return { checks, score: Object.values(checks).filter(Boolean).length };
}

