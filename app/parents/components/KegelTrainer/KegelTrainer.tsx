'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  IoBarChartOutline,
  IoAddOutline,
  IoChevronBackOutline,
  IoInformationCircleOutline,
  IoPulseOutline,
  IoRemoveOutline,
  IoSettingsOutline,
} from 'react-icons/io5';
import { PARENTS_LOCALE } from '../../parentsContent';
import { kegelText } from './kegelContent';
import {
  buildKegelSessionPhases,
  formatKegelDuration,
  getAllKegelLevelPlans,
  getKegelLevelPlan,
  KEGEL_MAX_LEVEL,
  KEGEL_MIN_LEVEL,
  type KegelLevelPlan,
  type KegelSessionPhase,
} from './kegelProgram';
import s from './KegelTrainer.module.scss';

type KegelTab = 'training' | 'stats';

interface KegelTrainingRecord {
  id: string;
  date: string;
  level: number;
  totalSeconds: number;
}

interface KegelStoredStats {
  completedSessions: number;
  totalSeconds: number;
  bestLevel: number;
  records: KegelTrainingRecord[];
}

interface ActiveKegelSession {
  level: number;
  phases: KegelSessionPhase[];
  phaseIndex: number;
  secondsLeft: number;
  totalSeconds: number;
  isPaused: boolean;
}

interface CompletedSessionDraft {
  level: number;
  totalSeconds: number;
}

const KEGEL_STATS_STORAGE_KEY = 'parents-kegel-stats';

const DEFAULT_KEGEL_STATS: KegelStoredStats = {
  completedSessions: 0,
  totalSeconds: 0,
  bestLevel: 0,
  records: [],
};

function readKegelStats(): KegelStoredStats {
  if (typeof window === 'undefined') {
    return DEFAULT_KEGEL_STATS;
  }

  try {
    const rawValue = window.localStorage.getItem(KEGEL_STATS_STORAGE_KEY);

    if (!rawValue) {
      return DEFAULT_KEGEL_STATS;
    }

    const parsedValue = JSON.parse(rawValue) as Partial<KegelStoredStats>;

    return {
      completedSessions: parsedValue.completedSessions ?? 0,
      totalSeconds: parsedValue.totalSeconds ?? 0,
      bestLevel: parsedValue.bestLevel ?? 0,
      records: Array.isArray(parsedValue.records) ? parsedValue.records.slice(0, 30) : [],
    };
  } catch {
    return DEFAULT_KEGEL_STATS;
  }
}

function formatClock(totalSeconds: number) {
  const cleanSeconds = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(cleanSeconds / 60).toString().padStart(2, '0');
  const seconds = (cleanSeconds % 60).toString().padStart(2, '0');

  return `${minutes}:${seconds}`;
}

function getPhaseView(phase: KegelSessionPhase, secondsLeft: number) {
  if (phase.kind === 'prepare') {
    return {
      title: kegelText.prepareLabel[PARENTS_LOCALE],
      text: '',
      label: kegelText.prepareLabel[PARENTS_LOCALE],
      isWork: false,
    };
  }

  if (phase.kind === 'classicHold') {
    return {
      title: phase.title,
      text: kegelText.contractLabel[PARENTS_LOCALE],
      label: kegelText.contractLabel[PARENTS_LOCALE],
      isWork: true,
    };
  }

  if (phase.kind === 'pulse') {
    const elapsedSeconds = phase.durationSeconds - secondsLeft;
    const isWork = elapsedSeconds % 2 === 0;

    return {
      title: phase.title,
      text: kegelText.pulseTitle[PARENTS_LOCALE],
      label: isWork
        ? kegelText.contractLabel[PARENTS_LOCALE]
        : kegelText.releaseLabel[PARENTS_LOCALE],
      isWork,
    };
  }

  if (phase.kind === 'recovery') {
    return {
      title: kegelText.recoveryLabel[PARENTS_LOCALE],
      text: '',
      label: kegelText.releaseLabel[PARENTS_LOCALE],
      isWork: false,
    };
  }

  return {
    title: phase.title,
    text: '',
    label: kegelText.releaseLabel[PARENTS_LOCALE],
    isWork: false,
  };
}

