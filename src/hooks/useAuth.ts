import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";

export function useLogin() {
  const { login } = useAuth();
  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      login(email, password),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useRegister() {
  const { register } = useAuth();
  return useMutation({
    mutationFn: ({ name, email, password }: { name: string; email: string; password: string }) =>
      register(name, email, password),
    onError: (err: Error) => toast.error(err.message),
  });
}

export function useLogout() {
  const { logout } = useAuth();
  const qc = useQueryClient();
  return () => {
    qc.clear();
    logout();
  };
}
