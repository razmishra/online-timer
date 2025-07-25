import { useCallback, useState } from "react";

const useTimerInput = (options = {}) => {
  const {
    maxSeconds = 180000, // Default 50 hours
    maxSecondsDigits = 2, // Max digits after colon
    maxSecondsValue = 59, // Max seconds value
    allowOnlyMinutes = false, // If true, no colon allowed
    initialValue = "",
    onExceedLimit, // Callback when limit exceeded
    onValidInput, // Callback when input is valid
  } = options;

  const [value, setValue] = useState(initialValue);
  const [exceedsLimit, setExceedsLimit] = useState(false);

  // Helper function to calculate total seconds
  const calculateTotalSeconds = useCallback((inputValue) => {
    if (!inputValue) return 0;

    if (inputValue.includes(":")) {
      const [mins, secs] = inputValue.split(":");
      return (parseInt(mins) || 0) * 60 + (parseInt(secs) || 0);
    } else {
      return (parseInt(inputValue) || 0) * 60;
    }
  }, []);

  // onKeyDown handler
  const handleKeyDown = useCallback(
    (e) => {
      const key = e.key;

      // Allow control keys
      if (
        [
          "Backspace",
          "Delete",
          "Tab",
          "Escape",
          "Enter",
          "ArrowLeft",
          "ArrowRight",
          "ArrowUp",
          "ArrowDown",
          "Home",
          "End",
        ].includes(key) ||
        e.ctrlKey ||
        e.metaKey
      ) {
        return;
      }

      // Only allow digits and colon (unless onlyMinutes is true)
      if (!/[\d:]/.test(key)) {
        e.preventDefault();
        return;
      }

      const currentValue = value;

      // Colon restrictions
      if (key === ":") {
        if (
          allowOnlyMinutes ||
          currentValue.includes(":") ||
          currentValue === ""
        ) {
          e.preventDefault();
          return;
        }
      }

      // Digit restrictions after colon
      if (/\d/.test(key) && currentValue.includes(":")) {
        const afterColon = currentValue.split(":")[1] || "";
        const selectionStart = e.target.selectionStart;
        const selectionEnd = e.target.selectionEnd;

        if (
          afterColon.length >= maxSecondsDigits &&
          selectionStart === selectionEnd
        ) {
          e.preventDefault();
          return;
        }
      }

      // Check if new value would exceed limit
      const selectionStart = e.target.selectionStart;
      const selectionEnd = e.target.selectionEnd;
      const newValue =
        currentValue.slice(0, selectionStart) +
        key +
        currentValue.slice(selectionEnd);

      if (calculateTotalSeconds(newValue) > maxSeconds) {
        e.preventDefault();
        setExceedsLimit(true);
        onExceedLimit?.(newValue, maxSeconds);
        return;
      }
    },
    [
      value,
      maxSeconds,
      maxSecondsDigits,
      allowOnlyMinutes,
      calculateTotalSeconds,
      onExceedLimit,
    ]
  );

  // onChange handler
  const handleChange = useCallback(
    (e) => {
      let inputValue = e.target.value;

      // Clean input: only digits and colon
      inputValue = inputValue.replace(/[^\d:]/g, "");

      // Remove colon if only minutes allowed
      if (allowOnlyMinutes) {
        inputValue = inputValue.replace(/:/g, "");
      }

      // Remove extra colons
      if ((inputValue.match(/:/g) || []).length > 1) {
        const firstColonIndex = inputValue.indexOf(":");
        inputValue =
          inputValue.slice(0, firstColonIndex + 1) +
          inputValue.slice(firstColonIndex + 1).replace(/:/g, "");
      }

      // Format and validate MM:SS
      if (inputValue.includes(":")) {
        const [minutes, seconds] = inputValue.split(":");
        let limitedSeconds = (seconds || "").slice(0, maxSecondsDigits);

        // Cap seconds at maxSecondsValue
        if (limitedSeconds && parseInt(limitedSeconds) > maxSecondsValue) {
          limitedSeconds = maxSecondsValue.toString();
        }

        inputValue = minutes + ":" + limitedSeconds;
      }

      // Check time limit
      const totalSeconds = calculateTotalSeconds(inputValue);
      if (totalSeconds > maxSeconds) {
        setExceedsLimit(true);
        onExceedLimit?.(inputValue, maxSeconds);
        return; // Don't update if exceeds limit
      } else {
        setExceedsLimit(false);
        onValidInput?.(inputValue, totalSeconds);
      }

      setValue(inputValue);
    },
    [
      maxSeconds,
      maxSecondsDigits,
      maxSecondsValue,
      allowOnlyMinutes,
      calculateTotalSeconds,
      onExceedLimit,
      onValidInput,
    ]
  );

  // Additional utility functions
  const reset = useCallback(() => {
    setValue(initialValue);
    setExceedsLimit(false);
  }, [initialValue]);

  const getTotalSeconds = useCallback(() => {
    return calculateTotalSeconds(value);
  }, [value, calculateTotalSeconds]);

  const isValid = useCallback(() => {
    return value !== "" && !exceedsLimit && calculateTotalSeconds(value) > 0;
  }, [value, exceedsLimit, calculateTotalSeconds]);

  return {
    value,
    setValue,
    exceedsLimit,
    handleKeyDown,
    handleChange,
    reset,
    getTotalSeconds,
    isValid,
  };
};

export default useTimerInput