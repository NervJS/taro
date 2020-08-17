import { getBabelConfig } from "../src/utils";

test("babel options merge", () => {
  const config = getBabelConfig({
    presets: [
      [
        "env",
        {
          targets: { chrome: "50" }
        }
      ],
      "mypresets"
    ],
    plugins: [["transform-decorators-legacy", {}], "myplugin"]
  });

  // 用户定义的 presets 可以覆盖默认配置
  expect(config).toMatchObject({
    sourceMap: true,
    presets: [
      [
        "env",
        {
          targets: { chrome: "50" }
        }
      ],
      "mypresets"
    ],
    plugins: [
      ["transform-decorators-legacy", {}],
      "myplugin",
      require("babel-plugin-transform-react-jsx"), // rn need
      "transform-class-properties",
      "transform-object-rest-spread"
    ]
  });
});
