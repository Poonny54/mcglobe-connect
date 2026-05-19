import { createServerClient } from "@supabase/ssr"
import { NextResponse, type NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // getUser() validates the JWT with Supabase — safe for auth checks
  const { data: { user } } = await supabase.auth.getUser()
  const { pathname } = request.nextUrl

  // Unauthenticated: redirect to login
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  const role = (user.user_metadata?.role as string | undefined) ?? "admin"

  // Client user on admin routes → send to client portal
  if (pathname.startsWith("/dashboard") && role === "client") {
    return NextResponse.redirect(new URL("/client", request.url))
  }

  // Admin user on client portal → send to dashboard
  if (pathname.startsWith("/client") && role === "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: ["/dashboard/:path*", "/client/:path*"],
}
