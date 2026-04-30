import { Navigate } from '@tanstack/react-router'

export function RedirectToHome() {
  return <Navigate to="/" replace />
}
