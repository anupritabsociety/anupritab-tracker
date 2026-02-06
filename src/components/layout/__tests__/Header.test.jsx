import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Header from '../Header';

describe('Header', () => {
  it('renders organization name', () => {
    const { container } = render(<Header />);
    expect(container.textContent).toContain('\u0905\u0928\u0941\u092a\u094d\u0930\u093f\u0924\u093e');
  });

  it('renders subtitle', () => {
    const { container } = render(<Header />);
    expect(container.textContent).toContain('\u0938\u094b\u0938\u093e\u092f\u091f\u0940');
  });

  it('has building icon SVG', () => {
    const { container } = render(<Header />);
    const svg = container.querySelector('svg');
    expect(svg).toBeTruthy();
  });

  it('has shadow-md class', () => {
    const { container } = render(<Header />);
    expect(container.firstChild.className).toContain('shadow-md');
  });
});