function getPhaseDescription(phase: KegelSessionPhase, plan: KegelLevelPlan) {
  if (phase.kind === 'classicHold' || phase.kind === 'classicRest') {
    return `Сожмите на ${plan.classicHoldSeconds} сек, затем расслабьтесь на ${plan.classicRestSeconds} сек. Повтор ${phase.repetition ?? 1} из ${plan.classicRepeats}.`;
  }

  if (phase.kind === 'pulse') {
    return `Быстро сжимайте и расслабляйте мышцы. Подход ${phase.set ?? 1} из ${plan.pulseSets}.`;
  }

  if (phase.kind === 'pulseRest') {
    return `Отдых ${plan.pulseRestSeconds} сек перед следующим подходом.`;
  }

  return '';
}

function getRemainingSessionSeconds(session: ActiveKegelSession) {
  const elapsedBeforeCurrentPhase = session.phases
    .slice(0, session.phaseIndex)
    .reduce((sum, phase) => sum + phase.durationSeconds, 0);
  const currentPhase = session.phases[session.phaseIndex];
  const elapsedInsideCurrentPhase = currentPhase.durationSeconds - session.secondsLeft;

  return session.totalSeconds - elapsedBeforeCurrentPhase - elapsedInsideCurrentPhase;
}

export default function KegelTrainer() {
  const [activeTab, setActiveTab] = useState<KegelTab>('training');
  const [selectedLevel, setSelectedLevel] = useState(KEGEL_MIN_LEVEL);
  const [stats, setStats] = useState<KegelStoredStats>(readKegelStats);
  const [activeSession, setActiveSession] = useState<ActiveKegelSession | null>(null);
  const completedSessionRef = useRef<CompletedSessionDraft | null>(null);
  const plan = useMemo(() => getKegelLevelPlan(selectedLevel), [selectedLevel]);
  const levelPlans = useMemo(() => getAllKegelLevelPlans(), []);
  const maxPlanSeconds = levelPlans[levelPlans.length - 1]?.totalSeconds ?? plan.totalSeconds;
  const isTimerActive = Boolean(activeSession && !activeSession.isPaused);
  const activePhase = activeSession?.phases[activeSession.phaseIndex] ?? null;
  const phaseView = activePhase ? getPhaseView(activePhase, activeSession?.secondsLeft ?? 0) : null;
  const phaseDescription = activePhase ? getPhaseDescription(activePhase, plan) : '';
  const phaseProgress = activePhase && activeSession
    ? ((activePhase.durationSeconds - activeSession.secondsLeft) / activePhase.durationSeconds) * 100
    : 0;
  const circleStyle = {
    '--kegel-progress': `${Math.max(0, Math.min(100, phaseProgress))}%`,
  } as CSSProperties;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    window.localStorage.setItem(KEGEL_STATS_STORAGE_KEY, JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    if (!isTimerActive) {
      return;
    }

    const timerId = window.setInterval(() => {
      setActiveSession(currentSession => {
        if (!currentSession || currentSession.isPaused) {
          return currentSession;
        }

        if (currentSession.secondsLeft > 1) {
          return {
            ...currentSession,
            secondsLeft: currentSession.secondsLeft - 1,
          };
        }

        const nextPhaseIndex = currentSession.phaseIndex + 1;

        if (nextPhaseIndex >= currentSession.phases.length) {
          completedSessionRef.current = {
            level: currentSession.level,
            totalSeconds: currentSession.totalSeconds,
          };

          return null;
        }

        return {
          ...currentSession,
          phaseIndex: nextPhaseIndex,
          secondsLeft: currentSession.phases[nextPhaseIndex].durationSeconds,
        };
      });
    }, 1000);

    return () => window.clearInterval(timerId);
  }, [isTimerActive]);

  useEffect(() => {
    if (activeSession || !completedSessionRef.current) {
      return;
    }

    const completedSession = completedSessionRef.current;
    completedSessionRef.current = null;

    setStats(currentStats => {
      const nextRecord: KegelTrainingRecord = {
        id: `${Date.now()}-${completedSession.level}`,
        date: new Date().toISOString(),
        level: completedSession.level,
        totalSeconds: completedSession.totalSeconds,
      };

      return {
        completedSessions: currentStats.completedSessions + 1,
        totalSeconds: currentStats.totalSeconds + completedSession.totalSeconds,
        bestLevel: Math.max(currentStats.bestLevel, completedSession.level),
        records: [nextRecord, ...currentStats.records].slice(0, 30),
      };
    });
  }, [activeSession]);

  const handleLevelChange = (nextLevel: number) => {
    if (activeSession) {
      return;
    }

    setSelectedLevel(Math.min(KEGEL_MAX_LEVEL, Math.max(KEGEL_MIN_LEVEL, nextLevel)));
  };

  const handleStart = () => {
    const phases = buildKegelSessionPhases(plan);

    setActiveSession({
      level: plan.level,
      phases,
      phaseIndex: 0,
      secondsLeft: phases[0].durationSeconds,
      totalSeconds: plan.totalSeconds,
      isPaused: false,
    });
  };

  const handlePauseToggle = () => {
    setActiveSession(currentSession => (
      currentSession
        ? {
          ...currentSession,
          isPaused: !currentSession.isPaused,
        }
        : currentSession
    ));
  };

  const handleExit = () => {
    completedSessionRef.current = null;
    setActiveSession(null);
  };

  return (
    <section className={s.kegel} aria-labelledby="kegel-title">
      <header className={s.topbar}>
        <h2 id="kegel-title">{kegelText.title[PARENTS_LOCALE]}</h2>
        <div className={s.topActions} aria-hidden="true">
          <IoInformationCircleOutline />
          <IoSettingsOutline />
        </div>
      </header>

      <div className={s.modeTabs} role="tablist" aria-label="Разделы тренажёра Кегеля">
        <button
          type="button"
          className={`${s.modeTab} ${activeTab === 'training' ? s.modeTabActive : ''}`}
          onClick={() => setActiveTab('training')}
          role="tab"
          aria-selected={activeTab === 'training'}
        >
          <IoPulseOutline aria-hidden="true" />
          {kegelText.trainingTab[PARENTS_LOCALE]}
        </button>
        <button
          type="button"
          className={`${s.modeTab} ${activeTab === 'stats' ? s.modeTabActive : ''}`}
          onClick={() => setActiveTab('stats')}
          role="tab"
          aria-selected={activeTab === 'stats'}
        >
          <IoBarChartOutline aria-hidden="true" />
          {kegelText.statsTab[PARENTS_LOCALE]}
        </button>
      </div>

      {activeTab === 'training' ? (
        <div className={s.trainingPanel} role="tabpanel">
          {!activeSession ? (
            <article className={s.todayCard}>
              <div className={s.cardHeader}>
                <div>
                  <h3>{kegelText.todayTitle[PARENTS_LOCALE]}</h3>
                  <p>
                    {kegelText.levelLabel[PARENTS_LOCALE]} {plan.level} / {KEGEL_MAX_LEVEL}
                  </p>
                </div>
                <strong>{formatKegelDuration(plan.totalSeconds)}</strong>
              </div>

              <div className={s.levelControl}>
                <button
                  type="button"
                  onClick={() => handleLevelChange(selectedLevel - 1)}
                  disabled={selectedLevel <= KEGEL_MIN_LEVEL}
                  aria-label="Уменьшить уровень тренировки"
                >
                  <IoRemoveOutline />
                </button>
                <input
                  type="range"
                  min={KEGEL_MIN_LEVEL}
                  max={KEGEL_MAX_LEVEL}
                  value={selectedLevel}
                  onChange={event => handleLevelChange(Number(event.currentTarget.value))}
                  aria-label="Уровень тренировки Кегеля"
                />
                <button
                  type="button"
                  onClick={() => handleLevelChange(selectedLevel + 1)}
                  disabled={selectedLevel >= KEGEL_MAX_LEVEL}
                  aria-label="Увеличить уровень тренировки"
                >
                  <IoAddOutline />
                </button>
              </div>

              <ul className={s.planList}>
                <li>
                  <span />
                  <div>
                    <strong>{kegelText.classicTitle[PARENTS_LOCALE]}</strong>
                    <p>
                      {plan.classicHoldSeconds} сек x {plan.classicRestSeconds} сек,{' '}
                      {plan.classicRepeats} раз
                    </p>
                  </div>
                </li>
                <li>
                  <span />
                  <div>
                    <strong>{kegelText.pulseTitle[PARENTS_LOCALE]}</strong>
                    <p>
                      быстрый темп: {plan.pulseSetSeconds} сек x {plan.pulseSets} подхода
                    </p>
                  </div>
                </li>
              </ul>

              <button type="button" className={s.startButton} onClick={handleStart}>
                {kegelText.startButton[PARENTS_LOCALE]}
              </button>

              <details className={s.guide}>
                <summary>{kegelText.guideTitle[PARENTS_LOCALE]}</summary>
                <p>{kegelText.guideText[PARENTS_LOCALE]}</p>
              </details>
            </article>
          ) : (
            <article className={s.sessionCard}>
              <div className={s.sessionHeader}>
                <button type="button" onClick={handleExit} aria-label="Выйти из тренировки">
                  <IoChevronBackOutline />
                </button>
                <strong>{kegelText.title[PARENTS_LOCALE]}</strong>
                <span>{formatClock(getRemainingSessionSeconds(activeSession))}</span>
              </div>

              {activePhase && phaseView ? (
                <div className={s.sessionBody}>
                  <div className={s.phaseText}>
                    <h3>{phaseView.title}</h3>
                    {phaseDescription ? <p>{phaseDescription}</p> : null}
                  </div>

                  <div
                    className={`${s.timerRing} ${phaseView.isWork ? s.timerRingWork : ''}`}
                    style={circleStyle}
                    aria-label={`${phaseView.label}: ${activeSession.secondsLeft} секунд`}
                  >
                    <div>
                      <strong>{activeSession.secondsLeft}</strong>
                      <span>{phaseView.label}</span>
                    </div>
                  </div>

                  <div className={s.sessionActions}>
                    <button type="button" className={s.exitButton} onClick={handleExit}>
                      {kegelText.exitButton[PARENTS_LOCALE]}
                    </button>
                    <button type="button" className={s.pauseButton} onClick={handlePauseToggle}>
                      {activeSession.isPaused
                        ? kegelText.resumeButton[PARENTS_LOCALE]
                        : kegelText.pauseButton[PARENTS_LOCALE]}
                    </button>
                  </div>
                </div>
              ) : null}
            </article>
          )}
        </div>
      ) : (
        <div className={s.statsPanel} role="tabpanel">
          <div className={s.statsGrid}>
            <article>
              <span>{kegelText.completedSessions[PARENTS_LOCALE]}</span>
              <strong>{stats.completedSessions}</strong>
            </article>
            <article>
              <span>{kegelText.totalTime[PARENTS_LOCALE]}</span>
              <strong>{formatKegelDuration(stats.totalSeconds)}</strong>
            </article>
            <article>
              <span>{kegelText.bestLevel[PARENTS_LOCALE]}</span>
              <strong>{stats.bestLevel || '-'}</strong>
            </article>
          </div>

          <article className={s.chartCard}>
            <h3>{kegelText.loadByLevels[PARENTS_LOCALE]}</h3>
            <div className={s.levelChart} aria-label="Математика нагрузки по 50 уровням">
              {levelPlans.map(levelPlan => {
                const barStyle = {
                  '--bar-height': `${(levelPlan.totalSeconds / maxPlanSeconds) * 100}%`,
                } as CSSProperties;

                return (
                  <button
                    key={levelPlan.level}
                    type="button"
                    className={`${s.levelBar} ${
                      levelPlan.level === selectedLevel ? s.levelBarActive : ''
                    }`}
                    style={barStyle}
                    onClick={() => handleLevelChange(levelPlan.level)}
                    aria-label={`Уровень ${levelPlan.level}: ${formatKegelDuration(levelPlan.totalSeconds)}`}
                  >
                    <span />
                    <small>{levelPlan.level}</small>
                  </button>
                );
              })}
            </div>
          </article>

          <article className={s.historyCard}>
            <h3>{kegelText.historyTitle[PARENTS_LOCALE]}</h3>
            {stats.records.length > 0 ? (
              <ul>
                {stats.records.slice(0, 5).map(record => (
                  <li key={record.id}>
                    <span>{new Date(record.date).toLocaleDateString('ru-RU')}</span>
                    <strong>
                      {kegelText.levelLabel[PARENTS_LOCALE]} {record.level}
                    </strong>
                    <small>{formatKegelDuration(record.totalSeconds)}</small>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{kegelText.emptyHistory[PARENTS_LOCALE]}</p>
            )}
          </article>
        </div>
      )}
    </section>
  );
}
