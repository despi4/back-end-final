import { can } from "../rbac/permissions.js";
import { isRole } from "../rbac/roles.js";

function ensureUser(req, res) {
  if (!req.user) {
    res.status(401).json({ message: "Unauthorized" });
    return false;
  }

  return true;
}

export function requireRole(...roles) {
  const allowedRoles = roles.filter((role) => isRole(role));

  return (req, res, next) => {
    if (!ensureUser(req, res)) {
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!ensureUser(req, res)) {
      return;
    }

    if (!can(req.user.role, permission)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}

export function requireAnyPermission(...permissions) {
  return (req, res, next) => {
    if (!ensureUser(req, res)) {
      return;
    }

    const permitted = permissions.some((permission) => can(req.user.role, permission));
    if (!permitted) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };
}
