'use client';
import { RegisterForm } from '@/components/forms/RegisterForm';
import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-2xl w-full p-8 bg-white rounded-3xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-blue-100 text-supmti-blue rounded-2xl mb-4">
            <GraduationCap size={40} />
          </div>
          <h2 className="text-3xl font-black text-center text-gray-900">Créer mon compte</h2>
          <p className="text-gray-500 text-sm mt-2">Rejoignez SUPMTI Meknès et calculez votre FitScore</p>
        </div>

        <RegisterForm />

        <p className="text-center mt-8 text-sm text-gray-600">
          Déjà inscrit ?{' '}
          <Link href="/login" className="text-supmti-blue font-bold hover:underline">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}