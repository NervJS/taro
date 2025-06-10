declare type MapValue<T = any> = T extends Map<unknown, infer P> ? P : T
