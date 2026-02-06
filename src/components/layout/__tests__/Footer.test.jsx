import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Footer from '../Footer';

describe('Footer', () => {
  it('renders organization name', () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain('\u0905\u0928\u0941\u092a\u094d\u0930\u093f\u0924\u093e');
  });

  it('does not contain AI text', () => {
    const { container } = render(<Footer />);
    expect(container.textContent).not.toContain('AI');
  });

  it('shows current year', () => {
    const { container } = render(<Footer />);
    expect(container.textContent).toContain(String(new Date().getFullYear()));
  });
});
