import * as acorn from "acorn";
import * as walk from "acorn-walk";

import { Frameworks } from "./index";

interface ILoaderMeta {
  importFrameworkStatement: string;
  mockAppStatement: string;
  frameworkArgs: string;
  creator: string;
  creatorLocation: string;
  importFrameworkName: string;
  isNeedRawLoader?: boolean;
  extraImportForWeb?: string;
  execBeforeCreateWebApp?: string;
  compatComponentImport?: string;
  compatComponentExtra?: string;
  modifyConfig?: (config: Record<string, any>, source: string) => void;
}

function addConfig(source) {
  const configsMap = {
    enableShareAppMessage: ["onShareAppMessage", "useShareAppMessage"],
    enableShareTimeline: ["onShareTimeline", "useShareTimeline"],
  };
  const ast = acorn.parse(source, {
    ecmaVersion: "latest",
    sourceType: "module",
  });

  const additionConfig: Record<string, any> = {};

  function check(name: string) {
    Object.keys(configsMap).forEach((configName) => {
      const apis: string[] = configsMap[configName];
      if (apis.includes(name)) {
        additionConfig[configName] = true;
      }
    });
  }

  walk.simple(ast, {
    FunctionExpression(node: any) {
      if (!node.id || !node.id.name) return;
      check(node.id.name);
    },
    FunctionDeclaration(node: any) {
      if (!node.id || !node.id.name) return;
      check(node.id.name);
    },
    CallExpression(node: any) {
      const { callee } = node;
      if (callee.type === "Identifier") {
        check(callee.name);
      } else if (callee.type === "MemberExpression") {
        if (callee.property.type === "Identifier") {
          check(callee.property.name);
        } else if (callee.property.type === "Literal") {
          check(callee.property.value);
        }
      }
      node.arguments.forEach((item) => {
        if (item.type === "Literal" && item.value) {
          check(item.value);
        }
      });
    },
  });

  return additionConfig;
}

const frameworkMeta: Record<string, ILoaderMeta> = {
  solid: {
    importFrameworkStatement: `
`,
    mockAppStatement: `
    function App(props) {
      return null
    }
    `,
    frameworkArgs: "config",
    creator: "createSolidApp",
    creatorLocation: "@tarojs/plugin-framework-solid/dist/runtime",
    importFrameworkName: "",
    compatComponentImport:
      'import { PullDownRefresh } from "@tarojs/components"',
    compatComponentExtra: "config.PullDownRefresh = PullDownRefresh",
    modifyConfig(config, source) {
      Object.assign(config, addConfig(source));
    },
  },
};

export function getLoaderMeta(framework: Frameworks) {
  return frameworkMeta[framework];
}
