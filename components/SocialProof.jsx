'use client';

export default function SocialProof({ type = 'counter', show = true }) {
  const mockData = {
    users: 2847,
    products: 156,
    events: 89,
    testimonials: [
      {
        name: "Carla M.",
        role: "Empresária",
        text: "Transformou completamente minha visão sobre negócios e vida. A comunidade é incrível!",
        avatar: "C"
      },
      {
        name: "Juliana S.",
        role: "Coach",
        text: "As viagens em movimento são experiências únicas que mudaram minha perspectiva para sempre.",
        avatar: "J"
      },
      {
        name: "Patricia R.",
        role: "Executiva",
        text: "Finalmente encontrei minha tribo. O crescimento pessoal aqui é exponencial!",
        avatar: "P"
      }
    ]
  };

  if (!show) return null;

  if (type === 'testimonial') {
    const t = mockData.testimonials[0];
    return (
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-brand-500 to-accent-500 rounded-full flex items-center justify-center text-white font-bold text-lg">
              {t.avatar}
            </div>
          </div>
          <p className="text-gray-700 italic mb-3">&ldquo;{t.text}&rdquo;</p>
          <div className="font-semibold text-brand-600">{t.name}</div>
          <div className="text-sm text-gray-500">{t.role}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <div className="text-center">
        <div className="text-4xl font-bold text-brand-600 mb-2">{mockData.users.toLocaleString()}</div>
        <p className="text-gray-600 font-medium">Mulheres Empoderadas</p>
        <div className="flex justify-center mt-3 space-x-1" aria-hidden="true">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-2 h-2 bg-accent-500 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}
