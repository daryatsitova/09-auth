'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '../Modal/Modal';
import LoginForm from '../LoginForm/LoginForm';
import RegisterForm from '../RegisterForm/RegisterForm';
import styles from './AuthModal.module.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const router = useRouter();

  const handleSuccess = () => {
    onClose();
    // Используем window.location для принудительного редиректа
    window.location.href = '/profile';
  };

  const switchToRegister = () => {
    setMode('register');
  };

  const switchToLogin = () => {
    setMode('login');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className={styles.container}>
        {mode === 'login' ? (
          <LoginForm
            onSwitchToRegister={switchToRegister}
            onSuccess={handleSuccess}
          />
        ) : (
          <RegisterForm
            onSwitchToLogin={switchToLogin}
            onSuccess={handleSuccess}
          />
        )}
      </div>
    </Modal>
  );
}