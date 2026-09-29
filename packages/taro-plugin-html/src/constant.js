import { isString } from '@tarojs/shared';
function genAttrMapFnFromDir(dir) {
    const fn = function (key, value) {
        const lowerKey = key.toLowerCase();
        if (lowerKey in dir) {
            const res = dir[lowerKey];
            if (isString(res)) {
                key = res;
            }
            else {
                key = res[0];
                value = res[1][value] || value;
            }
        }
        return [key, value];
    };
    return fn;
}
export const inlineElements = new Set([]);
export const blockElements = new Set([]);
export const specialElements = new Map([
    ['slot', 'slot'],
    ['form', 'form'],
    ['iframe', 'web-view'],
    ['img', 'image'],
    ['audio', 'audio'],
    ['video', 'video'],
    ['canvas', 'canvas'],
    ['a', {
            mapName(props) {
                if (props.as && isString(props.as))
                    return props.as.toLowerCase();
                return !props.href || (/^javascript/.test(props.href)) ? 'view' : 'navigator';
            },
            mapNameCondition: ['href'],
            mapAttr: genAttrMapFnFromDir({
                href: 'url',
                target: ['openType', {
                        _blank: 'navigate',
                        _self: 'redirect'
                    }]
            })
        }],
    ['input', {
            mapName(props) {
                if (props.type === 'checkbox') {
                    return 'checkbox';
                }
                else if (props.type === 'radio') {
                    return 'radio';
                }
                return 'input';
            },
            mapNameCondition: ['type'],
            mapAttr(key, value, props) {
                const htmlKey = key.toLowerCase();
                if (htmlKey === 'autofocus') {
                    key = 'focus';
                }
                else if (htmlKey === 'readonly') {
                    if (props.disabled === true) {
                        value = true;
                    }
                    key = 'disabled';
                }
                else if (htmlKey === 'type') {
                    if (value === 'password') {
                        key = 'password';
                        value = true;
                    }
                    else if (value === 'tel') {
                        value = 'number';
                    }
                }
                else if (htmlKey === 'maxlength') {
                    key = 'maxlength';
                }
                return [key, value];
            }
        }],
    ['label', {
            mapName: 'label',
            mapAttr: genAttrMapFnFromDir({
                htmlfor: 'for'
            })
        }],
    ['textarea', {
            mapName: 'textarea',
            mapAttr: genAttrMapFnFromDir({
                autofocus: 'focus',
                readonly: 'disabled',
                maxlength: 'maxlength'
            })
        }],
    ['progress', {
            mapName: 'progress',
            mapAttr(key, value, props) {
                if (key === 'value') {
                    const max = props.max || 1;
                    key = 'percent';
                    value = Math.round(value / max * 100);
                }
                return [key, value];
            }
        }],
    ['button', {
            mapName: 'button',
            mapAttr(key, value) {
                if (key === 'type' && (value === 'submit' || value === 'reset')) {
                    key = 'formType';
                }
                return [key, value];
            }
        }]
]);
//# sourceMappingURL=constant.js.map