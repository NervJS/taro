import { StyleSheet } from 'react-native';

const textStyle = {
  color: '#0ae',
  fontSize: 18,
  textAlign: 'center',
};

const styles = StyleSheet.create<any>({
  modal: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
  },
  header: {
    // flex:1, 0.39.0 needs to remove
    height: 44,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e7e7e7',
  },
  headerItem: {
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  actionText: textStyle,
  okText: {},
  dismissText: {},
  title: {
    ...textStyle,
    color: '#666',
  },
});

export default styles;
