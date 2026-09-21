import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import { AppError } from "./error-handler";

const enc = new TextEncoder();

const accessSecret = () =>
  enc.encode(
    process.env.JWT_ACCESS_SECRET || "dev-access-secret"
  );

const refreshSecret = () =>
  enc.encode(
    process.env.JWT_REFRESH_SECRET || "dev-refresh-secret"
  );

function expiry(
  value: string | undefined,
  fallback: number
) {
  if (!value)
    return `${fallback}s`;

  return value;
}

export async function issueTokens(adminId: string) {
  const access = await new SignJWT({
    sub: adminId,
    type: "access",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(
      expiry(
        process.env.JWT_ACCESS_EXPIRES_IN,
        900
      )
    )
    .sign(accessSecret());

  const refresh = await new SignJWT({
    sub: adminId,
    type: "refresh",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(
      expiry(
        process.env.JWT_REFRESH_EXPIRES_IN,
        604800
      )
    )
    .sign(refreshSecret());

  return { access, refresh };
}

export async function verifyAccess(token: string) {
  const result = await jwtVerify(
    token,
    accessSecret()
  );

  if (
    result.payload.type !== "access" ||
    !result.payload.sub
  ) {
    throw new AppError(
      "Invalid access token",
      401,
      "general"
    );
  }

  return result.payload.sub;
}

export async function verifyRefresh(token: string) {
  const result = await jwtVerify(
    token,
    refreshSecret()
  );

  if (
    result.payload.type !== "refresh" ||
    !result.payload.sub
  ) {
    throw new AppError(
      "Invalid refresh token",
      401,
      "general"
    );
  }

  return result.payload.sub;
}

export async function authenticate(
  email: string,
  password: string
) {
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    throw new AppError(
      "Email not found!",
      401,
      "email"
    );
  }

  const passwordMatches = await bcrypt.compare(
    password,
    admin.passwordHash
  );

  if (!passwordMatches) {
    throw new AppError(
      "Incorrect password!",
      401,
      "password"
    );
  }

  return admin;
}

export async function requireAdmin() {
  const store = await cookies();

  const token = store.get("access_token")?.value;

  if (!token) {
    throw new AppError(
      "Unauthorized",
      401,
      "general"
    );
  }

  const id = await verifyAccess(token);

  const admin = await prisma.admin.findUnique({
    where: { id },
  });

  if (!admin) {
    throw new AppError(
      "Unauthorized",
      401,
      "general"
    );
  }

  return admin;
}