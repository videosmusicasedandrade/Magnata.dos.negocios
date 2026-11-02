import React, { useState } from 'react';
import { Employee, GameState, StaffRank, StaffSpecialty } from '../../types/game';
import { FIRST_NAMES, LAST_NAMES } from '../../game/constants';
import { RANK_LABELS, RANK_MULTIPLIERS, SPECIALTY_LABELS } from '../../game/economy';
import { soundEngine } from '../../game/audio';
import {
  Users,
  UserPlus,
  GraduationCap,
  Sparkles,
  Heart,
  TrendingUp,
  UserMinus,
  Award,
} from 'lucide-react';

interface StaffTabProps {
  state: GameState;
  onHireEmployee: (employee: Employee) => void;
  onPromoteEmployee: (employeeId: string) => void;
  onTrainEmployee: (employeeId: string, specialty: StaffSpecialty) => void;
  onBonusEmployee: (employeeId: string) => void;
  onFireEmployee: (employeeId: string) => void;
  onPizzaFriday: () => void;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  state,
  onHireEmployee,
  onPromoteEmployee,
  onTrainEmployee,
  onBonusEmployee,
  onFireEmployee,
  onPizzaFriday,
}) => {
  const [selectedSpecialty, setSelectedSpecialty] = useState<Record<string, StaffSpecialty>>({});

  const nextRanks: Record<StaffRank, StaffRank | null> = {
    estagiario: 'junior',
    junior: 'senior',
    senior: 'especialista',
    especialista: 'lendario',
    lendario: null,
  };

  const rankUpgradeCosts: Record<StaffRank, number> = {
    estagiario: 800,
    junior: 3500,
    senior: 15000,
    especialista: 60000,
    lendario: 0,
  };

  const courseCost = 2500;

  // Generate a new candidate
  const generateCandidate = (): Employee => {
    const fName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
    const lName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
    const seed = Math.floor(Math.random() * 100);

    // Rank depends on reputation
    let rank: StaffRank = 'estagiario';
    let baseProd = 3;
    let cost = 300;

    if (state.reputation >= 600 && Math.random() < 0.25) {
      rank = 'senior';
      baseProd = 12;
      cost = 4500;
    } else if (state.reputation >= 200 && Math.random() < 0.45) {
      rank = 'junior';
      baseProd = 6;
      cost = 1200;
    }

    return {
      id: 'emp_' + Date.now() + '_' + Math.floor(Math.random() * 1000),
      name: `${fName} ${lName}`,
      avatarSeed: seed,
      roleTitle: `${RANK_LABELS[rank]} de Finanças`,
      rank,
      specialty: 'geral',
      salary: Math.round(cost * 0.15),
      baseProductivity: baseProd,
      morale: 100,
      successRate: 50 + Math.floor(Math.random() * 30),
      hireCost: cost,
      deskIndex: state.employees.length,
    };
  };

  const handleHireNew = () => {
    if (state.employees.length >= state.maxStaffCapacity) return;
    const candidate = generateCandidate();
    if (state.cash < candidate.hireCost) return;
    onHireEmployee(candidate);
    soundEngine.playRegister();
  };

  return (
    <div className="space-y-4">
      {/* 1. Header & Quick Actions */}
      <div className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 retro-box flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="font-pixel text-sm text-amber-300 flex items-center gap-2">
            <Users className="w-5 h-5 text-amber-400" />
            Quadro de Funcionários ({state.employees.length}/{state.maxStaffCapacity})
          </h2>
          <p className="text-xs text-slate-400 font-retro mt-0.5">
            Treine sua equipe para acelerar o faturamento e ter insights assertivos nos investimentos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Pizza Friday */}
          <button
            onClick={() => {
              if (state.cash >= 450) {
                onPizzaFriday();
                soundEngine.playRegister();
              }
            }}
            disabled={state.cash < 450}
            className="px-3 py-2 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-800 disabled:text-slate-500 text-slate-950 font-pixel text-[10px] rounded-lg retro-btn flex items-center gap-1.5 cursor-pointer"
          >
            <span>🍕 Rodízio de Pizza (+Moral Geral)</span>
            <span className="font-retro text-xs">(R$ 450)</span>
          </button>

          {/* Hire Candidate */}
          <button
            onClick={handleHireNew}
            disabled={state.employees.length >= state.maxStaffCapacity}
            className={`px-4 py-2 font-pixel text-[11px] rounded-lg retro-btn flex items-center gap-2 cursor-pointer ${
              state.employees.length < state.maxStaffCapacity
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>CONTRATAR TALENTO</span>
          </button>
        </div>
      </div>

      {/* 2. Employee List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {state.employees.map((emp) => {
          const nextRank = nextRanks[emp.rank];
          const upgradeCost = nextRank ? rankUpgradeCosts[emp.rank] : 0;
          const canPromote = nextRank && state.cash >= upgradeCost;
          const currentProd = Math.round(
            emp.baseProductivity *
              (RANK_MULTIPLIERS[emp.rank] || 1) *
              (emp.specialty !== 'geral' ? 1.5 : 1) *
              Math.max(0.3, emp.morale / 100)
          );

          return (
            <div
              key={emp.id}
              className="bg-slate-900 border-2 border-slate-700 rounded-xl p-4 retro-box flex flex-col justify-between space-y-3"
            >
              {/* Employee Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-slate-800 border-2 border-slate-600 flex items-center justify-center text-xl shrink-0">
                    👨‍💼
                  </div>
                  <div>
                    <h3 className="font-pixel text-xs text-slate-100">{emp.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="font-retro text-xs px-2 py-0.5 rounded bg-indigo-950/80 border border-indigo-500/50 text-indigo-300">
                        {RANK_LABELS[emp.rank]}
                      </span>
                      <span className="font-retro text-xs px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-500/50 text-emerald-300">
                        {SPECIALTY_LABELS[emp.specialty]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Morale Badge */}
                <div className="text-right">
                  <div className="flex items-center gap-1 text-xs text-rose-400 font-retro justify-end">
                    <Heart className="w-3.5 h-3.5 fill-rose-500" />
                    <span>{emp.morale}% Moral</span>
                  </div>
                  <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden mt-1 border border-slate-700">
                    <div
                      className={`h-full ${
                        emp.morale > 60
                          ? 'bg-emerald-500'
                          : emp.morale > 30
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                      style={{ width: `${emp.morale}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/60 p-2.5 rounded-lg border border-slate-800 text-xs">
                <div>
                  <span className="text-slate-400 font-retro text-[10px] block">PRODUTIVIDADE:</span>
                  <span className="font-pixel text-emerald-400 text-xs">+{currentProd}/s</span>
                </div>
                <div>
                  <span className="text-slate-400 font-retro text-[10px] block">ACERTO INVESTIMENTOS:</span>
                  <span className="font-pixel text-amber-400 text-xs">{emp.successRate}%</span>
                </div>
              </div>

              {/* Training and Actions */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                {/* Specialty Training Selector */}
                <div className="flex items-center gap-2">
                  <select
                    value={selectedSpecialty[emp.id] || 'bolsa'}
                    onChange={(e) =>
                      setSelectedSpecialty({
                        ...selectedSpecialty,
                        [emp.id]: e.target.value as StaffSpecialty,
                      })
                    }
                    className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-2 py-1.5 text-xs font-retro text-slate-200 cursor-pointer"
                  >
                    <option value="bolsa">Curso: Bolsa de Valores</option>
                    <option value="cripto">Curso: Criptomoedas</option>
                    <option value="renda_fixa">Curso: Renda Fixa</option>
                    <option value="consorcio">Curso: Consórcios & Bens</option>
                  </select>

                  <button
                    onClick={() => {
                      const spec = selectedSpecialty[emp.id] || 'bolsa';
                      if (state.cash >= courseCost) {
                        onTrainEmployee(emp.id, spec);
                        soundEngine.playFanfare();
                      }
                    }}
                    disabled={state.cash < courseCost}
                    className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 disabled:text-slate-500 font-pixel text-[10px] rounded-lg retro-btn text-white cursor-pointer"
                  >
                    Especializar (R$ {courseCost})
                  </button>
                </div>

                {/* Promotion & Bonus Buttons */}
                <div className="flex items-center gap-2">
                  {nextRank ? (
                    <button
                      onClick={() => {
                        if (canPromote) {
                          onPromoteEmployee(emp.id);
                          soundEngine.playFanfare();
                        }
                      }}
                      disabled={!canPromote}
                      className={`flex-1 py-1.5 px-2 rounded-lg font-pixel text-[10px] flex items-center justify-center gap-1.5 retro-btn cursor-pointer ${
                        canPromote
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                      }`}
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Promover a {RANK_LABELS[nextRank]} (R$ {upgradeCost})</span>
                    </button>
                  ) : (
                    <div className="flex-1 py-1.5 px-2 text-center font-pixel text-[10px] text-yellow-400 bg-yellow-950/40 rounded-lg border border-yellow-500/40">
                      ⭐ NÍVEL LENDÁRIO MÁXIMO ⭐
                    </div>
                  )}

                  <button
                    onClick={() => {
                      if (state.cash >= 200) {
                        onBonusEmployee(emp.id);
                        soundEngine.playRegister();
                      }
                    }}
                    disabled={state.cash < 200 || emp.morale >= 100}
                    className="py-1.5 px-2 bg-emerald-700 hover:bg-emerald-600 disabled:bg-slate-800 disabled:text-slate-500 text-white font-pixel text-[10px] rounded-lg retro-btn cursor-pointer"
                    title="Bônus Financeiro para recuperar moral"
                  >
                    +Bônus (R$ 200)
                  </button>

                  <button
                    onClick={() => {
                      if (confirm(`Deseja demitir ${emp.name}?`)) {
                        onFireEmployee(emp.id);
                      }
                    }}
                    className="p-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-700/60 text-rose-400 rounded-lg cursor-pointer"
                    title="Demitir funcionário"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
