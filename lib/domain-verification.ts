export const generateVerificationCode = () =>
  `apex-verify=${crypto.randomUUID()}`;

export const getDomain = (url: string) => new URL(url).hostname;
