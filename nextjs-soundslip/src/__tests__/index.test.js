import { render, screen } from '@testing-library/react'
import Home from '../pages/index'
import '@testing-library/jest-dom'

describe('Home', () => {
  it('renders a heading', () => {
    render(<Home />)

    const heading = screen.getByTestId('create-next-app', {
      name: /welcome to next\.js!/i,
      hidden: true,
    })

    expect(heading).toBeInTheDocument()
  })
})