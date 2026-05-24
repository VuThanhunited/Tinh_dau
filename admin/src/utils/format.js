// Currency formatting helper (e.g. 220000 -> "220.000đ")
export const formatVND = (number) => {
  if (number === undefined || number === null) return '0 đ';
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number).replace('₫', 'đ');
};
