const valueOrEmptyString = (
  (value: null | string | undefined) => value || ''
);
export default valueOrEmptyString;
