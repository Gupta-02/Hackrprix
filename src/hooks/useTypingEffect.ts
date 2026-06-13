import { useState, useEffect } from 'react';

export function useTypingEffect(sentences: string[], speed = 60, pause = 2000) {
  const [displayed, setDisplayed] = useState('');
  const [sentIdx, setSentIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!sentences.length) return;
    const current = sentences[sentIdx];

    if (!deleting && charIdx < current.length) {
      const t = setTimeout(() => setCharIdx(c => c + 1), speed);
      return () => clearTimeout(t);
    }
    if (!deleting && charIdx === current.length) {
      const t = setTimeout(() => setDeleting(true), pause);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx > 0) {
      const t = setTimeout(() => setCharIdx(c => c - 1), speed / 2);
      return () => clearTimeout(t);
    }
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setSentIdx(i => (i + 1) % sentences.length);
    }
  }, [charIdx, deleting, sentIdx, sentences, speed, pause]);

  useEffect(() => {
    setDisplayed(sentences[sentIdx]?.slice(0, charIdx) ?? '');
  }, [charIdx, sentIdx, sentences]);

  return displayed;
}
