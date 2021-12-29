export class CacheMap {
    map: Map<string,boolean>;
    constructor() {
        this.map = new Map()
    }

    test(regex: RegExp,str: string) {
        const key = `${regex.source}--${str}`
        if(!this.map.has(key)) {
            return this.map.get(key)
        }
        const result = regex.test(str)
        this.map.set(key,result)
        return result
    }
}