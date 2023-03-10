/*
 *  MIT License
 *
 *  Copyright (c) 2018 O2Team、58.com、other contributors
 *
 *  Permission is hereby granted, free of charge, to any person obtaining a copy
 *  of this software and associated documentation files (the "Software"), to deal
 *  in the Software without restriction, including without limitation the rights
 *  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *  copies of the Software, and to permit persons to whom the Software is
 *  furnished to do so, subject to the following conditions:
 *
 *  The above copyright notice and this permission notice shall be included in all
 *  copies or substantial portions of the Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 */

import { RegionObj } from './PropsType'

export const regionData: RegionObj[] = [
  {
    code: '110000',
    value: '北京市',
    postcode: '100000',
    children: [
      {
        code: '110100',
        value: '北京市',
        postcode: '100000',
        children: [
          { code: '110101', value: '东城区', postcode: '100010' },
          { code: '110102', value: '西城区', postcode: '100032' },
          { code: '110105', value: '朝阳区', postcode: '100020' },
          { code: '110106', value: '丰台区', postcode: '100071' },
          { code: '110107', value: '石景山区', postcode: '100043' },
          { code: '110108', value: '海淀区', postcode: '100089' },
          { code: '110109', value: '门头沟区', postcode: '102300' },
          { code: '110111', value: '房山区', postcode: '102488' },
          { code: '110112', value: '通州区', postcode: '101100' },
          { code: '110113', value: '顺义区', postcode: '101300' },
          { code: '110114', value: '昌平区', postcode: '102200' },
          { code: '110115', value: '大兴区', postcode: '102600' },
          { code: '110116', value: '怀柔区', postcode: '101400' },
          { code: '110117', value: '平谷区', postcode: '101200' },
          { code: '110118', value: '密云区', postcode: '101500' },
          { code: '110119', value: '延庆区', postcode: '102100' }
        ]
      }
    ]
  },
  {
    code: '120000',
    value: '天津市',
    postcode: '300000',
    children: [
      {
        code: '120100',
        value: '天津市',
        postcode: '300000',
        children: [
          { code: '120101', value: '和平区', postcode: '300041' },
          { code: '120102', value: '河东区', postcode: '300171' },
          { code: '120103', value: '河西区', postcode: '572000' },
          { code: '120104', value: '南开区', postcode: '300100' },
          { code: '120105', value: '河北区', postcode: '300143' },
          { code: '120106', value: '红桥区', postcode: '300131' },
          { code: '120110', value: '东丽区', postcode: '300300' },
          { code: '120111', value: '西青区', postcode: '300380' },
          { code: '120112', value: '津南区', postcode: '300350' },
          { code: '120113', value: '北辰区', postcode: '300400' },
          { code: '120114', value: '武清区', postcode: '301700' },
          { code: '120115', value: '宝坻区', postcode: '301800' },
          { code: '120116', value: '滨海新区', postcode: '300457' },
          { code: '120117', value: '宁河区', postcode: '300000' },
          { code: '120118', value: '静海区', postcode: '301600' },
          { code: '120119', value: '蓟州区', postcode: '301900' }
        ]
      }
    ]
  },
  {
    code: '130000',
    value: '河北省',
    postcode: '0',
    children: [
      {
        code: '130100',
        value: '石家庄市',
        postcode: '050000',
        children: [
          { code: '130102', value: '长安区', postcode: '050011' },
          { code: '130104', value: '桥西区', postcode: '050051' },
          { code: '130105', value: '新华区', postcode: '050051' },
          { code: '130107', value: '井陉矿区', postcode: '050100' },
          { code: '130108', value: '裕华区', postcode: '050081' },
          { code: '130109', value: '藁城区', postcode: '052160' },
          { code: '130110', value: '鹿泉区', postcode: '050200' },
          { code: '130111', value: '栾城区', postcode: '051430' },
          { code: '130121', value: '井陉县', postcode: '050000' },
          { code: '130123', value: '正定县', postcode: '050800' },
          { code: '130125', value: '行唐县', postcode: '050600' },
          { code: '130126', value: '灵寿县', postcode: '050500' },
          { code: '130127', value: '高邑县', postcode: '051330' },
          { code: '130128', value: '深泽县', postcode: '052560' },
          { code: '130129', value: '赞皇县', postcode: '051230' },
          { code: '130130', value: '无极县', postcode: '052400' },
          { code: '130131', value: '平山县', postcode: '050400' },
          { code: '130132', value: '元氏县', postcode: '051130' },
          { code: '130133', value: '赵县', postcode: '051530' },
          { code: '130181', value: '辛集市', postcode: '053800' },
          { code: '130183', value: '晋州市', postcode: '052200' },
          { code: '130184', value: '新乐市', postcode: '050700' }
        ]
      },
      {
        code: '130200',
        value: '唐山市',
        postcode: '063000',
        children: [
          { code: '130202', value: '路南区', postcode: '063017' },
          { code: '130203', value: '路北区', postcode: '063015' },
          { code: '130204', value: '古冶区', postcode: '063104' },
          { code: '130205', value: '开平区', postcode: '063021' },
          { code: '130207', value: '丰南区', postcode: '063300' },
          { code: '130208', value: '丰润区', postcode: '064000' },
          { code: '130209', value: '曹妃甸区', postcode: '064000' },
          { code: '130224', value: '滦南县', postcode: '063500' },
          { code: '130225', value: '乐亭县', postcode: '063600' },
          { code: '130227', value: '迁西县', postcode: '064300' },
          { code: '130229', value: '玉田县', postcode: '064100' },
          { code: '130281', value: '遵化市', postcode: '064200' },
          { code: '130283', value: '迁安市', postcode: '064400' },
          { code: '130284', value: '滦州市', postcode: '063700' }
        ]
      },
      {
        code: '130300',
        value: '秦皇岛市',
        postcode: '066000',
        children: [
          { code: '130302', value: '海港区', postcode: '066000' },
          { code: '130303', value: '山海关区', postcode: '066200' },
          { code: '130304', value: '北戴河区', postcode: '066100' },
          { code: '130306', value: '抚宁区', postcode: '066300' },
          { code: '130321', value: '青龙满族自治县', postcode: '066500' },
          { code: '130322', value: '昌黎县', postcode: '066600' },
          { code: '130324', value: '卢龙县', postcode: '066400' }
        ]
      },
      {
        code: '130400',
        value: '邯郸市',
        postcode: '056000',
        children: [
          { code: '130402', value: '邯山区', postcode: '056001' },
          { code: '130403', value: '丛台区', postcode: '056004' },
          { code: '130404', value: '复兴区', postcode: '056003' },
          { code: '130406', value: '峰峰矿区', postcode: '056200' },
          { code: '130407', value: '肥乡区', postcode: '057550' },
          { code: '130408', value: '永年区', postcode: '057151' },
          { code: '130423', value: '临漳县', postcode: '056600' },
          { code: '130424', value: '成安县', postcode: '056700' },
          { code: '130425', value: '大名县', postcode: '056900' },
          { code: '130426', value: '涉县', postcode: '056400' },
          { code: '130427', value: '磁县', postcode: '056500' },
          { code: '130430', value: '邱县', postcode: '057450' },
          { code: '130431', value: '鸡泽县', postcode: '057350' },
          { code: '130432', value: '广平县', postcode: '057650' },
          { code: '130433', value: '馆陶县', postcode: '057750' },
          { code: '130434', value: '魏县', postcode: '056800' },
          { code: '130435', value: '曲周县', postcode: '057250' },
          { code: '130481', value: '武安市', postcode: '056300' }
        ]
      },
      {
        code: '130500',
        value: '邢台市',
        postcode: '054000',
        children: [
          { code: '130502', value: '桥东区', postcode: '054001' },
          { code: '130503', value: '桥西区', postcode: '054000' },
          { code: '130521', value: '邢台县', postcode: '054001' },
          { code: '130522', value: '临城县', postcode: '054300' },
          { code: '130523', value: '内丘县', postcode: '054200' },
          { code: '130524', value: '柏乡县', postcode: '055450' },
          { code: '130525', value: '隆尧县', postcode: '055350' },
          { code: '130526', value: '任县', postcode: '055150' },
          { code: '130527', value: '南和县', postcode: '054400' },
          { code: '130528', value: '宁晋县', postcode: '055550' },
          { code: '130529', value: '巨鹿县', postcode: '055250' },
          { code: '130530', value: '新河县', postcode: '051730' },
          { code: '130531', value: '广宗县', postcode: '054600' },
          { code: '130532', value: '平乡县', postcode: '054500' },
          { code: '130533', value: '威县', postcode: '054700' },
          { code: '130534', value: '清河县', postcode: '054800' },
          { code: '130535', value: '临西县', postcode: '054900' },
          { code: '130581', value: '南宫市', postcode: '055750' },
          { code: '130582', value: '沙河市', postcode: '054100' }
        ]
      },
      {
        code: '130600',
        value: '保定市',
        postcode: '071000',
        children: [
          { code: '130602', value: '竞秀区', postcode: '071052' },
          { code: '130606', value: '莲池区', postcode: '071000' },
          { code: '130607', value: '满城区', postcode: '071000' },
          { code: '130608', value: '清苑区', postcode: '072150' },
          { code: '130609', value: '徐水区', postcode: '071100' },
          { code: '130623', value: '涞水县', postcode: '074100' },
          { code: '130624', value: '阜平县', postcode: '073200' },
          { code: '130626', value: '定兴县', postcode: '072650' },
          { code: '130627', value: '唐县', postcode: '072350' },
          { code: '130628', value: '高阳县', postcode: '071500' },
          { code: '130629', value: '容城县', postcode: '071700' },
          { code: '130630', value: '涞源县', postcode: '074300' },
          { code: '130631', value: '望都县', postcode: '072450' },
          { code: '130632', value: '安新县', postcode: '071600' },
          { code: '130633', value: '易县', postcode: '074200' },
          { code: '130634', value: '曲阳县', postcode: '073100' },
          { code: '130635', value: '蠡县', postcode: '071400' },
          { code: '130636', value: '顺平县', postcode: '072250' },
          { code: '130637', value: '博野县', postcode: '071300' },
          { code: '130638', value: '雄县', postcode: '071800' },
          { code: '130681', value: '涿州市', postcode: '072750' },
          { code: '130682', value: '定州市', postcode: '053800' },
          { code: '130683', value: '安国市', postcode: '071200' },
          { code: '130684', value: '高碑店市', postcode: '074000' }
        ]
      },
      {
        code: '130700',
        value: '张家口市',
        postcode: '075000',
        children: [
          { code: '130702', value: '桥东区', postcode: '075000' },
          { code: '130703', value: '桥西区', postcode: '075061' },
          { code: '130705', value: '宣化区', postcode: '075100' },
          { code: '130706', value: '下花园区', postcode: '075300' },
          { code: '130708', value: '万全区', postcode: '075100' },
          { code: '130709', value: '崇礼区', postcode: '075100' },
          { code: '130722', value: '张北县', postcode: '076450' },
          { code: '130723', value: '康保县', postcode: '076650' },
          { code: '130724', value: '沽源县', postcode: '076550' },
          { code: '130725', value: '尚义县', postcode: '076750' },
          { code: '130726', value: '蔚县', postcode: '075700' },
          { code: '130727', value: '阳原县', postcode: '075800' },
          { code: '130728', value: '怀安县', postcode: '076150' },
          { code: '130730', value: '怀来县', postcode: '075400' },
          { code: '130731', value: '涿鹿县', postcode: '075600' },
          { code: '130732', value: '赤城县', postcode: '075500' }
        ]
      },
      {
        code: '130800',
        value: '承德市',
        postcode: '067000',
        children: [
          { code: '130802', value: '双桥区', postcode: '400900' },
          { code: '130803', value: '双滦区', postcode: '067000' },
          { code: '130804', value: '鹰手营子矿区', postcode: '067200' },
          { code: '130821', value: '承德县', postcode: '067400' },
          { code: '130822', value: '兴隆县', postcode: '067300' },
          { code: '130824', value: '滦平县', postcode: '068250' },
          { code: '130825', value: '隆化县', postcode: '068150' },
          { code: '130826', value: '丰宁满族自治县', postcode: '068350' },
          { code: '130827', value: '宽城满族自治县', postcode: '067600' },
          { code: '130828', value: '围场满族蒙古族自治县', postcode: '068450' },
          { code: '130881', value: '平泉市', postcode: '067500' }
        ]
      },
      {
        code: '130900',
        value: '沧州市',
        postcode: '061000',
        children: [
          { code: '130902', value: '新华区', postcode: '061000' },
          { code: '130903', value: '运河区', postcode: '061000' },
          { code: '130921', value: '沧县', postcode: '061000' },
          { code: '130922', value: '青县', postcode: '062650' },
          { code: '130923', value: '东光县', postcode: '061600' },
          { code: '130924', value: '海兴县', postcode: '061200' },
          { code: '130925', value: '盐山县', postcode: '061300' },
          { code: '130926', value: '肃宁县', postcode: '062350' },
          { code: '130927', value: '南皮县', postcode: '061500' },
          { code: '130928', value: '吴桥县', postcode: '061800' },
          { code: '130929', value: '献县', postcode: '062250' },
          { code: '130930', value: '孟村回族自治县', postcode: '061400' },
          { code: '130981', value: '泊头市', postcode: '062150' },
          { code: '130982', value: '任丘市', postcode: '062550' },
          { code: '130983', value: '黄骅市', postcode: '061100' },
          { code: '130984', value: '河间市', postcode: '062450' }
        ]
      },
      {
        code: '131000',
        value: '廊坊市',
        postcode: '065000',
        children: [
          { code: '131002', value: '安次区', postcode: '065000' },
          { code: '131003', value: '广阳区', postcode: '065000' },
          { code: '131022', value: '固安县', postcode: '065500' },
          { code: '131023', value: '永清县', postcode: '065600' },
          { code: '131024', value: '香河县', postcode: '065400' },
          { code: '131025', value: '大城县', postcode: '065900' },
          { code: '131026', value: '文安县', postcode: '065800' },
          { code: '131028', value: '大厂回族自治县', postcode: '065300' },
          { code: '131081', value: '霸州市', postcode: '065700' },
          { code: '131082', value: '三河市', postcode: '065200' }
        ]
      },
      {
        code: '131100',
        value: '衡水市',
        postcode: '053000',
        children: [
          { code: '131102', value: '桃城区', postcode: '053000' },
          { code: '131103', value: '冀州区', postcode: '053000' },
          { code: '131121', value: '枣强县', postcode: '053100' },
          { code: '131122', value: '武邑县', postcode: '053400' },
          { code: '131123', value: '武强县', postcode: '053300' },
          { code: '131124', value: '饶阳县', postcode: '053900' },
          { code: '131125', value: '安平县', postcode: '053600' },
          { code: '131126', value: '故城县', postcode: '253800' },
          { code: '131127', value: '景县', postcode: '053500' },
          { code: '131128', value: '阜城县', postcode: '053700' },
          { code: '131182', value: '深州市', postcode: '053800' }
        ]
      }
    ]
  },
  {
    code: '140000',
    value: '山西省',
    postcode: '0',
    children: [
      {
        code: '140100',
        value: '太原市',
        postcode: '030000',
        children: [
          { code: '140105', value: '小店区', postcode: '030032' },
          { code: '140106', value: '迎泽区', postcode: '030024' },
          { code: '140107', value: '杏花岭区', postcode: '030001' },
          { code: '140108', value: '尖草坪区', postcode: '030003' },
          { code: '140109', value: '万柏林区', postcode: '030027' },
          { code: '140110', value: '晋源区', postcode: '030025' },
          { code: '140121', value: '清徐县', postcode: '030400' },
          { code: '140122', value: '阳曲县', postcode: '030100' },
          { code: '140123', value: '娄烦县', postcode: '030300' },
          { code: '140181', value: '古交市', postcode: '030200' }
        ]
      },
      {
        code: '140200',
        value: '大同市',
        postcode: '037000',
        children: [
          { code: '140212', value: '新荣区', postcode: '037002' },
          { code: '140213', value: '平城区', postcode: '037006' },
          { code: '140214', value: '云冈区', postcode: '037001' },
          { code: '140215', value: '云州区', postcode: '037000' },
          { code: '140221', value: '阳高县', postcode: '038100' },
          { code: '140222', value: '天镇县', postcode: '038200' },
          { code: '140223', value: '广灵县', postcode: '037500' },
          { code: '140224', value: '灵丘县', postcode: '034400' },
          { code: '140225', value: '浑源县', postcode: '037400' },
          { code: '140226', value: '左云县', postcode: '037100' }
        ]
      },
      {
        code: '140300',
        value: '阳泉市',
        postcode: '045000',
        children: [
          { code: '140302', value: '城区', postcode: '045000' },
          { code: '140303', value: '矿区', postcode: '045000' },
          { code: '140311', value: '郊区', postcode: '045011' },
          { code: '140321', value: '平定县', postcode: '045200' },
          { code: '140322', value: '盂县', postcode: '045100' }
        ]
      },
      {
        code: '140400',
        value: '长治市',
        postcode: '046000',
        children: [
          { code: '140403', value: '潞州区', postcode: '046000' },
          { code: '140404', value: '上党区', postcode: '047100' },
          { code: '140405', value: '屯留区', postcode: '046100' },
          { code: '140406', value: '潞城区', postcode: '047500' },
          { code: '140423', value: '襄垣县', postcode: '046200' },
          { code: '140425', value: '平顺县', postcode: '047400' },
          { code: '140426', value: '黎城县', postcode: '047600' },
          { code: '140427', value: '壶关县', postcode: '047300' },
          { code: '140428', value: '长子县', postcode: '046600' },
          { code: '140429', value: '武乡县', postcode: '046300' },
          { code: '140430', value: '沁县', postcode: '046400' },
          { code: '140431', value: '沁源县', postcode: '046500' }
        ]
      },
      {
        code: '140500',
        value: '晋城市',
        postcode: '048000',
        children: [
          { code: '140502', value: '城区', postcode: '048000' },
          { code: '140521', value: '沁水县', postcode: '048200' },
          { code: '140522', value: '阳城县', postcode: '048100' },
          { code: '140524', value: '陵川县', postcode: '048300' },
          { code: '140525', value: '泽州县', postcode: '048012' },
          { code: '140581', value: '高平市', postcode: '048400' }
        ]
      },
      {
        code: '140600',
        value: '朔州市',
        postcode: '038500',
        children: [
          { code: '140602', value: '朔城区', postcode: '038500' },
          { code: '140603', value: '平鲁区', postcode: '038600' },
          { code: '140621', value: '山阴县', postcode: '036900' },
          { code: '140622', value: '应县', postcode: '037600' },
          { code: '140623', value: '右玉县', postcode: '037200' },
          { code: '140681', value: '怀仁市', postcode: '038300' }
        ]
      },
      {
        code: '140700',
        value: '晋中市',
        postcode: '038300',
        children: [
          { code: '140702', value: '榆次区', postcode: '030600' },
          { code: '140703', value: '太谷区', postcode: '030800' },
          { code: '140721', value: '榆社县', postcode: '031800' },
          { code: '140722', value: '左权县', postcode: '032600' },
          { code: '140723', value: '和顺县', postcode: '032700' },
          { code: '140724', value: '昔阳县', postcode: '045300' },
          { code: '140725', value: '寿阳县', postcode: '045400' },
          { code: '140727', value: '祁县', postcode: '030900' },
          { code: '140728', value: '平遥县', postcode: '031100' },
          { code: '140729', value: '灵石县', postcode: '031300' },
          { code: '140781', value: '介休市', postcode: '031200' }
        ]
      },
      {
        code: '140800',
        value: '运城市',
        postcode: '044000',
        children: [
          { code: '140802', value: '盐湖区', postcode: '044000' },
          { code: '140821', value: '临猗县', postcode: '044100' },
          { code: '140822', value: '万荣县', postcode: '044200' },
          { code: '140823', value: '闻喜县', postcode: '043800' },
          { code: '140824', value: '稷山县', postcode: '043200' },
          { code: '140825', value: '新绛县', postcode: '043100' },
          { code: '140826', value: '绛县', postcode: '043600' },
          { code: '140827', value: '垣曲县', postcode: '043700' },
          { code: '140828', value: '夏县', postcode: '044400' },
          { code: '140829', value: '平陆县', postcode: '044300' },
          { code: '140830', value: '芮城县', postcode: '044600' },
          { code: '140881', value: '永济市', postcode: '044500' },
          { code: '140882', value: '河津市', postcode: '043300' }
        ]
      },
      {
        code: '140900',
        value: '忻州市',
        postcode: '034000',
        children: [
          { code: '140902', value: '忻府区', postcode: '034000' },
          { code: '140921', value: '定襄县', postcode: '035400' },
          { code: '140922', value: '五台县', postcode: '035500' },
          { code: '140923', value: '代县', postcode: '034200' },
          { code: '140924', value: '繁峙县', postcode: '034300' },
          { code: '140925', value: '宁武县', postcode: '036700' },
          { code: '140926', value: '静乐县', postcode: '035100' },
          { code: '140927', value: '神池县', postcode: '036100' },
          { code: '140928', value: '五寨县', postcode: '036200' },
          { code: '140929', value: '岢岚县', postcode: '036300' },
          { code: '140930', value: '河曲县', postcode: '036500' },
          { code: '140931', value: '保德县', postcode: '036600' },
          { code: '140932', value: '偏关县', postcode: '036400' },
          { code: '140981', value: '原平市', postcode: '034100' }
        ]
      },
      {
        code: '141000',
        value: '临汾市',
        postcode: '041000',
        children: [
          { code: '141002', value: '尧都区', postcode: '041000' },
          { code: '141021', value: '曲沃县', postcode: '043400' },
          { code: '141022', value: '翼城县', postcode: '043500' },
          { code: '141023', value: '襄汾县', postcode: '041500' },
          { code: '141024', value: '洪洞县', postcode: '031600' },
          { code: '141025', value: '古县', postcode: '042400' },
          { code: '141026', value: '安泽县', postcode: '042500' },
          { code: '141027', value: '浮山县', postcode: '042600' },
          { code: '141028', value: '吉县', postcode: '042200' },
          { code: '141029', value: '乡宁县', postcode: '042100' },
          { code: '141030', value: '大宁县', postcode: '042300' },
          { code: '141031', value: '隰县', postcode: '041300' },
          { code: '141032', value: '永和县', postcode: '041400' },
          { code: '141033', value: '蒲县', postcode: '041200' },
          { code: '141034', value: '汾西县', postcode: '031500' },
          { code: '141081', value: '侯马市', postcode: '043007' },
          { code: '141082', value: '霍州市', postcode: '031400' }
        ]
      },
      {
        code: '141100',
        value: '吕梁市',
        postcode: '033000',
        children: [
          { code: '141102', value: '离石区', postcode: '033000' },
          { code: '141121', value: '文水县', postcode: '032100' },
          { code: '141122', value: '交城县', postcode: '030500' },
          { code: '141123', value: '兴县', postcode: '033600' },
          { code: '141124', value: '临县', postcode: '033200' },
          { code: '141125', value: '柳林县', postcode: '033300' },
          { code: '141126', value: '石楼县', postcode: '032500' },
          { code: '141127', value: '岚县', postcode: '033500' },
          { code: '141128', value: '方山县', postcode: '033100' },
          { code: '141129', value: '中阳县', postcode: '033400' },
          { code: '141130', value: '交口县', postcode: '032400' },
          { code: '141181', value: '孝义市', postcode: '032300' },
          { code: '141182', value: '汾阳市', postcode: '032200' }
        ]
      }
    ]
  },
  {
    code: '150000',
    value: '内蒙古自治区',
    postcode: '0',
    children: [
      {
        code: '150100',
        value: '呼和浩特市',
        postcode: '010000',
        children: [
          { code: '150102', value: '新城区', postcode: '010030' },
          { code: '150103', value: '回民区', postcode: '010030' },
          { code: '150104', value: '玉泉区', postcode: '010020' },
          { code: '150105', value: '赛罕区', postcode: '010020' },
          { code: '150121', value: '土默特左旗', postcode: '010100' },
          { code: '150122', value: '托克托县', postcode: '010200' },
          { code: '150123', value: '和林格尔县', postcode: '011500' },
          { code: '150124', value: '清水河县', postcode: '011600' },
          { code: '150125', value: '武川县', postcode: '011700' }
        ]
      },
      {
        code: '150200',
        value: '包头市',
        postcode: '014000',
        children: [
          { code: '150202', value: '东河区', postcode: '014040' },
          { code: '150203', value: '昆都仑区', postcode: '014010' },
          { code: '150204', value: '青山区', postcode: '014030' },
          { code: '150205', value: '石拐区', postcode: '014070' },
          { code: '150206', value: '白云鄂博矿区', postcode: '014080' },
          { code: '150207', value: '九原区', postcode: '014060' },
          { code: '150221', value: '土默特右旗', postcode: '014100' },
          { code: '150222', value: '固阳县', postcode: '014200' },
          { code: '150223', value: '达尔罕茂明安联合旗', postcode: '014500' }
        ]
      },
      {
        code: '150300',
        value: '乌海市',
        postcode: '016000',
        children: [
          { code: '150302', value: '海勃湾区', postcode: '016000' },
          { code: '150303', value: '海南区', postcode: '016030' },
          { code: '150304', value: '乌达区', postcode: '016040' }
        ]
      },
      {
        code: '150400',
        value: '赤峰市',
        postcode: '024000',
        children: [
          { code: '150402', value: '红山区', postcode: '024020' },
          { code: '150403', value: '元宝山区', postcode: '024076' },
          { code: '150404', value: '松山区', postcode: '024005' },
          { code: '150421', value: '阿鲁科尔沁旗', postcode: '025550' },
          { code: '150422', value: '巴林左旗', postcode: '025450' },
          { code: '150423', value: '巴林右旗', postcode: '025150' },
          { code: '150424', value: '林西县', postcode: '025250' },
          { code: '150425', value: '克什克腾旗', postcode: '025350' },
          { code: '150426', value: '翁牛特旗', postcode: '024500' },
          { code: '150428', value: '喀喇沁旗', postcode: '024400' },
          { code: '150429', value: '宁城县', postcode: '024200' },
          { code: '150430', value: '敖汉旗', postcode: '024300' }
        ]
      },
      {
        code: '150500',
        value: '通辽市',
        postcode: '028000',
        children: [
          { code: '150502', value: '科尔沁区', postcode: '028000' },
          { code: '150521', value: '科尔沁左翼中旗', postcode: '029300' },
          { code: '150522', value: '科尔沁左翼后旗', postcode: '028100' },
          { code: '150523', value: '开鲁县', postcode: '028400' },
          { code: '150524', value: '库伦旗', postcode: '028200' },
          { code: '150525', value: '奈曼旗', postcode: '028300' },
          { code: '150526', value: '扎鲁特旗', postcode: '029100' },
          { code: '150581', value: '霍林郭勒市', postcode: '029200' }
        ]
      },
      {
        code: '150600',
        value: '鄂尔多斯市',
        postcode: '017000',
        children: [
          { code: '150602', value: '东胜区', postcode: '017000' },
          { code: '150603', value: '康巴什区', postcode: '017010' },
          { code: '150621', value: '达拉特旗', postcode: '014300' },
          { code: '150622', value: '准格尔旗', postcode: '017100' },
          { code: '150623', value: '鄂托克前旗', postcode: '016200' },
          { code: '150624', value: '鄂托克旗', postcode: '016100' },
          { code: '150625', value: '杭锦旗', postcode: '017400' },
          { code: '150626', value: '乌审旗', postcode: '017300' },
          { code: '150627', value: '伊金霍洛旗', postcode: '017200' }
        ]
      },
      {
        code: '150700',
        value: '呼伦贝尔市',
        postcode: '021000',
        children: [
          { code: '150702', value: '海拉尔区', postcode: '021000' },
          { code: '150703', value: '扎赉诺尔区', postcode: '021000' },
          { code: '150721', value: '阿荣旗', postcode: '162750' },
          { code: '150722', value: '莫力达瓦达斡尔族自治旗', postcode: '162850' },
          { code: '150723', value: '鄂伦春自治旗', postcode: '165450' },
          { code: '150724', value: '鄂温克族自治旗', postcode: '021100' },
          { code: '150725', value: '陈巴尔虎旗', postcode: '021500' },
          { code: '150726', value: '新巴尔虎左旗', postcode: '021200' },
          { code: '150727', value: '新巴尔虎右旗', postcode: '021300' },
          { code: '150781', value: '满洲里市', postcode: '021400' },
          { code: '150782', value: '牙克石市', postcode: '022150' },
          { code: '150783', value: '扎兰屯市', postcode: '162650' },
          { code: '150784', value: '额尔古纳市', postcode: '022250' },
          { code: '150785', value: '根河市', postcode: '022350' }
        ]
      },
      {
        code: '150800',
        value: '巴彦淖尔市',
        postcode: '015000',
        children: [
          { code: '150802', value: '临河区', postcode: '015001' },
          { code: '150821', value: '五原县', postcode: '015100' },
          { code: '150822', value: '磴口县', postcode: '015200' },
          { code: '150823', value: '乌拉特前旗', postcode: '014400' },
          { code: '150824', value: '乌拉特中旗', postcode: '015300' },
          { code: '150825', value: '乌拉特后旗', postcode: '015500' },
          { code: '150826', value: '杭锦后旗', postcode: '015400' }
        ]
      },
      {
        code: '150900',
        value: '乌兰察布市',
        postcode: '012000',
        children: [
          { code: '150902', value: '集宁区', postcode: '012000' },
          { code: '150921', value: '卓资县', postcode: '012300' },
          { code: '150922', value: '化德县', postcode: '013350' },
          { code: '150923', value: '商都县', postcode: '013450' },
          { code: '150924', value: '兴和县', postcode: '013650' },
          { code: '150925', value: '凉城县', postcode: '013750' },
          { code: '150926', value: '察哈尔右翼前旗', postcode: '012200' },
          { code: '150927', value: '察哈尔右翼中旗', postcode: '013550' },
          { code: '150928', value: '察哈尔右翼后旗', postcode: '012400' },
          { code: '150929', value: '四子王旗', postcode: '011800' },
          { code: '150981', value: '丰镇市', postcode: '012100' }
        ]
      },
      {
        code: '152200',
        value: '兴安盟',
        postcode: '137400',
        children: [
          { code: '152201', value: '乌兰浩特市', postcode: '137400' },
          { code: '152202', value: '阿尔山市', postcode: '137400' },
          { code: '152221', value: '科尔沁右翼前旗', postcode: '137400' },
          { code: '152222', value: '科尔沁右翼中旗', postcode: '029400' },
          { code: '152223', value: '扎赉特旗', postcode: '137600' },
          { code: '152224', value: '突泉县', postcode: '137500' }
        ]
      },
      {
        code: '152500',
        value: '锡林郭勒盟',
        postcode: '026000',
        children: [
          { code: '152501', value: '二连浩特市', postcode: '012100' },
          { code: '152502', value: '锡林浩特市', postcode: '012100' },
          { code: '152522', value: '阿巴嘎旗', postcode: '012100' },
          { code: '152523', value: '苏尼特左旗', postcode: '012100' },
          { code: '152524', value: '苏尼特右旗', postcode: '012100' },
          { code: '152525', value: '东乌珠穆沁旗', postcode: '012100' },
          { code: '152526', value: '西乌珠穆沁旗', postcode: '012100' },
          { code: '152527', value: '太仆寺旗', postcode: '012100' },
          { code: '152528', value: '镶黄旗', postcode: '012100' },
          { code: '152529', value: '正镶白旗', postcode: '012100' },
          { code: '152530', value: '正蓝旗', postcode: '012100' },
          { code: '152531', value: '多伦县', postcode: '012100' }
        ]
      },
      {
        code: '152900',
        value: '阿拉善盟',
        postcode: '750300',
        children: [
          { code: '152921', value: '阿拉善左旗', postcode: '750300' },
          { code: '152922', value: '阿拉善右旗', postcode: '737300' },
          { code: '152923', value: '额济纳旗', postcode: '735400' }
        ]
      }
    ]
  },
  {
    code: '210000',
    value: '辽宁省',
    postcode: '0',
    children: [
      {
        code: '210100',
        value: '沈阳市',
        postcode: '110000',
        children: [
          { code: '210102', value: '和平区', postcode: '110001' },
          { code: '210103', value: '沈河区', postcode: '110013' },
          { code: '210104', value: '大东区', postcode: '110041' },
          { code: '210105', value: '皇姑区', postcode: '110031' },
          { code: '210106', value: '铁西区', postcode: '114013' },
          { code: '210111', value: '苏家屯区', postcode: '110101' },
          { code: '210112', value: '浑南区', postcode: '110101' },
          { code: '210113', value: '沈北新区', postcode: '110121' },
          { code: '210114', value: '于洪区', postcode: '110141' },
          { code: '210115', value: '辽中区', postcode: '110200' },
          { code: '210123', value: '康平县', postcode: '110500' },
          { code: '210124', value: '法库县', postcode: '110400' },
          { code: '210181', value: '新民市', postcode: '110300' }
        ]
      },
      {
        code: '210200',
        value: '大连市',
        postcode: '116000',
        children: [
          { code: '210202', value: '中山区', postcode: '116001' },
          { code: '210203', value: '西岗区', postcode: '116011' },
          { code: '210204', value: '沙河口区', postcode: '116021' },
          { code: '210211', value: '甘井子区', postcode: '116033' },
          { code: '210212', value: '旅顺口区', postcode: '116041' },
          { code: '210213', value: '金州区', postcode: '116100' },
          { code: '210214', value: '普兰店区', postcode: '116200' },
          { code: '210224', value: '长海县', postcode: '116500' },
          { code: '210281', value: '瓦房店市', postcode: '116300' },
          { code: '210283', value: '庄河市', postcode: '116400' }
        ]
      },
      {
        code: '210300',
        value: '鞍山市',
        postcode: '114000',
        children: [
          { code: '210302', value: '铁东区', postcode: '114001' },
          { code: '210303', value: '铁西区', postcode: '136000' },
          { code: '210304', value: '立山区', postcode: '114031' },
          { code: '210311', value: '千山区', postcode: '114041' },
          { code: '210321', value: '台安县', postcode: '114100' },
          { code: '210323', value: '岫岩满族自治县', postcode: '114300' },
          { code: '210381', value: '海城市', postcode: '114200' }
        ]
      },
      {
        code: '210400',
        value: '抚顺市',
        postcode: '113000',
        children: [
          { code: '210402', value: '新抚区', postcode: '113008' },
          { code: '210403', value: '东洲区', postcode: '113003' },
          { code: '210404', value: '望花区', postcode: '113001' },
          { code: '210411', value: '顺城区', postcode: '113006' },
          { code: '210421', value: '抚顺县', postcode: '113006' },
          { code: '210422', value: '新宾满族自治县', postcode: '113200' },
          { code: '210423', value: '清原满族自治县', postcode: '113300' }
        ]
      },
      {
        code: '210500',
        value: '本溪市',
        postcode: '117000',
        children: [
          { code: '210502', value: '平山区', postcode: '117000' },
          { code: '210503', value: '溪湖区', postcode: '117002' },
          { code: '210504', value: '明山区', postcode: '117021' },
          { code: '210505', value: '南芬区', postcode: '117014' },
          { code: '210521', value: '本溪满族自治县', postcode: '117100' },
          { code: '210522', value: '桓仁满族自治县', postcode: '117200' }
        ]
      },
      {
        code: '210600',
        value: '丹东市',
        postcode: '118000',
        children: [
          { code: '210602', value: '元宝区', postcode: '118000' },
          { code: '210603', value: '振兴区', postcode: '118002' },
          { code: '210604', value: '振安区', postcode: '118001' },
          { code: '210624', value: '宽甸满族自治县', postcode: '118200' },
          { code: '210681', value: '东港市', postcode: '118300' },
          { code: '210682', value: '凤城市', postcode: '118100' }
        ]
      },
      {
        code: '210700',
        value: '锦州市',
        postcode: '121000',
        children: [
          { code: '210702', value: '古塔区', postcode: '121001' },
          { code: '210703', value: '凌河区', postcode: '121000' },
          { code: '210711', value: '太和区', postcode: '121011' },
          { code: '210726', value: '黑山县', postcode: '121400' },
          { code: '210727', value: '义县', postcode: '121100' },
          { code: '210781', value: '凌海市', postcode: '121200' },
          { code: '210782', value: '北镇市', postcode: '121300' }
        ]
      },
      {
        code: '210800',
        value: '营口市',
        postcode: '115000',
        children: [
          { code: '210802', value: '站前区', postcode: '115002' },
          { code: '210803', value: '西市区', postcode: '115004' },
          { code: '210804', value: '鲅鱼圈区', postcode: '115004' },
          { code: '210811', value: '老边区', postcode: '115005' },
          { code: '210881', value: '盖州市', postcode: '115200' },
          { code: '210882', value: '大石桥市', postcode: '115100' }
        ]
      },
      {
        code: '210900',
        value: '阜新市',
        postcode: '123000',
        children: [
          { code: '210902', value: '海州区', postcode: '123000' },
          { code: '210903', value: '新邱区', postcode: '123005' },
          { code: '210904', value: '太平区', postcode: '123003' },
          { code: '210905', value: '清河门区', postcode: '123006' },
          { code: '210911', value: '细河区', postcode: '123000' },
          { code: '210921', value: '阜新蒙古族自治县', postcode: '123100' },
          { code: '210922', value: '彰武县', postcode: '123200' }
        ]
      },
      {
        code: '211000',
        value: '辽阳市',
        postcode: '111000',
        children: [
          { code: '211002', value: '白塔区', postcode: '111000' },
          { code: '211003', value: '文圣区', postcode: '111000' },
          { code: '211004', value: '宏伟区', postcode: '111003' },
          { code: '211005', value: '弓长岭区', postcode: '111008' },
          { code: '211011', value: '太子河区', postcode: '111000' },
          { code: '211021', value: '辽阳县', postcode: '111200' },
          { code: '211081', value: '灯塔市', postcode: '111300' }
        ]
      },
      {
        code: '211100',
        value: '盘锦市',
        postcode: '124000',
        children: [
          { code: '211102', value: '双台子区', postcode: '124000' },
          { code: '211103', value: '兴隆台区', postcode: '124010' },
          { code: '211104', value: '大洼区', postcode: '124200' },
          { code: '211122', value: '盘山县', postcode: '124000' }
        ]
      },
      {
        code: '211200',
        value: '铁岭市',
        postcode: '112000',
        children: [
          { code: '211202', value: '银州区', postcode: '112000' },
          { code: '211204', value: '清河区', postcode: '112003' },
          { code: '211221', value: '铁岭县', postcode: '112000' },
          { code: '211223', value: '西丰县', postcode: '112400' },
          { code: '211224', value: '昌图县', postcode: '112500' },
          { code: '211281', value: '调兵山市', postcode: '112700' },
          { code: '211282', value: '开原市', postcode: '112300' }
        ]
      },
      {
        code: '211300',
        value: '朝阳市',
        postcode: '122000',
        children: [
          { code: '211302', value: '双塔区', postcode: '122000' },
          { code: '211303', value: '龙城区', postcode: '122000' },
          { code: '211321', value: '朝阳县', postcode: '122000' },
          { code: '211322', value: '建平县', postcode: '122400' },
          { code: '211324', value: '喀喇沁左翼蒙古族自治县', postcode: '122300' },
          { code: '211381', value: '北票市', postcode: '122100' },
          { code: '211382', value: '凌源市', postcode: '122500' }
        ]
      },
      {
        code: '211400',
        value: '葫芦岛市',
        postcode: '125000',
        children: [
          { code: '211402', value: '连山区', postcode: '125001' },
          { code: '211403', value: '龙港区', postcode: '125003' },
          { code: '211404', value: '南票区', postcode: '125027' },
          { code: '211421', value: '绥中县', postcode: '125200' },
          { code: '211422', value: '建昌县', postcode: '125300' },
          { code: '211481', value: '兴城市', postcode: '125100' }
        ]
      }
    ]
  },
  {
    code: '220000',
    value: '吉林省',
    postcode: '0',
    children: [
      {
        code: '220100',
        value: '长春市',
        postcode: '130000',
        children: [
          { code: '220102', value: '南关区', postcode: '130022' },
          { code: '220103', value: '宽城区', postcode: '130051' },
          { code: '220104', value: '朝阳区', postcode: '130012' },
          { code: '220105', value: '二道区', postcode: '130031' },
          { code: '220106', value: '绿园区', postcode: '130062' },
          { code: '220112', value: '双阳区', postcode: '130600' },
          { code: '220113', value: '九台区', postcode: '130500' },
          { code: '220122', value: '农安县', postcode: '130200' },
          { code: '220182', value: '榆树市', postcode: '130400' },
          { code: '220183', value: '德惠市', postcode: '130300' }
        ]
      },
      {
        code: '220200',
        value: '吉林市',
        postcode: '132000',
        children: [
          { code: '220202', value: '昌邑区', postcode: '132002' },
          { code: '220203', value: '龙潭区', postcode: '132021' },
          { code: '220204', value: '船营区', postcode: '132011' },
          { code: '220211', value: '丰满区', postcode: '132013' },
          { code: '220221', value: '永吉县', postcode: '132200' },
          { code: '220281', value: '蛟河市', postcode: '132500' },
          { code: '220282', value: '桦甸市', postcode: '132400' },
          { code: '220283', value: '舒兰市', postcode: '132600' },
          { code: '220284', value: '磐石市', postcode: '132300' }
        ]
      },
      {
        code: '220300',
        value: '四平市',
        postcode: '136000',
        children: [
          { code: '220302', value: '铁西区', postcode: '136000' },
          { code: '220303', value: '铁东区', postcode: '136001' },
          { code: '220322', value: '梨树县', postcode: '136500' },
          { code: '220323', value: '伊通满族自治县', postcode: '130700' },
          { code: '220381', value: '公主岭市', postcode: '136100' },
          { code: '220382', value: '双辽市', postcode: '136400' }
        ]
      },
      {
        code: '220400',
        value: '辽源市',
        postcode: '136200',
        children: [
          { code: '220402', value: '龙山区', postcode: '136200' },
          { code: '220403', value: '西安区', postcode: '136201' },
          { code: '220421', value: '东丰县', postcode: '136300' },
          { code: '220422', value: '东辽县', postcode: '136600' }
        ]
      },
      {
        code: '220500',
        value: '通化市',
        postcode: '134000',
        children: [
          { code: '220502', value: '东昌区', postcode: '134001' },
          { code: '220503', value: '二道江区', postcode: '134003' },
          { code: '220521', value: '通化县', postcode: '134100' },
          { code: '220523', value: '辉南县', postcode: '135100' },
          { code: '220524', value: '柳河县', postcode: '135300' },
          { code: '220581', value: '梅河口市', postcode: '135000' },
          { code: '220582', value: '集安市', postcode: '134200' }
        ]
      },
      {
        code: '220600',
        value: '白山市',
        postcode: '134300',
        children: [
          { code: '220602', value: '浑江区', postcode: '134300' },
          { code: '220605', value: '江源区', postcode: '134300' },
          { code: '220621', value: '抚松县', postcode: '134500' },
          { code: '220622', value: '靖宇县', postcode: '135200' },
          { code: '220623', value: '长白朝鲜族自治县', postcode: '134400' },
          { code: '220681', value: '临江市', postcode: '134600' }
        ]
      },
      {
        code: '220700',
        value: '松原市',
        postcode: '138000',
        children: [
          { code: '220702', value: '宁江区', postcode: '138000' },
          { code: '220721', value: '前郭尔罗斯蒙古族自治县', postcode: '138000' },
          { code: '220722', value: '长岭县', postcode: '131500' },
          { code: '220723', value: '乾安县', postcode: '131400' },
          { code: '220781', value: '扶余市', postcode: '131200' }
        ]
      },
      {
        code: '220800',
        value: '白城市',
        postcode: '137000',
        children: [
          { code: '220802', value: '洮北区', postcode: '137000' },
          { code: '220821', value: '镇赉县', postcode: '137300' },
          { code: '220822', value: '通榆县', postcode: '137200' },
          { code: '220881', value: '洮南市', postcode: '137100' },
          { code: '220882', value: '大安市', postcode: '131300' }
        ]
      },
      {
        code: '222400',
        value: '延边朝鲜族自治州',
        postcode: '133000',
        children: [
          { code: '222401', value: '延吉市', postcode: '133000' },
          { code: '222402', value: '图们市', postcode: '133100' },
          { code: '222403', value: '敦化市', postcode: '133700' },
          { code: '222404', value: '珲春市', postcode: '133300' },
          { code: '222405', value: '龙井市', postcode: '133400' },
          { code: '222406', value: '和龙市', postcode: '133500' },
          { code: '222424', value: '汪清县', postcode: '133200' },
          { code: '222426', value: '安图县', postcode: '133600' }
        ]
      }
    ]
  },
  {
    code: '230000',
    value: '黑龙江省',
    postcode: '0',
    children: [
      {
        code: '230100',
        value: '哈尔滨市',
        postcode: '150000',
        children: [
          { code: '230102', value: '道里区', postcode: '150010' },
          { code: '230103', value: '南岗区', postcode: '150006' },
          { code: '230104', value: '道外区', postcode: '150020' },
          { code: '230108', value: '平房区', postcode: '150060' },
          { code: '230109', value: '松北区', postcode: '150028' },
          { code: '230110', value: '香坊区', postcode: '150036' },
          { code: '230111', value: '呼兰区', postcode: '150500' },
          { code: '230112', value: '阿城区', postcode: '150300' },
          { code: '230113', value: '双城区', postcode: '150100' },
          { code: '230123', value: '依兰县', postcode: '154800' },
          { code: '230124', value: '方正县', postcode: '150800' },
          { code: '230125', value: '宾县', postcode: '150400' },
          { code: '230126', value: '巴彦县', postcode: '151800' },
          { code: '230127', value: '木兰县', postcode: '151900' },
          { code: '230128', value: '通河县', postcode: '150900' },
          { code: '230129', value: '延寿县', postcode: '150700' },
          { code: '230183', value: '尚志市', postcode: '150600' },
          { code: '230184', value: '五常市', postcode: '150200' }
        ]
      },
      {
        code: '230200',
        value: '齐齐哈尔市',
        postcode: '161000',
        children: [
          { code: '230202', value: '龙沙区', postcode: '161000' },
          { code: '230203', value: '建华区', postcode: '161006' },
          { code: '230204', value: '铁锋区', postcode: '161000' },
          { code: '230205', value: '昂昂溪区', postcode: '161000' },
          { code: '230206', value: '富拉尔基区', postcode: '161041' },
          { code: '230207', value: '碾子山区', postcode: '161046' },
          { code: '230208', value: '梅里斯达斡尔族区', postcode: '161021' },
          { code: '230221', value: '龙江县', postcode: '161100' },
          { code: '230223', value: '依安县', postcode: '161500' },
          { code: '230224', value: '泰来县', postcode: '162400' },
          { code: '230225', value: '甘南县', postcode: '162100' },
          { code: '230227', value: '富裕县', postcode: '161200' },
          { code: '230229', value: '克山县', postcode: '161600' },
          { code: '230230', value: '克东县', postcode: '164800' },
          { code: '230231', value: '拜泉县', postcode: '164700' },
          { code: '230281', value: '讷河市', postcode: '161300' }
        ]
      },
      {
        code: '230300',
        value: '鸡西市',
        postcode: '158100',
        children: [
          { code: '230302', value: '鸡冠区', postcode: '158100' },
          { code: '230303', value: '恒山区', postcode: '158130' },
          { code: '230304', value: '滴道区', postcode: '158150' },
          { code: '230305', value: '梨树区', postcode: '158160' },
          { code: '230306', value: '城子河区', postcode: '158170' },
          { code: '230307', value: '麻山区', postcode: '158180' },
          { code: '230321', value: '鸡东县', postcode: '158200' },
          { code: '230381', value: '虎林市', postcode: '158400' },
          { code: '230382', value: '密山市', postcode: '158300' }
        ]
      },
      {
        code: '230400',
        value: '鹤岗市',
        postcode: '154100',
        children: [
          { code: '230402', value: '向阳区', postcode: '154100' },
          { code: '230403', value: '工农区', postcode: '154101' },
          { code: '230404', value: '南山区', postcode: '154104' },
          { code: '230405', value: '兴安区', postcode: '154102' },
          { code: '230406', value: '东山区', postcode: '522031' },
          { code: '230407', value: '兴山区', postcode: '154105' },
          { code: '230421', value: '萝北县', postcode: '154200' },
          { code: '230422', value: '绥滨县', postcode: '156200' }
        ]
      },
      {
        code: '230500',
        value: '双鸭山市',
        postcode: '155100',
        children: [
          { code: '230502', value: '尖山区', postcode: '155100' },
          { code: '230503', value: '岭东区', postcode: '155120' },
          { code: '230505', value: '四方台区', postcode: '155130' },
          { code: '230506', value: '宝山区', postcode: '155131' },
          { code: '230521', value: '集贤县', postcode: '155900' },
          { code: '230522', value: '友谊县', postcode: '155800' },
          { code: '230523', value: '宝清县', postcode: '155600' },
          { code: '230524', value: '饶河县', postcode: '155700' }
        ]
      },
      {
        code: '230600',
        value: '大庆市',
        postcode: '163000',
        children: [
          { code: '230602', value: '萨尔图区', postcode: '163001' },
          { code: '230603', value: '龙凤区', postcode: '163711' },
          { code: '230604', value: '让胡路区', postcode: '163712' },
          { code: '230605', value: '红岗区', postcode: '163511' },
          { code: '230606', value: '大同区', postcode: '163515' },
          { code: '230621', value: '肇州县', postcode: '166400' },
          { code: '230622', value: '肇源县', postcode: '166500' },
          { code: '230623', value: '林甸县', postcode: '166300' },
          { code: '230624', value: '杜尔伯特蒙古族自治县', postcode: '166200' }
        ]
      },
      {
        code: '230700',
        value: '伊春市',
        postcode: '153000',
        children: [
          { code: '230717', value: '伊美区', postcode: '153000' },
          { code: '230718', value: '乌翠区', postcode: '153013' },
          { code: '230719', value: '友好区', postcode: '153031' },
          { code: '230722', value: '嘉荫县', postcode: '153200' },
          { code: '230723', value: '汤旺县', postcode: '153037' },
          { code: '230724', value: '丰林县', postcode: '153036' },
          { code: '230725', value: '大箐山县', postcode: '153106' },
          { code: '230726', value: '南岔县', postcode: '153100' },
          { code: '230751', value: '金林区', postcode: '153026' },
          { code: '230781', value: '铁力市', postcode: '152500' }
        ]
      },
      {
        code: '230800',
        value: '佳木斯市',
        postcode: '154000',
        children: [
          { code: '230803', value: '向阳区', postcode: '154002' },
          { code: '230804', value: '前进区', postcode: '154002' },
          { code: '230805', value: '东风区', postcode: '154005' },
          { code: '230811', value: '郊区', postcode: '244000' },
          { code: '230822', value: '桦南县', postcode: '154400' },
          { code: '230826', value: '桦川县', postcode: '154300' },
          { code: '230828', value: '汤原县', postcode: '154700' },
          { code: '230881', value: '同江市', postcode: '156400' },
          { code: '230882', value: '富锦市', postcode: '156100' },
          { code: '230883', value: '抚远市', postcode: '156500' }
        ]
      },
      {
        code: '230900',
        value: '七台河市',
        postcode: '154600',
        children: [
          { code: '230902', value: '新兴区', postcode: '154604' },
          { code: '230903', value: '桃山区', postcode: '154600' },
          { code: '230904', value: '茄子河区', postcode: '154622' },
          { code: '230921', value: '勃利县', postcode: '154500' }
        ]
      },
      {
        code: '231000',
        value: '牡丹江市',
        postcode: '157000',
        children: [
          { code: '231002', value: '东安区', postcode: '157000' },
          { code: '231003', value: '阳明区', postcode: '157013' },
          { code: '231004', value: '爱民区', postcode: '157009' },
          { code: '231005', value: '西安区', postcode: '157000' },
          { code: '231025', value: '林口县', postcode: '157600' },
          { code: '231081', value: '绥芬河市', postcode: '157300' },
          { code: '231083', value: '海林市', postcode: '157100' },
          { code: '231084', value: '宁安市', postcode: '157400' },
          { code: '231085', value: '穆棱市', postcode: '157500' },
          { code: '231086', value: '东宁市', postcode: '157200' }
        ]
      },
      {
        code: '231100',
        value: '黑河市',
        postcode: '164300',
        children: [
          { code: '231102', value: '爱辉区', postcode: '164300' },
          { code: '231123', value: '逊克县', postcode: '164400' },
          { code: '231124', value: '孙吴县', postcode: '164200' },
          { code: '231181', value: '北安市', postcode: '164000' },
          { code: '231182', value: '五大连池市', postcode: '164100' },
          { code: '231183', value: '嫩江市', postcode: '161400' }
        ]
      },
      {
        code: '231200',
        value: '绥化市',
        postcode: '152000',
        children: [
          { code: '231202', value: '北林区', postcode: '152000' },
          { code: '231221', value: '望奎县', postcode: '152100' },
          { code: '231222', value: '兰西县', postcode: '151500' },
          { code: '231223', value: '青冈县', postcode: '151600' },
          { code: '231224', value: '庆安县', postcode: '152400' },
          { code: '231225', value: '明水县', postcode: '151700' },
          { code: '231226', value: '绥棱县', postcode: '152200' },
          { code: '231281', value: '安达市', postcode: '151400' },
          { code: '231282', value: '肇东市', postcode: '151100' },
          { code: '231283', value: '海伦市', postcode: '152300' }
        ]
      },
      {
        code: '232700',
        value: '大兴安岭地区',
        postcode: '165000',
        children: [
          { code: '232701', value: '漠河市', postcode: '165300' },
          { code: '232721', value: '呼玛县', postcode: '165100' },
          { code: '232722', value: '塔河县', postcode: '165200' }
        ]
      }
    ]
  },
  {
    code: '310000',
    value: '上海市',
    postcode: '200000',
    children: [
      {
        code: '310100',
        value: '上海市',
        postcode: '200000',
        children: [
          { code: '310101', value: '黄浦区', postcode: '200001' },
          { code: '310104', value: '徐汇区', postcode: '200030' },
          { code: '310105', value: '长宁区', postcode: '200050' },
          { code: '310106', value: '静安区', postcode: '200050' },
          { code: '310107', value: '普陀区', postcode: '200333' },
          { code: '310109', value: '虹口区', postcode: '200080' },
          { code: '310110', value: '杨浦区', postcode: '200082' },
          { code: '310112', value: '闵行区', postcode: '201100' },
          { code: '310113', value: '宝山区', postcode: '201900' },
          { code: '310114', value: '嘉定区', postcode: '201800' },
          { code: '310115', value: '浦东新区', postcode: '200135' },
          { code: '310116', value: '金山区', postcode: '200540' },
          { code: '310117', value: '松江区', postcode: '201600' },
          { code: '310118', value: '青浦区', postcode: '201700' },
          { code: '310120', value: '奉贤区', postcode: '201400' },
          { code: '310151', value: '崇明区', postcode: '202150' }
        ]
      }
    ]
  },
  {
    code: '320000',
    value: '江苏省',
    postcode: '0',
    children: [
      {
        code: '320100',
        value: '南京市',
        postcode: '210000',
        children: [
          { code: '320102', value: '玄武区', postcode: '210018' },
          { code: '320104', value: '秦淮区', postcode: '210001' },
          { code: '320105', value: '建邺区', postcode: '210004' },
          { code: '320106', value: '鼓楼区', postcode: '210009' },
          { code: '320111', value: '浦口区', postcode: '211800' },
          { code: '320113', value: '栖霞区', postcode: '210046' },
          { code: '320114', value: '雨花台区', postcode: '210012' },
          { code: '320115', value: '江宁区', postcode: '211100' },
          { code: '320116', value: '六合区', postcode: '211500' },
          { code: '320117', value: '溧水区', postcode: '211200' },
          { code: '320118', value: '高淳区', postcode: '211300' }
        ]
      },
      {
        code: '320200',
        value: '无锡市',
        postcode: '214000',
        children: [
          { code: '320205', value: '锡山区', postcode: '214021' },
          { code: '320206', value: '惠山区', postcode: '214021' },
          { code: '320211', value: '滨湖区', postcode: '214062' },
          { code: '320213', value: '梁溪区', postcode: '214400' },
          { code: '320214', value: '新吴区', postcode: '214200' },
          { code: '320281', value: '江阴市', postcode: '214400' },
          { code: '320282', value: '宜兴市', postcode: '214200' }
        ]
      },
      {
        code: '320300',
        value: '徐州市',
        postcode: '221000',
        children: [
          { code: '320302', value: '鼓楼区', postcode: '221005' },
          { code: '320303', value: '云龙区', postcode: '221009' },
          { code: '320305', value: '贾汪区', postcode: '221011' },
          { code: '320311', value: '泉山区', postcode: '221006' },
          { code: '320312', value: '铜山区', postcode: '221000' },
          { code: '320321', value: '丰县', postcode: '221700' },
          { code: '320322', value: '沛县', postcode: '221600' },
          { code: '320324', value: '睢宁县', postcode: '221200' },
          { code: '320381', value: '新沂市', postcode: '221400' },
          { code: '320382', value: '邳州市', postcode: '221300' }
        ]
      },
      {
        code: '320400',
        value: '常州市',
        postcode: '213000',
        children: [
          { code: '320402', value: '天宁区', postcode: '213003' },
          { code: '320404', value: '钟楼区', postcode: '213002' },
          { code: '320411', value: '新北区', postcode: '213001' },
          { code: '320412', value: '武进区', postcode: '213161' },
          { code: '320413', value: '金坛区', postcode: '213200' },
          { code: '320481', value: '溧阳市', postcode: '213300' }
        ]
      },
      {
        code: '320500',
        value: '苏州市',
        postcode: '215000',
        children: [
          { code: '320505', value: '虎丘区', postcode: '215004' },
          { code: '320506', value: '吴中区', postcode: '215128' },
          { code: '320507', value: '相城区', postcode: '215131' },
          { code: '320508', value: '姑苏区', postcode: '215000' },
          { code: '320509', value: '吴江区', postcode: '215000' },
          { code: '320581', value: '常熟市', postcode: '215500' },
          { code: '320582', value: '张家港市', postcode: '215600' },
          { code: '320583', value: '昆山市', postcode: '215300' },
          { code: '320585', value: '太仓市', postcode: '215400' }
        ]
      },
      {
        code: '320600',
        value: '南通市',
        postcode: '226000',
        children: [
          { code: '320602', value: '崇川区', postcode: '226001' },
          { code: '320611', value: '港闸区', postcode: '226001' },
          { code: '320612', value: '通州区', postcode: '226300' },
          { code: '320623', value: '如东县', postcode: '226400' },
          { code: '320681', value: '启东市', postcode: '226200' },
          { code: '320682', value: '如皋市', postcode: '226500' },
          { code: '320684', value: '海门市', postcode: '226100' },
          { code: '320685', value: '海安市', postcode: '226600' }
        ]
      },
      {
        code: '320700',
        value: '连云港市',
        postcode: '222000',
        children: [
          { code: '320703', value: '连云区', postcode: '222042' },
          { code: '320706', value: '海州区', postcode: '222023' },
          { code: '320707', value: '赣榆区', postcode: '222100' },
          { code: '320722', value: '东海县', postcode: '222300' },
          { code: '320723', value: '灌云县', postcode: '222200' },
          { code: '320724', value: '灌南县', postcode: '223500' }
        ]
      },
      {
        code: '320800',
        value: '淮安市',
        postcode: '223001',
        children: [
          { code: '320803', value: '淮安区', postcode: '223001' },
          { code: '320804', value: '淮阴区', postcode: '223300' },
          { code: '320812', value: '清江浦区', postcode: '223002' },
          { code: '320813', value: '洪泽区', postcode: '223100' },
          { code: '320826', value: '涟水县', postcode: '223400' },
          { code: '320830', value: '盱眙县', postcode: '211700' },
          { code: '320831', value: '金湖县', postcode: '211600' }
        ]
      },
      {
        code: '320900',
        value: '盐城市',
        postcode: '224000',
        children: [
          { code: '320902', value: '亭湖区', postcode: '224005' },
          { code: '320903', value: '盐都区', postcode: '224055' },
          { code: '320904', value: '大丰区', postcode: '224100' },
          { code: '320921', value: '响水县', postcode: '224600' },
          { code: '320922', value: '滨海县', postcode: '224500' },
          { code: '320923', value: '阜宁县', postcode: '224400' },
          { code: '320924', value: '射阳县', postcode: '224300' },
          { code: '320925', value: '建湖县', postcode: '224700' },
          { code: '320981', value: '东台市', postcode: '224200' }
        ]
      },
      {
        code: '321000',
        value: '扬州市',
        postcode: '225000',
        children: [
          { code: '321002', value: '广陵区', postcode: '225002' },
          { code: '321003', value: '邗江区', postcode: '225002' },
          { code: '321012', value: '江都区', postcode: '225200' },
          { code: '321023', value: '宝应县', postcode: '225800' },
          { code: '321081', value: '仪征市', postcode: '211400' },
          { code: '321084', value: '高邮市', postcode: '225600' }
        ]
      },
      {
        code: '321100',
        value: '镇江市',
        postcode: '212000',
        children: [
          { code: '321102', value: '京口区', postcode: '212001' },
          { code: '321111', value: '润州区', postcode: '212004' },
          { code: '321112', value: '丹徒区', postcode: '212001' },
          { code: '321181', value: '丹阳市', postcode: '212300' },
          { code: '321182', value: '扬中市', postcode: '212200' },
          { code: '321183', value: '句容市', postcode: '212400' }
        ]
      },
      {
        code: '321200',
        value: '泰州市',
        postcode: '225300',
        children: [
          { code: '321202', value: '海陵区', postcode: '225300' },
          { code: '321203', value: '高港区', postcode: '225321' },
          { code: '321204', value: '姜堰区', postcode: '225500' },
          { code: '321281', value: '兴化市', postcode: '225700' },
          { code: '321282', value: '靖江市', postcode: '214500' },
          { code: '321283', value: '泰兴市', postcode: '225400' }
        ]
      },
      {
        code: '321300',
        value: '宿迁市',
        postcode: '223800',
        children: [
          { code: '321302', value: '宿城区', postcode: '223800' },
          { code: '321311', value: '宿豫区', postcode: '223800' },
          { code: '321322', value: '沭阳县', postcode: '223600' },
          { code: '321323', value: '泗阳县', postcode: '223700' },
          { code: '321324', value: '泗洪县', postcode: '223900' }
        ]
      }
    ]
  },
  {
    code: '330000',
    value: '浙江省',
    postcode: '0',
    children: [
      {
        code: '330100',
        value: '杭州市',
        postcode: '310000',
        children: [
          { code: '330102', value: '上城区', postcode: '310002' },
          { code: '330103', value: '下城区', postcode: '310006' },
          { code: '330104', value: '江干区', postcode: '310016' },
          { code: '330105', value: '拱墅区', postcode: '310011' },
          { code: '330106', value: '西湖区', postcode: '310013' },
          { code: '330108', value: '滨江区', postcode: '310051' },
          { code: '330109', value: '萧山区', postcode: '311200' },
          { code: '330110', value: '余杭区', postcode: '311100' },
          { code: '330111', value: '富阳区', postcode: '311400' },
          { code: '330112', value: '临安区', postcode: '311300' },
          { code: '330122', value: '桐庐县', postcode: '311500' },
          { code: '330127', value: '淳安县', postcode: '311700' },
          { code: '330182', value: '建德市', postcode: '311600' }
        ]
      },
      {
        code: '330200',
        value: '宁波市',
        postcode: '315000',
        children: [
          { code: '330203', value: '海曙区', postcode: '315000' },
          { code: '330205', value: '江北区', postcode: '315040' },
          { code: '330206', value: '北仑区', postcode: '315800' },
          { code: '330211', value: '镇海区', postcode: '315200' },
          { code: '330212', value: '鄞州区', postcode: '315100' },
          { code: '330213', value: '奉化区', postcode: '315500' },
          { code: '330225', value: '象山县', postcode: '315700' },
          { code: '330226', value: '宁海县', postcode: '315600' },
          { code: '330281', value: '余姚市', postcode: '315400' },
          { code: '330282', value: '慈溪市', postcode: '315300' }
        ]
      },
      {
        code: '330300',
        value: '温州市',
        postcode: '325000',
        children: [
          { code: '330302', value: '鹿城区', postcode: '325000' },
          { code: '330303', value: '龙湾区', postcode: '325013' },
          { code: '330304', value: '瓯海区', postcode: '325005' },
          { code: '330305', value: '洞头区', postcode: '325700' },
          { code: '330324', value: '永嘉县', postcode: '315100' },
          { code: '330326', value: '平阳县', postcode: '325400' },
          { code: '330327', value: '苍南县', postcode: '325800' },
          { code: '330328', value: '文成县', postcode: '325300' },
          { code: '330329', value: '泰顺县', postcode: '325500' },
          { code: '330381', value: '瑞安市', postcode: '325200' },
          { code: '330382', value: '乐清市', postcode: '325600' },
          { code: '330383', value: '龙港市', postcode: '325802' }
        ]
      },
      {
        code: '330400',
        value: '嘉兴市',
        postcode: '314000',
        children: [
          { code: '330402', value: '南湖区', postcode: '314001' },
          { code: '330411', value: '秀洲区', postcode: '314001' },
          { code: '330421', value: '嘉善县', postcode: '314100' },
          { code: '330424', value: '海盐县', postcode: '314300' },
          { code: '330481', value: '海宁市', postcode: '314400' },
          { code: '330482', value: '平湖市', postcode: '314200' },
          { code: '330483', value: '桐乡市', postcode: '314500' }
        ]
      },
      {
        code: '330500',
        value: '湖州市',
        postcode: '313000',
        children: [
          { code: '330502', value: '吴兴区', postcode: '313000' },
          { code: '330503', value: '南浔区', postcode: '313009' },
          { code: '330521', value: '德清县', postcode: '313200' },
          { code: '330522', value: '长兴县', postcode: '313100' },
          { code: '330523', value: '安吉县', postcode: '313300' }
        ]
      },
      {
        code: '330600',
        value: '绍兴市',
        postcode: '312000',
        children: [
          { code: '330602', value: '越城区', postcode: '312000' },
          { code: '330603', value: '柯桥区', postcode: '312000' },
          { code: '330604', value: '上虞区', postcode: '312300' },
          { code: '330624', value: '新昌县', postcode: '312500' },
          { code: '330681', value: '诸暨市', postcode: '311800' },
          { code: '330683', value: '嵊州市', postcode: '312400' }
        ]
      },
      {
        code: '330700',
        value: '金华市',
        postcode: '321000',
        children: [
          { code: '330702', value: '婺城区', postcode: '321000' },
          { code: '330703', value: '金东区', postcode: '321000' },
          { code: '330723', value: '武义县', postcode: '321200' },
          { code: '330726', value: '浦江县', postcode: '322200' },
          { code: '330727', value: '磐安县', postcode: '322300' },
          { code: '330781', value: '兰溪市', postcode: '321100' },
          { code: '330782', value: '义乌市', postcode: '322000' },
          { code: '330783', value: '东阳市', postcode: '322100' },
          { code: '330784', value: '永康市', postcode: '321300' }
        ]
      },
      {
        code: '330800',
        value: '衢州市',
        postcode: '324000',
        children: [
          { code: '330802', value: '柯城区', postcode: '324100' },
          { code: '330803', value: '衢江区', postcode: '324022' },
          { code: '330822', value: '常山县', postcode: '324200' },
          { code: '330824', value: '开化县', postcode: '324300' },
          { code: '330825', value: '龙游县', postcode: '324400' },
          { code: '330881', value: '江山市', postcode: '324100' }
        ]
      },
      {
        code: '330900',
        value: '舟山市',
        postcode: '316000',
        children: [
          { code: '330902', value: '定海区', postcode: '316000' },
          { code: '330903', value: '普陀区', postcode: '316100' },
          { code: '330921', value: '岱山县', postcode: '316200' },
          { code: '330922', value: '嵊泗县', postcode: '202450' }
        ]
      },
      {
        code: '331000',
        value: '台州市',
        postcode: '318000',
        children: [
          { code: '331002', value: '椒江区', postcode: '318000' },
          { code: '331003', value: '黄岩区', postcode: '318020' },
          { code: '331004', value: '路桥区', postcode: '318050' },
          { code: '331022', value: '三门县', postcode: '317100' },
          { code: '331023', value: '天台县', postcode: '317200' },
          { code: '331024', value: '仙居县', postcode: '317300' },
          { code: '331081', value: '温岭市', postcode: '317500' },
          { code: '331082', value: '临海市', postcode: '317000' },
          { code: '331083', value: '玉环市', postcode: '317600' }
        ]
      },
      {
        code: '331100',
        value: '丽水市',
        postcode: '323000',
        children: [
          { code: '331102', value: '莲都区', postcode: '323000' },
          { code: '331121', value: '青田县', postcode: '323900' },
          { code: '331122', value: '缙云县', postcode: '321400' },
          { code: '331123', value: '遂昌县', postcode: '323300' },
          { code: '331124', value: '松阳县', postcode: '323400' },
          { code: '331125', value: '云和县', postcode: '323600' },
          { code: '331126', value: '庆元县', postcode: '323800' },
          { code: '331127', value: '景宁畲族自治县', postcode: '323500' },
          { code: '331181', value: '龙泉市', postcode: '323700' }
        ]
      }
    ]
  },
  {
    code: '340000',
    value: '安徽省',
    postcode: '0',
    children: [
      {
        code: '340100',
        value: '合肥市',
        postcode: '230000',
        children: [
          { code: '340102', value: '瑶海区', postcode: '230011' },
          { code: '340103', value: '庐阳区', postcode: '230001' },
          { code: '340104', value: '蜀山区', postcode: '230031' },
          { code: '340111', value: '包河区', postcode: '230041' },
          { code: '340121', value: '长丰县', postcode: '231100' },
          { code: '340122', value: '肥东县', postcode: '231600' },
          { code: '340123', value: '肥西县', postcode: '231200' },
          { code: '340124', value: '庐江县', postcode: '231500' },
          { code: '340181', value: '巢湖市', postcode: '238000' }
        ]
      },
      {
        code: '340200',
        value: '芜湖市',
        postcode: '241000',
        children: [
          { code: '340202', value: '镜湖区', postcode: '241000' },
          { code: '340203', value: '弋江区', postcode: '241000' },
          { code: '340207', value: '鸠江区', postcode: '241000' },
          { code: '340208', value: '三山区', postcode: '241000' },
          { code: '340221', value: '芜湖县', postcode: '241100' },
          { code: '340222', value: '繁昌县', postcode: '241200' },
          { code: '340223', value: '南陵县', postcode: '242400' },
          { code: '340281', value: '无为市', postcode: '238300' }
        ]
      },
      {
        code: '340300',
        value: '蚌埠市',
        postcode: '233000',
        children: [
          { code: '340302', value: '龙子湖区', postcode: '233000' },
          { code: '340303', value: '蚌山区', postcode: '233000' },
          { code: '340304', value: '禹会区', postcode: '233000' },
          { code: '340311', value: '淮上区', postcode: '233000' },
          { code: '340321', value: '怀远县', postcode: '233400' },
          { code: '340322', value: '五河县', postcode: '233300' },
          { code: '340323', value: '固镇县', postcode: '233700' }
        ]
      },
      {
        code: '340400',
        value: '淮南市',
        postcode: '232000',
        children: [
          { code: '340402', value: '大通区', postcode: '232033' },
          { code: '340403', value: '田家庵区', postcode: '232000' },
          { code: '340404', value: '谢家集区', postcode: '232052' },
          { code: '340405', value: '八公山区', postcode: '232072' },
          { code: '340406', value: '潘集区', postcode: '232082' },
          { code: '340421', value: '凤台县', postcode: '232100' },
          { code: '340422', value: '寿县', postcode: '232100' }
        ]
      },
      {
        code: '340500',
        value: '马鞍山市',
        postcode: '243000',
        children: [
          { code: '340503', value: '花山区', postcode: '243000' },
          { code: '340504', value: '雨山区', postcode: '243071' },
          { code: '340506', value: '博望区', postcode: '243000' },
          { code: '340521', value: '当涂县', postcode: '243100' },
          { code: '340522', value: '含山县', postcode: '238100' },
          { code: '340523', value: '和县', postcode: '238200' }
        ]
      },
      {
        code: '340600',
        value: '淮北市',
        postcode: '235000',
        children: [
          { code: '340602', value: '杜集区', postcode: '235000' },
          { code: '340603', value: '相山区', postcode: '235000' },
          { code: '340604', value: '烈山区', postcode: '235000' },
          { code: '340621', value: '濉溪县', postcode: '235100' }
        ]
      },
      {
        code: '340700',
        value: '铜陵市',
        postcode: '244000',
        children: [
          { code: '340705', value: '铜官区', postcode: '244000' },
          { code: '340706', value: '义安区', postcode: '244000' },
          { code: '340711', value: '郊区', postcode: '244000' },
          { code: '340722', value: '枞阳县', postcode: '244100' }
        ]
      },
      {
        code: '340800',
        value: '安庆市',
        postcode: '246000',
        children: [
          { code: '340802', value: '迎江区', postcode: '246001' },
          { code: '340803', value: '大观区', postcode: '246002' },
          { code: '340811', value: '宜秀区', postcode: '246003' },
          { code: '340822', value: '怀宁县', postcode: '246100' },
          { code: '340825', value: '太湖县', postcode: '246400' },
          { code: '340826', value: '宿松县', postcode: '246500' },
          { code: '340827', value: '望江县', postcode: '246200' },
          { code: '340828', value: '岳西县', postcode: '246600' },
          { code: '340881', value: '桐城市', postcode: '231400' },
          { code: '340882', value: '潜山市', postcode: '246300' }
        ]
      },
      {
        code: '341000',
        value: '黄山市',
        postcode: '245000',
        children: [
          { code: '341002', value: '屯溪区', postcode: '245000' },
          { code: '341003', value: '黄山区', postcode: '242700' },
          { code: '341004', value: '徽州区', postcode: '245061' },
          { code: '341021', value: '歙县', postcode: '245200' },
          { code: '341022', value: '休宁县', postcode: '245400' },
          { code: '341023', value: '黟县', postcode: '245500' },
          { code: '341024', value: '祁门县', postcode: '245600' }
        ]
      },
      {
        code: '341100',
        value: '滁州市',
        postcode: '239000',
        children: [
          { code: '341102', value: '琅琊区', postcode: '239000' },
          { code: '341103', value: '南谯区', postcode: '239000' },
          { code: '341122', value: '来安县', postcode: '239200' },
          { code: '341124', value: '全椒县', postcode: '239500' },
          { code: '341125', value: '定远县', postcode: '233200' },
          { code: '341126', value: '凤阳县', postcode: '233100' },
          { code: '341181', value: '天长市', postcode: '239300' },
          { code: '341182', value: '明光市', postcode: '239400' }
        ]
      },
      {
        code: '341200',
        value: '阜阳市',
        postcode: '236000',
        children: [
          { code: '341202', value: '颍州区', postcode: '236001' },
          { code: '341203', value: '颍东区', postcode: '236058' },
          { code: '341204', value: '颍泉区', postcode: '236045' },
          { code: '341221', value: '临泉县', postcode: '236400' },
          { code: '341222', value: '太和县', postcode: '236600' },
          { code: '341225', value: '阜南县', postcode: '236300' },
          { code: '341226', value: '颍上县', postcode: '236200' },
          { code: '341282', value: '界首市', postcode: '236500' }
        ]
      },
      {
        code: '341300',
        value: '宿州市',
        postcode: '234000',
        children: [
          { code: '341302', value: '埇桥区', postcode: '234000' },
          { code: '341321', value: '砀山县', postcode: '235300' },
          { code: '341322', value: '萧县', postcode: '235200' },
          { code: '341323', value: '灵璧县', postcode: '234200' },
          { code: '341324', value: '泗县', postcode: '234300' }
        ]
      },
      {
        code: '341500',
        value: '六安市',
        postcode: '237000',
        children: [
          { code: '341502', value: '金安区', postcode: '237000' },
          { code: '341503', value: '裕安区', postcode: '237010' },
          { code: '341504', value: '叶集区', postcode: '237431' },
          { code: '341522', value: '霍邱县', postcode: '237400' },
          { code: '341523', value: '舒城县', postcode: '231300' },
          { code: '341524', value: '金寨县', postcode: '237300' },
          { code: '341525', value: '霍山县', postcode: '237200' }
        ]
      },
      {
        code: '341600',
        value: '亳州市',
        postcode: '236000',
        children: [
          { code: '341602', value: '谯城区', postcode: '236800' },
          { code: '341621', value: '涡阳县', postcode: '233600' },
          { code: '341622', value: '蒙城县', postcode: '233500' },
          { code: '341623', value: '利辛县', postcode: '236700' }
        ]
      },
      {
        code: '341700',
        value: '池州市',
        postcode: '247100',
        children: [
          { code: '341702', value: '贵池区', postcode: '247100' },
          { code: '341721', value: '东至县', postcode: '247200' },
          { code: '341722', value: '石台县', postcode: '245100' },
          { code: '341723', value: '青阳县', postcode: '242800' }
        ]
      },
      {
        code: '341800',
        value: '宣城市',
        postcode: '242000',
        children: [
          { code: '341802', value: '宣州区', postcode: '242000' },
          { code: '341821', value: '郎溪县', postcode: '242100' },
          { code: '341823', value: '泾县', postcode: '242500' },
          { code: '341824', value: '绩溪县', postcode: '245300' },
          { code: '341825', value: '旌德县', postcode: '242600' },
          { code: '341881', value: '宁国市', postcode: '242300' },
          { code: '341882', value: '广德市', postcode: '242200' }
        ]
      }
    ]
  },
  {
    code: '350000',
    value: '福建省',
    postcode: '0',
    children: [
      {
        code: '350100',
        value: '福州市',
        postcode: '350000',
        children: [
          { code: '350102', value: '鼓楼区', postcode: '350001' },
          { code: '350103', value: '台江区', postcode: '350004' },
          { code: '350104', value: '仓山区', postcode: '350007' },
          { code: '350105', value: '马尾区', postcode: '350015' },
          { code: '350111', value: '晋安区', postcode: '350011' },
          { code: '350112', value: '长乐区', postcode: '350200' },
          { code: '350121', value: '闽侯县', postcode: '350100' },
          { code: '350122', value: '连江县', postcode: '350500' },
          { code: '350123', value: '罗源县', postcode: '350600' },
          { code: '350124', value: '闽清县', postcode: '350800' },
          { code: '350125', value: '永泰县', postcode: '350700' },
          { code: '350128', value: '平潭县', postcode: '350400' },
          { code: '350181', value: '福清市', postcode: '350300' }
        ]
      },
      {
        code: '350200',
        value: '厦门市',
        postcode: '361000',
        children: [
          { code: '350203', value: '思明区', postcode: '361001' },
          { code: '350205', value: '海沧区', postcode: '361026' },
          { code: '350206', value: '湖里区', postcode: '361006' },
          { code: '350211', value: '集美区', postcode: '361021' },
          { code: '350212', value: '同安区', postcode: '361100' },
          { code: '350213', value: '翔安区', postcode: '361101' }
        ]
      },
      {
        code: '350300',
        value: '莆田市',
        postcode: '351100',
        children: [
          { code: '350302', value: '城厢区', postcode: '351100' },
          { code: '350303', value: '涵江区', postcode: '351111' },
          { code: '350304', value: '荔城区', postcode: '351100' },
          { code: '350305', value: '秀屿区', postcode: '351152' },
          { code: '350322', value: '仙游县', postcode: '351200' }
        ]
      },
      {
        code: '350400',
        value: '三明市',
        postcode: '365000',
        children: [
          { code: '350402', value: '梅列区', postcode: '365000' },
          { code: '350403', value: '三元区', postcode: '365001' },
          { code: '350421', value: '明溪县', postcode: '365200' },
          { code: '350423', value: '清流县', postcode: '365300' },
          { code: '350424', value: '宁化县', postcode: '365400' },
          { code: '350425', value: '大田县', postcode: '366100' },
          { code: '350426', value: '尤溪县', postcode: '365100' },
          { code: '350427', value: '沙县', postcode: '365500' },
          { code: '350428', value: '将乐县', postcode: '353300' },
          { code: '350429', value: '泰宁县', postcode: '354400' },
          { code: '350430', value: '建宁县', postcode: '354500' },
          { code: '350481', value: '永安市', postcode: '366000' }
        ]
      },
      {
        code: '350500',
        value: '泉州市',
        postcode: '362000',
        children: [
          { code: '350502', value: '鲤城区', postcode: '362000' },
          { code: '350503', value: '丰泽区', postcode: '362000' },
          { code: '350504', value: '洛江区', postcode: '362011' },
          { code: '350505', value: '泉港区', postcode: '362114' },
          { code: '350521', value: '惠安县', postcode: '362100' },
          { code: '350524', value: '安溪县', postcode: '362400' },
          { code: '350525', value: '永春县', postcode: '362600' },
          { code: '350526', value: '德化县', postcode: '362500' },
          { code: '350527', value: '金门县', postcode: '362000' },
          { code: '350581', value: '石狮市', postcode: '362700' },
          { code: '350582', value: '晋江市', postcode: '362200' },
          { code: '350583', value: '南安市', postcode: '362300' }
        ]
      },
      {
        code: '350600',
        value: '漳州市',
        postcode: '363000',
        children: [
          { code: '350602', value: '芗城区', postcode: '363000' },
          { code: '350603', value: '龙文区', postcode: '363005' },
          { code: '350622', value: '云霄县', postcode: '363300' },
          { code: '350623', value: '漳浦县', postcode: '363200' },
          { code: '350624', value: '诏安县', postcode: '363500' },
          { code: '350625', value: '长泰县', postcode: '363900' },
          { code: '350626', value: '东山县', postcode: '363400' },
          { code: '350627', value: '南靖县', postcode: '363600' },
          { code: '350628', value: '平和县', postcode: '363700' },
          { code: '350629', value: '华安县', postcode: '363800' },
          { code: '350681', value: '龙海市', postcode: '363100' }
        ]
      },
      {
        code: '350700',
        value: '南平市',
        postcode: '353000',
        children: [
          { code: '350702', value: '延平区', postcode: '353000' },
          { code: '350703', value: '建阳区', postcode: '354200' },
          { code: '350721', value: '顺昌县', postcode: '353200' },
          { code: '350722', value: '浦城县', postcode: '353400' },
          { code: '350723', value: '光泽县', postcode: '354100' },
          { code: '350724', value: '松溪县', postcode: '353500' },
          { code: '350725', value: '政和县', postcode: '353600' },
          { code: '350781', value: '邵武市', postcode: '354000' },
          { code: '350782', value: '武夷山市', postcode: '354300' },
          { code: '350783', value: '建瓯市', postcode: '353100' }
        ]
      },
      {
        code: '350800',
        value: '龙岩市',
        postcode: '364000',
        children: [
          { code: '350802', value: '新罗区', postcode: '364000' },
          { code: '350803', value: '永定区', postcode: '427000' },
          { code: '350821', value: '长汀县', postcode: '366300' },
          { code: '350823', value: '上杭县', postcode: '364200' },
          { code: '350824', value: '武平县', postcode: '364300' },
          { code: '350825', value: '连城县', postcode: '366200' },
          { code: '350881', value: '漳平市', postcode: '364400' }
        ]
      },
      {
        code: '350900',
        value: '宁德市',
        postcode: '352000',
        children: [
          { code: '350902', value: '蕉城区', postcode: '352100' },
          { code: '350921', value: '霞浦县', postcode: '355100' },
          { code: '350922', value: '古田县', postcode: '352200' },
          { code: '350923', value: '屏南县', postcode: '352300' },
          { code: '350924', value: '寿宁县', postcode: '355500' },
          { code: '350925', value: '周宁县', postcode: '355400' },
          { code: '350926', value: '柘荣县', postcode: '355300' },
          { code: '350981', value: '福安市', postcode: '355000' },
          { code: '350982', value: '福鼎市', postcode: '355200' }
        ]
      }
    ]
  },
  {
    code: '360000',
    value: '江西省',
    postcode: '0',
    children: [
      {
        code: '360100',
        value: '南昌市',
        postcode: '330000',
        children: [
          { code: '360102', value: '东湖区', postcode: '330006' },
          { code: '360103', value: '西湖区', postcode: '330009' },
          { code: '360104', value: '青云谱区', postcode: '330001' },
          { code: '360111', value: '青山湖区', postcode: '330029' },
          { code: '360112', value: '新建区', postcode: '330100' },
          { code: '360113', value: '红谷滩区', postcode: '330038' },
          { code: '360121', value: '南昌县', postcode: '330200' },
          { code: '360123', value: '安义县', postcode: '330500' },
          { code: '360124', value: '进贤县', postcode: '331700' }
        ]
      },
      {
        code: '360200',
        value: '景德镇市',
        postcode: '333000',
        children: [
          { code: '360202', value: '昌江区', postcode: '333000' },
          { code: '360203', value: '珠山区', postcode: '333000' },
          { code: '360222', value: '浮梁县', postcode: '333400' },
          { code: '360281', value: '乐平市', postcode: '333300' }
        ]
      },
      {
        code: '360300',
        value: '萍乡市',
        postcode: '337000',
        children: [
          { code: '360302', value: '安源区', postcode: '337000' },
          { code: '360313', value: '湘东区', postcode: '337016' },
          { code: '360321', value: '莲花县', postcode: '337100' },
          { code: '360322', value: '上栗县', postcode: '337009' },
          { code: '360323', value: '芦溪县', postcode: '337053' }
        ]
      },
      {
        code: '360400',
        value: '九江市',
        postcode: '332000',
        children: [
          { code: '360402', value: '濂溪区', postcode: '332005' },
          { code: '360403', value: '浔阳区', postcode: '332000' },
          { code: '360404', value: '柴桑区', postcode: '332100' },
          { code: '360423', value: '武宁县', postcode: '332300' },
          { code: '360424', value: '修水县', postcode: '332400' },
          { code: '360425', value: '永修县', postcode: '330300' },
          { code: '360426', value: '德安县', postcode: '330400' },
          { code: '360428', value: '都昌县', postcode: '332600' },
          { code: '360429', value: '湖口县', postcode: '332500' },
          { code: '360430', value: '彭泽县', postcode: '332700' },
          { code: '360481', value: '瑞昌市', postcode: '332200' },
          { code: '360482', value: '共青城市', postcode: '332020' },
          { code: '360483', value: '庐山市', postcode: '332020' }
        ]
      },
      {
        code: '360500',
        value: '新余市',
        postcode: '336500',
        children: [
          { code: '360502', value: '渝水区', postcode: '338025' },
          { code: '360521', value: '分宜县', postcode: '336600' }
        ]
      },
      {
        code: '360600',
        value: '鹰潭市',
        postcode: '335000',
        children: [
          { code: '360602', value: '月湖区', postcode: '335000' },
          { code: '360603', value: '余江区', postcode: '335200' },
          { code: '360681', value: '贵溪市', postcode: '335400' }
        ]
      },
      {
        code: '360700',
        value: '赣州市',
        postcode: '341000',
        children: [
          { code: '360702', value: '章贡区', postcode: '341000' },
          { code: '360703', value: '南康区', postcode: '341400' },
          { code: '360704', value: '赣县区', postcode: '341100' },
          { code: '360722', value: '信丰县', postcode: '341600' },
          { code: '360723', value: '大余县', postcode: '341500' },
          { code: '360724', value: '上犹县', postcode: '341200' },
          { code: '360725', value: '崇义县', postcode: '341300' },
          { code: '360726', value: '安远县', postcode: '342100' },
          { code: '360727', value: '龙南县', postcode: '341700' },
          { code: '360728', value: '定南县', postcode: '341900' },
          { code: '360729', value: '全南县', postcode: '341800' },
          { code: '360730', value: '宁都县', postcode: '342800' },
          { code: '360731', value: '于都县', postcode: '342300' },
          { code: '360732', value: '兴国县', postcode: '342400' },
          { code: '360733', value: '会昌县', postcode: '342600' },
          { code: '360734', value: '寻乌县', postcode: '342200' },
          { code: '360735', value: '石城县', postcode: '342700' },
          { code: '360781', value: '瑞金市', postcode: '342500' }
        ]
      },
      {
        code: '360800',
        value: '吉安市',
        postcode: '343000',
        children: [
          { code: '360802', value: '吉州区', postcode: '343000' },
          { code: '360803', value: '青原区', postcode: '343009' },
          { code: '360821', value: '吉安县', postcode: '343100' },
          { code: '360822', value: '吉水县', postcode: '331600' },
          { code: '360823', value: '峡江县', postcode: '331400' },
          { code: '360824', value: '新干县', postcode: '331300' },
          { code: '360825', value: '永丰县', postcode: '331500' },
          { code: '360826', value: '泰和县', postcode: '343700' },
          { code: '360827', value: '遂川县', postcode: '343900' },
          { code: '360828', value: '万安县', postcode: '343800' },
          { code: '360829', value: '安福县', postcode: '343200' },
          { code: '360830', value: '永新县', postcode: '343400' },
          { code: '360881', value: '井冈山市', postcode: '343600' }
        ]
      },
      {
        code: '360900',
        value: '宜春市',
        postcode: '336000',
        children: [
          { code: '360902', value: '袁州区', postcode: '336000' },
          { code: '360921', value: '奉新县', postcode: '330700' },
          { code: '360922', value: '万载县', postcode: '336100' },
          { code: '360923', value: '上高县', postcode: '336400' },
          { code: '360924', value: '宜丰县', postcode: '336300' },
          { code: '360925', value: '靖安县', postcode: '330600' },
          { code: '360926', value: '铜鼓县', postcode: '336200' },
          { code: '360981', value: '丰城市', postcode: '331100' },
          { code: '360982', value: '樟树市', postcode: '331200' },
          { code: '360983', value: '高安市', postcode: '330800' }
        ]
      },
      {
        code: '361000',
        value: '抚州市',
        postcode: '344000',
        children: [
          { code: '361002', value: '临川区', postcode: '344100' },
          { code: '361003', value: '东乡区', postcode: '331800' },
          { code: '361021', value: '南城县', postcode: '344700' },
          { code: '361022', value: '黎川县', postcode: '344600' },
          { code: '361023', value: '南丰县', postcode: '344500' },
          { code: '361024', value: '崇仁县', postcode: '344200' },
          { code: '361025', value: '乐安县', postcode: '344300' },
          { code: '361026', value: '宜黄县', postcode: '344400' },
          { code: '361027', value: '金溪县', postcode: '344800' },
          { code: '361028', value: '资溪县', postcode: '335300' },
          { code: '361030', value: '广昌县', postcode: '344900' }
        ]
      },
      {
        code: '361100',
        value: '上饶市',
        postcode: '334000',
        children: [
          { code: '361102', value: '信州区', postcode: '334000' },
          { code: '361103', value: '广丰区', postcode: '334600' },
          { code: '361104', value: '广信区', postcode: '334100' },
          { code: '361123', value: '玉山县', postcode: '334700' },
          { code: '361124', value: '铅山县', postcode: '334500' },
          { code: '361125', value: '横峰县', postcode: '334300' },
          { code: '361126', value: '弋阳县', postcode: '334400' },
          { code: '361127', value: '余干县', postcode: '335100' },
          { code: '361128', value: '鄱阳县', postcode: '333100' },
          { code: '361129', value: '万年县', postcode: '335500' },
          { code: '361130', value: '婺源县', postcode: '333200' },
          { code: '361181', value: '德兴市', postcode: '334200' }
        ]
      }
    ]
  },
  {
    code: '370000',
    value: '山东省',
    postcode: '0',
    children: [
      {
        code: '370100',
        value: '济南市',
        postcode: '250000',
        children: [
          { code: '370102', value: '历下区', postcode: '250014' },
          { code: '370103', value: '市中区', postcode: '250001' },
          { code: '370104', value: '槐荫区', postcode: '250022' },
          { code: '370105', value: '天桥区', postcode: '250031' },
          { code: '370112', value: '历城区', postcode: '250100' },
          { code: '370113', value: '长清区', postcode: '250300' },
          { code: '370114', value: '章丘区', postcode: '250200' },
          { code: '370115', value: '济阳区', postcode: '251400' },
          { code: '370116', value: '莱芜区', postcode: '271100' },
          { code: '370117', value: '钢城区', postcode: '271104' },
          { code: '370124', value: '平阴县', postcode: '250400' },
          { code: '370126', value: '商河县', postcode: '251600' }
        ]
      },
      {
        code: '370200',
        value: '青岛市',
        postcode: '266000',
        children: [
          { code: '370202', value: '市南区', postcode: '266001' },
          { code: '370203', value: '市北区', postcode: '266011' },
          { code: '370211', value: '黄岛区', postcode: '266500' },
          { code: '370212', value: '崂山区', postcode: '266100' },
          { code: '370213', value: '李沧区', postcode: '266021' },
          { code: '370214', value: '城阳区', postcode: '266041' },
          { code: '370215', value: '即墨区', postcode: '266200' },
          { code: '370281', value: '胶州市', postcode: '266300' },
          { code: '370283', value: '平度市', postcode: '266700' },
          { code: '370285', value: '莱西市', postcode: '266600' }
        ]
      },
      {
        code: '370300',
        value: '淄博市',
        postcode: '255000',
        children: [
          { code: '370302', value: '淄川区', postcode: '255100' },
          { code: '370303', value: '张店区', postcode: '255022' },
          { code: '370304', value: '博山区', postcode: '255200' },
          { code: '370305', value: '临淄区', postcode: '255400' },
          { code: '370306', value: '周村区', postcode: '255300' },
          { code: '370321', value: '桓台县', postcode: '256400' },
          { code: '370322', value: '高青县', postcode: '256300' },
          { code: '370323', value: '沂源县', postcode: '256100' }
        ]
      },
      {
        code: '370400',
        value: '枣庄市',
        postcode: '277000',
        children: [
          { code: '370402', value: '市中区', postcode: '277101' },
          { code: '370403', value: '薛城区', postcode: '277000' },
          { code: '370404', value: '峄城区', postcode: '277300' },
          { code: '370405', value: '台儿庄区', postcode: '277400' },
          { code: '370406', value: '山亭区', postcode: '277200' },
          { code: '370481', value: '滕州市', postcode: '277500' }
        ]
      },
      {
        code: '370500',
        value: '东营市',
        postcode: '257000',
        children: [
          { code: '370502', value: '东营区', postcode: '257029' },
          { code: '370503', value: '河口区', postcode: '257200' },
          { code: '370505', value: '垦利区', postcode: '257500' },
          { code: '370522', value: '利津县', postcode: '257400' },
          { code: '370523', value: '广饶县', postcode: '257300' }
        ]
      },
      {
        code: '370600',
        value: '烟台市',
        postcode: '264000',
        children: [
          { code: '370602', value: '芝罘区', postcode: '264001' },
          { code: '370611', value: '福山区', postcode: '265500' },
          { code: '370612', value: '牟平区', postcode: '264100' },
          { code: '370613', value: '莱山区', postcode: '264600' },
          { code: '370634', value: '长岛县', postcode: '265800' },
          { code: '370681', value: '龙口市', postcode: '265700' },
          { code: '370682', value: '莱阳市', postcode: '265200' },
          { code: '370683', value: '莱州市', postcode: '261400' },
          { code: '370684', value: '蓬莱市', postcode: '265600' },
          { code: '370685', value: '招远市', postcode: '265400' },
          { code: '370686', value: '栖霞市', postcode: '265300' },
          { code: '370687', value: '海阳市', postcode: '265100' }
        ]
      },
      {
        code: '370700',
        value: '潍坊市',
        postcode: '261000',
        children: [
          { code: '370702', value: '潍城区', postcode: '261021' },
          { code: '370703', value: '寒亭区', postcode: '261100' },
          { code: '370704', value: '坊子区', postcode: '261200' },
          { code: '370705', value: '奎文区', postcode: '261031' },
          { code: '370724', value: '临朐县', postcode: '262600' },
          { code: '370725', value: '昌乐县', postcode: '262400' },
          { code: '370781', value: '青州市', postcode: '262500' },
          { code: '370782', value: '诸城市', postcode: '262200' },
          { code: '370783', value: '寿光市', postcode: '262700' },
          { code: '370784', value: '安丘市', postcode: '262100' },
          { code: '370785', value: '高密市', postcode: '261500' },
          { code: '370786', value: '昌邑市', postcode: '261300' }
        ]
      },
      {
        code: '370800',
        value: '济宁市',
        postcode: '272000',
        children: [
          { code: '370811', value: '任城区', postcode: '272113' },
          { code: '370812', value: '兖州区', postcode: '272000' },
          { code: '370826', value: '微山县', postcode: '277600' },
          { code: '370827', value: '鱼台县', postcode: '272300' },
          { code: '370828', value: '金乡县', postcode: '272200' },
          { code: '370829', value: '嘉祥县', postcode: '272400' },
          { code: '370830', value: '汶上县', postcode: '272501' },
          { code: '370831', value: '泗水县', postcode: '273200' },
          { code: '370832', value: '梁山县', postcode: '272600' },
          { code: '370881', value: '曲阜市', postcode: '273100' },
          { code: '370883', value: '邹城市', postcode: '273500' }
        ]
      },
      {
        code: '370900',
        value: '泰安市',
        postcode: '271000',
        children: [
          { code: '370902', value: '泰山区', postcode: '271000' },
          { code: '370911', value: '岱岳区', postcode: '271000' },
          { code: '370921', value: '宁阳县', postcode: '271400' },
          { code: '370923', value: '东平县', postcode: '271500' },
          { code: '370982', value: '新泰市', postcode: '271200' },
          { code: '370983', value: '肥城市', postcode: '271600' }
        ]
      },
      {
        code: '371000',
        value: '威海市',
        postcode: '264200',
        children: [
          { code: '371002', value: '环翠区', postcode: '264200' },
          { code: '371003', value: '文登区', postcode: '264400' },
          { code: '371082', value: '荣成市', postcode: '264300' },
          { code: '371083', value: '乳山市', postcode: '264500' }
        ]
      },
      {
        code: '371100',
        value: '日照市',
        postcode: '276800',
        children: [
          { code: '371102', value: '东港区', postcode: '276800' },
          { code: '371103', value: '岚山区', postcode: '276808' },
          { code: '371121', value: '五莲县', postcode: '272300' },
          { code: '371122', value: '莒县', postcode: '266500' }
        ]
      },
      {
        code: '371300',
        value: '临沂市',
        postcode: '276000',
        children: [
          { code: '371302', value: '兰山区', postcode: '276002' },
          { code: '371311', value: '罗庄区', postcode: '276022' },
          { code: '371312', value: '河东区', postcode: '572000' },
          { code: '371321', value: '沂南县', postcode: '276300' },
          { code: '371322', value: '郯城县', postcode: '276100' },
          { code: '371323', value: '沂水县', postcode: '276400' },
          { code: '371324', value: '兰陵县', postcode: '277700' },
          { code: '371325', value: '费县', postcode: '273400' },
          { code: '371326', value: '平邑县', postcode: '273300' },
          { code: '371327', value: '莒南县', postcode: '276600' },
          { code: '371328', value: '蒙阴县', postcode: '276200' },
          { code: '371329', value: '临沭县', postcode: '276700' }
        ]
      },
      {
        code: '371400',
        value: '德州市',
        postcode: '253000',
        children: [
          { code: '371402', value: '德城区', postcode: '253011' },
          { code: '371403', value: '陵城区', postcode: '253500' },
          { code: '371422', value: '宁津县', postcode: '253400' },
          { code: '371423', value: '庆云县', postcode: '253700' },
          { code: '371424', value: '临邑县', postcode: '251500' },
          { code: '371425', value: '齐河县', postcode: '251100' },
          { code: '371426', value: '平原县', postcode: '253100' },
          { code: '371427', value: '夏津县', postcode: '253200' },
          { code: '371428', value: '武城县', postcode: '253300' },
          { code: '371481', value: '乐陵市', postcode: '253600' },
          { code: '371482', value: '禹城市', postcode: '251200' }
        ]
      },
      {
        code: '371500',
        value: '聊城市',
        postcode: '252000',
        children: [
          { code: '371502', value: '东昌府区', postcode: '252000' },
          { code: '371523', value: '茌平区', postcode: '252100' },
          { code: '371521', value: '阳谷县', postcode: '252300' },
          { code: '371522', value: '莘县', postcode: '252400' },
          { code: '371524', value: '东阿县', postcode: '252200' },
          { code: '371525', value: '冠县', postcode: '252500' },
          { code: '371526', value: '高唐县', postcode: '252800' },
          { code: '371581', value: '临清市', postcode: '252600' }
        ]
      },
      {
        code: '371600',
        value: '滨州市',
        postcode: '256600',
        children: [
          { code: '371602', value: '滨城区', postcode: '256613' },
          { code: '371603', value: '沾化区', postcode: '256800' },
          { code: '371621', value: '惠民县', postcode: '251700' },
          { code: '371622', value: '阳信县', postcode: '251800' },
          { code: '371623', value: '无棣县', postcode: '251900' },
          { code: '371625', value: '博兴县', postcode: '256500' },
          { code: '371681', value: '邹平市', postcode: '256200' }
        ]
      },
      {
        code: '371700',
        value: '菏泽市',
        postcode: '274000',
        children: [
          { code: '371702', value: '牡丹区', postcode: '274009' },
          { code: '371703', value: '定陶区', postcode: '274100' },
          { code: '371721', value: '曹县', postcode: '274400' },
          { code: '371722', value: '单县', postcode: '274300' },
          { code: '371723', value: '成武县', postcode: '274200' },
          { code: '371724', value: '巨野县', postcode: '274900' },
          { code: '371725', value: '郓城县', postcode: '274700' },
          { code: '371726', value: '鄄城县', postcode: '274600' },
          { code: '371728', value: '东明县', postcode: '274500' }
        ]
      }
    ]
  },
  {
    code: '410000',
    value: '河南省',
    postcode: '0',
    children: [
      {
        code: '410100',
        value: '郑州市',
        postcode: '450000',
        children: [
          { code: '410102', value: '中原区', postcode: '450007' },
          { code: '410103', value: '二七区', postcode: '450052' },
          { code: '410104', value: '管城回族区', postcode: '450000' },
          { code: '410105', value: '金水区', postcode: '450003' },
          { code: '410106', value: '上街区', postcode: '450041' },
          { code: '410108', value: '惠济区', postcode: '450053' },
          { code: '410122', value: '中牟县', postcode: '451450' },
          { code: '410181', value: '巩义市', postcode: '451200' },
          { code: '410182', value: '荥阳市', postcode: '450100' },
          { code: '410183', value: '新密市', postcode: '452300' },
          { code: '410184', value: '新郑市', postcode: '451100' },
          { code: '410185', value: '登封市', postcode: '452470' }
        ]
      },
      {
        code: '410200',
        value: '开封市',
        postcode: '475000',
        children: [
          { code: '410202', value: '龙亭区', postcode: '475000' },
          { code: '410203', value: '顺河回族区', postcode: '475000' },
          { code: '410204', value: '鼓楼区', postcode: '475000' },
          { code: '410205', value: '禹王台区', postcode: '475000' },
          { code: '410212', value: '祥符区', postcode: '475100' },
          { code: '410221', value: '杞县', postcode: '475200' },
          { code: '410222', value: '通许县', postcode: '452200' },
          { code: '410223', value: '尉氏县', postcode: '452100' },
          { code: '410225', value: '兰考县', postcode: '475300' }
        ]
      },
      {
        code: '410300',
        value: '洛阳市',
        postcode: '471000',
        children: [
          { code: '410302', value: '老城区', postcode: '471002' },
          { code: '410303', value: '西工区', postcode: '471000' },
          { code: '410304', value: '瀍河回族区', postcode: '471002' },
          { code: '410305', value: '涧西区', postcode: '471003' },
          { code: '410306', value: '吉利区', postcode: '471012' },
          { code: '410311', value: '洛龙区', postcode: '471000' },
          { code: '410322', value: '孟津县', postcode: '471100' },
          { code: '410323', value: '新安县', postcode: '471800' },
          { code: '410324', value: '栾川县', postcode: '471500' },
          { code: '410325', value: '嵩县', postcode: '471400' },
          { code: '410326', value: '汝阳县', postcode: '471200' },
          { code: '410327', value: '宜阳县', postcode: '471600' },
          { code: '410328', value: '洛宁县', postcode: '471700' },
          { code: '410329', value: '伊川县', postcode: '471300' },
          { code: '410381', value: '偃师市', postcode: '471900' }
        ]
      },
      {
        code: '410400',
        value: '平顶山市',
        postcode: '467000',
        children: [
          { code: '410402', value: '新华区', postcode: '467002' },
          { code: '410403', value: '卫东区', postcode: '467021' },
          { code: '410404', value: '石龙区', postcode: '467045' },
          { code: '410411', value: '湛河区', postcode: '467000' },
          { code: '410421', value: '宝丰县', postcode: '467400' },
          { code: '410422', value: '叶县', postcode: '467200' },
          { code: '410423', value: '鲁山县', postcode: '467300' },
          { code: '410425', value: '郏县', postcode: '467100' },
          { code: '410481', value: '舞钢市', postcode: '462500' },
          { code: '410482', value: '汝州市', postcode: '467500' }
        ]
      },
      {
        code: '410500',
        value: '安阳市',
        postcode: '455000',
        children: [
          { code: '410502', value: '文峰区', postcode: '455000' },
          { code: '410503', value: '北关区', postcode: '455001' },
          { code: '410505', value: '殷都区', postcode: '455004' },
          { code: '410506', value: '龙安区', postcode: '455001' },
          { code: '410522', value: '安阳县', postcode: '455000' },
          { code: '410523', value: '汤阴县', postcode: '456150' },
          { code: '410526', value: '滑县', postcode: '456400' },
          { code: '410527', value: '内黄县', postcode: '456350' },
          { code: '410581', value: '林州市', postcode: '456500' }
        ]
      },
      {
        code: '410600',
        value: '鹤壁市',
        postcode: '458000',
        children: [
          { code: '410602', value: '鹤山区', postcode: '458010' },
          { code: '410603', value: '山城区', postcode: '458000' },
          { code: '410611', value: '淇滨区', postcode: '458000' },
          { code: '410621', value: '浚县', postcode: '456250' },
          { code: '410622', value: '淇县', postcode: '456750' }
        ]
      },
      {
        code: '410700',
        value: '新乡市',
        postcode: '453000',
        children: [
          { code: '410702', value: '红旗区', postcode: '453000' },
          { code: '410703', value: '卫滨区', postcode: '453000' },
          { code: '410704', value: '凤泉区', postcode: '453011' },
          { code: '410711', value: '牧野区', postcode: '453002' },
          { code: '410721', value: '新乡县', postcode: '453700' },
          { code: '410724', value: '获嘉县', postcode: '453800' },
          { code: '410725', value: '原阳县', postcode: '453500' },
          { code: '410726', value: '延津县', postcode: '453200' },
          { code: '410727', value: '封丘县', postcode: '453300' },
          { code: '410781', value: '卫辉市', postcode: '453100' },
          { code: '410782', value: '辉县市', postcode: '453600' },
          { code: '410783', value: '长垣市', postcode: '453400' }
        ]
      },
      {
        code: '410800',
        value: '焦作市',
        postcode: '454150',
        children: [
          { code: '410802', value: '解放区', postcode: '454000' },
          { code: '410803', value: '中站区', postcode: '454191' },
          { code: '410804', value: '马村区', postcode: '454171' },
          { code: '410811', value: '山阳区', postcode: '454002' },
          { code: '410821', value: '修武县', postcode: '454350' },
          { code: '410822', value: '博爱县', postcode: '454450' },
          { code: '410823', value: '武陟县', postcode: '454950' },
          { code: '410825', value: '温县', postcode: '454850' },
          { code: '410882', value: '沁阳市', postcode: '454550' },
          { code: '410883', value: '孟州市', postcode: '454750' }
        ]
      },
      {
        code: '410900',
        value: '濮阳市',
        postcode: '457000',
        children: [
          { code: '410902', value: '华龙区', postcode: '457001' },
          { code: '410922', value: '清丰县', postcode: '457300' },
          { code: '410923', value: '南乐县', postcode: '457400' },
          { code: '410926', value: '范县', postcode: '457500' },
          { code: '410927', value: '台前县', postcode: '457600' },
          { code: '410928', value: '濮阳县', postcode: '457100' }
        ]
      },
      {
        code: '411000',
        value: '许昌市',
        postcode: '461000',
        children: [
          { code: '411002', value: '魏都区', postcode: '461000' },
          { code: '411003', value: '建安区', postcode: '461100' },
          { code: '411024', value: '鄢陵县', postcode: '461200' },
          { code: '411025', value: '襄城县', postcode: '461700' },
          { code: '411081', value: '禹州市', postcode: '461670' },
          { code: '411082', value: '长葛市', postcode: '461500' }
        ]
      },
      {
        code: '411100',
        value: '漯河市',
        postcode: '462000',
        children: [
          { code: '411102', value: '源汇区', postcode: '462000' },
          { code: '411103', value: '郾城区', postcode: '462300' },
          { code: '411104', value: '召陵区', postcode: '462300' },
          { code: '411121', value: '舞阳县', postcode: '462400' },
          { code: '411122', value: '临颍县', postcode: '462600' }
        ]
      },
      {
        code: '411200',
        value: '三门峡市',
        postcode: '472000',
        children: [
          { code: '411202', value: '湖滨区', postcode: '472000' },
          { code: '411203', value: '陕州区', postcode: '472100' },
          { code: '411221', value: '渑池县', postcode: '472400' },
          { code: '411224', value: '卢氏县', postcode: '472200' },
          { code: '411281', value: '义马市', postcode: '472300' },
          { code: '411282', value: '灵宝市', postcode: '472500' }
        ]
      },
      {
        code: '411300',
        value: '南阳市',
        postcode: '473000',
        children: [
          { code: '411302', value: '宛城区', postcode: '473001' },
          { code: '411303', value: '卧龙区', postcode: '473003' },
          { code: '411321', value: '南召县', postcode: '474650' },
          { code: '411322', value: '方城县', postcode: '473200' },
          { code: '411323', value: '西峡县', postcode: '474550' },
          { code: '411324', value: '镇平县', postcode: '474250' },
          { code: '411325', value: '内乡县', postcode: '474350' },
          { code: '411326', value: '淅川县', postcode: '474450' },
          { code: '411327', value: '社旗县', postcode: '473300' },
          { code: '411328', value: '唐河县', postcode: '473400' },
          { code: '411329', value: '新野县', postcode: '473500' },
          { code: '411330', value: '桐柏县', postcode: '474750' },
          { code: '411381', value: '邓州市', postcode: '474150' }
        ]
      },
      {
        code: '411400',
        value: '商丘市',
        postcode: '476000',
        children: [
          { code: '411402', value: '梁园区', postcode: '476000' },
          { code: '411403', value: '睢阳区', postcode: '476100' },
          { code: '411421', value: '民权县', postcode: '476800' },
          { code: '411422', value: '睢县', postcode: '476900' },
          { code: '411423', value: '宁陵县', postcode: '476700' },
          { code: '411424', value: '柘城县', postcode: '476200' },
          { code: '411425', value: '虞城县', postcode: '476300' },
          { code: '411426', value: '夏邑县', postcode: '476400' },
          { code: '411481', value: '永城市', postcode: '476600' }
        ]
      },
      {
        code: '411500',
        value: '信阳市',
        postcode: '464000',
        children: [
          { code: '411502', value: '浉河区', postcode: '464000' },
          { code: '411503', value: '平桥区', postcode: '464100' },
          { code: '411521', value: '罗山县', postcode: '464200' },
          { code: '411522', value: '光山县', postcode: '465450' },
          { code: '411523', value: '新县', postcode: '465550' },
          { code: '411524', value: '商城县', postcode: '465350' },
          { code: '411525', value: '固始县', postcode: '465250' },
          { code: '411526', value: '潢川县', postcode: '465150' },
          { code: '411527', value: '淮滨县', postcode: '464400' },
          { code: '411528', value: '息县', postcode: '464300' }
        ]
      },
      {
        code: '411600',
        value: '周口市',
        postcode: '466000',
        children: [
          { code: '411602', value: '川汇区', postcode: '466000' },
          { code: '411603', value: '淮阳区', postcode: '477150' },
          { code: '411621', value: '扶沟县', postcode: '461300' },
          { code: '411622', value: '西华县', postcode: '466600' },
          { code: '411623', value: '商水县', postcode: '466100' },
          { code: '411624', value: '沈丘县', postcode: '466300' },
          { code: '411625', value: '郸城县', postcode: '477150' },
          { code: '411627', value: '太康县', postcode: '461400' },
          { code: '411628', value: '鹿邑县', postcode: '477200' },
          { code: '411681', value: '项城市', postcode: '466200' }
        ]
      },
      {
        code: '411700',
        value: '驻马店市',
        postcode: '463000',
        children: [
          { code: '411702', value: '驿城区', postcode: '463000' },
          { code: '411721', value: '西平县', postcode: '463900' },
          { code: '411722', value: '上蔡县', postcode: '463800' },
          { code: '411723', value: '平舆县', postcode: '463400' },
          { code: '411724', value: '正阳县', postcode: '463600' },
          { code: '411725', value: '确山县', postcode: '463200' },
          { code: '411726', value: '泌阳县', postcode: '463700' },
          { code: '411727', value: '汝南县', postcode: '463300' },
          { code: '411728', value: '遂平县', postcode: '463100' },
          { code: '411729', value: '新蔡县', postcode: '463500' }
        ]
      },
      {
        code: '419000',
        value: '省直辖县级行政区划',
        postcode: '0',
        children: [{ code: '419001', value: '济源市', postcode: '454650' }]
      }
    ]
  },
  {
    code: '420000',
    value: '湖北省',
    postcode: '0',
    children: [
      {
        code: '420100',
        value: '武汉市',
        postcode: '430000',
        children: [
          { code: '420102', value: '江岸区', postcode: '430014' },
          { code: '420103', value: '江汉区', postcode: '430021' },
          { code: '420104', value: '硚口区', postcode: '430033' },
          { code: '420105', value: '汉阳区', postcode: '430050' },
          { code: '420106', value: '武昌区', postcode: '430061' },
          { code: '420107', value: '青山区', postcode: '430080' },
          { code: '420111', value: '洪山区', postcode: '430070' },
          { code: '420112', value: '东西湖区', postcode: '430040' },
          { code: '420113', value: '汉南区', postcode: '430090' },
          { code: '420114', value: '蔡甸区', postcode: '430100' },
          { code: '420115', value: '江夏区', postcode: '430200' },
          { code: '420116', value: '黄陂区', postcode: '432200' },
          { code: '420117', value: '新洲区', postcode: '431400' }
        ]
      },
      {
        code: '420200',
        value: '黄石市',
        postcode: '435000',
        children: [
          { code: '420202', value: '黄石港区', postcode: '435000' },
          { code: '420203', value: '西塞山区', postcode: '435001' },
          { code: '420204', value: '下陆区', postcode: '435005' },
          { code: '420205', value: '铁山区', postcode: '435006' },
          { code: '420222', value: '阳新县', postcode: '435200' },
          { code: '420281', value: '大冶市', postcode: '435100' }
        ]
      },
      {
        code: '420300',
        value: '十堰市',
        postcode: '442000',
        children: [
          { code: '420302', value: '茅箭区', postcode: '442012' },
          { code: '420303', value: '张湾区', postcode: '442001' },
          { code: '420304', value: '郧阳区', postcode: '442500' },
          { code: '420322', value: '郧西县', postcode: '442600' },
          { code: '420323', value: '竹山县', postcode: '442200' },
          { code: '420324', value: '竹溪县', postcode: '442300' },
          { code: '420325', value: '房县', postcode: '442100' },
          { code: '420381', value: '丹江口市', postcode: '442700' }
        ]
      },
      {
        code: '420500',
        value: '宜昌市',
        postcode: '443000',
        children: [
          { code: '420502', value: '西陵区', postcode: '443000' },
          { code: '420503', value: '伍家岗区', postcode: '443001' },
          { code: '420504', value: '点军区', postcode: '443006' },
          { code: '420505', value: '猇亭区', postcode: '443007' },
          { code: '420506', value: '夷陵区', postcode: '443100' },
          { code: '420525', value: '远安县', postcode: '444200' },
          { code: '420526', value: '兴山县', postcode: '443711' },
          { code: '420527', value: '秭归县', postcode: '443600' },
          { code: '420528', value: '长阳土家族自治县', postcode: '443500' },
          { code: '420529', value: '五峰土家族自治县', postcode: '443400' },
          { code: '420581', value: '宜都市', postcode: '443300' },
          { code: '420582', value: '当阳市', postcode: '444100' },
          { code: '420583', value: '枝江市', postcode: '443200' }
        ]
      },
      {
        code: '420600',
        value: '襄阳市',
        postcode: '441000',
        children: [
          { code: '420602', value: '襄城区', postcode: '441021' },
          { code: '420606', value: '樊城区', postcode: '441001' },
          { code: '420607', value: '襄州区', postcode: '441000' },
          { code: '420624', value: '南漳县', postcode: '441500' },
          { code: '420625', value: '谷城县', postcode: '441700' },
          { code: '420626', value: '保康县', postcode: '441600' },
          { code: '420682', value: '老河口市', postcode: '441800' },
          { code: '420683', value: '枣阳市', postcode: '441200' },
          { code: '420684', value: '宜城市', postcode: '441400' }
        ]
      },
      {
        code: '420700',
        value: '鄂州市',
        postcode: '436000',
        children: [
          { code: '420702', value: '梁子湖区', postcode: '436064' },
          { code: '420703', value: '华容区', postcode: '436030' },
          { code: '420704', value: '鄂城区', postcode: '436000' }
        ]
      },
      {
        code: '420800',
        value: '荆门市',
        postcode: '448000',
        children: [
          { code: '420802', value: '东宝区', postcode: '448004' },
          { code: '420804', value: '掇刀区', postcode: '448124' },
          { code: '420822', value: '沙洋县', postcode: '448200' },
          { code: '420881', value: '钟祥市', postcode: '431900' },
          { code: '420882', value: '京山市', postcode: '431800' }
        ]
      },
      {
        code: '420900',
        value: '孝感市',
        postcode: '432000',
        children: [
          { code: '420902', value: '孝南区', postcode: '432100' },
          { code: '420921', value: '孝昌县', postcode: '432900' },
          { code: '420922', value: '大悟县', postcode: '432800' },
          { code: '420923', value: '云梦县', postcode: '432500' },
          { code: '420981', value: '应城市', postcode: '432400' },
          { code: '420982', value: '安陆市', postcode: '432600' },
          { code: '420984', value: '汉川市', postcode: '432300' }
        ]
      },
      {
        code: '421000',
        value: '荆州市',
        postcode: '434000',
        children: [
          { code: '421002', value: '沙市区', postcode: '434000' },
          { code: '421003', value: '荆州区', postcode: '434020' },
          { code: '421022', value: '公安县', postcode: '434300' },
          { code: '421023', value: '监利县', postcode: '433300' },
          { code: '421024', value: '江陵县', postcode: '434101' },
          { code: '421081', value: '石首市', postcode: '434400' },
          { code: '421083', value: '洪湖市', postcode: '433200' },
          { code: '421087', value: '松滋市', postcode: '434200' }
        ]
      },
      {
        code: '421100',
        value: '黄冈市',
        postcode: '438000',
        children: [
          { code: '421102', value: '黄州区', postcode: '438000' },
          { code: '421121', value: '团风县', postcode: '438000' },
          { code: '421122', value: '红安县', postcode: '438401' },
          { code: '421123', value: '罗田县', postcode: '438600' },
          { code: '421124', value: '英山县', postcode: '438700' },
          { code: '421125', value: '浠水县', postcode: '438200' },
          { code: '421126', value: '蕲春县', postcode: '435300' },
          { code: '421127', value: '黄梅县', postcode: '435500' },
          { code: '421181', value: '麻城市', postcode: '438300' },
          { code: '421182', value: '武穴市', postcode: '435400' }
        ]
      },
      {
        code: '421200',
        value: '咸宁市',
        postcode: '437000',
        children: [
          { code: '421202', value: '咸安区', postcode: '437000' },
          { code: '421221', value: '嘉鱼县', postcode: '437200' },
          { code: '421222', value: '通城县', postcode: '437400' },
          { code: '421223', value: '崇阳县', postcode: '437500' },
          { code: '421224', value: '通山县', postcode: '437600' },
          { code: '421281', value: '赤壁市', postcode: '437300' }
        ]
      },
      {
        code: '421300',
        value: '随州市',
        postcode: '441300',
        children: [
          { code: '421303', value: '曾都区', postcode: '441300' },
          { code: '421321', value: '随县', postcode: '431500' },
          { code: '421381', value: '广水市', postcode: '432700' }
        ]
      },
      {
        code: '422800',
        value: '恩施土家族苗族自治州',
        postcode: '445000',
        children: [
          { code: '422801', value: '恩施市', postcode: '445000' },
          { code: '422802', value: '利川市', postcode: '445400' },
          { code: '422822', value: '建始县', postcode: '445300' },
          { code: '422823', value: '巴东县', postcode: '444300' },
          { code: '422825', value: '宣恩县', postcode: '445500' },
          { code: '422826', value: '咸丰县', postcode: '445600' },
          { code: '422827', value: '来凤县', postcode: '445700' },
          { code: '422828', value: '鹤峰县', postcode: '445800' }
        ]
      },
      {
        code: '429000',
        value: '省直辖县级行政区划',
        postcode: '0',
        children: [
          { code: '429004', value: '仙桃市', postcode: '433000' },
          { code: '429005', value: '潜江市', postcode: '433100' },
          { code: '429006', value: '天门市', postcode: '431700' },
          { code: '429021', value: '神农架林区', postcode: '442400' }
        ]
      }
    ]
  },
  {
    code: '430000',
    value: '湖南省',
    postcode: '0',
    children: [
      {
        code: '430100',
        value: '长沙市',
        postcode: '410000',
        children: [
          { code: '430102', value: '芙蓉区', postcode: '410011' },
          { code: '430103', value: '天心区', postcode: '410011' },
          { code: '430104', value: '岳麓区', postcode: '410006' },
          { code: '430105', value: '开福区', postcode: '410008' },
          { code: '430111', value: '雨花区', postcode: '410011' },
          { code: '430112', value: '望城区', postcode: '410000' },
          { code: '430121', value: '长沙县', postcode: '410100' },
          { code: '430181', value: '浏阳市', postcode: '410300' },
          { code: '430182', value: '宁乡市', postcode: '410600' }
        ]
      },
      {
        code: '430200',
        value: '株洲市',
        postcode: '412000',
        children: [
          { code: '430202', value: '荷塘区', postcode: '412000' },
          { code: '430203', value: '芦淞区', postcode: '412000' },
          { code: '430204', value: '石峰区', postcode: '412005' },
          { code: '430211', value: '天元区', postcode: '412007' },
          { code: '430212', value: '渌口区', postcode: '412000' },
          { code: '430223', value: '攸县', postcode: '412300' },
          { code: '430224', value: '茶陵县', postcode: '412400' },
          { code: '430225', value: '炎陵县', postcode: '412500' },
          { code: '430281', value: '醴陵市', postcode: '412200' }
        ]
      },
      {
        code: '430300',
        value: '湘潭市',
        postcode: '411100',
        children: [
          { code: '430302', value: '雨湖区', postcode: '411100' },
          { code: '430304', value: '岳塘区', postcode: '411101' },
          { code: '430321', value: '湘潭县', postcode: '411228' },
          { code: '430381', value: '湘乡市', postcode: '411400' },
          { code: '430382', value: '韶山市', postcode: '411300' }
        ]
      },
      {
        code: '430400',
        value: '衡阳市',
        postcode: '421000',
        children: [
          { code: '430405', value: '珠晖区', postcode: '421002' },
          { code: '430406', value: '雁峰区', postcode: '421001' },
          { code: '430407', value: '石鼓区', postcode: '421001' },
          { code: '430408', value: '蒸湘区', postcode: '421001' },
          { code: '430412', value: '南岳区', postcode: '421900' },
          { code: '430421', value: '衡阳县', postcode: '421200' },
          { code: '430422', value: '衡南县', postcode: '421131' },
          { code: '430423', value: '衡山县', postcode: '421300' },
          { code: '430424', value: '衡东县', postcode: '421400' },
          { code: '430426', value: '祁东县', postcode: '421600' },
          { code: '430481', value: '耒阳市', postcode: '421800' },
          { code: '430482', value: '常宁市', postcode: '421500' }
        ]
      },
      {
        code: '430500',
        value: '邵阳市',
        postcode: '422000',
        children: [
          { code: '430502', value: '双清区', postcode: '422001' },
          { code: '430503', value: '大祥区', postcode: '422000' },
          { code: '430511', value: '北塔区', postcode: '422007' },
          { code: '430522', value: '新邵县', postcode: '422900' },
          { code: '430523', value: '邵阳县', postcode: '422100' },
          { code: '430524', value: '隆回县', postcode: '422200' },
          { code: '430525', value: '洞口县', postcode: '422300' },
          { code: '430527', value: '绥宁县', postcode: '422600' },
          { code: '430528', value: '新宁县', postcode: '422700' },
          { code: '430529', value: '城步苗族自治县', postcode: '422500' },
          { code: '430581', value: '武冈市', postcode: '422400' },
          { code: '430582', value: '邵东市', postcode: '422800' }
        ]
      },
      {
        code: '430600',
        value: '岳阳市',
        postcode: '414000',
        children: [
          { code: '430602', value: '岳阳楼区', postcode: '414000' },
          { code: '430603', value: '云溪区', postcode: '414009' },
          { code: '430611', value: '君山区', postcode: '414005' },
          { code: '430621', value: '岳阳县', postcode: '414100' },
          { code: '430623', value: '华容县', postcode: '414200' },
          { code: '430624', value: '湘阴县', postcode: '414200' },
          { code: '430626', value: '平江县', postcode: '414500' },
          { code: '430681', value: '汨罗市', postcode: '414400' },
          { code: '430682', value: '临湘市', postcode: '414300' }
        ]
      },
      {
        code: '430700',
        value: '常德市',
        postcode: '415000',
        children: [
          { code: '430702', value: '武陵区', postcode: '415000' },
          { code: '430703', value: '鼎城区', postcode: '415101' },
          { code: '430721', value: '安乡县', postcode: '415600' },
          { code: '430722', value: '汉寿县', postcode: '415900' },
          { code: '430723', value: '澧县', postcode: '415500' },
          { code: '430724', value: '临澧县', postcode: '415200' },
          { code: '430725', value: '桃源县', postcode: '415700' },
          { code: '430726', value: '石门县', postcode: '415300' },
          { code: '430781', value: '津市市', postcode: '415400' }
        ]
      },
      {
        code: '430800',
        value: '张家界市',
        postcode: '427000',
        children: [
          { code: '430802', value: '永定区', postcode: '427000' },
          { code: '430811', value: '武陵源区', postcode: '427400' },
          { code: '430821', value: '慈利县', postcode: '427200' },
          { code: '430822', value: '桑植县', postcode: '427100' }
        ]
      },
      {
        code: '430900',
        value: '益阳市',
        postcode: '413000',
        children: [
          { code: '430902', value: '资阳区', postcode: '413001' },
          { code: '430903', value: '赫山区', postcode: '413002' },
          { code: '430921', value: '南县', postcode: '413200' },
          { code: '430922', value: '桃江县', postcode: '413400' },
          { code: '430923', value: '安化县', postcode: '413500' },
          { code: '430981', value: '沅江市', postcode: '413100' }
        ]
      },
      {
        code: '431000',
        value: '郴州市',
        postcode: '423000',
        children: [
          { code: '431002', value: '北湖区', postcode: '423000' },
          { code: '431003', value: '苏仙区', postcode: '423000' },
          { code: '431021', value: '桂阳县', postcode: '424400' },
          { code: '431022', value: '宜章县', postcode: '424200' },
          { code: '431023', value: '永兴县', postcode: '423300' },
          { code: '431024', value: '嘉禾县', postcode: '424500' },
          { code: '431025', value: '临武县', postcode: '424300' },
          { code: '431026', value: '汝城县', postcode: '424100' },
          { code: '431027', value: '桂东县', postcode: '423500' },
          { code: '431028', value: '安仁县', postcode: '423600' },
          { code: '431081', value: '资兴市', postcode: '423400' }
        ]
      },
      {
        code: '431100',
        value: '永州市',
        postcode: '425000',
        children: [
          { code: '431102', value: '零陵区', postcode: '425002' },
          { code: '431103', value: '冷水滩区', postcode: '425100' },
          { code: '431121', value: '祁阳县', postcode: '426100' },
          { code: '431122', value: '东安县', postcode: '425900' },
          { code: '431123', value: '双牌县', postcode: '425200' },
          { code: '431124', value: '道县', postcode: '425300' },
          { code: '431125', value: '江永县', postcode: '425400' },
          { code: '431126', value: '宁远县', postcode: '425600' },
          { code: '431127', value: '蓝山县', postcode: '425800' },
          { code: '431128', value: '新田县', postcode: '425700' },
          { code: '431129', value: '江华瑶族自治县', postcode: '425500' }
        ]
      },
      {
        code: '431200',
        value: '怀化市',
        postcode: '418000',
        children: [
          { code: '431202', value: '鹤城区', postcode: '418000' },
          { code: '431221', value: '中方县', postcode: '418005' },
          { code: '431222', value: '沅陵县', postcode: '419600' },
          { code: '431223', value: '辰溪县', postcode: '419500' },
          { code: '431224', value: '溆浦县', postcode: '419300' },
          { code: '431225', value: '会同县', postcode: '418300' },
          { code: '431226', value: '麻阳苗族自治县', postcode: '419400' },
          { code: '431227', value: '新晃侗族自治县', postcode: '419200' },
          { code: '431228', value: '芷江侗族自治县', postcode: '419100' },
          { code: '431229', value: '靖州苗族侗族自治县', postcode: '418400' },
          { code: '431230', value: '通道侗族自治县', postcode: '418500' },
          { code: '431281', value: '洪江市', postcode: '418116' }
        ]
      },
      {
        code: '431300',
        value: '娄底市',
        postcode: '417000',
        children: [
          { code: '431302', value: '娄星区', postcode: '417000' },
          { code: '431321', value: '双峰县', postcode: '417700' },
          { code: '431322', value: '新化县', postcode: '417600' },
          { code: '431381', value: '冷水江市', postcode: '417500' },
          { code: '431382', value: '涟源市', postcode: '417100' }
        ]
      },
      {
        code: '433100',
        value: '湘西土家族苗族自治州',
        postcode: '416000',
        children: [
          { code: '433101', value: '吉首市', postcode: '416000' },
          { code: '433122', value: '泸溪县', postcode: '416100' },
          { code: '433123', value: '凤凰县', postcode: '416200' },
          { code: '433124', value: '花垣县', postcode: '416400' },
          { code: '433125', value: '保靖县', postcode: '416500' },
          { code: '433126', value: '古丈县', postcode: '416300' },
          { code: '433127', value: '永顺县', postcode: '416700' },
          { code: '433130', value: '龙山县', postcode: '416800' }
        ]
      }
    ]
  },
  {
    code: '440000',
    value: '广东省',
    postcode: '0',
    children: [
      {
        code: '440100',
        value: '广州市',
        postcode: '510000',
        children: [
          { code: '440103', value: '荔湾区', postcode: '510145' },
          { code: '440104', value: '越秀区', postcode: '510030' },
          { code: '440105', value: '海珠区', postcode: '510220' },
          { code: '440106', value: '天河区', postcode: '510630' },
          { code: '440111', value: '白云区', postcode: '510080' },
          { code: '440112', value: '黄埔区', postcode: '510700' },
          { code: '440113', value: '番禺区', postcode: '511400' },
          { code: '440114', value: '花都区', postcode: '510800' },
          { code: '440115', value: '南沙区', postcode: '511400' },
          { code: '440117', value: '从化区', postcode: '510900' },
          { code: '440118', value: '增城区', postcode: '511300' }
        ]
      },
      {
        code: '440200',
        value: '韶关市',
        postcode: '512000',
        children: [
          { code: '440203', value: '武江区', postcode: '512026' },
          { code: '440204', value: '浈江区', postcode: '512023' },
          { code: '440205', value: '曲江区', postcode: '512100' },
          { code: '440222', value: '始兴县', postcode: '512500' },
          { code: '440224', value: '仁化县', postcode: '512300' },
          { code: '440229', value: '翁源县', postcode: '512600' },
          { code: '440232', value: '乳源瑶族自治县', postcode: '512700' },
          { code: '440233', value: '新丰县', postcode: '511100' },
          { code: '440281', value: '乐昌市', postcode: '512200' },
          { code: '440282', value: '南雄市', postcode: '512400' }
        ]
      },
      {
        code: '440300',
        value: '深圳市',
        postcode: '518000',
        children: [
          { code: '440303', value: '罗湖区', postcode: '518001' },
          { code: '440304', value: '福田区', postcode: '518033' },
          { code: '440305', value: '南山区', postcode: '518052' },
          { code: '440306', value: '宝安区', postcode: '518101' },
          { code: '440307', value: '龙岗区', postcode: '518116' },
          { code: '440308', value: '盐田区', postcode: '518083' },
          { code: '440309', value: '龙华区', postcode: '570105' },
          { code: '440310', value: '坪山区', postcode: '518118' },
          { code: '440311', value: '光明区', postcode: '518107' }
        ]
      },
      {
        code: '440400',
        value: '珠海市',
        postcode: '519000',
        children: [
          { code: '440402', value: '香洲区', postcode: '519000' },
          { code: '440403', value: '斗门区', postcode: '519100' },
          { code: '440404', value: '金湾区', postcode: '519090' }
        ]
      },
      {
        code: '440500',
        value: '汕头市',
        postcode: '515000',
        children: [
          { code: '440507', value: '龙湖区', postcode: '515041' },
          { code: '440511', value: '金平区', postcode: '515041' },
          { code: '440512', value: '濠江区', postcode: '515071' },
          { code: '440513', value: '潮阳区', postcode: '515100' },
          { code: '440514', value: '潮南区', postcode: '515144' },
          { code: '440515', value: '澄海区', postcode: '515800' },
          { code: '440523', value: '南澳县', postcode: '515900' }
        ]
      },
      {
        code: '440600',
        value: '佛山市',
        postcode: '528000',
        children: [
          { code: '440604', value: '禅城区', postcode: '528000' },
          { code: '440605', value: '南海区', postcode: '528200' },
          { code: '440606', value: '顺德区', postcode: '528300' },
          { code: '440607', value: '三水区', postcode: '528100' },
          { code: '440608', value: '高明区', postcode: '528500' }
        ]
      },
      {
        code: '440700',
        value: '江门市',
        postcode: '529000',
        children: [
          { code: '440703', value: '蓬江区', postcode: '529051' },
          { code: '440704', value: '江海区', postcode: '529000' },
          { code: '440705', value: '新会区', postcode: '529100' },
          { code: '440781', value: '台山市', postcode: '529211' },
          { code: '440783', value: '开平市', postcode: '529312' },
          { code: '440784', value: '鹤山市', postcode: '529711' },
          { code: '440785', value: '恩平市', postcode: '529411' }
        ]
      },
      {
        code: '440800',
        value: '湛江市',
        postcode: '524000',
        children: [
          { code: '440802', value: '赤坎区', postcode: '524033' },
          { code: '440803', value: '霞山区', postcode: '524002' },
          { code: '440804', value: '坡头区', postcode: '524057' },
          { code: '440811', value: '麻章区', postcode: '524003' },
          { code: '440823', value: '遂溪县', postcode: '524300' },
          { code: '440825', value: '徐闻县', postcode: '524100' },
          { code: '440881', value: '廉江市', postcode: '524400' },
          { code: '440882', value: '雷州市', postcode: '524200' },
          { code: '440883', value: '吴川市', postcode: '524500' }
        ]
      },
      {
        code: '440900',
        value: '茂名市',
        postcode: '525000',
        children: [
          { code: '440902', value: '茂南区', postcode: '525011' },
          { code: '440904', value: '电白区', postcode: '525400' },
          { code: '440981', value: '高州市', postcode: '525200' },
          { code: '440982', value: '化州市', postcode: '525100' },
          { code: '440983', value: '信宜市', postcode: '525300' }
        ]
      },
      {
        code: '441200',
        value: '肇庆市',
        postcode: '526000',
        children: [
          { code: '441202', value: '端州区', postcode: '526040' },
          { code: '441203', value: '鼎湖区', postcode: '526070' },
          { code: '441204', value: '高要区', postcode: '526100' },
          { code: '441223', value: '广宁县', postcode: '526300' },
          { code: '441224', value: '怀集县', postcode: '526400' },
          { code: '441225', value: '封开县', postcode: '526500' },
          { code: '441226', value: '德庆县', postcode: '526600' },
          { code: '441284', value: '四会市', postcode: '526200' }
        ]
      },
      {
        code: '441300',
        value: '惠州市',
        postcode: '516000',
        children: [
          { code: '441302', value: '惠城区', postcode: '516001' },
          { code: '441303', value: '惠阳区', postcode: '516200' },
          { code: '441322', value: '博罗县', postcode: '516100' },
          { code: '441323', value: '惠东县', postcode: '516300' },
          { code: '441324', value: '龙门县', postcode: '516800' }
        ]
      },
      {
        code: '441400',
        value: '梅州市',
        postcode: '514000',
        children: [
          { code: '441402', value: '梅江区', postcode: '514000' },
          { code: '441403', value: '梅县区', postcode: '514700' },
          { code: '441422', value: '大埔县', postcode: '514200' },
          { code: '441423', value: '丰顺县', postcode: '514300' },
          { code: '441424', value: '五华县', postcode: '514400' },
          { code: '441426', value: '平远县', postcode: '514600' },
          { code: '441427', value: '蕉岭县', postcode: '514100' },
          { code: '441481', value: '兴宁市', postcode: '514500' }
        ]
      },
      {
        code: '441500',
        value: '汕尾市',
        postcode: '516600',
        children: [
          { code: '441502', value: '城区', postcode: '516601' },
          { code: '441521', value: '海丰县', postcode: '516400' },
          { code: '441523', value: '陆河县', postcode: '516700' },
          { code: '441581', value: '陆丰市', postcode: '516500' }
        ]
      },
      {
        code: '441600',
        value: '河源市',
        postcode: '517000',
        children: [
          { code: '441602', value: '源城区', postcode: '517000' },
          { code: '441621', value: '紫金县', postcode: '517400' },
          { code: '441622', value: '龙川县', postcode: '517300' },
          { code: '441623', value: '连平县', postcode: '517100' },
          { code: '441624', value: '和平县', postcode: '517200' },
          { code: '441625', value: '东源县', postcode: '517500' }
        ]
      },
      {
        code: '441700',
        value: '阳江市',
        postcode: '529500',
        children: [
          { code: '441702', value: '江城区', postcode: '529525' },
          { code: '441704', value: '阳东区', postcode: '529900' },
          { code: '441721', value: '阳西县', postcode: '529800' },
          { code: '441781', value: '阳春市', postcode: '529611' }
        ]
      },
      {
        code: '441800',
        value: '清远市',
        postcode: '511500',
        children: [
          { code: '441802', value: '清城区', postcode: '511500' },
          { code: '441803', value: '清新区', postcode: '511800' },
          { code: '441821', value: '佛冈县', postcode: '511600' },
          { code: '441823', value: '阳山县', postcode: '513100' },
          { code: '441825', value: '连山壮族瑶族自治县', postcode: '513200' },
          { code: '441826', value: '连南瑶族自治县', postcode: '513300' },
          { code: '441881', value: '英德市', postcode: '513000' },
          { code: '441882', value: '连州市', postcode: '513401' }
        ]
      },
      {
        code: '441900',
        value: '东莞市',
        postcode: '523000',
        children: [
          { code: '441901', value: '东城街道', postcode: '523000' },
          { code: '441902', value: '南城街道', postcode: '523000' },
          { code: '441903', value: '万江街道', postcode: '523000' },
          { code: '441904', value: '莞城街道', postcode: '523000' },
          { code: '441905', value: '石碣镇', postcode: '523000' },
          { code: '441906', value: '石龙镇', postcode: '523000' },
          { code: '441907', value: '茶山镇', postcode: '523000' },
          { code: '441908', value: '石排镇', postcode: '523000' },
          { code: '441909', value: '企石镇', postcode: '523000' },
          { code: '441910', value: '横沥镇', postcode: '523000' },
          { code: '441911', value: '桥头镇', postcode: '523000' },
          { code: '441912', value: '谢岗镇', postcode: '523000' },
          { code: '441913', value: '东坑镇', postcode: '523000' },
          { code: '441914', value: '常平镇', postcode: '523000' },
          { code: '441915', value: '寮步镇', postcode: '523000' },
          { code: '441916', value: '樟木头镇', postcode: '523000' },
          { code: '441917', value: '大朗镇', postcode: '523000' },
          { code: '441918', value: '黄江镇', postcode: '523000' },
          { code: '441919', value: '清溪镇', postcode: '523000' },
          { code: '441920', value: '塘厦镇', postcode: '523000' },
          { code: '441921', value: '凤岗镇', postcode: '523000' },
          { code: '441922', value: '大岭山镇', postcode: '523000' },
          { code: '441923', value: '长安镇', postcode: '523000' },
          { code: '441924', value: '虎门镇', postcode: '523000' },
          { code: '441925', value: '厚街镇', postcode: '523000' },
          { code: '441926', value: '沙田镇', postcode: '523000' },
          { code: '441927', value: '道滘镇', postcode: '523000' },
          { code: '441928', value: '洪梅镇', postcode: '523000' },
          { code: '441929', value: '麻涌镇', postcode: '523000' },
          { code: '441930', value: '望牛墩镇', postcode: '523000' },
          { code: '441931', value: '中堂镇', postcode: '523000' },
          { code: '441932', value: '高埗镇', postcode: '523000' },
          { code: '441933', value: '松山湖管委会', postcode: '523000' },
          { code: '441934', value: '虎门港管委会', postcode: '523000' },
          { code: '441935', value: '东莞生态园', postcode: '523000' }
        ]
      },
      {
        code: '442000',
        value: '中山市',
        postcode: '528403',
        children: [
          { code: '442001', value: '石岐街道', postcode: '528403' },
          { code: '442002', value: '东区街道', postcode: '528403' },
          { code: '442003', value: '中山港街道', postcode: '528403' },
          { code: '442004', value: '西区街道', postcode: '528403' },
          { code: '442005', value: '南区街道', postcode: '528403' },
          { code: '442006', value: '五桂山街道', postcode: '528403' },
          { code: '442007', value: '小榄镇', postcode: '528403' },
          { code: '442008', value: '黄圃镇', postcode: '528403' },
          { code: '442009', value: '民众镇', postcode: '528403' },
          { code: '442010', value: '东凤镇', postcode: '528403' },
          { code: '442011', value: '东升镇', postcode: '528403' },
          { code: '442012', value: '古镇镇', postcode: '528403' },
          { code: '442013', value: '沙溪镇', postcode: '528403' },
          { code: '442014', value: '坦洲镇', postcode: '528403' },
          { code: '442015', value: '港口镇', postcode: '528403' },
          { code: '442016', value: '三角镇', postcode: '528403' },
          { code: '442017', value: '横栏镇', postcode: '528403' },
          { code: '442018', value: '南头镇', postcode: '528403' },
          { code: '442019', value: '阜沙镇', postcode: '528403' },
          { code: '442020', value: '南朗镇', postcode: '528403' },
          { code: '442021', value: '三乡镇', postcode: '528403' },
          { code: '442022', value: '板芙镇', postcode: '528403' },
          { code: '442023', value: '大涌镇', postcode: '528403' },
          { code: '442024', value: '神湾镇', postcode: '528403' }
        ]
      },
      {
        code: '445100',
        value: '潮州市',
        postcode: '521000',
        children: [
          { code: '445102', value: '湘桥区', postcode: '521000' },
          { code: '445103', value: '潮安区', postcode: '515638' },
          { code: '445122', value: '饶平县', postcode: '515700' }
        ]
      },
      {
        code: '445200',
        value: '揭阳市',
        postcode: '522000',
        children: [
          { code: '445202', value: '榕城区', postcode: '522095' },
          { code: '445203', value: '揭东区', postcode: '515500' },
          { code: '445222', value: '揭西县', postcode: '515400' },
          { code: '445224', value: '惠来县', postcode: '515200' },
          { code: '445281', value: '普宁市', postcode: '515300' }
        ]
      },
      {
        code: '445300',
        value: '云浮市',
        postcode: '527300',
        children: [
          { code: '445302', value: '云城区', postcode: '527300' },
          { code: '445303', value: '云安区', postcode: '527500' },
          { code: '445321', value: '新兴县', postcode: '527400' },
          { code: '445322', value: '郁南县', postcode: '527100' },
          { code: '445381', value: '罗定市', postcode: '527500' }
        ]
      }
    ]
  },
  {
    code: '450000',
    value: '广西壮族自治区',
    postcode: '0',
    children: [
      {
        code: '450100',
        value: '南宁市',
        postcode: '530000',
        children: [
          { code: '450102', value: '兴宁区', postcode: '530012' },
          { code: '450103', value: '青秀区', postcode: '530022' },
          { code: '450105', value: '江南区', postcode: '530031' },
          { code: '450107', value: '西乡塘区', postcode: '530001' },
          { code: '450108', value: '良庆区', postcode: '530200' },
          { code: '450109', value: '邕宁区', postcode: '530200' },
          { code: '450110', value: '武鸣区', postcode: '530100' },
          { code: '450123', value: '隆安县', postcode: '532700' },
          { code: '450124', value: '马山县', postcode: '530600' },
          { code: '450125', value: '上林县', postcode: '530500' },
          { code: '450126', value: '宾阳县', postcode: '530400' },
          { code: '450127', value: '横县', postcode: '530300' }
        ]
      },
      {
        code: '450200',
        value: '柳州市',
        postcode: '545000',
        children: [
          { code: '450202', value: '城中区', postcode: '545001' },
          { code: '450203', value: '鱼峰区', postcode: '545005' },
          { code: '450204', value: '柳南区', postcode: '545005' },
          { code: '450205', value: '柳北区', postcode: '545001' },
          { code: '450206', value: '柳江区', postcode: '545100' },
          { code: '450222', value: '柳城县', postcode: '545200' },
          { code: '450223', value: '鹿寨县', postcode: '545600' },
          { code: '450224', value: '融安县', postcode: '545400' },
          { code: '450225', value: '融水苗族自治县', postcode: '545300' },
          { code: '450226', value: '三江侗族自治县', postcode: '545500' }
        ]
      },
      {
        code: '450300',
        value: '桂林市',
        postcode: '541000',
        children: [
          { code: '450302', value: '秀峰区', postcode: '541001' },
          { code: '450303', value: '叠彩区', postcode: '541001' },
          { code: '450304', value: '象山区', postcode: '541002' },
          { code: '450305', value: '七星区', postcode: '541004' },
          { code: '450311', value: '雁山区', postcode: '541006' },
          { code: '450312', value: '临桂区', postcode: '541199' },
          { code: '450321', value: '阳朔县', postcode: '541900' },
          { code: '450323', value: '灵川县', postcode: '541200' },
          { code: '450324', value: '全州县', postcode: '541500' },
          { code: '450325', value: '兴安县', postcode: '541300' },
          { code: '450326', value: '永福县', postcode: '541800' },
          { code: '450327', value: '灌阳县', postcode: '541600' },
          { code: '450328', value: '龙胜各族自治县', postcode: '541700' },
          { code: '450329', value: '资源县', postcode: '541400' },
          { code: '450330', value: '平乐县', postcode: '542400' },
          { code: '450332', value: '恭城瑶族自治县', postcode: '542500' },
          { code: '450381', value: '荔浦市', postcode: '546600' }
        ]
      },
      {
        code: '450400',
        value: '梧州市',
        postcode: '543000',
        children: [
          { code: '450403', value: '万秀区', postcode: '543000' },
          { code: '450405', value: '长洲区', postcode: '543002' },
          { code: '450406', value: '龙圩区', postcode: '543004' },
          { code: '450421', value: '苍梧县', postcode: '543100' },
          { code: '450422', value: '藤县', postcode: '543300' },
          { code: '450423', value: '蒙山县', postcode: '546700' },
          { code: '450481', value: '岑溪市', postcode: '543200' }
        ]
      },
      {
        code: '450500',
        value: '北海市',
        postcode: '536000',
        children: [
          { code: '450502', value: '海城区', postcode: '536000' },
          { code: '450503', value: '银海区', postcode: '536000' },
          { code: '450512', value: '铁山港区', postcode: '536017' },
          { code: '450521', value: '合浦县', postcode: '536100' }
        ]
      },
      {
        code: '450600',
        value: '防城港市',
        postcode: '538000',
        children: [
          { code: '450602', value: '港口区', postcode: '538001' },
          { code: '450603', value: '防城区', postcode: '538021' },
          { code: '450621', value: '上思县', postcode: '535500' },
          { code: '450681', value: '东兴市', postcode: '538100' }
        ]
      },
      {
        code: '450700',
        value: '钦州市',
        postcode: '535000',
        children: [
          { code: '450702', value: '钦南区', postcode: '535000' },
          { code: '450703', value: '钦北区', postcode: '535000' },
          { code: '450721', value: '灵山县', postcode: '535400' },
          { code: '450722', value: '浦北县', postcode: '535300' }
        ]
      },
      {
        code: '450800',
        value: '贵港市',
        postcode: '537000',
        children: [
          { code: '450802', value: '港北区', postcode: '537100' },
          { code: '450803', value: '港南区', postcode: '537132' },
          { code: '450804', value: '覃塘区', postcode: '537121' },
          { code: '450821', value: '平南县', postcode: '537300' },
          { code: '450881', value: '桂平市', postcode: '537200' }
        ]
      },
      {
        code: '450900',
        value: '玉林市',
        postcode: '537000',
        children: [
          { code: '450902', value: '玉州区', postcode: '537200' },
          { code: '450903', value: '福绵区', postcode: '537500' },
          { code: '450921', value: '容县', postcode: '537500' },
          { code: '450922', value: '陆川县', postcode: '537700' },
          { code: '450923', value: '博白县', postcode: '537600' },
          { code: '450924', value: '兴业县', postcode: '537800' },
          { code: '450981', value: '北流市', postcode: '537400' }
        ]
      },
      {
        code: '451000',
        value: '百色市',
        postcode: '533000',
        children: [
          { code: '451002', value: '右江区', postcode: '533000' },
          { code: '451003', value: '田阳区', postcode: '533600' },
          { code: '451022', value: '田东县', postcode: '531500' },
          { code: '451024', value: '德保县', postcode: '533700' },
          { code: '451026', value: '那坡县', postcode: '533900' },
          { code: '451027', value: '凌云县', postcode: '533100' },
          { code: '451028', value: '乐业县', postcode: '533200' },
          { code: '451029', value: '田林县', postcode: '533300' },
          { code: '451030', value: '西林县', postcode: '533500' },
          { code: '451031', value: '隆林各族自治县', postcode: '533400' },
          { code: '451081', value: '靖西市', postcode: '533000' },
          { code: '451082', value: '平果市', postcode: '531400' }
        ]
      },
      {
        code: '451100',
        value: '贺州市',
        postcode: '542800',
        children: [
          { code: '451102', value: '八步区', postcode: '542800' },
          { code: '451103', value: '平桂区', postcode: '542800' },
          { code: '451121', value: '昭平县', postcode: '546800' },
          { code: '451122', value: '钟山县', postcode: '542600' },
          { code: '451123', value: '富川瑶族自治县', postcode: '542700' }
        ]
      },
      {
        code: '451200',
        value: '河池市',
        postcode: '547000',
        children: [
          { code: '451202', value: '金城江区', postcode: '547000' },
          { code: '451203', value: '宜州区', postcode: '546300' },
          { code: '451221', value: '南丹县', postcode: '547200' },
          { code: '451222', value: '天峨县', postcode: '547300' },
          { code: '451223', value: '凤山县', postcode: '547600' },
          { code: '451224', value: '东兰县', postcode: '547400' },
          { code: '451225', value: '罗城仫佬族自治县', postcode: '546400' },
          { code: '451226', value: '环江毛南族自治县', postcode: '547100' },
          { code: '451227', value: '巴马瑶族自治县', postcode: '547500' },
          { code: '451228', value: '都安瑶族自治县', postcode: '530700' },
          { code: '451229', value: '大化瑶族自治县', postcode: '530800' }
        ]
      },
      {
        code: '451300',
        value: '来宾市',
        postcode: '546100',
        children: [
          { code: '451302', value: '兴宾区', postcode: '546100' },
          { code: '451321', value: '忻城县', postcode: '546200' },
          { code: '451322', value: '象州县', postcode: '545800' },
          { code: '451323', value: '武宣县', postcode: '545900' },
          { code: '451324', value: '金秀瑶族自治县', postcode: '545700' },
          { code: '451381', value: '合山市', postcode: '546500' }
        ]
      },
      {
        code: '451400',
        value: '崇左市',
        postcode: '532200',
        children: [
          { code: '451402', value: '江州区', postcode: '532200' },
          { code: '451421', value: '扶绥县', postcode: '532100' },
          { code: '451422', value: '宁明县', postcode: '532500' },
          { code: '451423', value: '龙州县', postcode: '532400' },
          { code: '451424', value: '大新县', postcode: '532300' },
          { code: '451425', value: '天等县', postcode: '532800' },
          { code: '451481', value: '凭祥市', postcode: '532600' }
        ]
      }
    ]
  },
  {
    code: '460000',
    value: '海南省',
    postcode: '0',
    children: [
      {
        code: '460100',
        value: '海口市',
        postcode: '570100',
        children: [
          { code: '460105', value: '秀英区', postcode: '570311' },
          { code: '460106', value: '龙华区', postcode: '570105' },
          { code: '460107', value: '琼山区', postcode: '571100' },
          { code: '460108', value: '美兰区', postcode: '570203' }
        ]
      },
      {
        code: '460200',
        value: '三亚市',
        postcode: '572000',
        children: [
          { code: '460202', value: '海棠区', postcode: '572000' },
          { code: '460203', value: '吉阳区', postcode: '572000' },
          { code: '460204', value: '天涯区', postcode: '572000' },
          { code: '460205', value: '崖州区', postcode: '572000' }
        ]
      },
      {
        code: '460300',
        value: '三沙市',
        postcode: '573100',
        children: [
          { code: '460321', value: '西沙群岛', postcode: '573100' },
          { code: '460322', value: '南沙群岛', postcode: '573100' },
          { code: '460323', value: '中沙群岛的岛礁及其海域', postcode: '573100' }
        ]
      },
      {
        code: '460400',
        value: '儋州市',
        postcode: '571700',
        children: [
          { code: '460401', value: '那大镇', postcode: '571700' },
          { code: '460402', value: '和庆镇', postcode: '571700' },
          { code: '460403', value: '南丰镇', postcode: '571700' },
          { code: '460404', value: '大成镇', postcode: '571700' },
          { code: '460405', value: '雅星镇', postcode: '571700' },
          { code: '460406', value: '兰洋镇', postcode: '571700' },
          { code: '460407', value: '光村镇', postcode: '571700' },
          { code: '460408', value: '木棠镇', postcode: '571700' },
          { code: '460409', value: '海头镇', postcode: '571700' },
          { code: '460410', value: '峨蔓镇', postcode: '571700' },
          { code: '460412', value: '王五镇', postcode: '571700' },
          { code: '460413', value: '白马井镇', postcode: '571700' },
          { code: '460414', value: '中和镇', postcode: '571700' },
          { code: '460415', value: '排浦镇', postcode: '571700' },
          { code: '460416', value: '东成镇', postcode: '571700' },
          { code: '460417', value: '新州镇', postcode: '571700' },
          { code: '460422', value: '洋浦经济开发区', postcode: '571700' },
          { code: '460423', value: '华南热作学院', postcode: '571700' }
        ]
      },
      {
        code: '469000',
        value: '省直辖县级行政区划',
        postcode: '0',
        children: [
          { code: '469001', value: '五指山市', postcode: '572200' },
          { code: '469002', value: '琼海市', postcode: '571400' },
          { code: '469005', value: '文昌市', postcode: '571300' },
          { code: '469006', value: '万宁市', postcode: '571500' },
          { code: '469007', value: '东方市', postcode: '572600' },
          { code: '469021', value: '定安县', postcode: '571200' },
          { code: '469022', value: '屯昌县', postcode: '571600' },
          { code: '469023', value: '澄迈县', postcode: '571900' },
          { code: '469024', value: '临高县', postcode: '571800' },
          { code: '469025', value: '白沙黎族自治县', postcode: '572800' },
          { code: '469026', value: '昌江黎族自治县', postcode: '572700' },
          { code: '469027', value: '乐东黎族自治县', postcode: '572500' },
          { code: '469028', value: '陵水黎族自治县', postcode: '572400' },
          { code: '469029', value: '保亭黎族苗族自治县', postcode: '572300' },
          { code: '469030', value: '琼中黎族苗族自治县', postcode: '572900' }
        ]
      }
    ]
  },
  {
    code: '500000',
    value: '重庆市',
    postcode: '400000',
    children: [
      {
        code: '500100',
        value: '重庆市',
        postcode: '400000',
        children: [
          { code: '500101', value: '万州区', postcode: '404100' },
          { code: '500102', value: '涪陵区', postcode: '408000' },
          { code: '500103', value: '渝中区', postcode: '400010' },
          { code: '500104', value: '大渡口区', postcode: '400080' },
          { code: '500105', value: '江北区', postcode: '400020' },
          { code: '500106', value: '沙坪坝区', postcode: '400030' },
          { code: '500107', value: '九龙坡区', postcode: '400050' },
          { code: '500108', value: '南岸区', postcode: '400064' },
          { code: '500109', value: '北碚区', postcode: '400700' },
          { code: '500110', value: '綦江区', postcode: '400000' },
          { code: '500111', value: '大足区', postcode: '400000' },
          { code: '500112', value: '渝北区', postcode: '401120' },
          { code: '500113', value: '巴南区', postcode: '401320' },
          { code: '500114', value: '黔江区', postcode: '409700' },
          { code: '500115', value: '长寿区', postcode: '401220' },
          { code: '500116', value: '江津区', postcode: '402260' },
          { code: '500117', value: '合川区', postcode: '401520' },
          { code: '500118', value: '永川区', postcode: '402160' },
          { code: '500119', value: '南川区', postcode: '408400' },
          { code: '500120', value: '璧山区', postcode: '408400' },
          { code: '500151', value: '铜梁区', postcode: '408400' },
          { code: '500152', value: '潼南区', postcode: '402660' },
          { code: '500153', value: '荣昌区', postcode: '408400' },
          { code: '500154', value: '开州区', postcode: '408400' },
          { code: '500155', value: '梁平区', postcode: '405200' },
          { code: '500156', value: '武隆区', postcode: '408500' }
        ]
      },
      {
        code: '500200',
        value: '县',
        postcode: '0',
        children: [
          { code: '500229', value: '城口县', postcode: '405900' },
          { code: '500230', value: '丰都县', postcode: '408200' },
          { code: '500231', value: '垫江县', postcode: '408300' },
          { code: '500233', value: '忠县', postcode: '404300' },
          { code: '500235', value: '云阳县', postcode: '404500' },
          { code: '500236', value: '奉节县', postcode: '404600' },
          { code: '500237', value: '巫山县', postcode: '404700' },
          { code: '500238', value: '巫溪县', postcode: '405800' },
          { code: '500240', value: '石柱土家族自治县', postcode: '409100' },
          { code: '500241', value: '秀山土家族苗族自治县', postcode: '409900' },
          { code: '500242', value: '酉阳土家族苗族自治县', postcode: '409800' },
          { code: '500243', value: '彭水苗族土家族自治县', postcode: '409600' }
        ]
      }
    ]
  },
  {
    code: '510000',
    value: '四川省',
    postcode: '0',
    children: [
      {
        code: '510100',
        value: '成都市',
        postcode: '610000',
        children: [
          { code: '510104', value: '锦江区', postcode: '610021' },
          { code: '510105', value: '青羊区', postcode: '610031' },
          { code: '510106', value: '金牛区', postcode: '610036' },
          { code: '510107', value: '武侯区', postcode: '610041' },
          { code: '510108', value: '成华区', postcode: '610066' },
          { code: '510112', value: '龙泉驿区', postcode: '610100' },
          { code: '510113', value: '青白江区', postcode: '610300' },
          { code: '510114', value: '新都区', postcode: '610500' },
          { code: '510115', value: '温江区', postcode: '611130' },
          { code: '510116', value: '双流区', postcode: '610200' },
          { code: '510117', value: '郫都区', postcode: '611730' },
          { code: '510121', value: '金堂县', postcode: '610400' },
          { code: '510129', value: '大邑县', postcode: '611300' },
          { code: '510131', value: '蒲江县', postcode: '611630' },
          { code: '510132', value: '新津县', postcode: '611430' },
          { code: '510181', value: '都江堰市', postcode: '611830' },
          { code: '510182', value: '彭州市', postcode: '611930' },
          { code: '510183', value: '邛崃市', postcode: '611530' },
          { code: '510184', value: '崇州市', postcode: '611230' },
          { code: '510185', value: '简阳市', postcode: '611230' }
        ]
      },
      {
        code: '510300',
        value: '自贡市',
        postcode: '643000',
        children: [
          { code: '510302', value: '自流井区', postcode: '643000' },
          { code: '510303', value: '贡井区', postcode: '643020' },
          { code: '510304', value: '大安区', postcode: '643010' },
          { code: '510311', value: '沿滩区', postcode: '643030' },
          { code: '510321', value: '荣县', postcode: '643100' },
          { code: '510322', value: '富顺县', postcode: '643200' }
        ]
      },
      {
        code: '510400',
        value: '攀枝花市',
        postcode: '617000',
        children: [
          { code: '510402', value: '东区', postcode: '617067' },
          { code: '510403', value: '西区', postcode: '617068' },
          { code: '510411', value: '仁和区', postcode: '617061' },
          { code: '510421', value: '米易县', postcode: '617200' },
          { code: '510422', value: '盐边县', postcode: '617100' }
        ]
      },
      {
        code: '510500',
        value: '泸州市',
        postcode: '646000',
        children: [
          { code: '510502', value: '江阳区', postcode: '646000' },
          { code: '510503', value: '纳溪区', postcode: '646300' },
          { code: '510504', value: '龙马潭区', postcode: '646000' },
          { code: '510521', value: '泸县', postcode: '646106' },
          { code: '510522', value: '合江县', postcode: '646200' },
          { code: '510524', value: '叙永县', postcode: '646400' },
          { code: '510525', value: '古蔺县', postcode: '646500' }
        ]
      },
      {
        code: '510600',
        value: '德阳市',
        postcode: '618000',
        children: [
          { code: '510603', value: '旌阳区', postcode: '618000' },
          { code: '510604', value: '罗江区', postcode: '618500' },
          { code: '510623', value: '中江县', postcode: '618100' },
          { code: '510681', value: '广汉市', postcode: '618300' },
          { code: '510682', value: '什邡市', postcode: '618300' },
          { code: '510683', value: '绵竹市', postcode: '618200' }
        ]
      },
      {
        code: '510700',
        value: '绵阳市',
        postcode: '621000',
        children: [
          { code: '510703', value: '涪城区', postcode: '621000' },
          { code: '510704', value: '游仙区', postcode: '621022' },
          { code: '510705', value: '安州区', postcode: '622650' },
          { code: '510722', value: '三台县', postcode: '621100' },
          { code: '510723', value: '盐亭县', postcode: '621600' },
          { code: '510725', value: '梓潼县', postcode: '622150' },
          { code: '510726', value: '北川羌族自治县', postcode: '622750' },
          { code: '510727', value: '平武县', postcode: '622550' },
          { code: '510781', value: '江油市', postcode: '621700' }
        ]
      },
      {
        code: '510800',
        value: '广元市',
        postcode: '628000',
        children: [
          { code: '510802', value: '利州区', postcode: '628017' },
          { code: '510811', value: '昭化区', postcode: '628000' },
          { code: '510812', value: '朝天区', postcode: '628017' },
          { code: '510821', value: '旺苍县', postcode: '628200' },
          { code: '510822', value: '青川县', postcode: '628100' },
          { code: '510823', value: '剑阁县', postcode: '628300' },
          { code: '510824', value: '苍溪县', postcode: '628400' }
        ]
      },
      {
        code: '510900',
        value: '遂宁市',
        postcode: '629000',
        children: [
          { code: '510903', value: '船山区', postcode: '629000' },
          { code: '510904', value: '安居区', postcode: '629000' },
          { code: '510921', value: '蓬溪县', postcode: '629100' },
          { code: '510923', value: '大英县', postcode: '629300' },
          { code: '510981', value: '射洪市', postcode: '629200' }
        ]
      },
      {
        code: '511000',
        value: '内江市',
        postcode: '641000',
        children: [
          { code: '511002', value: '市中区', postcode: '614000' },
          { code: '511011', value: '东兴区', postcode: '641100' },
          { code: '511024', value: '威远县', postcode: '642450' },
          { code: '511025', value: '资中县', postcode: '641200' },
          { code: '511083', value: '隆昌市', postcode: '642150' }
        ]
      },
      {
        code: '511100',
        value: '乐山市',
        postcode: '614000',
        children: [
          { code: '511102', value: '市中区', postcode: '614000' },
          { code: '511111', value: '沙湾区', postcode: '614900' },
          { code: '511112', value: '五通桥区', postcode: '614800' },
          { code: '511113', value: '金口河区', postcode: '614700' },
          { code: '511123', value: '犍为县', postcode: '614400' },
          { code: '511124', value: '井研县', postcode: '613100' },
          { code: '511126', value: '夹江县', postcode: '614100' },
          { code: '511129', value: '沐川县', postcode: '614500' },
          { code: '511132', value: '峨边彝族自治县', postcode: '614300' },
          { code: '511133', value: '马边彝族自治县', postcode: '614600' },
          { code: '511181', value: '峨眉山市', postcode: '614200' }
        ]
      },
      {
        code: '511300',
        value: '南充市',
        postcode: '637000',
        children: [
          { code: '511302', value: '顺庆区', postcode: '637000' },
          { code: '511303', value: '高坪区', postcode: '637100' },
          { code: '511304', value: '嘉陵区', postcode: '637100' },
          { code: '511321', value: '南部县', postcode: '637300' },
          { code: '511322', value: '营山县', postcode: '637700' },
          { code: '511323', value: '蓬安县', postcode: '637800' },
          { code: '511324', value: '仪陇县', postcode: '637600' },
          { code: '511325', value: '西充县', postcode: '637200' },
          { code: '511381', value: '阆中市', postcode: '637400' }
        ]
      },
      {
        code: '511400',
        value: '眉山市',
        postcode: '620000',
        children: [
          { code: '511402', value: '东坡区', postcode: '620010' },
          { code: '511403', value: '彭山区', postcode: '620860' },
          { code: '511421', value: '仁寿县', postcode: '620500' },
          { code: '511423', value: '洪雅县', postcode: '620360' },
          { code: '511424', value: '丹棱县', postcode: '620200' },
          { code: '511425', value: '青神县', postcode: '620460' }
        ]
      },
      {
        code: '511500',
        value: '宜宾市',
        postcode: '644000',
        children: [
          { code: '511502', value: '翠屏区', postcode: '644000' },
          { code: '511503', value: '南溪区', postcode: '644100' },
          { code: '511504', value: '叙州区', postcode: '644600' },
          { code: '511523', value: '江安县', postcode: '644200' },
          { code: '511524', value: '长宁县', postcode: '644300' },
          { code: '511525', value: '高县', postcode: '645150' },
          { code: '511526', value: '珙县', postcode: '644500' },
          { code: '511527', value: '筠连县', postcode: '645250' },
          { code: '511528', value: '兴文县', postcode: '644400' },
          { code: '511529', value: '屏山县', postcode: '645350' }
        ]
      },
      {
        code: '511600',
        value: '广安市',
        postcode: '638500',
        children: [
          { code: '511602', value: '广安区', postcode: '638000' },
          { code: '511603', value: '前锋区', postcode: '638019' },
          { code: '511621', value: '岳池县', postcode: '638300' },
          { code: '511622', value: '武胜县', postcode: '638400' },
          { code: '511623', value: '邻水县', postcode: '638500' },
          { code: '511681', value: '华蓥市', postcode: '638600' }
        ]
      },
      {
        code: '511700',
        value: '达州市',
        postcode: '635000',
        children: [
          { code: '511702', value: '通川区', postcode: '635000' },
          { code: '511703', value: '达川区', postcode: '635000' },
          { code: '511722', value: '宣汉县', postcode: '636150' },
          { code: '511723', value: '开江县', postcode: '636250' },
          { code: '511724', value: '大竹县', postcode: '635100' },
          { code: '511725', value: '渠县', postcode: '635200' },
          { code: '511781', value: '万源市', postcode: '636350' }
        ]
      },
      {
        code: '511800',
        value: '雅安市',
        postcode: '625000',
        children: [
          { code: '511802', value: '雨城区', postcode: '625000' },
          { code: '511803', value: '名山区', postcode: '625100' },
          { code: '511822', value: '荥经县', postcode: '625200' },
          { code: '511823', value: '汉源县', postcode: '625300' },
          { code: '511824', value: '石棉县', postcode: '625400' },
          { code: '511825', value: '天全县', postcode: '625500' },
          { code: '511826', value: '芦山县', postcode: '625600' },
          { code: '511827', value: '宝兴县', postcode: '625700' }
        ]
      },
      {
        code: '511900',
        value: '巴中市',
        postcode: '636600',
        children: [
          { code: '511902', value: '巴州区', postcode: '636001' },
          { code: '511903', value: '恩阳区', postcode: '636001' },
          { code: '511921', value: '通江县', postcode: '636700' },
          { code: '511922', value: '南江县', postcode: '636600' },
          { code: '511923', value: '平昌县', postcode: '636400' }
        ]
      },
      {
        code: '512000',
        value: '资阳市',
        postcode: '641300',
        children: [
          { code: '512002', value: '雁江区', postcode: '641300' },
          { code: '512021', value: '安岳县', postcode: '642350' },
          { code: '512022', value: '乐至县', postcode: '641500' }
        ]
      },
      {
        code: '513200',
        value: '阿坝藏族羌族自治州',
        postcode: '624000',
        children: [
          { code: '513201', value: '马尔康市', postcode: '624000' },
          { code: '513221', value: '汶川县', postcode: '623000' },
          { code: '513222', value: '理县', postcode: '623100' },
          { code: '513223', value: '茂县', postcode: '623200' },
          { code: '513224', value: '松潘县', postcode: '623300' },
          { code: '513225', value: '九寨沟县', postcode: '623400' },
          { code: '513226', value: '金川县', postcode: '624100' },
          { code: '513227', value: '小金县', postcode: '624200' },
          { code: '513228', value: '黑水县', postcode: '623500' },
          { code: '513230', value: '壤塘县', postcode: '624300' },
          { code: '513231', value: '阿坝县', postcode: '624600' },
          { code: '513232', value: '若尔盖县', postcode: '624500' },
          { code: '513233', value: '红原县', postcode: '624400' }
        ]
      },
      {
        code: '513300',
        value: '甘孜藏族自治州',
        postcode: '626000',
        children: [
          { code: '513301', value: '康定市', postcode: '626000' },
          { code: '513322', value: '泸定县', postcode: '626100' },
          { code: '513323', value: '丹巴县', postcode: '626300' },
          { code: '513324', value: '九龙县', postcode: '626200' },
          { code: '513325', value: '雅江县', postcode: '627450' },
          { code: '513326', value: '道孚县', postcode: '626400' },
          { code: '513327', value: '炉霍县', postcode: '626500' },
          { code: '513328', value: '甘孜县', postcode: '626700' },
          { code: '513329', value: '新龙县', postcode: '626800' },
          { code: '513330', value: '德格县', postcode: '627250' },
          { code: '513331', value: '白玉县', postcode: '627150' },
          { code: '513332', value: '石渠县', postcode: '627350' },
          { code: '513333', value: '色达县', postcode: '626600' },
          { code: '513334', value: '理塘县', postcode: '627550' },
          { code: '513335', value: '巴塘县', postcode: '627650' },
          { code: '513336', value: '乡城县', postcode: '627850' },
          { code: '513337', value: '稻城县', postcode: '627750' },
          { code: '513338', value: '得荣县', postcode: '627950' }
        ]
      },
      {
        code: '513400',
        value: '凉山彝族自治州',
        postcode: '615000',
        children: [
          { code: '513401', value: '西昌市', postcode: '615000' },
          { code: '513422', value: '木里藏族自治县', postcode: '615800' },
          { code: '513423', value: '盐源县', postcode: '615700' },
          { code: '513424', value: '德昌县', postcode: '615500' },
          { code: '513425', value: '会理县', postcode: '615100' },
          { code: '513426', value: '会东县', postcode: '615200' },
          { code: '513427', value: '宁南县', postcode: '615400' },
          { code: '513428', value: '普格县', postcode: '615300' },
          { code: '513429', value: '布拖县', postcode: '615350' },
          { code: '513430', value: '金阳县', postcode: '616250' },
          { code: '513431', value: '昭觉县', postcode: '616150' },
          { code: '513432', value: '喜德县', postcode: '616750' },
          { code: '513433', value: '冕宁县', postcode: '615600' },
          { code: '513434', value: '越西县', postcode: '616650' },
          { code: '513435', value: '甘洛县', postcode: '616850' },
          { code: '513436', value: '美姑县', postcode: '616450' },
          { code: '513437', value: '雷波县', postcode: '616550' }
        ]
      }
    ]
  },
  {
    code: '520000',
    value: '贵州省',
    postcode: '0',
    children: [
      {
        code: '520100',
        value: '贵阳市',
        postcode: '550000',
        children: [
          { code: '520102', value: '南明区', postcode: '550001' },
          { code: '520103', value: '云岩区', postcode: '550001' },
          { code: '520111', value: '花溪区', postcode: '550025' },
          { code: '520112', value: '乌当区', postcode: '550018' },
          { code: '520113', value: '白云区', postcode: '550014' },
          { code: '520115', value: '观山湖区', postcode: '550009' },
          { code: '520121', value: '开阳县', postcode: '550300' },
          { code: '520122', value: '息烽县', postcode: '551100' },
          { code: '520123', value: '修文县', postcode: '550200' },
          { code: '520181', value: '清镇市', postcode: '551400' }
        ]
      },
      {
        code: '520200',
        value: '六盘水市',
        postcode: '553000',
        children: [
          { code: '520201', value: '钟山区', postcode: '553000' },
          { code: '520203', value: '六枝特区', postcode: '553400' },
          { code: '520221', value: '水城县', postcode: '553000' },
          { code: '520281', value: '盘州市', postcode: '561601' }
        ]
      },
      {
        code: '520300',
        value: '遵义市',
        postcode: '563000',
        children: [
          { code: '520302', value: '红花岗区', postcode: '563000' },
          { code: '520303', value: '汇川区', postcode: '563000' },
          { code: '520304', value: '播州区', postcode: '563000' },
          { code: '520322', value: '桐梓县', postcode: '563200' },
          { code: '520323', value: '绥阳县', postcode: '563300' },
          { code: '520324', value: '正安县', postcode: '563400' },
          { code: '520325', value: '道真仡佬族苗族自治县', postcode: '563500' },
          { code: '520326', value: '务川仡佬族苗族自治县', postcode: '564300' },
          { code: '520327', value: '凤冈县', postcode: '564200' },
          { code: '520328', value: '湄潭县', postcode: '564100' },
          { code: '520329', value: '余庆县', postcode: '564400' },
          { code: '520330', value: '习水县', postcode: '564600' },
          { code: '520381', value: '赤水市', postcode: '564700' },
          { code: '520382', value: '仁怀市', postcode: '564500' }
        ]
      },
      {
        code: '520400',
        value: '安顺市',
        postcode: '561000',
        children: [
          { code: '520402', value: '西秀区', postcode: '561000' },
          { code: '520403', value: '平坝区', postcode: '561100' },
          { code: '520422', value: '普定县', postcode: '562100' },
          { code: '520423', value: '镇宁布依族苗族自治县', postcode: '561200' },
          { code: '520424', value: '关岭布依族苗族自治县', postcode: '561300' },
          { code: '520425', value: '紫云苗族布依族自治县', postcode: '550800' }
        ]
      },
      {
        code: '520500',
        value: '毕节市',
        postcode: '551700',
        children: [
          { code: '520502', value: '七星关区', postcode: '551700' },
          { code: '520521', value: '大方县', postcode: '551600' },
          { code: '520522', value: '黔西县', postcode: '551500' },
          { code: '520523', value: '金沙县', postcode: '551800' },
          { code: '520524', value: '织金县', postcode: '552100' },
          { code: '520525', value: '纳雍县', postcode: '553300' },
          { code: '520526', value: '威宁彝族回族苗族自治县', postcode: '553100' },
          { code: '520527', value: '赫章县', postcode: '553200' }
        ]
      },
      {
        code: '520600',
        value: '铜仁市',
        postcode: '554300',
        children: [
          { code: '520602', value: '碧江区', postcode: '554300' },
          { code: '520603', value: '万山区', postcode: '554300' },
          { code: '520621', value: '江口县', postcode: '554400' },
          { code: '520622', value: '玉屏侗族自治县', postcode: '554004' },
          { code: '520623', value: '石阡县', postcode: '555100' },
          { code: '520624', value: '思南县', postcode: '565100' },
          { code: '520625', value: '印江土家族苗族自治县', postcode: '555200' },
          { code: '520626', value: '德江县', postcode: '565200' },
          { code: '520627', value: '沿河土家族自治县', postcode: '565300' },
          { code: '520628', value: '松桃苗族自治县', postcode: '554100' }
        ]
      },
      {
        code: '522300',
        value: '黔西南布依族苗族自治州',
        postcode: '562400',
        children: [
          { code: '522301', value: '兴义市', postcode: '562400' },
          { code: '522302', value: '兴仁市', postcode: '562300' },
          { code: '522323', value: '普安县', postcode: '561500' },
          { code: '522324', value: '晴隆县', postcode: '561400' },
          { code: '522325', value: '贞丰县', postcode: '562200' },
          { code: '522326', value: '望谟县', postcode: '552300' },
          { code: '522327', value: '册亨县', postcode: '552200' },
          { code: '522328', value: '安龙县', postcode: '552400' }
        ]
      },
      {
        code: '522600',
        value: '黔东南苗族侗族自治州',
        postcode: '556000',
        children: [
          { code: '522601', value: '凯里市', postcode: '556000' },
          { code: '522622', value: '黄平县', postcode: '556100' },
          { code: '522623', value: '施秉县', postcode: '556200' },
          { code: '522624', value: '三穗县', postcode: '556500' },
          { code: '522625', value: '镇远县', postcode: '557700' },
          { code: '522626', value: '岑巩县', postcode: '557800' },
          { code: '522627', value: '天柱县', postcode: '556600' },
          { code: '522628', value: '锦屏县', postcode: '556700' },
          { code: '522629', value: '剑河县', postcode: '556400' },
          { code: '522630', value: '台江县', postcode: '556300' },
          { code: '522631', value: '黎平县', postcode: '557300' },
          { code: '522632', value: '榕江县', postcode: '557200' },
          { code: '522633', value: '从江县', postcode: '557400' },
          { code: '522634', value: '雷山县', postcode: '557100' },
          { code: '522635', value: '麻江县', postcode: '557600' },
          { code: '522636', value: '丹寨县', postcode: '557500' }
        ]
      },
      {
        code: '522700',
        value: '黔南布依族苗族自治州',
        postcode: '558000',
        children: [
          { code: '522701', value: '都匀市', postcode: '558000' },
          { code: '522702', value: '福泉市', postcode: '550500' },
          { code: '522722', value: '荔波县', postcode: '558400' },
          { code: '522723', value: '贵定县', postcode: '551300' },
          { code: '522725', value: '瓮安县', postcode: '550400' },
          { code: '522726', value: '独山县', postcode: '558200' },
          { code: '522727', value: '平塘县', postcode: '558300' },
          { code: '522728', value: '罗甸县', postcode: '550100' },
          { code: '522729', value: '长顺县', postcode: '550700' },
          { code: '522730', value: '龙里县', postcode: '551200' },
          { code: '522731', value: '惠水县', postcode: '550600' },
          { code: '522732', value: '三都水族自治县', postcode: '558100' }
        ]
      }
    ]
  },
  {
    code: '530000',
    value: '云南省',
    postcode: '0',
    children: [
      {
        code: '530100',
        value: '昆明市',
        postcode: '650000',
        children: [
          { code: '530102', value: '五华区', postcode: '650032' },
          { code: '530103', value: '盘龙区', postcode: '650051' },
          { code: '530111', value: '官渡区', postcode: '650217' },
          { code: '530112', value: '西山区', postcode: '650100' },
          { code: '530113', value: '东川区', postcode: '654100' },
          { code: '530114', value: '呈贡区', postcode: '650000' },
          { code: '530115', value: '晋宁区', postcode: '650600' },
          { code: '530124', value: '富民县', postcode: '650400' },
          { code: '530125', value: '宜良县', postcode: '652100' },
          { code: '530126', value: '石林彝族自治县', postcode: '652200' },
          { code: '530127', value: '嵩明县', postcode: '651700' },
          { code: '530128', value: '禄劝彝族苗族自治县', postcode: '651500' },
          { code: '530129', value: '寻甸回族彝族自治县', postcode: '655200' },
          { code: '530181', value: '安宁市', postcode: '650300' }
        ]
      },
      {
        code: '530300',
        value: '曲靖市',
        postcode: '655000',
        children: [
          { code: '530302', value: '麒麟区', postcode: '655000' },
          { code: '530303', value: '沾益区', postcode: '655331' },
          { code: '530304', value: '马龙区', postcode: '655100' },
          { code: '530322', value: '陆良县', postcode: '655600' },
          { code: '530323', value: '师宗县', postcode: '655700' },
          { code: '530324', value: '罗平县', postcode: '655800' },
          { code: '530325', value: '富源县', postcode: '655500' },
          { code: '530326', value: '会泽县', postcode: '654200' },
          { code: '530381', value: '宣威市', postcode: '655400' }
        ]
      },
      {
        code: '530400',
        value: '玉溪市',
        postcode: '653100',
        children: [
          { code: '530402', value: '红塔区', postcode: '653100' },
          { code: '530403', value: '江川区', postcode: '652600' },
          { code: '530423', value: '通海县', postcode: '652700' },
          { code: '530424', value: '华宁县', postcode: '652800' },
          { code: '530425', value: '易门县', postcode: '651100' },
          { code: '530426', value: '峨山彝族自治县', postcode: '653200' },
          { code: '530427', value: '新平彝族傣族自治县', postcode: '653400' },
          { code: '530428', value: '元江哈尼族彝族傣族自治县', postcode: '653300' },
          { code: '530481', value: '澄江市', postcode: '652500' }
        ]
      },
      {
        code: '530500',
        value: '保山市',
        postcode: '678000',
        children: [
          { code: '530502', value: '隆阳区', postcode: '678000' },
          { code: '530521', value: '施甸县', postcode: '678200' },
          { code: '530523', value: '龙陵县', postcode: '678300' },
          { code: '530524', value: '昌宁县', postcode: '678100' },
          { code: '530581', value: '腾冲市', postcode: '679100' }
        ]
      },
      {
        code: '530600',
        value: '昭通市',
        postcode: '657000',
        children: [
          { code: '530602', value: '昭阳区', postcode: '657000' },
          { code: '530621', value: '鲁甸县', postcode: '657100' },
          { code: '530622', value: '巧家县', postcode: '654600' },
          { code: '530623', value: '盐津县', postcode: '657500' },
          { code: '530624', value: '大关县', postcode: '657400' },
          { code: '530625', value: '永善县', postcode: '657300' },
          { code: '530626', value: '绥江县', postcode: '657700' },
          { code: '530627', value: '镇雄县', postcode: '657200' },
          { code: '530628', value: '彝良县', postcode: '657600' },
          { code: '530629', value: '威信县', postcode: '657900' },
          { code: '530681', value: '水富市', postcode: '657800' }
        ]
      },
      {
        code: '530700',
        value: '丽江市',
        postcode: '674100',
        children: [
          { code: '530702', value: '古城区', postcode: '674100' },
          { code: '530721', value: '玉龙纳西族自治县', postcode: '674100' },
          { code: '530722', value: '永胜县', postcode: '674200' },
          { code: '530723', value: '华坪县', postcode: '674800' },
          { code: '530724', value: '宁蒗彝族自治县', postcode: '674300' }
        ]
      },
      {
        code: '530800',
        value: '普洱市',
        postcode: '665000',
        children: [
          { code: '530802', value: '思茅区', postcode: '665000' },
          { code: '530821', value: '宁洱哈尼族彝族自治县', postcode: '665100' },
          { code: '530822', value: '墨江哈尼族自治县', postcode: '654800' },
          { code: '530823', value: '景东彝族自治县', postcode: '676200' },
          { code: '530824', value: '景谷傣族彝族自治县', postcode: '666400' },
          { code: '530825', value: '镇沅彝族哈尼族拉祜族自治县', postcode: '666500' },
          { code: '530826', value: '江城哈尼族彝族自治县', postcode: '665900' },
          { code: '530827', value: '孟连傣族拉祜族佤族自治县', postcode: '665800' },
          { code: '530828', value: '澜沧拉祜族自治县', postcode: '665600' },
          { code: '530829', value: '西盟佤族自治县', postcode: '665700' }
        ]
      },
      {
        code: '530900',
        value: '临沧市',
        postcode: '677000',
        children: [
          { code: '530902', value: '临翔区', postcode: '677000' },
          { code: '530921', value: '凤庆县', postcode: '675900' },
          { code: '530922', value: '云县', postcode: '675800' },
          { code: '530923', value: '永德县', postcode: '677600' },
          { code: '530924', value: '镇康县', postcode: '677704' },
          { code: '530925', value: '双江拉祜族佤族布朗族傣族自治县', postcode: '677300' },
          { code: '530926', value: '耿马傣族佤族自治县', postcode: '677500' },
          { code: '530927', value: '沧源佤族自治县', postcode: '677400' }
        ]
      },
      {
        code: '532300',
        value: '楚雄彝族自治州',
        postcode: '675000',
        children: [
          { code: '532301', value: '楚雄市', postcode: '675000' },
          { code: '532322', value: '双柏县', postcode: '675100' },
          { code: '532323', value: '牟定县', postcode: '675500' },
          { code: '532324', value: '南华县', postcode: '675200' },
          { code: '532325', value: '姚安县', postcode: '675300' },
          { code: '532326', value: '大姚县', postcode: '675400' },
          { code: '532327', value: '永仁县', postcode: '651400' },
          { code: '532328', value: '元谋县', postcode: '651300' },
          { code: '532329', value: '武定县', postcode: '651600' },
          { code: '532331', value: '禄丰县', postcode: '651200' }
        ]
      },
      {
        code: '532500',
        value: '红河哈尼族彝族自治州',
        postcode: '661400',
        children: [
          { code: '532501', value: '个旧市', postcode: '661000' },
          { code: '532502', value: '开远市', postcode: '661600' },
          { code: '532503', value: '蒙自市', postcode: '661400' },
          { code: '532504', value: '弥勒市', postcode: '652399' },
          { code: '532523', value: '屏边苗族自治县', postcode: '661200' },
          { code: '532524', value: '建水县', postcode: '654300' },
          { code: '532525', value: '石屏县', postcode: '654300' },
          { code: '532527', value: '泸西县', postcode: '652400' },
          { code: '532528', value: '元阳县', postcode: '662400' },
          { code: '532529', value: '红河县', postcode: '654400' },
          { code: '532530', value: '金平苗族瑶族傣族自治县', postcode: '661500' },
          { code: '532531', value: '绿春县', postcode: '662500' },
          { code: '532532', value: '河口瑶族自治县', postcode: '661300' }
        ]
      },
      {
        code: '532600',
        value: '文山壮族苗族自治州',
        postcode: '663000',
        children: [
          { code: '532601', value: '文山市', postcode: '663000' },
          { code: '532622', value: '砚山县', postcode: '663100' },
          { code: '532623', value: '西畴县', postcode: '663500' },
          { code: '532624', value: '麻栗坡县', postcode: '663600' },
          { code: '532625', value: '马关县', postcode: '663700' },
          { code: '532626', value: '丘北县', postcode: '663200' },
          { code: '532627', value: '广南县', postcode: '663300' },
          { code: '532628', value: '富宁县', postcode: '663400' }
        ]
      },
      {
        code: '532800',
        value: '西双版纳傣族自治州',
        postcode: '666100',
        children: [
          { code: '532801', value: '景洪市', postcode: '666100' },
          { code: '532822', value: '勐海县', postcode: '666200' },
          { code: '532823', value: '勐腊县', postcode: '666300' }
        ]
      },
      {
        code: '532900',
        value: '大理白族自治州',
        postcode: '671000',
        children: [
          { code: '532901', value: '大理市', postcode: '671000' },
          { code: '532922', value: '漾濞彝族自治县', postcode: '672500' },
          { code: '532923', value: '祥云县', postcode: '672100' },
          { code: '532924', value: '宾川县', postcode: '671600' },
          { code: '532925', value: '弥渡县', postcode: '675600' },
          { code: '532926', value: '南涧彝族自治县', postcode: '675700' },
          { code: '532927', value: '巍山彝族回族自治县', postcode: '672400' },
          { code: '532928', value: '永平县', postcode: '672600' },
          { code: '532929', value: '云龙县', postcode: '672700' },
          { code: '532930', value: '洱源县', postcode: '671200' },
          { code: '532931', value: '剑川县', postcode: '671300' },
          { code: '532932', value: '鹤庆县', postcode: '671500' }
        ]
      },
      {
        code: '533100',
        value: '德宏傣族景颇族自治州',
        postcode: '678400',
        children: [
          { code: '533102', value: '瑞丽市', postcode: '678600' },
          { code: '533103', value: '芒市', postcode: '678400' },
          { code: '533122', value: '梁河县', postcode: '679200' },
          { code: '533123', value: '盈江县', postcode: '679300' },
          { code: '533124', value: '陇川县', postcode: '678700' }
        ]
      },
      {
        code: '533300',
        value: '怒江傈僳族自治州',
        postcode: '673100',
        children: [
          { code: '533301', value: '泸水市', postcode: '673100' },
          { code: '533323', value: '福贡县', postcode: '673400' },
          { code: '533324', value: '贡山独龙族怒族自治县', postcode: '673500' },
          { code: '533325', value: '兰坪白族普米族自治县', postcode: '671400' }
        ]
      },
      {
        code: '533400',
        value: '迪庆藏族自治州',
        postcode: '674400',
        children: [
          { code: '533401', value: '香格里拉市', postcode: '674400' },
          { code: '533422', value: '德钦县', postcode: '674500' },
          { code: '533423', value: '维西傈僳族自治县', postcode: '674600' }
        ]
      }
    ]
  },
  {
    code: '540000',
    value: '西藏自治区',
    postcode: '0',
    children: [
      {
        code: '540100',
        value: '拉萨市',
        postcode: '850000',
        children: [
          { code: '540102', value: '城关区', postcode: '850000' },
          { code: '540103', value: '堆龙德庆区', postcode: '851400' },
          { code: '540104', value: '达孜区', postcode: '850100' },
          { code: '540121', value: '林周县', postcode: '852000' },
          { code: '540122', value: '当雄县', postcode: '851500' },
          { code: '540123', value: '尼木县', postcode: '851300' },
          { code: '540124', value: '曲水县', postcode: '850600' },
          { code: '540127', value: '墨竹工卡县', postcode: '850200' }
        ]
      },
      {
        code: '540200',
        value: '日喀则市',
        postcode: '857000',
        children: [
          { code: '540202', value: '桑珠孜区', postcode: '857000' },
          { code: '540221', value: '南木林县', postcode: '857100' },
          { code: '540222', value: '江孜县', postcode: '857400' },
          { code: '540223', value: '定日县', postcode: '858200' },
          { code: '540224', value: '萨迦县', postcode: '857800' },
          { code: '540225', value: '拉孜县', postcode: '858100' },
          { code: '540226', value: '昂仁县', postcode: '858500' },
          { code: '540227', value: '谢通门县', postcode: '858900' },
          { code: '540228', value: '白朗县', postcode: '857300' },
          { code: '540229', value: '仁布县', postcode: '857200' },
          { code: '540230', value: '康马县', postcode: '857500' },
          { code: '540231', value: '定结县', postcode: '857900' },
          { code: '540232', value: '仲巴县', postcode: '858800' },
          { code: '540233', value: '亚东县', postcode: '857600' },
          { code: '540234', value: '吉隆县', postcode: '858700' },
          { code: '540235', value: '聂拉木县', postcode: '858300' },
          { code: '540236', value: '萨嘎县', postcode: '857800' },
          { code: '540237', value: '岗巴县', postcode: '857700' }
        ]
      },
      {
        code: '540300',
        value: '昌都市',
        postcode: '854000',
        children: [
          { code: '540302', value: '卡若区', postcode: '854000' },
          { code: '540321', value: '江达县', postcode: '854100' },
          { code: '540322', value: '贡觉县', postcode: '854200' },
          { code: '540323', value: '类乌齐县', postcode: '855600' },
          { code: '540324', value: '丁青县', postcode: '855700' },
          { code: '540325', value: '察雅县', postcode: '854300' },
          { code: '540326', value: '八宿县', postcode: '854600' },
          { code: '540327', value: '左贡县', postcode: '854400' },
          { code: '540328', value: '芒康县', postcode: '854500' },
          { code: '540329', value: '洛隆县', postcode: '855400' },
          { code: '540330', value: '边坝县', postcode: '855500' }
        ]
      },
      {
        code: '540400',
        value: '林芝市',
        postcode: '860000',
        children: [
          { code: '540402', value: '巴宜区', postcode: '850400' },
          { code: '540421', value: '工布江达县', postcode: '850300' },
          { code: '540422', value: '米林县', postcode: '860500' },
          { code: '540423', value: '墨脱县', postcode: '855300' },
          { code: '540424', value: '波密县', postcode: '855200' },
          { code: '540425', value: '察隅县', postcode: '855100' },
          { code: '540426', value: '朗县', postcode: '856500' }
        ]
      },
      {
        code: '540500',
        value: '山南市',
        postcode: '856000',
        children: [
          { code: '540502', value: '乃东区', postcode: '856100' },
          { code: '540521', value: '扎囊县', postcode: '850800' },
          { code: '540522', value: '贡嘎县', postcode: '850700' },
          { code: '540523', value: '桑日县', postcode: '856200' },
          { code: '540524', value: '琼结县', postcode: '856800' },
          { code: '540525', value: '曲松县', postcode: '856300' },
          { code: '540526', value: '措美县', postcode: '856900' },
          { code: '540527', value: '洛扎县', postcode: '851200' },
          { code: '540528', value: '加查县', postcode: '856400' },
          { code: '540529', value: '隆子县', postcode: '856600' },
          { code: '540530', value: '错那县', postcode: '856700' },
          { code: '540531', value: '浪卡子县', postcode: '851000' }
        ]
      },
      {
        code: '540600',
        value: '那曲市',
        postcode: '852000',
        children: [
          { code: '540602', value: '色尼区', postcode: '852000' },
          { code: '540621', value: '嘉黎县', postcode: '852400' },
          { code: '540622', value: '比如县', postcode: '852300' },
          { code: '540623', value: '聂荣县', postcode: '853500' },
          { code: '540624', value: '安多县', postcode: '853400' },
          { code: '540625', value: '申扎县', postcode: '853100' },
          { code: '540626', value: '索县', postcode: '852200' },
          { code: '540627', value: '班戈县', postcode: '852500' },
          { code: '540628', value: '巴青县', postcode: '852100' },
          { code: '540629', value: '尼玛县', postcode: '853200' },
          { code: '540630', value: '双湖县', postcode: '853300' }
        ]
      },
      {
        code: '542500',
        value: '阿里地区',
        postcode: '859000',
        children: [
          { code: '542521', value: '普兰县', postcode: '859500' },
          { code: '542522', value: '札达县', postcode: '859600' },
          { code: '542523', value: '噶尔县', postcode: '859400' },
          { code: '542524', value: '日土县', postcode: '859700' },
          { code: '542525', value: '革吉县', postcode: '859100' },
          { code: '542526', value: '改则县', postcode: '859200' },
          { code: '542527', value: '措勤县', postcode: '859300' }
        ]
      }
    ]
  },
  {
    code: '610000',
    value: '陕西省',
    postcode: '0',
    children: [
      {
        code: '610100',
        value: '西安市',
        postcode: '710000',
        children: [
          { code: '610102', value: '新城区', postcode: '710004' },
          { code: '610103', value: '碑林区', postcode: '710001' },
          { code: '610104', value: '莲湖区', postcode: '710003' },
          { code: '610111', value: '灞桥区', postcode: '710038' },
          { code: '610112', value: '未央区', postcode: '710014' },
          { code: '610113', value: '雁塔区', postcode: '710061' },
          { code: '610114', value: '阎良区', postcode: '710087' },
          { code: '610115', value: '临潼区', postcode: '710600' },
          { code: '610116', value: '长安区', postcode: '710100' },
          { code: '610117', value: '高陵区', postcode: '710200' },
          { code: '610118', value: '鄠邑区', postcode: '710300' },
          { code: '610122', value: '蓝田县', postcode: '710500' },
          { code: '610124', value: '周至县', postcode: '710400' }
        ]
      },
      {
        code: '610200',
        value: '铜川市',
        postcode: '727000',
        children: [
          { code: '610202', value: '王益区', postcode: '727000' },
          { code: '610203', value: '印台区', postcode: '727007' },
          { code: '610204', value: '耀州区', postcode: '727100' },
          { code: '610222', value: '宜君县', postcode: '727200' }
        ]
      },
      {
        code: '610300',
        value: '宝鸡市',
        postcode: '721000',
        children: [
          { code: '610302', value: '渭滨区', postcode: '721000' },
          { code: '610303', value: '金台区', postcode: '721000' },
          { code: '610304', value: '陈仓区', postcode: '721300' },
          { code: '610322', value: '凤翔县', postcode: '721400' },
          { code: '610323', value: '岐山县', postcode: '722400' },
          { code: '610324', value: '扶风县', postcode: '722200' },
          { code: '610326', value: '眉县', postcode: '722300' },
          { code: '610327', value: '陇县', postcode: '721200' },
          { code: '610328', value: '千阳县', postcode: '721100' },
          { code: '610329', value: '麟游县', postcode: '721500' },
          { code: '610330', value: '凤县', postcode: '721700' },
          { code: '610331', value: '太白县', postcode: '721600' }
        ]
      },
      {
        code: '610400',
        value: '咸阳市',
        postcode: '712000',
        children: [
          { code: '610402', value: '秦都区', postcode: '712000' },
          { code: '610403', value: '杨陵区', postcode: '712100' },
          { code: '610404', value: '渭城区', postcode: '712000' },
          { code: '610422', value: '三原县', postcode: '713800' },
          { code: '610423', value: '泾阳县', postcode: '713700' },
          { code: '610424', value: '乾县', postcode: '713300' },
          { code: '610425', value: '礼泉县', postcode: '713200' },
          { code: '610426', value: '永寿县', postcode: '713400' },
          { code: '610482', value: '彬州市', postcode: '713500' },
          { code: '610428', value: '长武县', postcode: '713600' },
          { code: '610429', value: '旬邑县', postcode: '711300' },
          { code: '610430', value: '淳化县', postcode: '711200' },
          { code: '610431', value: '武功县', postcode: '712200' },
          { code: '610481', value: '兴平市', postcode: '713100' }
        ]
      },
      {
        code: '610500',
        value: '渭南市',
        postcode: '714000',
        children: [
          { code: '610502', value: '临渭区', postcode: '714000' },
          { code: '610503', value: '华州区', postcode: '714100' },
          { code: '610522', value: '潼关县', postcode: '714300' },
          { code: '610523', value: '大荔县', postcode: '715100' },
          { code: '610524', value: '合阳县', postcode: '715300' },
          { code: '610525', value: '澄城县', postcode: '715200' },
          { code: '610526', value: '蒲城县', postcode: '715500' },
          { code: '610527', value: '白水县', postcode: '715600' },
          { code: '610528', value: '富平县', postcode: '711700' },
          { code: '610581', value: '韩城市', postcode: '715400' },
          { code: '610582', value: '华阴市', postcode: '714200' }
        ]
      },
      {
        code: '610600',
        value: '延安市',
        postcode: '716000',
        children: [
          { code: '610602', value: '宝塔区', postcode: '716000' },
          { code: '610603', value: '安塞区', postcode: '717400' },
          { code: '610621', value: '延长县', postcode: '717100' },
          { code: '610622', value: '延川县', postcode: '717200' },
          { code: '610625', value: '志丹县', postcode: '717500' },
          { code: '610626', value: '吴起县', postcode: '716000' },
          { code: '610627', value: '甘泉县', postcode: '716100' },
          { code: '610628', value: '富县', postcode: '727500' },
          { code: '610629', value: '洛川县', postcode: '727400' },
          { code: '610630', value: '宜川县', postcode: '716200' },
          { code: '610631', value: '黄龙县', postcode: '715700' },
          { code: '610632', value: '黄陵县', postcode: '727300' },
          { code: '610681', value: '子长市', postcode: '717300' }
        ]
      },
      {
        code: '610700',
        value: '汉中市',
        postcode: '723000',
        children: [
          { code: '610702', value: '汉台区', postcode: '723000' },
          { code: '610703', value: '南郑区', postcode: '723100' },
          { code: '610722', value: '城固县', postcode: '723200' },
          { code: '610723', value: '洋县', postcode: '723300' },
          { code: '610724', value: '西乡县', postcode: '723500' },
          { code: '610725', value: '勉县', postcode: '724200' },
          { code: '610726', value: '宁强县', postcode: '724400' },
          { code: '610727', value: '略阳县', postcode: '724300' },
          { code: '610728', value: '镇巴县', postcode: '723600' },
          { code: '610729', value: '留坝县', postcode: '724100' },
          { code: '610730', value: '佛坪县', postcode: '723400' }
        ]
      },
      {
        code: '610800',
        value: '榆林市',
        postcode: '719000',
        children: [
          { code: '610802', value: '榆阳区', postcode: '719000' },
          { code: '610803', value: '横山区', postcode: '719100' },
          { code: '610822', value: '府谷县', postcode: '719400' },
          { code: '610824', value: '靖边县', postcode: '718500' },
          { code: '610825', value: '定边县', postcode: '718600' },
          { code: '610826', value: '绥德县', postcode: '718000' },
          { code: '610827', value: '米脂县', postcode: '718100' },
          { code: '610828', value: '佳县', postcode: '719200' },
          { code: '610829', value: '吴堡县', postcode: '718200' },
          { code: '610830', value: '清涧县', postcode: '718300' },
          { code: '610831', value: '子洲县', postcode: '718400' },
          { code: '610881', value: '神木市', postcode: '719300' }
        ]
      },
      {
        code: '610900',
        value: '安康市',
        postcode: '725000',
        children: [
          { code: '610902', value: '汉滨区', postcode: '725000' },
          { code: '610921', value: '汉阴县', postcode: '725100' },
          { code: '610922', value: '石泉县', postcode: '725200' },
          { code: '610923', value: '宁陕县', postcode: '711600' },
          { code: '610924', value: '紫阳县', postcode: '725300' },
          { code: '610925', value: '岚皋县', postcode: '725400' },
          { code: '610926', value: '平利县', postcode: '725500' },
          { code: '610927', value: '镇坪县', postcode: '725600' },
          { code: '610928', value: '旬阳县', postcode: '725700' },
          { code: '610929', value: '白河县', postcode: '725800' }
        ]
      },
      {
        code: '611000',
        value: '商洛市',
        postcode: '726000',
        children: [
          { code: '611002', value: '商州区', postcode: '726000' },
          { code: '611021', value: '洛南县', postcode: '726100' },
          { code: '611022', value: '丹凤县', postcode: '726200' },
          { code: '611023', value: '商南县', postcode: '726300' },
          { code: '611024', value: '山阳县', postcode: '726400' },
          { code: '611025', value: '镇安县', postcode: '711500' },
          { code: '611026', value: '柞水县', postcode: '711400' }
        ]
      }
    ]
  },
  {
    code: '620000',
    value: '甘肃省',
    postcode: '0',
    children: [
      {
        code: '620100',
        value: '兰州市',
        postcode: '730000',
        children: [
          { code: '620102', value: '城关区', postcode: '730030' },
          { code: '620103', value: '七里河区', postcode: '730050' },
          { code: '620104', value: '西固区', postcode: '730060' },
          { code: '620105', value: '安宁区', postcode: '730070' },
          { code: '620111', value: '红古区', postcode: '730080' },
          { code: '620121', value: '永登县', postcode: '730300' },
          { code: '620122', value: '皋兰县', postcode: '730200' },
          { code: '620123', value: '榆中县', postcode: '730100' }
        ]
      },
      {
        code: '620200',
        value: '嘉峪关市',
        postcode: '735100',
        children: [
          { code: '620201', value: '雄关区', postcode: '735100' },
          { code: '620202', value: '镜铁区', postcode: '735100' },
          { code: '620203', value: '长城区', postcode: '735100' },
          { code: '620204', value: '新城镇', postcode: '735100' },
          { code: '620205', value: '峪泉镇', postcode: '735100' },
          { code: '620206', value: '文殊镇', postcode: '735100' }
        ]
      },
      {
        code: '620300',
        value: '金昌市',
        postcode: '737100',
        children: [
          { code: '620302', value: '金川区', postcode: '737103' },
          { code: '620321', value: '永昌县', postcode: '737200' }
        ]
      },
      {
        code: '620400',
        value: '白银市',
        postcode: '730900',
        children: [
          { code: '620402', value: '白银区', postcode: '730900' },
          { code: '620403', value: '平川区', postcode: '730913' },
          { code: '620421', value: '靖远县', postcode: '730600' },
          { code: '620422', value: '会宁县', postcode: '730700' },
          { code: '620423', value: '景泰县', postcode: '730400' }
        ]
      },
      {
        code: '620500',
        value: '天水市',
        postcode: '741000',
        children: [
          { code: '620502', value: '秦州区', postcode: '741000' },
          { code: '620503', value: '麦积区', postcode: '741020' },
          { code: '620521', value: '清水县', postcode: '741400' },
          { code: '620522', value: '秦安县', postcode: '741600' },
          { code: '620523', value: '甘谷县', postcode: '741200' },
          { code: '620524', value: '武山县', postcode: '741300' },
          { code: '620525', value: '张家川回族自治县', postcode: '741500' }
        ]
      },
      {
        code: '620600',
        value: '武威市',
        postcode: '733000',
        children: [
          { code: '620602', value: '凉州区', postcode: '733000' },
          { code: '620621', value: '民勤县', postcode: '733300' },
          { code: '620622', value: '古浪县', postcode: '733100' },
          { code: '620623', value: '天祝藏族自治县', postcode: '733200' }
        ]
      },
      {
        code: '620700',
        value: '张掖市',
        postcode: '734000',
        children: [
          { code: '620702', value: '甘州区', postcode: '734000' },
          { code: '620721', value: '肃南裕固族自治县', postcode: '734400' },
          { code: '620722', value: '民乐县', postcode: '734500' },
          { code: '620723', value: '临泽县', postcode: '734200' },
          { code: '620724', value: '高台县', postcode: '734300' },
          { code: '620725', value: '山丹县', postcode: '734100' }
        ]
      },
      {
        code: '620800',
        value: '平凉市',
        postcode: '744000',
        children: [
          { code: '620802', value: '崆峒区', postcode: '744000' },
          { code: '620821', value: '泾川县', postcode: '744300' },
          { code: '620822', value: '灵台县', postcode: '744400' },
          { code: '620823', value: '崇信县', postcode: '744200' },
          { code: '620825', value: '庄浪县', postcode: '744600' },
          { code: '620826', value: '静宁县', postcode: '743400' },
          { code: '620881', value: '华亭市', postcode: '744100' }
        ]
      },
      {
        code: '620900',
        value: '酒泉市',
        postcode: '735000',
        children: [
          { code: '620902', value: '肃州区', postcode: '735000' },
          { code: '620921', value: '金塔县', postcode: '735300' },
          { code: '620922', value: '瓜州县', postcode: '735000' },
          { code: '620923', value: '肃北蒙古族自治县', postcode: '736300' },
          { code: '620924', value: '阿克塞哈萨克族自治县', postcode: '736400' },
          { code: '620981', value: '玉门市', postcode: '735200' },
          { code: '620982', value: '敦煌市', postcode: '736200' }
        ]
      },
      {
        code: '621000',
        value: '庆阳市',
        postcode: '745000',
        children: [
          { code: '621002', value: '西峰区', postcode: '745000' },
          { code: '621021', value: '庆城县', postcode: '745100' },
          { code: '621022', value: '环县', postcode: '745700' },
          { code: '621023', value: '华池县', postcode: '745600' },
          { code: '621024', value: '合水县', postcode: '745400' },
          { code: '621025', value: '正宁县', postcode: '745300' },
          { code: '621026', value: '宁县', postcode: '745200' },
          { code: '621027', value: '镇原县', postcode: '744500' }
        ]
      },
      {
        code: '621100',
        value: '定西市',
        postcode: '743000',
        children: [
          { code: '621102', value: '安定区', postcode: '744300' },
          { code: '621121', value: '通渭县', postcode: '743300' },
          { code: '621122', value: '陇西县', postcode: '748100' },
          { code: '621123', value: '渭源县', postcode: '748200' },
          { code: '621124', value: '临洮县', postcode: '730500' },
          { code: '621125', value: '漳县', postcode: '748300' },
          { code: '621126', value: '岷县', postcode: '748400' }
        ]
      },
      {
        code: '621200',
        value: '陇南市',
        postcode: '742500',
        children: [
          { code: '621202', value: '武都区', postcode: '746000' },
          { code: '621221', value: '成县', postcode: '742500' },
          { code: '621222', value: '文县', postcode: '746400' },
          { code: '621223', value: '宕昌县', postcode: '748500' },
          { code: '621224', value: '康县', postcode: '746500' },
          { code: '621225', value: '西和县', postcode: '742100' },
          { code: '621226', value: '礼县', postcode: '742200' },
          { code: '621227', value: '徽县', postcode: '742300' },
          { code: '621228', value: '两当县', postcode: '742400' }
        ]
      },
      {
        code: '622900',
        value: '临夏回族自治州',
        postcode: '731100',
        children: [
          { code: '622901', value: '临夏市', postcode: '731100' },
          { code: '622921', value: '临夏县', postcode: '731800' },
          { code: '622922', value: '康乐县', postcode: '731500' },
          { code: '622923', value: '永靖县', postcode: '731600' },
          { code: '622924', value: '广河县', postcode: '731300' },
          { code: '622925', value: '和政县', postcode: '731200' },
          { code: '622926', value: '东乡族自治县', postcode: '731400' },
          { code: '622927', value: '积石山保安族东乡族撒拉族自治县', postcode: '731700' }
        ]
      },
      {
        code: '623000',
        value: '甘南藏族自治州',
        postcode: '747000',
        children: [
          { code: '623001', value: '合作市', postcode: '747000' },
          { code: '623021', value: '临潭县', postcode: '747500' },
          { code: '623022', value: '卓尼县', postcode: '747600' },
          { code: '623023', value: '舟曲县', postcode: '746300' },
          { code: '623024', value: '迭部县', postcode: '747400' },
          { code: '623025', value: '玛曲县', postcode: '747300' },
          { code: '623026', value: '碌曲县', postcode: '747200' },
          { code: '623027', value: '夏河县', postcode: '747100' }
        ]
      }
    ]
  },
  {
    code: '630000',
    value: '青海省',
    postcode: '0',
    children: [
      {
        code: '630100',
        value: '西宁市',
        postcode: '810000',
        children: [
          { code: '630102', value: '城东区', postcode: '810000' },
          { code: '630103', value: '城中区', postcode: '810000' },
          { code: '630104', value: '城西区', postcode: '810000' },
          { code: '630105', value: '城北区', postcode: '810000' },
          { code: '630106', value: '湟中区', postcode: '811600' },
          { code: '630121', value: '大通回族土族自治县', postcode: '810100' },
          { code: '630123', value: '湟源县', postcode: '812100' }
        ]
      },
      {
        code: '630200',
        value: '海东市',
        postcode: '810699',
        children: [
          { code: '630202', value: '乐都区', postcode: '810700' },
          { code: '630203', value: '平安区', postcode: '810699' },
          { code: '630222', value: '民和回族土族自治县', postcode: '810800' },
          { code: '630223', value: '互助土族自治县', postcode: '810500' },
          { code: '630224', value: '化隆回族自治县', postcode: '810900' },
          { code: '630225', value: '循化撒拉族自治县', postcode: '811100' }
        ]
      },
      {
        code: '632200',
        value: '海北藏族自治州',
        postcode: '812200',
        children: [
          { code: '632221', value: '门源回族自治县', postcode: '810300' },
          { code: '632222', value: '祁连县', postcode: '810400' },
          { code: '632223', value: '海晏县', postcode: '812200' },
          { code: '632224', value: '刚察县', postcode: '812300' }
        ]
      },
      {
        code: '632300',
        value: '黄南藏族自治州',
        postcode: '811300',
        children: [
          { code: '632321', value: '同仁县', postcode: '811300' },
          { code: '632322', value: '尖扎县', postcode: '811200' },
          { code: '632323', value: '泽库县', postcode: '811400' },
          { code: '632324', value: '河南蒙古族自治县', postcode: '811500' }
        ]
      },
      {
        code: '632500',
        value: '海南藏族自治州',
        postcode: '813000',
        children: [
          { code: '632521', value: '共和县', postcode: '813000' },
          { code: '632522', value: '同德县', postcode: '813200' },
          { code: '632523', value: '贵德县', postcode: '811700' },
          { code: '632524', value: '兴海县', postcode: '813300' },
          { code: '632525', value: '贵南县', postcode: '813100' }
        ]
      },
      {
        code: '632600',
        value: '果洛藏族自治州',
        postcode: '814000',
        children: [
          { code: '632621', value: '玛沁县', postcode: '814000' },
          { code: '632622', value: '班玛县', postcode: '814300' },
          { code: '632623', value: '甘德县', postcode: '814100' },
          { code: '632624', value: '达日县', postcode: '814200' },
          { code: '632625', value: '久治县', postcode: '624700' },
          { code: '632626', value: '玛多县', postcode: '813500' }
        ]
      },
      {
        code: '632700',
        value: '玉树藏族自治州',
        postcode: '815000',
        children: [
          { code: '632701', value: '玉树市', postcode: '815000' },
          { code: '632722', value: '杂多县', postcode: '815300' },
          { code: '632723', value: '称多县', postcode: '815100' },
          { code: '632724', value: '治多县', postcode: '815400' },
          { code: '632725', value: '囊谦县', postcode: '815200' },
          { code: '632726', value: '曲麻莱县', postcode: '815500' }
        ]
      },
      {
        code: '632800',
        value: '海西蒙古族藏族自治州',
        postcode: '817000',
        children: [
          { code: '632801', value: '格尔木市', postcode: '816000' },
          { code: '632802', value: '德令哈市', postcode: '817000' },
          { code: '632803', value: '茫崖市', postcode: '817000' },
          { code: '632821', value: '乌兰县', postcode: '817100' },
          { code: '632822', value: '都兰县', postcode: '816100' },
          { code: '632823', value: '天峻县', postcode: '817200' },
          { code: '632825', value: '大柴旦行政委员会', postcode: '817000' }
        ]
      }
    ]
  },
  {
    code: '640000',
    value: '宁夏回族自治区',
    postcode: '0',
    children: [
      {
        code: '640100',
        value: '银川市',
        postcode: '750000',
        children: [
          { code: '640104', value: '兴庆区', postcode: '750001' },
          { code: '640105', value: '西夏区', postcode: '750021' },
          { code: '640106', value: '金凤区', postcode: '750011' },
          { code: '640121', value: '永宁县', postcode: '750100' },
          { code: '640122', value: '贺兰县', postcode: '750200' },
          { code: '640181', value: '灵武市', postcode: '750004' }
        ]
      },
      {
        code: '640200',
        value: '石嘴山市',
        postcode: '753000',
        children: [
          { code: '640202', value: '大武口区', postcode: '753000' },
          { code: '640205', value: '惠农区', postcode: '753600' },
          { code: '640221', value: '平罗县', postcode: '753400' }
        ]
      },
      {
        code: '640300',
        value: '吴忠市',
        postcode: '751100',
        children: [
          { code: '640302', value: '利通区', postcode: '751100' },
          { code: '640303', value: '红寺堡区', postcode: '751100' },
          { code: '640323', value: '盐池县', postcode: '751500' },
          { code: '640324', value: '同心县', postcode: '751300' },
          { code: '640381', value: '青铜峡市', postcode: '751600' }
        ]
      },
      {
        code: '640400',
        value: '固原市',
        postcode: '756000',
        children: [
          { code: '640402', value: '原州区', postcode: '756000' },
          { code: '640422', value: '西吉县', postcode: '756200' },
          { code: '640423', value: '隆德县', postcode: '756300' },
          { code: '640424', value: '泾源县', postcode: '756400' },
          { code: '640425', value: '彭阳县', postcode: '756500' }
        ]
      },
      {
        code: '640500',
        value: '中卫市',
        postcode: '751700',
        children: [
          { code: '640502', value: '沙坡头区', postcode: '755000' },
          { code: '640521', value: '中宁县', postcode: '755000' },
          { code: '640522', value: '海原县', postcode: '755200' }
        ]
      }
    ]
  },
  {
    code: '650000',
    value: '新疆维吾尔自治区',
    postcode: '0',
    children: [
      {
        code: '650100',
        value: '乌鲁木齐市',
        postcode: '830000',
        children: [
          { code: '650102', value: '天山区', postcode: '830000' },
          { code: '650103', value: '沙依巴克区', postcode: '830002' },
          { code: '650104', value: '新市区', postcode: '830011' },
          { code: '650105', value: '水磨沟区', postcode: '830017' },
          { code: '650106', value: '头屯河区', postcode: '830022' },
          { code: '650107', value: '达坂城区', postcode: '830039' },
          { code: '650109', value: '米东区', postcode: '830019' },
          { code: '650121', value: '乌鲁木齐县', postcode: '830063' }
        ]
      },
      {
        code: '650200',
        value: '克拉玛依市',
        postcode: '834000',
        children: [
          { code: '650202', value: '独山子区', postcode: '834021' },
          { code: '650203', value: '克拉玛依区', postcode: '834000' },
          { code: '650204', value: '白碱滩区', postcode: '834008' },
          { code: '650205', value: '乌尔禾区', postcode: '834012' }
        ]
      },
      {
        code: '650400',
        value: '吐鲁番市',
        postcode: '838000',
        children: [
          { code: '650402', value: '高昌区', postcode: '838000' },
          { code: '650421', value: '鄯善县', postcode: '838200' },
          { code: '650422', value: '托克逊县', postcode: '838100' }
        ]
      },
      {
        code: '650500',
        value: '哈密市',
        postcode: '839000',
        children: [
          { code: '650502', value: '伊州区', postcode: '839000' },
          { code: '650521', value: '巴里坤哈萨克自治县', postcode: '839200' },
          { code: '650522', value: '伊吾县', postcode: '839300' }
        ]
      },
      {
        code: '652300',
        value: '昌吉回族自治州',
        postcode: '831100',
        children: [
          { code: '652301', value: '昌吉市', postcode: '831100' },
          { code: '652302', value: '阜康市', postcode: '831500' },
          { code: '652323', value: '呼图壁县', postcode: '831200' },
          { code: '652324', value: '玛纳斯县', postcode: '832200' },
          { code: '652325', value: '奇台县', postcode: '831800' },
          { code: '652327', value: '吉木萨尔县', postcode: '831700' },
          { code: '652328', value: '木垒哈萨克自治县', postcode: '831900' }
        ]
      },
      {
        code: '652700',
        value: '博尔塔拉蒙古自治州',
        postcode: '833400',
        children: [
          { code: '652701', value: '博乐市', postcode: '833400' },
          { code: '652702', value: '阿拉山口市', postcode: '833400' },
          { code: '652722', value: '精河县', postcode: '833300' },
          { code: '652723', value: '温泉县', postcode: '833500' }
        ]
      },
      {
        code: '652800',
        value: '巴音郭楞蒙古自治州',
        postcode: '841000',
        children: [
          { code: '652801', value: '库尔勒市', postcode: '841000' },
          { code: '652822', value: '轮台县', postcode: '841600' },
          { code: '652823', value: '尉犁县', postcode: '841500' },
          { code: '652824', value: '若羌县', postcode: '841800' },
          { code: '652825', value: '且末县', postcode: '841900' },
          { code: '652826', value: '焉耆回族自治县', postcode: '841100' },
          { code: '652827', value: '和静县', postcode: '841300' },
          { code: '652828', value: '和硕县', postcode: '841200' },
          { code: '652829', value: '博湖县', postcode: '841400' }
        ]
      },
      {
        code: '652900',
        value: '阿克苏地区',
        postcode: '843000',
        children: [
          { code: '652901', value: '阿克苏市', postcode: '843000' },
          { code: '652902', value: '库车市', postcode: '842000' },
          { code: '652922', value: '温宿县', postcode: '843100' },
          { code: '652924', value: '沙雅县', postcode: '842200' },
          { code: '652925', value: '新和县', postcode: '842100' },
          { code: '652926', value: '拜城县', postcode: '842300' },
          { code: '652927', value: '乌什县', postcode: '843400' },
          { code: '652928', value: '阿瓦提县', postcode: '843200' },
          { code: '652929', value: '柯坪县', postcode: '843600' }
        ]
      },
      {
        code: '653000',
        value: '克孜勒苏柯尔克孜自治州',
        postcode: '845350',
        children: [
          { code: '653001', value: '阿图什市', postcode: '845350' },
          { code: '653022', value: '阿克陶县', postcode: '845550' },
          { code: '653023', value: '阿合奇县', postcode: '843500' },
          { code: '653024', value: '乌恰县', postcode: '845450' }
        ]
      },
      {
        code: '653100',
        value: '喀什地区',
        postcode: '844000',
        children: [
          { code: '653101', value: '喀什市', postcode: '844000' },
          { code: '653121', value: '疏附县', postcode: '844100' },
          { code: '653122', value: '疏勒县', postcode: '844200' },
          { code: '653123', value: '英吉沙县', postcode: '844500' },
          { code: '653124', value: '泽普县', postcode: '844800' },
          { code: '653125', value: '莎车县', postcode: '844700' },
          { code: '653126', value: '叶城县', postcode: '844900' },
          { code: '653127', value: '麦盖提县', postcode: '844600' },
          { code: '653128', value: '岳普湖县', postcode: '844400' },
          { code: '653129', value: '伽师县', postcode: '844300' },
          { code: '653130', value: '巴楚县', postcode: '843800' },
          { code: '653131', value: '塔什库尔干塔吉克自治县', postcode: '845250' }
        ]
      },
      {
        code: '653200',
        value: '和田地区',
        postcode: '848000',
        children: [
          { code: '653201', value: '和田市', postcode: '848000' },
          { code: '653221', value: '和田县', postcode: '848000' },
          { code: '653222', value: '墨玉县', postcode: '848100' },
          { code: '653223', value: '皮山县', postcode: '845150' },
          { code: '653224', value: '洛浦县', postcode: '848200' },
          { code: '653225', value: '策勒县', postcode: '848300' },
          { code: '653226', value: '于田县', postcode: '848400' },
          { code: '653227', value: '民丰县', postcode: '848500' }
        ]
      },
      {
        code: '654000',
        value: '伊犁哈萨克自治州',
        postcode: '835000',
        children: [
          { code: '654002', value: '伊宁市', postcode: '835000' },
          { code: '654003', value: '奎屯市', postcode: '833200' },
          { code: '654004', value: '霍尔果斯市', postcode: '835100' },
          { code: '654021', value: '伊宁县', postcode: '835100' },
          { code: '654022', value: '察布查尔锡伯自治县', postcode: '835300' },
          { code: '654023', value: '霍城县', postcode: '835200' },
          { code: '654024', value: '巩留县', postcode: '835400' },
          { code: '654025', value: '新源县', postcode: '835800' },
          { code: '654026', value: '昭苏县', postcode: '835600' },
          { code: '654027', value: '特克斯县', postcode: '835500' },
          { code: '654028', value: '尼勒克县', postcode: '835700' }
        ]
      },
      {
        code: '654200',
        value: '塔城地区',
        postcode: '834700',
        children: [
          { code: '654201', value: '塔城市', postcode: '834700' },
          { code: '654202', value: '乌苏市', postcode: '833300' },
          { code: '654221', value: '额敏县', postcode: '834600' },
          { code: '654223', value: '沙湾县', postcode: '832100' },
          { code: '654224', value: '托里县', postcode: '834500' },
          { code: '654225', value: '裕民县', postcode: '834800' },
          { code: '654226', value: '和布克赛尔蒙古自治县', postcode: '834400' }
        ]
      },
      {
        code: '654300',
        value: '阿勒泰地区',
        postcode: '836500',
        children: [
          { code: '654301', value: '阿勒泰市', postcode: '836500' },
          { code: '654321', value: '布尔津县', postcode: '836600' },
          { code: '654322', value: '富蕴县', postcode: '836100' },
          { code: '654323', value: '福海县', postcode: '836400' },
          { code: '654324', value: '哈巴河县', postcode: '836700' },
          { code: '654325', value: '青河县', postcode: '836200' },
          { code: '654326', value: '吉木乃县', postcode: '836800' }
        ]
      },
      {
        code: '659000',
        value: '自治区直辖县级行政区划',
        postcode: '0',
        children: [
          { code: '659001', value: '石河子市', postcode: '832000' },
          { code: '659002', value: '阿拉尔市', postcode: '843300' },
          { code: '659003', value: '图木舒克市', postcode: '843806' },
          { code: '659004', value: '五家渠市', postcode: '831300' },
          { code: '659005', value: '北屯市', postcode: '836000' },
          { code: '659006', value: '铁门关市', postcode: '831300' },
          { code: '659007', value: '双河市', postcode: '833408' },
          { code: '659008', value: '可克达拉市', postcode: '835213' },
          { code: '659009', value: '昆玉市', postcode: '848116' },
          { code: '659010', value: '胡杨河市', postcode: '834034' }
        ]
      }
    ]
  },
  {
    code: '710000',
    value: '台湾省',
    postcode: '0',
    children: [
      {
        code: '710100',
        value: '台北市',
        postcode: '0',
        children: [
          { code: '710101', value: '中正区', postcode: '0' },
          { code: '710102', value: '大同区', postcode: '0' },
          { code: '710103', value: '中山区', postcode: '0' },
          { code: '710104', value: '松山区', postcode: '0' },
          { code: '710105', value: '大安区', postcode: '0' },
          { code: '710106', value: '万华区', postcode: '0' },
          { code: '710107', value: '信义区', postcode: '0' },
          { code: '710108', value: '士林区', postcode: '0' },
          { code: '710109', value: '北投区', postcode: '0' },
          { code: '710110', value: '内湖区', postcode: '0' },
          { code: '710111', value: '南港区', postcode: '0' },
          { code: '710112', value: '文山区', postcode: '0' }
        ]
      },
      {
        code: '710200',
        value: '高雄市',
        postcode: '0',
        children: [
          { code: '710201', value: '新兴区', postcode: '0' },
          { code: '710202', value: '前金区', postcode: '0' },
          { code: '710203', value: '苓雅区', postcode: '0' },
          { code: '710204', value: '盐埕区', postcode: '0' },
          { code: '710205', value: '鼓山区', postcode: '0' },
          { code: '710206', value: '旗津区', postcode: '0' },
          { code: '710207', value: '前镇区', postcode: '0' },
          { code: '710208', value: '三民区', postcode: '0' },
          { code: '710209', value: '左营区', postcode: '0' },
          { code: '710210', value: '楠梓区', postcode: '0' },
          { code: '710211', value: '小港区', postcode: '0' },
          { code: '710242', value: '仁武区', postcode: '0' },
          { code: '710243', value: '大社区', postcode: '0' },
          { code: '710244', value: '冈山区', postcode: '0' },
          { code: '710245', value: '路竹区', postcode: '0' },
          { code: '710246', value: '阿莲区', postcode: '0' },
          { code: '710247', value: '田寮区', postcode: '0' },
          { code: '710248', value: '燕巢区', postcode: '0' },
          { code: '710249', value: '桥头区', postcode: '0' },
          { code: '710250', value: '梓官区', postcode: '0' },
          { code: '710251', value: '弥陀区', postcode: '0' },
          { code: '710252', value: '永安区', postcode: '0' },
          { code: '710253', value: '湖内区', postcode: '0' },
          { code: '710254', value: '凤山区', postcode: '0' },
          { code: '710255', value: '大寮区', postcode: '0' },
          { code: '710256', value: '林园区', postcode: '0' },
          { code: '710257', value: '鸟松区', postcode: '0' },
          { code: '710258', value: '大树区', postcode: '0' },
          { code: '710259', value: '旗山区', postcode: '0' },
          { code: '710260', value: '美浓区', postcode: '0' },
          { code: '710261', value: '六龟区', postcode: '0' },
          { code: '710262', value: '内门区', postcode: '0' },
          { code: '710263', value: '杉林区', postcode: '0' },
          { code: '710264', value: '甲仙区', postcode: '0' },
          { code: '710265', value: '桃源区', postcode: '0' },
          { code: '710266', value: '那玛夏区', postcode: '0' },
          { code: '710267', value: '茂林区', postcode: '0' },
          { code: '710268', value: '茄萣区', postcode: '0' }
        ]
      },
      {
        code: '710300',
        value: '台南市',
        postcode: '0',
        children: [
          { code: '710301', value: '中西区', postcode: '0' },
          { code: '710302', value: '东区', postcode: '0' },
          { code: '710303', value: '南区', postcode: '0' },
          { code: '710304', value: '北区', postcode: '0' },
          { code: '710305', value: '安平区', postcode: '0' },
          { code: '710306', value: '安南区', postcode: '0' },
          { code: '710339', value: '永康区', postcode: '0' },
          { code: '710340', value: '归仁区', postcode: '0' },
          { code: '710341', value: '新化区', postcode: '0' },
          { code: '710342', value: '左镇区', postcode: '0' },
          { code: '710343', value: '玉井区', postcode: '0' },
          { code: '710344', value: '楠西区', postcode: '0' },
          { code: '710345', value: '南化区', postcode: '0' },
          { code: '710346', value: '仁德区', postcode: '0' },
          { code: '710347', value: '关庙区', postcode: '0' },
          { code: '710348', value: '龙崎区', postcode: '0' },
          { code: '710349', value: '官田区', postcode: '0' },
          { code: '710350', value: '麻豆区', postcode: '0' },
          { code: '710351', value: '佳里区', postcode: '0' },
          { code: '710352', value: '西港区', postcode: '0' },
          { code: '710353', value: '七股区', postcode: '0' },
          { code: '710354', value: '将军区', postcode: '0' },
          { code: '710355', value: '学甲区', postcode: '0' },
          { code: '710356', value: '北门区', postcode: '0' },
          { code: '710357', value: '新营区', postcode: '0' },
          { code: '710358', value: '后壁区', postcode: '0' },
          { code: '710359', value: '白河区', postcode: '0' },
          { code: '710360', value: '东山区', postcode: '0' },
          { code: '710361', value: '六甲区', postcode: '0' },
          { code: '710362', value: '下营区', postcode: '0' },
          { code: '710363', value: '柳营区', postcode: '0' },
          { code: '710364', value: '盐水区', postcode: '0' },
          { code: '710365', value: '善化区', postcode: '0' },
          { code: '710366', value: '大内区', postcode: '0' },
          { code: '710367', value: '山上区', postcode: '0' },
          { code: '710368', value: '新市区', postcode: '0' },
          { code: '710369', value: '安定区', postcode: '0' }
        ]
      },
      {
        code: '710400',
        value: '台中市',
        postcode: '0',
        children: [
          { code: '710401', value: '中区', postcode: '0' },
          { code: '710402', value: '东区', postcode: '0' },
          { code: '710403', value: '南区', postcode: '0' },
          { code: '710404', value: '西区', postcode: '0' },
          { code: '710405', value: '北区', postcode: '0' },
          { code: '710406', value: '北屯区', postcode: '0' },
          { code: '710407', value: '西屯区', postcode: '0' },
          { code: '710408', value: '南屯区', postcode: '0' },
          { code: '710431', value: '太平区', postcode: '0' },
          { code: '710432', value: '大里区', postcode: '0' },
          { code: '710433', value: '雾峰区', postcode: '0' },
          { code: '710434', value: '乌日区', postcode: '0' },
          { code: '710435', value: '丰原区', postcode: '0' },
          { code: '710436', value: '后里区', postcode: '0' },
          { code: '710437', value: '石冈区', postcode: '0' },
          { code: '710438', value: '东势区', postcode: '0' },
          { code: '710439', value: '和平区', postcode: '0' },
          { code: '710440', value: '新社区', postcode: '0' },
          { code: '710441', value: '潭子区', postcode: '0' },
          { code: '710442', value: '大雅区', postcode: '0' },
          { code: '710443', value: '神冈区', postcode: '0' },
          { code: '710444', value: '大肚区', postcode: '0' },
          { code: '710445', value: '沙鹿区', postcode: '0' },
          { code: '710446', value: '龙井区', postcode: '0' },
          { code: '710447', value: '梧栖区', postcode: '0' },
          { code: '710448', value: '清水区', postcode: '0' },
          { code: '710449', value: '大甲区', postcode: '0' },
          { code: '710450', value: '外埔区', postcode: '0' },
          { code: '710451', value: '大安区', postcode: '0' }
        ]
      },
      {
        code: '710600',
        value: '南投县',
        postcode: '0',
        children: [
          { code: '710614', value: '南投市', postcode: '0' },
          { code: '710615', value: '中寮乡', postcode: '0' },
          { code: '710616', value: '草屯镇', postcode: '0' },
          { code: '710617', value: '国姓乡', postcode: '0' },
          { code: '710618', value: '埔里镇', postcode: '0' },
          { code: '710619', value: '仁爱乡', postcode: '0' },
          { code: '710620', value: '名间乡', postcode: '0' },
          { code: '710621', value: '集集镇', postcode: '0' },
          { code: '710622', value: '水里乡', postcode: '0' },
          { code: '710623', value: '鱼池乡', postcode: '0' },
          { code: '710624', value: '信义乡', postcode: '0' },
          { code: '710625', value: '竹山镇', postcode: '0' },
          { code: '710626', value: '鹿谷乡', postcode: '0' }
        ]
      },
      {
        code: '710700',
        value: '基隆市',
        postcode: '0',
        children: [
          { code: '710701', value: '仁爱区', postcode: '0' },
          { code: '710702', value: '信义区', postcode: '0' },
          { code: '710703', value: '中正区', postcode: '0' },
          { code: '710704', value: '中山区', postcode: '0' },
          { code: '710705', value: '安乐区', postcode: '0' },
          { code: '710706', value: '暖暖区', postcode: '0' },
          { code: '710707', value: '七堵区', postcode: '0' }
        ]
      },
      {
        code: '710800',
        value: '新竹市',
        postcode: '0',
        children: [
          { code: '710801', value: '东区', postcode: '0' },
          { code: '710802', value: '北区', postcode: '0' },
          { code: '710803', value: '香山区', postcode: '0' }
        ]
      },
      {
        code: '710900',
        value: '嘉义市',
        postcode: '0',
        children: [
          { code: '710901', value: '东区', postcode: '0' },
          { code: '710902', value: '西区', postcode: '0' }
        ]
      },
      {
        code: '711100',
        value: '新北市',
        postcode: '0',
        children: [
          { code: '711130', value: '万里区', postcode: '0' },
          { code: '711131', value: '金山区', postcode: '0' },
          { code: '711132', value: '板桥区', postcode: '0' },
          { code: '711133', value: '汐止区', postcode: '0' },
          { code: '711134', value: '深坑区', postcode: '0' },
          { code: '711135', value: '石碇区', postcode: '0' },
          { code: '711136', value: '瑞芳区', postcode: '0' },
          { code: '711137', value: '平溪区', postcode: '0' },
          { code: '711138', value: '双溪区', postcode: '0' },
          { code: '711139', value: '贡寮区', postcode: '0' },
          { code: '711140', value: '新店区', postcode: '0' },
          { code: '711141', value: '坪林区', postcode: '0' },
          { code: '711142', value: '乌来区', postcode: '0' },
          { code: '711143', value: '永和区', postcode: '0' },
          { code: '711144', value: '中和区', postcode: '0' },
          { code: '711145', value: '土城区', postcode: '0' },
          { code: '711146', value: '三峡区', postcode: '0' },
          { code: '711147', value: '树林区', postcode: '0' },
          { code: '711148', value: '莺歌区', postcode: '0' },
          { code: '711149', value: '三重区', postcode: '0' },
          { code: '711150', value: '新庄区', postcode: '0' },
          { code: '711151', value: '泰山区', postcode: '0' },
          { code: '711152', value: '林口区', postcode: '0' },
          { code: '711153', value: '芦洲区', postcode: '0' },
          { code: '711154', value: '五股区', postcode: '0' },
          { code: '711155', value: '八里区', postcode: '0' },
          { code: '711156', value: '淡水区', postcode: '0' },
          { code: '711157', value: '三芝区', postcode: '0' },
          { code: '711158', value: '石门区', postcode: '0' }
        ]
      },
      {
        code: '711200',
        value: '宜兰县',
        postcode: '0',
        children: [
          { code: '711214', value: '宜兰市', postcode: '0' },
          { code: '711215', value: '头城镇', postcode: '0' },
          { code: '711216', value: '礁溪乡', postcode: '0' },
          { code: '711217', value: '壮围乡', postcode: '0' },
          { code: '711218', value: '员山乡', postcode: '0' },
          { code: '711219', value: '罗东镇', postcode: '0' },
          { code: '711220', value: '三星乡', postcode: '0' },
          { code: '711221', value: '大同乡', postcode: '0' },
          { code: '711222', value: '五结乡', postcode: '0' },
          { code: '711223', value: '冬山乡', postcode: '0' },
          { code: '711224', value: '苏澳镇', postcode: '0' },
          { code: '711225', value: '南澳乡', postcode: '0' }
        ]
      },
      {
        code: '711300',
        value: '新竹县',
        postcode: '0',
        children: [
          { code: '711314', value: '竹北市', postcode: '0' },
          { code: '711315', value: '湖口乡', postcode: '0' },
          { code: '711316', value: '新丰乡', postcode: '0' },
          { code: '711317', value: '新埔镇', postcode: '0' },
          { code: '711318', value: '关西镇', postcode: '0' },
          { code: '711319', value: '芎林乡', postcode: '0' },
          { code: '711320', value: '宝山乡', postcode: '0' },
          { code: '711321', value: '竹东镇', postcode: '0' },
          { code: '711322', value: '五峰乡', postcode: '0' },
          { code: '711323', value: '横山乡', postcode: '0' },
          { code: '711324', value: '尖石乡', postcode: '0' },
          { code: '711325', value: '北埔乡', postcode: '0' },
          { code: '711326', value: '峨眉乡', postcode: '0' }
        ]
      },
      {
        code: '711400',
        value: '桃园市',
        postcode: '0',
        children: [
          { code: '711414', value: '中坜区', postcode: '0' },
          { code: '711415', value: '平镇区', postcode: '0' },
          { code: '711416', value: '龙潭区', postcode: '0' },
          { code: '711417', value: '杨梅区', postcode: '0' },
          { code: '711418', value: '新屋区', postcode: '0' },
          { code: '711419', value: '观音区', postcode: '0' },
          { code: '711420', value: '桃园区', postcode: '0' },
          { code: '711421', value: '龟山区', postcode: '0' },
          { code: '711422', value: '八德区', postcode: '0' },
          { code: '711423', value: '大溪区', postcode: '0' },
          { code: '711424', value: '复兴区', postcode: '0' },
          { code: '711425', value: '大园区', postcode: '0' },
          { code: '711426', value: '芦竹区', postcode: '0' }
        ]
      },
      {
        code: '711500',
        value: '苗栗县',
        postcode: '0',
        children: [
          { code: '711519', value: '竹南镇', postcode: '0' },
          { code: '711520', value: '头份市', postcode: '0' },
          { code: '711521', value: '三湾乡', postcode: '0' },
          { code: '711522', value: '南庄乡', postcode: '0' },
          { code: '711523', value: '狮潭乡', postcode: '0' },
          { code: '711524', value: '后龙镇', postcode: '0' },
          { code: '711525', value: '通霄镇', postcode: '0' },
          { code: '711526', value: '苑里镇', postcode: '0' },
          { code: '711527', value: '苗栗市', postcode: '0' },
          { code: '711528', value: '造桥乡', postcode: '0' },
          { code: '711529', value: '头屋乡', postcode: '0' },
          { code: '711530', value: '公馆乡', postcode: '0' },
          { code: '711531', value: '大湖乡', postcode: '0' },
          { code: '711532', value: '泰安乡', postcode: '0' },
          { code: '711533', value: '铜锣乡', postcode: '0' },
          { code: '711534', value: '三义乡', postcode: '0' },
          { code: '711535', value: '西湖乡', postcode: '0' },
          { code: '711536', value: '卓兰镇', postcode: '0' }
        ]
      },
      {
        code: '711700',
        value: '彰化县',
        postcode: '0',
        children: [
          { code: '711727', value: '彰化市', postcode: '0' },
          { code: '711728', value: '芬园乡', postcode: '0' },
          { code: '711729', value: '花坛乡', postcode: '0' },
          { code: '711730', value: '秀水乡', postcode: '0' },
          { code: '711731', value: '鹿港镇', postcode: '0' },
          { code: '711732', value: '福兴乡', postcode: '0' },
          { code: '711733', value: '线西乡', postcode: '0' },
          { code: '711734', value: '和美镇', postcode: '0' },
          { code: '711735', value: '伸港乡', postcode: '0' },
          { code: '711736', value: '员林市', postcode: '0' },
          { code: '711737', value: '社头乡', postcode: '0' },
          { code: '711738', value: '永靖乡', postcode: '0' },
          { code: '711739', value: '埔心乡', postcode: '0' },
          { code: '711740', value: '溪湖镇', postcode: '0' },
          { code: '711741', value: '大村乡', postcode: '0' },
          { code: '711742', value: '埔盐乡', postcode: '0' },
          { code: '711743', value: '田中镇', postcode: '0' },
          { code: '711744', value: '北斗镇', postcode: '0' },
          { code: '711745', value: '田尾乡', postcode: '0' },
          { code: '711746', value: '埤头乡', postcode: '0' },
          { code: '711747', value: '溪州乡', postcode: '0' },
          { code: '711748', value: '竹塘乡', postcode: '0' },
          { code: '711749', value: '二林镇', postcode: '0' },
          { code: '711750', value: '大城乡', postcode: '0' },
          { code: '711751', value: '芳苑乡', postcode: '0' },
          { code: '711752', value: '二水乡', postcode: '0' }
        ]
      },
      {
        code: '711900',
        value: '嘉义县',
        postcode: '0',
        children: [
          { code: '711919', value: '番路乡', postcode: '0' },
          { code: '711920', value: '梅山乡', postcode: '0' },
          { code: '711921', value: '竹崎乡', postcode: '0' },
          { code: '711922', value: '阿里山乡', postcode: '0' },
          { code: '711923', value: '中埔乡', postcode: '0' },
          { code: '711924', value: '大埔乡', postcode: '0' },
          { code: '711925', value: '水上乡', postcode: '0' },
          { code: '711926', value: '鹿草乡', postcode: '0' },
          { code: '711927', value: '太保市', postcode: '0' },
          { code: '711928', value: '朴子市', postcode: '0' },
          { code: '711929', value: '东石乡', postcode: '0' },
          { code: '711930', value: '六脚乡', postcode: '0' },
          { code: '711931', value: '新港乡', postcode: '0' },
          { code: '711932', value: '民雄乡', postcode: '0' },
          { code: '711933', value: '大林镇', postcode: '0' },
          { code: '711934', value: '溪口乡', postcode: '0' },
          { code: '711935', value: '义竹乡', postcode: '0' },
          { code: '711936', value: '布袋镇', postcode: '0' }
        ]
      },
      {
        code: '712100',
        value: '云林县',
        postcode: '0',
        children: [
          { code: '712121', value: '斗南镇', postcode: '0' },
          { code: '712122', value: '大埤乡', postcode: '0' },
          { code: '712123', value: '虎尾镇', postcode: '0' },
          { code: '712124', value: '土库镇', postcode: '0' },
          { code: '712125', value: '褒忠乡', postcode: '0' },
          { code: '712126', value: '东势乡', postcode: '0' },
          { code: '712127', value: '台西乡', postcode: '0' },
          { code: '712128', value: '仑背乡', postcode: '0' },
          { code: '712129', value: '麦寮乡', postcode: '0' },
          { code: '712130', value: '斗六市', postcode: '0' },
          { code: '712131', value: '林内乡', postcode: '0' },
          { code: '712132', value: '古坑乡', postcode: '0' },
          { code: '712133', value: '莿桐乡', postcode: '0' },
          { code: '712134', value: '西螺镇', postcode: '0' },
          { code: '712135', value: '二仑乡', postcode: '0' },
          { code: '712136', value: '北港镇', postcode: '0' },
          { code: '712137', value: '水林乡', postcode: '0' },
          { code: '712138', value: '口湖乡', postcode: '0' },
          { code: '712139', value: '四湖乡', postcode: '0' },
          { code: '712140', value: '元长乡', postcode: '0' }
        ]
      },
      {
        code: '712400',
        value: '屏东县',
        postcode: '0',
        children: [
          { code: '712434', value: '屏东市', postcode: '0' },
          { code: '712435', value: '三地门乡', postcode: '0' },
          { code: '712436', value: '雾台乡', postcode: '0' },
          { code: '712437', value: '玛家乡', postcode: '0' },
          { code: '712438', value: '九如乡', postcode: '0' },
          { code: '712439', value: '里港乡', postcode: '0' },
          { code: '712440', value: '高树乡', postcode: '0' },
          { code: '712441', value: '盐埔乡', postcode: '0' },
          { code: '712442', value: '长治乡', postcode: '0' },
          { code: '712443', value: '麟洛乡', postcode: '0' },
          { code: '712444', value: '竹田乡', postcode: '0' },
          { code: '712445', value: '内埔乡', postcode: '0' },
          { code: '712446', value: '万丹乡', postcode: '0' },
          { code: '712447', value: '潮州镇', postcode: '0' },
          { code: '712448', value: '泰武乡', postcode: '0' },
          { code: '712449', value: '来义乡', postcode: '0' },
          { code: '712450', value: '万峦乡', postcode: '0' },
          { code: '712451', value: '崁顶乡', postcode: '0' },
          { code: '712452', value: '新埤乡', postcode: '0' },
          { code: '712453', value: '南州乡', postcode: '0' },
          { code: '712454', value: '林边乡', postcode: '0' },
          { code: '712455', value: '东港镇', postcode: '0' },
          { code: '712456', value: '琉球乡', postcode: '0' },
          { code: '712457', value: '佳冬乡', postcode: '0' },
          { code: '712458', value: '新园乡', postcode: '0' },
          { code: '712459', value: '枋寮乡', postcode: '0' },
          { code: '712460', value: '枋山乡', postcode: '0' },
          { code: '712461', value: '春日乡', postcode: '0' },
          { code: '712462', value: '狮子乡', postcode: '0' },
          { code: '712463', value: '车城乡', postcode: '0' },
          { code: '712464', value: '牡丹乡', postcode: '0' },
          { code: '712465', value: '恒春镇', postcode: '0' },
          { code: '712466', value: '满州乡', postcode: '0' }
        ]
      },
      {
        code: '712500',
        value: '台东县',
        postcode: '0',
        children: [
          { code: '712517', value: '台东市', postcode: '0' },
          { code: '712518', value: '绿岛乡', postcode: '0' },
          { code: '712519', value: '兰屿乡', postcode: '0' },
          { code: '712520', value: '延平乡', postcode: '0' },
          { code: '712521', value: '卑南乡', postcode: '0' },
          { code: '712522', value: '鹿野乡', postcode: '0' },
          { code: '712523', value: '关山镇', postcode: '0' },
          { code: '712524', value: '海端乡', postcode: '0' },
          { code: '712525', value: '池上乡', postcode: '0' },
          { code: '712526', value: '东河乡', postcode: '0' },
          { code: '712527', value: '成功镇', postcode: '0' },
          { code: '712528', value: '长滨乡', postcode: '0' },
          { code: '712529', value: '金峰乡', postcode: '0' },
          { code: '712530', value: '大武乡', postcode: '0' },
          { code: '712531', value: '达仁乡', postcode: '0' },
          { code: '712532', value: '太麻里乡', postcode: '0' }
        ]
      },
      {
        code: '712600',
        value: '花莲县',
        postcode: '0',
        children: [
          { code: '712615', value: '花莲市', postcode: '0' },
          { code: '712616', value: '新城乡', postcode: '0' },
          { code: '712618', value: '秀林乡', postcode: '0' },
          { code: '712619', value: '吉安乡', postcode: '0' },
          { code: '712620', value: '寿丰乡', postcode: '0' },
          { code: '712621', value: '凤林镇', postcode: '0' },
          { code: '712622', value: '光复乡', postcode: '0' },
          { code: '712623', value: '丰滨乡', postcode: '0' },
          { code: '712624', value: '瑞穗乡', postcode: '0' },
          { code: '712625', value: '万荣乡', postcode: '0' },
          { code: '712626', value: '玉里镇', postcode: '0' },
          { code: '712627', value: '卓溪乡', postcode: '0' },
          { code: '712628', value: '富里乡', postcode: '0' }
        ]
      },
      {
        code: '712700',
        value: '澎湖县',
        postcode: '0',
        children: [
          { code: '712707', value: '马公市', postcode: '0' },
          { code: '712708', value: '西屿乡', postcode: '0' },
          { code: '712709', value: '望安乡', postcode: '0' },
          { code: '712710', value: '七美乡', postcode: '0' },
          { code: '712711', value: '白沙乡', postcode: '0' },
          { code: '712712', value: '湖西乡', postcode: '0' }
        ]
      }
    ]
  },
  {
    code: '810000',
    value: '香港特别行政区',
    postcode: '0',
    children: [
      {
        code: '810100',
        value: '香港特别行政区',
        postcode: '0',
        children: [
          { code: '810101', value: '中西区', postcode: '0' },
          { code: '810102', value: '东区', postcode: '0' },
          { code: '810103', value: '九龙城区', postcode: '0' },
          { code: '810104', value: '观塘区', postcode: '0' },
          { code: '810105', value: '南区', postcode: '0' },
          { code: '810106', value: '深水埗区', postcode: '0' },
          { code: '810107', value: '湾仔区', postcode: '0' },
          { code: '810108', value: '黄大仙区', postcode: '0' },
          { code: '810109', value: '油尖旺区', postcode: '0' },
          { code: '810110', value: '离岛区', postcode: '0' },
          { code: '810111', value: '葵青区', postcode: '0' },
          { code: '810112', value: '北区', postcode: '0' },
          { code: '810113', value: '西贡区', postcode: '0' },
          { code: '810114', value: '沙田区', postcode: '0' },
          { code: '810115', value: '屯门区', postcode: '0' },
          { code: '810116', value: '大埔区', postcode: '0' },
          { code: '810117', value: '荃湾区', postcode: '0' },
          { code: '810118', value: '元朗区', postcode: '0' }
        ]
      }
    ]
  },
  {
    code: '820000',
    value: '澳门特别行政区',
    postcode: '0',
    children: [
      {
        code: '820100',
        value: '澳门特别行政区',
        postcode: '0',
        children: [
          { code: '820101', value: '澳门半岛', postcode: '0' },
          { code: '820102', value: '凼仔', postcode: '0' },
          { code: '820103', value: '路凼城', postcode: '0' },
          { code: '820104', value: '路环', postcode: '0' }
        ]
      }
    ]
  }
]
