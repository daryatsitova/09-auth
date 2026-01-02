'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getMe } from '../../../lib/api/clientApi';
import { useAuthStore } from '../../../lib/store/authStore';
import css from './Profile.module.css';

export default function ProfilePage() {
  const { user, setUser } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getMe();
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Если пользователя нет в store, загружаем его
    if (!user) {
      fetchUserData();
    } else {
      setLoading(false);
    }
  }, [user, setUser]);

  if (loading) {
    return (
      <main className={css.mainContent}>
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className={css.mainContent}>
      <div className={css.profileCard}>
        <div className={css.header}>
          <h1 className={css.formTitle}>Profile Page</h1>
          <Link href="/profile/edit" className={css.editProfileButton}>
            Edit Profile
          </Link>
        </div>
        <div className={css.avatarWrapper}>
          {user?.avatar ? (
            <Image
              src={user.avatar}
              alt="User Avatar"
              width={120}
              height={120}
              className={css.avatar}
            />
          ) : (
            <div className={css.avatarPlaceholder}>
              <span>👤</span>
            </div>
          )}
        </div>
        <div className={css.profileInfo}>
          <p>
            Username: {user?.username || user?.email || 'No username'}
          </p>
          <p>
            Email: {user?.email || 'No email'}
          </p>
        </div>
      </div>
    </main>
  );
}