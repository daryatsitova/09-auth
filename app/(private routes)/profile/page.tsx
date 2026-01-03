import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { getMe } from '../../../lib/api/serverApi';
import css from './Profile.module.css';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Profile',
  description: 'User profile page',
};

export default async function ProfilePage() {
  const user = await getMe();

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