"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Mail, Lock, User } from "lucide-react";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await registerUser(data.name, data.email, data.password);
      toast.success("Account created! Welcome to ShopHub.");
      router.push("/");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed";
      toast.error(message);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-primary font-display">
          Create account
        </h1>
        <p className="text-sm text-on-surface-muted mt-1">
          Join ShopHub and start shopping today
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <Input
          id="name"
          label="Full Name"
          type="text"
          placeholder="John Doe"
          autoComplete="name"
          leftIcon={<User size={16} />}
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          leftIcon={<Mail size={16} />}
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          leftIcon={<Lock size={16} />}
          hint="At least 6 characters"
          error={errors.password?.message}
          {...register("password")}
        />

        <Input
          id="confirmPassword"
          label="Confirm Password"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          leftIcon={<Lock size={16} />}
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />

        <Button
          type="submit"
          fullWidth
          loading={isSubmitting}
          className="mt-2"
        >
          Create Account
        </Button>
      </form>

      <div className="mt-6 text-center border-t border-surface-container pt-6">
        <p className="text-sm text-on-surface-muted">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-secondary hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
