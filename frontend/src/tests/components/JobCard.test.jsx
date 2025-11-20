import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { renderWithProviders, mockJob } from '../helpers/testHelpers';

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Link: ({ to, children, ...props }) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

import JobCard from '../../components/JobCard';

describe('JobCard Component', () => {
  it('should render job card with job information', () => {
    renderWithProviders(<JobCard job={mockJob} />);

    expect(screen.getByText(mockJob.title)).toBeInTheDocument();
    expect(screen.getByText(mockJob.company)).toBeInTheDocument();
    expect(screen.getByText(mockJob.location)).toBeInTheDocument();
  });

  it('should render compact version when compact prop is true', () => {
    renderWithProviders(<JobCard job={mockJob} compact={true} />);

    expect(screen.getByText(mockJob.title)).toBeInTheDocument();
    expect(screen.getByText(mockJob.company)).toBeInTheDocument();
  });

  it('should display job type badge', () => {
    renderWithProviders(<JobCard job={mockJob} />);

    expect(screen.getByText(mockJob.type)).toBeInTheDocument();
  });

  it('should display salary if available', () => {
    renderWithProviders(<JobCard job={mockJob} />);

    if (mockJob.salary) {
      expect(screen.getByText(mockJob.salary)).toBeInTheDocument();
    }
  });

  it('should have a link to job details', () => {
    renderWithProviders(<JobCard job={mockJob} />);

    const link = screen.getByRole('link', { name: /view/i });
    expect(link).toHaveAttribute('href', `/jobs/${mockJob._id}`);
  });

  it('should truncate long descriptions', () => {
    const longDescriptionJob = {
      ...mockJob,
      description: 'A'.repeat(200),
    };

    renderWithProviders(<JobCard job={longDescriptionJob} />);

    const description = screen.getByText(/A+/);
    expect(description.textContent.length).toBeLessThanOrEqual(150);
  });
});



