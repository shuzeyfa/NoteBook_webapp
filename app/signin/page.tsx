  "use client";

  import { useState } from "react";
  import { BookOpen, Eye, EyeOff } from "lucide-react";

  import { useForm } from "react-hook-form";
  import { useRouter } from "next/navigation";
  import { zodResolver } from "@hookform/resolvers/zod";

  import {
    signInSchema,
    signUpSchema,
    SignInType,
    SignUpType,
  } from "@/lib/validation";

  export default function AuthPage() {

    const [mode, setMode] = useState<"signin" | "signup">("signup");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [ResponseError, setResponseError] = useState("");

    const {
      register,
      handleSubmit,
      formState: { errors },
    } = useForm<SignUpType | SignInType>({
      resolver: zodResolver(mode === "signin" ? signInSchema : signUpSchema),
    });

    const onSubmit = async (data: any) => {
      try {
        setLoading(true)

        const endpoint =
          mode === "signin" ? "/login" : "/register";

        const payload = {
                email: data.email,
                password: data.password,
              }

        const res = await fetch(
          `https://notebook-backend-2-nl4v.onrender.com${endpoint}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );

        const result = await res.json();
        console.log("RESPONSE:", result);

        if (!res.ok) {
          throw new Error(result.error || "Something went wrong");
        }

        console.log("SUCCESS:", result);
        if (mode === "signup"){
          setMode("signin")
        }else{
          localStorage.setItem("token", result.token)
          router.push("/dashboard")
        }
      } catch (err: any) {
        setResponseError(err.message);
        console.error("ERROR:", err.message);
      } finally {
        setLoading(false)
      }
    };

    return (
      <main className="min-h-screen flex items-center justify-center px-4">

        <div className="w-full max-w-md bg-secondaryColor/70 border border-secondaryColor rounded-2xl p-8 flex flex-col gap-6">

          {/* Logo */}
          <div className="flex items-center justify-center gap-2">
            <div className="w-9 h-9 bg-primaryColor rounded-full flex items-center justify-center">
              <BookOpen className="text-black" width={18} />
            </div>
            <span className="font-bold text-xl">NoteBook</span>
          </div>

          {/* Toggle Buttons */}
          <div className="flex bg-secondaryColor rounded-xl p-2">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                mode === "signin"
                  ? "bg-primaryColor text-black"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                mode === "signup"
                  ? "bg-primaryColor text-black"
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
                  className="bg-secondaryColor border border-secondaryColor rounded-xl px-4 py-3 focus:outline-none focus:border-primaryColor"
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
              className="bg-secondaryColor border border-secondaryColor rounded-xl px-4 py-3 focus:outline-none focus:border-primaryColor"
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
                className="w-full bg-secondaryColor border border-secondaryColor rounded-xl px-4 py-3 pr-10 focus:outline-none focus:border-primaryColor"
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
                  className="bg-secondaryColor border border-secondaryColor rounded-xl px-4 py-3 focus:outline-none focus:border-primaryColor"
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
              disabled={loading}
              className={` ${loading ? "bg-primaryColor/40 cursor-not-allowed rounded-bl-2xl rounded-tr-2xl" : "bg-primaryColor cursor-pointer"} text-black font-medium py-3 rounded-tl-2xl rounded-br-2xl hover:rounded-tr-2xl hover:rounded-bl-2xl transition-all`}
            >
              {loading
                ? "Loading..."
                : mode === "signin"
                ? "Sign In"
                : "Create Account"}
            </button>

            {ResponseError && (
              <p className="text-red-400 text-center text-md">{ResponseError}</p>
            )}

          </form>
        </div>
      </main>
    );
  }