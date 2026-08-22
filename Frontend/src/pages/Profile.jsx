import { useState } from 'react';
import { User, Phone, MessageSquare, Shield, Check, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';

export default function Profile() {
  const { user, updateProfile, logout } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [whatsappEnabled, setWhatsappEnabled] = useState(user?.whatsappEnabled || false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await updateProfile({ name, phone, whatsappEnabled });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-white tracking-tight">
          Account &amp; Settings
        </h1>
        <p className="text-xs sm:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
          Manage your contact credentials and WhatsApp direct return preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-[#121215] border border-zinc-200 dark:border-zinc-800 rounded-3xl p-6 sm:p-8 flex flex-col gap-6 shadow-sm">
        {/* Name */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Full Name
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
            Email Address
          </label>
          <input
            type="email"
            disabled
            value={user?.email || 'user@example.com'}
            className="text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/60 text-zinc-500 cursor-not-allowed"
          />
        </div>

        {/* WhatsApp & Phone settings */}
        <div className="p-5 rounded-2xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200/80 dark:border-zinc-800 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs sm:text-sm font-bold text-zinc-900 dark:text-white">
                WhatsApp Communication
              </span>
            </div>
            <input
              type="checkbox"
              checked={whatsappEnabled}
              onChange={(e) => setWhatsappEnabled(e.target.checked)}
              className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            />
          </div>

          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Allow lost item owners to initiate a verified conversation directly on WhatsApp. Your number remains confidential until a chat is initiated.
          </p>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              WhatsApp Phone Number (with country code)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="e.g. +919876543210"
              className="text-sm px-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <Button type="submit" variant="primary">
            {isSaved ? (
              <>
                <Check size={14} />
                <span>Saved Changes</span>
              </>
            ) : (
              <span>Save Profile</span>
            )}
          </Button>

          <button
            type="button"
            onClick={logout}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 cursor-pointer"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </form>
    </div>
  );
}
