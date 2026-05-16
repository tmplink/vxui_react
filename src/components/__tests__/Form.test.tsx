import { render, screen } from '@testing-library/react';
import {
  Form,
  FormField,
  FormLabel,
  FormDescription,
  FormMessage,
  useFormField,
} from '../Form';
import { createContext, useContext } from 'react';

describe('Form', () => {
  it('renders children', () => {
    render(
      <Form>
        <input />
      </Form>,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('forwards className', () => {
    const { container } = render(<Form className="extra"><input /></Form>);
    expect(container.querySelector('form')).toHaveClass('vx-form', 'extra');
  });
});

describe('FormField', () => {
  it('renders children inside a context provider', () => {
    render(
      <FormField name="email">
        <input />
      </FormField>,
    );
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});

describe('FormLabel', () => {
  it('renders label text', () => {
    render(
      <FormField name="email">
        <FormLabel>Email</FormLabel>
      </FormField>,
    );
    expect(screen.getByText('Email')).toBeInTheDocument();
  });

  it('renders required indicator when required=true', () => {
    const { container } = render(
      <FormField name="email">
        <FormLabel required>Email</FormLabel>
      </FormField>,
    );
    expect(container.querySelector('.vx-form-label__required')).toBeInTheDocument();
  });
});

describe('FormDescription', () => {
  it('renders description text', () => {
    render(
      <FormField name="email">
        <FormDescription>Enter your email address</FormDescription>
      </FormField>,
    );
    expect(screen.getByText('Enter your email address')).toBeInTheDocument();
  });
});

describe('FormMessage', () => {
  it('renders children when no context error', () => {
    render(
      <FormField name="email">
        <FormMessage>Custom message</FormMessage>
      </FormField>,
    );
    expect(screen.getByText('Custom message')).toBeInTheDocument();
  });
});

describe('useFormField', () => {
  it('returns context value when used inside FormField', () => {
    function Reader() {
      const ctx = useFormField();
      return <span>{ctx ? 'ok' : 'empty'}</span>;
    }
    render(
      <FormField name="email">
        <Reader />
      </FormField>,
    );
    expect(screen.getByText('ok')).toBeInTheDocument();
  });
});
