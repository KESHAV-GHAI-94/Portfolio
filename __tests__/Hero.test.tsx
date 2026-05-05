import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import Hero from '../src/frontend/components/public/Hero';

describe('Hero Component', () => {
  it('renders the hero section correctly', () => {
    render(<Hero />);
    
    // Check if the title is present
    const heading = screen.getByText(/Keshav Ghai/i);
    expect(heading).toBeInTheDocument();

    // Check if the role is present
    const role = screen.getByText(/Senior Full-Stack Engineer/i);
    expect(role).toBeInTheDocument();
  });
});
