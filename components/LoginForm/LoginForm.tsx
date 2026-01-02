'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { login } from '../../lib/api/clientApi';
import { useAuthStore } from '../../lib/store/authStore';
import styles from './LoginForm.module.css';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
});

interface LoginFormProps {
  onSwitchToRegister?: () => void;
  onSuccess?: () => void;
}

export default function LoginForm({ onSwitchToRegister, onSuccess }: LoginFormProps) {
  const { setUser } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await login(values);
        setUser(response);
        toast.success('Successfully logged in!');
        onSuccess?.();
      } catch (error: unknown) {
        const message = error instanceof Error 
          ? error.message 
          : 'Login failed';
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Sign In</h2>
      
      <div className={styles.field}>
        <label htmlFor="email" className={styles.label}>
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={`${styles.input} ${
            formik.touched.email && formik.errors.email ? styles.inputError : ''
          }`}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
        />
        {formik.touched.email && formik.errors.email && (
          <div className={styles.error}>{formik.errors.email}</div>
        )}
      </div>

      <div className={styles.field}>
        <label htmlFor="password" className={styles.label}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          className={`${styles.input} ${
            formik.touched.password && formik.errors.password ? styles.inputError : ''
          }`}
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
        />
        {formik.touched.password && formik.errors.password && (
          <div className={styles.error}>{formik.errors.password}</div>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
      </button>

      {onSwitchToRegister && (
        <p className={styles.switchText}>
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className={styles.switchButton}
            onClick={onSwitchToRegister}
            disabled={formik.isSubmitting}
          >
            Sign up
          </button>
        </p>
      )}
    </form>
  );
}