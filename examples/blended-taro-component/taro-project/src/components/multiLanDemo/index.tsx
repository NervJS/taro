import { View, Text, Button } from '@tarojs/components'
import Title from './../Title'
import { FormattedMessage, IntlProvider, useIntl, getLocale, setLocale } from '@tarojs/plugin-intl/dist/api.h5'
import React from 'react';
import './index.scss'


export default function Content(){
  // const intl = useIntl();
  // const title = intl.formatMessage({ id: 'title' });


  const locale = getLocale();

  return (
    <View className='root'>
      <Button >
        { getLocale() === 'en' ? 'Switch to Chinese' : '切换到英文'}
      </Button>
      <Text>
        <FormattedMessage id="welcome" />
      </Text>
      <Text>
        <FormattedMessage id="description" />
      </Text>
      <Text>
        <FormattedMessage id='fjdaskfdjs' defaultMessage={'默认值'} />
      </Text>
      <Title title='title' />
    </View>
  );
};
