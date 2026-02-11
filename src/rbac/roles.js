export const ROLES = Object.freeze({
  USER: "user",
  MODERATOR: "moderator",
  ADMIN: "admin",
});

export const ROLE_VALUES = Object.freeze(Object.values(ROLES));

export function isRole(value) {
  return ROLE_VALUES.includes(value);
}
