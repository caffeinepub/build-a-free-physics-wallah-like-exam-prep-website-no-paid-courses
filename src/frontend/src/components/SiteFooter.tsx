import { Heart } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30 mt-auto">
      <div className="container-custom py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Free Exam Prep</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Complete NEET & JEE preparation platform with free courses, video lectures, and study materials.
            </p>
            <p className="text-sm font-medium text-primary">
              🎓 All courses are 100% free
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Physics Courses</li>
              <li>Chemistry Courses</li>
              <li>Mathematics Courses</li>
              <li>Biology Courses</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-3">Contact</h3>
            <p className="text-sm text-muted-foreground">
              Email: support@examprep.edu<br />
              Help: help@examprep.edu
            </p>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t text-center text-sm text-muted-foreground">
          <p className="flex items-center justify-center gap-1">
            © 2026. Built with <Heart className="h-4 w-4 text-red-500 fill-red-500" /> using{' '}
            <a 
              href="https://caffeine.ai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-2 text-xs">
            Disclaimer: This is an educational platform. All content is for learning purposes only.
          </p>
        </div>
      </div>
    </footer>
  );
}
