import { useEffect, useRef, useState } from 'react';

function useTimeoutEffect({ effect, dependencies, timeout, errorMSG }) {
  const [result, setResult] = useState({ timeout: false, errorMSG: '' });
  const startTimeRef = useRef(null);
  const timeoutRef = useRef(null);

  useEffect(() => {
    // 첫 번째 실행에서만 타이머 시작
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
      timeoutRef.current = setTimeout(() => {
        setResult({ timeout: true, error: new Error(errorMSG) });
      }, timeout);
    }

    const runEffect = async () => {
      try {
        await effect();

        const elapsedTime = Date.now() - startTimeRef.current;

        if (elapsedTime > timeout) {
          setResult({ timeout: true, error: new Error(errorMSG) });
        }
      } catch (err) {
        setResult({ timeout: true, error: err });
      }
    };

    runEffect();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, dependencies);

  return result;
}

export default useTimeoutEffect;
