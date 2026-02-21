import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useUser } from '../context/UserContext';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerSuccess, setRegisterSuccess] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { login, register, isAdmin } = useUser();

  // Redirect destination after login
  const from = (location.state as any)?.from || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isLogin) {
        const { error: loginError } = await login(email, password);
        if (loginError) {
          if (loginError.includes('Invalid login credentials')) {
            setError('Email ou mot de passe incorrect.');
          } else if (loginError.includes('Email not confirmed')) {
            setError('Veuillez confirmer votre email avant de vous connecter.');
          } else {
            setError(loginError);
          }
          return;
        }
        // Navigate immediately — ProtectedRoute handles admin access
        navigate(from || '/profile', { replace: true });
      } else {
        // Register
        if (password.length < 6) {
          setError('Le mot de passe doit contenir au moins 6 caractères.');
          return;
        }
        const { error: regError } = await register(email, password, name);
        if (regError) {
          if (regError.includes('already registered')) {
            setError('Un compte existe déjà avec cet email.');
          } else {
            setError(regError);
          }
          return;
        }
        setRegisterSuccess(true);
      }
    } catch (err: any) {
      setError('Erreur de connexion. Vérifiez votre connexion internet.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-gray-100"
      >
        <AnimatePresence mode="wait">
          {registerSuccess ? (
            <motion.div
              key="register-success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Compte créé !</h2>
              <p className="text-gray-600 mb-6">
                Un email de confirmation a été envoyé à <strong>{email}</strong>.
                Veuillez confirmer votre email avant de vous connecter.
              </p>
              <button
                onClick={() => { setRegisterSuccess(false); setIsLogin(true); setPassword(''); }}
                className="px-6 py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-dark transition-colors"
              >
                Se connecter
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="auth-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold font-display text-gray-900">
                  {isLogin ? 'Bon retour !' : 'Créer un compte'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {isLogin ? 'Connectez-vous pour accéder à votre compte' : 'Rejoignez la communauté TechMaroc'}
                </p>
              </div>

              <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-4">
                  {!isLogin && (
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                        placeholder="Nom complet"
                      />
                    </div>
                  )}
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                      placeholder="Adresse email"
                    />
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm transition-colors"
                      placeholder={isLogin ? 'Mot de passe' : 'Mot de passe (min. 6 caractères)'}
                    />
                  </div>
                </div>

                {/* Error Message */}
                {error && (
                  <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                    <AlertCircle size={16} className="shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {isLogin && (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Se souvenir de moi
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="font-medium text-primary hover:text-primary-dark">
                        Mot de passe oublié ?
                      </a>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/30 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ArrowRight className="h-5 w-5 text-primary-light group-hover:text-white transition-colors" />
                    )}
                  </span>
                  {isSubmitting ? 'Chargement...' : isLogin ? 'SE CONNECTER' : "S'INSCRIRE"}
                </button>
              </form>

              <div className="text-center mt-4">
                <button
                  onClick={() => { setIsLogin(!isLogin); setError(''); setPassword(''); setName(''); }}
                  className="text-sm text-gray-600 hover:text-primary font-medium transition-colors"
                >
                  {isLogin ? "Pas encore de compte ? Créer un compte" : "Déjà un compte ? Se connecter"}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
