  "use client";

  import { useState } from "react";
  import { BookOpen, Eye, EyeOff } from "lucide-react";

  import { useForm } from "react-hook-form";
  import { zodResolver } from "@hookform/resolvers/zod";

  import {
    signInSchema,
    signUpSchema,
    SignInType,
    SignUpType,
  } from "@/lib/validation";

  export default function AuthPage() {

    const [mode, setMode] = useState<"signin" | "signup">("signin");
    const [showPassword, setShowPassword] = useState(false);

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<SignUpType | SignInType>({
      resolver: zodResolver(mode === "signin" ? signInSchema : signUpSchema),
    });

    const onSubmit = (data: SignInType | SignUpType) => {
      console.log(data);
    };

    return (
      <main className="min-h-screen flex items-center justify-center px-4">

        <div className="w-full max-w-md bg-secondary/70 border border-secondary rounded-2xl p-8 flex flex-col gap-6">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-9 h-9 bg-primary rounded-full flex items-center justify-center">
              <BookOpen className="text-black" width={18} />
            </div>
            <span className="font-bold text-xl">NoteBook</span>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-secondary rounded-xl p-2">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                mode === "signin"
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                mode === "signup"
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >

            {mode === "signup" && (
              <>
                <input
                  {...register("name")}
                  placeholder="Name"
                  className="bg-secondary border border-secondary rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                />
                {(errors as any).name && (
                  <p className="text-red-400 text-sm">{(errors as any).name.message}</p>
                )}
              </>
            )}

            {/* Email */}
            <input
              {...register("email")}
              placeholder="Email"
              className="bg-secondary border border-secondary rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
            />

            {errors.email && (
              <p className="text-red-400 text-sm">{errors.email.message}</p>
            )}

            {/* Password */}
            <div className="relative">
              <input
                {...register("password")}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full bg-secondary border border-secondary rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-primary"
              />

              <button
                type="button"
                onClick={() => setShowPassword((p) => !p)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {errors.password && (
              <p className="text-red-400 text-sm">{errors.password.message}</p>
            )}

            {mode === "signup" && (
              <>
                <input
                  {...register("confirm")}
                  type="password"
                  placeholder="Confirm Password"
                  className="bg-secondary border border-secondary rounded-xl px-4 py-3 focus:outline-none focus:border-primary"
                />

                {(errors as any).confirm && (
                  <p className="text-red-400 text-sm">
                    {(errors as any).confirm.message}
                  </p>
                )}
              </>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="bg-primary text-black font-medium py-3 rounded-tl-2xl rounded-br-2xl hover:rounded-tr-2xl hover:rounded-bl-2xl transition-all"
            >
              {mode === "signin" ? "Sign In" : "Create Account"}
            </button>

          </form>
        </div>
      </main>
    );
  }