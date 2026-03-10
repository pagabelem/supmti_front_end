'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2 } from 'lucide-react'; // Ajout d'icônes pour le style

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Minimum 6 caractères"),
});

export const LoginForm = () => {
  const { setAuth } = useAuthStore();
  const router = useRouter();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    // Simulation délai réseau
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const mockUser = { 
      id: '1', 
      full_name: 'Étudiant Test', 
      email: data.email, 
      role: 'student' as const, 
      is_active: true, 
      created_at: new Date().toISOString() 
    };
    setAuth(mockUser, "fake-jwt-token");
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Champ Email */}
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
          Email
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-supmti-blue transition-colors">
            <Mail size={18} />
          </div>
          <input 
            {...register('email')} 
            placeholder="nom@exemple.com"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-supmti-blue/20 focus:border-supmti-blue dark:focus:border-blue-500 outline-none transition-all shadow-sm" 
          />
        </div>
        {errors.email && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium italic">{errors.email.message as string}</p>}
      </div>

      {/* Champ Mot de passe */}
      <div>
        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1">
          Mot de passe
        </label>
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-supmti-blue transition-colors">
            <Lock size={18} />
          </div>
          <input 
            type="password" 
            {...register('password')} 
            placeholder="••••••••"
            className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-white placeholder:text-gray-400 focus:ring-2 focus:ring-supmti-blue/20 focus:border-supmti-blue dark:focus:border-blue-500 outline-none transition-all shadow-sm" 
          />
        </div>
        {errors.password && <p className="text-red-500 text-xs mt-1.5 ml-1 font-medium italic">{errors.password.message as string}</p>}
      </div>

      {/* Bouton de soumission */}
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-supmti-blue dark:bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-800 dark:hover:bg-blue-700 shadow-lg shadow-blue-100 dark:shadow-none hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
      >
        {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : "Se connecter"}
      </button>

      {/* Option supplémentaire style Dark Mode */}
      <div className="text-center mt-4">
        <button type="button" className="text-xs text-gray-500 dark:text-gray-400 hover:text-supmti-blue dark:hover:text-blue-400 transition-colors">
          Mot de passe oublié ?
        </button>
      </div>
    </form>
  );
};