import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AuthPage from '@/pages/auth/AuthPage';
import { AppAuthProvider } from '@/lib/app-auth';

it('renders the complete registration form and login link', () => {
  render(
    <MemoryRouter>
      <AppAuthProvider>
        <AuthPage mode="register" />
      </AppAuthProvider>
    </MemoryRouter>,
  );

  expect(screen.getByRole('heading', { name: 'Begin with intention' })).toBeInTheDocument();
  expect(screen.getByPlaceholderText('Full name')).toBeRequired();
  expect(screen.getByPlaceholderText('Email address')).toHaveAttribute('type', 'email');
  expect(screen.getByRole('button', { name: 'Create account' })).toBeEnabled();
  expect(screen.getByRole('link', { name: 'Log in' })).toHaveAttribute('href', '/login');
});
