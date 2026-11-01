export const imgUrl = (src) => {
  if (!src) return null;
  if (src.startsWith('http')) return src;
  return `http://localhost:5000${src}`;
};
