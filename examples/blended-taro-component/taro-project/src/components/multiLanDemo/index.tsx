import React from 'react';
import { View, Text, Button } from '@tarojs/components'
import { FormattedMessage, useIntl, getLocale, setLocale } from '@tarojs/plugin-intl/dist/api.h5'
import Title from './../Title'
import styles from './index.scss'


interface Props {
  env: {   
    theme: string;   //主题
    lang: string;    //语言
  }; // 必选项，其他组件自己的props,往后添加即可
  info: {
    name: string;
    hobby: string;
  }
}

export default function Index(props: Props) {
  const {env, info} = props;
  console.log("props:", props);

  const intl = useIntl();
  const title = intl.formatMessage({ id: 'title' });
  const {theme, lang} = env;

  // const locale = getLocale();
  // const switchLang = () => {
  //   setLocale(locale === 'en' ? 'zh' : 'en');
  // }

  return (
    <View className={styles.root}>
      {/* <Button onClick={switchLang}>
        { getLocale() === 'en' ? 'Switch to Chinese' : '切换到英文'}
      </Button> */}
      <Text className={`${styles.title} ${styles[`title-${theme}`]}`}>
        <FormattedMessage id='welcome' />
      </Text>
      <Text>
        <FormattedMessage id='description' />
      </Text>
      <Text>
        <FormattedMessage id='fjdaskfdjs' defaultMessage='默认值' />
      </Text>
      <Title title={title} />
      <View className={styles.info}>
        <Text>
          <FormattedMessage id='name' />:{info?.name || ''}
        </Text>
        <Text>
          <FormattedMessage id='hobby' />:{info?.hobby || ''}
        </Text>
      </View>
    </View>
  );
};
