import Link from "next/link"
import { Dumbbell } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Dumbbell className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">PRO METHODS</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Transform your body, elevate your life with our comprehensive fitness platform.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/dashboard/workouts" className="hover:text-foreground transition-colors">
                  Workouts
                </Link>
              </li>
              <li>
                <Link href="/dashboard/trainers" className="hover:text-foreground transition-colors">
                  Trainers
                </Link>
              </li>
              <li>
                <Link href="/dashboard/nutrition" className="hover:text-foreground transition-colors">
                  Nutrition
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Programs</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Strength Training
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  HIIT Workouts
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Yoga & Flexibility
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-foreground transition-colors">
                  Nutrition Plans
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4 text-sm text-muted-foreground">
              <li>
                <span className="font-medium text-foreground block mb-1">Located in:</span>
                REAL SQUARE
              </li>
              <li>
                <span className="font-medium text-foreground block mb-1">Address:</span>
                Real square building, Sector 3, Vasundhara, Ghaziabad, Uttar Pradesh 201012
              </li>
              <li>
                <span className="font-medium text-foreground block mb-1">Phone:</span>
                093540 04877
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Pro Methods. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
