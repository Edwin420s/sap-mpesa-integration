export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

export const validatePhone = (phone) => {
  const re = /^(\+?254|0)[7]\d{8}$/;
  return re.test(phone);
};

export const validateAmount = (amount) => {
  return !isNaN(amount) && amount > 0;
};