'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type Todo = {
  id: string;
  text: string;
  createdAt: number;
};

const seedTodos: Todo[] = [
  { id: 'welcome', text: 'Plan the day with intention', createdAt: Date.now() - 50000 },
  { id: 'deep-work', text: 'Do one deep work block', createdAt: Date.now() - 40000 },
  { id: 'celebrate', text: 'Celebrate a small win', createdAt: Date.now() - 30000 },
];

const storageKey = 'vibe-todo-items';

export default function HomePage() {
  const [items, setItems] = useState<Todo[]>([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const cached = window.localStorage.getItem(storageKey);
    if (cached) {
      try {
        const parsed = JSON.parse(cached) as Todo[];
        setItems(parsed);
        return;
      } catch (error) {
        console.warn('Unable to read cached todos', error);
      }
    }
    setItems(seedTodos);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [items]);

  const remainingCount = useMemo(() => items.length, [items]);

  const addItem = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    const next: Todo = {
      id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
      text: trimmed,
      createdAt: Date.now(),
    };
    setItems((prev) => [next, ...prev]);
    setText('');
  };

  const deleteItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className="page">
      <div className="ambient ambient-top" />
      <div className="ambient ambient-bottom" />

      <section className="hero">
        <p className="eyebrow">Focus Toolkit</p>
        <h1>Minimal to-do list with bold energy.</h1>
        <p className="lede">
          Capture what matters, clear what doesn&apos;t. Add tasks fast, delete with intent, and keep the vibe light.
        </p>
      </section>

      <section className="panel">
        <header className="panel__header">
          <div>
            <p className="tag">Today</p>
            <h2>Momentum List</h2>
            <p className="muted">{remainingCount} item{remainingCount === 1 ? '' : 's'}</p>
          </div>
          <div className="pill">Lightning-fast add &amp; delete</div>
        </header>

        <form className="composer" onSubmit={addItem}>
          <input
            type="text"
            placeholder="Add a crisp task..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            aria-label="New to-do"
          />
          <button type="submit">Add</button>
        </form>

        <ul className="list" aria-live="polite">
          {items.length === 0 && (
            <li className="empty">All clear. Add what&apos;s next.</li>
          )}
          {items.map((item) => (
            <li key={item.id} className="card">
              <div>
                <p className="muted">{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p className="card__text">{item.text}</p>
              </div>
              <button className="ghost" onClick={() => deleteItem(item.id)} aria-label={`Delete ${item.text}`}>
                Delete
              </button>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
