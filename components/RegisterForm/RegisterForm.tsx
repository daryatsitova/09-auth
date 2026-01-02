'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { register } from '../../lib/api/clientApi';
import { useAuthStore } from '../../lib/store/authStore';
import styles from './RegisterForm.module.css';
import toast from 'react-hot-toast';

const validationSchema = Yup.object({
  email: Yup.string()
    .email('Invalid email format')
    .required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

interface RegisterFormProps {
  onSwitchToLogin?: () => void;
  onSuccess?: () => void;
}

export default function RegisterForm({ onSwitchToLogin, onSuccess }: RegisterFormProps) {
  const { setUser } = useAuthStore();

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const response = await register({
          email: values.email,
          password: values.password,
        });
        setUser(response);
        toast.success('Account created successfully!');
        onSuccess?.();
      } catch (error: unknown) {
        const message = error instanceof Error 
          ? error.message 
          : 'Registration failed';
        toast.error(message);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className={styles.form}>
      <h2 className={styles.title}>Sign Up</h2>
      
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

      <div className={styles.field}>
        <label htmlFor="confirmPassword" className={styles.label}>
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          className={`${styles.input} ${
            formik.touched.confirmPassword && formik.errors.confirmPassword ? styles.inputError : ''
          }`}
          value={formik.values.confirmPassword}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          disabled={formik.isSubmitting}
        />
        {formik.touched.confirmPassword && formik.errors.confirmPassword && (
          <div className={styles.error}>{formik.errors.confirmPassword}</div>
        )}
      </div>

      <button
        type="submit"
        className={styles.submitButton}
        disabled={formik.isSubmitting}
      >
        {formik.isSubmitting ? 'Creating account...' : 'Sign Up'}
      </button>

      {onSwitchToLogin && (
        <p className={styles.switchText}>
          Already have an account?{' '}
          <button
            type="button"
            className={styles.switchButton}
            onClick={onSwitchToLogin}
            disabled={formik.isSubmitting}
          >
            Sign in
          </button>
        </p>
      )}
    </form>
  );
}