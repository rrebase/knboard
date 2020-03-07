import React from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./Counter.module.scss";
import { increment, decrement } from "./CounterSlice";
import { fetchInitialValue } from "./CounterActions";
import { RootState } from "store";

const Counter: React.FC = () => {
  const count = useSelector((state: RootState) => state.counter.value);
  const loading = useSelector((state: RootState) => state.counter.loading);
  const error = useSelector((state: RootState) => state.counter.error);
  const dispatch = useDispatch();

  return (
    <div>
      {error && <p>{error}</p>}

      {loading ? (
        <p className={styles.loading} data-testid="counter-loading">
          Loading...
        </p>
      ) : (
        <p className={styles.value} data-testid="counter-value">
          {count}
        </p>
      )}

      <div>
        <button
          className={styles.button}
          aria-label="Increment value"
          onClick={() => dispatch(increment())}
          disabled={loading}
        >
          Increment
        </button>
        <button
          className={styles.button}
          aria-label="Decrement value"
          onClick={() => dispatch(decrement())}
          disabled={loading}
        >
          Decrement
        </button>
      </div>
      <button
        className={styles.button}
        aria-label="Slow fetch"
        onClick={() => dispatch(fetchInitialValue())}
        disabled={loading}
      >
        Slow fetch
      </button>
    </div>
  );
};

export default Counter;
