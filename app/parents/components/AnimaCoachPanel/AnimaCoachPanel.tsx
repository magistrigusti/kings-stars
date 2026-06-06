'use client';

import { FormEvent, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  IoPersonCircleOutline,
  IoSendOutline,
  IoSparklesOutline,
  IoTrashOutline,
} from 'react-icons/io5';
import { PARENTS_LOCALE } from '../../parentsContent';
import {
  animaCoachPrompts,
  animaCoachText,
} from './animaCoachContent';
import {
  clearAnimaHistory,
  fetchAnimaHistory,
  sendAnimaMessage,
  type AnimaHistoryResponse,
} from './animaCoachApi';
import s from './AnimaCoachPanel.module.scss';

const ANIMA_HISTORY_QUERY_KEY = ['parents', 'anima', 'history'] as const;

export default function AnimaCoachPanel() {
  const queryClient = useQueryClient();
  const [draft, setDraft] = useState('');

  const historyQuery = useQuery({
    queryKey: ANIMA_HISTORY_QUERY_KEY,
    queryFn: fetchAnimaHistory,
    placeholderData: {
      history: [],
    },
  });

  const sendMutation = useMutation({
    mutationFn: sendAnimaMessage,
    onSuccess: data => {
      queryClient.setQueryData<AnimaHistoryResponse>(
        ANIMA_HISTORY_QUERY_KEY,
        { history: data.history },
      );
    },
  });

  const clearMutation = useMutation({
    mutationFn: clearAnimaHistory,
    onSuccess: data => {
      queryClient.setQueryData<AnimaHistoryResponse>(
        ANIMA_HISTORY_QUERY_KEY,
        { history: data.history },
      );
    },
  });

  const messages = historyQuery.data?.history ?? [];
  const errorText = useMemo(() => {
    const error = sendMutation.error ?? historyQuery.error ?? clearMutation.error;

    return error instanceof Error
      ? error.message
      : animaCoachText.fallbackError[PARENTS_LOCALE];
  }, [clearMutation.error, historyQuery.error, sendMutation.error]);
  const isBusy = sendMutation.isPending || clearMutation.isPending;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const cleanDraft = draft.trim();

    if (!cleanDraft || isBusy) {
      return;
    }

    setDraft('');
    sendMutation.mutate(cleanDraft);
  };

  return (
    <section className={s.anima} aria-labelledby="parents-anima-title">
      <header className={s.header}>
        <div>
          <h2 id="parents-anima-title">{animaCoachText.title[PARENTS_LOCALE]}</h2>
          <p>{animaCoachText.subtitle[PARENTS_LOCALE]}</p>
        </div>

        <div className={s.status}>
          <span className={isBusy ? s.statusPulse : ''} />
          {isBusy
            ? animaCoachText.statusThinking[PARENTS_LOCALE]
            : animaCoachText.statusReady[PARENTS_LOCALE]}
        </div>
      </header>

      <div className={s.shell}>
        <aside className={s.avatarPanel} aria-label="Anima">
          <motion.div
            className={s.animaFigure}
            animate={{
              y: [0, -6, 0],
              scale: [1, 1.025, 1],
            }}
            transition={{
              duration: 4.2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className={s.figureRing} />
            <span className={s.figureGlow} />
            <IoSparklesOutline className={s.figureIcon} aria-hidden="true" />
          </motion.div>

          <div className={s.promptList}>
            {animaCoachPrompts.map(prompt => (
              <button
                key={prompt[PARENTS_LOCALE]}
                type="button"
                onClick={() => setDraft(prompt[PARENTS_LOCALE])}
              >
                {prompt[PARENTS_LOCALE]}
              </button>
            ))}
          </div>
        </aside>

        <div className={s.chatPanel}>
          <div className={s.messages} aria-live="polite">
            {historyQuery.isPending ? (
              <div className={s.emptyState}>
                <strong>{animaCoachText.loadingHistory[PARENTS_LOCALE]}</strong>
              </div>
            ) : null}

            {!historyQuery.isPending && messages.length === 0 ? (
              <div className={s.emptyState}>
                <strong>{animaCoachText.emptyTitle[PARENTS_LOCALE]}</strong>
                <p>{animaCoachText.emptyText[PARENTS_LOCALE]}</p>
              </div>
            ) : null}

            {messages.map(message => {
              const isAssistant = message.role === 'assistant';

              return (
                <article
                  key={message.id}
                  className={`${s.message} ${isAssistant ? s.messageAssistant : s.messageUser}`}
                >
                  <div className={s.messageAuthor}>
                    {isAssistant ? (
                      <IoSparklesOutline aria-hidden="true" />
                    ) : (
                      <IoPersonCircleOutline aria-hidden="true" />
                    )}
                    <span>
                      {isAssistant
                        ? animaCoachText.assistantLabel[PARENTS_LOCALE]
                        : animaCoachText.userLabel[PARENTS_LOCALE]}
                    </span>
                  </div>
                  <p>{message.content}</p>
                </article>
              );
            })}

            {sendMutation.isPending ? (
              <article className={`${s.message} ${s.messageAssistant} ${s.pendingMessage}`}>
                <div className={s.messageAuthor}>
                  <IoSparklesOutline aria-hidden="true" />
                  <span>{animaCoachText.assistantLabel[PARENTS_LOCALE]}</span>
                </div>
                <p>{animaCoachText.statusThinking[PARENTS_LOCALE]}...</p>
              </article>
            ) : null}
          </div>

          {sendMutation.isError || historyQuery.isError || clearMutation.isError ? (
            <p className={s.errorText}>{errorText}</p>
          ) : null}

          <form className={s.form} onSubmit={handleSubmit}>
            <label>
              <span>{animaCoachText.inputLabel[PARENTS_LOCALE]}</span>
              <textarea
                value={draft}
                onChange={event => setDraft(event.currentTarget.value)}
                placeholder={animaCoachText.inputPlaceholder[PARENTS_LOCALE]}
                rows={3}
                maxLength={2000}
              />
            </label>

            <div className={s.formActions}>
              <button
                type="button"
                className={s.clearButton}
                onClick={() => clearMutation.mutate()}
                disabled={clearMutation.isPending || messages.length === 0}
              >
                <IoTrashOutline aria-hidden="true" />
                {animaCoachText.clearButton[PARENTS_LOCALE]}
              </button>

              <button
                type="submit"
                className={s.sendButton}
                disabled={!draft.trim() || isBusy}
              >
                <IoSendOutline aria-hidden="true" />
                {animaCoachText.sendButton[PARENTS_LOCALE]}
              </button>
            </div>
          </form>

          <p className={s.privacyNote}>{animaCoachText.privacyNote[PARENTS_LOCALE]}</p>
        </div>
      </div>
    </section>
  );
}
