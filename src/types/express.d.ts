declare global {
  namespace Express {
    interface Request {
      user?: {
        id: number;
        email: string;
        role: "ADMIN" | "DOCTOR" | "LAB";
        doctorId: number | null;
      };
    }
  }
}

export {};
