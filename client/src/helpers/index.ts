export const validateEmail = (email: string) => {
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  return emailRegex.test(email);
};

export const validateWebsite = (website: string) => {
  const websiteRegex = /^(http|https):\/\/[^ "]+$/;
  return websiteRegex.test(website);
};

export const phoneMask = (value: string) => {
  value = value?.replace(/\D+/g, "");
  if (value?.length === 0 || value === "") return "";
  else if (value?.length <= 3) return `${value?.slice(0, 3)}`;
  else if (value?.length > 3 && value?.length <= 6)
    return `${value?.slice(0, 3)}-${value?.slice(3, 6)}`;
  else
    return `${value?.slice(0, 3)}-${value?.slice(3, 6)}-${value?.slice(6, 10)}`;
};
