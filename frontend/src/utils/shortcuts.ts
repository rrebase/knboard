const getMetaKey = () =>
  navigator.platform.indexOf("Mac") > -1 ? "⌘" : "ctrl";

export default getMetaKey;
