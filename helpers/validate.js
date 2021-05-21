export const validateEmail = (email) => {
  const regexEmail = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
  return regexEmail.test(String(email).toLowerCase());
};
