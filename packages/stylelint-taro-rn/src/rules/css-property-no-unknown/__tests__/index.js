import rule, { messages, ruleName } from "..";

testRule(rule, {
  ruleName,
  config: [true],

  accept: [
    {
      code: `
      .foo {
        border-color: red;
        height: 0;
        min-width: 700px;
      }
      `,
      description: "accepts supported CSS properties"
    },
    {
      code: `
      .foo {
        elevation: 6;
        shadow-color: black;
      }
      `,
      description: "accepts React Native specific properties"
    },
    {
      code: `
      .foo {
        border: 1px #000 solid;
        box-shadow: 1px 2px 3px red;
      }
      `,
      description: "accepts css-to-react-native specific properties"
    },
    {
      code: ".foo { --bg-color: white; }",
      description: "ignore standard CSS variables"
    },
    {
      code: ".foo { *width: 100px; }",
      description: "ignore CSS hacks"
    },
    {
      code: `
      :export {
        foo: 1
      }
      `,
      description: "ignore properties inside ICSS :export pseudo-selector"
    }
  ],

  reject: [
    {
      code: ".foo { colr: blue; }",
      description: "rejects property with typo",
      message: messages.rejected("colr"),
      line: 1,
      column: 8
    },
    {
      code: ".foo { COLR: blue; }",
      description: "rejects uppercase property with typo",
      message: messages.rejected("COLR"),
      line: 1,
      column: 8
    },
    {
      code: ".foo {\n  colr: blue;\n}",
      description: "rejects property with typo when there are newlines",
      message: messages.rejected("colr"),
      line: 2,
      column: 3
    },
    {
      code: ".foo { *wdth: 100px; }",
      description: "rejects css hacks with typo",
      message: messages.rejected("wdth"),
      line: 1,
      column: 8
    },
    {
      code: `
      .foo {
        word-wrap: break-word;
      }
    `,
      description: "rejects unsupported CSS properties",
      message: messages.rejected("word-wrap"),
      line: 3,
      column: 9
    },
    {
      code: `
      .foo {
        -webkit-align-self: stretch;
      }
    `,
      description: "rejects CSS properties with vendor prefix",
      message: messages.rejected("-webkit-align-self"),
      line: 3,
      column: 9
    },
    {
      code: `
      :export {
        foo: 1;
      }

      .foo {
        -webkit-align-self: stretch;
      }
    `,
      description:
        "ignores :export and rejects CSS properties with vendor prefix",
      message: messages.rejected("-webkit-align-self"),
      line: 7,
      column: 9
    }
  ]
});

testRule(rule, {
  ruleName,
  syntax: "scss",
  config: [true],

  accept: [
    {
      code: ".foo { $bgColor: white; }",
      description: "ignore SCSS variables"
    },
    {
      code: ".foo { #{$prop}: black; }",
      description: "ignore property interpolation"
    },
    {
      code: ".foo { border: { style: solid; } }",
      description: "ignore nested properties"
    }
  ]
});

testRule(rule, {
  ruleName,
  syntax: "less",
  config: [true],

  accept: [
    {
      code: ".foo { @bgColor: white; }",
      description: "ignore LESS variables"
    },
    {
      code: ".foo { @{prop}: black; }",
      description: "ignore property interpolation"
    },
    {
      code: ".foo { transform+: rotate(15deg); }",
      descritpion: "Append property value with space usign +"
    },
    {
      code: ".foo { transform+_: rotate(15deg); }",
      descritpion: "Append property value with space using +_"
    }
  ]
});

testRule(rule, {
  ruleName,
  config: [
    true,
    {
      ignoreProperties: ["-moz-overflow-scrolling", "/^my-/"]
    }
  ],

  accept: [
    {
      code: ".foo { -moz-overflow-scrolling: auto; }",
      description: "Ignores with a string property"
    },
    {
      code: ".foo { my-property: 1; }",
      description: "Ignores with a regex property"
    },
    {
      code: ".foo { my-other-property: 1; }",
      description: "Ignores with a regex property"
    }
  ],

  reject: [
    {
      code: ".foo { overflow-scrolling: auto; }",
      message: messages.rejected("overflow-scrolling"),
      line: 1,
      column: 8
    },
    {
      code: ".foo { not-my-property: 1; }",
      message: messages.rejected("not-my-property"),
      line: 1,
      column: 8
    }
  ]
});
