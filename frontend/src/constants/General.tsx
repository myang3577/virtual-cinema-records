export enum PageType {
  HOME = "HOME",
  RECOMMENDATIONS = "RECOMMENDATIONS",
  MY_MOVIES = "MY_MOVIES",
  BLACKLIST = "BLACKLIST",
}

// Email regex used to determine if the entered email address is valid
//eslint-disable-next-line
const EMAIL_FORMAT = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

export const validEmail = (email: string) =>
  EMAIL_FORMAT.test(email.toLowerCase());
