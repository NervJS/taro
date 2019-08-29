import { ENV_TYPE, getEnv } from "../src/env";

// Create a global variable in jest
const _createGlobalVarible = (name, properties) => {
  Object.defineProperty(window, name, {
    writable: true,
    value: { ...properties }
  });
};
// Destory a global variable in jest
const _clearGlobalVarible = name => {
  Object.defineProperty(window, name, {
    writable: true,
    value: undefined
  });
};

// common test flow for qq/tt/wx/swan/alipay
const _commonFlow = ({ name, properties }, fn) => {
  _createGlobalVarible(name, properties);
  fn();
  _clearGlobalVarible(name);
};

// check getEnv function
describe("getEnv", () => {
  it("is QQ ?", () =>
    _commonFlow(
      { name: "qq", properties: { getSystemInfo: jest.fn() } },
      () => expect(getEnv()).toBe(ENV_TYPE.QQ)
    ));
  it("is TT ?", () =>
    _commonFlow(
      { name: "tt", properties: { getSystemInfo: jest.fn() } },
      () => expect(getEnv()).toBe(ENV_TYPE.TT)
    ));
  it("is WEAPP ?", () =>
    _commonFlow(
      { name: "wx", properties: { getSystemInfo: jest.fn() } },
      () => expect(getEnv()).toBe(ENV_TYPE.WEAPP)
    ));
  it("is SWAN ?", () =>
    _commonFlow(
      { name: "swan", properties: { getSystemInfo: jest.fn() } },
      () => expect(getEnv()).toBe(ENV_TYPE.SWAN)
    ));
  it("is ALIPAY ?", () =>
    _commonFlow(
      { name: "my", properties: { getSystemInfo: jest.fn() } },
      () => expect(getEnv()).toBe(ENV_TYPE.ALIPAY)
    ));
  it("is rn", () => {
    global.__fbGenNativeModule = jest.fn();
    expect(getEnv()).toBe(ENV_TYPE.RN);
    global.__fbGenNativeModule = undefined;
  }); 
  it("is WEB", () => expect(getEnv()).toBe(ENV_TYPE.WEB));
});
