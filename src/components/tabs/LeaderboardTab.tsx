import React, { useState, useMemo, useRef } from 'react';
import { GameState, LeaderboardEntry } from '../../types/game';
import {
  computeTop100Leaderboard,
  exportFirebaseRealtimeDbJson,
  RTDB_LEADERBOARD_PATH,
} from '../../game/leaderboard';
import { soundEngine } from '../../game/audio';
import {
  Trophy,
  Medal,
  Crown,
  Search,
  Crosshair,
  UserCheck,
  Edit3,
  Database,
  Building,
  MapPin,
  TrendingUp,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
  X,
} from 'lucide-react';

interface LeaderboardTabProps {
  state: GameState;
  onUpdateCeoProfile: (newCeoName: string, newCompanyName: string) => void;
}

type FilterView = 'todos' | 'top10' | 'proximos' | 'agro' | 'tech' | 'financas';

export const LeaderboardTab: React.FC<LeaderboardTabProps> = ({
  state,
  onUpdateCeoProfile,
}) => {
  const [filterView, setFilterView] = useState<FilterView>('todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCeo, setSelectedCeo] = useState<LeaderboardEntry | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState<boolean>(false);
  const [isDbInspectorOpen, setIsDbInspectorOpen] = useState<boolean>(false);
  const [copiedDbJson, setCopiedDbJson] = useState<boolean>(false);

  // Profile edit form state
  const [editCeoName, setEditCeoName] = useState<string>(state.ceoName || 'Você (CEO)');
  const [editCompanyName, setEditCompanyName] = useState<string>(state.companyName || 'Império Magnata');

  // Highlight animation on player row
  const [highlightPlayer, setHighlightPlayer] = useState<boolean>(false);
  const playerRowRef = useRef<HTMLDivElement | null>(null);

  // Compute live ranking
  const {
    leaderboard,
    playerEntry,
    playerRank,
    nextCeoToBeat,
    diffToNextRank,
    top10,
  } = useMemo(() => computeTop100Leaderboard(state), [state]);

  // Filtered leaderboard entries
  const filteredEntries = useMemo(() => {
    let list = [...leaderboard];

    if (filterView === 'top10') {
      list = list.slice(0, 10);
    } else if (filterView === 'proximos') {
      // Find window of 5 above and 5 below player
      const minRank = Math.max(1, playerRank - 4);
      const maxRank = Math.min(100, playerRank + 4);
      list = list.filter((e) => e.rank >= minRank && e.rank <= maxRank);
    } else if (filterView === 'agro') {
      list = list.filter((e) => e.sector.toLowerCase().includes('agro') || e.isPlayer);
    } else if (filterView === 'tech') {
      list = list.filter((e) => e.sector.toLowerCase().includes('tec') || e.isPlayer);
    } else if (filterView === 'financas') {
      list = list.filter((e) => e.sector.toLowerCase().includes('fin') || e.isPlayer);
    }

    if (searchQuery.trim().length > 0) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (e) =>
          e.ceoName.toLowerCase().includes(q) ||
          e.companyName.toLowerCase().includes(q) ||
          e.city.toLowerCase().includes(q) ||
          e.state.toLowerCase().includes(q) ||
          e.sector.toLowerCase().includes(q)
      );
    }

    return list;
  }, [leaderboard, filterView, searchQuery, playerRank]);

  // Jump to player rank
  const handleJumpToPlayer = () => {
    soundEngine.playCoin();
    setFilterView('todos');
    setSearchQuery('');

    setTimeout(() => {
      if (playerRowRef.current) {
        playerRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setHighlightPlayer(true);
        setTimeout(() => setHighlightPlayer(false), 2500);
      }
    }, 100);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (editCeoName.trim().length === 0) return;
    soundEngine.playFanfare();
    onUpdateCeoProfile(editCeoName.trim(), editCompanyName.trim());
    setIsEditingProfile(false);
  };

  const handleCopyDbJson = () => {
    const jsonStr = exportFirebaseRealtimeDbJson(state);
    navigator.clipboard.writeText(jsonStr);
    setCopiedDbJson(true);
    setTimeout(() => setCopiedDbJson(false), 2000);
  };

  const formatNetWorth = (value: number) => {
    if (value >= 1_000_000_000) {
      return `R$ ${(value / 1_000_000_000).toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      })} Bilhões`;
    }
    if (value >= 1_000_000) {
      return `R$ ${(value / 1_000_000).toLocaleString('pt-BR', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      })} Milhões`;
    }
    return `R$ ${Math.round(value).toLocaleString('pt-BR')}`;
  };

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <span className="text-yellow-400 font-pixel text-xs flex items-center gap-1">🥇 1º</span>;
    if (rank === 2) return <span className="text-slate-300 font-pixel text-xs flex items-center gap-1">🥈 2º</span>;
    if (rank === 3) return <span className="text-amber-600 font-pixel text-xs flex items-center gap-1">🥉 3º</span>;
    if (rank <= 10) return <span className="text-emerald-400 font-pixel text-xs">💎 #{rank}</span>;
    return <span className="text-slate-400 font-pixel text-xs">#{rank}</span>;
  };

  return (
    <div className="space-y-4">
      {/* 1. TOP HEADER & PLAYER STATUS BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/80 to-slate-900 border-2 border-indigo-500/50 rounded-2xl p-4 sm:p-5 retro-box relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 p-3 opacity-10 pointer-events-none">
          <Trophy className="w-36 h-36 text-yellow-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🇧🇷</span>
              <h2 className="text-base sm:text-lg font-pixel text-amber-300 flex items-center gap-2">
                Ranking Global dos 100 Maiores CEOs
              </h2>
            </div>
            <p className="text-xs font-retro text-slate-300">
              Concorra com os 99 maiores magnatas do Brasil. Dados sincronizados em banco offline em tempo real!
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-pixel bg-indigo-950/80 border border-indigo-400/40 text-indigo-300 px-2 py-0.5 rounded-md">
                <Database className="w-3 h-3 text-cyan-400" />
                Firebase Realtime DB: {RTDB_LEADERBOARD_PATH}
              </span>
              <span className="inline-flex items-center gap-1 text-[10px] font-pixel bg-emerald-950/80 border border-emerald-400/40 text-emerald-300 px-2 py-0.5 rounded-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                100% Offline Single-Player
              </span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
            <button
              onClick={handleJumpToPlayer}
              className="flex-1 md:flex-none flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-pixel text-xs rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer font-bold"
            >
              <Crosshair className="w-3.5 h-3.5" />
              Minha Posição (#{playerRank})
            </button>

            <button
              onClick={() => {
                setEditCeoName(state.ceoName || 'Você (CEO)');
                setEditCompanyName(state.companyName || 'Império Magnata');
                setIsEditingProfile(true);
              }}
              className="flex items-center gap-1 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-pixel text-xs rounded-xl transition-all cursor-pointer"
              title="Personalizar nome do seu CEO e Empresa"
            >
              <Edit3 className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Editar Perfil</span>
            </button>

            <button
              onClick={() => setIsDbInspectorOpen(true)}
              className="flex items-center gap-1 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-cyan-300 border border-cyan-800/60 font-pixel text-xs rounded-xl transition-all cursor-pointer"
              title="Inspecionar nó do Firebase Realtime Database"
            >
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">JSON DB</span>
            </button>
          </div>
        </div>

        {/* Player's Mini Spotlight Strip */}
        <div className="mt-4 pt-3 border-t border-indigo-900/60 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-xl shrink-0">
              ⭐
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-pixel text-slate-400">SEU CEO:</span>
                <span className="text-xs font-pixel text-emerald-300 truncate">{playerEntry.ceoName}</span>
              </div>
              <p className="text-[11px] font-retro text-slate-300 truncate">{playerEntry.companyName}</p>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-yellow-500/20 border border-yellow-400 flex items-center justify-center text-base font-pixel text-yellow-300 shrink-0">
              #{playerRank}
            </div>
            <div>
              <span className="text-[10px] font-pixel text-slate-400">PATRIMÔNIO LÍQUIDO:</span>
              <p className="text-xs font-pixel text-yellow-300">{formatNetWorth(playerEntry.netWorth)}</p>
            </div>
          </div>

          <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-2.5 flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-400 flex items-center justify-center text-lg shrink-0">
              🎯
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-pixel text-slate-400">PRÓXIMO RIVAL (#{(playerRank - 1) || 1}):</span>
              {playerRank === 1 ? (
                <p className="text-xs font-pixel text-amber-400">👑 VOCÊ É O #1 DO BRASIL!</p>
              ) : nextCeoToBeat ? (
                <p className="text-[11px] font-retro text-slate-200 truncate">
                  <span className="text-indigo-300 font-pixel">{nextCeoToBeat.ceoName}</span>{' '}
                  <span className="text-emerald-400 font-pixel">(-{formatNetWorth(diffToNextRank)})</span>
                </p>
              ) : (
                <p className="text-xs font-retro text-slate-400">Carregando rival...</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 2. TOP 3 PODIUM DISPLAY */}
      {top10.length >= 3 && (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-1">
          {/* 2nd Place */}
          <div className="bg-slate-900/90 border-2 border-slate-400/50 rounded-xl p-3 flex flex-col items-center text-center relative retro-box order-1 sm:order-1">
            <span className="absolute -top-3 px-2 py-0.5 rounded-full bg-slate-700 border border-slate-400 text-slate-200 text-[10px] font-pixel">
              🥈 2º Lugar
            </span>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mt-2 mb-1.5 shadow-md"
              style={{ backgroundColor: top10[1].avatarBg }}
            >
              {top10[1].avatar}
            </div>
            <h4 className="font-pixel text-[11px] text-slate-100 truncate max-w-full">
              {top10[1].ceoName}
            </h4>
            <span className="text-[10px] font-retro text-slate-400 truncate max-w-full">
              {top10[1].companyName}
            </span>
            <span className="text-[11px] font-pixel text-slate-300 mt-1">
              {formatNetWorth(top10[1].netWorth)}
            </span>
          </div>

          {/* 1st Place (Grand Champion) */}
          <div className="bg-gradient-to-b from-amber-950/60 to-slate-900/90 border-2 border-yellow-400 rounded-xl p-3 flex flex-col items-center text-center relative retro-box order-2 sm:order-2 scale-105 z-10 shadow-yellow-500/20 shadow-lg">
            <span className="absolute -top-3.5 px-2.5 py-0.5 rounded-full bg-yellow-500 border border-yellow-200 text-slate-950 text-[10px] font-pixel font-bold flex items-center gap-1 animate-pulse">
              <Crown className="w-3 h-3" />
              1º Maior Magnata
            </span>
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mt-2 mb-1.5 shadow-md ring-2 ring-yellow-400/70"
              style={{ backgroundColor: top10[0].avatarBg }}
            >
              {top10[0].avatar}
            </div>
            <h4 className="font-pixel text-xs text-yellow-300 truncate max-w-full">
              {top10[0].ceoName}
            </h4>
            <span className="text-[10px] font-retro text-slate-300 truncate max-w-full">
              {top10[0].companyName}
            </span>
            <span className="text-xs font-pixel text-yellow-400 mt-1 font-bold">
              {formatNetWorth(top10[0].netWorth)}
            </span>
          </div>

          {/* 3rd Place */}
          <div className="bg-slate-900/90 border-2 border-amber-700/50 rounded-xl p-3 flex flex-col items-center text-center relative retro-box order-3 sm:order-3">
            <span className="absolute -top-3 px-2 py-0.5 rounded-full bg-amber-900 border border-amber-600 text-amber-200 text-[10px] font-pixel">
              🥉 3º Lugar
            </span>
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl mt-2 mb-1.5 shadow-md"
              style={{ backgroundColor: top10[2].avatarBg }}
            >
              {top10[2].avatar}
            </div>
            <h4 className="font-pixel text-[11px] text-slate-100 truncate max-w-full">
              {top10[2].ceoName}
            </h4>
            <span className="text-[10px] font-retro text-slate-400 truncate max-w-full">
              {top10[2].companyName}
            </span>
            <span className="text-[11px] font-pixel text-amber-400 mt-1">
              {formatNetWorth(top10[2].netWorth)}
            </span>
          </div>
        </div>
      )}

      {/* 3. FILTERS & SEARCH BAR */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 retro-box">
        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            onClick={() => setFilterView('todos')}
            className={`px-2.5 py-1 rounded-lg text-xs font-pixel transition-all cursor-pointer ${
              filterView === 'todos'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Top 100 Geral
          </button>
          <button
            onClick={() => setFilterView('top10')}
            className={`px-2.5 py-1 rounded-lg text-xs font-pixel transition-all cursor-pointer ${
              filterView === 'top10'
                ? 'bg-amber-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Top 10 Elite
          </button>
          <button
            onClick={() => setFilterView('proximos')}
            className={`px-2.5 py-1 rounded-lg text-xs font-pixel transition-all cursor-pointer ${
              filterView === 'proximos'
                ? 'bg-emerald-600 text-slate-950 font-bold shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            Minha Posição (±4)
          </button>
          <button
            onClick={() => setFilterView('agro')}
            className={`px-2.5 py-1 rounded-lg text-xs font-pixel transition-all cursor-pointer ${
              filterView === 'agro'
                ? 'bg-lime-700 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            🌾 Agro
          </button>
          <button
            onClick={() => setFilterView('tech')}
            className={`px-2.5 py-1 rounded-lg text-xs font-pixel transition-all cursor-pointer ${
              filterView === 'tech'
                ? 'bg-blue-700 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            💻 Tech
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Buscar CEO, empresa ou estado..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 font-retro focus:outline-none focus:border-indigo-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 4. LEADERBOARD LIST */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden retro-box">
        <div className="px-3 py-2 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-[11px] font-pixel text-slate-400">
          <span>RANK / CEO / EMPRESA</span>
          <span>PATRIMÔNIO LÍQUIDO</span>
        </div>

        <div className="divide-y divide-slate-800/80 max-h-[600px] overflow-y-auto">
          {filteredEntries.map((ceo) => {
            const isPlayer = ceo.isPlayer;
            const isSelected = selectedCeo?.id === ceo.id;

            return (
              <div
                key={ceo.id}
                ref={isPlayer ? playerRowRef : null}
                onClick={() => {
                  soundEngine.playClick();
                  setSelectedCeo(isSelected ? null : ceo);
                }}
                className={`p-3 transition-all cursor-pointer flex flex-col gap-2 ${
                  isPlayer
                    ? highlightPlayer
                      ? 'bg-emerald-950/90 ring-4 ring-emerald-400 shadow-2xl scale-[1.01]'
                      : 'bg-emerald-950/50 border-l-4 border-emerald-400 hover:bg-emerald-950/70'
                    : 'hover:bg-slate-800/50'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  {/* Left: Rank, Avatar & Names */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 text-center shrink-0">
                      {getRankBadge(ceo.rank)}
                    </div>

                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center text-lg shrink-0 shadow-sm"
                      style={{ backgroundColor: ceo.avatarBg }}
                    >
                      {ceo.avatar}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h4
                          className={`font-pixel text-xs truncate ${
                            isPlayer ? 'text-emerald-300 font-bold' : 'text-slate-100'
                          }`}
                        >
                          {ceo.ceoName}
                        </h4>
                        {isPlayer && (
                          <span className="bg-emerald-500 text-slate-950 font-pixel text-[9px] px-1.5 py-0.2 rounded font-bold uppercase tracking-wider animate-pulse">
                            VOCÊ
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-retro text-slate-400">
                        <span className="text-slate-300 truncate max-w-[150px] sm:max-w-xs">
                          {ceo.companyName}
                        </span>
                        <span>•</span>
                        <span className="text-indigo-400">{ceo.sector}</span>
                        <span>•</span>
                        <span className="text-amber-400">{ceo.state}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Net Worth & Arrow */}
                  <div className="text-right shrink-0">
                    <p
                      className={`font-pixel text-xs sm:text-sm ${
                        isPlayer
                          ? 'text-emerald-300 font-bold'
                          : ceo.rank <= 3
                          ? 'text-yellow-400'
                          : 'text-slate-200'
                      }`}
                    >
                      {formatNetWorth(ceo.netWorth)}
                    </p>
                    <span className="text-[10px] font-retro text-slate-500 flex items-center justify-end gap-1">
                      {isSelected ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      Detalhes
                    </span>
                  </div>
                </div>

                {/* Expanded Biography / Stats Card */}
                {isSelected && (
                  <div className="mt-2 pt-2 border-t border-slate-800 text-xs font-retro text-slate-300 bg-slate-950/60 p-2.5 rounded-lg space-y-1.5 animate-fadeIn">
                    <p className="italic text-slate-300">"{ceo.biography}"</p>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-400" />
                        Sede: {ceo.city} - {ceo.state}
                      </span>
                      <span className="flex items-center gap-1">
                        <Building className="w-3 h-3 text-cyan-400" />
                        Setor: {ceo.sector}
                      </span>
                      {!isPlayer && (
                        <span className="flex items-center gap-1 text-yellow-300 font-pixel text-[10px]">
                          {ceo.netWorth > playerEntry.netWorth ? (
                            <>Rival à frente por {formatNetWorth(ceo.netWorth - playerEntry.netWorth)}</>
                          ) : (
                            <>Você superou este CEO por {formatNetWorth(playerEntry.netWorth - ceo.netWorth)}!</>
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredEntries.length === 0 && (
            <div className="p-8 text-center text-slate-400 font-retro">
              Nenhum CEO encontrado com os filtros selecionados.
            </div>
          )}
        </div>
      </div>

      {/* 5. MODAL: EDIT CEO / COMPANY PROFILE */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-amber-400 rounded-2xl max-w-md w-full p-5 retro-box space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-400" />
                <h3 className="font-pixel text-sm text-amber-300">Personalizar Perfil do CEO</h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-pixel text-slate-300">Nome do CEO (Seu Nome Completo):</label>
                <input
                  type="text"
                  value={editCeoName}
                  onChange={(e) => setEditCeoName(e.target.value)}
                  placeholder="Ex: Carlos Drumond"
                  maxLength={30}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-retro focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-pixel text-slate-300">Nome da Empresa / Conglomerado:</label>
                <input
                  type="text"
                  value={editCompanyName}
                  onChange={(e) => setEditCompanyName(e.target.value)}
                  placeholder="Ex: Império Magnata"
                  maxLength={35}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-retro focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div className="p-3 bg-amber-950/30 border border-amber-500/30 rounded-xl text-xs font-retro text-amber-200">
                Seu nome e empresa aparecerão instantaneamente no ranking dos Top 100 CEOs do Brasil e ficarão salvos offline no aparelho.
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-pixel text-xs rounded-xl cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-pixel text-xs font-bold rounded-xl shadow-lg cursor-pointer transition-transform active:scale-95"
                >
                  Salvar Perfil
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL: FIREBASE REALTIME DATABASE INSPECTOR */}
      {isDbInspectorOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border-2 border-cyan-400 rounded-2xl max-w-2xl w-full p-5 retro-box space-y-4 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 shrink-0">
              <div className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-400" />
                <h3 className="font-pixel text-sm text-cyan-300">
                  Firebase Realtime Database (Nó Offline)
                </h3>
              </div>
              <button
                onClick={() => setIsDbInspectorOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-xs font-retro text-slate-300 space-y-1.5 shrink-0">
              <p>
                O jogo opera <strong>100% offline</strong> utilizando a estrutura exata do{' '}
                <span className="font-pixel text-cyan-300">Firebase Realtime Database</span> em{' '}
                <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded">
                  {RTDB_LEADERBOARD_PATH}
                </code>
                .
              </p>
              <p className="text-slate-400">
                Cada entrada possui identificador único (chave), nome e sobrenome fictício brasileiro, empresa, setor, estado e patrimônio líquido indexável.
              </p>
            </div>

            <div className="flex-1 bg-slate-950 border border-slate-800 rounded-xl p-3 overflow-y-auto font-mono text-[11px] text-cyan-200">
              <pre className="whitespace-pre-wrap">{exportFirebaseRealtimeDbJson(state)}</pre>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800 shrink-0">
              <button
                onClick={handleCopyDbJson}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-pixel text-xs rounded-xl cursor-pointer"
              >
                {copiedDbJson ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    Copiar JSON
                  </>
                )}
              </button>

              <button
                onClick={() => setIsDbInspectorOpen(false)}
                className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-pixel text-xs font-bold rounded-xl cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
