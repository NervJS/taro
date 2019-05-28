import transform from "./index";

describe("misc", () => {
  it("returns empty object when input is empty", () => {
    expect(transform(``)).toEqual({});
  });

  it("transforms flex", () => {
    expect(
      transform(`
      .test {
        flex: 1;
      }
    `),
    ).toEqual({
      test: {
        flexBasis: 0,
        flexGrow: 1,
        flexShrink: 1,
      },
    });
  });

  it("transforms numbers", () => {
    expect(
      transform(`
      .test {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
      }
    `),
    ).toEqual({
      test: { top: 0, left: 0, right: 0, bottom: 0 },
    });
  });

  it("ignores unsupported at-rules", () => {
    expect(transform(`@charset "utf-8";`)).toEqual({});
    expect(
      transform(`
      @supports (display: grid) {
        div {
          display: grid;
        }
      }
    `),
    ).toEqual({});
  });

  it("allows pixels in unspecialized transform", () => {
    expect(
      transform(`
      .test {
        top: 0px;
      }
    `),
    ).toEqual({
      test: { top: "scalePx2dp(0)" },
    });
  });

  it("allows percent in unspecialized transform", () => {
    expect(
      transform(`
      .test {
        top: 0%;
      }
    `),
    ).toEqual({
      test: { top: "0%" },
    });
  });

  it("allows decimal values", () => {
    expect(
      transform(`
      .test {
        margin-top: 0.5px;
      }
    `),
    ).toEqual({
      test: { marginTop: "scalePx2dp(0.5)" },
    });
    expect(
      transform(`
      .test {
        margin-top: 100.5px;
      }
    `),
    ).toEqual({
      test: { marginTop: "scalePx2dp(100.5)" },
    });
    expect(
      transform(`
      .test {
        margin-top: -0.5px;
      }
    `),
    ).toEqual({
      test: { marginTop: "scalePx2dp(-0.5)" },
    });
    expect(
      transform(`
      .test {
        margin-top: -100.5px;
      }
    `),
    ).toEqual({
      test: { marginTop: "scalePx2dp(-100.5)" },
    });
    expect(
      transform(`
      .test {
        margin-top: .5px;
      }
    `),
    ).toEqual({
      test: { marginTop: "scalePx2dp(0.5)" },
    });
    expect(
      transform(`
      .test {
        margin-top: -.5px;
      }
    `),
    ).toEqual({
      test: { marginTop: "scalePx2dp(-0.5)" },
    });
  });

  it("allows PX or PX values", () => {
    expect(
      transform(`
      .test {
        top: 1Px;
        margin: 10Px 30px;
      }
    `),
    ).toEqual({
      test: {
        marginBottom: 10,
        marginLeft: "scalePx2dp(30)",
        marginRight: "scalePx2dp(30)",
        marginTop: 10,
        top: 1,
      },
    });
  });

  it("allows PX or PX values scalePx2dp", () => {
    expect(
      transform(`
      .test {
        top: 10Px;
        left:10px;
        margin: 10Px 30px;
      }
    `),
    ).toEqual({
      test: {
        left: "scalePx2dp(10)",
        marginBottom: 10,
        marginLeft: "scalePx2dp(30)",
        marginRight: "scalePx2dp(30)",
        marginTop: 10,
        top: 10,
      },
    });
  });

  it("allows decimal values in transformed values", () => {
    expect(
      transform(`
      .test {
        border-radius: 1.5px;
      }
    `),
    ).toEqual({
      test: {
        borderRadius: "scalePx2dp(1.5)",
      },
    });
  });

  it("allows negative values in transformed values", () => {
    expect(
      transform(`
      .test {
        border-radius: -1.5px;
      }
    `),
    ).toEqual({
      test: {
        borderRadius: "scalePx2dp(-1.5)",
      },
    });
  });

  it("allows percent values in transformed values", () => {
    expect(
      transform(`
      .test {
        margin: 10%;
      }
    `),
    ).toEqual({
      test: {
        marginTop: "10%",
        marginRight: "10%",
        marginBottom: "10%",
        marginLeft: "10%",
      },
    });
  });

  it("allows color values in transformed border-color values", () => {
    expect(
      transform(`
      .test {
        border-color: red
      }
    `),
    ).toEqual({
      test: {
        borderColor: "red",
      },
    });
  });

  it("allows omitting units for 0", () => {
    expect(
      transform(`
      .test {
        margin: 10px 0;
      }
    `),
    ).toEqual({
      test: {
        marginTop: "scalePx2dp(10)",
        marginRight: 0,
        marginBottom: "scalePx2dp(10)",
        marginLeft: 0,
      },
    });
  });

  it("converts to camel-case", () => {
    expect(
      transform(`
      .test {
        background-color: red;
      }
    `),
    ).toEqual({
      test: {
        backgroundColor: "red",
      },
    });
  });

  it("transforms shadow offsets", () => {
    expect(
      transform(`
      .test {
        shadow-offset: 10px 5px;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: {
          height: "scalePx2dp(5)",
          width: "scalePx2dp(10)",
        },
      },
    });
  });

  it("transforms text shadow offsets", () => {
    expect(
      transform(`
      .test {
        text-shadow-offset: 10px 5px;
      }
    `),
    ).toEqual({
      test: {
        textShadowOffset: {
          height: "scalePx2dp(5)",
          width: "scalePx2dp(10)",
        },
      },
    });
  });

  it("transforms a block of css", () => {
    expect(
      transform(`
    .description {
      margin-bottom: 20px;
      font-size: 18px;
      text-align: center;
      color: #656656;
      box-shadow: 10px 20px 30px #fff;
    }

    .container {
      padding: 30px;
      margin-top: 65px;
      align-items: center;
      border: 2px dashed #f00;
    }
  `),
    ).toEqual({
      description: {
        fontSize: "scalePx2dp(18)",
        marginBottom: "scalePx2dp(20)",
        textAlign: "center",
        color: "#656656",
        shadowColor: "#fff",
        shadowOffset: {
          height: "scalePx2dp(20)",
          width: "scalePx2dp(10)",
        },
        shadowRadius: "scalePx2dp(30)",
        shadowOpacity: 1,
      },
      container: {
        paddingBottom: "scalePx2dp(30)",
        paddingLeft: "scalePx2dp(30)",
        paddingRight: "scalePx2dp(30)",
        paddingTop: "scalePx2dp(30)",
        marginTop: "scalePx2dp(65)",
        alignItems: "center",
        borderColor: "#f00",
        borderStyle: "dashed",
        borderWidth: "scalePx2dp(2)",
      },
    });
  });

  it("throws useful errors", () => {
    expect(() => {
      transform(`
      .test {
        margin: 10;
      }
    `);
    }).toThrowError('Failed to parse declaration "margin: 10"');
  });

  it("when there are selectors with the same name, merges the common props", () => {
    expect(
      transform(`
      .test {
        margin: 10px;
        background-color: #f00;
      }
      .test {
        padding: 10px;
        font-size: 20px;
        margin: 5px;
      }
    `),
    ).toEqual({
      test: {
        backgroundColor: "#f00",
        fontSize: "scalePx2dp(20)",
        marginBottom: "scalePx2dp(5)",
        marginLeft: "scalePx2dp(5)",
        marginRight: "scalePx2dp(5)",
        marginTop: "scalePx2dp(5)",
        paddingBottom: "scalePx2dp(10)",
        paddingLeft: "scalePx2dp(10)",
        paddingRight: "scalePx2dp(10)",
        paddingTop: "scalePx2dp(10)",
      },
    });
  });

  it("supports group of selectors", () => {
    expect(
      transform(`
      .test1, .test2 {
        color: red;
      }
    `),
    ).toEqual({
      test1: {
        color: "red",
      },
      test2: {
        color: "red",
      },
    });
  });
});

describe("selectors", () => {
  it("supports dash in class names", () => {
    expect(
      transform(`
      .test-1-2 {
        color: red;
      }
    `),
    ).toEqual({
      "test-1-2": {
        color: "red",
      },
    });
  });

  it("supports underscore in class names", () => {
    expect(
      transform(`
      .test_1 {
        color: red;
      }
    `),
    ).toEqual({
      test_1: {
        color: "red",
      },
    });
  });

  it("supports grouping selectors", () => {
    expect(
      transform(`
      .test, .test2, .test3 {
        color: red;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
      test2: {
        color: "red",
      },
      test3: {
        color: "red",
      },
    });
  });

  it("ignores grouping of ID selectors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
      #test1, #test2, #test3 {
        color: red;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("ignores grouping of element selectors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
      p, h1, input {
        color: red;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("ignores ID selectors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
      #foo {
        color: blue;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("ignores type selectors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
      input[type=text] {
        color: blue;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
    expect(
      transform(`
      .test {
        color: red;
      }
      [class^="test"] {
        color: blue;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
    expect(
      transform(`
      .test {
        color: red;
      }
      .foo[class^="test"] {
        color: blue;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("ignores universal selectors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
      * {
        color: blue;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("ignores descendant selectors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
      .foo .bar {
        color: blue;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("ignores direct child selectors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
      .foo > .bar {
        color: blue;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("ignores adjancent sibling selectors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
      .foo + .bar {
        color: blue;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("ignores general sibling selectors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
      .foo ~ .bar {
        color: blue;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("ignores qualified selectors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
      p.bar {
        color: blue;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("ignores element selectors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
      p {
        color: blue;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("ignores pseudo selectors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
      .test1:hover {
        color: blue;
      }
      .test2::before {
        color: blue;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });
});

describe("colors", () => {
  it("transforms named colors", () => {
    expect(
      transform(`
      .test {
        color: red;
      }
    `),
    ).toEqual({
      test: {
        color: "red",
      },
    });
  });

  it("transforms hex colors", () => {
    expect(
      transform(`
      .test {
        color: #f00;
      }
    `),
    ).toEqual({
      test: {
        color: "#f00",
      },
    });
  });

  it("transforms rgb colors", () => {
    expect(
      transform(`
      .test {
        color: rgb(255, 0, 0);
      }
    `),
    ).toEqual({
      test: {
        color: "rgb(255, 0, 0)",
      },
    });
  });

  it("transforms rgba colors", () => {
    expect(
      transform(`
      .test {
        color: rgba(255, 0, 0, 0);
      }
    `),
    ).toEqual({
      test: {
        color: "rgba(255, 0, 0, 0)",
      },
    });
  });
});

describe("transform", () => {
  it("transforms a single transform value with number", () => {
    expect(
      transform(`
      .test {
        transform: scaleX(5);
      }
    `),
    ).toEqual({
      test: { transform: [{ scaleX: 5 }] },
    });
  });

  it("transforms a single transform value with string", () => {
    expect(
      transform(`
      .test {
        transform: rotate(5deg);
      }
    `),
    ).toEqual({
      test: { transform: [{ rotate: "5deg" }] },
    });
  });

  it("transforms multiple transform values", () => {
    expect(
      transform(`
      .test {
        transform: scaleX(5) skewX(1deg);
      }
    `),
    ).toEqual({
      test: { transform: [{ skewX: "1deg" }, { scaleX: 5 }] },
    });
  });

  it("transforms scale(number, number) to scaleX and scaleY", () => {
    expect(
      transform(`
      .test {
        transform: scale(2, 3);
      }
    `),
    ).toEqual({
      test: { transform: [{ scaleY: 3 }, { scaleX: 2 }] },
    });
  });

  it("transforms translate(length, length) to translateX and translateY", () => {
    expect(
      transform(`
      .test {
        transform: translate(2px, 3px);
      }
    `),
    ).toEqual({
      test: { transform: [{ translateY: 3 }, { translateX: 2 }] },
    });
  });

  it("transforms translate(length) to translateX and translateY", () => {
    expect(
      transform(`
      .test {
        transform: translate(5px);
      }
    `),
    ).toEqual({
      test: { transform: [{ translateY: 0 }, { translateX: 5 }] },
    });
  });

  it("transforms skew(angle, angle) to skewX and skewY", () => {
    expect(
      transform(`
      .test {
        transform: skew(2deg, 3deg);
      }
    `),
    ).toEqual({
      test: { transform: [{ skewY: "3deg" }, { skewX: "2deg" }] },
    });
  });

  it("transforms skew(angle) to skewX and skewY", () => {
    expect(
      transform(`
      .test {
        transform: skew(5deg);
      }
    `),
    ).toEqual({
      test: { transform: [{ skewY: "0deg" }, { skewX: "5deg" }] },
    });
  });
});

describe("border", () => {
  it("transforms border shorthand", () => {
    expect(
      transform(`
      .test {
        border: 2px dashed #f00;
      }
    `),
    ).toEqual({
      test: { borderWidth: 2, borderColor: "#f00", borderStyle: "dashed" },
    });
  });

  it("transforms border shorthand in other order", () => {
    expect(
      transform(`
      .test {
        border: #f00 2px dashed;
      }
    `),
    ).toEqual({
      test: { borderWidth: 2, borderColor: "#f00", borderStyle: "dashed" },
    });
  });

  it("transforms border shorthand missing color", () => {
    expect(
      transform(`
      .test {
        border: 2px dashed;
      }
    `),
    ).toEqual({
      test: { borderWidth: 2, borderColor: "black", borderStyle: "dashed" },
    });
  });

  it("transforms border shorthand missing style", () => {
    expect(
      transform(`
      .test {
        border: 2px #f00;
      }
    `),
    ).toEqual({
      test: { borderWidth: 2, borderColor: "#f00", borderStyle: "solid" },
    });
  });

  it("transforms border shorthand missing width", () => {
    expect(
      transform(`
      .test {
        border: #f00 dashed;
      }
    `),
    ).toEqual({
      test: { borderWidth: 1, borderColor: "#f00", borderStyle: "dashed" },
    });
  });

  it("transforms border shorthand missing color & width", () => {
    expect(
      transform(`
      .test {
        border: dashed;
      }
    `),
    ).toEqual({
      test: { borderWidth: 1, borderColor: "black", borderStyle: "dashed" },
    });
  });

  it("transforms border shorthand missing style & width", () => {
    expect(
      transform(`
      .test {
        border: #f00;
      }
    `),
    ).toEqual({
      test: { borderWidth: 1, borderColor: "#f00", borderStyle: "solid" },
    });
  });

  it("transforms border shorthand missing color & style", () => {
    expect(
      transform(`
      .test {
        border: 2px;
      }
    `),
    ).toEqual({
      test: { borderWidth: 2, borderColor: "black", borderStyle: "solid" },
    });
  });

  describe("shorthand border properties related to Image elements", () => {
    it("transforms border-radius", () => {
      expect(
        transform(`
        .test {
          border-radius: 6px;
        }
      `),
      ).toEqual({
        test: { borderRadius: 6 },
      });
    });

    it("transforms border-radius with multiple values", () => {
      expect(
        transform(`
        .test {
          border-radius: 10px 5%;
        }
      `),
      ).toEqual({
        test: {
          borderBottomLeftRadius: "5%",
          borderBottomRightRadius: 10,
          borderTopLeftRadius: 10,
          borderTopRightRadius: "5%",
        },
      });
      expect(
        transform(`
        .test {
          border-radius: 2px 4px 2px;
        }
      `),
      ).toEqual({
        test: {
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 2,
          borderTopLeftRadius: 2,
          borderTopRightRadius: 4,
        },
      });
      expect(
        transform(`
        .test {
          border-radius: 1px 0 3px 4px;
        }
      `),
      ).toEqual({
        test: {
          borderBottomLeftRadius: 4,
          borderBottomRightRadius: 3,
          borderTopLeftRadius: 1,
          borderTopRightRadius: 0,
        },
      });
    });

    it("transforms border-color", () => {
      expect(
        transform(`
        .test {
          border-color: #fff;
        }
      `),
      ).toEqual({
        test: { borderColor: "#fff" },
      });
    });

    it("transforms border-color with multiple values", () => {
      expect(
        transform(`
        .test {
          border-color: red #f015ca;
        }
      `),
      ).toEqual({
        test: {
          borderTopColor: "red",
          borderRightColor: "#f015ca",
          borderBottomColor: "red",
          borderLeftColor: "#f015ca",
        },
      });
      expect(
        transform(`
        .test {
          border-color: red yellow green;
        }
      `),
      ).toEqual({
        test: {
          borderTopColor: "red",
          borderRightColor: "yellow",
          borderBottomColor: "green",
          borderLeftColor: "yellow",
        },
      });
      expect(
        transform(`
        .test {
          border-color: red yellow green blue;
        }
      `),
      ).toEqual({
        test: {
          borderTopColor: "red",
          borderRightColor: "yellow",
          borderBottomColor: "green",
          borderLeftColor: "blue",
        },
      });
    });

    it("transforms border-width", () => {
      expect(
        transform(`
        .test {
          border-width: 4px;
        }
      `),
      ).toEqual({
        test: { borderWidth: 4 },
      });
    });

    it("transforms border-width with multiple values", () => {
      expect(
        transform(`
        .test {
          border-width: 2px 1.5rem;
        }
      `),
      ).toEqual({
        test: {
          borderTopWidth: 2,
          borderRightWidth: 24,
          borderBottomWidth: 2,
          borderLeftWidth: 24,
        },
      });
      expect(
        transform(`
        .test {
          border-width: 1px 2rem 1.5rem;
        }
      `),
      ).toEqual({
        test: {
          borderTopWidth: 1,
          borderRightWidth: 32,
          borderBottomWidth: 24,
          borderLeftWidth: 32,
        },
      });
      expect(
        transform(`
        .test {
          border-width: 1px 2rem 0 4rem;
        }
      `),
      ).toEqual({
        test: {
          borderTopWidth: 1,
          borderRightWidth: 32,
          borderBottomWidth: 0,
          borderLeftWidth: 64,
        },
      });
    });

    it("transforms border-style", () => {
      expect(
        transform(`
        .test {
          border-style: solid;
        }
      `),
      ).toEqual({
        test: { borderStyle: "solid" },
      });
    });
  });
});

describe("font", () => {
  it("transforms font weights as strings", () => {
    expect(
      transform(`
      .test {
        font-weight: 400
      }
    `),
    ).toEqual({
      test: { fontWeight: "400" },
    });
  });

  it("transforms font variant as an array", () => {
    expect(
      transform(`
      .test {
        font-variant: tabular-nums;
      }
    `),
    ).toEqual({
      test: { fontVariant: ["tabular-nums"] },
    });
  });
});

describe("background", () => {
  it("transforms background to backgroundColor", () => {
    expect(
      transform(`
      .test {
        background: #f00;
      }
    `),
    ).toEqual({
      test: {
        backgroundColor: "#f00",
      },
    });
  });

  it("transforms background to backgroundColor with rgb", () => {
    expect(
      transform(`
      .test {
        background: rgb(255, 0, 0);
      }
    `),
    ).toEqual({
      test: {
        backgroundColor: "rgb(255, 0, 0)",
      },
    });
  });

  it("transforms background to backgroundColor with named colour", () => {
    expect(
      transform(`
      .test {
        background: red;
      }
    `),
    ).toEqual({
      test: {
        backgroundColor: "red",
      },
    });
  });
});

describe("line-height", () => {
  it("transforms line-height with value and unit", () => {
    expect(
      transform(`
      .test {
        line-height: 1.5px;
      }
    `),
    ).toEqual({
      test: {
        lineHeight: 1.5,
      },
    });
  });
  it("transforms line-height with rem unit", () => {
    expect(
      transform(`
      .test {
        line-height: 2rem;
      }
    `),
    ).toEqual({
      test: {
        lineHeight: 32,
      },
    });
  });
  it("transforms line-height with %", () => {
    expect(
      transform(`
      .test {
        line-height: 150%;
      }
    `),
    ).toEqual({
      test: {
        lineHeight: "150%",
      },
    });
  });
  it("transforms line-height with pt unit", () => {
    expect(
      transform(`
      .test {
        line-height: 2pt;
      }
    `),
    ).toEqual({
      test: {
        lineHeight: "2pt",
      },
    });
  });
  it("transforms line-height with viewport unit", () => {
    expect(
      transform(`
      .test {
        line-height: 2vh;
      }
    `),
    ).toEqual({
      __viewportUnits: true,
      test: {
        lineHeight: "2vh",
      },
    });
  });
  it("throws for line-height with multiplier", () => {
    expect(() =>
      transform(`
      .test {
        line-height: 1.5;
      }
    `),
    ).toThrow('Failed to parse declaration "line-height: 1.5"');
  });
});

describe("margin", () => {
  it("transforms margin shorthands using 4 values", () => {
    expect(
      transform(`
      .test {
        margin: 10px 20px 30px 40px;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 10,
        marginRight: 20,
        marginBottom: 30,
        marginLeft: 40,
      },
    });
  });

  it("transforms margin shorthands using 3 values", () => {
    expect(
      transform(`
      .test {
        margin: 10px 20px 30px;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 10,
        marginRight: 20,
        marginBottom: 30,
        marginLeft: 20,
      },
    });
  });

  it("transforms margin shorthands using 2 values", () => {
    expect(
      transform(`
      .test {
        margin: 10px 20px;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 10,
        marginRight: 20,
        marginBottom: 10,
        marginLeft: 20,
      },
    });
  });

  it("transforms margin shorthands using 1 value", () => {
    expect(
      transform(`
      .test {
        margin: 10px;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 10,
        marginRight: 10,
        marginBottom: 10,
        marginLeft: 10,
      },
    });
  });

  it("shorthand with 1 value should override previous values", () => {
    expect(
      transform(`
      .test {
        margin-top: 2px;
        margin: 1px;
      }
    `),
    ).toEqual({
      test: { marginTop: 1, marginRight: 1, marginBottom: 1, marginLeft: 1 },
    });
  });

  it("transforms margin shorthand with auto", () => {
    expect(
      transform(`
      .test {
        margin: auto;
      }
    `),
    ).toEqual({
      test: {
        marginTop: "auto",
        marginRight: "auto",
        marginBottom: "auto",
        marginLeft: "auto",
      },
    });
    expect(
      transform(`
      .test {
        margin: 0 auto;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 0,
        marginRight: "auto",
        marginBottom: 0,
        marginLeft: "auto",
      },
    });
    expect(
      transform(`
      .test {
        margin: auto 0;
      }
    `),
    ).toEqual({
      test: {
        marginTop: "auto",
        marginRight: 0,
        marginBottom: "auto",
        marginLeft: 0,
      },
    });
    expect(
      transform(`
      .test {
        margin: 2px 3px auto;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 2,
        marginRight: 3,
        marginBottom: "auto",
        marginLeft: 3,
      },
    });
    expect(
      transform(`
      .test {
        margin: 10px auto 4px;
      }
    `),
    ).toEqual({
      test: {
        marginTop: 10,
        marginRight: "auto",
        marginBottom: 4,
        marginLeft: "auto",
      },
    });
  });
});

describe("text-decoration", () => {
  it("transforms text-decoration into text-decoration- properties", () => {
    expect(
      transform(`
      .test {
        text-decoration: underline dotted red;
      }
    `),
    ).toEqual({
      test: {
        textDecorationLine: "underline",
        textDecorationStyle: "dotted",
        textDecorationColor: "red",
      },
    });
  });

  it("transforms text-decoration without color", () => {
    expect(
      transform(`
      .test {
        text-decoration: underline dotted;
      }
    `),
    ).toEqual({
      test: {
        textDecorationLine: "underline",
        textDecorationStyle: "dotted",
        textDecorationColor: "black",
      },
    });
  });

  it("transforms text-decoration without style", () => {
    expect(
      transform(`
      .test {
        text-decoration: underline red;
      }
    `),
    ).toEqual({
      test: {
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "red",
      },
    });
  });

  it("transforms text-decoration without style and color", () => {
    expect(
      transform(`
      .test {
        text-decoration: underline;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "underline",
        textDecorationStyle: "solid",
        textDecorationColor: "black",
      },
    });
  });

  it("transforms text-decoration with two line properties", () => {
    expect(
      transform(`
      .test {
        text-decoration: underline line-through dashed red;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "underline line-through",
        textDecorationStyle: "dashed",
        textDecorationColor: "red",
      },
    });
  });

  it("transforms text-decoration in different order", () => {
    expect(
      transform(`
      .test {
        text-decoration: dashed red underline line-through;
      }
    `),
    ).toEqual({
      test: {
        textDecorationLine: "underline line-through",
        textDecorationStyle: "dashed",
        textDecorationColor: "red",
      },
    });
  });

  it("transforms text-decoration with ine in different order", () => {
    expect(
      transform(`
      .test {
        text-decoration: line-through underline;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "underline line-through",
        textDecorationStyle: "solid",
        textDecorationColor: "black",
      },
    });
  });

  it("transforms text-decoration with none", () => {
    expect(
      transform(`
      .test {
        text-decoration: none;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "none",
        textDecorationStyle: "solid",
        textDecorationColor: "black",
      },
    });
  });

  it("transforms text-decoration with none as part of multiple terms", () => {
    expect(
      transform(`
      .test {
        text-decoration: yellow none;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "none",
        textDecorationStyle: "solid",
        textDecorationColor: "yellow",
      },
    });
  });

  it("transforms text-decoration with none in capitals", () => {
    expect(
      transform(`
      .test {
        text-decoration: yellow NONE;
      }
    `),
    ).toEqual({
      test: {
        textDecorationLine: "none",
        textDecorationStyle: "solid",
        textDecorationColor: "yellow",
      },
    });
  });

  it("transforms text-decoration with style in capitals", () => {
    expect(
      transform(`
      .test {
        text-decoration: yellow UNDERLINE LINE-THROUGH;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "underline line-through",
        textDecorationStyle: "solid",
        textDecorationColor: "yellow",
      },
    });
  });

  it("does not transform text-decoration if multiple colors are used", () => {
    expect(() =>
      transform(`
      .test {
        text-decoration: underline red yellow;
      }
      `),
    ).toThrow(
      'Failed to parse declaration "textDecoration: underline red yellow"',
    );
  });
});

describe("text-decoration-line", () => {
  it("transforms text-decoration-line with underline line-through", () => {
    expect(
      transform(`
      .test {
        text-decoration-line: underline line-through;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "underline line-through",
      },
    });
  });

  it("transforms text-decoration-line with line-through underline", () => {
    expect(
      transform(`
      .test {
        text-decoration-line: line-through underline;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "underline line-through",
      },
    });
  });

  it("transforms text-decoration-line with none", () => {
    expect(
      transform(`
      .test {
        text-decoration-line: none;
      }
      `),
    ).toEqual({
      test: {
        textDecorationLine: "none",
      },
    });
  });
});

describe("flex-box", () => {
  it("transforms flex shorthand with 3 values", () => {
    expect(
      transform(`
      .test {
        flex: 1 2 3px;
      }
    `),
    ).toEqual({
      test: { flexGrow: 1, flexShrink: 2, flexBasis: 3 },
    });
  });

  it("transforms flex shorthand with 3 values in reverse order", () => {
    expect(
      transform(`
      .test {
        flex: 3px 1 2;
      }
    `),
    ).toEqual({
      test: { flexGrow: 1, flexShrink: 2, flexBasis: 3 },
    });
  });

  it("transforms flex shorthand with 2 values of flex-grow and flex-shrink", () => {
    expect(
      transform(`
      .test {
        flex: 1 2;
      }
    `),
    ).toEqual({
      test: { flexGrow: 1, flexShrink: 2, flexBasis: 0 },
    });
  });

  it("transforms flex shorthand with 2 values of flex-grow and flex-basis", () => {
    expect(
      transform(`
      .test {
        flex: 2 2px;
      }
    `),
    ).toEqual({
      test: { flexGrow: 2, flexShrink: 1, flexBasis: 2 },
    });
  });

  it("transforms flex shorthand with 2 values of flex-grow and flex-basis (reversed)", () => {
    expect(
      transform(`
      .test {
        flex: 2px 2;
      }
    `),
    ).toEqual({
      test: { flexGrow: 2, flexShrink: 1, flexBasis: 2 },
    });
  });

  it("transforms flex shorthand with 1 value of flex-grow", () => {
    expect(
      transform(`
      .test {
        flex: 2;
      }
    `),
    ).toEqual({
      test: { flexGrow: 2, flexShrink: 1, flexBasis: 0 },
    });
  });

  it("transforms flex shorthand with 1 value of flex-basis", () => {
    expect(
      transform(`
      .test {
        flex: 10px;
      }
    `),
    ).toEqual({
      test: { flexGrow: 1, flexShrink: 1, flexBasis: 10 },
    });
  });

  /*
    A unitless zero that is not already preceded by two flex factors must be interpreted as a flex
    factor. To avoid misinterpretation or invalid declarations, authors must specify a zero
    <‘flex-basis’> component with a unit or precede it by two flex factors.
  */
  it("transforms flex shorthand with flex-grow/shrink taking priority over basis", () => {
    expect(
      transform(`
      .test {
        flex: 0 1 0;
      }
    `),
    ).toEqual({
      test: { flexGrow: 0, flexShrink: 1, flexBasis: 0 },
    });
  });

  it("transforms flex shorthand with flex-basis set to auto", () => {
    expect(
      transform(`
      .test {
        flex: 0 1 auto;
      }
    `),
    ).toEqual({
      test: { flexBasis: "auto", flexGrow: 0, flexShrink: 1 },
    });
  });

  it("transforms flex shorthand with flex-basis set to auto appearing first", () => {
    expect(
      transform(`
      .test {
        flex: auto 0 1;
      }
    `),
    ).toEqual({
      test: { flexBasis: "auto", flexGrow: 0, flexShrink: 1 },
    });
  });

  it("transforms flex auto keyword", () => {
    expect(
      transform(`
      .test {
        flex: auto;
      }
    `),
    ).toEqual({
      test: { flexBasis: "auto", flexGrow: 1, flexShrink: 1 },
    });
  });

  it("transforms flex none keyword", () => {
    expect(
      transform(`
      .test {
        flex: none;
      }
    `),
    ).toEqual({
      test: { flexBasis: "auto", flexGrow: 0, flexShrink: 0 },
    });
  });

  it("transforms flexFlow shorthand with two values", () => {
    expect(
      transform(`
      .test {
        flex-flow: column wrap;
      }
    `),
    ).toEqual({
      test: { flexDirection: "column", flexWrap: "wrap" },
    });
  });

  it("transforms flexFlow shorthand missing flexDirection", () => {
    expect(
      transform(`
      .test {
        flex-flow: wrap;
      }
    `),
    ).toEqual({
      test: { flexDirection: "row", flexWrap: "wrap" },
    });
  });

  it("transforms flexFlow shorthand missing flexWrap", () => {
    expect(
      transform(`
      .test {
        flex-flow: column;
      }
    `),
    ).toEqual({
      test: { flexDirection: "column", flexWrap: "nowrap" },
    });
  });

  it("does not transform invalid flex'", () => {
    expect(() => {
      transform(`
      .test {
        flex: 1 2px 3;
      }
    `);
    }).toThrowError('Failed to parse declaration "flex: 1 2px 3"');
  });
});

describe("font", () => {
  it("transforms font", () => {
    expect(
      transform(`
      .test {
        font: bold italic small-caps 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "italic",
        fontVariant: ["small-caps"],
        lineHeight: 18,
      },
    });
  });

  it("transforms font missing font-variant", () => {
    expect(
      transform(`
      .test {
        font: bold italic 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "italic",
        fontVariant: [],
        lineHeight: 18,
      },
    });
  });

  it("transforms font missing font-style", () => {
    expect(
      transform(`
      .test {
        font: bold small-caps 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "normal",
        fontVariant: ["small-caps"],
        lineHeight: 18,
      },
    });
  });

  it("transforms font missing font-weight", () => {
    expect(
      transform(`
      .test {
        font: italic small-caps 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "italic",
        fontVariant: ["small-caps"],
        lineHeight: 18,
      },
    });
  });

  it("transforms font with font-weight normal", () => {
    expect(
      transform(`
      .test {
        font: normal 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        fontVariant: [],
        lineHeight: 18,
      },
    });
  });

  it("transforms font with font-weight and font-style normal", () => {
    expect(
      transform(`
      .test {
        font: normal normal 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        fontVariant: [],
        lineHeight: 18,
      },
    });
  });

  it("transforms font with no font-weight, font-style, and font-variant", () => {
    expect(
      transform(`
      .test {
        font: 16px/18px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        fontVariant: [],
        lineHeight: 18,
      },
    });
  });

  it("omits line height if not specified", () => {
    expect(
      transform(`
      .test {
        font: 16px "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        fontVariant: [],
      },
    });
  });

  it("allows line height as multiple", () => {
    expect(
      transform(`
      .test {
        font: 16px/1.5 "Helvetica";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica",
        fontSize: 16,
        fontWeight: "normal",
        fontStyle: "normal",
        fontVariant: [],
        lineHeight: 24,
      },
    });
  });

  it("transforms font without quotes", () => {
    expect(
      transform(`
      .test {
        font: bold italic small-caps 16px/18px Helvetica Neue;
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica Neue",
        fontSize: 16,
        fontWeight: "bold",
        fontStyle: "italic",
        fontVariant: ["small-caps"],
        lineHeight: 18,
      },
    });
  });

  it("transforms font-family with double quotes", () => {
    expect(
      transform(`
      .test {
        font-family: "Helvetica Neue";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica Neue",
      },
    });
  });

  it("transforms font-family with single quotes", () => {
    expect(
      transform(`
      .test {
        font-family: 'Helvetica Neue';
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica Neue",
      },
    });
  });

  it("transforms font-family without quotes", () => {
    expect(
      transform(`
      .test {
        font-family: Helvetica Neue;
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Helvetica Neue",
      },
    });
  });

  it("transforms font-family with quotes with otherwise invalid values", () => {
    expect(
      transform(`
      .test {
        font-family: "Goudy Bookletter 1911";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "Goudy Bookletter 1911",
      },
    });
  });

  it("transforms font-family with quotes with escaped values", () => {
    expect(
      transform(`
      .test {
        font-family: "test\\A test";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: "test\ntest",
      },
    });
  });

  it("transforms font-family with quotes with escaped quote", () => {
    expect(
      transform(`
      .test {
        font-family: "test\\"test";
      }
    `),
    ).toEqual({
      test: {
        fontFamily: 'test"test',
      },
    });
  });

  it("does not transform invalid unquoted font-family", () => {
    expect(() => {
      transform(`
      .test {
        font-family: Goudy Bookletter 1911;
      }
    `);
    }).toThrowError(
      'Failed to parse declaration "fontFamily: Goudy Bookletter 1911"',
    );
  });
});

describe("box-shadow", () => {
  it("transforms box-shadow into shadow- properties", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px red;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "red",
        shadowOpacity: 1,
      },
    });
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px #f00;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "#f00",
        shadowOpacity: 1,
      },
    });
  });

  it("supports rgb values", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px rgb(100, 100, 100);
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "rgb(100, 100, 100)",
        shadowOpacity: 1,
      },
    });
  });

  it("supports rgba values", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px rgba(100, 100, 100, 0.5);
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "rgba(100, 100, 100, 0.5)",
        shadowOpacity: 1,
      },
    });
  });

  it("supports box-shadow with hsl color", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px hsl(120, 100%, 50%);
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "hsl(120, 100%, 50%)",
        shadowOpacity: 1,
      },
    });
  });

  it("supports box-shadow with hsla color", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px hsla(120, 100%, 50%, 0.7);
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "hsla(120, 100%, 50%, 0.7)",
        shadowOpacity: 1,
      },
    });
  });

  it("trims values", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px   20px   30px   #f00 ;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "#f00",
        shadowOpacity: 1,
      },
    });
  });

  it("transforms box-shadow with 0 values", () => {
    expect(
      transform(`
      .test {
        box-shadow: 0 0 1px red;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 1,
        shadowColor: "red",
        shadowOpacity: 1,
      },
    });
    expect(
      transform(`
      .test {
        box-shadow: 0 0 0 red;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 0, height: 0 },
        shadowRadius: 0,
        shadowColor: "red",
        shadowOpacity: 1,
      },
    });
    expect(
      transform(`
      .test {
        box-shadow: 1px 1px 0 #00f;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 1, height: 1 },
        shadowRadius: 0,
        shadowColor: "#00f",
        shadowOpacity: 1,
      },
    });
  });

  it("transforms box-shadow without blur-radius", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px red;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 0,
        shadowColor: "red",
        shadowOpacity: 1,
      },
    });
  });

  it("transforms box-shadow without color", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px 30px;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 30,
        shadowColor: "black",
        shadowOpacity: 1,
      },
    });
  });

  it("transforms box-shadow without blur-radius, color", () => {
    expect(
      transform(`
      .test {
        box-shadow: 10px 20px;
      }
    `),
    ).toEqual({
      test: {
        shadowOffset: { width: 10, height: 20 },
        shadowRadius: 0,
        shadowColor: "black",
        shadowOpacity: 1,
      },
    });
  });

  it("transforms box-shadow enforces offset to be present", () => {
    expect(() => {
      transform(`
      .test {
        box-shadow: red;
      }
    `);
    }).toThrowError('Failed to parse declaration "boxShadow: red"');
  });

  it("transforms box-shadow and throws if multiple colors are used", () => {
    expect(() => {
      transform(`
      .test {
        box-shadow: 0 0 0 red yellow green blue;
      }
    `);
    }).toThrowError(
      'Failed to parse declaration "boxShadow: 0 0 0 red yellow green blue"',
    );
  });

  it("transforms box-shadow and enforces offset-y if offset-x present", () => {
    expect(() => {
      transform(`
      .test {
        box-shadow: 10px;
      }
    `);
    }).toThrowError('Failed to parse declaration "boxShadow: 10px"');
  });

  it("transforms box-shadow and enforces units for non 0 values", () => {
    expect(() => {
      transform(`
      .test {
        box-shadow: 10 20px 30px #f00;
      }
    `);
    }).toThrowError(
      'Failed to parse declaration "boxShadow: 10 20px 30px #f00"',
    );
    expect(() => {
      transform(`
      .test {
        box-shadow: 10px 20;
      }
    `);
    }).toThrowError('Failed to parse declaration "boxShadow: 10px 20"');
    expect(() => {
      transform(`
      .test {
        box-shadow: 20;
      }
    `);
    }).toThrowError('Failed to parse declaration "boxShadow: 20"');
  });
});

describe("text-shadow", () => {
  it("textShadow with all values", () => {
    expect(
      transform(`
      .test {
        text-shadow: 10px 20px 30px red;
      }
    `),
    ).toEqual({
      test: {
        textShadowOffset: { width: 10, height: 20 },
        textShadowRadius: 30,
        textShadowColor: "red",
      },
    });
  });

  it("textShadow omitting blur", () => {
    expect(
      transform(`
      .test {
        text-shadow: 10px 20px red;
      }
    `),
    ).toEqual({
      test: {
        textShadowOffset: { width: 10, height: 20 },
        textShadowRadius: 0,
        textShadowColor: "red",
      },
    });
  });

  it("textShadow omitting color", () => {
    expect(
      transform(`
      .test {
        text-shadow: 10px 20px;
      }
    `),
    ).toEqual({
      test: {
        textShadowOffset: { width: 10, height: 20 },
        textShadowRadius: 0,
        textShadowColor: "black",
      },
    });
  });

  it("textShadow enforces offset-x and offset-y", () => {
    expect(() =>
      transform(`
      .test {
        text-shadow: red;
      }
      `),
    ).toThrow('Failed to parse declaration "textShadow: red"');
    expect(() =>
      transform(`
      .test {
        text-shadow: 10px red;
      }
      `),
    ).toThrow('Failed to parse declaration "textShadow: 10px red"');
  });
});

describe("rem unit", () => {
  it("should transform a single rem value", () => {
    expect(
      transform(`
      .test1 {
        padding: 2rem;
      }
      .test2 {
        font-size: 1rem;
      }
    `),
    ).toEqual({
      test1: {
        paddingBottom: 32,
        paddingLeft: 32,
        paddingRight: 32,
        paddingTop: 32,
      },
      test2: {
        fontSize: 16,
      },
    });
  });

  it("should transform multiple rem values", () => {
    expect(
      transform(`
      .test1 {
        transform: translate(1rem, 2rem);
      }
      .test2 {
        box-shadow: 1rem 2rem 3rem #fff;
      }
    `),
    ).toEqual({
      test1: {
        transform: [{ translateY: 32 }, { translateX: 16 }],
      },
      test2: {
        shadowColor: "#fff",
        shadowOffset: { height: 32, width: 16 },
        shadowRadius: 48,
        shadowOpacity: 1,
      },
    });
  });

  it("should support decimal values", () => {
    expect(
      transform(`
      .test1 {
        transform: translate(0.9375rem, 1.625rem);
      }
      .test2 {
        border-radius: 0.5625rem;
      }
    `),
    ).toEqual({
      test1: { transform: [{ translateY: 26 }, { translateX: 15 }] },
      test2: {
        borderRadius: 9,
      },
    });

    expect(
      transform(`
      .test1 {
        transform: translate(.9375rem, 1.625rem);
      }
      .test2 {
        border-radius: .5625rem;
      }
    `),
    ).toEqual({
      test1: { transform: [{ translateY: 26 }, { translateX: 15 }] },
      test2: {
        borderRadius: 9,
      },
    });
  });
});

describe("viewport units", () => {
  it("should transform viewport units", () => {
    expect(
      transform(`
      .test {
        font-size: 1vw;
        line-height: 2vh;
        padding: 1vmax;
        margin: 1vmin;
      }
    `),
    ).toEqual({
      __viewportUnits: true,
      test: {
        fontSize: "1vw",
        lineHeight: "2vh",
        marginBottom: "1vmin",
        marginLeft: "1vmin",
        marginRight: "1vmin",
        marginTop: "1vmin",
        paddingBottom: "1vmax",
        paddingLeft: "1vmax",
        paddingRight: "1vmax",
        paddingTop: "1vmax",
      },
    });
  });
});

describe("media queries", () => {
  it("transforms media queries", () => {
    expect(
      transform(
        `
        .container {
          background-color: #f00;
        }

        @media (orientation: landscape) {
          .container {
            background-color: #00f;
          }
        }
        `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toEqual({
      __mediaQueries: {
        "@media (orientation: landscape)": [
          {
            expressions: [
              {
                feature: "orientation",
                modifier: undefined,
                value: "landscape",
              },
            ],
            inverse: false,
            type: "all",
          },
        ],
      },
      container: {
        backgroundColor: "#f00",
      },
      "@media (orientation: landscape)": {
        container: {
          backgroundColor: "#00f",
        },
      },
    });
  });

  it("merges media queries", () => {
    expect(
      transform(
        `
        .container {
          background-color: #f00;
        }
        .box {
          background-color: #f00;
        }

        @media (orientation: landscape) {
          .container {
            background-color: #00f;
          }
        }
        @media (orientation: landscape) {
          .box {
            background-color: #00f;
          }
        }
        `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toEqual({
      __mediaQueries: {
        "@media (orientation: landscape)": [
          {
            expressions: [
              {
                feature: "orientation",
                modifier: undefined,
                value: "landscape",
              },
            ],
            inverse: false,
            type: "all",
          },
        ],
      },
      container: {
        backgroundColor: "#f00",
      },
      box: {
        backgroundColor: "#f00",
      },
      "@media (orientation: landscape)": {
        container: {
          backgroundColor: "#00f",
        },
        box: {
          backgroundColor: "#00f",
        },
      },
    });
  });

  it("does not transform media queries without option enabled", () => {
    expect(
      transform(`
      .container {
        background-color: #f00;
      }

      @media (orientation: landscape) {
        .container {
          background-color: #00f;
        }
      }
  `),
    ).toEqual({
      container: {
        backgroundColor: "#f00",
      },
    });

    expect(
      transform(
        `
        .container {
          background-color: #f00;
        }

        @media (orientation: landscape) {
          .container {
            background-color: #00f;
          }
        }
        `,
        {
          parseMediaQueries: false,
        },
      ),
    ).toEqual({
      container: {
        backgroundColor: "#f00",
      },
    });
  });

  it("should support screen type", () => {
    expect(
      transform(
        `
        .foo {
          color: blue;
        }
        @media screen and (min-height: 50px) and (max-height: 150px) {
          .foo {
            color: red;
          }
        }
        @media screen and (min-height: 150px) and (max-height: 200px) {
          .foo {
            color: green;
          }
        }
      `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toEqual({
      __mediaQueries: {
        "@media screen and (min-height: 50px) and (max-height: 150px)": [
          {
            expressions: [
              { feature: "height", modifier: "min", value: "50px" },
              { feature: "height", modifier: "max", value: "150px" },
            ],
            inverse: false,
            type: "screen",
          },
        ],
        "@media screen and (min-height: 150px) and (max-height: 200px)": [
          {
            expressions: [
              { feature: "height", modifier: "min", value: "150px" },
              { feature: "height", modifier: "max", value: "200px" },
            ],
            inverse: false,
            type: "screen",
          },
        ],
      },
      foo: { color: "blue" },
      "@media screen and (min-height: 50px) and (max-height: 150px)": {
        foo: { color: "red" },
      },
      "@media screen and (min-height: 150px) and (max-height: 200px)": {
        foo: { color: "green" },
      },
    });
  });

  it("should support all type", () => {
    expect(
      transform(
        `
      .foo {
        color: blue;
      }
      @media all and (min-height: 50px) and (max-height: 150px) {
        .foo {
          color: red;
        }
      }
      @media all and (min-height: 150px) and (max-height: 200px) {
        .foo {
          color: green;
        }
      }
    `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toEqual({
      __mediaQueries: {
        "@media all and (min-height: 50px) and (max-height: 150px)": [
          {
            expressions: [
              { feature: "height", modifier: "min", value: "50px" },
              { feature: "height", modifier: "max", value: "150px" },
            ],
            inverse: false,
            type: "all",
          },
        ],
        "@media all and (min-height: 150px) and (max-height: 200px)": [
          {
            expressions: [
              { feature: "height", modifier: "min", value: "150px" },
              { feature: "height", modifier: "max", value: "200px" },
            ],
            inverse: false,
            type: "all",
          },
        ],
      },
      foo: { color: "blue" },
      "@media all and (min-height: 50px) and (max-height: 150px)": {
        foo: { color: "red" },
      },
      "@media all and (min-height: 150px) and (max-height: 200px)": {
        foo: { color: "green" },
      },
    });
  });

  it("should support platform types", () => {
    expect(
      transform(
        `
      @media web and (orientation: landscape) {
        .container {
          background-color: #00f;
        }
      }
      @media ios and (orientation: landscape) {
        .container {
          background-color: #00f;
        }
      }
      @media android and (orientation: landscape) {
        .container {
          background-color: #00f;
        }
      }
      @media windows and (orientation: landscape) {
        .container {
          background-color: #00f;
        }
      }
      @media macos and (orientation: landscape) {
        .container {
          background-color: #00f;
        }
      }
      @media dom and (orientation: landscape) {
        .container {
          background-color: #00f;
        }
      }
      `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toEqual({
      "@media android and (orientation: landscape)": {
        container: { backgroundColor: "#00f" },
      },
      "@media dom and (orientation: landscape)": {
        container: { backgroundColor: "#00f" },
      },
      "@media ios and (orientation: landscape)": {
        container: { backgroundColor: "#00f" },
      },
      "@media macos and (orientation: landscape)": {
        container: { backgroundColor: "#00f" },
      },
      "@media web and (orientation: landscape)": {
        container: { backgroundColor: "#00f" },
      },
      "@media windows and (orientation: landscape)": {
        container: { backgroundColor: "#00f" },
      },
      __mediaQueries: {
        "@media android and (orientation: landscape)": [
          {
            expressions: [
              {
                feature: "orientation",
                modifier: undefined,
                value: "landscape",
              },
            ],
            inverse: false,
            type: "android",
          },
        ],
        "@media dom and (orientation: landscape)": [
          {
            expressions: [
              {
                feature: "orientation",
                modifier: undefined,
                value: "landscape",
              },
            ],
            inverse: false,
            type: "dom",
          },
        ],
        "@media ios and (orientation: landscape)": [
          {
            expressions: [
              {
                feature: "orientation",
                modifier: undefined,
                value: "landscape",
              },
            ],
            inverse: false,
            type: "ios",
          },
        ],
        "@media macos and (orientation: landscape)": [
          {
            expressions: [
              {
                feature: "orientation",
                modifier: undefined,
                value: "landscape",
              },
            ],
            inverse: false,
            type: "macos",
          },
        ],
        "@media web and (orientation: landscape)": [
          {
            expressions: [
              {
                feature: "orientation",
                modifier: undefined,
                value: "landscape",
              },
            ],
            inverse: false,
            type: "web",
          },
        ],
        "@media windows and (orientation: landscape)": [
          {
            expressions: [
              {
                feature: "orientation",
                modifier: undefined,
                value: "landscape",
              },
            ],
            inverse: false,
            type: "windows",
          },
        ],
      },
    });
  });

  it("should support NOT operator", () => {
    expect(
      transform(
        `
        .container {
          background-color: #f00;
        }

        @media not screen and (device-width: 768px)  {
          .container {
            background-color: #00f;
          }
        }
        `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toEqual({
      __mediaQueries: {
        "@media not screen and (device-width: 768px)": [
          {
            expressions: [
              {
                feature: "device-width",
                modifier: undefined,
                value: "768px",
              },
            ],
            inverse: true,
            type: "screen",
          },
        ],
      },
      container: {
        backgroundColor: "#f00",
      },
      "@media not screen and (device-width: 768px)": {
        container: {
          backgroundColor: "#00f",
        },
      },
    });
  });

  it("should support OR queries", () => {
    expect(
      transform(
        `
        .container {
          background-color: #f00;
        }

        @media (orientation: portrait), (orientation: landscape)  {
          .container {
            background-color: #00f;
          }
        }
        `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toEqual({
      __mediaQueries: {
        "@media (orientation: portrait), (orientation: landscape)": [
          {
            expressions: [
              {
                feature: "orientation",
                modifier: undefined,
                value: "portrait",
              },
            ],
            inverse: false,
            type: "all",
          },
          {
            expressions: [
              {
                feature: "orientation",
                modifier: undefined,
                value: "landscape",
              },
            ],
            inverse: false,
            type: "all",
          },
        ],
      },
      container: { backgroundColor: "#f00" },
      "@media (orientation: portrait), (orientation: landscape)": {
        container: { backgroundColor: "#00f" },
      },
    });
  });

  it("should throw for invalid types", () => {
    expect(() =>
      transform(
        `
        .foo {
          color: blue;
        }

        @media screens {
          .foo {
            color: red;
          }
        }
      `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toThrow('Failed to parse media query type "screens"');
    expect(() =>
      transform(
        `
        .foo {
          color: blue;
        }
        @media sdfgsdfg {
          .foo {
            color: red;
          }
        }
      `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toThrow('Failed to parse media query type "sdfgsdfg"');
    expect(() =>
      transform(
        `
      .foo {
        color: blue;
      }
      @media linux and (orientation: landscape) {
        .foo {
          color: red;
        }
      }
    `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toThrow('Failed to parse media query type "linux"');
  });

  it("should throw for invalid features", () => {
    expect(() =>
      transform(
        `
        .foo {
          color: blue;
        }
        @media (min-heigh: 50px) and (max-height: 150px) {
          .foo {
            color: red;
          }
        }
      `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toThrow('Failed to parse media query feature "min-heigh"');
    expect(() =>
      transform(
        `
        .foo {
          color: blue;
        }
        @media (orientations: landscape) {
          .foo {
            color: red;
          }
        }
      `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toThrow('Failed to parse media query feature "orientations"');
  });

  it("should throw for values without units", () => {
    expect(() =>
      transform(
        `
        .foo {
          color: blue;
        }
        @media (min-height: 50) and (max-height: 150px) {
          .foo {
            color: red;
          }
        }
      `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toThrow('Failed to parse media query expression "(min-height: 50)"');
    expect(() =>
      transform(
        `
        .foo {
          color: blue;
        }
        @media (min-height: 50px) and (max-height: 150) {
          .foo {
            color: red;
          }
        }
      `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toThrow('Failed to parse media query expression "(max-height: 150)"');
    expect(() =>
      transform(
        `
        .foo {
          color: blue;
        }
        @media (min-width) {
          .foo {
            color: red;
          }
        }
      `,
        {
          parseMediaQueries: true,
        },
      ),
    ).toThrow('Failed to parse media query expression "(min-width)"');
  });
});

describe("ICSS :export pseudo-selector", () => {
  // https://github.com/css-modules/icss#export

  it("should parse ICSS :export pseudo-selectors", () => {
    expect(
      transform(`
      :export {
        whitecolor: #fcf5ed;
        test: 1px;
      }
    `),
    ).toEqual({
      whitecolor: "#fcf5ed",
      test: "1px",
    });
  });

  it("if there is more than :export one in a file, the keys and values are combined and exported together", () => {
    expect(
      transform(`

      :export {
        blackColor: #000;
      }

      .bar {
        color: blue;
      }

      :export {
        whitecolor: #fcf5ed;
        test: 1px;
      }
    `),
    ).toEqual({
      bar: {
        color: "blue",
      },
      blackColor: "#000",
      whitecolor: "#fcf5ed",
      test: "1px",
    });
  });

  it("should support exportedKey value with spaces", () => {
    expect(
      transform(`
      :export {
        blackColor: something is something;
      }

      .bar {
        color: blue;
      }
    `),
    ).toEqual({
      bar: {
        color: "blue",
      },
      blackColor: "something is something",
    });
  });

  it("an exportedValue does not need to be quoted, it is already treated as a literal string", () => {
    expect(
      transform(`
      :export {
        foo: something;
        boo: 0;
      }

      .bar {
        color: blue;
      }
    `),
    ).toEqual({
      bar: {
        color: "blue",
      },
      foo: "something",
      boo: "0",
    });
  });

  it("should parse :export and support the same exportedKey with different case", () => {
    expect(
      transform(`
      :export {
        whitecolor: #fcf5ed;
        WhiteColor: #fff;
      }
    `),
    ).toEqual({
      whitecolor: "#fcf5ed",
      WhiteColor: "#fff",
    });
  });

  it("should parse a selector and :export", () => {
    expect(
      transform(`
      .foo {
        color: blue;
      }

      :export {
        whitecolor: #fcf5ed;
        b: 0;
        test: 1px;
      }
    `),
    ).toEqual({
      foo: {
        color: "blue",
      },
      whitecolor: "#fcf5ed",
      b: "0",
      test: "1px",
    });
  });

  it("should do nothing with an empty :export block", () => {
    expect(
      transform(`
      .foo {
        color: blue;
      }

      :export {
      }
    `),
    ).toEqual({
      foo: {
        color: "blue",
      },
    });
  });

  it("if a particular exportedKey is duplicated, the last (in source order) takes precedence.", () => {
    expect(
      transform(`
      .foo {
        color: blue;
      }

      :export {
        bar: 1;
        bar: 2;
      }
    `),
    ).toEqual({
      foo: {
        color: "blue",
      },
      bar: "2",
    });
    expect(
      transform(`
      :export {
        bar: 3;
      }

      .foo {
        color: blue;
      }

      :export {
        bar: 1;
        bar: 2;
      }
    `),
    ).toEqual({
      foo: {
        color: "blue",
      },
      bar: "2",
    });
    expect(
      transform(`
      :export {
        baz: 1;
        bar: 3;
      }

      .foo {
        color: blue;
      }

      :export {
        bar: 1;
        bar: 2;
      }
    `),
    ).toEqual({
      foo: {
        color: "blue",
      },
      baz: "1",
      bar: "2",
    });
  });

  it("should throw an error if exportedKey has the same name as a class and is defined twice", () => {
    expect(() =>
      transform(`
      :export {
        bar: 1;
        bar: 2;
      }

      .bar {
        color: blue;
      }
    `),
    ).toThrow(
      'Failed to parse :export block because a CSS class in the same file is already using the name "bar"',
    );
  });

  it("should throw an error if exportedKey has the same name as a class", () => {
    expect(() =>
      transform(`
      .foo {
        color: blue;
      }

      :export {
        foo: 1;
      }
    `),
    ).toThrow(
      'Failed to parse :export block because a CSS class in the same file is already using the name "foo"',
    );
    expect(() =>
      transform(`
      :export {
        foo: 1;
      }

      .foo {
        color: red;
      }
    `),
    ).toThrow(
      'Failed to parse :export block because a CSS class in the same file is already using the name "foo"',
    );
    expect(() =>
      transform(`
      .foo {
        color: blue;
      }

      :export {
        foo: 1;
      }

      .foo {
        color: red;
      }
    `),
    ).toThrow(
      'Failed to parse :export block because a CSS class in the same file is already using the name "foo"',
    );
  });

  it("should throw for :export that is not top level", () => {
    expect(() =>
      transform(`
      .foo {
        color: red;
        :export {
          bar: 1;
        }
      }
    `),
    ).toThrow();
  });
});
