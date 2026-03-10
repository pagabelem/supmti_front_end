'use client';
import { ProfileForm } from '@/components/forms/ProfileForm';

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Mon Profil Étudiant</h1>
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <ProfileForm />
      </div>
    </div>
  );
}