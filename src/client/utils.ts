export const qs = <T extends HTMLElement = HTMLElement>(selector: string, scope?: Element | DocumentFragment) => {
  return (scope || document).querySelector<T>(selector)!;
};
