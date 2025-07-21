"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginSchemas } from "../../schemas";
import z from "zod";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const SignInView = () => {
  const trpc = useTRPC();
  const router = useRouter();
  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onError: (error) => {
        toast.error(error.message);
      },
      onSuccess: () => {
        router.push("/");
      },
    })
  );
  const form = useForm<z.infer<typeof loginSchemas>>({
    resolver: zodResolver(loginSchemas),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof loginSchemas>) => {
    login.mutate(values);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" 
             style={{animation: "blob 7s infinite"}}></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" 
             style={{animation: "blob 7s infinite 2s"}}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" 
             style={{animation: "blob 7s infinite 4s"}}></div>
      </div>

      <div className="relative grid grid-cols-1 lg:grid-cols-5 min-h-screen">
        {/* Left Panel - Form */}
        <div className="lg:col-span-3 overflow-y-auto flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md">
            {/* Enhanced Form Container */}
            <div className="bg-white/40 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="flex flex-col gap-6"
                >
                  {/* Enhanced Header */}
                  <div className="flex items-center justify-between mb-8">
                    <Link href="/">
                      <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
                        FunRoad ✨
                      </span>
                    </Link>
                    <Button
                      asChild
                      size="sm"
                      variant="elevated"
                      className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 text-purple-700 border border-purple-200 rounded-full px-4 py-2 transition-all duration-300 hover:scale-105 shadow-md hover:shadow-lg"
                    >
                      <Link prefetch href="/sign-up">
                        Sign Up
                      </Link>
                    </Button>
                  </div>

                  {/* Enhanced Title */}
                  <div className="text-center mb-8">
                    <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4 leading-tight">
                      🚀 Welcome Back to <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">FunRoad</span>!
                    </h1>
                    <div className="w-20 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mx-auto"></div>
                  </div>

                  {/* Enhanced Email Field */}
                  <FormField
                    name="email"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="text-gray-700 font-semibold text-base flex items-center gap-2">
                          📧 Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              type="email"
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300 transition-all duration-300 hover:bg-white/90 group-hover:border-purple-200"
                              placeholder="your@email.com"
                            />
                            {field.value && (
                              <div className="absolute right-3 top-3 text-green-500">
                                ✅
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Enhanced Password Field */}
                  <FormField
                    name="password"
                    render={({ field }) => (
                      <FormItem className="group">
                        <FormLabel className="text-gray-700 font-semibold text-base flex items-center gap-2">
                          🔒 Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              {...field} 
                              type="password" 
                              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white/70 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-300 transition-all duration-300 hover:bg-white/90 group-hover:border-purple-200"
                              placeholder="Enter your password"
                            />
                            {field.value && (
                              <div className="absolute right-3 top-3 text-green-500">
                                ✅
                              </div>
                            )}
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500 text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* Enhanced Submit Button */}
                  <Button
                    disabled={login.isPending}
                    type="submit"
                    size="lg"
                    variant="elevated"
                    className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:from-purple-700 hover:via-pink-700 hover:to-orange-600 text-white font-semibold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-none relative overflow-hidden group"
                  >
                    <span className={`transition-all duration-300 ${login.isPending ? 'opacity-0' : 'opacity-100'}`}>
                      Welcome Back 🎉
                    </span>
                    {login.isPending && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Signing In...
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-600 via-purple-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </Button>

                  {/* Sign Up Link */}
                  <div className="text-center mt-6 pt-6 border-t border-gray-200">
                    <p className="text-gray-600">
                      Don't have an account?{' '}
                      <Link 
                        href="/sign-up" 
                        className="font-semibold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent hover:from-purple-700 hover:to-pink-700 transition-all duration-300 hover:underline"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>

        {/* Enhanced Right Panel */}
        <div className="lg:col-span-2 hidden lg:flex items-center justify-center p-8">
          <div className="relative">
            <div className="w-96 h-96 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400 rounded-3xl shadow-2xl overflow-hidden">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
                <div className="text-6xl mb-4 animate-bounce">🎉</div>
                <h3 className="text-2xl font-bold mb-4 text-center">Welcome Home</h3>
                <p className="text-center text-lg opacity-90">
                  Continue your amazing journey with FunRoad and unlock new possibilities
                </p>
                <div className="mt-8 flex space-x-4">
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
                  <div className="w-3 h-3 bg-white rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
                </div>
              </div>
            </div>
            {/* Floating elements */}
            <div className="absolute -top-4 -left-4 w-8 h-8 bg-yellow-400 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
            <div className="absolute -bottom-4 -right-4 w-6 h-6 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '2s'}}></div>
            <div className="absolute top-1/2 -left-8 w-4 h-4 bg-blue-400 rounded-full animate-bounce" style={{animationDelay: '3s'}}></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
      `}</style>
    </div>
  );
};