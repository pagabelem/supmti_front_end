'use client';

import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Save, Loader2 } from 'lucide-react';

const profileSchema = z.object({
  full_name: z.string().min(3, "Le nom doit avoir au moins 3 caractères"),
  average: z.coerce.number().min(0, "Note min 0").max(20, "Note max 20"),
  bac_type: z.string().min(1, "Type de Bac requis"),
  level: z.string().min(1, "Niveau actuel requis"),
  city: z.string().min(1, "Ville requise"),
  interests: z.string().min(5, "Décrivez vos intérêts pour l'analyse IA"),
});

type ProfileValues = z.infer<typeof profileSchema>;

export const ProfileForm = () => {
  const { user, setAuth, token } = useAuthStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileValues>({
    // @ts-ignore
    resolver: zodResolver(profileSchema),
    defaultValues: {
      full_name: user?.full_name || '',
      average: Number((user as any)?.average) || 0,
      bac_type: (user as any)?.bac_type || '',
      level: (user as any)?.level || '',
      city: (user as any)?.city || '',
      interests: Array.isArray((user as any)?.interests) 
        ? (user as any).interests.join(', ') 
        : (user as any)?.interests || '',
    },
  });

  const onSubmit: SubmitHandler<ProfileValues> = async (data) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulation
      if (user && token) {
        const updatedUser = { 
          ...user, 
          ...data, 
          interests: data.interests.split(',').map(i => i.trim()) 
        };
        setAuth(updatedUser, token);
        // Utilisation d'un toast ou d'un style plus moderne que alert si possible plus tard
        alert("Profil mis à jour !");
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  // Style commun pour les inputs
  const inputClasses = "w-full p-2.5 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-supmti-blue/20 focus:border-supmti-blue dark:focus:border-blue-500 outline-none transition-all shadow-sm placeholder:text-gray-400";
  const labelClasses = "block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1.5 ml-1";

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* Nom Complet */}
        <div className="space-y-1">
          <label className={labelClasses}>Nom Complet</label>
          <input {...register('full_name')} className={inputClasses} />
          {errors.full_name && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.full_name.message}</p>}
        </div>

        {/* Moyenne */}
        <div className="space-y-1">
          <label className={labelClasses}>Moyenne Générale (Bac)</label>
          <input type="number" step="0.01" {...register('average')} className={inputClasses} />
          {errors.average && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.average.message}</p>}
        </div>

        {/* Niveau */}
        <div className="space-y-1">
          <label className={labelClasses}>Niveau Actuel</label>
          <input {...register('level')} placeholder="Ex: 2ème année Bac" className={inputClasses} />
          {errors.level && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.level.message}</p>}
        </div>

        {/* Type de Bac */}
        <div className="space-y-1">
          <label className={labelClasses}>Type de Bac</label>
          <select {...register('bac_type')} className={inputClasses}>
            <option value="">Sélectionner...</option>
            <option value="PC">Physique-Chimie</option>
            <option value="SVT">SVT</option>
            <option value="SM">Sciences Maths</option>
            <option value="Eco">Économie</option>
          </select>
          {errors.bac_type && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.bac_type.message}</p>}
        </div>

        {/* Ville */}
        <div className="space-y-1">
          <label className={labelClasses}>Ville</label>
          <input {...register('city')} className={inputClasses} />
          {errors.city && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.city.message}</p>}
        </div>
      </div>

      {/* Intérêts */}
      <div className="space-y-1">
        <label className={labelClasses}>Centres d'intérêt (IA & Orientation)</label>
        <textarea
          {...register('interests')}
          rows={3}
          placeholder="Ex: Programmation, IA, Robotique..."
          className={cn(inputClasses, "resize-none")}
        />
        {errors.interests && <p className="text-red-500 text-xs mt-1 animate-pulse">{errors.interests.message}</p>}
      </div>

      {/* Bouton Save */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex items-center justify-center gap-2 w-full bg-supmti-blue dark:bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-800 dark:hover:bg-blue-700 transition-all shadow-lg shadow-blue-100 dark:shadow-none disabled:bg-gray-400 dark:disabled:bg-slate-800 hover:scale-[1.01] active:scale-95"
      >
        {isSubmitting ? (
          <Loader2 size={20} className="animate-spin" />
        ) : (
          <Save size={20} />
        )}
        {isSubmitting ? "Analyse du profil..." : "Sauvegarder mon profil"}
      </button>
    </form>
  );
};

// Petite fonction utilitaire cn si tu ne l'as pas déjà importée
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}