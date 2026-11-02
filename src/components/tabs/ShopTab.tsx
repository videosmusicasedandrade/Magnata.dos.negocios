import React, { useState } from 'react';
import { GameState, InAppProduct, InAppProductCategory } from '../../types/game';
import { IN_APP_PRODUCTS, MONETIZATION_ROADMAP } from '../../game/billing';
import { soundEngine } from '../../game/audio';
import {
  ShoppingBag,
  RotateCcw,
  Sparkles,
  Zap,
  Users,
  Crown,
  FileCheck2,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  Check,
} from 'lucide-react';

interface ShopTabProps {
  state: GameState;
  onBuyProduct: (productId: string) => void;
  onRestorePurchases: () => void;
  onOpenWheelOfFortune: () => void;
}

export const ShopTab: React.FC<ShopTabProps> = ({
  state,
  onBuyProduct,
  onRestorePurchases,
  onOpenWheelOfFortune,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<InAppProductCategory | 'roadmap'>('capital');

  const filteredProducts = IN_APP_PRODUCTS.filter((p) => p.category === selectedCategory);

  const formatPrice = (price: number) => {
    return `R$ ${price.toFixed(2).replace('.', ',')}`;
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Google Play Badge & Restore Button */}
      <div className="bg-gradient-to-r from-emerald-950/80 via-slate-900 to-indigo-950/80 border-2 border-emerald-500/50 rounded-xl p-4 sm:p-5 retro-box flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-900/60 border-2 border-emerald-400 flex items-center justify-center text-3xl shrink-0 shadow-lg">
            🛒
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-pixel text-sm sm:text-base text-emerald-300">
                Lojinha Google Play & Monetização
              </h2>
              <span className="font-pixel text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-2 py-0.5 rounded">
                BILLING V6.2
              </span>
            </div>
            <p className="text-xs text-slate-300 font-retro mt-1 max-w-xl">
              Transações seguras e criptografadas. Compras permanentes ficam salvas e vinculadas à sua conta Google Play.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
          {/* Wheel of Fortune shortcut */}
          <button
            onClick={onOpenWheelOfFortune}
            className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-pixel text-xs rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer shadow-md animate-pulse"
          >
            <span>🎡 ROLETA GRÁTIS!</span>
          </button>

          {/* Restore Purchases */}
          <button
            onClick={() => {
              onRestorePurchases();
              soundEngine.playCoin();
            }}
            className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs rounded-xl retro-btn flex items-center justify-center gap-2 cursor-pointer border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>RESTAURAR COMPRAS</span>
          </button>
        </div>
      </div>

      {/* 2. Sub-Category Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b-2 border-slate-700 pb-2">
        <button
          onClick={() => {
            setSelectedCategory('capital');
            soundEngine.playCoin();
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-pixel text-xs retro-btn cursor-pointer ${
            selectedCategory === 'capital'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <span>💵 Pacotes de Capital</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory('accelerator');
            soundEngine.playCoin();
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-pixel text-xs retro-btn cursor-pointer ${
            selectedCategory === 'accelerator'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <span>⚡ Aceleradores</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory('legendary_staff');
            soundEngine.playCoin();
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-pixel text-xs retro-btn cursor-pointer ${
            selectedCategory === 'legendary_staff'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <span>👑 Equipe Lendária</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory('decor');
            soundEngine.playCoin();
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-pixel text-xs retro-btn cursor-pointer ${
            selectedCategory === 'decor'
              ? 'bg-yellow-600 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <span>✨ Decoração VIP</span>
        </button>

        <button
          onClick={() => {
            setSelectedCategory('roadmap');
            soundEngine.playCoin();
          }}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg font-pixel text-xs retro-btn cursor-pointer ${
            selectedCategory === 'roadmap'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <FileCheck2 className="w-3.5 h-3.5" />
          <span>Escopo & Cronograma</span>
        </button>
      </div>

      {/* 3. Products Grid */}
      {selectedCategory !== 'roadmap' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.map((product) => {
            const isOwned =
              product.type === 'non_consumable' &&
              state.purchasedNonConsumables.includes(product.id);

            return (
              <div
                key={product.id}
                className={`border-2 rounded-xl p-4 retro-box flex flex-col justify-between space-y-3 transition-all ${
                  isOwned
                    ? 'bg-purple-950/40 border-purple-500/70 shadow-md'
                    : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between">
                    <span className="text-3xl p-2.5 bg-slate-800 rounded-xl border border-slate-700">
                      {product.icon}
                    </span>
                    {product.badge && (
                      <span className="font-pixel text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/50 px-2 py-0.5 rounded font-bold">
                        {product.badge}
                      </span>
                    )}
                    {isOwned && (
                      <span className="font-pixel text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 px-2 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-3 h-3" /> ADQUIRIDO
                      </span>
                    )}
                  </div>

                  <h3 className="font-pixel text-xs text-slate-100 mt-3">{product.title}</h3>
                  <p className="font-retro text-xs text-slate-400 mt-1">{product.description}</p>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  {!isOwned ? (
                    <button
                      onClick={() => onBuyProduct(product.id)}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-pixel text-xs rounded-xl retro-btn flex items-center justify-between cursor-pointer shadow-md min-h-[48px]"
                    >
                      <span>COMPRAR</span>
                      <span>{formatPrice(product.priceBRL)}</span>
                    </button>
                  ) : (
                    <div className="w-full py-2 text-center text-purple-300 font-pixel text-[10px] bg-purple-950/60 rounded-xl border border-purple-500/40 min-h-[48px] flex items-center justify-center">
                      VINCULADO À CONTA
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* 4. Scope, Google Play Fees & Publishing Roadmap */
        <div className="space-y-6">
          <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5 retro-box space-y-4">
            <h3 className="font-pixel text-sm text-blue-300 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-400" />
              Estrutura de Custos & Monetização Oficial Google Play
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-retro text-slate-400 block">TAXA GOOGLE PLAY</span>
                <span className="font-pixel text-xs text-emerald-400">15% de Comissão</span>
                <p className="text-[10px] font-retro text-slate-400 mt-1">
                  {MONETIZATION_ROADMAP.feeStructure.googleCut}
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-retro text-slate-400 block">RECEITA LÍQUIDA DO DEV</span>
                <span className="font-pixel text-xs text-amber-400">85% Líquido</span>
                <p className="text-[10px] font-retro text-slate-400 mt-1">
                  {MONETIZATION_ROADMAP.feeStructure.developerCut}
                </p>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] font-retro text-slate-400 block">ABERTURA DE CONTA</span>
                <span className="font-pixel text-xs text-blue-400">US$ 25 Vitalício</span>
                <p className="text-[10px] font-retro text-slate-400 mt-1">
                  {MONETIZATION_ROADMAP.feeStructure.registrationFee}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <h4 className="font-pixel text-xs text-slate-200 mb-2">REQUISITOS TÉCNICOS CUMPRIDOS:</h4>
              <ul className="space-y-1.5 text-xs font-retro text-slate-300">
                {MONETIZATION_ROADMAP.securityFeatures.map((sec, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{sec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Release Roadmap */}
          <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5 retro-box space-y-4">
            <h3 className="font-pixel text-sm text-amber-300 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-400" />
              Cronograma de Publicação na Google Play Store
            </h3>

            <div className="space-y-3">
              {MONETIZATION_ROADMAP.phases.map((ph, idx) => (
                <div key={idx} className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <h4 className="font-pixel text-xs text-amber-400">{ph.phase}</h4>
                  <ul className="mt-2 space-y-1 text-xs font-retro text-slate-300 list-disc list-inside">
                    {ph.tasks.map((task, tIdx) => (
                      <li key={tIdx}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Receipts Ledger */}
          <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-5 retro-box space-y-3">
            <h3 className="font-pixel text-xs text-slate-200">
              HISTÓRICO DE RECIBOS GOOGLE PLAY ({state.transactionsHistory.length})
            </h3>

            {state.transactionsHistory.length === 0 ? (
              <p className="text-xs font-retro text-slate-400">
                Nenhum recibo ainda. Ao realizar compras no sandbox ou em produção, os recibos oficiais aparecerão aqui.
              </p>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {state.transactionsHistory.map((rec) => (
                  <div
                    key={rec.orderId}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 text-xs font-retro flex justify-between items-center"
                  >
                    <div>
                      <span className="font-pixel text-[11px] text-slate-200 block">
                        {rec.title}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {rec.orderId} · {new Date(rec.purchaseTime).toLocaleTimeString('pt-BR')}
                      </span>
                    </div>
                    <span className="font-pixel text-xs text-emerald-400">
                      R$ {rec.priceBRL.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
