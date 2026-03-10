'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import { UserPlus, ShieldCheck } from 'lucide-react';

// Schéma de validation avec confirmation de mot de passe
const registerSchema = z.object({
  full_name: z.string().min(3, "Nom trop court (min 3)"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type RegisterValues = z.infer<typeof registerSchema>;

export const RegisterForm = () => {
  // On récupère la fonction 'register' de notre store Zustand (renommée storeRegister pour éviter conflit)
  const { register: storeRegister } = useAuthStore();
  const router = useRouter();

  const { 
    register, 
    handleSubmit, 
    formState: { errors, isSubmitting } 
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterValues) => {
    try {
      // 1. On appelle la fonction du store qui ajoute l'utilisateur à la liste 'users'
      // On passe les données de base, l'étudiant complétera sa moyenne dans /profile
      storeRegister({
        full_name: data.full_name,
        email: data.email,
        role: 'user', // Rôle étudiant par défaut
      });

      // 2. Message de succès & Redirection vers le profil pour le FitScore
      alert(`Bienvenue ${data.full_name} ! Complétons votre profil pour calculer votre FitScore.`);
      router.push('/profile'); 
    } catch (error) {
      console.error("Erreur inscription:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Champ Nom */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Nom Complet</label>
        <input 
          {...register('full_name')} 
          placeholder="Ex: Yassine Mansouri" 
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-supmti-blue/20 transition-all" 
        />
        {errors.full_name && <p className="text-red-500 text-[10px] italic">{errors.full_name.message}</p>}
      </div>
      
      {/* Champ Email */}
      <div className="space-y-1">
        <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Email Institutionnel ou Personnel</label>
        <input 
          {...register('email')} 
          placeholder="yassine@example.com" 
          className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-supmti-blue/20 transition-all" 
        />
        {errors.email && <p className="text-red-500 text-[10px] italic">{errors.email.message}</p>}
      </div>
      
      {/* Mot de passe */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Mot de passe</label>
          <input 
            type="password" 
            {...register('password')} 
            placeholder="••••••••"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-supmti-blue/20 transition-all" 
          />
        </div>
        
        <div className="space-y-1">
          <label className="text-xs font-bold text-gray-500 ml-1 uppercase">Confirmation</label>
          <input 
            type="password" 
            {...register('confirmPassword')} 
            placeholder="••••••••"
            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-supmti-blue/20 transition-all" 
          />
        </div>
      </div>
      {errors.confirmPassword && <p className="text-red-500 text-[10px] italic">{errors.confirmPassword.message}</p>}
      
      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-supmti-blue text-white py-4 rounded-2xl font-black shadow-lg hover:shadow-blue-200 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 group"
      >
        <UserPlus size={20} />
        {isSubmitting ? "Création en cours..." : "Créer mon compte étudiant"}
      </button>

      <div className="flex items-center justify-center gap-2 text-[10px] text-gray-400 font-medium">
        <ShieldCheck size={12} /> Données sécurisées par SUPMTI AuthSystem
      </div>
    </form>
  );
};