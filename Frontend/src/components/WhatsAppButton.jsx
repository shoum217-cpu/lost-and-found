import { useState } from 'react';
import { MessageSquare, ExternalLink, Loader2 } from 'lucide-react';
import { getWhatsAppLink } from '../services/itemService';

export default function WhatsAppButton({ itemId, allowWhatsapp, className = '', size = 'md' }) {
  const [loading, setLoading] = useState(false);

  if (!allowWhatsapp) return null;

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await getWhatsAppLink(itemId);
      if (res && res.whatsappUrl) {
        window.open(res.whatsappUrl, '_blank', 'noopener,noreferrer');
      } else {
        alert(res.message || 'WhatsApp contact is not configured by the finder.');
      }
    } catch (err) {
      alert('Unable to open WhatsApp chat at this moment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`inline-flex items-center justify-center gap-2 font-medium text-xs sm:text-sm bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg px-3.5 py-2 transition-all shadow-sm active:scale-[0.98] cursor-pointer disabled:opacity-60 ${className}`}
      title="Contact finder securely on WhatsApp"
    >
      {loading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.699.073-2.123-.518-1.745-.724-2.883-2.503-2.97-2.621-.088-.118-.711-.947-.711-1.808 0-.86.452-1.284.613-1.46.161-.176.353-.221.47-.221.118 0 .235.001.339.006.109.005.257-.041.401.306.148.358.508 1.24.553 1.33.045.09.075.195.015.313-.06.118-.09.191-.179.296-.089.105-.187.235-.267.316-.089.09-.182.188-.078.367.104.179.463.765.993 1.238.683.609 1.258.798 1.437.887.179.09.284.075.389-.045.105-.119.45-.526.57-.706.119-.18.239-.15.401-.09.162.06 1.025.483 1.201.571.176.088.293.133.336.208.043.075.043.435-.101.84z"/>
        </svg>
      )}
      <span>Message on WhatsApp</span>
    </button>
  );
}
