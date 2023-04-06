import { createRenderEffect } from "solid-js";
export function use(fn, ele, accessor) {
  createRenderEffect(() => {
    fn(ele, accessor);
  });
}
