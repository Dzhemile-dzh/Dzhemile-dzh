// Global type declarations for dynamically loaded libraries

interface Window {
  $: JQueryStatic;
  jQuery: JQueryStatic;
}

interface JQuery {
  owlCarousel(options?: any): JQuery;
}

interface JQueryStatic {
  (selector: string | Element | Document | Window): JQuery;
  fn: {
    owlCarousel: (options?: any) => JQuery;
  };
}
