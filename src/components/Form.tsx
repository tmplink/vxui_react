import type { FormHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { createContext, useContext } from 'react';
import { cx } from '../lib/cx';

interface FormFieldContextValue {
  error?: string;
}

const FormFieldContext = createContext<FormFieldContextValue>({});

export function useFormField() {
  return useContext(FormFieldContext);
}

export interface FormProps extends FormHTMLAttributes<HTMLFormElement> {}

export function Form({ className, ...props }: FormProps) {
  return <form noValidate className={cx('vx-form', className)} {...props} />;
}

export interface FormFieldProps {
  error?: string;
  children: ReactNode;
  className?: string;
}

export function FormField({ error, children, className }: FormFieldProps) {
  return (
    <FormFieldContext.Provider value={{ error }}>
      <div className={cx('vx-form-field', error && 'vx-form-field--invalid', className)}>
        {children}
      </div>
    </FormFieldContext.Provider>
  );
}

export interface FormLabelProps extends HTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  children: ReactNode;
}

export function FormLabel({ className, required, children, ...props }: FormLabelProps) {
  return (
    <label className={cx('vx-form-label', className)} {...props}>
      {children}
      {required ? <span className="vx-form-label__required" aria-hidden="true"> *</span> : null}
    </label>
  );
}

export interface FormDescriptionProps extends HTMLAttributes<HTMLParagraphElement> {
  children: ReactNode;
}

export function FormDescription({ className, children, ...props }: FormDescriptionProps) {
  return (
    <p className={cx('vx-form-description', className)} {...props}>
      {children}
    </p>
  );
}

export interface FormMessageProps extends HTMLAttributes<HTMLParagraphElement> {
  children?: ReactNode;
}

export function FormMessage({ className, children, ...props }: FormMessageProps) {
  const { error } = useFormField();
  const body = error ?? children;
  if (!body) return null;
  return (
    <p className={cx('vx-form-message', error && 'vx-form-message--error', className)} {...props}>
      {body}
    </p>
  );
}
