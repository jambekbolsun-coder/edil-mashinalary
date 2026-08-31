"use client";

import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/content";

export function FinanceCalculator({ initialPrice = 2_068_000 }: { initialPrice?: number }) {
  const [price, setPrice] = useState(initialPrice);
  const [depositPercent, setDepositPercent] = useState(55);
  const [months, setMonths] = useState(12);

  const result = useMemo(() => {
    const deposit = Math.round((price * depositPercent) / 100);
    const balance = price - deposit;
    return { deposit, balance, monthly: Math.ceil(balance / months) };
  }, [depositPercent, months, price]);

  return (
    <div className="finance-calculator">
      <div className="calculator-fields">
        <label>
          <span>Стоимость техники</span>
          <input type="range" min="1200000" max="5000000" step="10000" value={price} onChange={(event) => setPrice(Number(event.target.value))} />
          <strong>{formatPrice(price)}</strong>
        </label>
        <label>
          <span>Первый взнос</span>
          <input type="range" min="50" max="80" step="1" value={depositPercent} onChange={(event) => setDepositPercent(Number(event.target.value))} />
          <strong>{depositPercent}%</strong>
        </label>
        <label>
          <span>Срок</span>
          <input type="range" min="3" max="12" step="1" value={months} onChange={(event) => setMonths(Number(event.target.value))} />
          <strong>{months} мес.</strong>
        </label>
      </div>
      <dl className="calculator-result">
        <div><dt>Первый взнос</dt><dd>{formatPrice(result.deposit)}</dd></div>
        <div><dt>Остаток</dt><dd>{formatPrice(result.balance)}</dd></div>
        <div className="primary"><dt>Платёж в месяц</dt><dd>≈ {formatPrice(result.monthly)}</dd></div>
      </dl>
      <p className="calculator-note">Расчёт ориентировочный. Точные условия фиксируются в договоре после выбора модели.</p>
    </div>
  );
}
