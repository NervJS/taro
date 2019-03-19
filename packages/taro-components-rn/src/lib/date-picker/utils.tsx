function formatIt(date: Date, form: string) {
  const pad = (n: number) => (n < 10 ? `0${n}` : n);
  const dateStr = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate(),
  )}`;
  const timeStr = `${pad(date.getHours())}:${pad(date.getMinutes())}`;
  if (form === 'YYYY-MM-DD') {
    return dateStr;
  }
  if (form === 'HH:mm') {
    return timeStr;
  }
  return `${dateStr} ${timeStr}`;
}

export function formatFn(instance: any, value: Date) {
  const formatsEnum = {
    date: 'YYYY-MM-DD',
    time: 'HH:mm',
    datetime: 'YYYY-MM-DD HH:mm',
  };
  const { format } = instance.props;
  const type = typeof format;
  if (type === 'string') {
    return formatIt(value, format);
  }
  if (type === 'function') {
    return format(value);
  }
  return formatIt(value, (formatsEnum as any)[instance.props.mode]);
}

export function formatProps(props: any, value: Date) {
  const formatsEnum = {
    date: 'YYYY-MM-DD',
    time: 'HH:mm',
    datetime: 'YYYY-MM-DD HH:mm',
  };
  const { format } = props;
  const type = typeof format;
  if (type === 'string') {
    return formatIt(value, format);
  }
  if (type === 'function') {
    return format(value);
  }
  return formatIt(value, (formatsEnum as any)[props.mode]);
}
