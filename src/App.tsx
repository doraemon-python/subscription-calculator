import { useState } from "react";
import { useFormField } from "./hooks";

type Subscription = {
  name: string;
  price: number;
  period: "month" | "year";
};

const App = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [disabledIndexes, setDisabledIndexes] = useState<number[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<"day" | "month" | "year">(
    "month"
  );

  const [name, onNameChange, setName] = useFormField("");
  const [price, onPriceChange, setPrice] = useFormField("");
  const [period, onPeriodChange, setPeriod] = useFormField<"month" | "year">(
    "month"
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscriptions([
      ...subscriptions,
      {
        name,
        price: Number(price),
        period,
      },
    ]);
    setName("");
    setPrice("");
    setPeriod("month");
  };

  const deleteSubscription = (index: number) => {
    setSubscriptions(subscriptions.filter((_, i) => i !== index));
  };

  const toggleSubscription = (index: number) => {
    if (disabledIndexes.includes(index)) {
      setDisabledIndexes(disabledIndexes.filter((i) => i !== index));
    } else {
      setDisabledIndexes([...disabledIndexes, index]);
    }
  };

  const getTotalPrice = () => {
    // まずは年額を求める
    const yearlyPrice = subscriptions.reduce((acc, sub, index) => {
      if (disabledIndexes.includes(index)) {
        return acc;
      }
      if (sub.period === "year") {
        return acc + sub.price;
      }
      return acc + sub.price * 12;
    }, 0);
    // currentPeriod によって割り算の単位を変える
    switch (currentPeriod) {
      case "day":
        return Math.round((yearlyPrice / 365) * 100) / 100;
      case "month":
        return Math.round(yearlyPrice / 12);
      case "year":
        return yearlyPrice;
    }
  };

  return (
    <main className="p-4 max-w-xl mx-auto flex flex-col gap-4">
      <h1 className="text-3xl font-bold text-center py-4">
        サブスク計算アプリ
      </h1>
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 mb-2 flex-wrap">
          <label className="flex flex-col grow">
            <span className="text-sm">サブスク名</span>
            <input
              type="text"
              placeholder="YouTube Premium"
              value={name}
              onChange={onNameChange}
              required
            />
          </label>
          <label className="flex flex-col">
            <span className="text-sm">金額</span>
            <input
              type="number"
              placeholder="980"
              value={price}
              onChange={onPriceChange}
              required
            />
          </label>
          <label className="flex flex-col grow">
            <span className="text-sm">期間</span>
            <select value={period} onChange={onPeriodChange}>
              <option value="month">月額</option>
              <option value="year">年額</option>
            </select>
          </label>
        </div>
        <button className="py-2 w-full rounded-xl bg-emerald-500 text-white font-bold">
          登録
        </button>
      </form>
      <ul>
        {subscriptions.map((sub, index) => (
          <li
            key={index}
            className="flex items-center gap-4 p-2 border-b first:border-t"
          >
            <button
              onClick={() => toggleSubscription(index)}
              className={`size-6 p-1 ${
                disabledIndexes.includes(index)
                  ? "border"
                  : "text-white bg-emerald-500"
              } rounded`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            </button>
            <span
              className={`font-bold ${
                disabledIndexes.includes(index) && "opacity-50"
              }`}
            >
              {sub.name}
            </span>
            <span
              className={`ml-auto ${
                disabledIndexes.includes(index) && "opacity-50"
              }`}
            >
              {sub.price}円
            </span>
            <span
              className={`${disabledIndexes.includes(index) && "opacity-50"}`}
            >
              {sub.period === "month" ? "月額" : "年額"}
            </span>
            <button
              onClick={() => deleteSubscription(index)}
              title="削除"
              className="size-6 text-red-500"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-full"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>
      <div className="grid grid-cols-3 p-1 rounded bg-black/10 dark:bg-white/20">
        <button
          onClick={() => setCurrentPeriod("day")}
          className={`${
            currentPeriod === "day" && "bg-white dark:bg-white/20 py-1 rounded"
          }`}
        >
          日割り
        </button>
        <button
          onClick={() => setCurrentPeriod("month")}
          className={`${
            currentPeriod === "month" &&
            "bg-white dark:bg-white/20 py-1 rounded"
          }`}
        >
          月割り
        </button>
        <button
          onClick={() => setCurrentPeriod("year")}
          className={`${
            currentPeriod === "year" && "bg-white dark:bg-white/20 py-1 rounded"
          }`}
        >
          年割り
        </button>
      </div>
      <p className="flex gap-2 items-baseline justify-center">
        <span className="text-3xl font-bold">{getTotalPrice()}円</span>
        <span className="text-3xl opacity-50">/</span>
        <span className="opacity-50">
          {currentPeriod === "day"
            ? "日"
            : currentPeriod === "month"
            ? "月"
            : "年"}
        </span>
      </p>
    </main>
  );
};

export default App;
