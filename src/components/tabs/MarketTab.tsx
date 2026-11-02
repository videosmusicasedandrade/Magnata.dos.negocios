import React, { useState } from 'react';
import {
  ConsortiumAsset,
  CryptoAsset,
  FixedIncomeAsset,
  GameState,
  StockAsset,
} from '../../types/game';
import { soundEngine } from '../../game/audio';
import {
  TrendingUp,
  Bitcoin,
  ShieldCheck,
  Building,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  CheckCircle2,
  PieChart,
} from 'lucide-react';

import { VipLockBanner } from '../VipLockBanner';

interface MarketTabProps {
  state: GameState;
  onBuyStock: (stockId: string, quantity: number) => void;
  onSellStock: (stockId: string, quantity: number) => void;
  onBuyCrypto: (cryptoId: string, quantity: number) => void;
  onSellCrypto: (cryptoId: string, quantity: number) => void;
  onInvestFixedIncome: (fixedIncomeId: string, amount: number) => void;
  onRedeemFixedIncome: (fixedIncomeId: string) => void;
  onPayConsortiumInstallment: (consortiumId: string) => void;
  onBidConsortium: (consortiumId: string) => void;
  onOpenSettings?: () => void;
}

export const MarketTab: React.FC<MarketTabProps> = ({
  state,
  onBuyStock,
  onSellStock,
  onBuyCrypto,
  onSellCrypto,
  onInvestFixedIncome,
  onRedeemFixedIncome,
  onPayConsortiumInstallment,
  onBidConsortium,
}) => {
  const [subTab, setSubTab] = useState<'bolsa' | 'cripto' | 'renda_fixa' | 'consorcio'>('bolsa');
  const [selectedStockId, setSelectedStockId] = useState<string>(state.stocks[0]?.id || 'uoog');
  const [selectedCryptoId, setSelectedCryptoId] = useState<string>(state.cryptos[0]?.id || 'bitouro');
  const [tradeAmount, setTradeAmount] = useState<number>(1);

  const selectedStock = state.stocks.find((s) => s.id === selectedStockId) || state.stocks[0];
  const selectedCrypto = state.cryptos.find((c) => c.id === selectedCryptoId) || state.cryptos[0];

  const formatBRL = (val: number) => {
    return `R$ ${val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <div className="space-y-4">
      {/* 1. Market Sub-Navigation Bar */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 border-b-2 border-slate-700 pb-2">
        <button
          onClick={() => {
            setSubTab('bolsa');
            soundEngine.playCoin();
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg font-pixel text-[10px] sm:text-xs retro-btn cursor-pointer min-h-[48px] shrink-0 ${
            subTab === 'bolsa'
              ? 'bg-blue-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5 text-blue-300 shrink-0" />
          <span>Bolsa ({state.stocks.length})</span>
        </button>

        <button
          onClick={() => {
            setSubTab('cripto');
            soundEngine.playCoin();
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg font-pixel text-[10px] sm:text-xs retro-btn cursor-pointer min-h-[48px] shrink-0 ${
            subTab === 'cripto'
              ? 'bg-amber-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Bitcoin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
          <span>Cripto ({state.cryptos.length})</span>
        </button>

        <button
          onClick={() => {
            setSubTab('renda_fixa');
            soundEngine.playCoin();
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg font-pixel text-[10px] sm:text-xs retro-btn cursor-pointer min-h-[48px] shrink-0 ${
            subTab === 'renda_fixa'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
          <span>Renda Fixa</span>
        </button>

        <button
          onClick={() => {
            setSubTab('consorcio');
            soundEngine.playCoin();
          }}
          className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-2 rounded-lg font-pixel text-[10px] sm:text-xs retro-btn cursor-pointer min-h-[48px] shrink-0 ${
            subTab === 'consorcio'
              ? 'bg-purple-600 text-white shadow-md'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          <Building className="w-3.5 h-3.5 text-purple-300 shrink-0" />
          <span>Consórcios</span>
        </button>
      </div>

      {/* 2. SUBTAB: BOLSA DE VALORES */}
      {subTab === 'bolsa' && (
        state.plan === 'COMUM' ? (
          <VipLockBanner
            featureName="Bolsa de Valores (Ações Uoogle, Applo, Microhard)"
            description="Compre e venda ações das maiores empresas fictícias do mercado, receba dividendos periódicos e multiplique seu capital. Exclusivo do Plano VIP!"
            onOpenSettings={onOpenSettings || (() => {})}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Stock Tickers List */}
          <div className="lg:col-span-2 space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {state.stocks.map((stock) => {
              const prevPrice = stock.priceHistory[stock.priceHistory.length - 2] || stock.price;
              const isUp = stock.price >= prevPrice;
              const changePercent = ((stock.price - stock.initialPrice) / stock.initialPrice) * 100;
              const isSelected = stock.id === selectedStockId;

              return (
                <div
                  key={stock.id}
                  onClick={() => setSelectedStockId(stock.id)}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-blue-500 shadow-md'
                      : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-700 flex items-center justify-center font-pixel text-xs text-blue-400">
                      {stock.ticker}
                    </div>
                    <div>
                      <h4 className="font-pixel text-xs text-slate-100">{stock.name}</h4>
                      <p className="font-retro text-[11px] text-slate-400">{stock.sector}</p>
                      {stock.owned > 0 && (
                        <span className="inline-block mt-1 text-[10px] bg-blue-950 border border-blue-500/50 text-blue-300 px-1.5 py-0.5 rounded font-retro">
                          Possui: {stock.owned} cotas ({formatBRL(stock.owned * stock.price)})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-pixel text-sm text-slate-100 tabular-nums">
                      {formatBRL(stock.price)}
                    </div>
                    <div
                      className={`flex items-center justify-end gap-1 text-xs font-retro tabular-nums ${
                        changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {changePercent >= 0 ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      <span>{changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%</span>
                    </div>
                    <div className="text-[10px] text-amber-400/80 font-retro">
                      Div. Yield: {(stock.dividendYield * 100).toFixed(1)}% a.a.
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trade & Chart Panel */}
          {selectedStock && (
            <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 retro-box space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-xs text-blue-400">{selectedStock.ticker}</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-retro">
                    {selectedStock.sector}
                  </span>
                </div>
                <h3 className="font-pixel text-sm text-slate-100 mt-1">{selectedStock.name}</h3>
                <p className="text-xs text-slate-400 font-retro mt-1">{selectedStock.description}</p>
              </div>

              {/* Animated Mini Sparkline Trend */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] font-retro text-slate-500 mb-2">TENDÊNCIA DE PREÇO</div>
                <div className="flex items-end justify-center gap-1.5 h-20">
                  {selectedStock.priceHistory.slice(-10).map((p, i) => {
                    const min = Math.min(...selectedStock.priceHistory);
                    const max = Math.max(...selectedStock.priceHistory);
                    const range = Math.max(1, max - min);
                    const heightPercent = Math.max(15, ((p - min) / range) * 100);
                    return (
                      <div
                        key={i}
                        className="w-3 rounded-t transition-all bg-blue-500 hover:bg-blue-400"
                        style={{ height: `${heightPercent}%` }}
                        title={`R$ ${p.toFixed(2)}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Trade Controls */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-retro text-slate-300">
                  <span>Quantidade de cotas:</span>
                  <div className="flex items-center gap-1">
                    {[1, 5, 10, 50].map((qty) => (
                      <button
                        key={qty}
                        onClick={() => setTradeAmount(qty)}
                        className={`px-2 py-0.5 rounded text-[11px] font-pixel ${
                          tradeAmount === qty
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                        }`}
                      >
                        {qty}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onBuyStock(selectedStock.id, tradeAmount);
                      soundEngine.playTrade(true);
                    }}
                    disabled={state.cash < selectedStock.price * tradeAmount}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-pixel text-[10px] sm:text-xs rounded-lg retro-btn cursor-pointer min-h-[48px] flex flex-col items-center justify-center text-center"
                  >
                    <span>COMPRAR</span>
                    <span className="text-[9px] font-retro opacity-90 truncate max-w-full">
                      {formatBRL(selectedStock.price * tradeAmount)}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onSellStock(selectedStock.id, Math.min(selectedStock.owned, tradeAmount));
                      soundEngine.playTrade(false);
                    }}
                    disabled={selectedStock.owned <= 0}
                    className="p-2 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-pixel text-[10px] sm:text-xs rounded-lg retro-btn cursor-pointer min-h-[48px] flex flex-col items-center justify-center text-center"
                  >
                    <span>VENDER</span>
                    <span className="text-[9px] font-retro opacity-90 truncate max-w-full">
                      {formatBRL(selectedStock.price * Math.min(selectedStock.owned, tradeAmount))}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        )
      )}

      {/* 3. SUBTAB: CRIPTOMOEDAS */}
      {subTab === 'cripto' && (
        state.plan === 'COMUM' ? (
          <VipLockBanner
            featureName="Mercado de Criptomoedas (Bitouro, PixToken, Solanares)"
            description="Opere moedas digitais de altíssima volatilidade, acompanhe picos e desvalorizações em tempo real e lucre com a valorização. Exclusivo do Plano VIP!"
            onOpenSettings={onOpenSettings || (() => {})}
          />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {state.cryptos.map((crypto) => {
              const changePercent = ((crypto.price - crypto.initialPrice) / crypto.initialPrice) * 100;
              const isSelected = crypto.id === selectedCryptoId;

              return (
                <div
                  key={crypto.id}
                  onClick={() => setSelectedCryptoId(crypto.id)}
                  className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'bg-slate-800/90 border-amber-500 shadow-md'
                      : 'bg-slate-900 border-slate-700/80 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-500/50 flex items-center justify-center font-pixel text-xs text-amber-400">
                      {crypto.symbol}
                    </div>
                    <div>
                      <h4 className="font-pixel text-xs text-slate-100">{crypto.name}</h4>
                      <p className="font-retro text-[11px] text-slate-400">Volatilidade: Alta ({(crypto.volatility * 100).toFixed(0)}%)</p>
                      {crypto.owned > 0 && (
                        <span className="inline-block mt-1 text-[10px] bg-amber-950 border border-amber-500/50 text-amber-300 px-1.5 py-0.5 rounded font-retro">
                          Possui: {crypto.owned < 1 ? crypto.owned.toFixed(4) : crypto.owned} ({formatBRL(crypto.owned * crypto.price)})
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-pixel text-sm text-slate-100 tabular-nums">
                      {formatBRL(crypto.price)}
                    </div>
                    <div
                      className={`flex items-center justify-end gap-1 text-xs font-retro tabular-nums ${
                        changePercent >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {changePercent >= 0 ? (
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5" />
                      )}
                      <span>{changePercent >= 0 ? '+' : ''}{changePercent.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Crypto Trade Panel */}
          {selectedCrypto && (
            <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 retro-box space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-pixel text-xs text-amber-400">{selectedCrypto.symbol}</span>
                  <span className="text-[10px] bg-amber-950/80 border border-amber-500/50 text-amber-300 px-2 py-0.5 rounded font-retro">
                    CRIPTO ATIVO
                  </span>
                </div>
                <h3 className="font-pixel text-sm text-slate-100 mt-1">{selectedCrypto.name}</h3>
                <p className="text-xs text-slate-400 font-retro mt-1">{selectedCrypto.description}</p>
              </div>

              {/* Crypto Trend Bars */}
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] font-retro text-amber-500/80 mb-2">OSCILAÇÃO EM TEMPO REAL</div>
                <div className="flex items-end justify-center gap-1.5 h-20">
                  {selectedCrypto.priceHistory.slice(-10).map((p, i) => {
                    const min = Math.min(...selectedCrypto.priceHistory);
                    const max = Math.max(...selectedCrypto.priceHistory);
                    const range = Math.max(0.0001, max - min);
                    const heightPercent = Math.max(15, ((p - min) / range) * 100);
                    return (
                      <div
                        key={i}
                        className="w-3 rounded-t transition-all bg-amber-500 hover:bg-amber-400"
                        style={{ height: `${heightPercent}%` }}
                        title={`R$ ${p.toFixed(2)}`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Trade Controls */}
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      onBuyCrypto(selectedCrypto.id, 1);
                      soundEngine.playTrade(true);
                    }}
                    disabled={state.cash < selectedCrypto.price}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-pixel text-[10px] sm:text-xs rounded-lg retro-btn cursor-pointer min-h-[48px] flex flex-col items-center justify-center text-center"
                  >
                    <span>COMPRAR 1</span>
                    <span className="text-[9px] font-retro opacity-90 truncate max-w-full">
                      {formatBRL(selectedCrypto.price)}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      onSellCrypto(selectedCrypto.id, Math.min(selectedCrypto.owned, 1));
                      soundEngine.playTrade(false);
                    }}
                    disabled={selectedCrypto.owned <= 0}
                    className="p-2 bg-rose-600 hover:bg-rose-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-pixel text-[10px] sm:text-xs rounded-lg retro-btn cursor-pointer min-h-[48px] flex flex-col items-center justify-center text-center"
                  >
                    <span>VENDER 1</span>
                    <span className="text-[9px] font-retro opacity-90 truncate max-w-full">
                      {formatBRL(selectedCrypto.price)}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        )
      )}

      {/* 4. SUBTAB: RENDA FIXA */}
      {subTab === 'renda_fixa' && (
        <div className="space-y-3">
          <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-xs font-retro text-emerald-300 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span>
              <strong>Porto Seguro:</strong> A renda fixa garante rentabilidade contratada sem risco de perda de capital. Ideal para proteger patrimônio em épocas de recessão!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {state.fixedIncomes.map((item) => {
              const canInvest = state.cash >= item.minimumInvestment;

              return (
                <div
                  key={item.id}
                  className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 retro-box flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-[10px] bg-slate-800 text-emerald-400 px-2 py-0.5 rounded border border-slate-700">
                        {item.category}
                      </span>
                      <span className="font-pixel text-xs text-emerald-400">
                        +{(item.annualRate * 100).toFixed(1)}% a.a.
                      </span>
                    </div>

                    <h4 className="font-pixel text-xs text-slate-100 mt-2">{item.name}</h4>
                    <p className="text-xs text-slate-400 font-retro mt-1">{item.description}</p>

                    <div className="mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1 font-retro">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Mínimo para aporte:</span>
                        <span className="text-slate-200 font-pixel">{formatBRL(item.minimumInvestment)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Investido atualmente:</span>
                        <span className="text-emerald-400 font-pixel">{formatBRL(item.investedAmount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Rendimento acumulado:</span>
                        <span className="text-amber-400 font-pixel">+{formatBRL(item.accumulatedYield)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
                    <button
                      onClick={() => {
                        onInvestFixedIncome(item.id, item.minimumInvestment);
                        soundEngine.playRegister();
                      }}
                      disabled={!canInvest}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-pixel text-[10px] rounded-lg retro-btn cursor-pointer"
                    >
                      APORTAR ({formatBRL(item.minimumInvestment)})
                    </button>

                    {item.investedAmount > 0 && (
                      <button
                        onClick={() => {
                          onRedeemFixedIncome(item.id);
                          soundEngine.playCoin();
                        }}
                        className="py-2 px-3 bg-amber-600 hover:bg-amber-500 text-slate-950 font-pixel text-[10px] rounded-lg retro-btn cursor-pointer"
                      >
                        RESGATAR TUDO
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. SUBTAB: CONSÓRCIOS */}
      {subTab === 'consorcio' && (
        <div className="space-y-3">
          <div className="p-3 bg-purple-950/40 border border-purple-500/30 rounded-xl text-xs font-retro text-purple-300 flex items-center gap-2">
            <Building className="w-5 h-5 text-purple-400 shrink-0" />
            <span>
              <strong>Planejamento Sem Juros:</strong> Pague parcelas mensais e aguarde o sorteio, ou antecipe a conquista oferecendo um <strong>Lance</strong> em dinheiro!
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {state.consortiums.map((cons) => {
              const bidCost = Math.round(cons.totalValue * cons.minBidPercent);
              const canPayInstallment = state.cash >= cons.installmentValue && !cons.isContemplated;
              const canBid = state.cash >= bidCost && !cons.isContemplated;

              return (
                <div
                  key={cons.id}
                  className={`border-2 rounded-xl p-4 retro-box flex flex-col justify-between space-y-3 ${
                    cons.isContemplated
                      ? 'bg-purple-950/40 border-purple-500 shadow-md'
                      : 'bg-slate-900 border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="font-pixel text-[10px] bg-slate-800 text-purple-300 px-2 py-0.5 rounded border border-slate-700 uppercase">
                        {cons.category}
                      </span>
                      {cons.isContemplated ? (
                        <span className="flex items-center gap-1 font-pixel text-xs text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500">
                          <CheckCircle2 className="w-3.5 h-3.5" /> CONTEMPLADO
                        </span>
                      ) : (
                        <span className="font-retro text-xs text-slate-400">
                          Parcela {cons.paidInstallments}/{cons.totalInstallments}
                        </span>
                      )}
                    </div>

                    <h4 className="font-pixel text-xs text-slate-100 mt-2">{cons.name}</h4>
                    <p className="text-xs text-slate-400 font-retro mt-1">{cons.benefitDescription}</p>

                    <div className="mt-3 p-2 bg-slate-950 rounded-lg border border-slate-800 text-xs space-y-1 font-retro">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Valor da Parcela:</span>
                        <span className="text-slate-200 font-pixel">{formatBRL(cons.installmentValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Valor Total do Bem:</span>
                        <span className="text-amber-400 font-pixel">{formatBRL(cons.totalValue)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Bônus Passivo:</span>
                        <span className="text-emerald-400 font-pixel">+{formatBRL(cons.passiveBonus)}/s</span>
                      </div>
                    </div>
                  </div>

                  {!cons.isContemplated ? (
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={() => {
                          onPayConsortiumInstallment(cons.id);
                          soundEngine.playRegister();
                        }}
                        disabled={!canPayInstallment}
                        className="w-full sm:flex-1 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-pixel text-[10px] rounded-lg retro-btn cursor-pointer"
                      >
                        PAGAR PARCELA ({formatBRL(cons.installmentValue)})
                      </button>

                      <button
                        onClick={() => {
                          onBidConsortium(cons.id);
                          soundEngine.playFanfare();
                        }}
                        disabled={!canBid}
                        className="w-full sm:flex-1 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-slate-800 disabled:text-slate-500 text-white font-pixel text-[10px] rounded-lg retro-btn cursor-pointer"
                      >
                        DAR LANCE ({formatBRL(bidCost)})
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-2 bg-purple-900/40 text-purple-200 font-pixel text-xs rounded-lg border border-purple-500/50">
                      🎉 BEM ADQUIRIDO COM SUCESSO!
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
