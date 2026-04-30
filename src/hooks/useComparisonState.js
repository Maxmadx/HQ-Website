import { useSearchParams } from 'react-router-dom';
import { useCallback, useMemo } from 'react';

const MAX_SELECTED = 3;

export function parseNumberOrNull(v) {
  if (v === null || v === undefined || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) && n > 0 ? n : null;
}

export function parseModels(raw) {
  if (!raw) return [];
  return raw.split(',').map((s) => s.trim()).filter(Boolean);
}

export function useComparisonState() {
  const [params, setParams] = useSearchParams();

  const selectedIds = useMemo(() => parseModels(params.get('models')), [params]);

  const hours = parseNumberOrNull(params.get('hours'));
  const years = parseNumberOrNull(params.get('years'));

  const update = useCallback(
    (mutator) => {
      setParams((prev) => {
        const next = new URLSearchParams(prev);
        mutator(next);
        return next;
      });
    },
    [setParams],
  );

  const addModel = useCallback(
    (id) => {
      if (!id) return;
      if (selectedIds.includes(id)) return;
      if (selectedIds.length >= MAX_SELECTED) return;
      const next = [...selectedIds, id];
      update((p) => p.set('models', next.join(',')));
    },
    [selectedIds, update],
  );

  const removeModel = useCallback(
    (id) => {
      const next = selectedIds.filter((x) => x !== id);
      update((p) => {
        if (next.length === 0) p.delete('models');
        else p.set('models', next.join(','));
      });
    },
    [selectedIds, update],
  );

  const clearAll = useCallback(() => {
    update((p) => p.delete('models'));
  }, [update]);

  const setHours = useCallback(
    (h) => {
      update((p) => {
        if (h == null) p.delete('hours');
        else p.set('hours', String(h));
      });
    },
    [update],
  );

  const setYears = useCallback(
    (y) => {
      update((p) => {
        if (y == null) p.delete('years');
        else p.set('years', String(y));
      });
    },
    [update],
  );

  return { selectedIds, hours, years, addModel, removeModel, clearAll, setHours, setYears, MAX_SELECTED };
}
