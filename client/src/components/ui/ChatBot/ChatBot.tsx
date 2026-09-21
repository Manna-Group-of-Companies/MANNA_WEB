import { useEffect, useId, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { fallback, greeting, matchIntent, suggestedPrompts } from '@/data/chatbot';
import styles from './ChatBot.module.css';

interface Message {
  id: string;
  from: 'bot' | 'user';
  text: string;
  followUps?: string[];
}

let nextId = 0;
function makeId() {
  nextId += 1;
  return `msg-${nextId}`;
}

function reply(text: string): Message {
  const intent = matchIntent(text);
  return {
    id: makeId(),
    from: 'bot',
    text: intent?.reply ?? fallback,
    followUps: intent?.followUps,
  };
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: makeId(), from: 'bot', text: greeting },
  ]);
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages((prev) => [...prev, { id: makeId(), from: 'user', text: trimmed }, reply(trimmed)]);
    setDraft('');
  }

  return (
    <div className={styles.root}>
      {open && (
        <button
          type="button"
          className={styles.backdrop}
          onClick={() => setOpen(false)}
          aria-label="Close chat"
        />
      )}

      <div
        className={cn(styles.panel, open && styles.panelOpen)}
        id={panelId}
        role="dialog"
        aria-label="Chat with us"
        aria-hidden={!open}
      >
        <div className={styles.header}>
          <span className={styles.title}>Manna Rubber assistant</span>
          <button
            type="button"
            className={styles.close}
            onClick={() => setOpen(false)}
            aria-label="Close chat"
          >
            ×
          </button>
        </div>

          <div className={styles.list} ref={listRef}>
            {messages.map((message) => (
              <div key={message.id} className={cn(styles.row, styles[message.from])}>
                <p className={styles.bubble}>{message.text}</p>
                {message.followUps && (
                  <div className={styles.chips}>
                    {message.followUps.map((prompt) => (
                      <button
                        key={prompt}
                        type="button"
                        className={styles.chip}
                        onClick={() => send(prompt)}
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {messages.length === 1 && (
              <div className={styles.chips}>
                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    className={styles.chip}
                    onClick={() => send(prompt)}
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form
            className={styles.form}
            onSubmit={(event) => {
              event.preventDefault();
              send(draft);
            }}
          >
            <input
              className={styles.input}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask a question…"
              aria-label="Type your message"
            />
            <button type="submit" className={styles.send} disabled={!draft.trim()}>
              Send
            </button>
          </form>
      </div>

      <button
        type="button"
        className={styles.toggle}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? 'Close chat' : 'Open chat'}
      >
        <span className={styles.toggleIcon} aria-hidden="true">
          {open ? '×' : '◎'}
        </span>
      </button>
    </div>
  );
}
