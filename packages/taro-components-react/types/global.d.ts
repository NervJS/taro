declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'swiper/bundle' {
  import Swiper from 'swiper';
  export = Swiper
}