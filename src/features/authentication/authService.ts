
export type UserRole = "end-user" | "zone" | "enterprise";

interface DemoUser {
  email: string;
  password: string;
  role: UserRole;
  name: string;
}

const demoUsers: DemoUser[] = [
  {
    email: "user@mdms.com",
    password: "user123",
    role: "end-user",
    name: "Ananya Rao",
  },
  {
    email: "zone@mdms.com",
    password: "zone123",
    role: "zone",
    name: "Zone Administrator",
  },
  {
    email: "enterprise@mdms.com",
    password: "enterprise123",
    role: "enterprise",
    name: "Enterprise Administrator",
  },
];

export function login(email: string, password: string) {
  const user = demoUsers.find(
    (account) =>
      account.email.toLowerCase() === email.trim().toLowerCase() &&
      account.password === password
  );

  if (!user) {
    return null;
  }

  return {
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
