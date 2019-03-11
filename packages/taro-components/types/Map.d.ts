import { ComponentType } from 'react'
import { StandardProps, CommonEventFunction } from './common'

export type callout = {

  /**
   * 文本
   */
  content: string;

  /**
   * 文本颜色
   */
  color: string;

  /**
   * 文字大小
   */
  fontSize: number;

  /**
   * 边框圆角
   */
  borderRadius: number;

  /**
   * 边框宽度
   */
  borderWidth: number;

  /**
   * 边框颜色
   */
  borderColor: string;

  /**
   * 背景色
   */
  bgColor: string;

  /**
   * 文本边缘留白
   */
  padding: number;

  /**
   * 'BYCLICK':点击显示; 'ALWAYS':常显
   */
  display: 'BYCLICK' | 'ALWAYS';

  /**
   * 文本对齐方式。有效值: left, right, center
   */
  textAlign: 'left' | 'right' | 'center';
};

export type label = {

  /**
   * 文本
   */
  content: string;

  /**
   * 文本颜色
   */
  color: string;

  /**
   * 文字大小
   */
  fontSize: number;

  /**
   * label的坐标，原点是 marker 对应的经纬度
   */
  anchorX: number;

  /**
   * label的坐标，原点是 marker 对应的经纬度
   */
  anchorY: number;

  /**
   * 边框宽度
   */
  borderWidth: number;

  /**
   * 边框颜色
   */
  borderColor: string;

  /**
   * 边框圆角
   */
  borderRadius: number;

  /**
   * 背景色
   */
  bgColor: string;

  /**
   * 文本边缘留白
   */
  padding: number;

  /**
   * 文本对齐方式。有效值: left, right, center
   */
  textAlign: 'left' | 'right' | 'center';
};

export type marker = {

  /**
   * 标记点id
   *
   * 备注：marker点击事件回调会返回此id。建议为每个marker设置上Number类型id，保证更新marker时有更好的性能。
   */
  id?: number;

  /**
   * 纬度
   *
   * 备注：浮点数，范围 -90 ~ 90
   */
  latitude: number;

  /**
   * 经度
   *
   * 备注：浮点数，范围 -180 ~ 180
   */
  longitude: number;

  /**
   * 标注点名
   */
  title?: string;

  /**
   * 显示层级
   */
  zIndex?: number;

  /**
   * 显示的图标
   *
   * 备注：项目目录下的图片路径，支持相对路径写法，以'/'开头则表示相对小程序根目录；也支持临时路径和网络图片
   */
  iconPath: string;

  /**
   * 旋转角度
   *
   * 备注：顺时针旋转的角度，范围 0 ~ 360，默认为 0
   */
  rotate?: number;

  /**
   * 标注的透明度
   *
   * 备注：默认1，无透明，范围 0 ~ 1
   */
  alpha?: number;

  /**
   * 标注图标宽度
   *
   * 备注：默认为图片实际宽度
   */
  width?: number;

  /**
   * 标注图标高度
   *
   * 备注：默认为图片实际高度
   */
  height?: number;

  /**
   * 自定义标记点上方的气泡窗口
   *
   * 备注：支持的属性见下表，可识别换行符。
   */
  callout?: callout;

  /**
   * 为标记点旁边增加标签
   *
   * 备注：支持的属性见下表，可识别换行符。
   */
  label?: label;

  /**
   * 经纬度在标注图标的锚点，默认底边中点
   *
   * 备注：{x, y}，x表示横向(0-1)，y表示竖向(0-1)。{x: .5, y: 1} 表示底边中点
   */
  anchor?: {
    x: number;
    y: number;
  };
};

/**
 * 地图。
 * @see https://developers.weixin.qq.com/miniprogram/dev/component/map.html#map
 */
export interface MapProps extends StandardProps {

  /**
   * 中心经度
   */
  longitude: number,

  /**
   * 中心纬度
   */
  latitude: number,

  /**
   * 缩放级别，取值范围为5-18
   * 默认值：`16`
   */
  scale?: number,

  /**
   * 标记点
   */
  markers?: Array<marker>,

  /**
   * @deprecated
   * 即将移除，请使用 markers
   */
  covers?: any[],

  /**
   * 路线
   */
  polyline?: any[],

  /**
   * 圆
   */
  circles?: any[],

  /**
   * 控件
   */
  controls?: any[],

  /**
   * 缩放视野以包含所有给定的坐标点
   */
  includePoints?: any[],

  /**
   * 显示带有方向的当前定位点
   */
  showLocation?: boolean,

  /**
   * 点击标记点时触发，会返回marker的id
   */
  onMarkerTap?: CommonEventFunction,

  /**
   * @since 1.2.0
   * 点击标记点对应的气泡时触发，会返回 marker 的 id
   */
  onCalloutTap?: CommonEventFunction,

  /**
   * 点击控件时触发，会返回 control 的 id
   */
  onControlTap?: CommonEventFunction,

  /**
   * 视野发生变化时触发
   */
  onRegionChange?: CommonEventFunction,

  /**
   * @since 1.6.0
   * 在地图渲染更新完成时触发
   */
  onUpdated?: CommonEventFunction
}

declare const Map: ComponentType<MapProps>

export { Map }
