import mediaQuery from "css-mediaquery";
import transformCSS from "./css-to-react-native";
import parseCSS from "css/lib/parse";
import {
  dimensionFeatures,
  mediaQueryFeatures,
} from "./transforms/media-queries/features";
import { mediaQueryTypes } from "./transforms/media-queries/types";
import { remToPx } from "./transforms/rem";
import { allEqual } from "./utils/allEqual";
import { camelCase } from "./utils/camelCase";
import { sortRules } from "./utils/sortRules";
import { values } from "./utils/values";

const lengthRe = /^(0$|(?:[+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?)(?=px|rem$))/;
const viewportUnitRe = /^([+-]?[0-9.]+)(vh|vw|vmin|vmax)$/;
const percentRe = /^([+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?%)$/;
const unsupportedUnitRe = /^([+-]?(?:\d*\.)?\d+(?:[Ee][+-]?\d+)?(ch|em|ex|cm|mm|in|pc|pt))$/;
const shorthandBorderProps = [
  "border-radius",
  "border-width",
  "border-color",
  "border-style",
];

const transformDecls = (styles, declarations, result) => {
  for (const d in declarations) {
    const declaration = declarations[d];
    if (declaration.type !== "declaration") continue;

    const property = declaration.property;
    const value = remToPx(declaration.value);

    const isLengthUnit = lengthRe.test(value);
    const isViewportUnit = viewportUnitRe.test(value);
    const isPercent = percentRe.test(value);
    const isUnsupportedUnit = unsupportedUnitRe.test(value);

    if (
      property === "line-height" &&
      !isLengthUnit &&
      !isViewportUnit &&
      !isPercent &&
      !isUnsupportedUnit
    ) {
      throw new Error(`Failed to parse declaration "${property}: ${value}"`);
    }

    if (!result.__viewportUnits && isViewportUnit) {
      result.__viewportUnits = true;
    }

    if (shorthandBorderProps.indexOf(property) > -1) {
      // transform single value shorthand border properties back to
      // shorthand form to support styling `Image`.
      const transformed = transformCSS([[property, value]]);
      const vals = values(transformed);
      if (allEqual(vals)) {
        const replacement = {};
        replacement[camelCase(property)] = vals[0];
        Object.assign(styles, replacement);
      } else {
        Object.assign(styles, transformed);
      }
    } else {
      Object.assign(styles, transformCSS([[property, value]]));
    }
  }
};

const transform = (css, options) => {
  const { stylesheet } = parseCSS(css);
  const rules = sortRules(stylesheet.rules);

  const result = {};

  for (const r in rules) {
    const rule = rules[r];
    for (const s in rule.selectors) {
      if (rule.selectors[s] === ":export") {
        if (!result.__exportProps) {
          result.__exportProps = {};
        }

        rule.declarations.forEach(({ property, value }) => {
          const isAlreadyDefinedAsClass =
            result[property] !== undefined &&
            result.__exportProps[property] === undefined;

          if (isAlreadyDefinedAsClass) {
            throw new Error(
              `Failed to parse :export block because a CSS class in the same file is already using the name "${property}"`,
            );
          }

          result.__exportProps[property] = value;
        });
        continue;
      }

      if (
        rule.selectors[s].indexOf(".") !== 0 ||
        rule.selectors[s].indexOf(":") !== -1 ||
        rule.selectors[s].indexOf("[") !== -1 ||
        rule.selectors[s].indexOf("~") !== -1 ||
        rule.selectors[s].indexOf(">") !== -1 ||
        rule.selectors[s].indexOf("+") !== -1 ||
        rule.selectors[s].indexOf(" ") !== -1
      ) {
        continue;
      }

      const selector = rule.selectors[s].replace(/^\./, "");
      const styles = (result[selector] = result[selector] || {});
      transformDecls(styles, rule.declarations, result);
    }

    if (
      rule.type == "media" &&
      options != null &&
      options.parseMediaQueries === true
    ) {
      const parsed = mediaQuery.parse(rule.media);

      parsed.forEach(mq => {
        if (mediaQueryTypes.indexOf(mq.type) === -1) {
          throw new Error(`Failed to parse media query type "${mq.type}"`);
        }

        mq.expressions.forEach(e => {
          const mf = e.modifier ? `${e.modifier}-${e.feature}` : e.feature;
          const val = e.value ? `: ${e.value}` : "";

          if (mediaQueryFeatures.indexOf(e.feature) === -1) {
            throw new Error(`Failed to parse media query feature "${mf}"`);
          }

          if (
            dimensionFeatures.indexOf(e.feature) > -1 &&
            lengthRe.test(e.value) === false
          ) {
            throw new Error(
              `Failed to parse media query expression "(${mf}${val})"`,
            );
          }
        });
      });

      const media = "@media " + rule.media;

      result.__mediaQueries = result.__mediaQueries || {};
      result.__mediaQueries[media] = parsed;

      for (const r in rule.rules) {
        const ruleRule = rule.rules[r];
        for (const s in ruleRule.selectors) {
          result[media] = result[media] || {};
          const selector = ruleRule.selectors[s].replace(/^\./, "");
          const mediaStyles = (result[media][selector] =
            result[media][selector] || {});
          transformDecls(mediaStyles, ruleRule.declarations, result);
        }
      }
    }
  }

  if (result.__exportProps) {
    Object.assign(result, result.__exportProps);
    delete result.__exportProps;
  }

  return result;
};

export default transform;
