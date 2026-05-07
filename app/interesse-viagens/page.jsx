'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CountdownTimer from '@/components/CountdownTimer';
import InteractiveButton from '@/components/InteractiveButton';
import { showSuccessToast, showErrorToast } from '@/components/ToastSystem';

export default function InteresseViagensPage() {
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    viagemInteresse: '',
    mensagem: '',
  });
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vagasRestantes, setVagasRestantes] = useState(7);
  const [pessoasVendo, setPessoasVendo] = useState(Math.floor(Math.random() * 15) + 5);
  const [tempoRestante] = useState(() => {
    const amanha = new Date();
    amanha.setDate(amanha.getDate() + 1);
    amanha.setHours(23, 59, 59, 0);
    return amanha.toISOString();
  });

  // Simula pessoas vendo a página
  useEffect(() => {
    const interval = setInterval(() => {
      setPessoasVendo(Math.floor(Math.random() * 15) + 5);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  // Diminui vagas gradualmente
  useEffect(() => {
    if (vagasRestantes > 0) {
      const timeout = setTimeout(() => {
        setVagasRestantes(prev => Math.max(0, prev - 1));
      }, Math.random() * 30000 + 15000); // 15-45 segundos

      return () => clearTimeout(timeout);
    }
  }, [vagasRestantes]);

  async function enviar(e) {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Simula envio
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showSuccessToast(
        'Interesse registrado com sucesso!',
        'Entraremos em contato em breve com mais informações sobre as próximas viagens exclusivas.'
      );
      
      setEnviado(true);
      setVagasRestantes(prev => Math.max(0, prev - 1));
    } catch (error) {
      showErrorToast(
        'Erro ao enviar interesse',
        'Por favor, tente novamente em alguns instantes.'
      );
    } finally {
      setLoading(false);
    }
  }

  if (enviado) {
    return (
      <motion.div 
        className="max-w-2xl mx-auto text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="card p-8"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div 
            className="w-16 h-16 rounded-full bg-accent-100 text-accent-700 grid place-items-center mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
              <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </motion.div>
          <motion.h1 
            className="display-3 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Interesse registrado!
          </motion.h1>
          <motion.p 
            className="lead text-text-muted mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Recebemos sua manifestação de interesse. Entraremos em contato em breve com mais informações sobre as próximas viagens exclusivas.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link href="/minha-conta" className="btn-primary">
              Voltar à área interna
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="max-w-2xl"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Urgência e Escassez */}
      <motion.div 
        className="mb-8 space-y-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          className="bg-gradient-to-r from-red-500 to-pink-500 text-white p-4 rounded-xl shadow-lg"
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="font-bold text-lg">⚠️ Vagas Limitadas!</p>
              <p className="text-sm opacity-90">Apenas {vagasRestantes} vagas restantes</p>
            </div>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              🔥
            </motion.div>
          </div>
        </motion.div>

        <CountdownTimer targetDate={tempoRestante} />

        <motion.div 
          className="bg-blue-50 border border-blue-200 p-3 rounded-lg"
          animate={{ opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              👀
            </motion.div>
            <p className="text-sm text-blue-800">
              <strong>{pessoasVendo} pessoas</strong> estão vendo esta página agora
            </p>
          </div>
        </motion.div>
      </motion.div>

      <motion.header 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.p 
          className="eyebrow"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Viagens em Movimento
        </motion.p>
        <motion.h1 
          className="display-2 mt-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
        >
          Manifeste seu interesse
        </motion.h1>
        <motion.p 
          className="lead mt-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
        >
          As vagas para nossas viagens exclusivas são limitadas e selecionadas. Deixe seus dados e entraremos em contato quando abrirmos novas turmas.
        </motion.p>
      </motion.header>

      <motion.div 
        className="card p-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.7 }}
        whileHover={{ scale: 1.01 }}
      >
        <motion.form onSubmit={enviar} className="space-y-6">
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="label" htmlFor="nome">Nome completo</label>
              <input
                type="text"
                id="nome"
                className="input mt-1.5"
                value={form.nome}
                onChange={(e) => setForm({...form, nome: e.target.value})}
                required
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }}>
              <label className="label" htmlFor="email">E-mail</label>
              <input
                type="email"
                id="email"
                className="input mt-1.5"
                value={form.email}
                onChange={(e) => setForm({...form, email: e.target.value})}
                required
              />
            </motion.div>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="label" htmlFor="telefone">Telefone</label>
            <input
              type="tel"
              id="telefone"
              className="input mt-1.5"
              value={form.telefone}
              onChange={(e) => setForm({...form, telefone: e.target.value})}
              required
            />
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="label" htmlFor="viagemInteresse">Qual tipo de viagem mais te interessa?</label>
            <select
              id="viagemInteresse"
              className="input mt-1.5"
              value={form.viagemInteresse}
              onChange={(e) => setForm({...form, viagemInteresse: e.target.value})}
              required
            >
              <option value="">Selecione uma opção</option>
              <option value="india">Viagem à Índia Sagrada</option>
              <option value="mediterraneo">Cruzeiro pelo Mediterrâneo</option>
              <option value="machu">Machu Picchu e Sagrado Feminino</option>
              <option value="bali">Retiro em Bali</option>
              <option value="egito">Egito e as Deusas</option>
              <option value="todas">Todas as opções</option>
            </select>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }}>
            <label className="label" htmlFor="mensagem">Conte-nos um pouco sobre você e por que deseja participar</label>
            <textarea
              id="mensagem"
              rows={4}
              className="input mt-1.5"
              placeholder="Compartilhe sua história, expectativas e o que busca nesta jornada..."
              value={form.mensagem}
              onChange={(e) => setForm({...form, mensagem: e.target.value})}
              required
            />
          </motion.div>

          <motion.div 
            className="rounded-2xl border border-line bg-surface-2/60 px-4 py-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <p className="text-sm text-text-muted">
              <strong>Importante:</strong> As vagas são limitadas e selecionadas com cuidade. 
              O processo de seleção considera alinhamento com os valores da comunidade e disponibilidade para o compromisso da jornada.
            </p>
          </motion.div>

          <InteractiveButton
            type="submit"
            loading={loading}
            success={enviado}
            className="w-full"
          >
            {loading ? 'Enviando interesse...' : 'Manifestar interesse'}
          </InteractiveButton>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}