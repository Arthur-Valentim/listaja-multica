import { render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App localStorage initialization', () => {
  afterEach(() => {
    localStorage.clear()
    vi.restoreAllMocks()
  })

  it('shows an empty list and logs an error for invalid JSON', () => {
    localStorage.setItem('listaja.tasks', '{invalid json')
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    render(<App />)

    expect(screen.getByText('Nenhuma tarefa adicionada.')).toBeTruthy()
    expect(consoleError).toHaveBeenCalled()
  })
})
