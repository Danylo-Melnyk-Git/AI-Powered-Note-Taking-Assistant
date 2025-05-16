import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import AppLayout from './AppLayout';

expect.extend(toHaveNoViolations);

describe('AppLayout accessibility', () => {
  it('should have no accessibility violations', async () => {
    const { container } = render(<AppLayout />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
