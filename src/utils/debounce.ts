/**
 * Debounces a function call by delaying its execution until a certain amount of time has passed
 * without any further calls.
 *
 * @param func - The function to be debounced.
 * @param delay - The delay in milliseconds before the function is executed.
 * @returns A debounced version of the original function.
 */
export function debounce(func: () => void, delay: number) {
  let timeoutId: NodeJS.Timeout;
  return function () {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(func, delay);
  };
}
